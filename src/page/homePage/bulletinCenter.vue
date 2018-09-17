<template>
    <div>
        <div class="bulletinCenterHeader">
            <div>公告中心</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>


       

        <v-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="bulletinCenterUl">
                <li v-for="item in bulletinCenterList" @click="jumpAnnouncement(item.noticeId)">
                    <div>
                        <div></div>
                        <div>{{item.createTime}}</div>
                    </div>
                    <div>
                        <p>{{item.title}}</p>
                        <p>{{item.introduction}}</p>
                    </div>
                </li>
            </ul>
        </v-loadmore>
    </div>
</template>
<script>
import { Loadmore } from "mint-ui";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
import { timestampToTime } from "scripts/moment";
export default {
  components: {
    "v-loadmore": Loadmore
  },
  data() {
    return {
      bulletinCenterList: [],
      allLoaded: false,
      pageNum: 1,
      dataCode: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/home");
    },
    jumpAnnouncement(val) {
      this.$router.push({ name: "announcement", query: { notice_id: val } });
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
        currentPage: this.pageNum,
        pageSize: 10
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "currentPage=" + this.pageNum,
        "pageSize=" + 10
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.notice_list;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.notice.notice_list(params, headers).then(res => {
        if (res.data.code == 200) {
          this.bulletinCenterList = res.data.page.list;
          for (let i in this.bulletinCenterList) {
            this.bulletinCenterList[i].createTime = timestampToTime(
              this.bulletinCenterList[i].createTime
            );
          }
          this.dataCode = 200;
        } else if (res.data.code == 400) {
          this.dataCode = 400;
          this.allLoaded = true;
        }
      });
    }
  }
};
</script>
<style scoped>
.bulletinCenterHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.bulletinCenterHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.bulletinCenterHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.bulletinCenterHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.bulletinCenterHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.bulletinCenterUl {
  width: 100%;
  margin-top: 0.64rem;
}
.bulletinCenterUl > li {
  width: 9.36rem;
  margin: auto;
}
.bulletinCenterUl > li > div:nth-child(1):after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.bulletinCenterUl > li > div:nth-child(1) > div {
  float: left;
}
.bulletinCenterUl > li > div:nth-child(1) > div:nth-child(1) {
  width: 0.24rem;
  height: 0.24rem;
  border-radius: 50%;
  background: #b8b8b8;
  position: relative;
  top: 0.02666666666666667rem;
  margin-right: 0.18666666666666668rem;
}
.bulletinCenterUl > li > div:nth-child(1) > div:nth-child(2) {
  font-size: 0.32rem;
  color: #949494;
}
.bulletinCenterUl > li > div:nth-child(2) {
  border-left: 1px solid #dfdfdf;
  box-sizing: border-box;
  padding-left: 0.24rem;
  margin-left: 0.1rem;
  padding-top: 0.32rem;
}
.bulletinCenterUl > li:last-child > div:nth-child(2) {
  border: 0;
}
.bulletinCenterUl > li > div:nth-child(2) > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  line-height: 0.64rem;
}
.bulletinCenterUl > li > div:nth-child(2) > p:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  line-height: 0.56rem;
  margin-top: 0.21333333333333335rem;
  padding-bottom: 0.8rem;
}
.bulletinCenterUl > li > div:nth-child(1) {
  margin-top: 0.13333333333333333rem;
  margin-bottom: 0.13333333333333333rem;
}
.bulletinCenterUl > li:first-child > div:nth-child(1) > div:nth-child(1) {
  background: #fec82f;
}
</style>


