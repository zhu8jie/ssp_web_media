<template>
    <div class="page-main">
        <Card dis-hover :bordered="false">
            <h2 class="page-title">{{headTitle}}</h2>
            <div class="search-line">
                <Row>
                    <Col span="20">
                        <Input v-model="paramSearch" style="width: 200px; margin-right: 10px" search placeholder="输入广告位名称或ID查询" @on-search="doFilterSspSlotList" />
                        <Poptip placement="bottom-start" width="600" v-model="popTipsFlag">
                            <Button type="default">
                                筛选
                                <Icon type="ios-arrow-down" />
                            </Button>
                            <div class="api" slot="content">
                                <Form :label-colon="true" label-position="left" :label-width="80">
                                    <!-- <FormItem :label="`广告场景${paramAdTypeId}`"> -->
                                    <FormItem label="广告场景">
                                        <CheckboxGroup v-model="paramAdTypeId">
                                            <Checkbox v-for="item in curAdTypeList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                                        </CheckboxGroup>
                                    </FormItem>
                                    <!-- <FormItem :label="`广告样式${paramStyleId}`"> -->
                                    <FormItem label="广告样式">
                                        <CheckboxGroup v-model="paramStyleId" class="adStyleWrap">
                                            <Checkbox v-for="item in mediaAccordScene2AllStyle" :label="item.id" :key="item.id">{{item.title}}</Checkbox>
                                        </CheckboxGroup>
                                    </FormItem>
                                    <!-- <FormItem :label="`广告位状态${paramStatusDevId}`"> -->
                                    <FormItem label="广告位状态">
                                        <CheckboxGroup v-model="paramStatusDevId">
                                            <Checkbox :label="1" :key="1">启用</Checkbox>
                                            <Checkbox :label="0" :key="0">暂停</Checkbox>
                                        </CheckboxGroup>
                                    </FormItem>
                                    <!-- <FormItem :label="`渲染方式${paramRenderId}`"> -->
                                    <FormItem label="渲染方式">
                                        <CheckboxGroup v-model="paramRenderId">
                                            <Checkbox v-for="item in curAdRenderList" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                                            <Checkbox :label="0" :key="0">无</Checkbox>
                                        </CheckboxGroup>
                                    </FormItem>
                                    <!-- <FormItem :label="`所属应用${paramAppId}`"> -->
                                    <FormItem label="所属应用">
                                        <Select
                                            class="ad-filter-select"
                                            :multiple="true"
                                            :filterable="true"
                                            :max-tag-count="1"
                                            placement="top-start"
                                            :transfer-class-name="'ad-filter-select'"
                                            style="width: 100%"
                                            v-model="paramAppId"
                                            placeholder="请选择应用"
                                        >
                                            <Option v-for="item in allAppList" :label="item.app_name" :value="item.app_id" :key="item.app_id">
                                                 <div class="option-box clearfix" :title="item.app_name">
                                                    <span class="option-left">{{ item.app_name }}</span>
                                                    <span class="option-right">{{item.os_type_text}} ID:{{item.app_id}}</span>
                                                </div>
                                            </Option>
                                        </Select>
                                    </FormItem>
                                    <div class="tips-handle clearfix">
                                        <div class="h-left">
                                            <Button type="text"  @click="handleReset()">重置</Button>
                                        </div>
                                        <div class="h-right">
                                            <Button type="default" @click="popTipsFlag = false">取消</Button>
                                            <Button type="primary" @click="doFilterSspSlotList">确定</Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </Poptip>
                    </Col>
                    <Col span="4" style="text-align: right">
                        <Button icon="ios-add" type="primary" @click="toEditPage()">新建广告位</Button>
                    </Col>
                </Row>
            </div>
            <div class="nav-handle-group">
                <RadioGroup v-model="paramStatus" type="button" @on-change="doFilterSspSlotList">
                    <Radio label="">全部</Radio>
                    <Radio :label="1">有效</Radio>
                    <Radio :label="3">待审核</Radio>
                    <Radio :label="2">修改审核中</Radio>
                    <Radio :label="4">已拒绝</Radio>
                    <Radio :label="5">封禁</Radio>
                </RadioGroup>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="appColumns" :data="colDatList" :loading="tableLoadFlag" :height="tableHeight">
                    <!--广告位名称/ID-->
                    <template slot-scope="{ row }" slot="ssp_slot_id">
                        <p class="name-row-ellipsis" :title="row.ssp_slot_name">{{ row.ssp_slot_name }}</p>
                        <p class="tip-row-line">{{ row.ssp_slot_id }}</p>
                    </template>
                    <!--广告位名称/ID-->
                    <template slot-scope="{ row }" slot="app_id">
                        <template v-if="row.app_name">{{ row.app_name }} <template v-if="row.app_os_type">({{row.app_os_type}})</template></template>
                        <p class="tip-row-line">{{ row.app_id }}</p>
                    </template>
                    <!--广告场景-->
                    <template slot-scope="{ row }" slot="ad_type">
                        <span>{{ row.ad_type }}</span>
                    </template>
                    <!--广告样式-->
                    <template slot-scope="{ row }" slot="creative_type">
                        <span>{{ creativeId2Text(row.creative_type) }}</span>
                    </template>
                    <!--接入方式-->
                    <template slot-scope="{ row }" slot="access_type">
                        <span>{{ row.access_type }}</span>
                    </template>
                    <!--渲染方式-->
                    <template slot-scope="{ row }" slot="render_type_text">
                        <span>{{ row.render_type_text }}</span>
                    </template>
                    <!--业务状态-->
                    <template slot-scope="{ row }" slot="status">
                        <!-- 标签栏状态，1=正常，2=修改审核中，3=待审核，4=已拒绝，5=封禁 -->
                        <Badge v-if="row.status == 1" color="#339900" text="有效" />
                        <Badge v-if="row.status == 2" color="#015D16" text="修改审核中" />
                        <Badge v-if="row.status == 3" color="#999999" text="待审核" />
                        <Badge v-if="row.status == 4" color="#B5291A" text="已拒绝" />
                        <Badge v-if="row.status == 5" color="#F72D17" text="封禁" />

                        <Poptip v-if="(row.status == 5 || row.status == 4) && row.status_desc" trigger="hover" :content="row.status_desc">
                            <i class="iconfont icon-why"></i>
                        </Poptip>
                    </template>
                    <!--广告位状态-->
                    <template slot-scope="{ row }" slot="status_dev">
                        <template v-if="row.status_dev == 1 || row.status_dev == -1">
                            <span v-if="row.status_dev === 1">启用</span>
                            <span v-if="row.status_dev === -1">停用</span>
                            <i-switch size="small" :true-value="1" :false-value="-1" v-model="row.status_dev" @on-change="changeState(row)"/>
                        </template>
                        <template v-else>
                            <span>-</span>
                        </template>
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
                        <Button v-if="row.status !== 5" type="text" data-name="ad-edit" :data-id="row.ssp_slot_id" @click="toEditPage(row)">编辑</Button>
                        <Button type="text" @click="toRevenue(row)">查看数据</Button>
                        <!-- <Button type="text">新建广告位</Button> -->
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
import { getSspSlotList, changeSspStatusDev, getAppList } from '@/api/ssp'
import { adTypeMixin } from '@/mixin/current-media-adType-renderType.js'
import { tableHeight } from '@/mixin/calc-table-height.js'

