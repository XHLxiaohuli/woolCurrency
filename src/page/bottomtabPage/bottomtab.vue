<template>
  <div class="tabContainer">
    <router-view/>
    <ul class="tabClass">
      <li>
        <div @click="jumpHome" :class="{colorClass:isAddClass=='/bottomtab/home'}">
          <div class="ionce">
            <img v-show="isAddClass!='/bottomtab/home'" src="../../static/img/home_dark@2x.png" alt="">
            <img v-show="isAddClass=='/bottomtab/home'" src="../../static/img/home_bright@2x.png" alt="">
          </div>
          羊毛圈
        </div>
      </li>
      <li>
        <div @click="jumpVote" :class="{colorClass:isAddClass=='/bottomtab/vote'}">
          <div class="ionce">
            <img v-show="isAddClass!='/bottomtab/vote'" src="../../static/img/vote_dark@2x.png" alt="">
            <img v-show="isAddClass=='/bottomtab/vote'" src="../../static/img/vote_bright@2x.png" alt="">
          </div>
          投票
        </div>
      </li>
      <li>
        <div @click="jumpMy" :class="{colorClass:isAddClass=='/bottomtab/me'}">
          <div class="ionce">
            <img v-show="isAddClass!='/bottomtab/me'" src="../../static/img/my-dark@2x.png" alt="">
            <img v-show="isAddClass=='/bottomtab/me'" src="../../static/img/my_bright@2x.png" alt="">
          </div>
          我的
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {sesStorage} from "scripts/moment";
export default {
  data() {
    return {
      isAddClass: ""
    };
  },
  methods: {
    jumpHome() {
      this.isAddClass = 1;
      this.$router.push("/bottomtab/home");
    },
    jumpVote() {
      this.isAddClass = 2;
      sesStorage("liDistance",0)
      this.$router.push("/bottomtab/vote");
    },
    jumpMy() {
      this.isAddClass = 3;
      this.$router.push("/bottomtab/me");
    }
  },
  beforeMount() {
    this.isAddClass = window.location.pathname;
  },
  updated() {
    this.isAddClass = window.location.pathname;
  }
};
</script>
<style scoped>
.tabContainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  overflow: scroll;
}
.tabClass:after {
  content: ".";
  visibility: hidden;
  display: block;
  height: 0;
  clear: both;
}
.tabClass {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  margin: auto;
  padding-top: 0.26666666666666666rem;
  padding-bottom: 0.16rem;
  background: #ffffff;
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
}
.tabClass > li {
  width: 33.3%;
  float: left;
}
.tabClass > li > div {
  /* width: 0.64rem; */
  width: 50%;
  margin: auto;
  font-size: 0.26666666666666666rem;
  color: #949494;
  text-align: center;
}
.ionce {
  /* width: 100%; */
  width: 0.64rem;
  height: 0.64rem;
  margin: auto;
  margin-bottom: 0.08rem;
}
.ionce > img {
  width: 100%;
  height: 100%;
}
.colorClass {
  color: #373d41 !important;
}
</style>
