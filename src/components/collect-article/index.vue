<template>
  <van-button
   :icon="value ? 'star' : 'star-o'"
   :class="{collected:value}"
   @click="onCollect"
   :loading="loading"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
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
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消删除
          await deleteCollect(this.articleId)
        } else {
          // 未收藏，添加收藏
          await addCollect(this.articleId)
        }
        // 自定义修改数据并不是立即的
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (err) {
        this.$toast.fail('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
  .collected {
    .van-icon {
      color: #ffa500
    }
  }
</style>
