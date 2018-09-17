<template>
    <div>
         <div class="oneReplacePhoneHeader">
            <div>手机号码</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="oneReplacePhoneContainer">
            <div class="oneReplacePhoneNum">
                <div>手机号码</div>
                <div>{{oldPhoneNum}}</div>
            </div>
            <button class="oneReplacePhoneBtn" @click="jumpTowReplacePhone">更改绑定手机号码</button>
        </div>
    </div>
</template>
<script>
import { sesGetStorage } from "scripts/moment";
export default {
  data() {
    return {
      oldPhoneNum: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/userCenter");
    },
    jumpTowReplacePhone() {
      this.$router.push("/towReplacePhone");
    },
    pullPhone() {
      this.oldPhoneNum = sesGetStorage("userphone");
    }
  },
  created() {
    this.pullPhone();
  }
};
</script>
<style scoped>
.oneReplacePhoneHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.oneReplacePhoneHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.oneReplacePhoneHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.oneReplacePhoneHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.oneReplacePhoneHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.oneReplacePhoneContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.0666666666666667rem;
}
.oneReplacePhoneNum {
  width: 100%;
  height: 1.6533333333333333rem;
  line-height: 1.6533333333333333rem;
  border-bottom: 1px solid #f2f2f2;
}
.oneReplacePhoneNum:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.oneReplacePhoneNum > div:nth-child(1) {
  float: left;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.oneReplacePhoneNum > div:nth-child(2) {
  float: right;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.oneReplacePhoneBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  margin-top: 1.04rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>

