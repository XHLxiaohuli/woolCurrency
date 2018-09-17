<template>
    <div class="recommenMain">
        <div class="projectsHeader">
            <div>我要推荐项目</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="projectsContainer">
            <p>项目推荐成功后将会显示到投票页，通过投票可获得代币奖励（1票=2YMB）</p>
            <div class="projectsMain">
                <div class="projectsLeft">
                    <div>项目名称</div>
                    <div>项目官网</div>
                    <div>项目LOGO</div>
                    <div>项目介绍</div>
                </div>
                <div class="projectsRight">
                    <input type="text" placeholder="限制输入20个字" v-model="ProjectName" maxlength='20'  @keyup="iBlur(ProjectName)">
                    <input type="text" placeholder="请输入项目官网地址" v-model="ProjectAddress" >
                    
                        <!--<div></div><span>（非必填）</span>-->
                        <div class="imgshow"><img :src="headerImage" />
                            <div class="upload-file">
                                <input type="file" class="input-file" @change="upload" accept="image/*" />
                            </div>
                        </div>
                        
                    
                        <textarea maxlength="100" cols="35" rows="8" placeholder="限制输入100个字"  @input="inputlength" v-model="inputtext"></textarea>
                        <span>{{newlength}}/100</span>
                    
                </div>
            </div>
        </div>
        <button class="releaseBtn" @click="pubulishData()">发布</button>
        <!--蒙版-->
        <div class="projectsMask" v-if="false">
            <!--发布成功-->
            <div class="releaseSuccess" v-if="false">
                <div></div>
                <p>发布成功</p>
            </div>
            <!--放弃编辑-->
            <div class="giveUp" v-if="false">
                <p>确定放弃编辑吗？</p>
                <div>
                    <button>取消</button><button>确定</button>
                </div>
            </div>
        </div>  
    </div>
