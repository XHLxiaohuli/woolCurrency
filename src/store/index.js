import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

Vue.config.debug = debug
Vue.config.warnExpressionErrors = false

import savePosition from './modules/savePosition';
export default new Vuex.Store({
    modules: {
        savePosition,//保存列表位置
      }
})
