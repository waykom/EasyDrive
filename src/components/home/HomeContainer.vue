<script setup>
import { reactive, ref, onBeforeMount, onMounted, nextTick, proxyRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, logout, upload, getAllFileTree } from '@/api/api'
import $bus from '@/utils/bus'

import SparkMD5 from 'spark-md5'

const router = useRouter()
const route = useRoute()

// 用户信息
let userInfo = reactive({
  profile: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 获取用户信息
const getUserInfo = async () => {
  const token = localStorage.getItem('token')
  const res = await getUser({ token })
  if (res.code === 200) {
    userInfo.data = res.data
  } else {
    // 登录已过期
    localStorage.clear('token')
    router.push('/auth/login')
  }
}

// // 获取全部的文件
// let tableData = ref([])
// const getAllFile = async () => {
//   const res = await getAllFileTree()
//   if (res.code === 200) {
//     // localStorage.setItem('files', JSON.stringify(res.data))
//     tableData.value = res.data
//     console.log('全部文件', tableData.value)
//   }
//   $bus.emit('getAllFile', tableData.value)
// }
// onMounted(() => {
//   getAllFile()
//   $bus.on('uploadCallBack', getAllFile)
// })

/* 侧边栏文字和图标数据
const asideMenuItem = reactive([
  { id: 1, text: '首页', iconfont: '#icon-weiwangguanicon-defuben-', path: '/main' },
  { id: 2, text: '分享', iconfont: '#icon-fenxiang', path: '/share' },
  { id: 3, text: '回收站', iconfont: '#icon-huishouzhan', path: '/recycle' }
]) */

// 获取路由表里的meta信息
const asideMenuItem = router.options.routes[0].children
// 动态给侧边栏添加类名
const asideMenuIndex = ref(1)
// 解决刷新页面时active元素的改变
onBeforeMount(() => {
  asideMenuIndex.value = route.meta.bid
  getUserInfo()
})
// 点击侧边栏事件
const handleClickAsideMenu = (id, path) => {
  asideMenuIndex.value = id
  // 路由跳转
  router.push(path)
}

// 退出登录
const userLogout = async () => {
  const userCode = userInfo?.data?.userCode
  const res = await logout({ userCode })
  if (res.code === 200) {
    localStorage.clear('token')
    router.push('/auth/login')
  }
}


// 上传列表相关

// 控制上传文件列表的显隐
const isShowList = ref(false)
// 上传文件列表的DOM元素
const uploadRef = ref()

// 上传文件列表
const uploadFileList = ref([])

// 展开上传文件列表
const handleStatusList = (e) => {
  if (e.target.className == 'close') return
  uploadRef.value.style.height = uploadRef.value.style.height === '518px' ? '54px' : '518px'
}

const chunkSize = 1024 * 1024 * 5
const delList = ref([])
// 添加上传文件
const addUploadFile = async ({ file, filePid }) => {
  const fileItem = {
    // 文件、文件大小、文件流、文件名...
    file: file,
    // 文件uid
    uid: file.uid,
    // md5进度
    md5Progress: 0,
    // md5值
    md5: null,
    // 文件名
    fileName: file.name,
    // 上传状态
    status: 0,
    // 已上传大小
    uploadSize: 0,
    // 文件总大小
    totalSize: file.size,
    // 上传进度
    uploadProgress: 0,
    // 暂停
    pause: false,
    // 当前分片
    chunkIndex: 0,
    // 文件父级ID
    filePid: filePid,
    // 错误信息
    errorMsg: null
  }
  uploadFileList.value.unshift(fileItem)

  // 显示上传文件列表
  isShowList.value = true
  let md5FileUid = await computeMd5(fileItem)
  if (md5FileUid == null) {
    return
  }
  uploadFile(md5FileUid)
}


// 计算md5
const computeMd5 = async (fileItem) => {
  let file = fileItem.file
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice
  let chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  let spark = new SparkMD5.ArrayBuffer()
  let fileReader = new FileReader()

  let loadNext = () => {
    let start = currentChunk * chunkSize
    let end = start + chunkSize >= file.size ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }
  loadNext()

  return new Promise((resolve, reject) => {
    // debugger
    let resultFile = getFileByUid(file.uid)
    fileReader.onload = (e) => {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        let percent = Math.floor((currentChunk / chunks) * 100)
        console.log(`第${file.name},
          ${currentChunk}分片解析完成,
          开始第${currentChunk + 1},
          进度${percent}`
        )
        loadNext()
      } else {
        let md5 = spark.end()
        spark.destroy()
        resultFile.md5Progress = 100
        // resultFile.status = 1
        resultFile.md5 = md5
        resolve(fileItem.uid)
      }
    }
    fileReader.onerror = () => {
      resultFile.md5Progress = -1
      resultFile.status = -1
      resolve(fileItem.uid)
    }
  }).catch((error) => {
    return null
  })
}

const uploadFile = async (uid, chunkIndex) => {
  chunkIndex = chunkIndex ? chunkIndex : 0
  // 分片上传
  let currentFile = getFileByUid(uid)
  let file = currentFile?.file
  const fileSize = currentFile?.totalSize
  const chunks = Math.ceil(fileSize / chunkSize)
  for (let i = chunkIndex; i < chunks; i++) {
    let delIndex = delList.value.indexOf(uid)
    if (delIndex != -1) {
      delList.value.splice(delIndex, 1)
      break
    }
    currentFile = getFileByUid(uid)
    if (currentFile.pause) {
      break
    }
    let start = i * chunkSize
    let end = start + chunkSize >= fileSize ? fileSize : start + chunkSize
    let chunkFile = file.slice(start, end)
    let params = {
      chunkIndex: i,
      chunks: chunks,
      fileMd5: currentFile.md5,
      fileParentCode: '/',
      file: chunkFile,
      fileName: file.name,
      fileCode: currentFile.fileCode,
    }
    let updateResult = await upload(params)
    console.log('@上传中@...', params)
    // console.log('@上传中@...', updateResult)
    if (updateResult == null) {
      currentFile.status = -1
      break
    }
    currentFile.fileCode = updateResult.data?.fileCode
    currentFile.chunkIndex = i

    if (updateResult.code === 200) {
      if (updateResult.data?.status == 'UPLOAD_SUCCESS') {
        getAllFile()
        currentFile.status = 1
        break
      }
    } else {
      currentFile.status = -1
      break
    }

  }
}

// 上传状态管理
/* 
  file.status 
    0   上传中
    1   上传成功
    -1  上传失败
*/
// 根据uid获取文件信息
const getFileByUid = uid => uploadFileList.value.find(file => file.uid == uid)
// 改变上传状态
const changeUploadStatus = ({ uid, status }) => {
  let file = getFileByUid(uid)
  file.status = status
}


// 绑定自定义事件
onMounted(() => {
  // 添加上传文件
  $bus.on('addFile', addUploadFile)
})


</script>

<template>
  <el-container>
    <el-header class="header">
      <div class="icon">
        <span>
          <svg class="iconfont" style="font-size: 40px">
            <use xlink:href="#icon-B"></use>
          </svg>
        </span>
        <span class="title">RedDrive</span>
      </div>
      <div class="right">
        <el-dropdown trigger="click">
          <div class="user">
            <div class="block">
              <el-avatar :size="46" :src="userInfo.profile" />
            </div>
            <div class="username">
              <span>{{ userInfo?.data?.nickName }}</span>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改头像</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click="userLogout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside">
        <div class="menu-item" :class="asideMenuIndex == item.meta.bid ? 'menu-item-active' : ''"
          @click="handleClickAsideMenu(item.meta.bid, item.meta.path)" v-for="item in asideMenuItem" :key="item.meta.bid">
          <div class="menu-item-icon">
            <svg class="iconfont" style="font-size: 26px">
              <use :xlink:href="item.meta.iconfont"></use>
            </svg>
          </div>
          <div class="menu-item-text">{{ item.meta.text }}</div>
        </div>
      </el-aside>
      <el-main class="main">
        <RouterView></RouterView>
        <div class="upload-list" ref="uploadRef" v-if="isShowList">
          <div class="status" @click="handleStatusList($event)">
            <div>
              <span class="status-icon">
                <svg class="iconfont">
                  <use xlink:href="#icon-chenggong"></use>
                </svg>
              </span>
              <span class="status-title">上传列表 • 共 {{ uploadFileList.length }} 项</span>
            </div>
            <div>
              <span class="close" @click="isShowList = false">×</span>
            </div>
          </div>
          <div class="file-list">
            <div class="file-item" v-for="file in uploadFileList" :key="file.uid">
              <div class="file-icon">
                <svg class="iconfont">
                  <use xlink:href="#icon-file-fill"></use>
                </svg>
              </div>
              <div class="file-info">
                <span class="file-name">{{ file.fileName }}</span>
                <span class="file-size">
                  {{ file.totalSize }}B
                  <span>• </span>
                  <span v-if="file.status === 0">上传中</span>
                  <span v-else-if="file.status === 1">上传成功</span>
                  <span v-else>上传失败</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.header {
  box-shadow: 0 3px 10px #0000000f;
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon {
    display: flex;
    align-items: center;
    color: #05a1f5;

    .title {
      font-size: 25px;
      font-weight: bold;
      margin-left: 5px;
    }
  }

  .right {
    display: flex;
    align-items: center;

    .upload {
      color: #636D7E;
      cursor: pointer;
    }

    .user {
      display: flex;
      align-items: center;
      margin-left: 30px;
      margin-right: 10px;
      cursor: pointer;

      .username {
        margin-left: 10px;
      }
    }
  }
}

.aside {
  height: calc(100vh - 56px);
  width: 80px;
  box-shadow: 0 3px 10px #0000000f;
  border-right: 1px solid #f1f2f4;

  .menu-item {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #636D7E;

    .menu-item-text {
      margin-top: 4px;
      font-size: 14px;
      font-weight: 700;
    }
  }

  .menu-item:hover {
    background-color: #eee;
  }

  .menu-item-active {
    color: #05a1f5;
  }
}

.main {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  .upload-list {
    position: fixed;
    z-index: 999;
    width: 375px;
    height: 54px;
    overflow: hidden;
    right: 50px;
    bottom: 60px;
    border-radius: 5px;
    box-shadow: 0 0 1px 1px rgba(28, 28, 32, .05), 0 8px 24px rgba(28, 28, 32, .12);

    .status {
      height: 54px;
      padding: 0 26px;
      box-sizing: border-box;
      display: flex;
      background-color: #EEF9FE;
      justify-content: space-between;
      align-items: center;

      .status-title {
        margin-left: 20px;
      }
    }

    .status:hover {
      cursor: pointer;
    }

    .file-list {
      height: 100%;
      background-color: #fff;
      overflow: auto;

      .file-item {
        height: 64px;
        box-sizing: border-box;
        padding: 14px 18px 14px 16px;
        // background-color: #bfc;
        display: flex;
        align-items: center;

        .file-icon {
          font-size: 36px;
          margin-right: 16px;
        }

        .file-info {
          display: flex;
          flex-direction: column;

          .file-name {
            font-size: 14px;
          }

          .file-size {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>