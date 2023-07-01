<template>
	<div class="page-main">
		<div class="left-table">
			<Card dis-hover :bordered="false">
				<h2 class="page-title">{{headTitle}} - 账单</h2>
				<div class="search-line">
					<DatePicker v-model="filterSearch.since" type="month" placeholder="请选择账单年月"></DatePicker>
					<Button type="primary" @click="doFilterList">查询</Button>
				</div>
				<div class="nav-handle-group">
					<RadioGroup v-model="filterSearch.status" type="button" @on-change="doFilterList">
						<!-- 状态，1=未申请，2=待初审，3=待终审，4=已审核，5=结算材料不全，6=已收结算材料, 7=已打款 -->
						<Radio :label="0">全部</Radio>
						<Radio :label="1">未申请</Radio>
						<Radio :label="2">待初审</Radio>
						<Radio :label="3">待终审</Radio>
						<Radio :label="4">已审核</Radio>
						<Radio :label="5">结算材料不全</Radio>
						<Radio :label="6">已收结算材料</Radio>
						<Radio :label="7">已打款</Radio>
					</RadioGroup>
				</div>
				<div class="console-table">
					<Table highlight-row stripe border :columns="appColumns" :data="colDatList" :loading="tableLoadFlag" :height="tableHeight">
						<!--状态-->
						<template slot-scope="{ row }" slot="status">
							<!-- 状态，1=未申请，2=待初审，3=待终审，4=已审核，5=结算材料不全，6=已收结算材料, 7=已打款 -->
							<Badge v-if="row.status == 1" status="default" text="未申请" />
							<Badge v-if="row.status == 2" status="warning" text="待初审" />
							<Badge v-if="row.status == 3" color="yellow" text="待终审" />
							<Badge v-if="row.status == 4" color="blue" text="已审核" />
							<Badge v-if="row.status == 5" color="red" text="结算材料不全（无发票）" />
							<Badge v-if="row.status == 6" color="lime" text="已收结算材料" />
							<Badge v-if="row.status == 7" color="green" text="已打款" />
						</template>
						<!--操作-->
						<template slot-scope="{ row, index }" slot="action">
							<!-- 查看 --》已打款 7 ; 已收结算材料 6; 结算材料不全（无发票）5; 已审核 4 -->
							<Button type="text" v-if="row.status >= 4 && row.pdf_file" @click="toOpenPdf(row)">查看</Button>
							<!-- 申请 --》 未申请 1 -->
							<Button type="text" v-if="row.status == 1" @click="toApplyFor(row)">申请</Button>
							<!-- 下载 --同查看逻辑 -->
							<Button type="text" v-if="row.status >= 4 && row.pdf_file" @click="toDownloadPdf(row)">下载</Button>
							<!-- 2=待初审, 3=待终审 -->
							<template v-if="row.status == 2 || row.status == 3">-</template>
						</template>
					</Table>
					<div class="page-center">
						<Page show-total show-elevator show-sizer placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange" />
					</div>
				</div>
			</Card>
		</div>
		<div class="right-demo">
			<div class="demo-card">
				<div class="demo-inner">
					<h4>结算信息</h4>
					<div class="settlement-info">

						<!-- 1 = 预付
						2 = 次月月底
						3 = 次次25日前
						4 = 次次月底 -->
						<p>
							<label>结算周期：</label>
							<template v-if="userInfo.settlement_period === 1">预付</template>
							<template v-else-if="userInfo.settlement_period === 2">次月月底</template>
							<template v-else-if="userInfo.settlement_period === 3">次次25日前</template>
							<template v-else-if="userInfo.settlement_period === 4">次次月底</template>
							<template v-else>-</template>
						</p>
						<p v-if="userInfo.cooperation_since"><label>合同有效期：</label>{{userInfo.cooperation_since | cooperationTimeFormat('yyyy年MM月dd日')}}-{{userInfo.cooperation_until | cooperationTimeFormat('yyyy年MM月dd日')}}</p>
						<p v-else><label>合同有效期：</label>-</p>
					</div>
					<h4>请按步骤确认结算单</h4>
					<Timeline class="time-line">
						<TimelineItem>
							<p class="time">【确认并盖章结算账单】</p>
							<p class="content">月度结算单通常在“次月第10个工作日”前展示，请在展示后及时确认并签章</p>
						</TimelineItem>
						<TimelineItem>
							<p class="time">【正确开具发票】</p>
							<p class="content">点击下图查看开票注意事项</p>
							<div class="see-img">
								<img src="~@/assets/image/finance.png">
								<i class="icon-zoom-up" title="点击放大查看" @click="toggleDemoImg"></i>
							</div>
						</TimelineItem>
						<TimelineItem>
							<p class="time">【发票与结算账单邮寄】</p>
							<p class="content">请下载系统账单，按照对应的邮寄地址邮寄</p>
						</TimelineItem>
						<TimelineItem>
							<p class="time">【打款进度】</p>
							<p class="content">我们收到合规发票和结算账单后按照结算周期在指定日期完成打款</p>
						</TimelineItem>
					</Timeline>
				</div>
			</div>
		</div>

		<!-- 点击放大图片或者视频 -->
		<Modal
			v-model="modalFlag"
			:mask-closable="false"
			:width="900"
			:footer-hide="true"
			@on-cancel="toggleDemoImg"
			class-name="vertical-center-modal"
		>
			<div class="modal-inner">
				<img src="~@/assets/image/finance.png">
			</div>
		</Modal>
	</div>
