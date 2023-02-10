<template>
  <div class="search-suggestion">
    <van-cell
     v-for="(text, index) in suggestions"
     :key="index"
     icon="search"
     @click="$emit('search', text)"
    >
      <div slot="title"
       v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载，只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变时候，就会调用handler函数
      // 优化前
      // handler (val) {
      //   this.loadSearchSuggestions(val)
      // },
      // 优化前handler的完整写法
      // handler: function (val) {
      //   this.loadSearchSuggestions(val)
      // },
      // 用lodash优化后，debounce返回防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 300),
      // 该回调会在侦听开始后立即执行
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败请稍后重试')
      }
    },
    highlight (text) {
      if (!text) return
      // console.log(text)
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式中间//中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则，则手动 new RegExp
      // RegExp 正则表达式构造函数：
      //   1.参数1：匹配模式字符串，它会根据字符串创建正则对象
      //   2.参数2：匹配模式，g全局，i忽略大小写
      const reg = new RegExp(this.searchText, 'gi')
      // text.replace(/ /gi, highlightStr)
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>
