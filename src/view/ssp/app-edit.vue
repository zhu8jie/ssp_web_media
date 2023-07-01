<template>
	<div class="page-main">
		<Card dis-hover v-if="userInfo" :bordered="false">
			<h2 class="page-title">{{app_id ? '编辑应用' : '新建应用'}}</h2>
			<div class="edit-content-card">
				<Form :model="formBase" :label-colon="true" label-position="right" :label-width="280" :rules="ruleBase" ref="formBase">
					<!-- sdk权限：{{hasSdkPer}}
					<br>
					api权限：{{hasApiPer}} -->
					<FormItem label="选择应用平台和应用商店" class="ivu-form-item-required">
						<FormItem prop="os_type" style="display: inline-block; width: 120px">
							<Select :disabled="resolveNoEdit || auditWaitAndRefuse" v-model="formBase.os_type" placeholder="应用平台" @on-change="_getStore" data-tag="resetAccessType">
								如果该媒体的账号权限只给了sdk，那么在选择应用平台时，不可以选择ios平台
								<Option :disabled="hasSdkPer && !hasApiPer && item.id === 2" v-for="item in osTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<!-- <FormItem prop="app_store_id" style="display: inline-block; width: 120px">
							<Select :disabled="resolveNoEdit" v-model="formBase.app_store_id" placeholder="应用商店">
								<Option v-for="item in appStoreList" :value="item.id" :key="item.id">{{ item.name }}</Option>
							</Select>
						</FormItem>
						<FormItem prop="store_detail_url" style="display: inline-block; width: 260px">
							<Input :disabled="resolveNoEdit" style="width: 260px" maxlength="200" placeholder="应用商店详情页地址" v-model.trim="formBase.store_detail_url"></Input>
						</FormItem> -->
					</FormItem>
					<!-- <FormItem label="填写应用商店下载地址">
						<Input style="width: 508px" maxlength="200" placeholder="可直接下载app的地址" v-model.trim="formBase.store_download_url"></Input>
					</FormItem> -->
					<FormItem label="填写应用名称" prop="app_name">
						<Input style="width: 508px" :disabled="resolveNoEdit" maxlength="30" show-word-limit placeholder="请填写与应用商店一致的应用名称" v-model.trim="formBase.app_name"></Input>
					</FormItem>
					<!-- <FormItem label="选择应用类型" prop="app_type_one">
						<Select style="width: 251px" v-model="formBase.app_type_one" placeholder="应用类型" @on-change="appTypeOneChange">
							<Option v-for="item in industryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
						</Select>
						<Select style="width: 251px" v-model="formBase.app_type_two" placeholder="应用类别">
							<Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
						</Select>
					</FormItem> -->
					<FormItem label="填写应用关键字" prop="keyword">
						<Input style="width: 508px" maxlength="60" show-word-limit placeholder="多个关键词请用英文逗号隔开" v-model.trim="formBase.keyword"></Input>
					</FormItem>
					<FormItem label="填写应用简介" prop="desc">
						<Input style="width: 508px" maxlength="200" :rows=5 show-word-limit placeholder="准确的简介能够提升广告的匹配度和收益" type="textarea" v-model.trim="formBase.desc"></Input>
					</FormItem>
					<FormItem label="填写应用包名" prop="package_name">
						<Input :disabled="resolveNoEdit" style="width: 508px" placeholder="填写包名必须与广告请求的包名一致，否则影响收益" maxlength="50" v-model.trim="formBase.package_name"></Input>
						<p class="upload-img-format-tips">我们验证包名的唯一性，请求时只验证主包名</p>
					</FormItem>
					<FormItem label="选择接入方式" prop="access_type">
						<!-- {{formBase.access_type}} -->
						<RadioGroup class="private-check-card" type="button" v-model="formBase.access_type">
							<!-- 如果应用平台选择ios，接入方式只能选择api -->
							<Radio :disabled="resolveNoEdit || (formBase.os_type == 2 && item.id == 2) || item.value === -1" v-for="item in access_type_select" :label="item.id" :key="item.id">{{ item.name }}</Radio>
						</RadioGroup>
					</FormItem>
					<!-- 选择sdk时，展示第三方sdk选项 -->
					<FormItem v-show="formBase.access_type == 2 && !sdkOnlyTuiaHide" label="选择接入第三方SDK">
						<!-- 2020.9.27 注释： 只要选择了sdk， 隐藏则默认选择 交互通 -->
						<CheckboxGroup class="private-check-card" v-model="formBase.app_platform_id">
							<Checkbox v-for="item in platform3rdListSelect" :label="item.id" :key="item.id" border>{{item.name}}</Checkbox>
							<!-- v-show="item.id !== 3" -->
						</CheckboxGroup>
						<p class="upload-img-format-tips">若取消某方SDK，将不再下发对应广告</p>
					</FormItem>
					 <!-- <FormItem label="上传应用Icon" prop="icon">
						<upload-image :idVal="1" field="icp_url" :size="1" v-model="formBase.icon" :widthVal="150" :heightVal="150">
							<Icon type="md-add" size="24"/>
							<p>点击上传</p>
						</upload-image>
						<p class="upload-img-format-tips">（支持格式仅限jpg、jpeg、png,大小1M以内)</p>
					</FormItem> -->
					<!-- <FormItem label="上传计算机软件著作权登记证书" prop="copyright_img">
						<upload-image :idVal="2" field="icp_url" :disEdit="resolveNoEdit" :size="5" v-model="formBase.copyright_img" :widthVal="150" :heightVal="150">
							<Icon type="md-add" size="24"/>
							<p>点击上传</p>
						</upload-image>
						<p class="upload-img-format-tips">（支持格式仅限jpg、jpeg、png,大小5M以内)</p>
					</FormItem> -->
					<!-- <FormItem label="上传公司关联关系及媒体授权证明">
						<upload-image :idVal="3" field="icp_url"  :disEdit="resolveNoEdit" :size="5" v-model="formBase.authorization_img" :widthVal="150" :heightVal="150">
							<Icon type="md-add" size="24"/>
							<p>点击上传</p>
						</upload-image>
						<p class="upload-img-format-tips">（支持格式仅限jpg、jpeg、png,大小5M以内)</p>
					</FormItem> -->

					<!-- <FormItem v-if="formBase.os_type" label="填写带有广告展示的应用商店及下载地址" class="choose-store" prop="app_check_store">
						<div class="child-item" v-for="(item, index) in formBase.app_check_store" :key="index" >
							<Select style="width: 120px" v-model="item.id" placeholder="应用商店">
								<Option v-for="child in appStoreList" :value="child.id" :key="child.id">{{ child.name }}</Option>
							</Select>
							<Input style="width: 382px" placeholder="应用商店详情页地址" v-model.trim="item.value"></Input>
						</div>
					</FormItem> -->

					<FormItem label="应用受众用户特征信息" prop="user_character">
						<div class="dau-flex" style="margin-bottom: 10px">
							<div class="dau-child">
								<p>日活用户数量(DAU):</p>
								<div class="dau-num-inner">
									<InputNumber :max="99999" :min="0" style="width: 160px" v-model="formBase.app_dau"></InputNumber>
									<span class="num-label">万人</span>
								</div>
							</div>
							<!-- <div class="dau-child">
								<p>男女用户占比：</p>
								<div class="dau-num-inner">
									<InputNumber :max="100" :min="0" :step="1" :precision="0" style="width: 150px" v-model="formBase.app_male_rate"></InputNumber>
									：
									<InputNumber :max="100" :min="0" :step="1" :precision="0" style="width: 150px" v-model="formBase.app_female_rate"></InputNumber>
								</div>
							</div> -->
						</div>
						<!-- <div class="dau-flex">
							<div class="dau-child">
								<p>用户年龄层:</p>
								<Input style="width: 508px" placeholder="例如20-30岁" v-model="formBase.user_age_group"></Input>
							</div>
						</div> -->
					</FormItem>
					<!-- <FormItem label="应用用户特征">
						<Input style="width: 508px" length="500" placeholder="例如：年轻用户居多，活跃度高" v-model="formBase.user_character"></Input>
					</FormItem> -->
					<FormItem label="适合预算类型">
						<Input style="width: 508px" length="500" placeholder="例如：下载、电商" v-model="formBase.fit_budget_type"></Input>
					</FormItem>
					<FormItem label="不可投放类型" prop="no_put_type">
						<Input style="width: 508px" maxlength="500" :disabled="resolveNoEdit" placeholder="例如：竞品" v-model="formBase.no_put_type"></Input>
					</FormItem>
					<FormItem v-if="!idErrorNoEdit" class="edit-save-formItem">
						<Button  size="large" @click="goBack">取消</Button>
						<Button size="large" type="primary" :loading="submitClock" @click="submitFormData('formBase')">
							{{!submitClock ? '提交' : '提交中...'}}
						</Button>
					</FormItem>
				</Form>
			</div>
		</Card>
		<BackTop></BackTop>
	</div>
