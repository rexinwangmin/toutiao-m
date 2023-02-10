<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="arrow-left" @click="$router.back()">返回</van-icon>
    </van-nav-bar>

    <!-- 登录表单 -->
    <!-- 表单验证 rules，当表单提交时会自动触发，成功触发submit，失败不触发 -->
    <van-form ref="loginForm" @submit="onSubmit">
        <van-field
            name="mobile"
            placeholder="请输入手机号"
            v-model="user.mobile"
            :rules="userFormRules.mobile"
            type="number"
            maxlength="11"
        >
            <i slot="left-icon" class="iconfont icon-shouji"></i>
        </van-field>
        <van-field
            name="code"
            placeholder="请输入验证码"
            v-model="user.code"
            :rules="userFormRules.code"
            type="number"
            maxlength="6"
        >
            <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
            <template #button>
              <!-- time 倒计时时长 -->
              <van-count-down
               :time="1000*60"
               format="ss s"
               v-if="isCountDownShow"
               @finish="isCountDownShow=false"
              />
              <van-button
                @click="onSendSms"
                v-else
                native-type="button"
                class="send-sms-btn"
                round size="small"
                type="default">
                发送验证码
              </van-button>
            </template>
        </van-field>
        <div class="login-btn-wrap">
            <van-button class="login-btn" block type="info" native-type="submit">
                登录
            </van-button>
        </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 从上到下校验
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        },
        {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        },
        {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false // 是否展示倒计时
    }
  },
  methods: {
    async onSubmit (values) {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      // 在组件中必须通过this.$toast 来调用 TOast 组件
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认2秒，如果为零，则持续展示
      })
      // 提交表单，请求登录
      try {
        const { data } = await login(this.user)
        console.log('登录成功', data)
        this.$store.commit('setUser', data.data)
        // 新的toast被调用，旧的被停止
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来页面
        this.$router.back() // 暂用，等待完善优化
      } catch (err) {
        if (err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误')
        } else {
          // console.log('登录失败,请稍后重试', err)
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 根据请求响应结果处理后续操作
    },
    // 发送验证码
    async onSendSms () {
      // 校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        // console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 显示倒计时
      this.isCountDownShow = true
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        // console.log('成功', res)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，停止倒计时
        this.isCountDownShow = false
        // console.log('失败', err)
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container{
  .iconfont{
    font-size: 37px;
  }
  .send-sms-btn{
    width: 160px;
    height: 50px;
    background-color: #ededed;
    line-height: 50px;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap{
    padding: 53px 33px;
    .login-btn{
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
