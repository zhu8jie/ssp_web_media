import axios from '@/libs/api.request'
import qs from 'qs'
/**
 * 获取汇总数据
 * @param {Object} param - 参数
 */
export const getIncomeSumApi = (data) => {
	return axios.request({
		url: `/api/v1/data_income/home_sum?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
/**
 * 获取密钥
 * @param {Object} param - 参数
 */
export const getApiKey = () => {
	return axios.request({
		url: `/api/v1/data_income/get_api_key`,
		method: 'get'
	})
}

/**
 * 获取线状图数据
 * @param {Object} param - 参数
 */
export const getIncomeLineApi = (data) => {
	return axios.request({
		url: `/api/v1/data_income/home_line?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}

/**
 * 获取表格数据
 * @param {Object} param - 参数
 */
export const getIncomeTableApi = (data) => {
	return axios.request({
		url: `/api/v1/data_income/home_table?${qs.stringify(data, {arrayFormat: 'repeat'})}`,
		method: 'get'
	})
}
