import qs from 'qs'
import axios from '@/libs/api.request'
import config from '@/config'
import Vue from 'vue'

let APIUrl = ''
switch (process.env.NODE_ENV) {
    case 'development': // 开发
        APIUrl = config.APIUrl.dev
        break
    case 'production': // 生产
        APIUrl = config.APIUrl.pro
        break
    case 'testing': // test
        APIUrl = config.APIUrl.testing
        break
    case 'deving': // dev
        APIUrl = config.APIUrl.deving
        break
    case 'gray': // 灰度
        APIUrl = config.APIUrl.gray
        break
}

Vue.prototype.$APIUrl = APIUrl

/**
 * 获取省份数据
 * @param {Object} param - 参数
 */
export const getProvinceApi = () => {
    return axios.request({
        url: '/api/v1/base/get_province',
        method: 'get'
    })
}

/**
 * 根据省份ID获取城市数据
 * @param {Object} param - 参数
 */
export const getCityApi = (data) => {
    return axios.request({
        url: '/api/v1/base/get_city',
        method: 'get',
        params: data
    })
}

/**
 * 获取银行类型数据
 * @param {Object} param - 参数
 */
export const getBankTypeApi = () => {
    return axios.request({
        url: '/api/v1/base/get_bank_type',
        method: 'get'
    })
}

/**
 * 根据银行类型ID和城市ID获取银行数据
 * @param {Object} param - 参数
 */
export const getBankNameApi = (data) => {
    return axios.request({
        url: '/api/v1/base/get_bank',
        method: 'get',
        params: data
    })
}

/**
 * 文件上传
 * @param {Object} param - 参数
 */
export const uploadFile = (data) => {
    return axios.request({
        method: 'POST',
        url: '/api/v1/base/upload',
        data
    })
}

/**
 * 获取获取广告类型
 * @param {Object} param - 参数
 */
export const getAllAdType = () => {
    return axios.request({
        method: 'get',
        url: `${APIUrl.adminComUrl}/api/v1/base/get_ad_type`
    })
}

/**
 * 获取第三方平台名称
 * @param {Object} param - 参数
 */
export const getPlatform3rd = () => {
    return axios.request({
        method: 'get',
        url: `${APIUrl.adminComUrl}/api/v1/base/get_platform_3rd`
    })
}

/**
 * 获取应用商店数据
 * @param {Object} param - 参数
 */
export const getAppStore = (data) => {
    return axios.request({
        method: 'get',
        url: `${APIUrl.adminComUrl}/api/v1/base/get_app_store?${qs.stringify(data)}`
    })
}

/**
 * 获取获取应用类型
 * @param {Object} param - 参数
 */
export const getAppIndustry = (data) => {
    return axios.request({
        method: 'get',
        url: `${APIUrl.adminComUrl}/api/v1/base/get_industry?${qs.stringify(data)}`
    })
}

/**
 * 获取用户的配置信息
 * @param {Object} param - 参数
 */
export const getConfigInfoApi = (data) => {
    return axios.request({
        method: 'get',
        url: `/api/v1/user_dev/info?${qs.stringify(data)}`
    })
}

/**
 * 获取当前媒体下可选的广告场景和渲染方式
 * @param {Object} param - 参数
 */
export const getSspSlotAdType = () => {
    return axios.request({
        method: 'get',
        url: '/api/v1/ssp_slot/get_ad_type'
    })
}

/**
 * 导出CSV公用API
 * @param {Object} param - 参数
 */
export const getDownLoadXls = (data) => {
    return axios.request({
        method: 'post',
        url: '/api/v1/base/download_xls',
        data
    })
}

/**
 * 根据电话号码获取验证码
 * @param {Object} param - 参数
 */
export const geSendPhoneCode = (data) => {
    return axios.request({
        url: '/api/v1/base/send_phone_code',
        method: 'get',
        params: data
    })
}

/**
 * 昨天数据是否可以查看
 * @param {Object} param - 参数
 */
export const geYesterdayRead = () => {
    return axios.request({
        url: '/api/v1/base/yesterday_can_read',
        method: 'get'
    })
}

/**
 * 获取接入中心的列表
 * @param {Object} param - 参数
 */
export const getAccessList = () => {
    return axios.request({
        url: '/api/v1/doc_join_us/list',
        method: 'get'
    })
}

/**
 * 获取接入中心的详情页面
 * @param {Object} param - 参数
 */
export const getAccessLogList = (data) => {
    return axios.request({
        url: `/api/v1/doc_join_us/log_list?${qs.stringify(data)}`,
        method: 'get'
    })
}
