<template>
  <div class="comment-reply">
    <van-nav-bar
     :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
    >
    <van-icon slot="left" name="cross" @click="$emit('close')"/>
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论 -->
      <comment-item :comment="comment"/>
      <!-- 评论回复列表 -->
      <van-cell title="全部回复"/>
      <comment-list
      :source="comment.com_id"
      type="c"
      :list="commentList"
      @listPush="commentList.push(...$event)"
      />
    </div>
    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button size="small" round class="post-btn" @click="isPostCommentShow=true">写评论</van-button>
    </div>
    <van-popup v-model="isPostCommentShow" position="bottom" >
      <comment-post
       :target="comment.com_id"
       @post-success="onPostSuccess"
      />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostCommentShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  methods: {
    onPostSuccess (data) {
      this.$emit('replyCount')
      this.isPostCommentShow = false
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 184px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 88px;
  background: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn{
    width: 50%;
  }
}

</style>
