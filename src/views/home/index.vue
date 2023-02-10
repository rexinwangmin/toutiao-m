<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- v-model绑定当前激活标签的索引值 -->
    <!-- animated 动画切换效果. swipeable 属性可以开启滑动切换标签页。 -->
    <!-- swipe-threshold 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable swipe-threshold="3">
      <van-tab
       :title="channel.name"
       v-for="channel in channels"
       :key="channel.id">
       <!-- 文章列表 -->
        <ArticleList :channel="channel"></ArticleList>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn"
        @click="isChannelEditShow=true"
      >
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{height: '100%'}"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @addChannel="addChannelFn"
        @myChannelClick="onMyChannelClick"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { setItem, getItem } from '@/utils/storage'
import { addUserChannels, deletedUserChannels } from '@/api/channel'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        // console.log(this.channels)
        let channels = []
        if (this.user) {
          // 已登录
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有，请求获取默认接口
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }

        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    async addChannelFn (channel) {
      this.channels.push(channel)
      // console.log(this.user)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，将数据存储到线下
          await addUserChannels({
            id: channel.id, // 频道id
            seq: this.channels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.channels)
      }
    },
    onMyChannelClick (channel, index, isEdit, fixedChannels) {
      if (isEdit) {
        // 编辑状态
        // 如果是固定频道，不删除
        if (fixedChannels.includes(channel.id)) return
        // 删除
        this.channels.splice(index, 1)
        // 删除更新后
        if (index <= this.active) {
          // 让激活频道减一
          this.active--
        }
        // 持久化处理
        this.deleteChannel(channel.id)
      } else {
        // 非编辑状态
        this.active = index
        this.isChannelEditShow = false
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录
          await deletedUserChannels(channel)
        } else {
          // 未登录
          setItem('TOUTIAO_CHANNELS', this.channels)
        }
      } catch (err) {
        this.$toast('删除失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container{
  padding-top: 174px;
  padding-bottom: 100px;
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

  /deep/.channel-tabs{
    .van-tabs__wrap{
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }
    .van-tab{
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active{
      color: #333;
    }
    .van-tabs__nav{
      padding-bottom: 0;
    }
    .van-tabs__line{
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder{
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn{
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont{
        font-size: 33px;
      }
      &::before{
        content: "";
        position: absolute;
        left: 0;
        width: 1px; // 手机上能看见
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }

}
</style>
