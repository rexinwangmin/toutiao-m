<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avator" :src="userInfo.photo"/>
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="small" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录/注册</span>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid :column-num="2" class="grid-nav" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知  -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" is-link />
    <van-cell title="退出登录" class="lgout-cell" v-if="user" clickable @click="onLgOut"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 如果用户登录了，则请求加载用户数据
    if (this.user) { this.loadUserInfo() }
  },
  methods: {
    onLgOut () {
      // 退出提示
      // 在组件中使用 this.$dialog
      this.$dialog.confirm({
        title: '确认退出?'
        // message: ''
      }).then(() => {
        // 确认执行
        this.$store.commit('setUser', null)
      }).catch(() => {
        // 取消执行
      })
      // 确认退出
      // 清楚登录状态
    },

    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        // console.log(this.userInfo)
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
        // console.log(err.message)
      }
    }
  }
}
</script>

<style scoped lang="less">
.my-container{
  .header{
    height: 361px;
    background-image: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login{
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img{
        margin-bottom: 15px;
        width: 132px;
        height: 132px;
      }
      .text{
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info{
    .base-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      height: 231px;
      .left{
        display: flex;
        align-items: center;
        .avator{
          margin-right: 23px;
          width: 132px;
          height: 132px;
          border: 1px solid #fff;
        }
        .name{
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats{
      // height: 130px;
      display: flex;
      .data-item{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex: 1;
        height: 130px;
        color: #fff;
        .count{
          font-size: 36px;
        }
        .text{
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav{
     margin-bottom: 9px;
    .grid-item{
      height: 141px;
      i.iconfont{
        font-size: 45px;
      }
      .icon-shoucang{
        color: #eb5253;
      }
      .icon-lishi{
        color: #ff9d1d;
      }
      span.text{
        font-size: 28px;
      }
    }
  }

  .lgout-cell{
    margin-top: 9px;
    text-align: center;
    color: #d86262;
  }
}
</style>
