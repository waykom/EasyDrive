<script setup>
//  引入iconfont的js文件
import '@/assets/js/iconfont.js'

</script>

<template>
  <RouterView></RouterView>
</template>

<style lang="less">
// 在iconfont中加入通用 CSS 代码
.iconfont {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

a {
  color: #409EFF;
  text-decoration: none;
}
</style>