<script setup>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const subMenuItem = reactive([
  { id: 1, text: '全部', iconfont: '#icon-quanbu', path: '/new/home/all' },
  { id: 2, text: '视频', iconfont: '#icon-shipin', path: '/new/home/video' },
  {
    id: 3,
    text: '音频',
    iconfont: '#icon-toudaishierji',
    path: '/new/home/audio'
  },
  { id: 4, text: '图片', iconfont: '#icon-ai-img', path: '/new/home/photo' },
  { id: 5, text: '文档', iconfont: '#icon-wendang', path: '/new/home/doc' },
  { id: 6, text: '其他', iconfont: '#icon-qita', path: '/new/home/other' }
])

console.log(router, route)

const routeList = router.getRoutes()
const subMenuRoutes =
  routeList
    .find((route) => route.path == '/new')
    .children.find((route) => route.path == 'home').children || []
console.log(subMenuRoutes)
</script>

<template>
  <div class="aside">
    <div
      class="sub-menu-item"
      :class="route.path.includes(item.path) ? 'sub-menu-item-active' : ''"
      @click="router.push({name: item.name})"
      v-for="item in subMenuRoutes"
      :key="item.path"
    >
      <div class="sub-menu-item-icon">
        <svg class="iconfont" style="font-size: 16px">
          <use :xlink:href="item.meta.iconfont"></use>
        </svg>
      </div>
      <div class="sub-menu-item-text">{{ item.meta.text }}</div>
    </div>
  </div>
  <div>
    <div class="options">
      <el-upload multiple class="upload-demo" :show-file-list="false">
        <el-button type="primary">
          <svg class="iconfont btn-icon">
            <use xlink:href="#icon-shangchuan"></use>
          </svg>
          <span class="text">上传</span>
        </el-button>
      </el-upload>
      <el-button type="success">
        <svg class="iconfont btn-icon">
          <use xlink:href="#icon-xinjianwenjianjia"></use>
        </svg>
        <span class="text">新建文件夹</span>
      </el-button>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.aside {
  width: 200px;
  height: calc(100vh - 56px);
  border-right: 1px solid #f1f2f4;
  padding: 20px 10px;
  position: relative;
  .sub-menu-item {
    display: flex;
    height: 42px;
    align-items: center;
    justify-content: center;
    color: #636d7e;
    cursor: pointer;
    border-radius: 5px;

    .sub-menu-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sub-menu-item-text {
      margin-left: 20px;
      font-size: 13px;
    }
  }

  .sub-menu-item:hover {
    background-color: #f3f3f3;
  }

  .sub-menu-item-active {
    background-color: #eef9fe;
    color: #05a1f5;
  }
}
.options {
  height: 60px;
  display: flex;
  padding: 20px;
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
</style>
