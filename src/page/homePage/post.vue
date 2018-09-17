<template>  
  <div>  
    <div class="postText"><span @click="cancel"></span><button :disabled="postDisabled" @click="postAdd()">发表</button>发帖子</div>
    <div class="postContainer">
      <div class="postTile">
        <span>标题：</span>
          <input type="text" v-model="inputStr" @keyup="keyUP(inputStr)" maxlength='30' :style="'border-bottom:1px solid '+postTileBor">
      </div>
    </div>
    <div style="padding:20px;">  
      <div  class="show needsclick"  contenteditable="true" ref="contents">  
        <!-- <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>   -->
      </div>  

        <div class="upload-file">
          <input type="file" id="upload" accept="image/*" @change="upload" class="input-file" > 
        </div>
       
    </div>  

<!--弹框-->
    <div class="postMask" v-show="postMaskShow">
            <div class="maskDiv">
                <p>确定放弃编辑吗？</p>
                <div>
                    <button @click="cancelBtn">取消</button><button @click="determine">确定</button>
                </div>
            </div>
        </div>
  </div>  
</template>  
  
<script>
import Vue from "vue";
import api from "api";
import Exif from "exif-js";
import { storeGet } from "scripts/moment";
import { Indicator, Toast } from "mint-ui";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      postTileBor: "#eaeaea",
      postBodyBor: "#eaeaea",
      postMaskShow: false,
      headerImage: "",
      picValue: "",
      inputStr: "", //标题内容
      imgs: "", //图片路径集合
      imglength: 0,
      postDisabled: false
    };
  },
  mounted() {},
  methods: {
    cancel() {
      this.postMaskShow = true;
    },
    cancelBtn() {
      this.postMaskShow = false;
    },
    determine() {
      this.$router.push("/bottomtab/home");
    },
    keyUP(val) {
      if (val.length >= 30) {
        Toast("不能超过三十个字符");
      }
    },
    postAdd() {
      this.postDisabled = true;
      let isDivTextNull = this.$refs.contents.innerText
        .replace(/(^\s+)|(\s+$)/g, "")
        .substr(0, 150);
      if (this.inputStr.length <= 0) {
        Toast("请填写标题");
      } else if (!this.$refs.contents.innerHTML) {
        Toast("请创建贴子内容");
      } else {
        if (this.$refs.contents.innerText.length > 2000) {
          Toast("请不要超过两千字");
        } else {
          if (isDivTextNull != "" && isDivTextNull.length >= 10) {
            let params = {
              userId: storeGet("userID"),
              title: this.inputStr,
              introduction: this.$refs.contents.innerText
                .replace(/(^\s+)|(\s+$)/g, "")
                .substr(0, 150),
              content: this.$refs.contents.innerHTML,
              imgUrls: this.imgs
            };
            let myRequestId = Encrypt.myUuid();
            let myTimestamp = Math.round(new Date().getTime()).toString();
            let myArr = [
              "requestId=" + myRequestId,
              "userId=" + storeGet("userID"),
              "title=" + this.inputStr,
              "introduction=" +
                this.$refs.contents.innerText
                  .replace(/(^\s+)|(\s+$)/g, "")
                  .substr(0, 150),
              "content=" + this.$refs.contents.innerHTML,
              "imgUrls=" + this.imgs
            ];
            let a = Encrypt.myFunction(myArr) + iconfig.ips.vote_add;
            let myValues = md5(a).toUpperCase();
            let headers = {
              requestId: myRequestId,
              timestamp: myTimestamp,
              channelType: "h5",
              sign: myValues
            };
            api.vote.vote_add(params, headers).then(res => {
              if (res.data.code == 200) {
                Toast("已发帖");
                this.$router.push("/bottomtab/home");
              } else if (res.data.code == 501) {
                Toast(res.data.message);
              }
            });
          } else {
            Toast("正文不能少于10个字");
          }
        }
        /* Vue.axios.post('api/vote/forum/add.do',qs.stringify({
                userId:1,
                title:this.inputStr,
                introduction:this.$refs.contents.innerText,
                content:this.$refs.contents.innerHTML,
                imgUrls:this.imgs,
            }),{})
            .then(data=>{
                if(data.data.code == 200){
                  Toast("已发帖");
                  this.$router.push('/bottomtab/home');
                }else if(data.data.code ==501){
                  Toast(data.data.message)
                }
            })
            .catch(err=>{

            });*/
      }
      setTimeout(() => {
        this.postDisabled = false;
      }, 5000);
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
      let main = document.getElementsByClassName("show")[0];
      var form = new FormData();
      form.append("file", image);
      form.append("filedir", "forum");
      let url = "https://www.bibang.top/upload/uploadFile";
      if (this.imglength > 10) {
        Toast("请不要超过十张图");
      } else {
        Vue.axios.post(url, form, { headers: {} }).then(res => {
          this.headerImage = res.data.data.fileUrl;
          if (res.data.code === 200) {
            main.innerHTML +=
              '<div class="picture"><img style="width:100%" src="' +
              this.headerImage +
              '" alt=""/></div>';
            if (this.imgs === "") {
              this.imgs = this.headerImage;
              this.imglength = 1;
            } else {
              this.imgs += this.headerImage + "_";
              this.imglength++;
            }
          }
        });
      }
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    }
  }
};
</script>  
  
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.postText {
  width: 100%;
  height: 1.1733333333333333rem;
  line-height: 1.1733333333333333rem;
  text-align: center;
  font-size: 0.48rem;
  color: #373d41;
  border: 1px solid #f2f2f2;
  background: #fff;
  box-sizing: border-box;
  position: relative;
}
.postText > span:nth-child(1) {
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  background: url("../../static/img/login_buttom_delete@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 0.29333333333333333rem;
  top: 0;
  bottom: 0;
  margin: auto;
}
.postText > button:nth-child(2) {
  width: 1.4933333333333334rem;
  height: 0.64rem;
  border: 0;
  background: #b8b8b8;
  border-radius: 0.05333333333333334rem;
  font-size: 0.37333333333333335rem;
  color: #373d41;
  position: absolute;
  right: 0.32rem;
  top: 0;
  bottom: 0;
  margin: auto;
}
.postContainer {
  width: 9.253333333333334rem;
  margin: auto;
  margin-top: 0.4266666666666667rem;
}
.postTile {
  width: 100%;
}
.postTile > span {
  display: inline-block;
  padding: 0.32rem;
  font-size: 0.36rem;
}
.postTile > input {
  text-align: center;
  height: 1.1733333333333333rem;
  background: #ffffff;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.show {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #d5d5d5;
  box-sizing: border-box;
  padding: 8px 10px;
  height: 400px;
  max-height: 400px;
  overflow: auto;
  user-select: auto;
  font-size: 0.45rem;
  line-height: 0.55rem;
}
.show > img {
  width: 100%;
  height: 150px;
}
.picture {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.picture > img {
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.postMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #979797;
}
.maskDiv {
  width: 8rem;
  height: 3.9466666666666668rem;
  background: #ffffff;
  border-radius: 0.10666666666666667rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.maskDiv > p:nth-child(1) {
  font-size: 0.4266666666666667rem;
  color: #373d41;
  text-align: center;
  margin-top: 1.12rem;
}
.maskDiv > div:nth-child(2) {
  width: 100%;
  position: absolute;
  bottom: 0;
  border-top: 1px solid #dfdfdf;
}
.maskDiv > div:nth-child(2) > button {
  border: 0;
  width: 50%;
  height: 1.1733333333333333rem;
  background: #fff;
  font-size: 0.4266666666666667rem;
  color: #373d41;
  box-sizing: border-box;
}
.maskDiv > div:nth-child(2) > button:nth-child(2) {
  border-left: 1px solid #dfdfdf;
  font-size: 0.4266666666666667rem;
  color: #fc3d39;
}

.upload-file {
  width: 1.6rem;
  height: 1.6rem;
  border: 1px solid #eaeaea;
  border-radius: 0.05333333333333334rem;
  position: absolute;
  bottom: 0.32rem;
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