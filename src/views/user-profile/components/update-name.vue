<template>
  <div class="update-name">
    <van-nav-bar
     title="设置昵称"
     left-text="取消"
     right-text="完成"
     @click-left="$emit('close')"
     @click-right="onConfirm"
    />
    <div class="filed-wrap">
      <!-- 输入框 -->
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          return this.$toast.fail('昵称不能为空！')
        }
        await updateUserProfile({
          name: localName
        })
        // console.log(data)
        // 更新视图
        this.$emit('input', localName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败，请稍后重试！')
        // console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="less">
.filed-wrap {
  padding: 15px;
}
</style>
