<template>
    <div>
        <div class="voteContainer">
            <audio src="/static/mie3.mp3" controls="controls" ref="music" hidden></audio>
            <div class="voteTopText">投票</div>
            <div class="bannarDiv">
                <button @click="openRuleMask">规则</button>
                <button @click="jumpRecommendable">我要发布项目</button>
            </div>
            <div class="voteSearchDiv">
                <div><input placeholder="项目名称、发布人昵称"  type="text" v-model="searchStr"><button @click="searchData()">搜索</button></div>
            </div>

              <ul class="voteSubjectUl" v-if="conShow"
                  v-infinite-scroll="loadMore"
                  infinite-scroll-disabled="loading"
                  infinite-scroll-distance="30">
                  <li v-for="(item,index) in voteSubjectList">
                      <div class="widerThanAuthor">
                          <div><img :src="item.logoUrl" alt=""></div>
                          <div>
                              <p>{{item.publishUsername}}</p>
                              <p @click="jumpHttp(item.websiteAddress)">{{item.websiteAddress}}</p>
                          </div>
                          <!-- <button><span></span> 分享</button> -->
                      </div>
                      <h2 class="voteSubjectTitle" >{{item.itemName}}</h2>
                      <p class="voteSubjectText">{{item.introduce}}</p>
                      <!-- <span v-if="iShow" class="ishow" @click="textToggle(index,iShow)">[单击展开]</span>
                      <span v-else class="ishow" @click="textToggle(index,iShow)">[单击关闭]</span> -->
                      <button :disabled="voteDisabled" class="voteBtn" @click="voteAdd(item.itemId,index)">助力投票</button>
                      <p class="voteSubjectNumber">{{item.voteCount}}</p>
                      <div class="voteMedal" v-if="index<=2">
                          <img v-if="index==0" src="../../static/img/one@2x.png" alt="">
                          <img v-if="index==1" src="../../static/img/2@2x.png" alt="">
                          <img v-if="index==2" src="../../static/img/3@2x.png" alt="">
                      </div>
                      <div class="voteMedal" v-else>
                        <span>No.{{index+1}}</span>
                      </div>
                  </li> 
              </ul>
              
           
            <!--找不到-->
            <div class="CanItFindDiv"  v-else>
                <div></div>
                <p>搜索不到您要的结果，换个关键词试试哦～</p>
                <button @click="showAll()">显示全部内容</button>
            </div>
            <loading v-if="loading"></loading>
            <div v-else class="padds"></div>
            <!--蒙版-->
            <div class="voteMask" v-if="false">
                <div>
                    <p>今日投票次数已用完请明天再来</p>
                    <button>分享好友投票</button>
                    <div><img src="../../static/img/top_delete@2x.png" alt=""></div>
                </div>
            </div>
            <div class="getBack" v-if="showBackTop" @click="getBack"></div>
            
            
        </div>
        <!--签到登录-->
        <sigend v-if="isShow" :signData="signDatas" @signChild="signClose"></sigend>

        <div class="mackHDYMB" v-show="mackHDYMBShow">
                <p class="mackHDYMB1">恭喜！领取投票奖励</p>
                <p class="mackHDYMB2">+{{votingReward}}YMB</p>
                <div class="mackHDYMB3"></div>
        </div>
        <!--规则-->
        <div class="ruleMask" v-show="ruleMaskShow">
          <div class="ruleMaskDiv">
            <p class="ruleExplain">规则说明</p>
            <p class="releaseRule">发布项目</p>
            <div class="ruleContent">
              <p class="ruleText1">所需信息：</p>
              <p class="ruleText2">1.成功发布项目后，在榜单上可进行投票，项目每获取1票即奖励您2YMB；</p>
              <p class="ruleText3">2.项目可分享给好友，邀请其参与投票，票数越多，奖励越多；</p>
              <p class="ruleText4">3.平台有权对非法项目，虚假项目进行强制下线。</p>
              <p class="ruleText5">投票规则</p>
              <p class="ruleText6">1.每人每日最多5次投票机会，可投给同一个或不同项目；</p>
              <p class="ruleText7">2.投票者每投1票，即可获得4YMB；</p>
              <p class="ruleText8">3.新币榜项目排行根据票数多少排名先后。</p>
              <div class="ruleCole" @click="coleRuleMask"></div>
            </div>
          </div>
        </div>
        <div class="getBack" v-if="showBackTop" @click="getBack"></div>
    </div>
