module.exports = {
    '/api': {
        target: 'http://grayapim.gladdigit.com/api', // 本地环境
        // target: 'http://apim.gladdigit.com/api', // 代理到本地环境
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}
