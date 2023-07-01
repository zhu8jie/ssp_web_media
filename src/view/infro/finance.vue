<template>
  <Card dis-hover class="page-main" :bordered="false">
    <h2 class="page-title">{{headTitle}}</h2>
    <div class="content finance">
      <Form label-position="left" :label-width="85">
        <FormItem class="financeForm" label="收款方">
          <p class="text">{{financeDate['company_name'] }}</p>
        </FormItem>
        <FormItem class="financeForm" label="开户行">
          <p class="text">{{financeDate['bank_type_name']}} {{financeDate['bank_province'] }}{{financeDate['bank_city'] }}{{ financeDate['bank_address'] }}</p>
        </FormItem>
        <FormItem class="financeForm" label="银行账号">
          <p class="text">{{ financeDate['bank_id_card'] }}</p>
        </FormItem>
      </Form>
      <div class="alert">
        <Icon type="ios-alert-outline" size="18" style=" color:#F13440;font-weight: bold"/>
        <span>为了保证您的资金安全，财务信息无法自行修改，若有调整，请联系客服</span>
      </div>
    </div>
  </Card>
</template>

<script>
  import {getFinanceInfoApi} from '@/api/user'
  import {showTitle} from '@/libs/util'

  export default {
    name: 'adManage',
    data() {
      return {
        financeDate: []
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    methods: {
      getFinanceInfoData() {
        getFinanceInfoApi({}).then(data => {
          let date = data
          if (date.code === 200) {
            this.financeDate = date.data
          }
        })
      }
    },
    created() {
      this.getFinanceInfoData()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
    .finance {
      .ivu-form-item-label {

        text-align left
      }
      .ivu-form-item{
        margin-bottom 10px
      }
  }
</style>
<style lang="stylus" scoped>
  @import './index.stylus';
  .finance{
    .financeForm{
      color #42444C
      font-size 14px
      margin-bottom 10px
    }
  }

</style>
