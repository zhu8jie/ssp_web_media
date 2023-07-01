import axios from '@/libs/api.request'
import qs from 'qs'

/**
 * 获取首页基本数据
 * @param {Object} param - 参数
 */
export const getHomeDevInfo = () => {
    return axios.request({
        url: '/api/v1/home/user_dev_info',
        method: 'get'
    })
}

/**
 * 获取首页line图
 * @param {Object} param - 参数
 */
export const getHomeLine = (data) => {
    return axios.request({
        url: `api/v1/home/line?${qs.stringify(data)}`,
        method: 'get'
    })
}
