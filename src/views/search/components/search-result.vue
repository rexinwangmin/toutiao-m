<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请点击失败"
      @load="onLoad"
    >
    <van-cell
     v-for="(article, index) in list"
     :key="index"
     :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 搜索关键词
        })
        console.log(data)
        const { results } = data.data
        console.log(results)
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          // 更新页码
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        // 加载失败提示状态
        this.error = true
        // 加载失败。 关闭loading
        this.loading = false
        // this.$toast('数据获取失败，请稍后重试')
      }
      // 1. 获取请求数据
      // 2. 将数据添加到请求数组中
      // 3. 将本次加载的loading关闭
      // 4. 判断是否还有数据
      //    如果有，则更新获取下一页数据的页码
      //    如果没有，则将加载状态 finished 设置为结束
    }
  }
}
</script>

<style scoped lang="less">
// 自己的滚动容器
// 侧边栏不会顶到最上面
.search-result {
  // height: 100%; 是相对与父元素，vh不受影响
  height: 92vh;
  overflow-y: auto;
}
</style>
