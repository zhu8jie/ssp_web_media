import {mapActions} from 'vuex'
import { dataType } from '@/libs/util'

export const adTypeMixin = {
    data() {
        return {
            curAdTypeList: [], // 当前媒体的广告场景
            curAdRenderList: [], // 当前媒体的渲染方式
            mediaAccordScene2AllStyle: [] // 当前媒体根据广告场景，可以得到的全部样式
        }
    },
    created() {
        this._getSspSlotAdType()
    },
    methods: {
        ...mapActions([
            'getSspSlotAdType'
        ]),
        /**
         * [_getSspSlotAdType 获取当前媒体下可选的广告场景和渲染方式]
         * @return {[type]} [description]
         */
        async _getSspSlotAdType() {
            let storeUser = this.$store.state.user
            let result = storeUser.curMediaAdTypeArr.length ? storeUser.curMediaAdTypeArr : await this.getSspSlotAdType()

            this.mediaAccordScene2AllStyle = [...storeUser.mediaAccordScene2AllStyle] // 广告样式

            if (dataType(result) === 'object') {
                this.curAdTypeList = result.ad_type_select
                this.curAdRenderList = result.render_type_select
            } else {
                this.curAdTypeList = storeUser.curMediaAdTypeArr
                this.curAdRenderList = storeUser.curMediaRenderTypeArr
            }
        }
    }
}
