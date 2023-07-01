<template>
	<div class="login">
		
	</div>
</template>
<script>
import { shamLogin } from '@/api/user'
import { mapMutations } from 'vuex'

export default {
	name: 'adminLogin',
	data() {
		return {
			dev_account: !!this.$route.query.dev_account ? decodeURIComponent(this.$route.query.dev_account) : '',
			secret: !!this.$route.query.secret ? this.$route.query.secret : ''
		}
	},
	created() {
		if (!!this.dev_account && !!this.secret) {
			this.toLogin()
		} else {
			this.$router.replace({name: 'login'})
		}
	},
	methods: {
		...mapMutations([
			'setUserName',
			'setUserId'
		]),
		/**
		 * [toLogin 登录]
		 * @return {[type]} [description]
		 */
		async toLogin() {

			const res = await shamLogin({dev_account: this.dev_account, secret: this.secret})
			let _name = ''

			if(res.code === 200)  {
				this.setUserName(this.dev_account)
				this.setUserId(this.secret)
				_name = 'home'
			} else {
				_name = 'login'
			}

			this.$Message.success('正在跳转...')
			setTimeout(() => {
				// 有效期内，跳转到首页
				this.$router.replace({name: _name})
			}, 1500)
		}
	}
}
</script>
<style lang="stylus" scoped>

</style>
