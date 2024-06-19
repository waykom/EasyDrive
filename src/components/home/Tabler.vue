<script setup>
import { onMounted, reactive, ref, watch, unref, onBeforeMount, nextTick, computed } from 'vue'
import { getAllFileTree } from '@/api/api'
import $bus from "@/utils/bus"
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

let tableData = ref([])

onMounted(() => {
  $bus.on('getAllFile', (val) => {
    tableData.value = val
  })
})

// 点击文件夹
const toChild = (row) => {
  console.log(row)
  // 文件夹类型
  if (row.folderType === 0) {
    router.push({
      name: 'main',
      query: {
        path: row.fileCode
      }
    })
    tableData.value = row.childFile
  }
}

// 选择某一行时触发
const selectRow = (selection, row) => {
  console.log('selectRow')
  $bus.emit('selectRow', selection)
}
// 选择全选框时触发
const selectAllRow = (selection) => {
  console.log('selectAllRow')
  $bus.emit('selectRow', selection)
}

// 单位转换
const getfilesize = (size) => {
  if (!size) return ""
  let num = 1024.00 //byte
  if (size < num)
    return size + "B"
  if (size < Math.pow(num, 2))
    return (size / num).toFixed(2) + "KB" //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "MB" //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G" //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T" //T
}

// 向父组件暴露表格数据
defineExpose({ tableData })

</script>

<template>
  <el-table v-if="tableData.length" @select="selectRow" @select-all="selectAllRow" :data="tableData" max-height="561.6"
    style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="name" label="文件名" width="800">
      <template #default="scope">
        <div class="file-item">
          <div class="left">
            <svg v-if="scope.row.folderType === 0" class="iconfont" style="font-size: 32px;">
              <use xlink:href="#icon-wenjianjia"></use>
            </svg>
            <svg v-else class="iconfont" style="font-size: 32px;">
              <use xlink:href="#icon-file-fill"></use>
            </svg>
            <span @click="toChild(scope.row)" class="file-name">{{ scope.row.fileName }}</span>
          </div>
          <div class="right">
            <el-dropdown trigger="click">
              <div class="options">
                <svg class="iconfont" style="font-size: 14px;">
                  <use xlink:href="#icon-qita"></use>
                </svg>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>Action 1</el-dropdown-item>
                  <el-dropdown-item>Action 2</el-dropdown-item>
                  <el-dropdown-item>Action 3</el-dropdown-item>
                  <el-dropdown-item disabled>Action 4</el-dropdown-item>
                  <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="修改时间" width="200">
      <template #default="scope">
        <span>{{ scope.row.creatTime }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小">
      <template #default="scope">
        <span v-if="!scope.row.fileSize == '0'">{{ getfilesize(scope.row.fileSize) }}</span>
      </template>
    </el-table-column>
  </el-table>
  <div class="msg" v-else>
    <el-empty :image-size="200" />
  </div>
</template>

<style lang="less" scoped>
.file-item {
  display: flex;
  align-items: center;
  height: 36px;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;

    .file-name {
      margin-left: 10px;
      cursor: pointer;
    }

  }

  .right {
    display: flex;
    align-items: center;

    .options {
      width: 30px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
    }

    .options:hover {
      background-color: #F3F3F3;
      cursor: pointer;
    }
  }

}

.msg {
  display: flex;
  height: 80%;
  align-items: center;
  justify-content: center;
}
</style>