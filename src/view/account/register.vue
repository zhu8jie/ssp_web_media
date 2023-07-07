<template>
  <div class="layout" style="background: #FFFFff">
    <div class="header">
      <div class="left">
        <img src="~@/assets/image/login_logo.png" alt="">
        <span>数字欢喜</span>
      </div>
      <div class="text">申请开发者账号</div>
      <div class="right">已有账号，直接 <a href="/account/login">登录 ></a></div>
    </div>
    <div class="fixation">
      <div class="schedule">
        <div :class="active===0?'sch_left':'sch_left active'">
          <p>
            <i class="icon icon-ID" :style="active===0?'color:#fff':'color:#9498a3'"/>
            <span>账号信息</span>
          </p>
          <img class="success" v-if="active===1" src="~@/assets/image/dui.png" alt="">
        </div>
        <div :class="active===0?'sch_right':'sch_right active'">
          <p>
            <i class="icon icon-money" :style="active===1?'color:#fff':'color:#9498a3'"/>
            <span>财务信息</span>
          </p>
        </div>
      </div>
    </div>
    <div class="content" v-show="active===0">
      <div class="detail">
        <div class="step1" >
          <Form ref="step1Ref" :model="ruleForm" :rules="rules" :label-width="192">
            <FormItem label="账户名称" prop="dev_account">
              <Input v-model.trim="ruleForm.dev_account" placeholder="请输入账号名称" autocomplete="off" maxlength="30"/>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input type="password" password v-model.trim="ruleForm.password" minlength="6" maxlength="20" placeholder="请输入您的密码" autocomplete="off"/>
            </FormItem>
            <FormItem label="公司主体名称" prop="company_name">
              <Input v-model.trim="ruleForm.company_name" placeholder="请输入公司主体名称" autocomplete="off" maxlength="30"/>
            </FormItem>
            <FormItem label="公司对外简称" prop="company_short_name">
              <Input v-model.trim="ruleForm.company_short_name" placeholder="请输入公司对外简称" autocomplete="off" maxlength="20"/>
            </FormItem>
            <FormItem label="统一社会信用代码" prop="credit_code">
              <Input v-model.trim="ruleForm.credit_code" placeholder="请填写正确的社会信用代码" autocomplete="off"/>
            </FormItem>
            <FormItem label="营业执照照片" prop="business_license">
              <upload-image field="icp_url" v-model="ruleForm.business_license" :widthVal="200" :heightVal="200" :idVal="1">
                <div><Icon type="md-add" size="24"/>
                  <p>点击上传</p>
                </div>
              </upload-image>
              <p class="upload_des">营业执照照片或彩色扫描件,格式：jpg，大小不大于2M</p>
            </FormItem>
            <!-- <FormItem label="公司法人姓名" prop="legal_person_name">
              <Input v-model.trim="ruleForm.legal_person_name" placeholder="请输入公司法人姓名" autocomplete="off" maxlength="30"/>
            </FormItem> -->
            <!-- <FormItem label="公司法人身份证号" prop="legal_person_code">
              <Input v-model.trim="ruleForm.legal_person_code" placeholder="请输入公司法人身份证号" autocomplete="off"/>
            </FormItem> -->
            <!-- <FormItem label="公司法人身份证正反面照片" prop="legal_person_card_p">
              <div style="display: flex;justify-content: space-between">
                <upload-image  v-model="ruleForm.legal_person_card_p" :widthVal="215" :heightVal="150" :idVal="2">
                  <div class="upload_text">
                    <div class="imgs">
                      <img src="~@/assets/image/card1.png" alt="">
                      <img class="icons" src="~@/assets/image/upload_icon.png" alt="">
                    </div>
                    <p>上传身份证头像面</p>
                  </div>
                </upload-image>
                <upload-image field="icp_url" v-model="ruleForm.legal_person_card_b" :widthVal="215" :heightVal="150" :idVal="3">
                  <div class="upload_text">
                    <div class="imgs">
                      <img src="~@/assets/image/card2.png" alt="">
                      <img class="icons" src="~@/assets/image/upload_icon.png" alt="">
                    </div>
                    <p>上传身份证国徽面</p>
                  </div>
                </upload-image>
              </div>
              <p class="upload_des">照片或彩色扫描件，格式：jpg，大小：不大于2M</p>
            </FormItem> -->
            <!-- <FormItem label="产品名单" prop="product_list">
              <Input v-model.trim="ruleForm.product_list" placeholder="填写多个产品名单时用英文逗号隔开" maxlength="50"/>
            </FormItem> -->
            <FormItem label="联系地址" prop="address">
              <Row>
                <Col :span="5">
                  <Select prop="province_id" v-model="ruleForm.province_id" placeholder="请选择"
                          @on-change="provinceChange">
                    <Option v-for="(value,index) in provinceList"
                            :value="value.id"
                            :label="value.name"
                            :key="'contactProvince'+index">{{ value.name }}
                    </Option>
                  </Select>
                </Col>
                <Col offset="1" :span="5">
                  <Select prop="city_id" v-model="ruleForm.city_id" placeholder="请选择">
                    <Option v-for="(value,index) in cityList1"
                            :value="value.id"
                            :key="'contactCity'+index">{{ value.name }}
                    </Option>
                  </Select>
                </Col>
                <Col offset="1" :span="12">
                  <Input prop="address" v-model.trim="ruleForm.address" autocomplete="off"/>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="联系人姓名" prop="dev_name">
              <Input v-model.trim="ruleForm.dev_name" placeholder="请输入联系人姓名" autocomplete="off" maxlength="10"/>
            </FormItem>
            <FormItem label="联系人电子邮箱" prop="dev_email">
              <label>
                <Input v-model.trim="ruleForm.dev_email" placeholder="请输入联系人邮箱" autocomplete="off" maxlength="30"/>
              </label>
            </FormItem>
            <FormItem class="res-bottom">
              <Button type="primary" @click="toStep('step1Ref')">下一步</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="content" style="height: calc(100vh - 180px)" v-show="active===1">
       <div class="detail">
         <div class="step1">
           <Form ref="formCustom" :model="ruleForm" :rules="rules1" :label-width="130">
             <FormItem label="收款方">
               <Input v-model="ruleForm.company_name" readonly/>
             </FormItem>
             <FormItem label="开户行" prop="bank_name">
               <Input type="text" v-model.trim="ruleForm.bank_name" placeholder="请输入开户行名称"/>
