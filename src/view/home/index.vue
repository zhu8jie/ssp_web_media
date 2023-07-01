<template>
    <div class="home">
      <div v-if="homeBase" class="clearfix">
          <div class="account-card-box">
            <Card class="account-card" :bordered="false" dis-hover :padding="0">
              <h3>欢迎，{{homeBase.company_name}}</h3>
                <p>账户ID：{{homeBase.id}}</p>
                <div class="handle-flex">
                  <Button type="primary" @click="toLink('app-edit')"><i class="iconfont icon-plus"></i>新建应用</Button>
                  <Button type="primary" @click="toLink('ad-edit')"><i class="iconfont icon-plus"></i>新建广告位</Button>
                  <Button type="primary" ghost  @click="toLink('revenue')"><i class="iconfont icon-close-eye"></i></Icon>查看数据收益</Button>
                </div>
            </Card>
          </div>
	        <div class="home-column">
	        	<Card :bordered="false" dis-hover class="earn-card" :padding="0">
		            <p>昨日预估收益 (元)</p>
		            <div class="m-number">{{homeBase.income_yesterday_int}}.<span>{{homeBase.income_yesterday_float}}</span></div>
		        </Card>
		        <Card :bordered="false" dis-hover class="earn-card earn-card-mar" :padding="0">
		            <p>最近7日收益 (元)</p>
		            <div class="m-number">{{homeBase.income_day7_int}}.<span>{{homeBase.income_day30_float}}</span></div>
		        </Card>
	        </div>
	        <div class="home-column">
	        	<Card :bordered="false" dis-hover class="earn-card" :padding="0">
		            <p>最近30日收益 (元)</p>
		            <div class="m-number">{{homeBase.income_day30_int}}.<span>{{homeBase.income_day30_float}}</span></div>
		        </Card>
		        <Card :bordered="false" dis-hover class="earn-card earn-card-mar" :padding="0">
		            <p>总收益 (元)</p>
		            <div class="m-number">{{homeBase.income_total_int}}.<span>{{homeBase.income_total_float}}</span></div>
		        </Card>
	        </div>
	    </div>
	    <Card class="mon-card" dis-hover :bordered="false">
        <div class="echarts_title">
          <span class="title_header">数据趋势</span>
        </div>
        <div class="echatrs_select">
          <div class="select_data">
            <div style="display:inline-block;margin-right: 25px">
              <DatePicker
                :transfer="true"
                :value="search_time"
                format="yyyy-MM-dd"
                type="daterange"
                :options="options1"
                style="width: 200px"
                @on-change="filterByDate"
              />
            </div>
            <div style="display: inline-block">
              <CheckboxGroup size="small" class="echarts_check" v-model="echartsData" @on-change="checkChange">
                <Checkbox class="select1" label="广告展现">
                  <span>广告展现</span>
                </Checkbox>
                <Checkbox class="select2" label="广告点击">
                  <span >广告点击</span>
                </Checkbox>
                <Checkbox class="select3" label="千次展现收益">
                  <span>千次展现收益</span>
                </Checkbox>
                <Checkbox  class="select4" label="单次点击收益">
                  <span>单次点击收益</span>
                </Checkbox>
                <Checkbox  class="select5" label="预估收益">
                  <span>预估收益</span>
                </Checkbox>
                <Checkbox class="select6" label="点击率">
                  <span>点击率</span>
                </Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
        <div v-show="echartsStatus === 1" class="no_data">
             <p><img src="~@/assets/image/noDatas.png" alt=""></p>
             <p class="no_text">暂无数据</p>
        </div>
        <div v-show="echartsStatus === 2" id="dataTrend" class="echart-content"></div>
        </Card>
    </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import { mapActions } from 'vuex'
import { getHomeDevInfo, getHomeLine } from '@/api/home'
import { geYesterdayRead } from '@/api/common'
import { monetFormat, formatDate } from '@/libs/tools'

