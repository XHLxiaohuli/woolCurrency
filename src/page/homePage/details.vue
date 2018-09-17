<template>
    <div>
        
         <div class="detailsHeader">
            <div>详情</div>
            <div @click="back"><span></span><span>返回</span></div>
            <div class="detailsContainer">
                <p>{{detailsData.title}}</p>
                <p><span>{{detailsData.createTime}}</span>
                <span>{{detailsData.postedUsername}}</span></p>
                <!--后台返回的html代码start-->
                <div id="detailsMain" v-html="detailsData.content"></div>
                <!--后台返回的html代码end-->
                <div class="thumbsUp">
                    <button :class="lovesClass ?'btnActive' : 'thumbsUpBtn'" :disabled="isdis" @click="lovesClick(lovesClass)">
                        <span>{{detailsData.lovesCount}}</span>
                    </button>
                </div>
            </div>
             
           <!-- <div class="social-share" ref="sharess" data-disabled="google,qzone,weibo,douban,facebook,twitter,diandian,linkedin,tencent" ></div> -->
            <div  class="hasComment">
                <p v-if="noData" >全部评论（{{commentData.totalRow}}）</p>
                <!--有评论-->
                <ul class="hasCommentUl" v-if="noData" >
                    <li v-for="(item,index) in commentData.list" v-if="item">
                        <div class="hasCommentLeft" v-if="item">
                            <div>
                                <img :src="item.commentHead" alt="">
                            </div>
                        </div>
                        <div class="hasCommentRight">
                            <p>{{item.commentUsername}}</p>
                            <div>{{item.commentContent}}</div>
                            <div><span>{{item.time}}</span><span v-if="(item.commentUsername==isUsername)||(isUsername==isPostedUserId)" @click="delcomment(item.commentId)">删除</span>
                            <button v-if="(isPostedUserId==isUserId)" class="reply" @click="replyClick(item.commentId)"><span></span> 回复</button></div>
                            <div class="authorReply" v-if="item.replys!=ireplys" v-for="childitem in item.replys">
                                <span>{{childitem.replyUsername}}回复：</span>
                                <span>{{childitem.replyContent}}</span><span></span>
                            </div>
                        </div>
                    </li>
                </ul>
                <!--没有评论-->
                <div class="noCommentDiv" v-if="!noData">
                    <div></div>
                    <p>大兄弟，沙发在此，赶紧抢沙发啦</p>
                </div>
                <div class="commentCollection">
                    <div class="commentCollectionInput" @click="collecfocus()"></div><button @click="collectionClick()" :class="{active:collectionactive===0,yesActive:collectionactive===1}">
                        <span></span> 收藏
                    </button>
                  <!-- <button @click="call('qqFriend')">
                        <span></span> 分享
                    </button> -->
                </div>
            </div>
        </div>
        <div class="detailMask" @click="noNullClick" v-show="postMaskShow" >
            <div class="detailWrap">
                <div class="detailinp" >
                    <textarea rows="5"  ref="textareas" autofocus v-model="inputtext" @click.stop="focusT"  maxlength="130" @input="inputlength"></textarea>
                    <span>{{newlength}}/130</span>
                </div>
                <div class="detailBnt">
                    <button @click.stop="offClick">取消</button>
                    <button v-if="forumShow" @click.stop="replyAdd(comments)">发表评论</button>
                    <button v-if="commentShow" @click.stop="commentAdd()">发表评论</button>
                </div>
            </div>
            
        </div>
    </div>    