<!--               <Select v-model="ruleForm.bank_type_id" placeholder="请选择">-->
<!--                 <Option v-for="(value,index) in BankTypeList"-->
<!--                         :value="value.id"-->
<!--                         :key="'bank_name'+index">{{ value.name }}-->
<!--                 </Option>-->
<!--               </Select>-->
             </FormItem>
             <FormItem label="开户行所在地" prop="bank_city_id">
               <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col :span="11">
                   <Select prop="bank_province_id" v-model="ruleForm.bank_province_id" placeholder="请选择"
                           @on-change="provinceChange">
                     <Option v-for="(value,index) in provinceList"
                             :value="value.id"
                             :label="value.name"
                             :key="'bankProvince'+index">{{ value.name }}
                     </Option>
                   </Select>
                 </Col>
                 <Col :span="11">
                   <Select prop="bank_city_id" v-model="ruleForm.bank_city_id" placeholder="请选择">
                     <Option v-for="(value,index) in cityList2"
                             :value="value.id"
                             :key="'bankCity'+index">{{ value.name }}
                     </Option>
                   </Select>
                 </Col>
               </Row>
             </FormItem>
             <FormItem label="支行名称" prop="bank_address">
               <Input type="text" v-model.trim="ruleForm.bank_address" placeholder="请输入支行名称"/>
             </FormItem>
             <FormItem label="银行账号" prop="bank_id_card">
               <Input v-model.trim="ruleForm.bank_id_card" placeholder="请和银行卡上的信息完相同" autocomplete="off"/>
             </FormItem>
             <!-- <p style="margin: 20px 0">信息验证</p> -->
             <!-- <FormItem class="accountForm phone_code" label="联系人手机号码" prop="dev_phone">
               <Input v-model.trim="ruleForm.dev_phone" maxlength="11" placeholder="请输入联系人手机号码" autocomplete="off"/>
               <div class="get-code" @click="getCodeData">
                 <span :class="isCodeIng?'codeColor':''">{{codeTxt}}</span>
               </div>
             </FormItem> -->
             <!-- <FormItem class="accountForm" label="验证码" prop="verification">
               <Input v-model.trim="ruleForm.verification"  placeholder="请输入验证码" autocomplete="off"/>
             </FormItem> -->
             <FormItem>
               <Checkbox v-model="checked">
                 <a href="/account/developer" target="_blank">阅读并同意《开发者协议》</a>
               </Checkbox>
             </FormItem>

             <FormItem class="reg_operating">
               <Button @click="active=0">上一步</Button>
               <Button  type="primary" :loading="submitClock" @click="save">
                 <span v-if="!submitClock">提交</span>
                 <span v-else>提交中...</span>
               </Button>
             </FormItem>
           </Form>
         </div>
       </div>
    </div>
  </div>