</template>

<script>
import { commonMixin } from '@/mixin/basic-common-class.js'
import { saveAppDetail, getAppDetail } from '@/api/ssp.js'
import { getAppIndustry } from '@/api/common.js'
import { formRules } from './app-edit-rules.js' // 正则校验
import { mapActions } from 'vuex'
import uploadImage from '_c/upload-image'

export default {
	name: 'appEdit',
	mixins: [commonMixin, formRules],
	data() {
		return {
			app_id: this.$route.query.id || null,
			userInfo: '', // 获取个人信息

			hasSdkPer: false, // 是否有sdk权限
			hasApiPer: false, // 是否有API权限
			access_type_select: [], // 选择接入方式
			sdkOnlyTuiaHide: false, // 第三方sdk，如果只有交互通，则隐藏
			platform3rdListSelect: [], // 第三方sdk勾选情况
			backPlatform3rd: [], // 第三方SDK, 用于提交时判断是否修改，如果修改则触发修改审核中

			formBase: {
				os_type: '', // 应用平台
				app_store_id: '', // 应用商店ID
				store_detail_url: '', // 应用商店详情地址
				store_download_url: '', // 商店下载地址
				app_name: '', // 应用名称
				app_type_one: '', // 应用所属行业一级分类ID
				app_type_two: '', // 应用所属行业二级分类ID
				keyword: '', // 应用关键字，英文逗号分隔
				desc: '', // 应用简介
				package_name: '', // 应用包名
				access_type: '', // 接入方式
				app_platform_id: [], // 第三方SDK
				icon: '', // 上传应用icon地址
				copyright_img: '', // 上传计算机软件著作权登记证书
				authorization_img: '', // 上传公司关联关系及媒体授权证明
				app_check_store: [{id: '', value: ''}, {id: '', value: ''}, {id: '', value: ''}], // 应用商店确认 key是商店ID，value是商店地址
				app_dau: 0, // 日活用户数，单位（万人）
				app_male_rate: 0, // 应用男性用户占比
				app_female_rate: 0, // 应用女性用户占比
				no_put_type: '' // 不可投放类型
			},
			submitClock: false, // 保存锁
			resolveNoEdit: false, // 有效, 修改审核中, 封禁
			auditWaitAndRefuse: false, // 待审核和已拒绝，不可编辑应用平台
			idErrorNoEdit: false, // 随意修改url的id, 导致错误情况，不显示保存按钮
			appStoreList: [], // 应用商店列表数据
			industryList: [], // 选择应用类型
			categoryList: [] // 选择应用类别
		}
	},
	components: {
		uploadImage
	},
	created() {
		this._getAppIndustry()
		this.getUserInfo()

		if (!!this.app_id) {
			this.getAppDetail()
		}
	},
	methods: {
		...mapActions(['getAppStore', 'getUserInfo']),
		/**
		 * [getUserInfo 获取个人信息]
		 * @return {[type]} [description]
		 */
		async getUserInfo() {
			this.userInfo = !!this.$store.state.user.userInfo ? this.$store.state.user.userInfo : await this.$store.dispatch('getUserInfo')

			let { access_type_select, sdk_on_off_select } = this.userInfo

			// 获取媒体的权限
			let _arr = []
			access_type_select.map(item => {
				// API权限
				if (item.id === 1 && item.value === 1) {
					this.hasApiPer = true
				}
				// SDK权限
				if (item.id === 2 && item.value === 1) {
					this.hasSdkPer = true
				}

				if (item.value === 1) {
					_arr.push(item)
				}
			})

			// 第三方sdk只选择了推啊 则隐藏
			let isOnlyTuia = sdk_on_off_select.filter(item => {
				return item.value === 1 && item.id !== 3
			})

			this.sdkOnlyTuiaHide = isOnlyTuia.length === 0

			// 筛选接入第三方SDK，只有后台的勾选才能显示
			let sdkArr = sdk_on_off_select.filter(item => {
				return item.value === 1
			})

			this.platform3rdListSelect = sdkArr
			this.access_type_select = _arr
		},
		/**
		 * [getAppDetail 获取应用详情]
		 * @return {[type]} [description]
		 */
		async getAppDetail() {
			this.$Spin.show()
			let res = await getAppDetail({app_id: this.app_id})
			this.$Spin.hide()

			let _data = res.data

			if (res.code === 200) {

				// 初始化有广告展示的应用商店及下载地址
				let addArr = [{id: '', value: ''}, {id: '', value: ''}, {id: '', value: ''}]

				if (!_data.app_check_store || _data.app_check_store.length === 0) {
					_data.app_check_store = addArr
				} else {
					_data.app_check_store = [..._data.app_check_store, ...addArr.slice(_data.app_check_store.length)]
				}

				// 防止恶意串改app_id，导致无数据情况
				this.idErrorNoEdit = !!this.app_id && this.app_id !== _data.app_id

				this.resolveNoEdit = _data.status === 1 || _data.status === 2 || _data.status === 5 // 有效, 修改审核中, 封禁

				// 待审核或已拒绝，不可编辑应用平台
				this.auditWaitAndRefuse = _data.status === 3 || _data.status === 4

				this.formBase = _data
				this.backPlatform3rd = _data.app_platform_id

				this._getStore() // 获取appstroe数据

				if (!!_data.app_type_one) {
					this._getAppIndustry(_data.app_type_one)
				}
			}
		},
		/**
		 * [submitSet 提交表单]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		submitFormData(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {

					let form = {...this.formBase}

					// 提交内容需要格式化处理
					
					// 1-pre, 因为后台可能减少第三方sdk选项，所以先处理数据
					let lastPlat3rd = []
					this.platform3rdListSelect.map(item => {
						if (!!item.id) {
							lastPlat3rd.push(item.id)
						}
					})

					// 1. 只有选择sdk， 格式化成{id: 1, value: 1/-1}
					// 修改： 2020.9.27，只要选择了sdk，默认就会有交互通
					let _arr = []
					this.platform3rdList.map(item => {
						let _obj = {id: item.id, value: -1}

						// 1. 只有选择sdk， 格式化成{id: 1, value: 1/-1}
						// 修改： 2020.9.27，只要选择了sdk，默认就会有交互通
						if (form.access_type == 2) {
							// 1: 前者处理已选择id,   2后者处理：管理平台变化了第三方sdk || id = 3 交互通默认勾选 
							if ((form.app_platform_id.indexOf(item.id) > -1 && lastPlat3rd.indexOf(item.id) > -1)) {
								_obj['value'] = 1
								_arr.push(_obj)
							} else {
								_arr.push(_obj)
							}
						} else {
							// 选择api时 ， 清空第三方sdk
							_arr.push(_obj)
						}
					})
					form.app_platform_id = _arr

					// 2.格式化处理广告展示的应用商店及下载地址 
					let appCheckArr = []
					form.app_check_store.map(item => {
						if (!!item.id && !!item.value) {
							appCheckArr.push(item)
						}
					})
					form.app_check_store = appCheckArr

					// 3. 提交审核状态
					// 3.1 如果已拒绝，再次提交时，触发待审核
					if (form.status === 4) {
						form.status = 3
					}

					// 3.2 如果已通过，并且接入方式为sdk, 但是修改第三方sdk，触发修改审核中
					if (form.status === 1 && form.access_type == 2 && this.formBase.app_platform_id !== this.backPlatform3rd) {
						form.status = 2
					}

					this.submitClock = true

					saveAppDetail(form).then(res => {
						this.submitClock = false
						if (res.code === 200) {
							this.$Message.success({content: form.app_id ? '修改成功' : '保存成功', duration: 3})
							this.goBack()
						}
					}, err => {
						this.submitClock = false
					})
				}
			})
		},
		/**
		 * [appTypeOneChange 类型一发生变化时]
		 * @return {[type]} [description]
		 */
		appTypeOneChange(value) {
			this.formBase.app_type_two = ''
			this._getAppIndustry(value)
		},
		/**
		 * [_etAppIndustry 获取应用类型]
		 * @return {[type]} [description]
		 */
		async _getAppIndustry(id) {
			let res = await getAppIndustry({parent_id: id})

			if (res.code === 200) {
				if (!!id) {
					this.categoryList = res.data.list || [] // 类别 2
				} else {
					this.industryList = res.data.list || [] // 类型 1
				}
			}
		},
		/**
		 * [_getStore 获取应用商店]
		 * @return {[type]} [description]
		 */
		async _getStore(el) {
			if (!this.formBase.os_type) {
				return
			}

			// 更换应用平台 需要清空 接入方式 (创建的情况下)
			if (!this.app_id) {
				this.formBase.access_type = ''
			}

			let res = await this.$store.dispatch('getAppStore', {os_type: this.formBase.os_type})

			if (res.code === 200) {
				this.appStoreList = res.data.list || []
			}
		},
		/**
		 * [goBack 返回上一页]
		 * @return {[type]} [description]
		 */
		goBack() {
			this.$router.push({name: 'app-manage'})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-title
	font-size: 16px
.dau-flex
	display: flex
	width: 508px
	justify-content: space-between
	p
		padding-top: 6px
		font-size: 14px
		line-height: 20px
		margin-bottom: 10px
	.dau-num-inner
		position: relative
		.num-label
			position: absolute
			right: 30px
			top: 0px
			height: 32px
			line-height: 32px
.choose-store
	.child-item
		margin-bottom: 10px
</style>
