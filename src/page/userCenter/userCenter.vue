<template>
    <div>
        <div class="userCenterHeader">
            <div>用户中心</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="userCenterContainer">
            <div class="headPortrait">
                <div><img :src="userHeader" alt=""></div>
                <div></div>
                <input class="choicePic" type="file" id="upload" accept="image" @change="upload"> 
            </div>
            <ul class="userCenterUl">
                <li v-for="(item,index) in userCenterUlText" @click="jumpCorresponding(index)">
                    <div>{{item.text}}</div>
                    <div v-show="index!=3">{{item.Basics}}</div>
                    <div v-if="index!=1"></div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { storeGet, sesGetStorage, sesStorage } from "scripts/moment";
import Exif from "exif-js";
import Vue from "vue";
import api from "api";
import md5 from "js-md5";
import Encrypt from "scripts/encrypt";
import { Toast } from "mint-ui";
import * as iconfig from "scripts/iconfig";
export default {
  data() {
    return {
      userHeader: "",
      isOneUpdateName: "",
      userCenterUlText: [
        { text: "用户名" },
        { text: "用户ID" },
        { text: "手机号码" },
        { text: "密码管理" }
      ],
      picValue: ""
    };
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    },
    jumpCorresponding(index) {
      if (index == 0) {
        if (this.isOneUpdateName == 0) {
          this.$router.push("/modifyUserName");
        } else {
          Toast("你已修改过昵称");
        }
      } else if (index == 1) {
        Toast("用户ID不支持修改哦");
      } else if (index == 2) {
        this.$router.push("/oneReplacePhone");
      } else if (index == 3) {
        this.$router.push("/passwordManagement");
      }
    },
    pullData() {
      this.userHeader = sesGetStorage("userhead");
      this.isOneUpdateName = sesGetStorage("isOneUpdateName");
      for (var i = 0; i < this.userCenterUlText.length; i++) {
        if (i == 0) {
          this.userCenterUlText[i]["Basics"] = storeGet("username");
        } else if (i == 1) {
          this.userCenterUlText[i]["Basics"] = sesGetStorage("serialNumber");
        } else if (i == 2) {
          this.userCenterUlText[i]["Basics"] = "已绑定";
        } else if (i == 3) {
          this.userCenterUlText[i]["Basics"] = " ";
        }
      }
    },
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
    },
    imgPreview(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        //判断是否符合类型
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result; //为FileReader中readAsDataURL转换后data: URL格式的字符串以表示所读取文件的内容
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.postImg(this.result);
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.postImg(data);
            };
          }
        };
      } else {
        alert("你的选择不符合格式");
      }
    },
    postImg(baseString) {
      var bytes = window.atob(baseString.split(",")[1]);
      var buffer = new ArrayBuffer(bytes.length);
      var uint = new Uint8Array(buffer);
      for (var i = 0; i < bytes.length; i++) {
        uint[i] = bytes.charCodeAt(i); //这里有点疑惑，ia是怎么改变ab的？注：①
      }
      var blob = new Blob([buffer], { type: "image/jpeg" }); //type为图片的格式
      //这里写接口
      var form = new FormData();
      var form = new FormData();
      form.append("file", baseString);
      form.append("filedir", "forum");
      let url = "https://www.bibang.top/upload/uploadFile";
      form.append("file", blob, Date.now() + ".jpg");
      form.append("filedir", "head");
      Vue.axios.post(url, form, { headers: {} }).then(res => {
        this.userHeader = res.data.data.fileUrl;
        sesStorage("userhead", res.data.data.fileUrl);

        let params = {
          userId: storeGet("userID"),
          headUrl: res.data.data.fileUrl,
          username: ""
        };
        let myRequestId = Encrypt.myUuid();
        let myTimestamp = Math.round(new Date().getTime()).toString();
        let myArr = [
          "requestId=" + myRequestId,
          "userId=" + storeGet("userID"),
          "headUrl=" + res.data.data.fileUrl,
          "username=" + ""
        ];
        let a = Encrypt.myFunction(myArr) + iconfig.ips.user_updateuserinfo;
        let myValues = md5(a).toUpperCase();
        let headers = {
          requestId: myRequestId,
          timestamp: myTimestamp,
          channelType: "h5",
          sign: myValues
        };
        api.user.user_updateuserinfo(params, headers).then(res => {
          if (res.data.code == 200) {
            Toast("修改头像成功");
          } else {
            Toast(res.data.message);
          }
        });
      });
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
  },
  created() {
    this.pullData();
  }
};
</script>
<style scoped>
.userCenterHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.userCenterHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.userCenterHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.userCenterHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.userCenterHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.userCenterContainer {
  width: 100%;
}
.headPortrait {
  width: 100%;
  padding-top: 1.04rem;
  padding-bottom: 0.5066666666666667rem;
  position: relative;
}
.headPortrait > div:nth-child(1) {
  width: 1.6rem;
  height: 1.6266666666666667rem;
  margin: auto;
  border-radius: 50%;
}
.headPortrait > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.headPortrait > div:nth-child(2) {
  width: 0.5333333333333333rem;
  height: 0.5333333333333333rem;
  background: url("../../static/img/1-1用户信息@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 5.333333333333333rem;
  bottom: 0.5333333333333333rem;
}
.userCenterUl {
  width: 100%;
}
.userCenterUl > li {
  width: 9.36rem;
  height: 1.6533333333333333rem;
  margin: auto;
  border-bottom: 1px solid #f2f2f2;
  position: relative;
}
.userCenterUl > li:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.userCenterUl > li > div:nth-child(1) {
  float: left;
  line-height: 1.6533333333333333rem;
  font-size: 0.4266666666666667rem;
  color: #373d41;
}
.userCenterUl > li > div:nth-child(2) {
  float: right;
  line-height: 1.6533333333333333rem;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-right: 0.4266666666666667rem;
}
.userCenterUl > li > div:nth-child(3) {
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/YMB_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.choicePic {
  position: absolute;
  width: 1.6rem;
  height: 1.6266666666666667rem;
  background: red;
  bottom: 0.5066666666666667rem;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 50%;
  opacity: 0;
}
</style>

