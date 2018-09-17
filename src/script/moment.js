export const storeSet=(key,val)=>{
	if(!key) return;
	if(typeof val !== 'string') {
		val = JSON.stringify(val);
	}
	window.localStorage.setItem(key,val);
}

export const storeGet=(key)=>{
	if(!key) return;
	return window.localStorage.getItem(key)
}

export const storeRemove=(key)=>{
	if(!key) return;
	window.localStorage.removeItem(key)
}

export const storeClear=()=>{
	window.localStorage.clear();
}

export const sesStorage=(key,val)=>{
  if(!key) return;
	if(typeof key !== 'string') {
		val = JSON.stringify(key);
  }
  if(typeof val !== 'string') {
		val = JSON.stringify(val);
  }
  window.sessionStorage[key] = val;
}

export const sesGetStorage=(key)=>{
  if(!key) return;
	return window.sessionStorage[key]
}

export const timestampToTime = (timestamp)=>{
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}


//uuid
export const myUuid=()=>{
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "";

  var uuid = s.join("");
  return uuid;
}

//组合排序header
export const myArrs=(arr)=>{
    var mySalt = "salt=yunkuangkgb";
    var myChannelType = "channelType=h5";
    arr.push(mySalt);
    arr.push(myChannelType);
    arr.sort();
    var arrFirstValue = arr[0];
    var arrSplicing = "";
    for (var i = 1; i < arr.length; i++) {
      arrSplicing = arrSplicing + "&" + arr[i];
    }
    var AllArrSplicing = arrFirstValue + arrSplicing;
    return AllArrSplicing + "&893c9ae1b5abcdadcdd531ab2dc7737a";
}


export const rotateImg=(img, direction,canvas)=>{ 
  //最小与最大旋转方向，图片旋转4次后回到原方向      
        const min_step = 0;      
        const max_step = 3;        
        if (img == null)return;      
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错      
        let height = img.height;      
        let width = img.width;        
        let step = 2;      
        if (step == null) {      
            step = min_step;      
        }      
        if (direction == 'right') {      
            step++;      
            //旋转到原位置，即超过最大值      
            step > max_step && (step = min_step);      
        } else {      
            step--;      
            step < min_step && (step = max_step);      
        }       
        //旋转角度以弧度值为参数      
        let degree = step * 90 * Math.PI / 180;      
        let ctx = canvas.getContext('2d');      
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
  }

  export const compress=(img,Orientation)=>{
    let canvas = document.createElement("canvas");  
      let ctx = canvas.getContext('2d');  
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
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);  
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);  
          }  
        }  
      } else {  
        ctx.drawImage(img, 0, 0, width, height);  
      }  
      //修复ios上传图片的时候 被旋转的问题  
      if(Orientation != "" && Orientation != 1){  
        switch(Orientation){  
          case 6://需要顺时针（向左）90度旋转  
              this.rotateImg(img,'left',canvas);  
              break;  
          case 8://需要逆时针（向右）90度旋转  
              this.rotateImg(img,'right',canvas);  
              break;  
          case 3://需要180度旋转  
              this.rotateImg(img,'right',canvas);//转两次  
              this.rotateImg(img,'right',canvas);  
              break;  
        }  
      }  
      //进行最小压缩  
      let ndata = canvas.toDataURL('image/jpeg', 0.1);   
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;  
      return ndata;  
  }
  //验证码
  export const getCode=(n)=>{
    var all = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
    var b = "";
    for (var i = 0; i < n; i++) {
     var index = Math.floor(Math.random() * 62);
     b += all.charAt(index);
    
    }
    return b;
   };

   //判断是ios还是安卓跳转微信支付
   export const isSystem=(address)=>{
      var u = navigator.userAgent, app = navigator.appVersion;   
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
      if(isAndroid){
        window.location.href=address
      }else{
        if ( u.indexOf('Version') >1 ) {
          window.location.href=address
        }else{
          window.webkit.messageHandlers.weixinPay.postMessage(address);
          window.location.href=address
        }
        
      }
    }






/******************************************************************/
   //顶部按钮
export const showBack = callback => {
  let requestFram;
  let oldScrollTop;
  var startX, startY, moveEndX, moveEndY, X, Y;
  let content= document.getElementsByClassName("voteContainer")[0];

  content.addEventListener('scroll',() => {
    showBackFun();
  }, false)
  content.addEventListener('touchstart',(e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    showBackFun();
  },{passive: true})

  content.addEventListener('touchmove',(e) => {
    showBackFun();
    moveEndX = e.changedTouches[0].pageX;
    moveEndY = e.changedTouches[0].pageY;
    X = moveEndX - startX;
    Y = moveEndY - startY;
    
  },{passive: true})

  content.addEventListener('touchend',() => {
    oldScrollTop = document.getElementsByClassName("voteContainer")[0]
    moveEnd();
  },{passive: true})

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if (content != oldScrollTop) {
        oldScrollTop = content.scrollTop;
        moveEnd();
      }else{
        cancelAnimationFrame(requestFram);
      }
      showBackFun();
    })
  }

  

  //判断是否达到目标点
  const showBackFun = () => {

    let showScroll = document.getElementsByClassName("voteContainer")[0].scrollTop;
    /*if(Math.abs(Y) > Math.abs(X) && Y < 0){
      //向上
      callback(true);
    }else if(Math.abs(Y) > Math.abs(X) && Y < 0){
      //向下
      callback(false);
    }*/
    if (showScroll > 500) {
      callback(true);
    }else{
      callback(false);
    }
  }

}
