<template>
  <div class="detail">
     <p class="detail_header">
       <span class="title" v-if="access_type === '1'">API版本更新日志</span>
       <span class="title" v-else-if="access_type === '2'">Android SDK版本更新日志</span>
       <span class="title" v-else >IOS SDK版本更新日志</span>
       <a href="/access/manage">返回 ></a>
     </p>
    <div class="content">
      <div class="log_list" v-for="(item,index) in access_list" :key="'access_list'+index">
          <div class="log_header">
            <span>版本：{{item.doc_version}}</span> <span>{{item.updated_at | timeFormat('yyyy-MM-dd') }}</span>
          </div>
         <div class="log_content">
           <ul>
             <li v-for="(it,i) in item.logList" :key="'logList'+index+i">{{i+1}}.  {{it}}</li>
            </ul>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getAccessLogList} from '@/api/common'
import {formatDate} from '@/libs/tools'
export default {
    name: 'dataRevenue',
    data() {
        return {
            access_type: null,
            access_list: []
        }
    },
    methods: {
        getLogList() {
            let access_type = Number(this.access_type)
            getAccessLogList({
                access_type
            }).then(res => {
                if (res.code === 200) {
                    let data = res.data.list
                    if (data.length > 0) {
                        let list = data.map(item => {
                            let log = item.log.split(/[(\r\n)\r\n]+/)
                            item.logList = log
                            return item
                        })
                        this.access_list = list
                    }
                }
            })
        }
    },
    filters: {
        timeFormat(time, format) {
            return formatDate(time * 1000, format)
        }
    },
    created() {
        this.access_type = this.$route.params && this.$route.params.access_type
        this.getLogList()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .detail {
    background #FFFFff
    padding 20px
    .detail_header{
      display flex
      justify-content space-between
      .title {
        font-size 16px
        color #343434
        font-weight bold
      }
    }
    .content{
      margin-top 20px
      display flex
      flex-wrap wrap
      .log_list{
        width 500px
        height 230px
        margin 20px
        background: #FCFCFC;
        border: 1px solid #F3F5F7
        .log_header{
          height: 30px;
          line-height 30px;
          background: #F3F5F7;
          display flex
          justify-content space-between
          color #41434B
          font-size 14px
          padding 0 15px
        }
        .log_content{
          margin-top 20px
          height 180px
          overflow auto
          ul{
            li{
              line-height 35px
              padding-left 20px
              color #41434B
              font-size 14px
            }
          }
        }
      }
    }
  }
</style>
