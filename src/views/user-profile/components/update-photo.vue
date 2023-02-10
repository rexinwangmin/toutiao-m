<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img">
    <div class="toolbar">
        <div class="cancel" @click="$emit('close')">取消</div>
        <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  methods: {
    onConfirm () {
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // console.log(blob)
        this.upDateUserPhoto(blob)
      })
    },
    async upDateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 接口要求传递formdata对象
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        this.$emit('close')
        this.$emit('updataPhoto', data.data.photo)
        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast.fail('修改失败，请稍后重试！')
        // console.log(err)
      }
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  }
}
</script>

<style scoped lang="less">
.update-photo {
    height: 100%;
    background-color: #000;
  .toolbar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel, .confirm{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90px;
        height: 90px;
        font-size: 30px;
        color: #fff;
    }
  }
}
.img {
    display: block;
    max-width: 100%;
}

</style>
