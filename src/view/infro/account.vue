<template>
  <Card dis-hover class="page-main" :bordered="false">
    <h2 class="page-title">{{headTitle}}</h2>
    <div class="content account">
      <Form label-position="left" :label-width="180">
        <FormItem class="accountForm" label="账户名称">
          <p class="text">{{ accountData['dev_account'] }}（ID： {{ accountData['id'] }}）</p>
        </FormItem>
        <FormItem class="accountForm" label="公司名称（简称）">
          <p class="text">{{ accountData['company_name'] }}（{{ accountData['company_short_name'] }}）</p>
        </FormItem>
        <FormItem class="accountForm" label="统一社会信用代码">
          <p class="text">{{ accountData['credit_code'] }}</p>
        </FormItem>
        <FormItem class="accountForm" label="营业执照照片">
          <div class="account_img marginTop10" @mouseenter="enter(1)" @mouseleave="leave">
            <img class="imgs" :src='accountData["business_license"]' alt="">
            <div v-show="seen&&1===current" class="account_shade" @click="showImg(accountData['business_license'])">
              <img src="~@/assets/image/open.png" alt="">
            </div>
          </div>
        </FormItem>
        <!-- <FormItem class="accountForm" label="公司法人姓名">
          <p class="text">{{ accountData['legal_person_name'] }}</p>
        </FormItem> -->
        <!-- <FormItem class="accountForm" label="公司法人身份证号">
          <p v-if="accountData['legal_person_code']" class="text">{{ accountData['legal_person_code'] }}</p>
          <p v-else>无</p>
        </FormItem> -->
        <!-- <FormItem class="accountForm" label="公司法人身份证正反面照片">
          <div v-if="accountData['legal_person_card_p'] || accountData['legal_person_card_b']">
          <div  class="card_img" @mouseenter="enter(2)" @mouseleave="leave">
            <img class="imgs" :src='accountData["legal_person_card_p"]' alt="">
            <div v-show="seen&&2===current" class="account_shade" @click="showImg(accountData['legal_person_card_p'])">
              <img src="~@/assets/image/open.png" alt="">
            </div>
          </div>
          <div class="card_img" @mouseenter="enter(3)" @mouseleave="leave">
            <img class="imgs" :src='accountData["legal_person_card_b"]' alt="">
            <div v-show="seen&&3===current" class="account_shade" @click="showImg(accountData['legal_person_card_b'])">
              <img src="~@/assets/image/open.png" alt="">
            </div>
          </div>
          </div>
          <div v-else>无</div>
        </FormItem> -->
        <div class="alert">
          <Icon type="ios-alert-outline" size="18" style=" color:#F13440;font-weight: bold"/>
          <span>为了保证您的账户安全，以上账户信息无法自行修改，若有调整，请联系客服</span>
        </div>
      </Form>
      <div class="rule_con" style="width: 550px;margin-top: 30px">
        <Form label-position="left" ref="ruleForm" :model="accountData" :rules="rules" :label-width="140">
          <FormItem class="accountForm" label="联系人姓名" prop="dev_name">
            <Input v-model.trim="accountData.dev_name" placeholder="请输入联系人姓名" autocomplete="off" maxlength="10"/>
          </FormItem>
          <FormItem class="accountForm" label="联系人电子邮箱" prop="dev_email">
            <label>
              <Input v-model.trim="accountData.dev_email" placeholder="请输入联系人邮箱" autocomplete="off" maxlength="30"/>
            </label>
          </FormItem>
          <FormItem class="accountForm" label="联系地址" prop="address">
            <Row>
              <Col  :span="5">
                <Select prop="province_id" v-model="accountData.province_id" placeholder="请选择"
                        @on-change="provinceChange">
                  <Option v-for="(value,index) in provinceList"
                          :value="value.id"
                          :label="value.name"
                          :key="'contactProvince'+index">{{ value.name }}
                  </Option>
                </Select>
              </Col>
              <Col offset="1"  :span="5">
                <Select prop="city_id" v-model="accountData.city_id" placeholder="请选择">
                  <Option v-for="(value,index) in cityList1"
                          :value="value.id"
                          :key="'contactCity'+index">{{ value.name }}
                  </Option>
                </Select>
              </Col>
              <Col offset="1" :span="12">
                <Input prop="address" v-model.trim="accountData.address" />
              </Col>
            </Row>
          </FormItem>
          <FormItem class="accountForm phone_code" label="联系人手机号码" prop="dev_phone">
            <Input v-model.trim="accountData.dev_phone" maxlength="11" placeholder="请输入联系人手机号码" autocomplete="off"/>
             <!-- <div class="get-code" @click.stop="getCode">
                <span :class="isCodeIng?'codeColor':''">{{codeTxt}}</span>
             </div> -->
          </FormItem>
          <!-- <FormItem class="accountForm" label="验证码" prop="phone_code">
            <Input v-model.trim="accountData.phone_code"  placeholder="请输入验证码" autocomplete="off"/>
          </FormItem> -->

          <FormItem class="account_infro">
            <Button  type="primary" :loading="submitClock" @click="accountSave">
              <span v-if="!submitClock">提交</span>
              <span v-else>提交中...</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <Modal v-model="meterialModal"
           class="native-model native-model1"
           width="500">
      <div class="img_content">
        <img :src="meterialUrl" alt/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </Card>

</template>

