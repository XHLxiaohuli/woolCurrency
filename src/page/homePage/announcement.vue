<template>
    <div>
        <div class="announcementHeader">
            <div>公告中心</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="wrap">
            <h1>{{detailData.title}}</h1>
            <div class="contt" v-html="detailData.content"></div>
            <p>新币榜运营团队</p>
            <p>{{detailData.createTime}}</p>
        </div>
    </div>    
</template>
<script>
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
import { timestampToTime } from "scripts/moment";
export default {
  data() {
    return {
      detailData: {}
    };
  },
  created() {
    this.setData();
  },
  methods: {
    back() {
      this.$router.push("/bulletinCenter");
    },
    setData() {
      let params = {
        noticeId: this.$route.query.notice_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "noticeId=" + this.$route.query.notice_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.notice_detail;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.notice.notice_detail(params, headers).then(res => {
        this.detailData = res.data.data;
        this.detailData.createTime = timestampToTime(res.data.data.createTime);
      });
    }
  }
};
</script>
<style scoped>
.announcementHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.announcementHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.announcementHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.announcementHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.announcementHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.wrap {
  padding: 0 0.32rem;
}
.wrap h1 {
  font-size: 0.526rem;
  font-weight: bold;
  text-align: center;
  line-height: 0.64rem;
  padding: 0.426rem 0;
}
.wrap p {
  text-align: right;
  color: #949494;
  font-size: 0.32rem;
  line-height: 0.55rem;
}
.contt {
  padding-bottom: 0.8rem;
  font-size: 0.373rem;
  line-height: 0.693rem;
  color: #373d41;
}
</style>


