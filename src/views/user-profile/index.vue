<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
     title="个人信息"
     class="page-nav-bar"
     left-arrow @click-left="$router.back()"/>

     <input type="file"
      hidden
      ref="file"
      @change="onFileChange"
    />
    <!-- 个人信息 -->
    <van-cell title="头像"
     is-link
     @click="$refs.file.click()"
    >
      <van-image
       class="avatar"
       fit="cover"
       round
       :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称"
     :value="user.name"
     is-link
     @click="isUpdateNameShow=true"
    />
    <van-cell
     title="性别" :value="user.gender === 0 ? '男' : '女'" is-link
     @click="isUpdateGenderShow=true"
    />
    <van-cell title="生日" :value="user.birthday" is-link
     @click="isUpdateBirthdayShow=true"/>
    <!-- 编辑昵称 -->
    <van-popup
     style="height:100%"
     v-model="isUpdateNameShow"
     position="bottom"
    >
      <update-name
      v-if="isUpdateNameShow"
       @close="isUpdateNameShow=false"
       v-model="user.name"
      />
    </van-popup>
    <!-- 编辑性别 -->
    <van-popup
     v-model="isUpdateGenderShow"
     position="bottom"
    >
      <update-gender
      v-if="isUpdateGenderShow"
      @close="isUpdateGenderShow=false"
      v-model="user.gender"
      />
    </van-popup>
    <!-- 编辑生日 -->
    <van-popup
     v-model="isUpdateBirthdayShow"
     position="bottom"
    >
      <update-birthday
      v-if="isUpdateBirthdayShow"
      @close="isUpdateBirthdayShow=false"
      v-model="user.birthday"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
     v-model="isUpdatePhotoShow"
     position="bottom"
     style="height: 100%"
    >
      <update-photo
       v-if="isUpdatePhotoShow"
       @close="isUpdatePhotoShow=false"
       @updataPhoto="user.photo=$event"
       :img="img"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: [], // 用户资料
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法，每次使用完毕把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}

</style>
