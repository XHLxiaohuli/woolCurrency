<template>
  <div id="app">
    <!-- 缓存组件跳转的页面 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    
    <!-- 非缓存组件跳转的页面 -->
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
import api from './api'
import { Indicator,Toast } from 'mint-ui';
import md5 from "js-md5";
import Encrypt from 'scripts/encrypt'
import * as iconfig from 'scripts/iconfig'
export default {
  data(){
    return{

    }
  },
  created(){
    /*this.wxConfig();*/
    this.domainJump();
    //this.isSystem()
  },
  methods:{
    //不是http://www.bibang.top网址就跳到http://www.bibang.top
    domainJump(){
      // let windowRouter= window.location.pathname
      // if(window.location.origin=="http://www.bibang.org.cn"||window.location.origin=="https://www.bibang.org.cn"){
      // }else{
      //   window.location.href="http://www.bibang.org.cn"+windowRouter
      // }
    },
    //判断是ios还是安卓
    // isSystem(){
    //   var u = navigator.userAgent, app = navigator.appVersion;   
    //   var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
    //   var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
    //   if(isAndroid){
    //     console.log("这是安卓")
    //   }else if(isiOS){
    //     console.log("这是ios")
    //   }
    // }
  }
}
</script>

<style>
  #app{
    /* position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    overflow: scroll; */
    width: 100%;
    height: 100%;
  }
  ::-webkit-scrollbar{
    width: 0;
    height: 0;
  }
</style>
