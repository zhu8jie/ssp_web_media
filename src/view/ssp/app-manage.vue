<template>
    <div class="page-main">
        <Card dis-hover :bordered="false">
            <h2 class="page-title">{{headTitle}}</h2>
            <div class="search-line">
                <Row>
                    <Col span="20">
                        <Input v-model="paramSearch" style="width: 200px" search placeholder="输入应用名称或ID查询" @on-search="doFilterAPPList" />
                    </Col>
                    <Col span="4" style="text-align: right">
                        <Button icon="ios-add" type="primary" @click="toEditPage()">新建应用</Button>
                    </Col>
                </Row>
            </div>
            <div class="nav-handle-group">
                <RadioGroup v-model="paramStatus" type="button" @on-change="doFilterAPPList">
                    <Radio label="">全部</Radio>
                    <Radio label="1">有效</Radio>
                    <Radio label="3">待审核</Radio>
                    <Radio label="2">修改审核中</Radio>
                    <Radio label="4">已拒绝</Radio>
                    <Radio label="5">封禁</Radio>
                </RadioGroup>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="appColumns" :data="colDatList" :loading="tableLoadFlag" :height="tableHeight">
                    <!--应用名称/ID-->
                    <template slot-scope="{ row }" slot="app_id">
                        <p class="name-row-ellipsis" :title="`${row.app_name}(${row.os_type_text})`">{{ row.app_name }} <template v-if="row.os_type_text">({{row.os_type_text}})</template></p>
                        <p class="tip-row-line">{{ row.app_id }}</p>
                    </template>
                    <!--应用类型-->
                    <template slot-scope="{ row }" slot="industry_type">
                        <span>{{ row.industry_type }}</span>
                    </template>
                    <!--应用包名-->
                    <template slot-scope="{ row }" slot="package_name">
                        <span v-if="row.package_name">{{ row.package_name }}</span>
                        <span v-else>-</span>
                    </template>
                    <!--接入方式-->
                    <template slot-scope="{ row }" slot="access_type">
                        <span v-if="row.access_type == 1">API</span>
                        <span v-if="row.access_type == 2">SDK</span>
                    </template>
                    <!--第三方SDK接入-->
                    <template slot-scope="{ row }" slot="platform_sdk">
                        {{filterPlatFormSdk(row)}}
                    </template>
                    <!--业务状态-->
                    <template slot-scope="{ row }" slot="status">
                        <Badge v-if="row.status == 1" color="#339900" text="有效" />
                        <Badge v-if="row.status == 2" color="#015D16" text="修改审核中" />
                        <Badge v-if="row.status == 3" color="#999999" text="待审核" />
                        <Badge v-if="row.status == 4" color="#B5291A" text="已拒绝" />
                        <Badge v-if="row.status == 5" color="#F72D17" text="封禁" />
                        <Badge v-if="row.status == -1" status="error" text="暂停合作" />

                        <Poptip v-if="(row.status == 5 || row.status == 4) && row.status_desc" trigger="hover" :content="row.status_desc">
                            <i class="iconfont icon-why"></i>
                        </Poptip>
                    </template>
                    <!--更新时间-->
                    <template slot-scope="{ row }" slot="updated_time">
                        <span>{{ row.updated_time }}</span>
                    </template>
                    <!--创建时间-->
                    <template slot-scope="{ row }" slot="created_time">
                        <span>{{ row.created_time }}</span>
                    </template>
                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="action">
                        <Button v-if="row.status !== 5" type="text" @click="toEditPage(row)" >编辑</Button>
                        <Button type="text" @click="toRevenue(row)">查看数据</Button>
                        <Button v-if="row.status !== 5" type="text" @click="toCreateNewAd(row)">新建广告位</Button>
                    </template>
                </Table>
                <div class="page-center">
                    <Page show-total show-elevator show-sizer placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange" />
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { debounce } from '@/libs/tools'
import { getAppList } from '@/api/ssp'
import { tableHeight } from '@/mixin/calc-table-height.js'

