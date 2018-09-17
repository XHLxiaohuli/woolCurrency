<template>
  <div class="fall"></div>
             <share :data-url="configUrl" 
            :data-title="configTitle" 
            :data-description="configDescription"
            :data-image="configImage"
            :data-disabled="configDesabled"></share>
</template>

<script>

export default {
  data(){
    configUrl:'http://vue-social-share.surge.sh/',
            configTitle:'title',
            configDescription:'shuoming',
            configImage:'',
            configDesabled:'google,qzone,weibo,douban,facebook,twitter,diandian,linkedin,tencent',
  }
  mounted() {
    window.socialShare(this.$el, this.config)
  }
}
</script>
