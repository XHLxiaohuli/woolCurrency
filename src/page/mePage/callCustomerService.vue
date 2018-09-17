<template>
    <div>
        <div class="callCustomerServiceHeader">
            <div>联系客服</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="callCustomerServiceTop">
            <div>
                <span>客服微信</span><input  type="text" value="xbb2041" readonly="readonly"><button @click="copyWX" class="tag-read" data-clipboard-text="xbb2041">复制</button>
            </div>
            <div>
                <span>微信公众号</span><input type="text" value="xbtc12" readonly="readonly"><button @click="copyGZH" class="Gzh" data-clipboard-text="xbtc12">复制</button>
            </div>
            <div class="callCustomerServicePic">
                <img src="../../static/img/wxPic.jpg" alt="">
            </div>
        </div>
        <div class="fill"></div>
        <div class="feedback" @click="jumpFeedback">
            <p>意见反馈</p>
            <div></div>
        </div>
    </div>
</template>
<script>
import Clipboard from "clipboard";
import { Toast } from "mint-ui";
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    },
    jumpFeedback() {
      this.$router.push("/feedback");
    },
    copyWX() {
      var clipboard = new Clipboard(".tag-read");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    copyGZH() {
      var clipboard = new Clipboard(".Gzh");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    }
  }
};
</script>
<style scoped>
.callCustomerServiceHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.callCustomerServiceHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.callCustomerServiceHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.callCustomerServiceHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.callCustomerServiceHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.callCustomerServiceTop {
  width: 8.053333333333333rem;
  margin: auto;
  margin-top: 1.0933333333333333rem;
}
.callCustomerServiceTop > div:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.callCustomerServiceTop > div:nth-child(1) {
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 0.29333333333333333rem;
  position: relative;
}
.callCustomerServiceTop > div > span:nth-child(1) {
  float: left;
  font-size: 0.37333333333333335rem;
  color: #949494;
}
.callCustomerServiceTop > div > input:nth-child(2) {
  float: right;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  width: 2.24rem;
  margin-right: 1.8666666666666667rem;
}
.callCustomerServiceTop > div:nth-child(1) > button:nth-child(3) {
  border: 0;
  width: 1.3866666666666667rem;
  height: 0.6666666666666666rem;
  position: absolute;
  right: 0;
  bottom: 0.13333333333333333rem;
  font-size: 0.32rem;
  color: #373d41;
  background: #fec82f;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.1);
  border-radius: 0.05333333333333334rem;
}
.callCustomerServiceTop > div:nth-child(2) {
  position: relative;
  padding-top: 0.5333333333333333rem;
}
.callCustomerServiceTop > div:nth-child(2) > button:nth-child(3) {
  border: 0;
  width: 1.3866666666666667rem;
  height: 0.6666666666666666rem;
  position: absolute;
  right: 0;
  top: 0.4533333333333333rem;
  font-size: 0.32rem;
  color: #373d41;
  background: #fec82f;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.1);
  border-radius: 0.05333333333333334rem;
}
.callCustomerServicePic {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin-top: 0.5866666666666667rem;
}
.callCustomerServicePic > img {
  width: 100%;
  height: 100%;
}
.fill {
  width: 100%;
  height: 0.21333333333333335rem;
  background: #f2f2f8;
  margin-top: 0.5333333333333333rem;
}
.feedback {
  width: 9.413333333333334rem;
  height: 1.7066666666666668rem;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  margin: auto;
  position: relative;
}
.feedback > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  line-height: 1.7066666666666668rem;
}
.feedback > div:nth-child(2) {
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: url("../../static/img/return@2x.png") no-repeat;
  background-size: 100% 100%;
}
</style>


