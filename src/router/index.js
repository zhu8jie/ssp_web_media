import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'view-design'

Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}

const router = new Router({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

// 路由判断
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()

    if (store.state.user.userId || to.name === 'adminLogin') { // 伪登陆
        next()
    } else {
        // 如果没有登录，访问非登录页面,则跳转到登录页面
        if (!to.path.match('/account/')) {
            next({
                path: '/account/login'
            })
        } else {
            // 如果没有登录，但访问的是登录页面,直接进入
            next()
        }
    }
})

router.afterEach(route => {
    iView.LoadingBar.finish()
})

export default router
