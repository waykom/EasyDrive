<script setup>
import Tabler from '@/components/home/Tabler.vue'
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import $bus from "@/utils/bus"
import { ElMessage } from 'element-plus'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { createCategory, getAllFileTree, getFileByType } from '@/api/api'

const route = useRoute()

const addFile = (fileData) => {
  $bus.emit('addFile', {
    file: fileData.file,
    fileId: currentFolder.value.fileId
  })
}

// 根据类型获取文件
const getFileListByType = async (type) => {
  const res = await getFileByType(type)
  if (res.code === 200) {
    return res.data
  } else {
    return []
  }
}
watch(route, () => {
  console.log('watch route --MainBox')
  if (route.meta.type) {
    $bus.emit('getAllFile', getFileListByType(route.meta.type))
  }
})

const currentFolder = ref({ fileId: '/' })

// 文件上传之前时的钩子
// const handleBeforeUpload = (rawFile) => {
//   $bus.emit('addFile', rawFile)
// }
// 文件上传成功时的钩子
const handleSuccess = (response, uploadFile, uploadFiles) => {
  // console.log('#success#', response, uploadFile)
  $bus.emit('changeUploadStatus', { uid: uploadFile.uid, status: 1 })
  tabler.value.tableData.unshift({
    uid: uploadFile.uid,
    name: uploadFile.name,
    date: new Date().toLocaleString(),
    size: uploadFile.size + 'B'
  })
}
// 文件上传失败时的钩子
const handleError = (error, uploadFile, uploadFiles) => {
  // console.log('#error#', error)
  $bus.emit('changeUploadStatus', { uid: uploadFile.uid, status: -1 })
}


// 表格的ref
const tabler = ref()

// 新建文件夹
const dialogVisible = ref(false)
let newFolderName = ref('新建文件夹')
const createFolder = async () => {
  const res = await createCategory({
    fileName: newFolderName.value,
    fileParentCode: route.query.path || ''
  })
  if (res.code === 200) {
    $bus.emit('uploadCallBack')
    ElMessage({
      message: '添加成功!',
      type: 'success'
    })
    dialogVisible.value = false
  } else {
    ElMessage.error('命名冲突!')
  }
}

onBeforeRouteLeave((to) => {
  // 路由切换时触发
  // console.log(to)
})

// 批量删除
let delList = null
const delByUid = () => {
  delList.forEach((file) => {
    // 找到已选数据的在原列表中的位置
    let index = tabler.value.tableData.findIndex(item => item.uid === file.uid)
    // 删除该项数据
    tabler.value.tableData.splice(index, 1)
  })
}

// 控制`批量删除`和`批量移动`的状态
const delAndMoveStatus = ref(true)
onMounted(() => {
  $bus.on('selectRow', (selection) => {
    // 存一份已选的文件列表
    delList = selection
    console.log("selectRow", selection)
    delAndMoveStatus.value = selection.length > 0 ? false : true
  })
})
</script>

<template>
  <el-container>
    <el-header class="header">
      <slot name="header">
        <div class="options">
          <el-upload multiple class="upload-demo" :show-file-list="false" :http-request="addFile">
            <el-button type="primary">
              <svg class="iconfont btn-icon">
                <use xlink:href="#icon-shangchuan"></use>
              </svg>
              <span class="text">上传</span>
            </el-button>
          </el-upload>
          <el-button type="success" v-if="route.path == '/main/all'" @click="dialogVisible = true">
            <svg class="iconfont btn-icon">
              <use xlink:href="#icon-xinjianwenjianjia"></use>
            </svg>
            <span class="text">新建文件夹</span>
          </el-button>
          <el-button type="danger" @click="delByUid" :disabled="delAndMoveStatus">
            <svg class="iconfont btn-icon">
              <use xlink:href="#icon-huishouzhan"></use>
            </svg>
            <span class="text">批量删除</span>
          </el-button>
          <el-button type="warning" :disabled="delAndMoveStatus">
            <svg class="iconfont btn-icon">
              <use xlink:href="#icon-yidong"></use>
            </svg>
            <span class="text">批量移动</span>
          </el-button>
          <el-input class="input" placeholder="搜索文件" :prefix-icon="Search" />
        </div>
        <!-- 新建文件夹弹出框 -->
        <el-dialog v-model="dialogVisible" title="新建文件夹" width="20%">
          <div class="folder">
            <img src="./folder.png">
            <el-input v-model="newFolderName" />
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="createFolder">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </slot>
    </el-header>
    <el-main class="main">
      <slot name="main">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><a href="/">homepage</a></el-breadcrumb-item>
          <el-breadcrumb-item>user</el-breadcrumb-item>
        </el-breadcrumb>
        <Tabler ref="tabler"></Tabler>
      </slot>
    </el-main>
    <el-footer class="footer">
      <slot name="footer"></slot>
    </el-footer>
  </el-container>
</template>


<style lang="less">
.header {
  border-bottom: 1px solid #f1f2f4;

  .options {
    height: 100%;
    display: flex;
    align-items: center;

    .upload-demo {
      display: flex;
      align-items: center;
      margin-right: 12px;
    }

    .btn-icon {
      font-size: 16px;
    }

    .text {
      font-size: 16px;
      margin-left: 4px;
    }

    .input {
      height: 34px;
      width: 300px;
      margin-left: 12px;
    }
  }

  .folder {
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
}

.main {
  padding-bottom: 0;
}

.footer {
  border-top: 1px solid #f1f2f4;
}
</style>