<template>
    <div class="newCoinListContainer">
        <div class="newCoinListHeader">
            <div>关于新币榜</div>
            <div @click="back"><span></span><span>返回</span></div>
        </div>
        <div class="newCoinListPic">
            <div>
                <img src="../../static/img/1-5关于新币榜@2x.png" alt="">
            </div>
            <p>新币榜1.0</p>
        </div>
        <div class="newCoinTextContainer">
            <p class="projectIntroduction">项目介绍</p>
            <p>新币榜是基于价值图谱链(Value Atlas Chain)的区块链与数字货币价值发现平台 (Token 为 YMB)，为用户提供数字货币的智能信息流、知识图谱、CV-Rank 指数(Coin Volatility Rank)与成长轨迹指数(Growth Track Index)，帮助用户寻找价值洼地，避免投资盲点，普及区块链知识，推动区块链生态的健康发展。</p>
            <p>代币介绍</p>
            <p>为了有效地激励参与者，实现平台的生态发展，新币榜将发行 Token—YMB，YMB 是基于以太坊 ERC20 标准发行的 Token，作为新币榜生态链中重要的价值媒介工具。在新币榜平台，各个参与者通过数据的分享与使用，Token 的获取与消耗有效衔接在一起，共同 
                构建、完善新币榜生态系统。 用户在系统内所有活跃、增长与创作行为，均能获得激励收益YMB。
            </p>
            <p></p><!--团队理念：公司秉承诚信、规范、高效的工作原则，用技术赢得市场，竭诚为用户提供优质、高效、快捷的服务。面向未来，坚持自主创新。-->
            <p></p><!--代币介绍-->
            <p></p><!--新币宝是代币驱动的代币投资者垂直社区。在新币宝，用户的付出和贡献将获得相应的回报。-->
            <p></p><!--YMB（羊毛币）是新币宝的代币，代表新币宝及其周边生态的使用权。-->
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.push("/bottomtab/me");
    }
  }
};
</script>
<style scoped>
.newCoinListContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  overflow-y: scroll;
}
::-webkit-scrollbar {
  width: 0;
}
.newCoinListHeader {
  width: 100%;
  height: 1.1733333333333333rem;
  text-align: center;
  position: relative;
}
.newCoinListHeader > div:nth-child(1) {
  line-height: 1.1733333333333333rem;
  font-size: 0.48rem;
  color: #373d41;
  border-bottom: 1px solid #f2f2f2;
}
.newCoinListHeader > div:nth-child(2) {
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 0.4rem;
  margin-left: 0.29333333333333333rem;
}
.newCoinListHeader > div:nth-child(2) > span:nth-child(1) {
  display: inline-block;
  width: 0.21333333333333335rem;
  height: 0.37333333333333335rem;
  background: url("../../static/img/top_return@2x.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  top: 0.03333333333333333rem;
}
.newCoinListHeader > div:nth-child(2) > span:nth-child(2) {
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-left: 0.18666666666666668rem;
}
.newCoinListPic {
  width: 100%;
  background: #fff;
  padding-top: 0.5333333333333333rem;
  padding-bottom: 0.5333333333333333rem;
}
.newCoinListPic > div:nth-child(1) {
  width: 2.1333333333333333rem;
  height: 2.1333333333333333rem;
  margin: auto;
}
.newCoinListPic > div:nth-child(1) > img {
  width: 100%;
  height: 100%;
}
.newCoinListPic > p {
  width: 100%;
  text-align: center;
  font-size: 0.37333333333333335rem;
  color: #949494;
  margin-top: 0.10666666666666667rem;
}
.newCoinTextContainer {
  width: 9.36rem;
  margin: auto;
  padding-top: 0.8rem;
  background: #fff;
  padding-bottom: 1.3333333333333333rem;
}
.projectIntroduction {
  font-size: 0.4266666666666667rem;
  color: #949494;
  margin-bottom: 0.21333333333333335rem;
}
.newCoinTextContainer > p:nth-child(2),
.newCoinTextContainer > p:nth-child(4),
.newCoinTextContainer > p:nth-child(5),
.newCoinTextContainer > p:nth-child(6),
.newCoinTextContainer > p:nth-child(7) {
  font-size: 0.37333333333333335rem;
  color: #373d41;
  text-align: justify;
  line-height: 0.6933333333333334rem;
}
.newCoinTextContainer > p:nth-child(3),
.newCoinTextContainer > p:nth-child(6) {
  font-size: 0.4266666666666667rem;
  color: #949494;
  margin-top: 0.5333333333333333rem;
  margin-bottom: 0.21333333333333335rem;
}
.newCoinTextContainer > p:nth-child(5) {
  font-weight: bolder;
}
</style>


