<template>
  <!-- <div class="article-item">
    文章
  </div> -->
  <van-cell
    class="article-item"
    :to="`/article/${article.art_id}`"
  >
  <!-- :to="{
    // 根据路由名称跳转
    name: article
    // 传递路由参数
    //属性名：路由设计中的动态参数名称
    params: {
      articleID: article.art_id
    }
  }" -->
  <div slot="title" class="title van-multi-ellipsis--l2">
    {{ article.title }}
  </div>
  <div slot="label">
    <div v-if="article.cover.type===3" class="cover-wrap">
        <div class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
            <van-image
              class="cover-image"
              fit="cover"
              :src="img"
            />
        </div>
    </div>
    <div class="label-info-wrap">
      <span>{{ article.aut_name }}</span>
      <span>{{ article.comm_count }}评论</span>
      <span>{{ article.pubdate | relativeTime }}</span>
    </div>
  </div>
  <!-- <div slot="default">123</div> -->
  <van-image
    slot="default"
    v-if="article.cover.type === 1"
    :src="article.cover.images[0]"
    class="right-cover"
    fit="cover"
  />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
.article-item{
    .title{
        font-size: 32px;
        color: #3a3a3a;
    }
    .van-cell__value{
        padding-left: 25px;
        flex: unset;
        width: 232px;
        height: 146px;
    }
    .right-cover{
        width: 232px;
        height: 146px;
    }

    .label-info-wrap span{
        font-size: 22px;
        color: #b4b4b4;
        margin-right: 25px;
    }

    .cover-wrap{
        display: flex;
        padding: 30px 0;
        .cover-item{
            flex: 1;
            height: 146px;
            &:not(:last-child){
                padding-right: 4px;
            }
            .cover-image{
                width: 100%;
                height: 146px;
            }
        }
    }
}
</style>
