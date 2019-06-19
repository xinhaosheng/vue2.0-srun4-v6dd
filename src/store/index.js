/*
 * @Author: xr@srun.com
 * @Date:   2019-03-26 17:07:35
 * @Last Modified by:   xr@srun.com
 * @Last Modified time: 2019-03-26 17:07:35
 */

/**
 * TODO:
 * + Vuex 结构优化，使用 commit 改变状态
 */

import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex);
import Notice_store from '@/components/notice/Notice_store.js';                 // 引入 Notice 组件

export default new vuex.Store({
    modules: {
        notice: Notice_store,
    }
})
