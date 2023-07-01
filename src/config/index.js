export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '媒体平台',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    APIUrl: {
        dev: { // 开发 - 切换到dev环境
            baseUrl: 'http://media.dev.deemob.com', // 基础请求接口
            adminComUrl: 'http://admin.dev.deemob.com' // ssp-admin 管理平台
        },
        deving: { // 开发环境
            baseUrl: 'http://media.dev.deemob.com', // 基础请求接口
            adminComUrl: 'http://admin.dev.deemob.com' // ssp-admin 管理平台
        },
        testing: { // 测试服务器
            baseUrl: 'http://media.test.deemob.com', // 基础请求接口
            adminComUrl: 'http://admin.test.deemob.com' // ssp-admin 管理平台
        },
        gray: { // 灰度
            baseUrl: 'https://media.gray.deemob.com', // 基础请求接口
            adminComUrl: 'https://admin.gray.deemob.com' // ssp-admin 管理平台
        },
        pro: { // 正式服务器
            baseUrl: 'http://apim.gladdigit.com', // 基础请求接口
            adminComUrl: 'http://apia.gladdigit.com' // ssp-admin 管理平台
        }
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    },
    /**
     * [requiredText 必填项不能为空]
     * @type {String}
     */
    requiredText: '表单填写有误, 请检查重试...'
}
