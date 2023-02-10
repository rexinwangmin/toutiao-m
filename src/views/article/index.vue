<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back( )"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate | relativeTime}}</div>
          <!-- <van-button
            v-if="!article.is_followed"
            @click="onFollow"
            :loading="followLoading"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
          >关注</van-button>
          <van-button
            v-else
            @click="onFollow"
            :loading="followLoading"
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
          <follow-user
           v-model="article.is_followed"
           class="follow-btn"
           :userId="article.aut_id"
          >
          <!--
            当传递给子组件时还要修改数据时：
            传递：props :is_followed="article.is_followed"
            修改：自定义事件 @upddate-is_followed="article.is_followed=$event"
            简写：在组件上使用v-model
              默认：
                value="article.is_followed"
                @input="article.is_followed=$event"
           -->
           <!-- 如果需要修改 v-model 的规则名称，可以通过子组件的 model 属性来配置修改 -->
           <!--
            一个组件上只能使用一次v-model
            如果有多个数据，可以使用属性的.sync修饰属性
            -->
          <!-- 模板中的$event是事件参数 -->
          </follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
         class="article-content markdown-body"
         v-html="article.content"
         ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <comment-list
         :source="article.art_id"
         @onLoadSuccess="totalCommentCount=$event.total_count"
         :list="commentList"
         @listPush="commentList.push(...$event)"
         @reply-click="onReplyClick"
        />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostCommentShow=true"
          >写评论</van-button>
          <van-icon
            class="commment-icon"
            name="comment-o"
            :badge="totalCommentCount"
          />
          <!-- <van-icon
            color="#777"
            name="star-o"
          /> -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <!-- <van-icon
            color="#777"
            name="good-job-o"
          /> -->
          <!-- <van-button
          class="btn-item"
          icon="good-job-o"
          /> -->
          <like-article
           class="btn-item"
           v-model="article.attitude"
           :article-id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论 -->
        <van-popup
          v-model="isPostCommentShow"
          position="bottom"
        >
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /发布评论 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的，只有在第一次展示时才渲染 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 94%"
    >
      <comment-reply
       v-if="isReplyShow"
       :comment="currentComment"
       @replyCount="currentComment.reply_count++"
       @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
// import { addFollow, deleteFollow } from '@/api/user'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'
import commentReply from './components/comment-reply.vue'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    commentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载状态
      errStatus: 0,
      // followLoading: false
      totalCommentCount: 0,
      isPostCommentShow: false, // 控制写评论弹出层
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {} // 当前点击回复评论项
    }
  },
  // 给所有的后代组件提供数据
  // 依赖注入
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)

        // 模拟错误
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdadsdasdasdasd')
        // }
        // console.log(data)
        // 数据驱动视图不是立即的
        this.article = data.data

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
        // 请求成功，关闭loading
        // this.loading = false
      } catch (err) {
        // this.loading = false
        // this.$toast('获取数据失败')
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功失败都关闭
      this.loading = false
    },
    previewImage () {
      // 得到所有的image节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)
      const imgsUrl = []
      imgs.forEach((img, index) => {
        imgsUrl.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images: imgsUrl,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },
    // async onFollow () {
    //   this.followLoading = true
    //   try {
    //     if (this.article.is_followed) {
    //       // 已关注， 取消关注
    //       await deleteFollow(this.article.aut_id)
    //       // console.log(data)
    //     } else {
    //       // 未关注， 添加关注
    //       await addFollow(this.article.aut_id)
    //     }
    //     this.article.is_followed = !this.article.is_followed
    //   } catch (err) {
    //     let message = '操作失败，请稍后重试！'
    //     if (err.response && err.response.status === 400) {
    //       message = '你不能关注你自己！'
    //     }
    //     this.$toast(message)
    //   }
    //   this.followLoading = false
    // },
    onPostSuccess (data) {
      this.isPostCommentShow = false
      // 将发布评论放到顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      this.currentComment = comment
      // 显示评论回复
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-badge {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f
    }
  }
}
</style>