</template>

<script>
import { getRegister } from '@/api/user'
import {getProvinceApi, getCityApi, getBankTypeApi, getBankNameApi, geSendPhoneCode} from '@/api/common'
import {validatePhone, validateIdNo, validateCreditCode} from '@/libs/tools'
import axios from '@/libs/api.request'
import uploadImage from '@/components/upload-image'
export default {
    name: 'register',
    components: { uploadImage },
    data() {
        return {
            submitClock: false, // 保存锁
            isCodeIng: false,
            codeTxt: '获取验证码',
            uploadImgModel: false,
            card_loading1: false,
            card_loading2: false,
            uploadImgUrl: '',
            source_id: [],
            batchUrl: '',
            cardA: [],
            cardB: [],
            img_loading: false,
            active: 0,
            checked: false,
            provinceList: [],
            cityList1: [],
            cityList2: [],
            BankTypeList: [],
            bankNameList: [],
            ruleForm: {
                dev_account: '', // 账号名称
                password: '', // 密码
                company_name: '', // 公司主体名称 收款方
                company_short_name: '', // 公司对外简称
                credit_code: '', // 统一社会信用代码
                business_license: '', // 营业执照照片地址
                // legal_person_name: '', // 公司法人姓名
                // legal_person_code: '', // 公司法人身份证号
                // legal_person_card_p: '', // 公司法人身份证正面照片
                // legal_person_card_b: '', // 公司法人身份证反面照片
                // product_list: '', // 产品名单
                province_id: 0, // 省份ID
                city_id: 0, // 城市ID
                address: '', // 联系地址
                dev_name: '', // 联系人姓名
                dev_email: '', // 联系人邮箱
                // dev_phone: '', // 联系人手机号码
                // verification: '', // 手机验证码
                // bank_type_id: '', // 开户行类型
                bank_name: '', // 开户行名称
                bank_province_id: 0, // 开户行省份
                bank_city_id: 0, // 开户行城市
                bank_address: '', // 支行名称
                bank_id_card: '' // 银行账号
            },
            rules: {
                dev_account: [
                    {required: true, message: '请输入账户名称', trigger: 'blur'},
                    {max: 30, message: '长度不超过30', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '长度必须在6~20之间', trigger: 'blur'}
                ],
                company_name: [
                    {required: true, message: '请输入公司主体名称', trigger: 'blur'},
                    {max: 30, message: '长度不超过30', trigger: 'blur'}
                ],
                // company_short_name: [
                //     {required: true, message: '请输入公司对外简称', trigger: 'blur'},
                //     {max: 20, message: '长度不超过20', trigger: 'blur'}
                // ],
                // credit_code: [
                //     {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                //     {validator: validateCreditCode, trigger: 'blur'}
                // ],
                // business_license: [
                //     {required: true, message: '请上传营业执照', trigger: 'blur'}
                // ],
                // legal_person_name: [
                //     {required: true, message: '请输入公司法人姓名', trigger: 'blur'},
                //     {max: 30, message: '长度不超过30', trigger: 'blur'}
                // ],
                // legal_person_code: [
                //     {validator: validateIdNo, trigger: 'blur'}
                // ],
                // product_list: [
                //     {required: true, message: '请输入产品名单', trigger: 'blur'},
                //     {max: 50, message: '长度不超过50', trigger: 'blur'}
                // ],
                // province_id: [
                //     {required: true, message: '请输入联系地址', trigger: 'blur'}
                // ],
                // city_id: [
                //     {required: true, message: '请输入联系地址', trigger: 'blur'}
                // ],
                // address: [
                //     {required: true, message: '请输入联系地址', trigger: 'blur'}
                // ],
                // dev_name: [
                //     {required: true, message: '请输入联系人姓名', trigger: 'blur'},
                //     {max: 10, message: '长度不超过10', trigger: 'blur'}
                // ],
                // dev_email: [
                //     {required: true, message: '请输入联系人邮箱', trigger: 'blur'},
                //     {max: 30, message: '长度不超过30', trigger: 'blur'},
                //     {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
                // ]
                // legal_person_card_p: [
                //   {required: true, message: '请上传身份证照片', trigger: 'blur'}
                // ]
            },
            rules1: {
                // bank_name: [
                //     {required: true, message: '请填写开户行'}
                // ],
                // bank_province_id: [
                //     { type: 'number', required: true, message: '请选择开户行所在地', trigger: 'blur'}
                // ],
                // bank_city_id: [
                //     { type: 'number', required: true, message: '请选择开户行所在地', trigger: 'blur'}
                // ],
                // bank_address: [
                //     {required: true, message: '请输入支行名称', trigger: 'blur'}
                // ],
                // bank_id_card: [
                //     {required: true, message: '请输入银行账号', trigger: 'blur'}
                // ],
                // dev_phone: [
                //    {required: true, message: '请输入联系人手机号码', trigger: 'blur'},
                //    {validator: validatePhone, trigger: 'blur'}
                // ],
                // verification: [
                //     {required: true, message: '请输入验证码', trigger: 'blur'}
                // ]
            }
        }
    },
    methods: {

        // 获取验证码
        getCodeData() {
            let phone = this.ruleForm.dev_phone
            if (!phone) {
                this.$Message.error('请输入电话号码')
                return false
            }
            const reg = /^[1][3-9][0-9]{9}$/
            if ((!reg.test(phone)) && phone != '') {
                this.$Message.error('请输入正确的电话号码')
                return false
            }
            if (!this.isCodeIng) {
                // 获取验证码倒计时
                let time = 60
                let num = 2
                geSendPhoneCode({
                    phone,
                    num
                }).then(data => {
                    let date = data
                    if (date.code === 200) {
                        this.isCodeIng = true
                        let timer = setInterval(() => {
                            time--
                            this.codeTxt = time + 's'
                            if (time <= 0) {
                                this.codeTxt = '获取验证码'
                                this.isCodeIng = false
                                clearInterval(timer)
                            }
                        }, 1000)
                    }
                })
            }
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
        // 获取获取银行类型数据
        getBankTypeData() {
            getBankTypeApi().then(data => {
                let date = data
                if (date.code === 200) {
                    this.BankTypeList = date.data.list
                }
            })
        },
        // 当省份变化时的改变
        provinceChange(val) {
            this.getCityData(val, this.active)
        },

        // 根据城市名省市名获取城市名
        getCityData(id, type) {
            let province_id = id
            getCityApi({
                province_id
            }).then(data => {
                let date = data
                if (date.code === 200) {
                    if (type === 1) {
                        this.cityList2 = date.data.list
                    } else {
                        this.cityList1 = date.data.list
                        console.log(this.cityList2)
                    }
                }
            })
        },
        // 点击下一步
        toStep(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.active = 1
                    document.body.scrollTop = document.documentElement.scrollTop = 0
                } else {
                    this.$Message.error('请检查表单的填写')
                }
            })
        },
        // 点击注册
        save() {
            if (!this.checked) {
                this.$Message.error('请同意并勾选开发者协议')
                return false
            }
            this.$refs['formCustom'].validate((valid) => {
                if (valid) {
                    this.submitClock = true
                    this.getSaveData()
                } else {
                    this.$Message.error('请检查表单的填写!')
                }
            })
        },
        // 数据的提交
        getSaveData() {
            let registerData = this.ruleForm
            getRegister(registerData).then(data => {
                let register = data
                this.submitClock = false
                if (register.code === 200) {
                    this.$Modal.success({
                        title: '您的账户注册成功，请联系客服激活账户，激活后可登录平台开展业务',
                        content: '<p></p>',
                        onOk: () => {
                            this.$router.push(`/account/login`)
                        }
                    })
                }
            }, err => {
                this.submitClock = false
            })
        }
    },

    created() {
        this.getProvinceData()
        this.getBankTypeData()
    }
}
</script>
<style lang="stylus" scoped>
  @import './register.styl';
  .phone_code{
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
  /deep/ .content{
    .step1 {
      .ivu-input {
        background: #FAFAFA;
        height: 34px;
        border: 1px solid #EFEFEF;
        border-radius 0px
        &:hover{
          border-color #3F83F7
        }
      }
      .ivu-select-selection {
        background: #FAFAFA;
        border: 1px solid #F0F0F0;
        height 34px
        border-radius 0px
        &:hover{
          border-color #3F83F7
        }
      }
      .ivu-select-single {
        height 34px
        line-height 34px
      }
      .ivu-upload {
        text-align center
      }
      .ivu-upload-drag {
        width 100%
        height 100%
        background transparent
        border 0px;
      }
    }
  }
  /deep/  .ivu-input-suffix i{
    font-size 20px
  }
  .native-model
    .img_content {
      width 400px
      height 400px
      margin 0 auto
      text-align center
      line-height 400px

      img {
        text-align center
        max-width 400px
        max-height 400px
        vertical-align middle
      }
    }
</style>
