<template>
    <van-button
        v-if="!isFollowed"
        @click="onFollow"
        :loading="Loading"
        type="info"
        color="#3296fa"
        round
        size="small"
        icon="plus"
    >关注</van-button>
    <van-button
        v-else
        @click="onFollow"
        :loading="Loading"
        round
        size="small"
    >已关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  // 自定义 v-model 的属性
  model: {
    prop: 'isFollowed', // 默认为value
    event: 'update-is_followed' // 默认为input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      Loading: false
    }
  },
  methods: {
    async onFollow () {
      this.Loading = true
      try {
        if (this.isFollowed) {
          // 已关注， 取消关注
          await deleteFollow(this.userId)
          // console.log(data)
        } else {
          // 未关注， 添加关注
          await addFollow(this.userId)
        }
        // this.article.is_followed = !this.article.is_followed
        this.$emit('update-is_followed', !this.isFollowed)
        // this.$emit('input', !this.value)
      } catch (err) {
        // console.log(err)
        let message = '操作失败，请稍后重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.Loading = false
    }
  }
}
</script>

<style>

</style>
