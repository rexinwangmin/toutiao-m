module.exports = {
  plugins: {
    //   // 自动添加浏览器前缀，vuecli内部配置了
    //   'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8'] //配置兼容的浏览器信息
    //   },
    // 把px转为rem
    'postcss-pxtorem': {
      // lib-flexible 的rem适配方案：10份
      // routValue: 设计稿的1/10，但是vant建议设置37.5
      // routValue：number|function
      // rootValue: 37.5,
      // 函数: 动态处理返回
      // postcss-pxtorem 处理每个 css 文件的时候都会来调用这个函数，
      // 它会把处理的css文件相关函数通过参数传递给该函数
      roootValue ({ file }) {
        return file.indexof('vant') !== -1 ? 37.5 : 75 // 如果是vant就是37.5，自己的75
      },
      propList: ['*'] // 配置要转换的css属性 *代表所有
    }
  }
}
