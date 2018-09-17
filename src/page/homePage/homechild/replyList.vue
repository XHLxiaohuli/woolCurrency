<template>
	<div>
		<div class="authorReply" v-for="item in replyData">
            <span>{{item.replyUsername}}回复：</span>
            <span>{{item.replyContent}}</span><span></span>
        </div>
	</div>
</template>

<script>
import axios from "../../../utils/axios";
import qs from "qs";
export default {
  data() {
    return {
      replyData: []
    };
  },
  props: ["replyId"],
  created() {
    //this.setData();
  },
  methods: {
    setData() {
      axios
        .post(
          "postCommentReplyList",
          qs.stringify({
            userId: 1,
            commentId: this.replyId,
            currentPage: 1,
            pageSize: 5
          }),
          {}
        )
        .then(data => {
          this.replyData = data.page.list;
        })
        .catch(err => {});
    }
  }
};
</script>

<style scope>
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
</style>