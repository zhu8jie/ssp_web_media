<template>
  <div class="page-main">
    <Card dis-hover :bordered="false">
      <h2 class="page-title">{{headTitle}}</h2>
      <div class="content change">
        <Form ref="passwordRef" :model="passwordData" :rules="rules" :label-width="120">
          <FormItem label="输入密码" prop="passwd">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwd" password/>
          </FormItem>
          <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwdCheck" password/>
          </FormItem>
          <FormItem class="accountForm phone_code" label="手机验证码" prop="verification">
            <Input v-model.trim="passwordData.verification" placeholder="请输入验证码" autocomplete="off"/>
            <div class="get-code" @click.stop="getCode">
              <span :class="isCodeIng?'codeColor':''">{{codeTxt}}</span>
            </div>
            <p v-if="isCodeText" class="ti">向尾号为<span>{{ phone_behind }}</span>的手机发送了验证码，请注意查收</p>
          </FormItem>


          <FormItem class="change_bottom">
            <Button  type="primary" :loading="submitClock" @click="submitPasswd('passwordRef')">
              <span v-if="!submitClock">提交</span>
              <span v-else>提交中...</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import { getUserInfo, getPasswordUpdate} from '@/api/user'
  import { geSendPhoneCode} from '@/api/common'
  import {mapActions, mapMutations} from "vuex";
  export default {
    name: 'appManage',
    data() {
      const validatePassCheck = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.passwordData.passwd) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
      return {
        submitClock: false,
        codeTxt: '获取验证码',
        passwordData: {
          passwd: '',
          passwdCheck: '',
          verification: null
        },
        phone_behind: '',
        isCodeIng:false,
        isCodeText: false,
        phone: null,
        u_id: null,
        rules: {
          passwd: [
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, message: '长度至少6位', trigger: 'blur' },
              {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
          ],
          passwdCheck: [{required: true, validator: validatePassCheck, trigger: 'blur'}],
          verification: [{required: true, message: '请输入验证码', trigger: 'blur'}]
        }
      }
    },
    methods: {
      ...mapActions([
        'logout'
      ]),
      ...mapMutations([
        'setLoginOut'
      ]),
      // 获取本地信息
      getUserInfoData() {
        getUserInfo({}).then(data => {
          let date = data
          if (date.code === 200) {
            this.phone = date.data.dev_phone
            this.phone_behind = this.phone.substr(this.phone.length-4)
            this.u_id = date.data.id
          }
        })
      },
      // 获取验证码
      getCode(){
        let phone = this.phone
        if(!this.isCodeIng){
          //获取验证码倒计时
          let time = 60;
          let num = 3
          geSendPhoneCode({
            phone,
            num
          }).then(data => {
            let date = data
            if (date.code === 200) {
              this.isCodeIng = true;
              this.isCodeText = true;
              let timer = setInterval(()=> {
                time--;
                this.codeTxt =  time + 's';
                if (time <= 0) {
                  this.codeTxt = '获取验证码';
                  this.isCodeIng = false;
                  clearInterval(timer);
                }
              }, 1000);
            }
          })
        }
      },
      // 密码保存
      submitPasswd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitClock = true
            let password = this.passwordData.passwdCheck
            let phone_pwd = this.passwordData.verification
            getPasswordUpdate({
              password,
              phone_pwd
            }).then(data => {
              let date = data
              this.submitClock = false
              if (date.code === 200) {
                this.$Message.success('密码修改成功')
                this.logout().then(res=> {
                  if(res.code === 200) {
                    this.setLoginOut(); // 清除
                    this.$router.replace({name: 'login'})
                  } else {
                    this.$Message.error({content: res.msg, duration: 3})
                  }
                })
              }
            }, err=> {
              this.submitClock = false
            })
          }
        })
      }
    },
    created() {
      this.getUserInfoData()
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import './index.stylus';
    .change {
      width 390px
      /deep/ .ivu-input{
        height 34px
        line-height 34px
        background: #FAFAFA;
        .ivu-input-suffix i{
          font-size 18px
        }
      }
      /deep/ .phone_code{
        position relative
        .get-code{
          position absolute
          right:12px
          top 0px
          font-size 14px
          color #4083F8
          cursor pointer
          .codeColor{
            color: #999999
          }
        }
        .ti{
          position absolute
          top:0px
          right -320px
          span{
            color: #4083F8
          }
        }
      }
    }

    .change_bottom {
      button {
        width 120px
        height 35px
        line-height 35px
      }
  }
</style>
