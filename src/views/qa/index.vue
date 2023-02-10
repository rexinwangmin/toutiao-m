<template>
  <div class="qa-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    不写了，不写了
  </div>
</template>

<script>
export default {
  name: 'QaIndex'
}
</script>

<style scoped lang="less">
.qa-container {
  padding-top: 92px;
}
/deep/.van-nav-bar__title{
    max-width: unset;
}
.search-btn{
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon{
      font-size: 32px;
    }
}

</style>