export default {
    name: 'home',
    data() {
        return {
            echartsStatus: 2,
            yesterday_can_read: false,
            options1: {
                disabledDate: date => {
                    if (this.yesterday_can_read) {
                        let disableData = Date.parse(new Date('2020-09-27 0:0:0'))
                        return date.valueOf() > Date.now() - 86400000 || date.valueOf() < disableData
                    } else {
                        let disableData = Date.parse(new Date('2020-09-27 0:0:0'))
                        return date.valueOf() > Date.now() - 86400000 * 2 || date.valueOf() < disableData
                    }
                },
                shortcuts: [
                    {
                        text: '最近七天',
                        value: data => {
                            let end = new Date()
                            let start = new Date()
                            let disableData = Date.parse(new Date('2020-09-27 0:0:0'))
                            if (this.yesterday_can_read) {
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                                end.setTime(end.getTime() - 3600 * 1000 * 24)
                            } else {
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
                                end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
                            }
                            if (start < disableData) {
                                start = new Date(disableData)
                            }
                            return [start, end]
                        }
                    },
                    {
                        text: '最近30天',
                        value: data => {
                            let end = new Date()
                            let start = new Date()
                            let disableData = Date.parse(new Date('2020-09-27 0:0:0'))
                            if (this.yesterday_can_read) {
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                                end.setTime(end.getTime() - 3600 * 1000 * 24)
                            } else {
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
                                end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
                            }
                            if (start < disableData) {
                                start = new Date(disableData)
                            }
                            return [start, end]
                        }
                    }
                ]
            },
            homeBase: null, // 首页基本数据
            search_time: '',
            search: {
                start_date: '',
                end_date: ''
            },
            echartsData: ['广告展现', '预估收益'],
            lineData: {
                cpc: [],
                ctr: [],
                date: [],
                ecpm: [],
                sum_click: [],
                sum_show: [],
                sum_spend: []
            },
            myChart: null
        }
    },
    created() {
        this.geYesterdayReadStatus()
    },
    methods: {
        // 获取昨天的数据可以选择
        geYesterdayReadStatus() {
            geYesterdayRead().then(data => {
                if (data.code === 200) {
                    this.yesterday_can_read = data.data.yesterday_can_read
                    this.getTimeData()
                    this.getHomeDevInfo()
                    this.gainLineData()
                }
            })
        },
        // 赋值时间的默认值
        getTimeData() {
            let end = new Date()
            let start = new Date()
            let disableData = Date.parse(new Date('2020-09-27 0:0:0'))
            if (this.yesterday_can_read) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                end.setTime(end.getTime() - 3600 * 1000 * 24)
            } else {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
                end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
            }
            if (start < disableData) {
                start = new Date(disableData)
            }
            this.search_time = [start, end]
            this.search.start_date = this.getLocalTime(start.getTime())
            this.search.end_date = this.getLocalTime(end.getTime())
        },
        getLocalTime(tt) {
            let date = new Date(tt)
            let Y = date.getFullYear()
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
            let data = Y + '-' + M + '-' + D
            return data
        },
    	/**
    	 * [getHomeDevInfo 获取首页基本数据]
    	 * @return {[type]} [description]
    	 */
    	async getHomeDevInfo() {
    		let res = await getHomeDevInfo()
    		if (res.code === 200) {
    			let _data = res.data
    			// 金钱格式化
    			let _arr = ['income_total', 'income_day7', 'income_day30', 'income_yesterday']
    			_arr.map(item => {
    				_data[item + '_int'] = monetFormat(parseInt(_data[item]), 0, '.', ',')
    				_data[item + '_float'] = _data[item].toFixed(2).split('.')[1]
    			})

    			this.homeBase = _data
    		}
    	},
        // 改变时间控件是的图像
        filterByDate(e) {
            this.search.start_date = e[0]
            this.search.end_date = e[1]
            if (e[0]) {
                this.gainLineData()
            }
        },
        /**
       * [getHomeLine 获取线状图数据]
       * @return {[type]} [description]
       */
        gainLineData() {
            let data = this.search
            getHomeLine(data).then(data => {
                if (data.code === 200) {
                    let list = data.data.list
                    if (list.length > 0) {
                        let ctr = []
                        let cpc = []
                        let date = []
                        let ecpm = []
                        let sum_click = []
                        let sum_show = []
                        let sum_spend = []
                        Object.keys(list).forEach(k => {
                            ctr.push(list[k].ctr)
                            cpc.push(list[k].cpc)
                            date.push(list[k].date)
                            ecpm.push(list[k].ecpm)
                            sum_click.push(list[k].sum_click)
                            sum_show.push(list[k].sum_show)
                            sum_spend.push(list[k].sum_spend)
                        })
                        this.lineData.ctr = ctr
                        this.lineData.cpc = cpc
                        this.lineData.date = date
                        this.lineData.ecpm = ecpm
                        this.lineData.sum_click = sum_click
                        this.lineData.sum_show = sum_show
                        this.lineData.sum_spend = sum_spend
                        this.initMoniter()
                        this.echartsStatus = 2
                    } else {
                        this.echartsStatus = 1
                    }
                }
            })
        },
        // 切换的时候图像的变化
        checkChange(data) {
            const selectArr = this.myChart.getOption().legend[0].data
            if (data.length > 2) {
                data.splice(0, 1)
            }
            let xuanY = []
            let obj = {}
            Object.keys(selectArr).forEach(k => {
                obj[selectArr[k]] = false
            })
            Object.keys([...data]).forEach(j => {
                var index = selectArr.indexOf(data[j])
                if (index >= 0) {
                    xuanY.push(index)
                    obj[selectArr[index]] = true
                }
            })
            this.option.legend.selected = obj
            if (xuanY.length === 2) {
                this.option.yAxis[xuanY[0]].position = 'right'
                this.option.yAxis[xuanY[1]].position = 'left'
                this.option.yAxis[xuanY[1]].splitLine.show = false
                this.option.yAxis[xuanY[0]].splitLine.show = true
            } else if (xuanY.length === 1) {
                this.option.yAxis[xuanY[0]].position = 'left'
                this.option.yAxis[xuanY[0]].splitLine.show = true
            }
            this.myChart.setOption(this.option)
        },
        // echarts图像的修改以及使用
        initMoniter() {
            this.myChart = echarts.init(document.getElementById('dataTrend'))
            // 绘制图表
            this.option = {
                color: ['#009DF9', '#439599', '#4BAF4F', '#EAAE2F', '#6C55E3', '#E7556E'],
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: '#ffffff', // 设置背景图片 rgba格式
                    boxShadow: '0px 0px 9px 0px ;',
                    borderRadius: 4,
                    padding: 15,
                    extraCssText: 'box-shadow: 0 0 9px rgba(0, 0, 0, 0.1);',
                    textStyle: {
                        color: '#333333',
                        fontSize: 12
                    },
                    transitionDuration: 0,
                    formatter: function(params) {
                        // 系列
                        let html = '<p style="padding-bottom:10px;border-bottom: 1px solid #E5E5E5;margin-bottom: 10px">' + params[0].name + '</p>'

                        for (var i = 0; i < params.length; i++) {
                            // 获取每个系列对应的颜色值
                            html += '<p style="line-height: 25px"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color + ';"></span>'
                            html += params[i].seriesName + ': ' + params[i].value + '</p>'
                        }
                        return html
                    }
                },
                legend: {
                    show: false,
                    data: ['广告展现', '广告点击', '千次展现收益', '单次点击收益', '预估收益', '点击率']
                },
                grid: {
                    left: '9%',
                    right: '9%',
                    bottom: '7%',
                    top: '3%'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.lineData.date,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#F1F3F3',
                            type: 'solid'
                        }
                    },
                    axisLabel: {// x轴文字的配置
                        show: true,
                        textStyle: {
                            color: '#656565'
                        }
                    }
                },
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#009DF9'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#439599'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '￥{value}',
                            textStyle: {
                                color: '#4BAF4F'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '￥{value}',
                            textStyle: {
                                color: '#EAAE2F'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '￥{value}',
                            textStyle: {
                                color: '#6C55E3'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    },
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%',
                            textStyle: {
                                color: '#E7556E'
                            }
                        },
                        axisLine: {show: false},
                        axisTick: {
                            show: false
                        },
                        splitLine: {// 分割线配置
                            show: true,
                            lineStyle: {
                                color: '#F1F3F3',
                                type: 'solid'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '广告展现',
                        type: 'line',
                        data: this.lineData.sum_show
                    },
                    {
                        name: '广告点击',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.lineData.sum_click
                    },
                    {
                        name: '千次展现收益',
                        type: 'line',
                        yAxisIndex: 2,
                        data: this.lineData.ecpm
                    },
                    {
                        name: '单次点击收益',
                        type: 'line',
                        yAxisIndex: 3,
                        data: this.lineData.cpc
                    },
                    {
                        name: '预估收益',
                        type: 'line',
                        yAxisIndex: 4,
                        data: this.lineData.sum_spend
                    },
                    {
                        name: '点击率',
                        type: 'line',
                        yAxisIndex: 5,
                        data: this.lineData.ctr
                    }
                ]
            }
            let selectArr = this.option.legend.data
            let xuanY = []
            let obj = {}
            Object.keys(selectArr).forEach(k => {
                obj[selectArr[k]] = false
            })
            Object.keys([...this.echartsData]).forEach(j => {
                var index = selectArr.indexOf(this.echartsData[j])
                if (index >= 0) {
                    xuanY.push(index)
                    obj[selectArr[index]] = true
                }
            })
            this.option.legend.selected = obj
            if (xuanY.length === 2) {
                this.option.yAxis[xuanY[0]].position = 'right'
                this.option.yAxis[xuanY[1]].position = 'left'
                this.option.yAxis[xuanY[1]].splitLine.show = false
                this.option.yAxis[xuanY[0]].splitLine.show = true
            } else if (xuanY.length === 1) {
                this.option.yAxis[xuanY[0]].position = 'left'
                this.option.yAxis[xuanY[0]].splitLine.show = true
            }
            this.myChart.setOption(this.option)
        },
    	/**
         * [toLink 路由跳转]
         * @param  {[type]} el [description]
         * @return {[type]}    [description]
         */
        toLink(name) {
            this.$router.push({ name })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /deep/ .echarts_check{
    .ivu-checkbox-wrapper{
      font-size 12px
      color #999999
    }
    .select1{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #009DF9
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #009DF9
      }
      &.ivu-checkbox-wrapper-checked{
        color #009DF9
      }
    }
    .select2{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #439599
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #439599
      }
      &.ivu-checkbox-wrapper-checked{
        color #439599
      }
    }
    .select3{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #4BAF4F
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #4BAF4F
      }
      &.ivu-checkbox-wrapper-checked{
        color #4BAF4F
      }
    }
    .select4{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #EAAE2F
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #EAAE2F
      }
      &.ivu-checkbox-wrapper-checked{
        color #EAAE2F
      }
    }
    .select5{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #6C55E3
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #6C55E3
      }
      &.ivu-checkbox-wrapper-checked{
        color #6C55E3
      }
    }
    .select6{
      .ivu-checkbox-checked .ivu-checkbox-inner{
        border-color #E7556E
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after{
        border-color #E7556E
      }
      &.ivu-checkbox-wrapper-checked{
        color #E7556E
      }
    }
  }