</template>
<script>
import api from "api";
import md5 from "js-md5";
import Encrypt from 'scripts/encrypt'
import * as iconfig from 'scripts/iconfig'
import { storeSet,storeGet, timestampToTime, sesGetStorage} from 'scripts/moment';
import { Indicator,Toast } from 'mint-ui';
import 'scripts/NativeShare';
export default {
  data() {
    return {
      postMaskShow: false,
      detailsData: [],
      commentData: [],
      collectionactive: 0,
      forumShow: false,
      commentShow: false,
      lovesactive: false,
      comments: "",
      inputtext: "",
      newlength: 0,
      isUsername: "",
      isPostedUserId: "",
      noData: true,
      ireplys: [],
      lookUserId: "",
      lovesClass: false,
      isUserId: storeGet("userID"),
      isdis: false
    };
  },
  created() {
    this.setData();
    this.commentList();
  },
  methods: {
    /******************操作功能函数*******************/
    back() {
      this.$router.push("/bottomtab/home");
    },
    collectionClick() {
      //收藏取消收藏操作
      //this.active ?this.delCollection() :this.addCollection();
      if (this.detailsData.isCollection) {
        this.detailsData.isCollection = !this.detailsData.isCollection;
        this.delCollection();
      } else {
        this.detailsData.isCollection = !this.detailsData.isCollection;
        this.addCollection();
      }
    },
    lovesClick(res) {
      //点赞的操作
      if (res) {
        /*this.detailsData.isLoved=!this.detailsData.isLoved;*/
        this.delloves();
        this.detailsData.lovesCount--;
        this.lovesClass = false;
      } else {
        /*this.detailsData.isLoved=!this.detailsData.isLoved;*/
        this.addloves();
        this.detailsData.lovesCount++;
        this.lovesClass = true;
      }
    },
    replyClick(id) {
      //回复时操作
      this.comments = id;
      this.forumShow = true;
      this.commentShow = false;
      this.postMaskShow = true;
    },
    collecfocus(id) {
      //点击评论框获取焦点
      this.commentShow = true;
      this.forumShow = false;
      this.postMaskShow = true;
    },

    inputlength() {
      //计算评论输入字符数
      let txtlen = this.inputtext.length;
      this.newlength = 0 + txtlen;
      if (this.newlength >= 130) {
      }
    },
    offClick() {
      //取消评论--撤销评论框
      this.postMaskShow = false;
      this.inputtext = "";
      this.newlength = 0;
    },
    noNullClick() {
      this.postMaskShow = false;
    },
    focusT() {
      this.$refs.textareas.focus();
    },

    /******************接口交互函数*******************/
    setData() {
      //帖子详情
      this.isUsername = storeGet("username");
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_details;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_details(params, headers).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.isCollection === true) {
            this.collectionactive = 1;
          } else if (res.data.data.isCollection === false) {
            this.collectionactive = 0;
          }

          res.data.data.isLoved
            ? (this.lovesClass = true)
            : (this.lovesClass = false);
          this.isPostedUserId = res.data.data.postedUid;
          this.detailsData = res.data.data;
          this.detailsData.createTime = timestampToTime(
            res.data.data.createTime
          );
        } else {
        }
      });
    },
    commentList() {
      //评论列表
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id,
        currentPage: 1
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id,
        "currentPage=" + 1
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_comment_list;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_comment_list(params, headers).then(res => {
        if (res.data.code == 200) {
          this.noData = true;
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].commentTime
            );
          }
          /*this.lookUserId=res.data.page.list[0].commentUid;*/

          this.commentData = res.data.page;
        } else {
          this.noData = false;
        }
        })
    },
    addCollection() {
      //收藏帖子
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_collection_add;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_collection_add(params, headers).then(res => {
        Toast({
          message: "收藏成功！",
          duration: 500
        });
        this.collectionactive = 1;
      });
    },
    delCollection() {
      //帖子取消收藏
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_collection_del;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_collection_del(params, headers).then(res => {
        Toast({
          message: "已取消收藏！",
          duration: 500
        });
        this.collectionactive = 0;
      });
    },
    addloves() {
      this.isdis = true;
      //点赞
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_loves_add;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_loves_add(params, headers).then(res => {
        this.lovesactive = true;
        Toast({
          message: "点赞成功！",
          duration: 500
        });
        setTimeout(() => {
          this.isdis = false;
        }, 500);
      });
    },
    delloves() {
      //取消点赞
      this.isdis = true;
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_loves_del;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_loves_del(params, headers).then(res => {
        this.lovesactive = false;
        Toast({
          message: "已取消点赞！",
          duration: 500
        });
        setTimeout(() => {
          this.isdis = false;
        }, 500);
      });
    },
    commentAdd() {
      //帖子评论
      let params = {
        userId: storeGet("userID"),
        forumId: this.$route.query.forum_id,
        content: this.inputtext
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.$route.query.forum_id,
        "content=" + this.inputtext
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_comment_add;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_comment_add(params, headers).then(res => {
        if (res.data.code === 200) {
          this.commentList();
          this.offClick();
        }
      });
    },
    delcomment(index) {
      //删除评论
      let params = {
        userId: storeGet("userID"),
        commentId: index
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "commentId=" + index
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_comment_del;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_comment_del(params, headers).then(res => {
        if (res.data.code === 200) {
          this.commentList();
        }
      });
    },
    replyAdd(index) {
      //回复
      let params = {
        userId: storeGet("userID"),
        commentId: index,
        content: this.inputtext
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "commentId=" + index,
        "content=" + this.inputtext
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_comment_replyadd;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_comment_replyadd(params, headers).then(res => {
        if (res.data.code == 200) {
          this.commentList();
          this.offClick();
        }
      });
    },
    delreply() {
      //删除回复
      let params = {
        userId: storeGet("userID"),
        commentReplyId: ""
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "commentReplyId=" + index
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_comment_replydel;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_comment_replydel(params, headers).then(res => {});
    }
    }
};
</script>
<style scoped>
.detailsHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.detailsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.detailsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.detailsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.detailsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.detailsContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 0.4rem;
}
.detailsContainer > p:nth-child(1) {
  font-size: 0.5333333333333333rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.8rem;
  font-weight: bolder;
}
.detailsContainer > p:nth-child(2) {
  font-size: 0.32rem;
  color: #949494;
  text-align: left;
  margin-top: 0.32rem;
  margin-bottom: 0.5333333333333333rem;
}
.detailsContainer > p:nth-child(2) > span:nth-child(2) {
  margin-left: 0.4266666666666667rem;
}
#detailsMain {
  width: 100%;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.6933333333333334rem;
}

