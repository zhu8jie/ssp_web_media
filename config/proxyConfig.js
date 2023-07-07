module.exports = {
    '/api': {
        target: 'http://apim.gladdigit.com/api', // 本地环境
        // target: 'http://media.dev.deemob.com/api',
        // target: 'https://media.gray.deemob.com/api', // 代理到gray环境
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}
