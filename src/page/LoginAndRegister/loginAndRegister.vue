<template>
    <div>
        <ul class="loginOrRegister">
            <li v-for="(item,index) in loginOrRegisterText" @click="LoginOrReg(index)" :class="{state:index==stateIndex}">{{item}}</li>
        </ul>
        <login v-if="stateIndex==0" :isJumpReg="stateIndex" @modify="stateModify($event)"></login>
        <register v-if="stateIndex==1"></register>
    </div>
</template>
<script>
import login from "@/page/LoginAndRegister/login";
import register from "@/page/LoginAndRegister/register";
export default {
  name: "loginAndRegister",
  components: {
    login,
    register
  },
  data() {
    return {
      loginOrRegisterText: ["登录", "注册"],
      stateIndex: 0
    };
  },
  methods: {
    LoginOrReg(index) {
      if (index == 0) {
        this.stateIndex = 0;
      } else if (index == 1) {
        this.stateIndex = 1;
      }
    },
    stateModify(msg) {
      this.stateIndex = msg;
    }
  }
};
</script>
<style scoped>
.loginOrRegister:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.loginOrRegister {
  width: 8rem;
  margin: auto;
  padding-top: 1.7066666666666668rem;
}
.loginOrRegister > li {
  float: left;
  font-size: 0.48rem;
  color: #949494;
  margin-right: 0.5333333333333333rem;
  padding-bottom: 0.16rem;
  box-sizing: border-box;
  border-bottom: 1px solid #fff;
}
.state {
  color: #373d41 !important;
  border-bottom: 1px solid #fec82f !important;
}
</style>