export default {
    name: 'appManage',
    mixins: [tableHeight],
    data() {
        return {
            pageSize: 30,
            total_count: 0,
            currentPage: 1,

            paramStatus: '', // 标签栏状态，1=正常，2=修改审核中，3=待审核，4=已拒绝，5=封禁
            paramSearch: '', // 模糊查询输入框
            tableLoadFlag: true, // 表格加载

            appColumns: [
                {
                    title: '应用名称/ID',
                    slot: 'app_id',
                    width: 180,
                    fixed: 'left'
                },
                {
                    title: '应用类型',
                    slot: 'industry_type',
                    minWidth: 150
                },
                {
                    title: '应用包名',
                    slot: 'package_name',
                    minWidth: 180
                },
                {
                    title: '接入方式',
                    slot: 'access_type',
                    minWidth: 80
                },
                {
                    title: '第三方SDK接入',
                    slot: 'platform_sdk',
                    minWidth: 120
                },
                {
                    title: '业务状态',
                    slot: 'status',
                    minWidth: 100
                },
                {
                    title: '更新时间',
                    slot: 'updated_time',
                    minWidth: 100
                },
                {
                    title: '创建时间',
                    slot: 'created_time',
                    minWidth: 100
                },
                {
                    title: '操作',
                    slot: 'action',
                    minWidth: 190,
                    fixed: 'right'
                }
            ],
            colDatList: []
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        this.getAppList() // 默认请求一次应用列表数据
    },
    mounted() {
        this.initTableHeight({'search-line': {isAutoCalc: false, isInclude: true}, 'nav-handle-group': true}) // search-line的高度
    },
    methods: {
        /**
         * [getAppList description]
         * @return {[type]} [description]
         */
        getAppList: debounce(function() {

            this.tableLoadFlag = true

            getAppList({
                status: this.paramStatus,
                search_text: String(this.paramSearch),
                page_size: this.pageSize,
                page_num: this.currentPage
            }).then(res => {

                this.tableLoadFlag = false

                let data = res.data

                if (res.code === 200) {
                    this.valid_count = data.valid_count
                    this.count = data.count
                    this.stop_count = data.stop_count
                    this.total_count = data.total_count
                    this.invalid_count = data.invalid_count

                    this.colDatList = data.list
                }
            }, err => {
                this.tableLoadFlag = false
            })
        }, 300),
        /**
         * [doFilterMediaList 筛选媒体列表]
         * @return {[type]} [description]
         */
        doFilterAPPList() {
            this.currentPage = 1
            this.getAppList()
        },
        /**
         * [changePage 切换页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        changePage(val) {
            this.currentPage = val
            this.getAppList()
        },
        /**
         * [sizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        sizeChange(size) {
            this.pageSize = size
            this.getAppList()
        },
        /**
         * [toEditPage 路由跳转]
         * @param  {[type]} el [description]
         * @return {[type]}    [description]
         */
        toEditPage(row) {
            if (row && !!row.app_id) {
                this.$router.push({name: 'app-edit', query: {id: row.app_id}})
            } else {
                this.$router.push({name: 'app-edit'})
            }
        },
        /**
         * [filterPlatFormSdk 筛选sdk]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        filterPlatFormSdk(row) {
            // 1. 如果 access_type = 1(API) 返回 无
            // 2. 如果 access_type = 2(SDK) 筛选 去除数组中的 '交互通'
            if (row.access_type === 1) {
                return '无'
            } else if (row.access_type === 2) {
                // const platform_sdk_arr = row.platform_sdk.split(',')

                // let result = platform_sdk_arr.filter(item=> {
                //     // return item !== '交互通'
                // }).join(',')

                return !!row.platform_sdk ? row.platform_sdk : '无'
            }
        },
        /**
         * [toCreateNewAd description]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        toCreateNewAd(row) {
            this.$router.push({name: 'ad-edit', query: {appId: row.app_id}})
        },
        /**
         * [toRevenue 跳转到首页]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        toRevenue(row) {
            this.$router.push({name: 'revenue', query: {app_id: row.app_id}})
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-title
    font-size: 16px
</style>