<script>
  import { getUserInfo, getUserUpdate} from '@/api/user'
  import {getProvinceApi, getCityApi, geSendPhoneCode} from '@/api/common'
  import {validatePhone} from '@/libs/tools'
  import { showTitle } from '@/libs/util'
  export default {
    name: 'adManage',
    data() {
      return {
        submitClock: false,
        isCodeIng: false,//是否倒计时
        codeTxt: '获取验证码',
        meterialModal: false,
        meterialUrl: '',
        accountData: {},
        provinceList: [],
        cityList1: [],
        seen: false,
        current: '',
        rules: {
          province_id: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          city_id: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          dev_name: [
            {required: true, message: '请输入联系人姓名', trigger: 'blur'},
            {max: 10, message: '长度不超过10', trigger: 'blur'},
          ],
          // phone_code: [
          //   {required: true, message: '请输入验证码', trigger: 'blur'}
          // ],
          dev_email: [
            {required: true, message: '请输入联系人邮箱', trigger: 'blur'},
            {max: 30, message: '长度不超过30', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          //dev_phone: [
          //  {required: true, message: '请输入联系人手机号码', trigger: 'blur'},
          //  {validator: validatePhone,  trigger: 'blur'}
          //],
        }
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    methods: {
      // 获取验证码
      getCode(){
        let phone = this.accountData.dev_phone
        if(!phone){
          this.$Message.error('请输入电话号码')
          return false
        }
        const reg = /^[1][3-9][0-9]{9}$/;
        if((!reg.test(phone)) && phone != ''){
          this.$Message.error('请输入正确的电话号码')
          return false
        }
        if(!this.isCodeIng){
          //获取验证码倒计时
          let time = 60;
          let num = 4
          geSendPhoneCode({
            phone,
            num
          }).then(data => {
            let date = data
            if (date.code === 200) {
              this.isCodeIng = true;
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

    getUserInfoData() {
        getUserInfo({}).then(data => {
          let date = data
          if (date.code === 200) {
            let obj = date.data
            obj.phone_code = ''
            this.accountData = obj
            if (this.accountData.province_id > 0) {
              this.getCityData(this.accountData.province_id)
            }
          }
        })
      },

      // 获取省份
      getProvinceData() {
        getProvinceApi().then(data => {
          let date = data
          if (date.code === 200) {
            this.provinceList = date.data.list
          }
        })
      },
      // 当省份变化时的改变
      provinceChange(val) {
        this.getCityData(val)
      },

      // 根据城市名省市名获取城市名
      getCityData(id) {
        let province_id = id
        getCityApi({
          province_id
        }).then(data => {
          let date = data
          if (date.code === 200) {
            this.cityList1 = date.data.list
          }
        })
      },
      // 账户信息的提交
      accountSave() {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            this.getUserDataUpdate()
            this.submitClock = true
          } else {
            this.$Message.error('请检查表单的填写!')
          }
        })
      },
      // 数据的修改
      getUserDataUpdate() {
        let obj = {}
        obj.dev_name = this.accountData.dev_name
        obj.dev_email = this.accountData.dev_email
        obj.dev_phone = this.accountData.dev_phone
        obj.province_id = this.accountData.province_id
        obj.city_id = this.accountData.city_id
        obj.address = this.accountData.address
        // obj.verification = this.accountData.phone_code
        getUserUpdate(obj).then(data => {
          let userUpdata = data
          this.submitClock = false
          if (userUpdata.code === 200) {
            location.reload()
            this.$Message.success('账号信息修改成功');
          }
        }, err=> {
          this.submitClock = false
        })
      },

      enter(index) {
        this.seen = true
        this.current = index
      },
      leave() {
        this.seen = false
        this.current = null
      },
      showImg(data) {
        this.meterialModal = true
        this.meterialUrl = data
      }
    },
    created() {
      this.getUserInfoData()
      this.getProvinceData()
    }
  }
</script>
<style  lang="stylus">
  .native-model {
    .ivu-modal-footer {
      border 0px;
      padding 0px
    }
  }
</style>

<style lang="stylus" scoped>
  @import './index.stylus';
  .account {
    .accountForm {
      margin-bottom 10px
      color #42444C
      font-size 14px
      /deep/ &.phone_code{
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
      }
    }
    .rule_con{
      .accountForm{
        margin-bottom 25px
      }
      /deep/ .ivu-input{
        height 34px
        line-height 34px
        background: #FAFAFA;
      }
      /deep/ .ivu-select-single .ivu-select-selection{
        height 35px
        line-height 35px
        background: #FAFAFA;
      }
    }
  }
  .native-model {
    .img_content {
      width 400px
      height 400px
      margin 0 auto
      line-height 400px
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-direction: column;
      img {
        text-align center
        max-width 400px
        max-height 400px
      }
    }
  }
    .account_infro{
      button {
        width 120px
        height 40px
        line-height 40px
        padding 0px
      }
    }

  .account_img {
    width 150px
    height 200px
    line-height 200px
    position relative
    text-align center
    background #eff1f5
    overflow hidden
    .imgs {
      max-width 150px
      max-height 200px
      line-height 200px
      vertical-align middle
    }

    .account_shade {
      width 100%;
      height 100%;
      position absolute
      top 0px
      background #000000
      opacity 0.5
      text-align center

      img {
        vertical-align middle
        width 30px
      }
    }
  }

  .card_img {
    margin-top: 10px
    width 150px
    height 100px
    line-height 100px
    display inline-block
    margin-right 20px
    text-align center
    background #eff1f5
    position: relative
    font-size: 0px
    .imgs {
      max-width 100%
      max-height: 100%
      vertical-align middle
    }
    .account_shade {
      width 100%
      height 100%
      position absolute
      top 0px
      background rgba(0,0,0,0.5)
      text-align center
      img {
        vertical-align middle
        width 30px
      }
    }
  }
.marginTop10
  margin-top: 10px
</style>

