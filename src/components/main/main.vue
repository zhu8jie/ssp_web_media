<template>
	<Layout class="app">
		<Header>
			<head-bar></head-bar>
		</Header>
		<Layout class="main-layout">
			<Sider class="left-bar" collapsible :width="140" :collapsed-width="64" v-model="collapsed" :style="{overflow: 'hidden'}">
				<side-menu accordion ref="sideMenu" :active-name="curRouteName()" :collapsed="collapsed" @on-select="turnToPage" theme="light" :menuList="menuList">
				</side-menu>

				<div class="ivu-layout-sider-trigger" slot="trigger" :style="{'width': `${marginLeft}px`}"  @click="toggleCollapsed">
					<i class="iconfont" :class="collapsed ? 'icon-unfold' : 'icon-fold'"></i>
				</div>
			</Sider>
			<Layout class="root-body" :style="{'margin-left': `${marginLeft}px`}">
				<Content class="root-middle" :class="{'root-middle-full' : isFull}">
					<router-view/>
				</Content>
			</Layout>
		</Layout>
	</Layout>
</template>

<script>
import SideMenu from './compontents/side-menu'
import headBar from './compontents/header'
import { localSave, localRead } from '@/libs/util'

export default {
	name: 'Main',
	components: {
		SideMenu,
		headBar
	},
	data() {
		return {
			localName: 'LFET-BAR-COLLAPSE',
			marginLeft: 140, // 左侧距离
			collapsed: false
		}
	},
	computed: {
		menuList() {
			return this.$store.getters.menuList
		},
		isFull() {
			let routerNames = ['finance-index']
			return routerNames.includes(this.$route.name)
		}
	},
	created() {
		let _val = localRead(this.localName)
		this.collapsed = _val === 'true'
		this.marginLeft = _val === 'true' ? 64 : 140
	},
	methods: {
		/**
		 * [curRouteName 路由名称]
		 * @return {[type]} [description]
		 */
		curRouteName() {
			return (this.$route.meta && this.$route.meta.targetHighLight) ? this.$route.meta.targetHighLight : this.$route.name
		},
		/**
		 * @param  {[地址跳转]}
		 * @return {[type]}
		 */
		turnToPage(route) {
			let { name, params, query } = {}

			if (typeof route === 'string') {
				name = route
			} else {
				name = route.name
				params = route.params
				query = route.query
			}

			if (name.indexOf('isTurnByHref_') > -1) {
				window.open(name.split('_')[1])
				return
			}

			this.$router.push({
				name,
				params,
				query
			})
		},
		/**
		 * [toggleCollapsed 展开-收起时的回调]
		 * @param  {[type]} val [true / false]
		 * @return {[type]}     [description]
		 */
		toggleCollapsed(val) {
			this.collapsed = !this.collapsed
			this.marginLeft = this.collapsed ? 64 : 140
			localSave(this.localName, this.collapsed)
		}
	},
	watch: {
		'$route' (newRoute) {
			this.$refs.sideMenu.updateOpenName(newRoute.name)
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.app
	min-width: 1344px
	.left-bar
		position: fixed
		left: 0px
		top: 50px
		bottom: 0px
		background: #FFF
		z-index: 11
		overflow: hidden
	.root-body
		margin-top: 50px
		padding: 10px
		min-height 600px
		transition: all .2s
	.root-middle
		width: 1206px
		margin: 0 auto
	.root-middle-full
		width: 100%
.ivu-layout-sider-trigger
	.iconfont
		color: #333
</style>
