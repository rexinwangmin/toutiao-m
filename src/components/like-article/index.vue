<template>
  <van-button
   :icon="value === 1 ? 'good-job' : 'good-job-o'"
   :class="{liked: value=== 1}"
   :loading="loading"
   @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeCollect',
  props: {
    value: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      let status = -1
      try {
        if (this.value === 1) {
          await deleteLike(this.articleId)
        } else {
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.liked {
    .van-icon {
        color: #e5645f;
    }
}
</style>
