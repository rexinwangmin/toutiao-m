<template>
  <!-- immediate-check 在初始位置是否立即检查加载 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击重试"
      @load="onload"
      :immediate-check="false"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @onCommentLike="item.like_count=item.like_count+$event"
        @onIsLike="item.is_liking=!item.is_liking"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: function () { return [] }
    },
    type: {
      type: String,
      // 自定义Prop数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 数据偏移量
      limit: 10, // 评论个数
      error: false
    }
  },
  watch: {
    // 发布成功后，更新文章评论总数量
    async list () {
      const { data } = await getComments({
        type: this.type, // 评论类型
        source: this.source.toString(), // 文章id或评论id
        offset: this.offset, // 数据偏移量,用来获取下一页
        limit: this.limit
      })
      // 把文章评论的总数量传递给外部
      this.$emit('onLoadSuccess', data.data)
    }
  },
  created () {
    // 当你手动初始 onload 时，它不会自动开始初始的loading
    this.onload()
    this.loading = true
  },
  methods: {
    async onload () {
      // 1.请求获取数据
      // 2.将数据添加到列表中
      // 3.关闭loading
      // 4.判断是否还有数据
      //   有就更新获取下页的的数据页码
      //   没有就将finished设置为true

      try {
        const { data } = await getComments({
          type: this.type, // 评论类型
          source: this.source.toString(), // 文章id或评论id
          offset: this.offset, // 数据偏移量,用来获取下一页
          limit: this.limit
        })
        // 模拟测试
        // if (Math.random() > 0.5) {
        //   JSON.parse('sadasdadsdaa')
        // }
        const { results } = data.data
        // this.list.push(...results)
        this.$emit('listPush', results)

        // 把文章评论的总数量传递给外部
        this.$emit('onLoadSuccess', data.data)
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
