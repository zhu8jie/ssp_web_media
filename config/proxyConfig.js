module.exports = {
    '/api': {
        target: 'http://127.0.0.1:8877/api', // 本地环境
        // target: 'http://media.dev.deemob.com/api',
        // target: 'https://media.gray.deemob.com/api', // 代理到gray环境
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}
