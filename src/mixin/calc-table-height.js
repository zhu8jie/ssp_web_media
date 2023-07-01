import { debounce, throttle } from '@/libs/tools'

export const tableHeight = {
    data() {
        return {
            tableHeight: 0 // 表格高度
        }
    },
    methods: {
        /**
         * [initTableHeight 表格高度]
         * [includeNodes 主要用于区分nav-handle-group: 42， search-line: 47]
         * isAutoCalc: 筛选栏目是否自动计算，因为筛选内容太长，会因为屏幕响应式变化，导致有时候会变成两行，所以获取dom元素自动计算
         * @return {[type]} [description]
         */
        initTableHeight(includeNodes) {
            this.tableHeight = document.body.clientHeight - this._excludeTableHeight(includeNodes)
            this.onresizeHeight(includeNodes)
        },

        /**
         * [_filterLineHeight 排除table的高度]
         * @return {[type]} [description]
         */
        _excludeTableHeight(includeNodes) {
            let filter_line_h = 0

            // 筛选栏存在
            if (includeNodes['search-line'] && includeNodes['search-line']['isInclude']) {
                if (includeNodes['search-line']['isAutoCalc']) {
                    filter_line_h = this.$refs['search-line'].offsetHeight
                } else {
                    filter_line_h = 10 + 32 // 默认32的高度 + 14的margintop
                }
            }

            let _height = 50 // header
                    + 20 // 上下边距（padding10 * 2）
                    + 30 // (card内边距padding15  * 2)
                    + 30 // page-title的高度
                    + filter_line_h
                    + (!!includeNodes['nav-handle-group'] ? 40 : 0)
                    + 5 // console-table的margin-top20
                    + 42; // page-center的高度32 + margin-top10

            return _height
        },
        /**
         * [onresizeHeight 屏幕变化时]
         * @return {[type]} [description]
         */
        onresizeHeight(includeNodes) {
            let _this = this

            window.onresize = debounce(function(){
                _this.tableHeight = document.body.clientHeight - _this._excludeTableHeight(includeNodes)
            }, 1000)
        }
    }
}