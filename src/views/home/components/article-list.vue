<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isloading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1000"
    >
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
    <article-item
      v-for="(article, index) in list"
      :key="index"
      :article="article"
    />
      <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title" /> -->
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [],
      loading: false, // 加载中
      finished: false, // 加载结束
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      isloading: false, // 下拉刷新
      refreshSuccessText: '刷新成功' // 更新下拉刷新文本
    }
  },
  methods: {
    async onRefresh () {
      // 请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 每次获取最新数据
          with_top: 1
        })
        // 将数据追加到顶部
        const { results } = data.data
        this.list.unshift(...results)
        this.isloading = false
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isloading = false
        this.refreshSuccessText = '刷新失败'
      }
    },
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: this.timestamp || Date.now(), // 时间戳 请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含 0-不包含
        })
        // console.log(data)
        // 模拟加载失败
        // JSON.parse('dadasdsds')

        // 将数据添加到list数组当中
        const { results } = data.data
        this.list.push(...results)

        // 设置本次加载状态结束
        this.loading = false

        // 判断数据是否加载结束
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多
          this.finished = true
        }
      } catch (err) {
        this.loading = false // 关闭loading效果
        this.error = true // 开启错误提示
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list{
  // position: fixed;
  // top: 180px;
  // bottom: 100px;
  // left: 0;
  // right: 0;
  // overflow-y: auto;
  // height: 100% 是相对与父元素 而vw/vh则不受影响
  height: 79vh;
  overflow-y: auto;
}
</style>
