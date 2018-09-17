<template>
    <div>
        <div class="meCollectionHeader">
            <div>我的收藏</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <v-loadmore v-if="noData" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <ul class="meCollectionUl" >
                <li v-for="(item,index) in meCollection" @click="jumpDetails(item.forumId)">
                    <div class="meCollectionContent">
                        <p>{{item.title}}</p>
                        <p>{{item.introduction}}</p>
                        <p>{{item.time}}</p>
                        <div @click.stop="deleteCollection($event,item.forumId,index)"><span></span><span>删除</span></div>
                    </div>
                </li>
            </ul>
        </v-loadmore>
        
        <div class="meCollectionMask" v-show="isDelete">
            <div class="meCollectionPopup" v-show="isCollectionPopup">
                <p>确定要删除收藏的帖子吗?</p>
                <div>
                    <button @click="undelete">取消</button><button @click="deletions">确定</button>
                </div>
            </div>
            <div class="deleteSuccess" v-show="isDeleteSuccess">
                <div></div>
                <p>删除成功</p>
            </div>
        </div>
        <!--没有数据-->
        <div class="noDataMeCollection" v-if="!noData">
            <div></div>
            <p>亲，赶紧把喜欢的帖子加入到收藏吧</p>
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
      meCollection: [],
      isDelete: false,
      isCollectionPopup: false,
      isDeleteSuccess: false,
      collectionIndex: "",
      collectionForumId: "",
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
    deleteCollection(el, forumId, index) {
      this.collectionIndex = index;
      this.collectionForumId = forumId;
      this.isDelete = true;
      this.isCollectionPopup = true;
      this.isDeleteSuccess = false;
    },
    undelete() {
      this.isDelete = false;
      this.isCollectionPopup = true;
      this.isDeleteSuccess = false;
    },
    deletions() {
      this.meCollection.splice(this.collectionIndex, 1);
      //帖子取消收藏

      let params = {
        userId: storeGet("userID"),
        forumId: this.collectionForumId
      };
      let myRequestId = Encrypt.myUuid();
      let myTimestamp = Math.round(new Date().getTime()).toString();
      let myArr = [
        "requestId=" + myRequestId,
        "userId=" + storeGet("userID"),
        "forumId=" + this.collectionForumId
      ];
      let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_collection_del;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_collection_del(params, headers).then(res => {});

      this.isCollectionPopup = false;
      this.isDeleteSuccess = true;
      setTimeout(() => {
        this.isDelete = false;
      }, 1000);
    },
    loadBottom() {
      this.$refs.loadmore.onBottomLoaded();
      if (this.dataCode == 200) {
        this.pageNum++;
        this.getList();
      }
    },
    getList() {
      //我的收藏列表
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
        Encrypt.myFunction(myArr) + iconfig.ips.vote_mycollectionforumlist;
      let myValues = md5(a).toUpperCase();
      let headers = {
        requestId: myRequestId,
        timestamp: myTimestamp,
        channelType: "h5",
        sign: myValues
      };
      api.vote.vote_mycollectionforumlist(params, headers).then(res => {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.page.list.length; i++) {
            res.data.page.list[i]["time"] = timestampToTime(
              res.data.page.list[i].createTime
            );
          }
          //this.meCollection=data.page.list
          for (var j = 0; j < res.data.page.list.length; j++) {
            this.meCollection.push(res.data.page.list[j]);
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
    jumpDetails(forumId) {
      this.$router.push({ name: "details", query: { forum_id: forumId } });
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style scoped>
.meCollectionHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.meCollectionHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.meCollectionHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.meCollectionHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.meCollectionHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.meCollectionUl {
  width: 100%;
  background: #fff;
}
.meCollectionUl > li {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #f2f2f2;
  padding-top: 0.5333333333333333rem;
  padding-bottom: 0.56rem;
  position: relative;
}
.meCollectionContent {
  width: 9.36rem;
  margin: auto;
}
.meCollectionContent > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  letter-spacing: 0;
  text-align: justify;
  line-height: 0.64rem;
  font-weight: 600;
}
.meCollectionContent > p:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  letter-spacing: 0;
  text-align: justify;
  line-height: 0.6933333333333334rem;
  margin-top: 0.21333333333333335rem;
}
.meCollectionContent > p:nth-child(3) {
  font-size: 0.32rem;
  color: #b8b8b8;
  margin-top: 0.4rem;
}
.meCollectionContent > div:nth-child(4) {
  width: 1.28rem;
  height: 0.5866666666666667rem;
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 0.05333333333333334rem;
  position: absolute;
  right: 0.32rem;
  bottom: 0.5066666666666667rem;
}
.meCollectionContent > div:nth-child(4) > span:nth-child(1) {
  display: inline-block;
  width: 0.26666666666666666rem;
  height: 0.32rem;
  background: url("../../static/img/delete.png") no-repeat;
  background-size: 100% 100%;
  margin-right: 0.13333333333333333rem;
  margin-left: 0.18666666666666668rem;
  position: relative;
  top: 0.02666666666666667rem;
}
.meCollectionContent > div:nth-child(4) > span:nth-child(2) {
  font-size: 0.26666666666666666rem;
  color: #949494;
  line-height: 0.5866666666666667rem;
}
.meCollectionMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
}
.meCollectionPopup {
  width: 8rem;
  height: 3.9466666666666668rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: #fff;
}
.meCollectionPopup > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: center;
  margin-top: 1.12rem;
}
.meCollectionPopup > div:nth-child(2) {
  width: 100%;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #dfdfdf;
}
.meCollectionPopup > div:nth-child(2) > button {
  border: 0;
  width: 50%;
  height: 1.1733333333333333rem;
  background: #fff;
  box-sizing: border-box;
  font-size: 0.4266666666666667rem;
  color: #fc3d39;
}
.meCollectionPopup > div:nth-child(2) > button:nth-child(1) {
  border-right: 1px solid #dfdfdf;
  color: #373d41;
}
.deleteSuccess {
  width: 4.373333333333333rem;
  height: 3.68rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.10666666666666667rem;
}
.deleteSuccess > div:nth-child(1) {
  width: 1.1733333333333333rem;
  height: 1.1733333333333333rem;
  margin: auto;
  margin-top: 0.8rem;
  background: url("../../static/img/success@2x.png") no-repeat;
  background-size: 100% 100%;
}
.deleteSuccess > p:nth-child(2) {
  text-align: center;
  font-size: 0.4266666666666667rem;
  color: #ffffff;
  margin-top: 0.32rem;
}
.noDataMeCollection {
  width: 100%;
  background: #fff;
  margin-top: 5.44rem;
}
.noDataMeCollection > div {
  width: 2.6666666666666665rem;
  height: 2.6666666666666665rem;
  margin: auto;
  background: url("../../static/img/1-4-2我的收藏-空状态@2x.png") no-repeat;
  background-size: 100% 100%;
}
.noDataMeCollection > p:nth-child(2) {
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-top: 0.32rem;
}
</style>
