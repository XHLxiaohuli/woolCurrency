<template>
    <div>
        <div class="meReleaseProjectHeader">
            <div>我发布的项目</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <v-loadmore v-if="noData" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="meReleaseProjectUl" >
                <li v-for="item in meReleaseProjectData">
                    <div class="meReleaseProjectPackage">
                        <p>{{item.time}}</p>
                        <div class="picAndText">
                            <div>
                                <img :src="item.logoUrl" alt="">
                            </div>
                            <div>
                                <p>{{item.itemName}}</p>
                                <p><span>累计收益</span><span>{{item.totalIncome }} YMB</span></p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </v-loadmore>
        
        <!--没数据的情况下-->
        <div class="meReleaseProjectNoData" v-if="!noData">
            <div class="noProjectDataPic"></div>
            <p>暂无发布内容</p>
            <p>赶紧去推荐撸羊毛项目，获取YMB吧~</p>
            <button @click="jumpRecommendableProjects" class="noProjectDataBtn">推荐项目</button>
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
      meReleaseProjectData: [],
      allLoaded: false,
      pageNum: 1,
      dataCode: "",
      noData: true
    };
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    },
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.getList();
      }
    },
    getList() {
      //我发布的项目列表(分页)
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
        Encrypt.myFunction(myArr) + iconfig.ips.vote_item_mypublishitemlist;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.item.vote_item_mypublishitemlist(params, headers).then(res => {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          for (var j = 0; j < res.data.page.list.length; j++) {
            this.meReleaseProjectData.push(res.data.page.list[j]);
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
    },
    jumpRecommendableProjects() {
      this.$router.push("/recommendableProjects");
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style scoped>
.meReleaseProjectHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.meReleaseProjectHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.meReleaseProjectHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.meReleaseProjectHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.meReleaseProjectHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.meReleaseProjectUl {
  width: 100%;
  background: #fff;
}
.meReleaseProjectUl > li {
  width: 100%;
  padding-bottom: 0.5333333333333333rem;
  border-bottom: 1px solid #f2f2f2;
}
.meReleaseProjectPackage {
  width: 9.36rem;
  margin: auto;
}
.meReleaseProjectPackage > p:nth-child(1) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  padding-top: 0.5333333333333333rem;
  padding-bottom: 0.32rem;
}
.picAndText {
  width: 100%;
}
.picAndText:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.picAndText > div {
  float: left;
}
.picAndText > div:nth-child(1) {
  width: 2.1333333333333333rem;
  height: 2.1333333333333333rem;
  margin-right: 0.21333333333333335rem;
}
.picAndText > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
}
.picAndText > div:nth-child(2) {
  width: 7.013333333333334rem;
}
.picAndText > div:nth-child(2) > p:nth-child(1) {
  width: 100%;
  text-align: left;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  line-height: 0.64rem;
  margin-bottom: 0.29333333333333333rem;
}
.picAndText > div:nth-child(2) > p:nth-child(2):after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.picAndText > div:nth-child(2) > p:nth-child(2) > span:nth-child(1) {
  float: left;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.picAndText > div:nth-child(2) > p:nth-child(2) > span:nth-child(2) {
  float: right;
  font-size: 0.37333333333333335rem;
  color: #ff721f;
}
.meReleaseProjectNoData {
  width: 8rem;
  margin: auto;
  margin-top: 4.08rem;
}
.noProjectDataPic {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  background: url("../../static/img/1-3-1我发布的项目-空状态@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: auto;
  margin-bottom: 0.32rem;
}
.meReleaseProjectNoData > p:nth-child(2),
.meReleaseProjectNoData > p:nth-child(3) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #949494;
  line-height: 0.56rem;
}
.noProjectDataBtn {
  border: 0;
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  margin-top: 0.5333333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
</style>
