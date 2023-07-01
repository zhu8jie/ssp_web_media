import {mapActions} from 'vuex'

export const commonMixin = {
    data() {
        return {
            companyList: [], // 公司列表
            adTypeList: [], // 广告类型
            platform3rdList: [], // 第三方平台名称
            appStoreList: [] // 应用商店数据
        }
    },
    created() {
        this._getAllAdType() // 获取广告类型
        this._getPlatform3rd() // 获取第三方平台名称
    },
    computed: {
        osTypeList() { // 渲染方式  模板/自渲染
            return this.$store.getters.osType
        },
        renderTypeList() { // 渲染方式  模板/自渲染
            return this.$store.getters.renderType
        },
        accessTypeList() { // 接入方式 API/SDK
            return this.$store.getters.accessType
        }
    },
    methods: {
        ...mapActions([
            'getAllAdType',
            'getPlatform3rd'
        ]),
        /**
         * [_getAllAdType 获取广告类型]
         * @return {[type]} [description]
         */
        async _getAllAdType() {
            let storeUser = this.$store.state.user
            let resArr = storeUser.adTypeArr.length ? storeUser.adTypeArr : await this.getAllAdType()

            this.adTypeList = resArr
            // console.log('广告类型', resArr)
        },
        /**
         * [_getPlatform3rd 第三方平台名称]
         * @return {[type]} [description]
         */
        async _getPlatform3rd() {
            let storeUser = this.$store.state.user
            let resArr = storeUser.platform3rdArr.length ? storeUser.platform3rdArr : await this.getPlatform3rd()

            this.platform3rdList = resArr
            // console.log('3方平台数据', resArr)
        }
    }
}