</template>

<script>
import { showTitle, downloadPDF } from '@/libs/util'
import { getBillList, changeBillStatus } from '@/api/finance'
import { getUserInfo } from '@/api/user'
import { tableHeight } from '@/mixin/calc-table-height.js'
import { formatDate, number2Thousand } from '@/libs/tools'


export default {
	mixins: [tableHeight],
	data() {
		return {
			pageSize: 10,
			total_count: 0,
			currentPage: 1,
			userInfo: {},

			filterSearch: {
				status: 0, // 状态，1=未申请，2=待初审，3=待终审，4=已审核，5=结算材料不全，6=已收结算材料, 7=已打款
				since: '', // 起始日期
				until: '' // 结束日期
			},

			tableLoadFlag: true, // 表格加载

			appColumns: [
				{
					title: '账单年月',
					key: 'date',
					width: 100
				},
				{
					title: '收入（元）',
					key: 'real_amount'
				},
				{
					title: '状态',
					slot: 'status'
				},
				{
					title: '操作',
					slot: 'action',
					width: 120
				}
			],
			colDatList: [],
			modalFlag: false

		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	filters: {
		timeFormat(time, format) {
			return formatDate(time * 1000, format)
		},
		cooperationTimeFormat(time, format) {
			return formatDate(new Date(time), format)
		},
		number2Thousand(number) {
			return number2Thousand(number)
		}
	},
	created() {
		this.getBillList() // 列表数据

		this.getUserInfo() // 媒体信息
	},
	mounted() {
		this.initTableHeight({'search-line': {isAutoCalc: false, isInclude: true}, 'nav-handle-group': true}) // search-line的高度
	},
	methods: {
		/**
		 * [getBillList description]
		 * @return {[type]} [description]
		 */
		getBillList() {

			this.tableLoadFlag = true

			let params = {
				...this.getAxiosParams(),
				...{
					page_size: this.pageSize,
					page_num: this.currentPage
				}
			}

			getBillList(params).then(res => {
				if (res.code === 200) {

					res.data.list.map(item => {
						item.date = formatDate(item.date * 1000, 'yyyy年MM月')
						item.real_amount = number2Thousand(item.real_amount / 100)
					})

					this.colDatList = res.data.list
					this.total_count = res.data.total
				}

			}).finally(() => {
				this.tableLoadFlag = false
			})
		},
		/**
		 * [getAxiosParams 获取下载和列表的url参数]
		 * @return {[type]} [description]
		 */
		getAxiosParams() {

			let _filter = this.filterSearch

			let params = {}

			// 状态
			!!_filter.status && (params.status = _filter.status)

			// 日期
			!!_filter.since && (params.since = new Date(_filter.since).getTime() / 1000)

			!!_filter.since && (params.until = params.since + 28 * 24 * 3600) // 取巧，直接+28天 

			return params
		},
		/**
		 * [getUserInfo 获取媒体信息，用于在发票信息使用]
		 * @return {[type]} [description]
		 */
		getUserInfo() {
			getUserInfo().then(res=> {
				if(res.code === 200) {
					this.userInfo = res.data
				}
			})
		},
		/**
		 * [doFilterMediaList 筛选媒体列表]
		 * @return {[type]} [description]
		 */
		doFilterList() {
			this.currentPage = 1
			this.getBillList()
		},
		/**
		 * [changePage 切换页码]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		changePage(val) {
			this.currentPage = val
			this.getBillList()
		},
		/**
		 * [sizeChange 切换每页条数时的回调]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		sizeChange(size) {
			this.pageSize = size
			this.getBillList()
		},
		/**
		 * [toOpenPdf 打开pdf]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toOpenPdf(row) {

			if(!row.pdf_file) {
				return
			}

			window.open(`${row.pdf_file}`, '_blank')
		},
		/**
		 * [toDownloadPdf 下载pdf]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toDownloadPdf(row) {
			if(!row.pdf_file) {
				return
			}

			downloadPDF(row.pdf_file, row.date)
		},
		/**
		 * [toApplyFor 跳转到首页]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toApplyFor(row) {
			this.$Modal.confirm({
				title: '确定申请?',
				onOk: () => {
					changeBillStatus({
						bill_id: row.id,
						status: 2
					}).then(res => {
						if (res.code === 200) {
							this.$Message.success('申请成功')

							this.getBillList()
						} else {
							this.$Message.error({ content: '操作失败', duration: 3})
						}
					})
				}
			})
		},
		/**
		 * [toggleDemoImg 点击查看大图]
		 * @return {[type]} [description]
		 */
		toggleDemoImg() {
			this.modalFlag = !this.modalFlag
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-main
	display: flex
	align-items: stretch
	.right-demo
		margin-left: 10px
		width: 466px
		flex: 0 0 466px
	.left-table
		flex: 1
.demo-card
	height: 100%
	display: block
	background: #fff
	border-radius: 2px
	font-size: 14px
	position: relative
	-webkit-transition: all 0.2s ease-in-out
	transition: all 0.2s ease-in-out
.demo-inner
	padding: 15px
	h4
		font-size: 16px
		font-weight: bold
		margin-bottom: 16px
.settlement-info
	overflow: hidden
	margin-bottom: 10px
	p
		font-size: 14px
		line-height: 2
		margin-bottom: 10px
		color: #666666
		label
			display: inline-block
			margin-right: 8px
			width: 100px
			color: #333
.time-line
	.time
		margin-top: -8px
		font-size: 16px
		font-weight: bold
		line-height: 2
		margin-bottom: 10px
	.content
		font-size: 14px
		color: #666666
		line-height: 24px
.see-img
	margin-top: 14px
	width: 120px
	border: 1px solid #D5D5D6
	border-radius: 2px
	overflow: hidden
	position: relative
	&:hover
		.icon-zoom-up
			display: block
	img
		max-width: 100%
	.icon-zoom-up
		display: none
		top: 0px
		left: 0px
		width: 100%
		height: 100%
		position: absolute
		cursor: pointer
		z-index: 1
		text-align: center
		line-height:74px
		font-size: 20px
.modal-inner
	text-align: center
	font-size: 0px
	img
		max-width: 100%
.page-title
	font-size: 16px
</style>