.account-card-box
  display: inline
  float: left
  width: 454px
.home-column
  display: inline
  float: left
  width: 356px
  margin-left: 20px
.account-card
	padding: 34px 30px
	h3
    font-size: 20px
    line-height: 30px
    height: 60px
    overflow: hidden
	p
		font-size: 14px
		color: #999
	.handle-flex
    margin-top: 50px
    button
      margin-right: 21px
      padding: 0 10px
      font-size: 12px
      i
        margin-right: 4px
      .icon-close-eye
        margin-right: -4px
.earn-card
  padding  14px 24px
  overflow: hidden
  &:after
    content :''
    width 66px
    height 66px
    background url("~@/assets/image/qian_icon.png") no-repeat
    position absolute
    bottom -15px
    right -15px
	&.earn-card-mar
		margin-top: 20px
	p
		font-size: 14px
		color: #999999
		line-height: 24px
	.m-number
    margin-top: 18px
    font-size: 26px
    font-weight: bold
    line-height: 36px
    height: 36px
		span
			font-size: 18px
.mon-card {
      margin-top 20px
      .echarts_title {
        height 40px
        line-height 40px
        .title_header {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        }

        .title_active {
          font-size: 12px;
          font-weight: 400;
          color: #3F83F7;
          margin-left 20px
        }
      }
      .echatrs_select {
        text-align center
        margin 25px 0 30px
        span{
          font-size 12px
        }
      }
    }

.echart-content {
      margin-top: 40px
      width: 1144px
      height: 350px
 }
  .no_data{
    width: 100%
    height: 350px
    padding-top 100px
    text-align center
    .no_text{
      color: #999999
      font-size 14px
      margin-top 20px
    }
  }
.select_data
  /deep/ .ivu-input
    font-size: 13px
</style>
