<template>
	<div class="sign"><div class="signmb"></div>
		<div class="sign_bar">
		<div class="sign_wrap">
			<p>恭喜您，今日签到成功</p>
			<h1>+{{award}}YMB</h1>
			<div class="con_wrap">
				<div class="content1">
					<span class="activeSign" v-if="signData.continuous>=1"></span>
					<span v-else>+{{signData.oneSignNum}}</span>
					
					<span class="activeSign" v-if="signData.continuous>=2"></span>
					<span v-else>+{{signData.twoSignNum}}</span>
	
					<span class="activeSign" v-if="signData.continuous>=3"></span>
					<span v-else>+{{signData.threeSignNum}}</span>

					<span class="activeSign" v-if="signData.continuous>=4"></span>
					<span v-else>+{{signData.fourSignNum}}</span>

					<span class="activeSign" v-if="signData.continuous>=5"></span>
					<span v-else>+{{signData.fiveSignNum}}</span>
				</div>
				<div class="cont_day">
					<span>一天</span>
					<span>二天</span>
					<span>三天</span>
					<span>四天</span>
					<span>五天</span>
				</div>
			</div>
			<div class="con_wrap2">
				<div class="content2">
					<span class="activeSign" v-if="signData.continuous>=6"></span>
					<span v-else>+{{signData.sixSignNum}}</span>

					<span class="activeSign" v-if="signData.continuous>=7"></span>
					<span v-else>+{{signData.sevenSignNum}}</span>

					<span class="activeSS">+{{signData.sevenSignNum}}</span>
				</div>
				<div class="cont_day">
					<span>六天</span>
					<span>七天</span>
					<span>七天后</span>
				</div>
			</div>
		</div>
		<div class="close" @click="signClose">
			<span></span>
		</div>
		</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			award:-1,
		}
	},
	props:['signData'],
	created(){
		switch(this.signData.continuous){
                case 1:
                    this.award=this.signData.oneSignNum;
                    break;
                 case 2:
                 	this.award=this.signData.twoSignNum;
                 	break;
                 case 3:
                 	this.award=this.signData.threeSignNum;
                 	break;
                 case 4:
                 	this.award=this.signData.fourSignNum;
                 	break;
                 case 5:
                 	this.award=this.signData.fiveSignNum;
                 	break;
                 case 6:
                 	this.award=this.signData.sixSignNum;
                 	break;
                 case 7:
                 	this.award=this.signData.sevenSignNum;
                 	break;
                 default:
                 	this.award=this.signData.sevenSignNum;
             }
	},
	methods:{
		signClose(){
			this.$emit("signChild",true)
		}
	}
}
</script>
<style scoped>

.sign{
	width:100%;
	height:100%;
	background:url(../../static/img/signbg.png) no-repeat;
	background-size:100% 100%;
	/* opacity:0.9; */
	position:fixed;
	z-index: 99;
}
.signmb{
	position:fixed;
	left:0;
	top:0;
	right:0;
	bottom:0;
	margin:auto;
	background:#000;
	opacity:0.5;

}
.sign_bar{
	width:100%;
	height:100%;
	background:url(../../static/img/sigbar.png) no-repeat;
	background-size:100%;
	position:relative;
}
.sign_wrap{
	overflow:hidden;
  	width: 6.9rem;
 	height: 6.54rem;
 	background:#fff;
  	position: absolute;
  	left: 0;
  	right: 0;
  	top: 38%;
  	bottom: 0;
  	margin: 0 auto;
}
.sign_wrap p{
	text-align:center;
	color: #949494;
	font-size:0.3733rem;
	line-height:0.533rem;
}
.sign_wrap h1{
	text-align:center;
	font-size: 0.8rem;
	color: #373D41;
	line-height:1.12rem;
}
.con_wrap{
	padding:0.2rem;
}
.content1{
	display:flex;
	justify-content:space-between;
	background:url(../../static/img/line.png) repeat-x left center;
	background-size:10%;
}
.content1 span{
	display:inline-block;
	vertical-align:middle;
	width: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #949494;
    background: #F2F2F2;
    border-radius: 50%;
} 
.cont_day{
	display:flex;
	justify-content:space-between;
}
.cont_day span{
	display:inline-block;
	vertical-align:middle;
	padding:0.2rem;
}
.con_wrap2{
	padding:0.3rem 1.2rem;
}
.content2{
	display:flex;
	justify-content:space-between;
	background:url(../../static/img/line.png) repeat-x left center;
	background-size:10%;
}
.content2 span{
	display:inline-block;
	vertical-align:middle;
	width: 1rem;
    line-height: 1rem;
    text-align: center;
    color: #949494;
    background: #F2F2F2;
    border-radius: 50%;
}

.close{
	width:100%;
	height: 1.88rem;
    position: relative;
  	left: 0;
  	top: 75%;
  	margin: 0 auto;
  	text-align:center;
}
.close span{
	display:inline-block;
	width:0.85rem;
	height:1.88rem;
	background:url(../../static/img/sign_close.png) no-repeat;
	background-size:100%;
}
.content1 span.activeSign{
	display:inline-block;
	vertical-align:middle;
	background:url(../../static/img/signtrue.png) no-repeat left center;
	background-size:100%;
	border-radius:50%;
}
.content2 span.activeSign{
	display:inline-block;
	vertical-align:middle;
	background:url(../../static/img/signtrue.png) no-repeat left center;
	background-size:100%;
	border-radius:50%;
}
.content2 span.activeSS{
	background:#FEC82F;
	width:1.6rem;
	border-radius:0.8rem;
}
</style>