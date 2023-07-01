<template>
  <div class="revence-main">
    <div class="revence_search">
      <Row>
        <Col span="19" class="revenue-handle">
          <DatePicker
            :transfer="true"
            :value="search_time"
            type="daterange"
            format="yyyy-MM-dd"
            :options="options1"
            style="width: 210px; margin-right: 7px"
            @on-change="filterByDate"
          />
          <Treeselect class="appTreeSelect"
                      :multiple="true"
                      :options="appTreeSelectList"
                      :load-options="appTreeSelectListData"
                      :limitText="limitText"
                      :limit="1"
                      placeholder="应用名称"
                      v-model="search.app_id_arr"
                      noResultsText="没有搜索的结果"
                      noOptionsText="没有应用名称"
          >
            <div slot="value-label" slot-scope="{ node }">{{ node.raw.app_name}}</div>
            <label slot="option-label" slot-scope="{ node }" style="width: 300px">
              <div style="display:inline-block" v-if="!node.isBranch">
                <div class="checkbox_content">
                  <div class="checkbox_name" :title="node.raw.app_name">
                    <span>{{node.raw.app_name}}</span>
                  </div>
                  <div class="checkbox_active">
                    <span>{{node.raw.os_type_text}}</span>
                    <span :title="node.raw.app_id">ID:{{node.raw.app_id}}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                {{node.raw.app_name}}
              </div>
            </label>
            <treeselect-value :value="search.app_id_arr"/>
          </Treeselect>
          <Select class="ad_typeSelect" filterable v-model="search.creative_type_arr"
                  placeholder="广告位类型"
                  multiple
                  :max-tag-count="1"
                  style="width:200px">
            <OptionGroup v-for="(item, index) in adSceneData" :key="index + '广告场景'" :label="item.title">
              <Option v-for="(it,i) in item['children']" :key="i + '广告样式'" :value="it.value">{{ it.label }}
              </Option>
            </OptionGroup>
          </Select>
          <Treeselect class="appTreeSelect"
                      :multiple="true"
                      :options="slotSelectList"
                      :load-options="getSSPslotlotList"
                      :clearOnSelect="true"
                      :limitText="limitText"
                      :limit="1"
                      v-model="search.slot_id_arr"
                      placeholder="广告位名称"
                      noResultsText="没有搜索的结果"
                      noOptionsText="没有广告位名称"
          >
            <div slot="value-label" slot-scope="{ node }">{{node.raw.ssp_slot_name}}</div>
            <label slot="option-label" slot-scope="{ node }" style="width: 300px">
              <div style="display:inline-block" v-if="!node.isBranch">
                <div class="checkbox_content">
                  <div class="checkbox_name" :title="node.raw.ssp_slot_name">
                    <span>{{node.raw.ssp_slot_name}}</span>
                  </div>
                  <div class="checkbox_active">
                    <span>ID:{{node.raw.ssp_slot_id}}</span>
                  </div>
                </div>
              </div>
              <div v-else>
                {{ node.raw.ssp_slot_name }}
              </div>
            </label>
            <Treeselect-value :value="search.slot_id_arr"/>
          </Treeselect>
          <Button type="primary" @click="demand">查询</Button>
        </Col>
        <Col span="5" style="text-align: right">
          <Button type="primary" ghost @click="queryKey">数据查询接口</Button>
          <Button type="primary" ghost @click="downStatement">下载报表</Button>
        </Col>
      </Row>
    </div>
    <div class="revence_number">
      <Row :gutter="20">
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>广告展现</p>
            <div class="m-number">{{ getNumberInt(sumData['show_pv']) }}</div>
          </Card>
        </Col>
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>广告点击</p>
            <div class="m-number">{{ getNumberInt(sumData['click_pv']) }}</div>
          </Card>
        </Col>
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>点击率</p>
            <div class="m-number">{{ sumData['ctr'] }}%</div>
          </Card>
        </Col>
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>千次展现收益</p>
            <div class="m-number">{{ getNumber(sumData['ecpm']) }}</div>
          </Card>
        </Col>
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>单次点击收益</p>
            <div class="m-number">{{ getNumber(sumData['cpc']) }}</div>
          </Card>
        </Col>
        <Col span="4">
          <Card :bordered="false" dis-hover class="earn-card" :padding="0">
            <p>预估收益</p>
            <div class="m-number">{{ getNumber(sumData['spend']) }}</div>
          </Card>
        </Col>
      </Row>
    </div>
    <Card class="mon-card" dis-hover :bordered="false">
      <div class="echarts_title">
        <span class="title_header">数据趋势</span>
        <span v-if="packSatus===1" class="title_active" @click="packSatus=2">收起面板</span>
        <span v-if="packSatus===2" class="title_active" @click="packSatus=1">展开面板</span>
      </div>
      <div v-show="packSatus===1">
        <div v-show="lineStatus===1" class="no_data">
          <p><img src="~@/assets/image/noDatas.png" alt=""></p>
          <p class="no_text">暂无数据</p>
        </div>
        <div v-show="lineStatus===2">
          <div class="echatrs_select">
            <CheckboxGroup size="small" class="echarts_check" v-model="echartsData" @on-change="checkChange">
              <Checkbox class="select1" label="广告展现">
                <span>广告展现</span>
              </Checkbox>
              <Checkbox class="select2" label="广告点击">
                <span>广告点击</span>
              </Checkbox>
              <Checkbox class="select3" label="千次展现收益">
                <span>千次展现收益</span>
              </Checkbox>
              <Checkbox class="select4" label="单次点击收益">
                <span>单次点击收益</span>
              </Checkbox>
              <Checkbox class="select5" label="预估收益">
                <span>预估收益</span>
              </Checkbox>
              <Checkbox class="select6" label="点击率">
                <span>点击率</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
          <div id="dataTrend" class="echart-content"></div>
        </div>
      </div>
    </Card>
    <Card :bordered="false" dis-hover style="margin-top: 20px">
      <div class="statement_header">
        <div class="title">数据报表</div>
        <div class="check">
          <span>数据纬度：</span>
          <div style="display:inline-block">
          <CheckboxGroup v-model="statement_type" @on-change="changeTableColumns">
            <Checkbox label="app_id" class="checkContent">
              <span>应用名称/ID</span>
            </Checkbox>
            <Checkbox label="creative_type" class="checkContent">
              <span>广告位类型</span>
            </Checkbox>
            <Checkbox label="ssp_slot_id" class="checkContent">
              <span>广告位名称/ID</span></Checkbox>
          </CheckboxGroup>
          </div>
        </div>
      </div>
      <div class="console-table" style="margin-top: 0px">
        <Table border :columns="dataRevenue" :data="tableData" placement="top" @on-sort-change="changeSort">
          <!--应用名称/ID-->
          <template slot-scope="{ row }" slot="app_id">
            <p class="name-row-ellipsis" :title="`${row.app_name}(${row.os_type_text})`">{{ row.app_name }}
              <template v-if="row.os_type_text">({{row.os_type_text}})</template></p>
            <p class="tip-row-line">ID: {{ row.app_id }}</p>
          </template>
          <!--广告位名称/ID-->
          <template slot-scope="{ row }" slot="ssp_slot_id">
            <p class="name-row-ellipsis" :title="row.ssp_slot_name">{{row.ssp_slot_name}}</p>
            <p class="tip-row-line">ID: {{ row.ssp_slot_id }}</p>
          </template>
          <!--广告样式-->
          <template slot-scope="{ row }" slot="creative_type">
            <p style="font-size: 13px"> {{row.ad_type_text}}-{{creativeId2Text(row.creative_type)}}</p>
          </template>
        </Table>
        <div class="page-center">
          <Page show-sizer show-total show-elevator :total="total_count" :current.sync='currentPage'
                :page-size="pageSize" @on-page-size-change="sizeChange" @on-change="changePage"/>
        </div>
      </div>
    </Card>
    <Modal v-model="keyModal" width="500" title="数据查询接口" class="keyModal">
      <div class="keyContent">
         <p>
           <span class="name">数据查询code:</span><span>{{api_key?api_key:'无'}}</span>
         </p>
        <p>
          <a target="_blank" :href="api_doc">查看接口文档</a>
        </p>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import echarts from 'echarts'
