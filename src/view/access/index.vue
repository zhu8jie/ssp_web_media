<template>
    <div class="detail">
        <p class="title">接入中心</p>
        <div class="content">
          <div class="join_header">
            <RadioGroup class="private-check-card" type="button" v-model="active">
              <Radio v-show="!SDKstatus"  label="SDK">SDK接入</Radio>
              <Radio v-show="!APIstatus" label="API">API接入</Radio>
            </RadioGroup>
          </div>
          <div class="join_content">
            <div class="join_det" v-show="active==='API' && !APIstatus">
              <Card class="join_card" dis-hover :bordered="false" v-show="apiList.id">
                <div slot="title" style="width: 100%">
                  <p class="card_header"><img src="~@/assets/image/join_api.png" alt=""><span>API接入文档</span></p>
                  <p class="card_des"><span>最新版本：{{apiList.doc_version}}</span> <span>更新时间：{{apiList.updated_at | timeFormat('yyyy-MM-dd') }}</span></p>
                </div>
                <ul class="card_list">
                  <li v-for="(it,index) in apiList.logList" :key="'androidList'+index">{{it}}</li>
                </ul>
                <a class="card_see" href="/access/log/1">查看更多日志 ></a>
                <div class="card_operate">
                  <Button type="primary">
                    <a style="color: #FFFFff" :href='apiList.doc_url' target="_blank" download="API接入文档.pdf">下载接入文档</a>
                    </Button>
                </div>
              </Card>
            </div>
            <div class="join_det" v-show="active==='SDK' && !SDKstatus">
              <Card class="join_card" dis-hover :bordered="false" v-show="androidList.id">
                <div slot="title">
                  <p class="card_header"><img src="~@/assets/image/join_Android.png" alt=""><span>Android SDK</span></p>
                  <p class="card_des"><span>最新版本：{{androidList.doc_version}}</span> <span>更新时间：{{androidList.updated_at | timeFormat('yyyy-MM-dd') }}</span></p>
                </div>
                <ul class="card_list">
                  <li v-for="(it,index) in androidList.logList" :key="'androidList'+index">{{it}}</li>
                </ul>
                <a class="card_see" href="/access/log/2">查看更多日志 ></a>
                <div class="card_operate">
                  <Button>
                    <a style="color: #3F83F7" :href='androidList.doc_url' target="_blank" download="Android接入文档.pdf">下载接入文档</a>
                  </Button>
                  <Button type="primary" v-show="androidList.sdk_url">
                    <a style="color: #FFFFff"  :href='androidList.sdk_url' target="_blank" download>下载</a>
                  </Button>
                </div>
              </Card>
              <Card class="join_card" dis-hover v-show="iosList.id">
                <div slot="title">
                  <p class="card_header"><img src="~@/assets/image/join_ios.png" alt=""><span>IOS SDK</span></p>
                  <p class="card_des"><span>最新版本：{{iosList.doc_version}}</span> <span>更新时间：{{iosList.updated_at | timeFormat('yyyy-MM-dd')}}</span></p>
                </div>
                <ul class="card_list">
                  <li v-for="(it,index) in iosList.logList" :key="'ios'+index">{{it}}</li>
                </ul>
                <a class="card_see" href="/access/log/3">查看更多日志 ></a>
                <div class="card_operate">
                  <Button>
                    <a style="color: #3F83F7" :href='iosList.doc_url' target="_blank" download="IOS接入文档.pdf">下载接入文档</a>
                  </Button>
                  <Button type="primary" v-show="iosList.sdk_url">
                    <a style="color: #FFFFff"  :href='iosList.sdk_url' target="_blank" download>下载</a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
          <div>

          </div>
        </div>
    </div>
</template>

<script>
import {getConfigInfoApi, getAccessList} from '@/api/common'
import {formatDate} from '@/libs/tools'
export default {
    name: 'dataRevenue',
    data() {
        return {
            active: 'SDK',
            APIstatus: true,
            SDKstatus: true,
            ud_id: null,
            androidList: {},
            iosList: {},
            apiList: {}
        }
    },
    filters: {
        timeFormat(time, format) {
            return formatDate(time * 1000, format)
        }
    },
    methods: {
        configData() {
            let ud_id = parseInt(this.ud_id)
            getConfigInfoApi({ud_id}).then(res => {
                if (res.code === 200) {
                    let access_type = res.data.access_type_select
                    if (access_type[0].value === 1 && access_type[1].value === 1) {
                        this.active = 'SDK'
                        this.APIstatus = false
                        this.SDKstatus = false
                    } else {
                        if (access_type[0].value === 1) {
                            if (access_type[0].name === 'API') {
                                this.APIstatus = false
                                this.active = 'API'
                            } else if (access_type[0].name === 'SDK') {
                                this.SDKstatus = false
                                this.active = 'SDK'
                            }
                        }
                        if (access_type[1].value === 1) {
                            if (access_type[1].name === 'API') {
                                this.APIstatus = false
                                this.active = 'API'
                            } else if (access_type[1].name === 'SDK') {
                                this.SDKstatus = false
                                this.active = 'SDK'
                            }
                        }
                    }
                }
            })
        },
        getAccessListData() {
            getAccessList().then(res => {
                if (res.code === 200) {
                    let data = res.data.list
                    if (data.length > 0) {
                        data.map(item => {
                            let log = item.log.split(/[(\r\n)\r\n]+/)
                            item.logList = log
                            item.access_type === 1 ? this.apiList = item : item.access_type === 2 ? this.androidList = item : this.iosList = item
                            return item
                        })
                    }
                }
            })
        }
    },
    created() {
        this.ud_id = this.$store.state.user.userId
        this.configData()
        this.getAccessListData()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
   .detail{
     background #FFFFff
     padding 30px
     .title{
       font-size 16px
       color #343434
       font-weight bold
     }
     .content{
       .join_header{
         margin-top 25px
         font-size 0
         border-bottom 1px solid  #F0F0F0
         .private-check-card .ivu-radio-wrapper{
           display inline-block
           height 35px
           width 100px
           color #333333
           font-size 14px
           line-height 35px
           text-align center
           cursor pointer
           border-radius 0
         }
         .ivu-radio-group-button .ivu-radio-wrapper-checked{
           color #3F83F7
         }

       }
       .join_content{
         margin-top 10px
         .join_det{
           display flex
           flex-wrap wrap
           .join_card{
             width 500px;
             margin 20px 20px 20px 0px
             background: #F9F9F9;
             border: 1px solid #EFEFEF;
             .card_header{
               width 100%
               height 50px
               line-height 50px
               color #41434B
               img{
                  vertical-align middle
               }
               span{
                 vertical-align middle
                 font-size 18px
                 margin-left 10px
               }
             }
             .card_des{
               display flex
               justify-content space-between
               color #999999
               font-size 12px
             }
             .card_list{
               font-size 14px
               margin 0 20px
               height 180px;
               overflow auto
               li{
                 color: #41434B;
                 line-height: 30px;
                 list-style: inside;
               }
             }
             .card_see{
                display inline-block
                padding-top 10px
                padding-left 5px
             }
             .card_operate{
               margin 20px 0 10px
               display flex
               justify-content space-between
               button{
                 height 40px
                 line-height 40px
                 width: 192px;
                 padding 0px
                 a{
                   display inline-block
                   width 192px;
                   height 40px
                   line-height 40px
                 }
               }
             }

           }
         }
       }
     }

   }

</style>
