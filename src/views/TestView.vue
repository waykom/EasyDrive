<script setup>
import { onMounted } from 'vue'
import { checkCode } from '@/api/api'
// onMounted(() => {
//   getImgCode()
// })

// const windowUrl = window.URL || window.webkitURL

// const getImgCode = async () => {
//   const params = {
//     type: 0,
//     time: new Date().getTime()
//   }
//   const blob = await checkCode(params)
//   const url = windowUrl.createObjectURL(blob)
//   console.log(url)
// }

</script>

<template>

  <div>
    <h1>TestView</h1>
  </div>

</template>

<style lang="less" scoped></style>