</template>
<script>
import { Signed,Loading } from "components/layout";
import { storeSet, storeGet, storeRemove, showBack } from "scripts/moment";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
import { Indicator, InfiniteScroll, Toast} from "mint-ui";
export default {
  components: {
    sigend: Signed,
    Loading
  },
  data() {
    return {
      loading:false,
      conShow: true,
      searchStr: "",
      voteSubjectList: [],
      mackHDYMBShow: false,
      ruleMaskShow: false,
      votingReward: "",
      isShow: false,
      signDatas: [],
      showBackTop: false,
      isLogin: "",
      voteDisabled: false,
      /*active:-1,
            iShow:true,*/
      allLoaded: false,
      pageNum: 1,
      detaCode:false
    };
  },
  created() {
    /*this.setData();*/
    Indicator.open();
    this.userDailyAccessInterface();
    this.signClick();
    if (document.body.scrollTop > 500) {
      this.showBackTop = true;
    }
  },
  mounted() {
    showBack(status => {
      this.showBackTop = status;
    });
  },
  methods: {
    isIOS() {
      var ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) {
        return true;
      } else {
        return false;
      }
    },
    //音频播放
    playPause() {
      var audio = this.$refs.music;
      /*var audio = document.getElementById("musics");*/
      audio.pause();
      audio.currentTime = 0;

      setTimeout(() => {
        audio.play();
      }, 150);
    },
    /*签到奖励*/
    signClick() {
      let isFirst = storeGet("todayFirst");
      let isUser = storeGet("userID");
      if(isFirst != null && isUser != null){
      let params = {
        userId: storeGet("userID")
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = ["requestId=" + myRequestId, "userId=" + storeGet("userID")];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_usersign;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.voteuser.vote_usersign(params, headers).then(res => {
        if (res.data.code === 501) {
          this.isShow = false;
          //今日已经签到
        } else if (res.data.code === 200) {
          this.signDatas = res.data.data;
          this.isShow = true;
        }
      });
      }
    },
    //签到关闭
    signClose(data) {
      if (data) {
        this.isShow = !this.isShow;
      }
    },
    textToggle(index, iShow) {
      if (iShow) {
        this.active = index;
        this.iShow = false;
      } else {
        this.active = -1;
        this.iShow = true;
      }
    },
    userDailyAccessInterface() {
      let isFirst = storeGet("todayFirst");
      let isUser = storeGet("userID");
      if (isFirst == null && isUser != null) {
        /*}
      if (
        storeGet("todayFirst") == null ||
        storeGet("todayFirst") == undefined
      ) {*/
        //添加用户每天访问量接口
        let params = {
          userId: storeGet("userID")
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID")
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_saveusertoken;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_saveusertoken(params, headers).then(res => {
          if (res.data.code == 200) {
            // this.signClick();
            storeSet("todayFirst", "todayFirst");
            // window.location.reload()
          }
        });
      } else {
        var nowTime = Date.parse(new Date());
        var towDayTime =
          new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000;
        var timeDifferenceValue = towDayTime / 1000 - nowTime / 1000;
        var times = setInterval(() => {
          timeDifferenceValue--;
          if (timeDifferenceValue <= 0) {
            // window.location.reload()
          }
        }, 1000);
      }
    },
    showAll() {
      this.pageNum=1;
      this.setData();
      this.conShow = true;
    },
    getBack() {
      var time = setInterval(() => {
        document.getElementsByClassName("voteContainer")[0].scrollTop =
          document.getElementsByClassName("voteContainer")[0].scrollTop - 30;
        if (
          document.getElementsByClassName("voteContainer")[0].scrollTop === 0
        ) {
          clearInterval(time);
        }
      }, 1);
    },
    jumpRecommendable() {
      this.$router.push("/recommendableProjects");
    },
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.setData();
      }
    },
    loadMore(){
      if(this.voteSubjectList.length === 0){
        this.loading = false
      }else{
        this.loading = true;
      }
      this.isLogin = storeGet("userID");
      if (this.isLogin == null && this.isLogin == undefined) {
        this.$router.push("/loginAndRegister");
      } else {
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
        let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_item_list;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        if(this.detaCode === false){
        api.item.vote_item_list(params, headers).then(res => {
          if (res.data.code === 200) {
            for(let i=0; i<res.data.page.list.length; i++){
              this.voteSubjectList.push(res.data.page.list[i])
            }
            /*let newData = [...res.data.page.list,...this.voteSubjectList]
            this.voteSubjectList=newData;*/
            this.loading=false;
            Indicator.close();
            this.pageNum++;
          }else if (res.data.code === 413) {
            Toast(res.data.message);
            this.$router.push("/loginAndRegister");
          } else if (res.data.code === 400) {
            this.loading=false;
            Toast("别扯了，裤子都扯掉了！")
            this.detaCode=true;
          }
        })
      }else{
        this.loading=false;
      }
      }
    },
   setData() {
      //项目列表
      this.isLogin = storeGet("userID");
      if (this.isLogin == null && this.isLogin == undefined) {
        this.$router.push("/loginAndRegister");
      } else {
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
        let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_item_list;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.item.vote_item_list(params, headers).then(res => {
          if (res.data.code === 200) {
            this.voteSubjectList = res.data.page.list;
          } else if (res.data.code === 413) {
            Toast(res.data.message);
            this.$router.push("/loginAndRegister");
          } else if (res.data.code === 400) {
            this.dataCode = 400;
            this.allLoaded = true;
          }
        });
      }
    },
    searchData() {
      //项目搜索
      if (this.searchStr.length === 0) {
        this.pageNum=1;
        this.setData();
        this.conShow = true;
      } else {
        let params = {
          userId: storeGet("userID"),
          keyword: this.searchStr,
          currentPage: 1
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID"),
          "keyword=" + this.searchStr,
          "currentPage=" + 1
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_item_searchlist;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.item.vote_item_searchlist(params, headers).then(res => {
          if (res.data.code === 400) {
            this.conShow = false;
          } else if (res.data.code === 200) {
            this.voteSubjectList = res.data.page.list;
          }
        });
      }
    },
    voteAdd(itemid, index) {
      this.$refs.music.volume = 0;
      if (this.isIOS()) {
        this.$refs.music.play();
        this.$refs.music.pause();
      }
      //项目投票
      this.voteDisabled = true;
      let params = {
        userId: storeGet("userID"),
        itemId: itemid
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "itemId=" + itemid
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_item_vote;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.item.vote_item_vote(params, headers).then(res => {
        if (res.data.code === 200) {
          // Toast("投票成功");
          this.$refs.music.volume = 1;
          this.playPause(); //羊叫
          this.votingReward = res.data.extData.voteAwardNum;
          this.mackHDYMBShowUun();
          this.voteSubjectList[index].voteCount++;
        } else if (res.data.code === 501) {
          Toast({
            message: res.data.message,
            duration: 500
          });
        }
        setTimeout(() => {
          this.voteDisabled = false;
        }, 1000);
      });
    },
    mackHDYMBShowUun() {
      this.mackHDYMBShow = true;
      setTimeout(() => {
        this.mackHDYMBShow = false;
      }, 1000);
    },
    openRuleMask() {
      this.ruleMaskShow = true;
    },
    coleRuleMask() {
      this.ruleMaskShow = false;
    },
    jumpHttp(website) {
      var isHttp = website.split("://");
      var httpWebsite;
      if (isHttp.length > 1) {
        httpWebsite = "http://" + isHttp[1];
      } else {
        httpWebsite = "http://" + isHttp[0];
      }
      window.location.href = httpWebsite;
    }
  }
};
</script>
<style scoped>
.voteContainer {
  position:relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #f2f2f8;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 0;
}
.voteTopText {
  width: 100%;
  height: 1.1733333333333333rem;
  line-height: 1.1733333333333333rem;
  text-align: center;
  font-size: 0.48rem;
  color: #373d41;
  border: 1px solid #f2f2f2;
  background: #fff;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 100;
}
.bannarDiv {
  width: 100%;
  height: 5.76rem;
  background: url("../../static/img/banner@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  margin-top: 1.1733333333333333rem;
}
.bannarDiv > button:nth-child(1) {
  border: 0;
  padding: 0.08rem 0.293rem;
  background: rgba(254, 200, 47, 0.2);
  border: 1px solid #fec82f;
  border-radius: 2.6666666666666665rem;
  font-size: 0.32rem;
  color: #ffffff;
  position: absolute;
  top: 0.32rem;
  left: 0.32rem;
}
.bannarDiv > button:nth-child(2) {
  border: 0;
  width: 4.213333333333333rem;
  height: 1.1733333333333333rem;
  background: url("../../static/img/WYFBXM.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 3.8133333333333335rem;
  left: 2.986666666666667rem;
  font-size: 0.37333333333333335rem;
  font-weight: bolder;
}
.voteSearchDiv {
  width: 100%;
  background: #fff;
  padding-top: 0.8rem;
  padding-bottom: 0.5333333333333333rem;
  margin-bottom: 0.21333333333333335rem;
}
.voteSearchDiv > div {
  width: 9.36rem;
  height: 0.9333333333333333rem;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  margin: auto;
  margin-bottom: 0.21333333333333335rem;
  position: relative;
}
.voteSearchDiv > div > input:nth-child(1) {
  width: 7.076666666666667rem;
  height: 0.8533333333333334rem;
  padding-left: 0.15rem;
  font-size: 0.32rem;
  color: #373d41;
}
.voteSearchDiv > div > button:nth-child(2) {
  border: 0;
  width: 2.1333333333333333rem;
  height: 100%;
  background: #eaeaea;
  border-radius: 0 0.10666666666666667rem 0.10666666666666667rem 0;
  font-size: 0.37333333333333335rem;
  color: #373d41;
}
.voteSubjectUl {
  width: 100%;
}
.voteSubjectUl li {
  width: 100%;
  background: #fff;
  margin-bottom: 0.21333333333333335rem;
  padding-top: 0.4266666666666667rem;
  padding-bottom: 0.5333333333333333rem;
  position: relative;
}
.widerThanAuthor {
  width: 100%;
  position: relative;
}
.widerThanAuthor:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.widerThanAuthor > div {
  float: left;
}
.widerThanAuthor > div:nth-child(1) {
  width: 0.8533333333333334rem;
  height: 0.8533333333333334rem;
  margin-left: 1.3866666666666667rem;
}
.widerThanAuthor > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
}
.widerThanAuthor > div:nth-child(2) {
  margin-left: 0.21333333333333335rem;
}
.widerThanAuthor > div:nth-child(2) > p:nth-child(1) {
  font-size: 0.32rem;
  color: #373d41;
  line-height: 0.4266666666666667rem;
}
.widerThanAuthor > div:nth-child(2) > p:nth-child(2) {
  width: 7rem;
  font-size: 0.32rem;
  /* color: #949494; */
  line-height: 0.4266666666666667rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #0287ff;
}
.widerThanAuthor > button:nth-child(3) {
  width: 1.7066666666666668rem;
  height: 0.7466666666666667rem;
  position: absolute;
  right: 0.32rem;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  font-size: 0.32rem;
  color: #949494;
}
.widerThanAuthor > button:nth-child(3) > span {
  display: inline-block;
  width: 0.32rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/share@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.08rem;
}
.voteSubjectTitle {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  padding-left: 0.32rem;
  padding-top: 0.32rem;
  padding-bottom: 0.32rem;
  font-weight: bold;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.voteSubjectText {
  padding-left: 0.32rem;
  padding-right: 0.32rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.6933333333333334rem;
}
.ishow {
  display: block;
  text-align: right;
  margin-right: 0.3rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
}
.voteSubjectText > span {
  color: #949494;
}
.voteBtn {
  display: block;
  border: 0;
  width: 3.2rem;
  height: 0.96rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  margin: auto;
  margin-top: 0.4266666666666667rem;
}
.voteSubjectNumber {
  width: 100%;
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-top: 0.10666666666666667rem;
}
.voteMedal {
  width: 0.8533333333333334rem;
  height: 1.28rem;
  position: absolute;
  top: 0;
  left: 0.32rem;
}
.voteMedal > img {
  width: 100%;
  height: 100%;
}
.voteMedal > span {
  display: inline-block;
  vertical-align: middle;
  width: 100%;
  height: 100%;
  line-height: 1.28rem;
}
.getBack {
  width: 1.4933333333333334rem;
  height: 1.4933333333333334rem;
  background: url("../../static/img/butoom_top@2x.png") no-repeat;
  background-size: 100% 100%;
  position: fixed;
  bottom: 1.9466666666666668rem;
  left: 8.186666666666667rem;
}
.CanItFindDiv {
  width: 100%;
  background: #fff;
  padding-top: 0.5333333333333333rem;
  padding-bottom: 1.5rem;
}
.CanItFindDiv > div:nth-child(1) {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  background: url("../../static/img/images_searchno@2x.png") no-repeat;
  background-size: 100% 100%;
  margin: auto;
}
.CanItFindDiv > p:nth-child(2) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-top: 0.21333333333333335rem;
}
.CanItFindDiv > button:nth-child(3) {
  display: block;
  border: 0;
  width: 5.866666666666666rem;
  height: 1.1733333333333333rem;
  margin: auto;
  background: #ffffff;
  border: 1px solid #949494;
  border-radius: 0.10666666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  margin-top: 0.5333333333333333rem;
}
.voteMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
}
.voteMask > div:nth-child(1) {
  width: 6.613333333333333rem;
  height: 4.32rem;
  background: #fff;
  box-shadow: 0 0.05333333333333334rem 0.10666666666666667rem 0
    rgba(0, 0, 0, 0.1);
  border-radius: 0.10666666666666667rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.voteMask > div:nth-child(1) > p:nth-child(1) {
  width: 3.36rem;
  margin: auto;
  font-size: 0.37333333333333335rem;
  color: #949494;
  text-align: center;
  line-height: 0.56rem;
  margin-top: 0.8rem;
}
.voteMask > div:nth-child(1) > button:nth-child(2) {
  display: block;
  width: 4.266666666666667rem;
  height: 1.1733333333333333rem;
  margin: auto;
  border: 0;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  margin-top: 0.5333333333333333rem;
}
.voteMask > div:nth-child(1) > div:nth-child(3) {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  top: 0.29333333333333333rem;
  right: 0.29333333333333333rem;
}
.voteMask > div:nth-child(1) > div:nth-child(3) > img {
  width: 100%;
  height: 100%;
}
.active {
  display: block;
}
.mackHDYMB {
  width: 4.426666666666667rem;
  height: 1.84rem;
  background: #0287ff;
  border-radius: 0.10666666666666667rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.mackHDYMB1 {
  text-align: center;
  opacity: 0.8;
  font-size: 0.37333333333333335rem;
  color: #ffffff;
  margin-top: 0.29333333333333333rem;
}
.mackHDYMB2 {
  font-size: 0.4266666666666667rem;
  color: #ffffff;
  padding-left: 1.76rem;
  margin-top: 0.3333333333333333rem;
}
.mackHDYMB3 {
  width: 0.64rem;
  height: 0.64rem;
  position: absolute;
  top: 0.9333333333333333rem;
  left: 1.0133333333333334rem;
  background: url("../../static/img/Group8@x(1).png") no-repeat;
  background-size: 100% 100%;
}
.ruleMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.6);
  z-index: 600;
}
.ruleMaskDiv {
  width: 8rem;
  height: 9.333333333333334rem;
  background: #ffffff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.ruleExplain {
  text-align: center;
  font-size: 16px;
  color: #373d41;
  padding-top: 0.5333333333333333rem;
  padding-bottom: 0.32rem;
  font-weight: bolder;
}
.releaseRule {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  padding-left: 0.5333333333333333rem;
  padding-bottom: 0.21333333333333335rem;
  font-weight: bolder;
}
.ruleContent {
  width: 6.933333333333334rem;
  margin: auto;
}
.ruleText1,
.ruleText2,
.ruleText3,
.ruleText4,
.ruleText6,
.ruleText7,
.ruleText8 {
  font-size: 0.32rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.48rem;
}
.ruleText5 {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  padding-top: 0.32rem;
  padding-bottom: 0.21333333333333335rem;
  font-weight: bolder;
}
.ruleCole {
  width: 0.4266666666666667rem;
  height: 0.4266666666666667rem;
  position: absolute;
  right: 0.26666666666666666rem;
  top: 0.26666666666666666rem;
  background: url("../../static/img/login_buttom_delete@2x.png") no-repeat;
  background-size: 100% 100%;
}
.padds{
  padding-top:1.36rem;
}
</style>
