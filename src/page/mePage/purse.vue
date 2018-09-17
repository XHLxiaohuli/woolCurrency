<template>
    <div>
        <div class="purseHeader">
            <div>提现钱包</div>
            <div @click="back"><span></span><span>返回</span></div>
            <div class="purseContainer">
                <p class="btcWalletAddressText">以太坊地址</p>
                <div class="btcWalletAddressDiv" :style="'border-bottom:1px solid '+btcWalletAddressBor">
                    <input type="text" v-model="btcWalletAddressModel" @focus="btcWalletAddressFocus" @blur="btcWalletAddressBlur">
                </div>
                <p class="purseNumberText">数量</p>
                <div class="purseNumberDiv" :style="'border-bottom:1px solid '+purseNumberBor">
                    <input type="number" @input="purseNumberInput" v-model="purseNumberModel" @focus="purseNumberFocus" @blur="purseNumberBlur">
                </div>
                <div class="availableDiv"><span>可用: {{reduceAvailableYmb}} YMB</span><span v-if="false">手续费: 1.5%</span></div>
                <div class="actualAccountDiv">手续费: {{actualAccount}}<span>元</span></div>
                <button @click="purseSend" :disabled="purseDisabled" :class="{purseBtn:(btcWalletAddressModel=='')||(purseNumberModel=='')||(availableYmb<=0),yesPurseBtn:(btcWalletAddressModel!='')&&(purseNumberModel!='')&&(availableYmb>0)}">{{putForwardBtnText}}</button>
            </div>
            <div class="ruleOfCash">
                <p>提现手续费说明</p>
                <p>
                    <span>1-20000</span><span>10元</span><span>20001-30000</span><span>8元</span>
                </p>
                <p>
                    <span>30001-50000</span><span>6元</span><span>50001-100000</span><span>4元</span>
                </p>
                <p>
                    <span>100001以上</span><span>免手续费提现</span>
                </p>
                <p>注意：请认真核对提现地址，地址错误导致提现失败不可退回</p>
            </div>
        </div>
        <div class="purseMark" v-show="purseMarkShow">
            <div class="purseMarkTick"></div>
            <p>提现成功</p>
        </div> 
        <toast width="17em" v-model="showPositionValue" type="text" :time="1500" is-show-mask :text="pursePrompt" :position="position">{{('Basic Usage') }}</toast> 
    </div>
