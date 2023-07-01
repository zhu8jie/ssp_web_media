import axios from '@/libs/api.request'

/**
 * 登录接口
 * @param {Object} param - 参数
 */
export const getLogin = (data) => {
    return axios.request({
        method: 'POST',
        url: '/api/v1/user_dev/login',
        data
    })
}

/**
 * 注销登录
 * @param {Object} param - 参数
 */
export const logout = () => {
    return axios.request({
        url: '/api/v1/user_dev/logout',
        method: 'get'
    })
}

/**
 * 获取验证码
 * @param {Object} param - 参数
 */
export const getCode = () => {
    return axios.request({
        url: '/api/v1/base/get_captcha',
        method: 'get'
    })
}

/**
 * 注册
 * @param {Object} param - 参数
 */
export const getRegister = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/register',
        method: 'post',
        data
    })
}

/**
 * 获取财务信息
 * @param {Object} param - 参数
 */
export const getFinanceInfoApi = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/info_finance',
        method: 'get'
    })
}

/**
 * 账户信息
 * @param {Object} param - 参数
 */
export const getUserInfo = () => {
    return axios.request({
        url: '/api/v1/user_dev/info',
        method: 'get'
    })
}

/**
 * 账户的修改
 * @param {Object} param - 参数
 */
export const getUserUpdate = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/update',
        method: 'PUT',
        data
    })
}

/**
 * 账户的密码的修改
 * @param {Object} param - 参数
 */
export const getPasswordUpdate = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/update_pwd',
        method: 'PUT',
        data
    })
}

/**
 * 用户伪登录
 * @param {Object} param - 参数
 */
export const shamLogin = (data) => {
    return axios.request({
        url: '/api/v1/user_dev/sham_login',
        method: 'post',
        data
    })
}