export default {
    name: 'appManage',
    mixins: [adTypeMixin, tableHeight],
    data() {
        return {
            pageSize: 30,
            total_count: 0,
            currentPage: 1,

            popTipsFlag: false,

            paramStatus: '', // 标签栏状态，1=正常，2=修改审核中，3=待审核，4=已拒绝，5=封禁
            paramSearch: '', // 模糊查询输入框
            paramAdTypeId: [], // 广告类型ID数组
            paramStyleId: [], // 广告创意编号数组
            paramRenderId: [], // 渲染方式编号数组
            paramStatusDevId: [], // 用户控制的广告位状态数组
            paramAppId: [], // 所属应用ID数组

            searchLoading: false, // 当前select是否处于搜索中
            allAppList: [], // 当前媒体下所有的app列表

            tableLoadFlag: true, // 表格加载
            appColumns: [
                {
                    title: '广告位名称/ID',
                    slot: 'ssp_slot_id',
                    width: 180,
                    fixed: 'left'
                },
                {
                    title: '应用名称/ID',
                    slot: 'app_id',
                    minWidth: 150
                },
                {
                    title: '广告场景',
                    slot: 'ad_type',
                    minWidth: 150
                },
                {
                    title: '广告样式',
                    slot: 'creative_type',
                    minWidth: 150
                },
                {
                    title: '接入方式',
                    slot: 'access_type',
                    minWidth: 90
                },
                {
                    title: '渲染方式',
                    slot: 'render_type_text',
                    minWidth: 90
                },
                {
                    title: '业务状态',
                    slot: 'status',
                    width: 110
                },
                {
                    title: '广告位状态',
                    slot: 'status_dev',
                    width: 100
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
                    minWidth: 120,
                    fixed: 'right'
                }
            ],
            colDatList: [],
            filterForm: {}, //

            adStyleList: [] // 样式列表
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        this.getSspSlotList() // 默认请求一次应用列表数据
        this.getAppList() // 获取一次app列表
    },
    mounted() {
        this.initTableHeight({'search-line': {isAutoCalc: false, isInclude: true}, 'nav-handle-group': true}) // search-line的高度
    },
    methods: {
        /**
         * [changeState 切换业务状态]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        changeState(item) {
            this.$Modal.confirm({
                title: item.status_dev === 1 ? '确定开启广告位?' : '确定暂停广告位?',
                content: '',
                onOk: () => {
                    changeSspStatusDev({ssp_slot_id: Number(item.ssp_slot_id), status_dev: item.status_dev}).then(res => {
                        if (res.code === 200) {
                            this.$Message.success('操作成功')
                            item.status_dev = item.status_dev === 1 ? 1 : -1
                        } else {
                            this.$Message.error({content: '操作失败', duration: 3})
                            item.status_dev = item.status_dev === 1 ? -1 : 1
                        }
                    }, err => {
                        item.status_dev = item.status_dev === 1 ? -1 : 1
                    })
                },
                onCancel: res => {
                    item.status_dev = item.status_dev === 1 ? -1 : 1
                }
            })
        },
        /**
         * [creativeId2Text 根据createId 找到对应 text]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        creativeId2Text(id) {
            let _arr = this.$store.state.user.adStyleData
            let result = _arr.filter(item => item.id === id)
            return result[0].title
        },
        /**
         * [getSspSlotList description]
         * @return {[type]} [description]
         */
        getSspSlotList: debounce(function() {

            this.tableLoadFlag = true

            getSspSlotList({
                status: this.paramStatus,
                search_text: this.paramSearch,
                ad_type_id_arr: this.paramAdTypeId,
                creative_type_arr: this.paramStyleId,
                render_type_arr: this.paramRenderId,
                status_dev_arr: this.paramStatusDevId,
                app_id_arr: this.paramAppId,
                page_size: this.pageSize,
                page_num: this.currentPage
            }).then(res => {

                this.tableLoadFlag = false

                let data = res.data

                if (res.code === 200) {
                    this.total_count = data.total_count
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
        doFilterSspSlotList() {
            this.popTipsFlag = false
            this.currentPage = 1
            this.getSspSlotList()
        },
        /**
         * [changePage 切换页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        changePage(val) {
            this.currentPage = val
            this.getSspSlotList()
        },
        /**
         * [sizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        sizeChange(size) {
            this.pageSize = size
            this.getSspSlotList()
        },
        /**
         * [toEditPage 路由跳转]
         * @param  {[type]} el [description]
         * @return {[type]}    [description]
         */
        toEditPage(row) {
            if (row && !!row.ssp_slot_id) {
                this.$router.push({name: 'ad-edit', query: {soltId: row.ssp_slot_id}})
            } else {
                this.$router.push({name: 'ad-edit'})
            }
        },
        /**
         * [toRevenue 跳转到数据中心]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        toRevenue(row) {
            this.$router.push({name: 'revenue', query: {slot_id: row.ssp_slot_id}})
        },

        /**
         * [filterSelectOpen 搜索内容变化时]
         * @param  {[type]} flag [description]
         * @return {[type]}      [description]
         */
        filterSelectOpen(query) {
            this.searchLoading = true
            this.getAppList(query)
        },
        /**
         * [getAppList 获取当前用户的应用列表
         * @return {[type]} [description]
         */
        async getAppList() {
            const res = await getAppList()

            if (res.code === 200) {
                this.allAppList = res.data.list
            }
        },
        /**
         * [handleReset 重置筛选结果]
         * @return {[type]} [description]
         */
        handleReset() {
            this.paramAdTypeId = [] // 广告类型ID数组
            this.paramStyleId = [] // 广告创意编号数组
            this.paramRenderId = [] // 渲染方式编号数组
            this.paramStatusDevId = [] // 用户控制的广告位状态数组
            this.paramAppId = [] // 所属应用ID数组
        }
    },
    watch: {
        /**
         * [paramAdTypeId 监听广告场景的变化]
         * @param  {[type]} newVal [description]
         * @param  {[type]} oldVal [description]
         * @return {[type]}        [description]
         */
        paramAdTypeId(newVal, oldVal) {

            // 联动原则
            // 1. 父级点选，子集对应显示，并且如果子集唯一则选中，
            // 2. 父级取消点选，子集对应减少， 已选中的子集取消
            // 3. 父级为空（减少到空），则显示全部子集，并且子集选中为空, 此种清空等同于2
            // 4. 父级为空（初始化）， 全为空

            let styleArr = [...this.$store.state.user.mediaAccordScene2AllStyle]
            let addOrLes = newVal.length > oldVal.length ? 'add' : 'less'
            let catheStyleId = [...this.paramStyleId] // 已经选中的子id

            // 筛选出父级对应的所有子集 和 新增加的父级id对应的单个子集
            let filterAllChild = [] // 所有父元素筛选出来的所有子集
            let singleParentFilterChild = [] // 单个父元素筛选出来的子集

            if (addOrLes === 'add') { // 增加
                let addParentId = newVal[newVal.length - 1] // 新增加的父级id

                styleArr.map(item => {
                    // 全部
                    newVal.map(child => {
                        if (item.parentId === child) {
                            filterAllChild.push(item)
                        }
                    })

                    if (item.parentId === addParentId) {
                        singleParentFilterChild.push(item)
                    }
                })

                if (singleParentFilterChild.length === 1 && catheStyleId.indexOf(singleParentFilterChild[0].id) < 0) {
                    catheStyleId.push(singleParentFilterChild[0].id)
                }

            } else { // 减少

                let lessParentId = oldVal.filter(x => !(newVal.indexOf(x) > -1))[0] // 减少的父级id

                styleArr.map(item => {
                    // 全部
                    newVal.map(child => {
                        if (item.parentId === child) {
                            filterAllChild.push(item)
                        }
                    })

                    if (item.parentId === lessParentId) {
                        singleParentFilterChild.push(item)
                    }
                })

                // 去除子元素选中
                for (let i = 0; i < singleParentFilterChild.length; i++) {
                    let _index = catheStyleId.indexOf(singleParentFilterChild[i].id)
                    if (_index > -1) {
                        catheStyleId.splice(_index, 1)
                    }
                }
            }

            this.mediaAccordScene2AllStyle = filterAllChild.length ? filterAllChild : styleArr
            this.paramStyleId = catheStyleId
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-title
    font-size: 16px
/deep/ .api
    .ivu-form-item
        white-space: normal
    .ivu-checkbox-wrapper
        font-size: 12px
    .ivu-form .ivu-form-item-label
        font-size: 12px
    .ivu-form-item
        margin-bottom: 8px
/deep/ .tips-handle
    margin-top: 24px
    .h-left
        float: left
    .h-right
        float: right
    .ivu-btn-text
        font-size: 12px
        color: #2d8cf0 !important
        padding: 0 6px
        &:hover
            background-color: transparent
        &:focus
            box-shadow: none
    .h-right
        .ivu-btn
            margin-left: 11px
            font-size: 12px
.option-box
    .option-left
        text-overflow: ellipsis
        white-space: nowrap
        height: 20px
        line-height: 20px
        overflow: hidden
        float: left
    .option-right
        text-align: right
        float: right
        color: #ccc
        height: 20px
        line-height: 20px
        width: 150px
        padding-right: 20px
</style>