import {getIncomeSumApi, getIncomeLineApi, getIncomeTableApi, getApiKey} from '@/api/data'
import {getDownLoadXls, geYesterdayRead} from '@/api/common'
import {getCols} from './data'
import {getAppList, getSspSlotList} from '@/api/ssp'
import {formatDate} from '@/libs/tools'

import qs from 'qs'

export default {
    data() {
        return {
            keyModal: false,
            api_key: '',
            api_doc: '',
            appTreeSelectList: [],
            adTypeSelectList: [],
            yesterday_can_read: false,
            slotSelectList: [],
            adSingle: false,
            codeSingle: false,
            packSatus: 1,
            AppList: [],
            adSceneData: [], // 广告场景
            loading2: false,
            ADList: [],
            timeStatus: 1,
            serveTime0Date: null, // 服务器日期的凌晨时间
            serveTimestamp: null, // 服务器时间戳
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
            pageSize: 10,
            total_count: 100,
            currentPage: 1,
            search_time: null,
            search: {
                app_id_arr: [],
                creative_type_arr: [],
                slot_id_arr: [],
                start_date: null,
                end_date: null
            },
            echartsData: ['广告展现', '预估收益'],
            sumData: {},
            lineStatus: 2,
            lineData: {
                cpc: [],
                ctr: [],
                date: [],
                ecpm: [],
                click: [],
                show: [],
                spend: []
            },
            dataRevenue: null,
            tableData: [],
            myChart: null,
            field: '',
            is_desc: false,
            statement_type: []
        }
    },
    created() {
        this.app_id = this.$route.query && this.$route.query.app_id
        this.slot_id = this.$route.query && this.$route.query.slot_id
        if (this.app_id) {
            this.search.app_id_arr.push(this.app_id)
        }
        if (this.slot_id) {
            this.search.slot_id_arr.push(this.slot_id)
        }
        this.geYesterdayReadStatus()
        this.appTreeSelectListData()
        this._getTypeList()
        this.getSSPslotlotList()
        this.getTableColumns()
        this.getKey()
    },
    methods: {
        queryKey() {
            this.keyModal = true
        },
        // 获取秘钥
        getKey() {
            getApiKey().then(res => {
                let data = res.data
                if (res.code === 200) {
                    this.api_key = data.api_key
                    this.api_doc = data.api_doc
                }
            })
        },
        changeTableColumns() {
            this.getTableColumns()
            this.gainTableData()
        },
        getTableColumns() {
            const ColumnList = getCols(this)
            let resultArr = []
            ColumnList.map(item => {
                if (item.isShow || this.statement_type.indexOf(item.slot) > -1) {
                    item.title = item.header || item.title
                    resultArr.push(item)
                }
            })
            this.dataRevenue = resultArr
        },
        // 获取广告场景
        adTypeText(id) {
            let _arr = this.$store.state.app.adSceneData
            // eslint-disable-next-line eqeqeq
            let result = _arr.filter(item => item.id == id)
            return result[0] ? result[0].title : ''
        },
        // 获取广告样式
        creativeId2Text(id) {
            let _arr = this.$store.state.user.adStyleData
            let result = _arr.filter(item => item.id == id)
            return result[0].title
        },
        // 改变时间控件是的图像
        filterByDate(e) {
            this.search.start_date = e[0]
            this.search.end_date = e[1]
        },
        // 获取应用名称
        appTreeSelectListData() {
            getAppList().then(res => {
                let data = res.data
                if (res.code === 200) {
                    let applist = []
                    applist = data.list
                    Object.keys(data.list).forEach(j => {
                        applist[j].id = data.list[j].app_id
                        applist[j].label = data.list[j].app_name + 'id' + data.list[j].app_id
                    })
                    this.appTreeSelectList = applist
                }
            })
        },
        // 获取广告位类型
        _getTypeList() {
            let resType = this.$store.state.user.adStyleData
            let adSceneData = this.$store.state.user.adSceneData
            adSceneData.map(item => {
                item['label'] = item.title
                let children = []
                resType.map(it => {
                    let obj = {}
                    if (it.parentId === item.id) {
                        obj['label'] = it.title
                        obj['value'] = it.id
                        children.push(obj)
                    }
                })
                item['children'] = children
            })
            this.adTypeSelectList = resType
            this.adSceneData = adSceneData
        },
        // 获取广告位
        getSSPslotlotList() {
            let objs = {}
            getSspSlotList(objs).then(res => {
                let data = res.data
                if (res.code === 200) {
                    let adlist = []
                    adlist = data.list
                    Object.keys(data.list).forEach(j => {
                        adlist[j].id = data.list[j].ssp_slot_id
                        adlist[j].label = data.list[j].ssp_slot_name + 'id' + data.list[j].ssp_slot_id
                    })
                    this.slotSelectList = adlist
                }
            })
        },
        // 列表的排序
        changeSort({key, order}) {
            this.field = key
            this.is_desc = order !== 'asc'
            this.gainTableData()
        },
        // 搜索框文本的超出
        limitText(count) {
            return `+ ${count}`
        },
        // 设置时间的默认值

        geYesterdayReadStatus() {
            geYesterdayRead().then(data => {
                if (data.code === 200) {
                    this.yesterday_can_read = data.data.yesterday_can_read
                    this.getTimeData()
                    this.gainSumData()
                    this.gainLineData()
                    this.gainTableData()
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
        // 点击查询
        demand() {
            this.gainSumData()
            this.gainLineData()
            this.gainTableData()
        },
        getLocalTime(tt) {
            let date = new Date(tt)
            let Y = date.getFullYear()
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()
            let data = Y + '-' + M + '-' + D
            return data
        },
        // 转换成千分位，保留两位小数
        getNumber(val) {
            if (val) {
                return val.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
            } else {
                return 0
            }
        },
        // 转换成千分位
        getNumberInt(val) {
            if (val) {
                return parseInt(val).toLocaleString()
            } else {
                return 0
            }
        },
        // 获取总计数据
        gainSumData() {
            let data2 = {}
            data2.app_id_arr = this.search.app_id_arr
            data2.creative_type_arr = this.search.creative_type_arr
            data2.slot_id_arr = this.search.slot_id_arr
            data2.start_date = this.search.start_date
            data2.end_date = this.search.end_date
            getIncomeSumApi(data2).then(data => {
                if (data.code === 200) {
                    this.sumData = data.data
                }
            })
        },
        // 获取折线图中的数据
        gainLineData() {
            let data1 = {}
            data1.app_id_arr = this.search.app_id_arr
            data1.creative_type_arr = this.search.creative_type_arr
            data1.slot_id_arr = this.search.slot_id_arr
            data1.start_date = this.search.start_date
            data1.end_date = this.search.end_date
            getIncomeLineApi(data1).then(data => {
                if (data.code === 200) {
                    let list = data.data.list
                    if (list.length > 0) {
                        this.lineStatus = 2
                        let ctr = []
                        let cpc = []
                        let date = []
                        let ecpm = []
                        let click = []
                        let show = []
                        let spend = []
                        Object.keys(list).forEach(k => {
                            ctr.push(list[k].ctr)
                            cpc.push(list[k].cpc)
                            date.push(list[k].date)
                            ecpm.push(list[k].ecpm)
                            click.push(list[k].click)
                            show.push(list[k].show)
                            spend.push(list[k].spend)
                        })
                        this.lineData.ctr = ctr
                        this.lineData.cpc = cpc
                        this.lineData.date = date
                        this.lineData.ecpm = ecpm
                        this.lineData.click = click
                        this.lineData.show = show
                        this.lineData.spend = spend
                        this.initMoniter()
                    } else {
                        this.lineStatus = 1
                    }
                }
            })
        },
        // 获取表格中的数据
        gainTableData() {
            let data = this.search
            data.field = this.field
            data.is_desc = this.is_desc
            data.page_size = this.pageSize
            data.page_num = this.currentPage
            let groupArr = ['date']
            let group = this.statement_type
            groupArr = groupArr.concat(group)
            data.group = groupArr
            getIncomeTableApi(data).then(data => {
                if (data.code === 200) {
                    this.tableData = data.data.list
                    this.total_count = data.data.total_count
                }
            })
        },
        // 翻页
        changePage(val) {
            this.currentPage = val
            this.gainTableData()
        },
        // 页面个数的改变
        sizeChange(val) {
            this.pageSize = val
            this.gainTableData()
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
        // 下载报表
        downStatement() {
            let down = {}
            let data = this.search
            data.page_size = parseInt(this.total_count)
            let groupArr = ['date', 'app_id', 'creative_type', 'ssp_slot_id']
            data.group = groupArr
            data.page_num = parseInt(1)
            data.page_size = 0
            down.url = `/api/v1/data_income/home_table?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
            down.method = 'GET'
            getDownLoadXls(down).then(data => {
                if (data.code === 200) {
                    let url = data.data.url
                    let filename = this.search.start_date + '～' + this.search.end_date + '数据收益.xlsx'
                    this.courseDownload(url, filename)
                }
            })
        },

        //
        courseDownload(url, filename) {
            let blod = ''
            this.getBlob(url, function (blob) {
                console.log(blob)
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename)
                } else {
                    var link = document.createElement('a')
                    var body = document.querySelector('body')

                    link.href = window.URL.createObjectURL(blob)
                    link.download = filename

                    // fix Firefox
                    link.style.display = 'none'
                    body.appendChild(link)

                    link.click()
                    body.removeChild(link)

                    window.URL.revokeObjectURL(link.href)
                }
            })
        },
        getBlob(url, cb) {
            var xhr = new XMLHttpRequest()
            xhr.open('GET', url, true)
            xhr.responseType = 'blob'
            xhr.onload = function () {
                if (xhr.status === 200) {
                    cb(xhr.response)
                }
            }
            xhr.send()
        },
        //
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
                    formatter: function (params) {
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
                        data: this.lineData.show
                    },
                    {
                        name: '广告点击',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.lineData.click
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
                        data: this.lineData.spend
                    },
                    {
                        name: '点击率',
                        type: 'line',
                        yAxisIndex: 5,
                        data: this.lineData.ctr
                    }
                ]
            }
            // 设置默认的选中值以及y轴只出现一次
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
        }
    }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .keyModal {
   /deep/ .ivu-modal-footer {
      border-top 0px !important
      padding 0px
    }
    .keyContent{
      line-height 30px
      .name{
        margin-right 10px
      }
    }
  }

  .statement_header{
    display flex
    justify-content space-between
    height 40px
    line-height 40px
    margin-bottom 15px
    .title{
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }

    /deep/ .check {
      font-size 12px
      color #333333
      .checkContent{
        font-size 12px
        color #999999
        .ivu-checkbox-checked .ivu-checkbox-inner {
          border-color #3f83f7
          background #FFFFff
        }
        .ivu-checkbox-checked .ivu-checkbox-inner:after {
          border-color #3f83f7
        }
        &.ivu-checkbox-wrapper-checked {
          color #3f83f7
        }
      }

    }
  }
  .ad_typeSelect {
    height 32px
    overflow hidden

    /deep/ .ivu-select-multiple .ivu-tag {
      max-width 95px
      background: #e3f2fd;
      border: 1px solid transparent;
      border-radius: 2px;
      color: #039be5;
      font-size: 12px;
      padding: 0 4px;

      .ivu-tag-text {
        color: #039be5;
      }

      .ivu-icon-ios-close {
        color: #039be5;
      }
    }
  }

  /deep/ .appTreeSelect {
    margin-right: 7px

    &.typeTreeSelect {
      .vue-treeselect__menu-container {
        width 200px
      }
    }

    .vue-treeselect__multi-value-item-container {
      padding-top 3px
    }

    .vue-treeselect__limit-tip {
      padding-top 3px
    }

    .vue-treeselect__menu-container {
      width 375px
    }

    .vue-treeselect__control {
      display block
      height 32px
      overflow hidden
    }

    .vue-treeselect__value-container {
      height 32px
    }

    .vue-treeselect__multi-value {
      margin-bottom 0px
    }

    .vue-treeselect__multi-value-label {
      div {
        max-width 80px
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      max-width 90px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .vue-treeselect__x-container {
      padding-right 10px
    }

  }

  /deep/ .echarts_check {
    .ivu-checkbox-wrapper {
      font-size 12px
      color #999999
    }
    .select1 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #009DF9
        background #FFFFff
      }
      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #009DF9
      }
      &.ivu-checkbox-wrapper-checked {
        color #009DF9
      }
    }

    .select2 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #439599
        background #FFFFff
      }

      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #439599
      }

      &.ivu-checkbox-wrapper-checked {
        color #439599
      }
    }

    .select3 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #4BAF4F
        background #FFFFff
      }

      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #4BAF4F
      }

      &.ivu-checkbox-wrapper-checked {
        color #4BAF4F
      }
    }

    .select4 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #EAAE2F
        background #FFFFff
      }

      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #EAAE2F
      }

      &.ivu-checkbox-wrapper-checked {
        color #EAAE2F
      }
    }

    .select5 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #6C55E3
        background #FFFFff
      }

      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #6C55E3
      }

      &.ivu-checkbox-wrapper-checked {
        color #6C55E3
      }
    }

    .select6 {
      .ivu-checkbox-checked .ivu-checkbox-inner {
        border-color #E7556E
        background #FFFFff
      }

      .ivu-checkbox-checked .ivu-checkbox-inner:after {
        border-color #E7556E
      }

      &.ivu-checkbox-wrapper-checked {
        color #E7556E
      }
    }
  }

  .appIdSelect {
    .appID_quan {
      margin 10px 0
    }

    .appId_content {
      max-height 300px;
    }
  }

  .appTreeSelect, .typeTreeSelect {
    width: 200px;
    display: inline-block
    vertical-align: middle
  }

  .checkbox_content {
    display flex
    width 320px
    justify-content space-between
    color #333333
    padding 0 5px
    margin 5px 0

    .checkbox_name {
      width 180px
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .checkbox_active {
      width 140px
      text-align right
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .revence-main {
    .earn-card {
      padding: 20px 16px
      color #999999
      font-size 14px

      .m-number {
        margin-top: 5px;
        font-size: 18px;
        font-weight: bold
        line-height: 36px
        color #333333
      }
    }

    .revence_search {
      padding 20px
      background #FFFFff
    }

    .revence_number {
      margin 20px 0

      .ivu-row {
        .ivu-col {
        }
      }
    }

    .mon-card {
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
          cursor pointer
        }
      }

      .echatrs_select {
        text-align center
        margin 15px 0
      }
    }

    .echart-content {
      margin-top: 40px
      width: 1144px
      height: 350px
    }

    .no_data {
      width: 100%
      height: 350px
      padding-top 100px
      text-align center

      .no_text {
        color: #999999
        font-size 14px
        margin-top 20px
      }
    }
  }

  .revenue-handle
    /deep/ .ivu-input
      font-size: 13px
      border-radius 2px

  .ad_typeSelect {
    /deep/ .ivu-select-default.ivu-select-multiple .ivu-select-selection {
      border-radius 2px
    }
  }

</style>
