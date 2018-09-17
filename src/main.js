// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import md5 from 'js-md5'
import axios from 'axios'
import VueAxios from 'vue-axios'
import stores from './store'
import Share from 'vue-social-share'
import '../node_modules/mint-ui/lib/style.css'
import 'vue-social-share/dist/client.css'
import FastClick from 'fastclick'
// import 'scripts/back'


Vue.config.productionTip = false

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

let util = {};
util.title = function (title){
  title = title || 'iView admin';
  window.document.title = title;
};

Vue.use(VueAxios, axios)
Vue.use(Share)

//自动返回首页顶部
router.afterEach((to,from,next) => {

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = document.body.scrollTop = 0;
  })

import { Header,Navbar,TabItem ,Swipe, SwipeItem, TabContainer, TabContainerItem ,Cell , InfiniteScroll,Spinner ,Popup ,Picker,Lazyload,Field  } from 'mint-ui'
Vue.component(Header.name, Header);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Cell.name, Cell);
Vue.component(Spinner.name, Spinner);
Vue.component(Popup.name, Popup);
Vue.component(Picker.name, Picker);
Vue.component(Field.name, Field);

Vue.use(InfiniteScroll);
Vue.use(Lazyload);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: stores,
  router,
  components: { App },
  template: '<App/>'
})
