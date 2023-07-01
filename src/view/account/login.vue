<template>
	<div class="login">
		<div class="login_content">
			<div class="login_left">
				<img src="~@/assets/image/bg_left1.jpg" alt="">
			</div>
			<div class="login_right">
				<div class="title">
					<img src="~@/assets/image/login_logo.png" alt="">
					<p>Hi~ 欢迎回到数字欢喜</p>
				</div>
				<Form ref="loginForm" :model="form" :rules="rules" style="margin-top: 24px">
					<FormItem prop="dev_account" class="form_con">
						<icon class="icon icon-account"/>
						<Input class="input-class"
							:maxlength="30"
							v-model.trim="form.dev_account"
							@keyup.enter.native="handleSum('loginForm')"
							placeholder="账户名称/手机号"/>
					</FormItem>
					<FormItem prop="password" class="form_con">
						<icon class="icon icon-psw"/>
						<Input class="input-class"
							type="password"
							password
							:maxlength="20"
							v-model.trim="form.password"
							@keyup.enter.native="handleSum('loginForm')"
							placeholder="密码"/>
					</FormItem>
					<FormItem prop="captcha" class="form_con">
						<icon class="icon icon-shield"/>
						<Input class="input-code"
							type="text"
							v-model.trim="form.captcha"
							:maxlength="4" @keyup.enter.native="handleSum('loginForm')"
							placeholder="验证码" />
						<img @click="regain" style="vertical-align: middle;width:100px;height: 40px" :src="codeImg" alt="">
					</FormItem>
					<FormItem  class="login_save">
						<Button @click="handleSum('loginForm')">登录</Button>
					</FormItem>
					<FormItem  class="login_reg">
						<p>还没有账号？去 <a href="/account/reg" class="reg_text">注册 ></a></p>
					</FormItem>
				</Form>
			</div>
		</div>
	</div>
</template>
<script>
	import {getLogin, getCode} from '@/api/user'
	import {mapActions} from 'vuex'
	import { debounce } from '@/libs/tools'

	export default {
		name: 'login',
		data() {
			return {
            	tag: this.$route.query.tag || '', // url中的tag
				form: {
					dev_account: '',
					password: '',
					captcha: ''
				},
				codeImg: '',
				image_key: '',
				rules: {
					dev_account: [{
						required: true,
						message: '账户不能为空',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '密码不能为空',
						trigger: 'blur'
					}],
					captcha: [{
						required: true,
						message: '验证码不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		created() {
			// 因为总出现请求接口401过期，到登陆页面，但是检测到session并没过期，
			// 所以此处做强制处理，如果是接口拦截器过来不要校验session
			if (this.tag === 'pass') {
				this.resetInit()
			} else {
				this.initMain() // 首先判断是否登录时效
			}
		},
		methods: {
			...mapActions([
				'getUserInfo'
			]),

			/**
			 * [initMain 修改登录方法]
			 * @return {[type]} [description]
			 */
			initMain() {
				this.$Spin.show()

				this.getUserInfo().then(res => {

					this.$Spin.hide()

					if (!!res) {
						this.$Message.success('已登录，正在跳转...')
						this.toHome() // 有效期内，跳转到首页
					} else {
						this.$Spin.hide()
						this.resetInit()
					}
				})
			},
			/**
			 * [resetInit 重新获取进入]
			 * @return {[type]} [description]
			 */
			resetInit() {
				this.getCaptchaCode() // 已过期，重新获取验证码
			},
			/**
			 * [description]
			 * @param  {[type]} )[点击图片重新获取验证码]
			 * @return {[type]}   [description]
			 */
			regain: debounce(function() {
				this.getCaptchaCode()
			}),
			/**
			 * [getCaptchaCode 获取验证码]
			 * @return {[type]} [description]
			 */
			async getCaptchaCode() {
				let res = await getCode()
				if (res.code === 200) {
					this.codeImg = res.data.image_base64
					this.image_key = res.data.image_key
				}
			},
			/**
			 * [handleSum 必填信息校验]
			 * @param  {[type]} name [description]
			 * @return {[type]}      [description]
			 */
			handleSum(name) {
				this.$refs[name].validate((valid) => {
					if (valid) {
						this.toLogin()
					}
				})
			},
			/**
			 * [toHome 跳转到首页]
			 * @return {[type]} [description]
			 */
			toHome() {
				setTimeout(() => {
					this.$router.replace({name: 'home'})
				}, 1500)
			},
			/**
			 * [toLogin 登录]
			 * @return {[type]} [description]
			 */
			async toLogin() {
				let {dev_account, password, captcha} = this.form
				let image_key = this.image_key

				let res = await getLogin({dev_account, password, captcha, image_key}) // 登录

				if (res.code === 200) {
					this.getUserInfo().then(() => {
						this.$Message.success('登录成功')
						this.$router.replace({name: 'home'})
					})
				} else {
					this.form.code = ''
					this.getCaptchaCode()
				}
			}

		}
	}
</script>
<style lang="stylus">
	.login_right {
		.ivu-input:focus { /*去除选中后样式*/
			outline: none;
			border: none;
			box-shadow: 0 0 0 2px transparent;
		}
		.ivu-input {
			border-width: 0px !important
		}
		.ivu-form-item-error-tip {
			padding-left 30px
		}

	}
</style>
<style lang="stylus" scoped>
	@import './login.styl';
	/deep/ .ivu-input::-webkit-input-placeholder{
		color:#99999;
	}
	/deep/ .ivu-input::-moz-placeholder{   /* Mozilla Firefox 19+ */
		color:#99999;
	}
	/deep/ .ivu-input::-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
		color:#99999;
	}
	/deep/ .ivu-input::-ms-input-placeholder{  /* Internet Explorer 10-11 */
		color:#99999;
	}
	/deep/  .ivu-input-suffix i{
		font-size 20px
		color #999999
	}
</style>