</template>
<script>
import { Toast } from "vux";
import { storeGet, isSystem } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  components: {
    Toast
  },
  data() {
    return {
      btcWalletAddressBor: "#eaeaea",
      purseNumberBor: "#eaeaea",
      availableYmb: "",
      reduceAvailableYmb: "",
      actualAccount: 0,
      btcWalletAddressModel: "",
      purseNumberModel: "",
      purseMarkShow: false,
      putForwardBtnText: "免手续费提现",
      userIpAddress: "",
      showPositionValue: false,
      pursePrompt: "",
      position: "",
      purseDisabled: false
    };
  },
  methods: {
    back() {
      this.$router.push("/meAssets");
    },
    btcWalletAddressFocus() {
      this.btcWalletAddressBor = "#FEC82F";
    },
    btcWalletAddressBlur() {
      this.btcWalletAddressBor = "#eaeaea";
    },
    purseNumberFocus() {
      this.purseNumberBor = "#FEC82F";
    },
    purseNumberBlur() {
      this.purseNumberBor = "#eaeaea";
    },
    purseNumberInput() {
      var num = this.purseNumberModel;
      // if(0<this.purseNumberModel&&this.purseNumberModel<this.reduceAvailableYmb){
      //     this.reduceAvailableYmb=this.availableYmb
      //     this.reduceAvailableYmb=(this.reduceAvailableYmb)-(this.purseNumberModel)
      // }else if(this.purseNumberModel>=this.reduceAvailableYmb){
      //     this.reduceAvailableYmb=0
      // }else if(this.purseNumberModel.length==0){
      //     this.reduceAvailableYmb=this.availableYmb
      // }
      if (this.purseNumberModel >= this.availableYmb) {
        this.purseNumberModel = this.availableYmb;
        num = this.availableYmb;
      }
      if (0 < num && num <= 20000) {
        this.actualAccount = 10;
        this.putForwardBtnText = "微信支付提现费用";
      } else if (20001 <= num && num <= 30000) {
        this.actualAccount = 8;
        this.putForwardBtnText = "微信支付提现费用";
      } else if (30001 <= num && num <= 50000) {
        this.actualAccount = 6;
        this.putForwardBtnText = "微信支付提现费用";
      } else if (50001 <= num && num <= 100000) {
        this.actualAccount = 4;
        this.putForwardBtnText = "微信支付提现费用";
      } else if (num > 100000) {
        this.actualAccount = 0;
        this.putForwardBtnText = "免手续费提现";
      }
    },
    purseSend() {
      var purseRs = /^[a-zA-Z0-9]+$/;
      var purseRss = purseRs.test(this.btcWalletAddressModel);
      if (this.btcWalletAddressModel != "" && this.purseNumberModel != "") {
        if (purseRss) {
          this.purseDisabled = true;
          let params = {
            userId: storeGet("userID"),
            ethAddress: this.btcWalletAddressModel,
            cashYMB: this.purseNumberModel,
            commission: this.actualAccount,
            payType: 1,
            ipAddress: this.userIpAddress
          };
          let myRequestId = Encrypt.myUuid();
          let myTimestamp = Math.round(new Date().getTime()).toString();
          let myArr = [
            "requestId=" + myRequestId,
            "userId=" + storeGet("userID"),
            "ethAddress=" + this.btcWalletAddressModel,
            "cashYMB=" + this.purseNumberModel,
            "commission=" + this.actualAccount,
            "payType=" + 1,
            "ipAddress=" + this.userIpAddress
          ];
          let a = Encrypt.myFunction(myArr) + iconfig.ips.account_appllycash;
          let myValues = md5(a).toUpperCase();
          let headers = {
            requestId: myRequestId,
            timestamp: myTimestamp,
            channelType: "h5",
            sign: myValues
          };
          api.account.account_appllycash(params, headers).then(res => {
            if (res.data.code == 200) {
              //this.purseMarkShow=true

              if (res.data.data.isJump === 0) {
                this.$router.push("/rresentRecord/" + storeGet("userID"));
              } else if (res.data.data.isJump === 1) {
                isSystem(res.data.data.weixinPayUrl);
                // window.webkit.messageHandlers.weixinPay.postMessage(res.data.data.weixinPayUrl);
                // window.location.href=res.data.data.weixinPayUrl
              }
            } else {
              this.pursePrompt = res.data.message;
              this.position = "middle";
              this.showPositionValue = true;
            }
          });
          setTimeout(() => {
            this.purseDisabled = false;
          }, 5000);
        }
      }
      // setTimeout(()=>{
      //     this.purseMarkShow=false
      // },5000)
    },
    sendAllYMB() {
      let params = {
        userId: storeGet("userID")
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = ["requestId=" + myRequestId, "userId=" + storeGet("userID")];
      let a =
        Encrypt.myFunction(myArr) + iconfig.ips.account_getuseraccountinfo;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.account.account_getuseraccountinfo(params, headers).then(res => {
        this.availableYmb = res.data.data.ymbNum;
        this.reduceAvailableYmb = res.data.data.ymbNum;
      });
      this.userIpAddress = returnCitySN["cip"];
    }
  },
  created() {
    this.sendAllYMB();
  }
};
</script>
<style scoped>
.purseHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.purseHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.purseHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.purseHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.purseHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.purseContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 1.04rem;
}
.btcWalletAddressText,
.purseNumberText {
  font-size: 0.3466666666666667rem;
  color: #949494;
  text-align: left;
}
.purseNumberText {
  margin-top: 0.5333333333333333rem;
}
.btcWalletAddressDiv,
.purseNumberDiv {
  width: 100%;
  margin-top: 0.4266666666666667rem;
}
.btcWalletAddressDiv > input,
.purseNumberDiv > input {
  width: 100%;
  padding-bottom: 0.26666666666666666rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.availableDiv {
  width: 100%;
  margin-top: 0.26666666666666666rem;
}
.availableDiv:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.availableDiv > span:nth-child(1) {
  float: left;
  font-size: 0.32rem;
  color: #373d41;
}
.availableDiv > span:nth-child(2) {
  float: right;
  font-size: 0.32rem;
  color: #373d41;
}
.actualAccountDiv {
  text-align: left;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  margin-top: 0.5333333333333333rem;
}
.actualAccountDiv > span {
  font-size: 0.32rem;
  color: #19001d;
}
.purseBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  background: #b8b8b8;
  border-radius: 0.10666666666666667rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  pointer-events: none;
}
.yesPurseBtn {
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  border: 0;
  margin-top: 1.0666666666666667rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.purseMark {
  width: 4.373333333333333rem;
  height: 3.68rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.10666666666666667rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.purseMarkTick {
  width: 1.1733333333333333rem;
  height: 1.1733333333333333rem;
  margin: auto;
  margin-top: 0.8rem;
  background: url("../../static/img/success@2x.png") no-repeat;
  background-size: 100% 100%;
}
.purseMark > p:nth-child(2) {
  text-align: center;
  font-size: 0.4266666666666667rem;
  color: #ffffff;
  margin-top: 0.32rem;
}
.ruleOfCash {
  width: 9.36rem;
  height: 5.413333333333333rem;
  margin: auto;
  margin-top: 0.8rem;
  background: #f2f2f8;
}
.ruleOfCash > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: left;
  padding-top: 0.5333333333333333rem;
  padding-left: 0.5333333333333333rem;
}
.ruleOfCash > p:nth-child(2),
.ruleOfCash > p:nth-child(3),
.ruleOfCash > p:nth-child(4) {
  font-size: 0.32rem;
  color: #373d41;
  text-align: left;
  padding-left: 0.5333333333333333rem;
  padding-top: 0.32rem;
}
.ruleOfCash > p:nth-child(2) > span:nth-child(2) {
  margin-left: 1.6266666666666667rem;
}
.ruleOfCash > p:nth-child(2) > span:nth-child(3) {
  margin-left: 1.0666666666666667rem;
}
.ruleOfCash > p:nth-child(2) > span:nth-child(4) {
  margin-left: 1.04rem;
}
.ruleOfCash > p:nth-child(3) > span:nth-child(2) {
  margin-left: 0.88rem;
}
.ruleOfCash > p:nth-child(3) > span:nth-child(3) {
  margin-left: 1.2rem;
}
.ruleOfCash > p:nth-child(3) > span:nth-child(4) {
  margin-left: 0.9066666666666666rem;
}
.ruleOfCash > p:nth-child(4) > span {
  font-weight: bolder;
}
.ruleOfCash > p:nth-child(4) > span:nth-child(2) {
  margin-left: 1.2533333333333334rem;
}
.ruleOfCash > p:nth-child(5) {
  width: 8.293333333333333rem;
  margin: auto;
  font-size: 0.32rem;
  color: #fc3d39;
  text-align: justify;
  margin-top: 0.5333333333333333rem;
  line-height: 0.64rem;
}
</style>