</template>
<script>
import Vue from "vue";
import api from "api";
import Exif from "exif-js";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
import { rotateImg, compress, storeGet } from "scripts/moment";
import { Indicator, Toast } from "mint-ui";
export default {
  data() {
    return {
      ProjectName: "",
      ProjectAddress: "",
      headerImage: "",
      newlength: 0,
      inputtext: ""
    };
  },
  watch: {},
  methods: {
    iBlur(val) {
      this.loginPhoneBor = "#f2f2f2";
      if (val.length >= 20) {
        Toast("不能超过二十");
      }
    },
    iaBlur(val) {
      this.loginPhoneBor = "#f2f2f2";
    },
    back() {
      this.$router.push("/bottomtab/vote");
    },
    inputlength() {
      //计算评论输入字符数
      let txtlen = this.inputtext.length;
      this.newlength = 0 + txtlen;
      if (this.newlength >= 100) {
        this.newlength = 100;
        this.inputtext.substr(0, 100);
      }
    },
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.filess(this.picValue);
    },
    filess(file) {
      let Orientation;
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      if (!file || !window.FileReader) return;
      let img = new Image();
      this.headerImage = file;
      if (/^image/.test(file.type)) {
        if (file.size >= 5 * 1024 * 1024) {
          this.headerImage = this.compress(img, Orientation);
          this.postData(this.headerImage);
        } else {
          this.postData(this.headerImage);
        }
      } else {
      }
    },
    postData(image) {
      var form = new FormData();
      form.append("file", image);
      form.append("filedir", "forum");
      let url = "https://www.bibang.top/upload/uploadFile";
      Vue.axios.post(url, form, { headers: {} }).then(res => {
        this.headerImage = res.data.data.fileUrl;
        if (res.data.code === 200) {
          this.imgShow = false;
        }
      });
    },
    pubulishData() {
      //项目发布
      let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (this.ProjectAddress.length <= 0) {
        Toast("请输入项目官网地址");
      } else if (this.inputtext.length > 100) {
        Toast("内容不得超过100字");
      } else {
        let params = {
          userId: storeGet("userID"),
          itemName: this.ProjectName,
          websiteAddress: this.ProjectAddress,
          logoUrl: this.headerImage,
          introduce: this.inputtext
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID"),
          "itemName=" + this.ProjectName,
          "websiteAddress=" + this.ProjectAddress,
          "logoUrl=" + this.headerImage,
          "introduce=" + this.inputtext
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_item_add;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.item.vote_item_add(params, headers).then(res => {
          if (res.data.code == 200) {
            Toast("发布成功");
            this.back();
          } else if (res.data.code == 501) {
            Toast(res.data.message);
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.recommenMain {
  width: 100%;
  overflow: hidden;
}
.projectsHeader {
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.projectsHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.projectsHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.projectsHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.projectsHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.projectsContainer {
  width: 9.36rem;
  margin: auto;
  margin-top: 0.72rem;
}
.projectsContainer > p:nth-child(1) {
  width: 100%;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.64rem;
}
.projectsMain {
  width: 100%;
}
.projectsMain:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.projectsMain > div {
  float: left;
}
.projectsLeft {
  width: 2.1333333333333333rem;
}
.projectsRight {
  width: 7.226666666666667rem;
}
.projectsLeft > div {
  font-size: 0.37333333333333335rem;
  color: #949494;
  text-align: left;
  line-height: 0.56rem;
}
.projectsLeft > div:nth-child(1) {
  margin-top: 0.7733333333333333rem;
}
.projectsLeft > div:nth-child(2) {
  margin-top: 0.96rem;
}
.projectsLeft > div:nth-child(3) {
  margin-top: 0.9066666666666666rem;
}
.projectsLeft > div:nth-child(4) {
  margin-top: 2.1066666666666665rem;
}
.projectsRight > input:nth-child(1),
.projectsRight > input:nth-child(2) {
  width: 100%;
  height: 0.9866666666666667rem;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  border-radius: 0.05333333333333334rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  margin-top: 0.5333333333333333rem;
}

.projectsRight > div:nth-child(3) > div:nth-child(1) {
  display: inline-block;
  width: 2.1333333333333333rem;
  height: 2.1333333333333333rem;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  border-radius: 0.05333333333333334rem;
  background: url("../../static/img/add_picture@2x.png") no-repeat;
  background-size: 0.8533333333333334rem 0.8533333333333334rem;
  background-position: center;
}
.projectsRight > div:nth-child(3) > span:nth-child(2) {
  font-size: 0.26666666666666666rem;
  color: #949494;
}
.projectsRight > div:nth-child(4) > textarea:nth-child(1) {
  padding: 0;
  width: 100%;
  height: 4.4rem;
  background: #ffffff;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  margin-top: 0.5333333333333333rem;
}
.releaseBtn {
  padding: 0;
  border: 0;
  width: 100%;
  height: 1.3066666666666666rem;
  font-size: 0.48rem;
  color: #373d41;
  background: #fec82f;
  position: fixed;
  bottom: 0;
}
.projectsMask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.6);
}
.releaseSuccess {
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
.releaseSuccess > div:nth-child(1) {
  width: 1.1733333333333333rem;
  height: 1.1733333333333333rem;
  margin: auto;
  margin-top: 0.8rem;
  background: url("../../static/img/success@2x.png") no-repeat;
  background-size: 100% 100%;
}
.releaseSuccess > p:nth-child(2) {
  text-align: center;
  font-size: 0.4266666666666667rem;
  color: #ffffff;
  margin-top: 0.32rem;
}
.giveUp {
  width: 8rem;
  height: 3.9466666666666668rem;
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 0.10666666666666667rem;
}
.giveUp > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: center;
  margin-top: 1.12rem;
}
.giveUp > div:nth-child(2) {
  width: 100%;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #dfdfdf;
}
.giveUp > div:nth-child(2) > button {
  border: 0;
  width: 50%;
  height: 1.1733333333333333rem;
  box-sizing: border-box;
  background: #ffffff;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.giveUp > div:nth-child(2) > button:nth-child(2) {
  color: #fc3d39;
  border-left: 1px solid #dfdfdf;
}
.imgshow {
  position: relative;
  /* top:0.32rem; */
  margin-top: 0.32rem;
  margin-bottom: 0.5333333333333333rem;
  width: 2.1333333333333333rem;
  height: 2.1333333333333333rem;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  /* overflow:hidden; */
}
.imgshow img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.upload-file {
  position: absolute;
  /* top:-1.45rem;
    left:2.53333rem; */
  top: 0;
  bottom: 0;
  right: -1.8rem;
  margin: auto;
  width: 1.32rem;
  height: 1.32rem;
  border: 1px solid #eaeaea;
  box-sizing: border-box;
  border-radius: 50%;
  background: url("../../static/img/add_picture@2x.png") no-repeat;
  background-size: 0.64rem 0.64rem;
  background-position: center;
}

.upload-file span {
  /*单行显示*/
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.upload-file:hover {
  /*简单的hover效果*/
  font-size: 15px;
  border-color: rgb(39, 226, 81);
}

.upload-file input[type="file"] {
  height: 100%;
  width: 100%;
  position: absolute; /*设置为绝对定位，不会影响到其他元素*/
  top: 0;
  right: 0;
  opacity: 0; /*透明度为0*/
  filter: alpha(opacity=0);
  cursor: pointer;
}
</style>


