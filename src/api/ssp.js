// 流量管理接口
import axios from '@/libs/api.request'
import qs from 'qs'

// ↓ 应用管理 start
/**
 * 获取应用列表
 * @param {Object} param - 参数
 */
export const getAppList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/app/list?${qs.stringify(data)}`
	})
}

/**
 * 新建/修改应用
 * @param {Object} param - 参数
 */
export const saveAppDetail = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/app/save',
		data
	})
}

/**
 * 获取应用详情
 * @param {Object} param - 参数
 */
export const getAppDetail = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/app/info?${qs.stringify(data)}`
	})
}

// ↑ 应用管理 end
// ↓ 广告位管理 start
/**
 * 获取广告位列表
 * @param {Object} param - 参数
 */
export const getSspSlotList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/ssp_slot/list?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}

/**
 * 获取广告位详情
 * @param {Object} param - 参数
 */
export const getSspSlotInfo = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/ssp_slot/info?${qs.stringify(data)}`
	})
}

/**
 * 新建/编辑广告位
 * @param {Object} param - 参数
 */
export const saveSspSlot = (data) => {
	return axios.request({
		method: 'post',
		url: '/api/v1/ssp_slot/save',
		data
	})
}

/**
 * 广告位开发者状态变更接口
 * @param {Object} param - 参数
 */
export const changeSspStatusDev = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/ssp_slot/status_dev',
		data
	})
}

/**
 * [素材支持列表]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export const getAdRatio = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/ad_ratio?${qs.stringify(data, {arrayFormat: 'repeat'})}`
	})
}
