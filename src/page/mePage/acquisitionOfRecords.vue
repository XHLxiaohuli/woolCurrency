<template>
    <div>
        <div class="acquisitionOfRecordsHeader">
            <div>获取记录</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>  
        <ul class="acquisitionOfRecordsTextUl">
            <li v-for="item in acquisitionOfRecordsText">{{item}}</li>
        </ul>
        <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="acquisitionOfRecordsDataUl">
                <li v-for="item in acquisitionOfRecordsData">
                    <div>{{item.time}}</div>
                    <div>+{{item.ymbNum}}</div>
                    <div>
                        <span v-if="item.remark ==1">投票获得</span><span v-if="item.remark ==2">邀请获得</span><span v-if="item.remark ==3">注册获得</span><span v-if="item.remark ==4">签到获得</span><span v-if="item.remark ==5">项目被投票获得</span><span v-if="item.remark ==6">提现失败返还获得</span>
                    </div>
                </li>
            </ul>
        </v-loadmore>
        
    </div>
</template>
<script>
import { Loadmore } from "mint-ui";
import { storeGet, timestampToTime } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  components: {
    "v-loadmore": Loadmore
  },
  data() {
    return {
      acquisitionOfRecordsText: ["时间", "数量", "备注"],
      acquisitionOfRecordsData: [],
      allLoaded: false,
      pageNum: 1,
      dataCode: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/meAssets");
    },
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.getList();
      }
    },
    getList() {
      //获取其他记录
      let params = {
        userId: storeGet("userID"),
        currentPage: this.pageNum,
        pageSize: 20
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "currentPage=" + this.pageNum,
        "pageSize=" + 20
      ];
      let a =
        Encrypt.myFunction(myArr) + iconfig.ips.account_queryaccountlistpage;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.account.account_queryaccountlistpage(params, headers).then(res => {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          //this.acquisitionOfRecordsData=data.page.list
          for (var j = 0; j < res.data.page.list.length; j++) {
            this.acquisitionOfRecordsData.push(res.data.page.list[j]);
          }
          this.dataCode = 200;
        } else if (res.data.code == 400) {
          this.dataCode = 400;
          this.allLoaded = true;
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style scoped>
.acquisitionOfRecordsHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.acquisitionOfRecordsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.acquisitionOfRecordsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.acquisitionOfRecordsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.acquisitionOfRecordsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.acquisitionOfRecordsTextUl {
  width: 100%;
  margin-top: 0.5066666666666667rem;
}
.acquisitionOfRecordsTextUl:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.acquisitionOfRecordsTextUl > li {
  float: left;
  text-align: center;
  width: 3.066666666666667rem;
  font-size: 0.3466666666666667rem;
  color: #949494;
}
.acquisitionOfRecordsTextUl > li:nth-child(1) {
  width: 3.8666666666666667rem;
}
.acquisitionOfRecordsDataUl {
  width: 100%;
  margin-top: 0.5066666666666667rem;
}
.acquisitionOfRecordsDataUl > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.acquisitionOfRecordsDataUl > li {
  width: 100%;
  margin-bottom: 0.5066666666666667rem;
}
.acquisitionOfRecordsDataUl > li > div {
  float: left;
  width: 3.066666666666667rem;
  text-align: center;
}
.acquisitionOfRecordsDataUl > li > div:nth-child(1) {
  width: 3.8666666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.acquisitionOfRecordsDataUl > li > div:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #ff721f;
}
.acquisitionOfRecordsDataUl > li > div:nth-child(3) {
  font-size: 0.37333333333333335;
  color: #373d41;
}
</style>


