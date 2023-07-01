// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView, {Message} from 'view-design'
import config from '@/config'

import '@/assets/stylus/theme.less'
// import '@/assets/stylus/base.styl'
import '@/assets/stylus/resetView.styl'
import '@/assets/stylus/iconfont.styl'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
Vue.component('Treeselect', Treeselect)

Vue.config.productionTip = false

/**
 * [$config 挂载config配置]
 * @type {[type]}
 */
Vue.prototype.$config = config
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {
        App
    },
    store,
    template: '<App/>'
})
