<template>
  <div class="search-history">
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <span @click="$emit('onDeleteAll')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow=true" />
    </van-cell>
    <van-cell
     :title="item"
     v-for="(item, index) in searchHistories"
     :key="index"
     @click="onSearchItemClick(item, index)"
    >
        <van-icon v-show="isDeleteShow" name="close"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      // 删除状态
      this.$emit('onSearchItemClick', item, index, this.isDeleteShow)
      // 非删除状态， 直接进入搜索
    }
  }
}
</script>

<style>

</style>
