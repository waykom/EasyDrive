<script setup>
import { getUserSpace, getAllFileTree, getFileByType } from '@/api/api'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import $bus from '@/utils/bus'
const route = useRoute()
const router = useRouter()

// 单位 M
const chunkSize = 1024 * 1024
// 空间进度条
const spaceProcess = ref()
// 用户总空间
const totalSize = ref()
// 用户已使用的空间
const userSpace = ref()
// 获取用户空间
const getSpace = async () => {
  const res = await getUserSpace()
  if (res.code === 200) {
    userSpace.value = (res.data.userSpace / chunkSize).toFixed(1)
    totalSize.value = (res.data.totalSpace / chunkSize).toFixed(1)
    spaceProcess.value = Math.floor((userSpace.value / totalSize.value) * 100)
  }
}

onMounted(() => {
  getSpace()
})
</script>

<template>
  <el-container>
    <el-aside class="aside">
      <slot name="aside"></slot>
      <div class="space-info">
        <div>空间使用</div>
        <div><el-progress :percentage="spaceProcess" /></div>
        <div class="space-use">
          <div>
            <span>{{ userSpace }} MB</span>
            /
            <span>{{ totalSize }} MB</span>
          </div>
          <div>
            <svg @click="getSpace" class="iconfont space-reflash" style="font-size: 16px;">
              <use xlink:href="#icon-shuaxin"></use>
            </svg>
          </div>
        </div>
      </div>
    </el-aside>
    <slot name="main"></slot>
  </el-container>
</template>

<style lang="less" scoped>
.aside {
  width: 200px;
  height: calc(100vh - 56px);
  border-right: 1px solid #f1f2f4;
  padding: 20px 10px;
  position: relative;

  .space-info {
    position: absolute;
    width: 90%;
    bottom: 20px;
    padding: 0 5px;
    font-size: 14px;
    color: #636d7e;

    .space-use {
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .space-reflash {
        cursor: pointer;
      }
    }
  }
}
</style>