/*
 * @Author: xr@srun.com
 * @Date:   2019-03-26 17:07:35
 * @Last Modified by:   xr@srun.com
 * @Last Modified time: 2019-03-26 17:07:35
 */

/**
 * TODO:
 * + jQuery 改用 Axios
 * + srunTools 改名为 tools
 * + Less 优化:
 *   - 引用 conf.less 参数可配置
 *   - 引用 main.less 样式函数
 */

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang'
import echarts from 'echarts'
import config from './config'
import tools from './utils'
import './assets/iconfont/iconfont.js'
import axios from 'axios'

// 挂载到 vue 的原型上
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.config = config;
Vue.prototype.tools = tools;
Vue.config.productionTip = false;

Vue.use(ElementUI);

import $ from 'jquery'

// jQuery Ajax 扩展
let ajax = $.ajax;
$.extend({
    ajax(url, options) {
        if (typeof url === 'object') {
            options = url;
            url = undefined;
        }
        options = options || {};
        url = options.url;
        let xsrftoken = $('meta[name=_xsrf]').attr('content'),
            headers = options.headers || {},
            domain = document.domain.replace(/\./ig, '\\.');
        if (!/^(http:|https:).*/.test(url) || eval('/^(http:|https:)\\/\\/(.+\\.)*' + domain + '.*/').test(url)) {
            headers = $.extend(headers, {'X-Xsrftoken': xsrftoken});
        }
        options.headers = headers;
        return ajax(url, options);
    }
});

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: {App},
    template: '<App/>',
    render: h => h(App)
});