.thumbsUp {
  width: 100%;
  padding-top: 0.8rem;
  padding-bottom: 0.5333333333333333rem;
}
.thumbsUpBtn {
  border: 0;
  width: 2.48rem;
  height: 1.1733333333333333rem;
  margin: auto;
  background: #949494 url(../../static/img/praise2.png) no-repeat;
  background-position: top center;
  background-size: 25%;
  border-radius: 2.6666666666666665rem;
}
.btnActive {
  border: 0;
  width: 2.48rem;
  height: 1.1733333333333333rem;
  margin: auto;
  background: #fec82f url(../../static/img/page_praise@2x.png) no-repeat;
  background-position: top center;
  background-size: 25%;
  border-radius: 2.6666666666666665rem;
}
.thumbsUpBtn span {
  display: inline-block;
  margin-top: 0.693333rem;
  color: #000;
}
.btnActive span {
  display: inline-block;
  margin-top: 0.693333rem;
  color: #000;
}
.fall {
  width: 100%;
  height: 0.26666666666666666rem;
  background: #f2f2f8;
}
.hasComment {
  width: 9.36rem;
  margin: auto;
  text-align: left;
}
.hasComment > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  line-height: 0.64rem;
  font-weight: bolder;
  padding-top: 0.64rem;
  padding-bottom: 0.5333333333333333rem;
}
.hasCommentUl {
  width: 100%;
  padding-bottom: 2.1866666666666665rem;
}
.hasCommentUl > li {
  width: 100%;
  padding-bottom: 0.7733333333333333rem;
  border-bottom: 1px solid #f2f2f2;
}
.hasCommentUl > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.hasCommentUl > li > div {
  float: left;
}
.hasCommentLeft {
  width: 1.1733333333333333rem;
}
.hasCommentRight {
  width: 7.973333333333334rem;
  margin-left: 0.21333333333333335rem;
}
.hasCommentLeft > div {
  width: 1.1733333333333333rem;
  height: 1.1733333333333333rem;
  border-radius: 50%;
}
.hasCommentLeft > div > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.hasCommentRight > p:nth-child(1) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  line-height: 0.56rem;
}
.hasCommentRight > div:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.56rem;
}
.hasCommentRight > div:nth-child(3) {
  position: relative;
  text-align: left;
  margin-top: 0.29333333333333333rem;
  margin-bottom: 0.37333333333333335rem;
}
.hasCommentRight > div:nth-child(3) > span:nth-child(1) {
  font-size: 0.32rem;
  color: #b8b8b8;
}
.hasCommentRight > div:nth-child(3) > span:nth-child(2) {
  font-size: 0.32rem;
  color: #fc3d39;
  margin-left: 0.13333333333333333rem;
}
.reply {
  padding: 0;
  width: 1.28rem;
  height: 0.5866666666666667rem;
  border: 1px solid #eaeaea;
  position: absolute;
  right: 0;
  bottom: -0.13333333333333333rem;
  background: #fff;
  text-align: center;
  font-size: 0.13333333333333333rem;
  color: #949494;
}
.reply > span {
  display: inline-block;
  width: 0.37333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/detailpage_reply@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.08rem;
}

