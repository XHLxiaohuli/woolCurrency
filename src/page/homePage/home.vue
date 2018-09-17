<template>
    <div class="homeContainer">
        <div class="homeTop">
            <span>羊毛圈</span>
            <div class="myPost" @click="jumpPost">
                <span></span> <span>发帖子</span>
            </div>
        </div>
            <div v-show="!isNotice" class="fill"></div>
            <div v-show="isNotice" class="homeNotice" @click="jumpBulletinCenter">
                <div>
                    <span></span> <span>公告</span>
                </div>
                <div>{{homeNoticeText}}</div>
                <div></div>
            </div>
              <ul class="homeListUl" ref="box"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="30">
                  <li v-for="item in homeDataList" ref="list" :id="item.forumId">

                    <div class="homeListContent" @click="jumpDetails(item.forumId)">
                        <p>{{item.title}}</p>
                        <p>{{item.introduction}}</p>
                        <div>
                            <div>{{item.createTime}}</div>
                            <div>浏览次数: {{item.readNum}}</div>
                        </div>
                    </div>
                </li>
                </ul>
                <loading v-if="loading"></loading>
                <div v-else class="padds"></div>
    </div>
</template>
<script>
import api from "api";
import md5 from "js-md5";
import { Loading } from "components/layout";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
import {
  timestampToTime,
  storeSet,
  storeGet,
  sesStorage,
  sesGetStorage,
  storeRemove
} from "scripts/moment";
import { Indicator, InfiniteScroll, Toast } from "mint-ui";
import { setInterval, setTimeout } from "timers";
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      homeNoticeText: "",
      homeDataList: [],
      isNotice: false,
      allLoaded: false,
      pageNum: 1,
      dataCode: "",
      isLogin: "",
      detaCode:false,
    };
  },
  created() {
    /*this.setData();*/
    Indicator.open();
    this.liHeight();
  },
  methods: {
    //点击详情返回记录当前高度
    liHeight() {
      setTimeout(() => {
        document.getElementsByClassName("homeContainer")[0].scrollTop =
          document.getElementsByClassName("homeContainer")[0].scrollTop +
          sesGetStorage("liDistance") -
          88;
      }, 400);
    },
    jumpBulletinCenter() {
      this.$router.push("/bulletinCenter");
    },
    jumpPost() {
      this.$router.push("/post");
    },
    jumpDetails(val) {
      this.$router.push({ name: "details", query: { forum_id: val } });
      var liDistance =
        document.getElementById(val).offsetTop -
        document.documentElement.scrollTop;
      sesStorage("liDistance", liDistance);
    },
    setData() {
      //拉取数据storeGet("userID")
      this.isLogin = storeGet("userID");
      if (this.isLogin == null && this.isLogin == undefined) {
        this.$router.push("/loginAndRegister");
      } else {
        //获取公告详情接口
        let paramss = {
          currentPage: 1,
          pageSize: 1
        };
        let imyRequestId = Encrypt.myUuid();
        let imyTimestamp = Math.round(new Date().getTime()).toString();
        let imyArr = [
          "requestId=" + imyRequestId,
          "pageSize=" + 1,
          "currentPage=" + 1
        ];
        let ia = Encrypt.myFunction(imyArr) + iconfig.ips.notice_list;
        let imyValues = md5(ia).toUpperCase();
        let iheaders = {
          requestId: imyRequestId,
          timestamp: imyTimestamp,
          channelType: "h5",
          sign: imyValues
        };
        api.notice.notice_list(paramss, iheaders).then(res => {
          if (res.data.code == 200) {
            this.homeNoticeText = res.data.page.list[0].title;
            this.isNotice = true;
          } else {
            this.isNotice = false;
          }
        });
      }
    },
    /*loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.getList();
      }
    },*/
    //无限下拉
    loadMore() {
      if (this.homeDataList.length === 0) {
        this.loading = false;
      } else {
        this.loading = true;
      }
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
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_list;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      if(this.detaCode ===false){
       api.vote.vote_list(params, headers).then(res=>{
          if (res.data.code === 200) {
            for(let i=0; i<res.data.page.list.length; i++){
              res.data.page.list[i].createTime=timestampToTime(res.data.page.list[i].createTime)
              this.homeDataList.push(res.data.page.list[i])
            }
          /*let newData=[...res.data.page.list,...this.homeDataList]
           this.homeDataList = newData;*/
           this.loading=false;
           Indicator.close();
           this.pageNum++;
          }else if(res.data.code === 400){
            this.loading=false;
            Toast("别扯了，裤子都扯掉了！")
            this.detaCode=true;
          }
       })
     }else{
      this.loading=false;
     }
    }
  }
};
</script>
<style scoped>
.homeContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #f2f2f8;
  overflow: scroll;
}
::-webkit-scrollbar {
  width: 0;
}
.homeTop {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
  background: #fff;
  position: fixed;
  top: 0;
  z-index: 100;
}
.homeTop > span {
  font-size: 0.48rem;
  color: #373d41;
  line-height: 1.1733333333333333rem;
}
.myPost {
  position: absolute;
  right: 0.32rem;
  bottom: 0.29333333333333333rem;
}
.myPost > span:nth-child(1) {
  display: inline-block;
  width: 0.37333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/home_top_buttom_project@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.02666666666666667rem;
}
.myPost > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.homeNotice {
  width: 100%;
  height: 1.1733333333333333rem;
  background: #fff;
  position: relative;
  margin-bottom: 0.32rem;
  margin-top: 1.1733333333333333rem;
}
.homeNotice:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.homeNotice > div {
  float: left;
}
.homeNotice > div:nth-child(1) {
  margin-left: 0.32rem;
  margin-top: 0.37333333333333335rem;
}
.homeNotice > div:nth-child(1) > span:nth-child(1) {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  background: url("../../static/img/announcement@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.02666666666666667rem;
}
.homeNotice > div:nth-child(1) > span:nth-child(2) {
  font-size: 0.32rem;
  color: #373d41;
}
.homeNotice > div:nth-child(2) {
  font-size: 0.32rem;
  color: #373d41;
  line-height: 1.1733333333333333rem;
  margin-left: 0.21333333333333335rem;
}
.homeNotice > div:nth-child(3) {
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0.29333333333333333rem;
  top: 0;
  bottom: 0;
  margin: auto;
}
.homeListUl {
  width: 100%;
  /* padding-bottom: 2rem; */
}
.homeListUl li {
  width: 100%;
  background: #fff;
  margin-bottom: 0.21333333333333335rem;
  padding-top: 0.32rem;
  padding-bottom: 0.5333333333333333rem;
}
.homeListContent {
  width: 9.36rem;
  margin: auto;
}
.homeListContent > p:nth-child(1) {
  width: 100%;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.64rem;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.homeListContent > p:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.6933333333333334rem;
  margin-top: 0.21333333333333335rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.homeListContent > div:nth-child(3) {
  margin-top: 0.32rem;
}
.homeListContent > div:nth-child(3):after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.homeListContent > div:nth-child(3) > div:nth-child(1) {
  float: left;
  font-size: 0.32rem;
  color: #b8b8b8;
}
.homeListContent > div:nth-child(3) > div:nth-child(2) {
  float: right;
  font-size: 0.32rem;
  color: #b8b8b8;
}
.fill{
  width: 100%;
  height: 1.1733333333333333rem;
}
.padds{
  padding-top:1.36rem;
}
</style>

