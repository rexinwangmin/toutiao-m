<template>
    <div class="channel-edit">
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <van-button
              type="danger"
              plain round
              size="mini"
              class="edit-btn"
              @click="isEdit=!isEdit"
            >
                {{ isEdit ? '完成' : '编辑' }}
            </van-button>
        </van-cell>
        <van-grid :gutter="10" class="my-grid">
            <van-grid-item
              class="grid-item"
              v-for="(channel, index) in MyChannels"
              :key="index"
              @click="onMyChannelClick(channel, index)"
            >
              <van-icon
               slot="icon"
               name="clear"
               v-show="isEdit && !fixedChannels.includes(channel.id)"
              />
              <span slot="text"
                class="text"
                :class="{active: index === active}"
              >
                {{ channel.name }}
              </span>
            </van-grid-item>
        </van-grid>

        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10" class="recommend-grid">
            <van-grid-item
              v-for="(channel, index) in recommendChannels"
              :key="index"
              :text="channel.name"
              icon="plus"
              class="grid-item"
              @click="onAddChannel(channel)"
            />
        </van-grid>
    </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'

export default {
  name: 'ChannelEdit',
  props: {
    MyChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false, // 控制编辑状态
      fixedChannels: [0] // 固定频道不允许删除
    }
  },
  computed: {
    // recommendChannels () {
    //   const channels = []
    //   this.allChannels.forEach(channel => {
    //     const res = this.MyChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })

    //     // 如果我的频道中不包括频道项，则收集到推荐频道中
    //     if (!res) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
    // }

    recommendChannels () {
      // 数组filter方法，遍历数组，把符合条件的元素存储到新数组中，并返回
      return this.allChannels.filter(channel => {
        return !this.MyChannels.find(MyChannel => {
          return MyChannel.id === channel.id
        })
      })
    }
  },
  created () {
    this.localAllChannels()
  },
  methods: {
    async localAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
        // console.log(data)
      } catch (err) {
        this.$toast('数据请求失败')
        console.log(err)
      }
    },
    onAddChannel (channel) {
      // 数组和对象可以修改，因为是引用类型数据，修改后父元素数据也发生改变，但是因为eslint验证会报错，关闭即可
      // 这里我用了子传父技术，也可以
      // console.log(channel)
      // this.MyChannels.push(channel)
      this.$emit('addChannel', channel)
    },
    onMyChannelClick (channel, index) {
      // 编辑状态 执行删除，非编辑状态，执行切换频道
      this.$emit('myChannelClick', channel, index, this.isEdit, this.fixedChannels)
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
    padding: 85px 0;

    .title-text {
        font-size: 32px;
        color: #333;
    }

    .edit-btn {
        width: 104px;
        height: 48px;
        line-height: 48px;
        font-size: 26px;
        color: #f85959;
        border: 1px solid #f85959;
    }

    /deep/ .grid-item {
        width: 160px;
        height: 86px;
        .van-grid-item__content {
            white-space: nowrap;
            background-color: #f4f5f6;
            .van-grid-item__text,.text {
                margin-top: 0;
                font-size: 28px;
                color: #222;
            }
            .active {
                color: #f85959;
            }
            .van-grid-item__icon-wrapper {
              position: unset;
            }
        }
    }

    /deep/ .my-grid{
        .grid-item{
            .van-icon-clear{
                position: absolute;
                top: -15px;
                right: -15px;
                font-size: 30px;
                color: #cacaca;
                z-index: 2;
            }
        }
    }

    /deep/ .recommend-grid {
        .van-grid-item__content{
            flex-direction: row;
            .van-icon-plus {
                margin-right: 6px;
                font-size: 28px;
            }
            // .van-grid-item__text{
            //     margin-top: 0;
            // }
        }
    }
}
</style>