.commentCollection {
  width: 100%;
  background: #ffffff;
  box-shadow: 0 -0.02666666666666667rem 0.10666666666666667rem 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  bottom: 0;
  padding-top: 0.32rem;
  padding-bottom: 0.32rem;
}
.commentCollectionInput {
  display: inline-block;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  width: 7.013333333333334rem;
  height: 0.7466666666666667rem;
  /* margin-left: 0.4266666666666667rem; */
  position: relative;
  /* top:0.26666666666666666rem; */
  left: 0.32rem;
  box-sizing: border-box;
}
.commentCollection > button {
  padding: 0;
  border: 0;
  width: 1.7066666666666668rem;
  height: 0.7466666666666667rem;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  background: #fff;
  text-align: center;
  font-size: 0.32rem;
  color: #949494;
  box-sizing: border-box;
  position: absolute;
  right: 0.32rem;
  /* top: 0.26666666666666666rem; */
}
.commentCollection > button > span {
  display: inline-block;
  width: 0.32rem;
  height: 0.32rem;
  position: relative;
  top: 0.02666666666666667rem;
}
/* .commentCollection>button:nth-child(2){
    margin-left: 2rem;
} */
.commentCollection > button:nth-child(3) {
  margin-left: 0.32rem;
}
.commentCollection > button:nth-child(2) > span {
  background: url("../../static/img/收藏@2x.png") no-repeat;
  background-size: 100% 100%;
}
.commentCollection > button:nth-child(3) > span {
  background: url("../../static/img/share@2x.png") no-repeat;
  background-size: 100% 100%;
}
.authorReply {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  line-height: 0.56rem;
  background: #f5f5f8;
  border-radius: 4px;
  padding-left: 20px;
  position: relative;
}
.authorReply > span:nth-child(1) {
  font-weight: 700;
}
.authorReply > span:nth-child(3) {
  width: 0.10666666666666667rem;
  height: 0.32rem;
  position: absolute;
  top: 0.13333333333333333rem;
  left: 0.32rem;
  background: #fec82f;
}
.noCommentDiv {
  width: 100%;
  background: #fff;
  padding-bottom: 2.1866666666666665rem;
}
.noCommentDiv > div:nth-child(1) {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin: auto;
  background: url("../../static/img/detailpagenocomment@2x.png") no-repeat;
  background-size: 100% 100%;
}
.noCommentDiv > p:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  text-align: center;
  margin-top: 0.32rem;
}

.detailMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #979797;
}
.detailWrap {
  width: 100%;
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  background: #fff;
  padding: 0.32rem;
}
.detailinp {
  border: 1px solid #949494;
  padding: 0.32rem;
  padding-bottom: 0.5866666rem;
}
.detailinp textarea {
  border: 0;
  width: 100%;
  height: 100%;
  font-size: 16px;
}
.detailinp span {
  position: absolute;
  right: 0.45rem;
}
.detailBnt {
  padding: 0.32rem 0;
}
.detailBnt > button {
  border: none;
  background: #fff;
  text-align: center;
  font-size: 0.32rem;
  color: #949494;
}
.detailBnt > button:nth-child(2) {
  position: absolute;
  right: 0.45rem;
  padding: 0.106666rem 0.32rem;
  background: #fec82f;
  border-radius: 0.10666666666666667rem;
  color: #000;
}
.active {
  padding: 0;
  border: 0;
  width: 1.7066666666666668rem;
  height: 0.7466666666666667rem;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  background: #fff !important;
  text-align: center;
  font-size: 0.32rem;
  color: #949494 !important;
  box-sizing: border-box;
}
.yesActive {
  padding: 0;
  border: 0;
  width: 1.7066666666666668rem;
  height: 0.7466666666666667rem;
  border: 1px solid #eaeaea;
  border-radius: 0.10666666666666667rem;
  background: #fec82f !important;
  text-align: center;
  font-size: 0.32rem;
  color: #fff !important;
  box-sizing: border-box;
}
</style>


