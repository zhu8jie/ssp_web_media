import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 获取账单列表
 * @param {Object} param - 参数
 */
export const getBillList = (data) => {
	return axios.request({
		method: 'get',
		url: `/api/v1/bill/list?${qs.stringify(data)}`
	})
}

/**
 * 修改账单状态
 * @param {Object} param - 参数
 */
export const changeBillStatus = (data) => {
	return axios.request({
		method: 'put',
		url: '/api/v1/bill/status',
		data
	})
}
