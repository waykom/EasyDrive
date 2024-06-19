<script setup>
import { getUserSpace, getAllFileTree, getFileByType } from '@/api/api'
import MainBox from '@/components/home/MainBox.vue'
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import $bus from '@/utils/bus'

const route = useRoute()
const router = useRouter()

// 获取全部的文件
let tableData = ref([])
const getAllFile = async () => {
  const res = await getAllFileTree()
  if (res.code === 200) {
    // localStorage.setItem('files', JSON.stringify(res.data))
    tableData.value = res.data
    console.log('全部文件', tableData.value)
  }
  $bus.emit('getAllFile', tableData.value)
}
onMounted(() => {
  getAllFile()
  $bus.on('uploadCallBack', getAllFile)
})

</script>

<template>
  <MainBox></MainBox>
</template>
