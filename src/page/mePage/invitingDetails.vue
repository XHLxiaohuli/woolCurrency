<template>
    <div>
        <div class="invDetHeader">
            <div>邀请明细</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <ul class="invDetUlText">
            <li>用户名</li>
            <li>初次登陆时间</li>
            <li>获得奖励</li>
        </ul>
        <v-loadmore v-if="noData" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="invDetUlData">
                <li v-for="item in invDetData">
                    <div>{{item.username}}</div>
                    <div>{{item.time}}</div>
                    <div>{{item.getYMB}}YMB</div>
                </li>
            </ul>
        </v-loadmore>
        <div class="noDataDiv" v-if="!noData">
            <div class="noDataPic"></div>
            <p class="noDataText">亲，您还没有邀请过好友，赶紧去邀请好友加入吧</p>
        </div>
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
      invDetData: [],
      allLoaded: false,
      pageNum: 1,
      dataCode: "",
      noData: true
    };
  },
  methods: {
    back() {
      this.$router.push("/invitingFriends");
    },
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.getList();
      }
    },
    getList() {
      let params = {
        userId: storeGet("userID"),
        currentPage: this.pageNum
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "currentPage=" + this.pageNum
      ];
      let a =
        Encrypt.myFunction(myArr) + iconfig.ips.invite_queryinvitelistpage;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.invite.invite_queryinvitelistpage(params, headers).then(res => {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          for (var j = 0; j < res.data.page.list.length; j++) {
            this.invDetData.push(res.data.page.list[j]);
          }
          this.dataCode = 200;
        } else if (res.data.code == 400) {
          this.dataCode = 400;
          this.allLoaded = true;
        }
        if (this.pageNum == 1) {
          if (res.data.code == 400) {
            this.noData = false;
          }
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
.invDetHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.invDetHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.invDetHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.invDetHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.invDetHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.invDetUlText {
  background: #fff;
  width: 100%;
  margin-top: 0.5066666666666667rem;
  padding-bottom: 0.32rem;
}
.invDetUlText:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.invDetUlText > li {
  float: left;
  text-align: center;
  width: 3.066666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
  line-height: 0.56rem;
}
.invDetUlText > li:nth-child(2) {
  width: 3.8666666666666667rem;
}
.invDetUlData {
  width: 100%;
  background: #fff;
}
.invDetUlData > li {
  margin-bottom: 0.32rem;
}
.invDetUlData > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.invDetUlData > li > div {
  float: left;
  width: 3.066666666666667rem;
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.56rem;
}
.invDetUlData > li > div:nth-child(2) {
  width: 3.8666666666666667rem;
}
.noDataDiv {
  width: 100%;
  background: #fff;
  margin-top: 4.346666666666667rem;
}
.noDataPic {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin: auto;
  background: url("../../static/img/@2x.png") no-repeat;
  background-size: 100% 100%;
}
.noDataText {
  font-size: 0.37333333333333335rem;
  color: #949494;
  text-align: center;
  margin-top: 0.32rem;
}
</style>
