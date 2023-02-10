<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/" class="search-form">
      <van-search
          v-model="searchText"
          show-action
          placeholder="请输入搜索关键词"
          background="#3296fa"
          shape="round"
          @search="onSearch"
          @cancel="onCancel"
          @focus="isResultShow=false"
      />
    </form>
    <!-- 搜索结果 -->
    <search-result
     v-if="isResultShow"
     :search-text="searchText"/>
    <!-- 联想建议 -->
    <search-suggestion
     v-else-if="searchText"
     :search-text="searchText"
     @search="onSearch"
    />
    <!-- 搜索历史记录 -->
    <search-history
     v-else
     :search-histories="searchHistories"
     @onSearchItemClick="searchItemClick"
     @onDeleteAll="searchHistories = []"
    />
  </div>
</template>

<script>
import SearchHistory from './components/search-history.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索的历史记录
    }
  },
  watch: {
    searchHistories (val) {
      setItem('TOUTIAO_SEARCH_HISTORIES', val)
    }
  },
  methods: {
    onSearch (val) {
      // 更新文本框内容
      this.searchText = val
      // 存储搜索纪录
      // 要求：不要有重复历史记录 最新的排在最前
      const index = this.searchHistories.indexOf(val) // 找到相同数据的索引
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 展示渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$toast('取消')
      this.$router.back()
    },
    // 删除历史记录
    searchItemClick (item, index, isDeleteShow) {
      if (isDeleteShow) {
        // 删除状态
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.onSearch(item)
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
    padding-top: 108px;
    .van-search__action {
        color: #fff;
    }
    .search-form{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
}

</style>
