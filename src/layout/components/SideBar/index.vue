<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
// 侧边栏文字和图标数据
const asideMenuItem = reactive([
  {
    id: 1,
    text: '首页',
    iconfont: '#icon-weiwangguanicon-defuben-',
    path: '/new/home'
  },
  { id: 2, text: '分享', iconfont: '#icon-fenxiang', path: '/new/share' },
  { id: 3, text: '回收站', iconfont: '#icon-huishouzhan', path: '/new/recycle' }
])

const routeList = router.getRoutes()
const asideRoutes = routeList.find(route => route.path == '/new').children || []
// console.log(asideRoutes)
</script>

<template>
  <el-aside class="aside">
    <div
      class="menu-item"
      :class="route.path.includes(item.path) ? 'menu-item-active' : ''"
      @click="router.push({name: item.name})"
      v-for="item in asideRoutes"
      :key="item.path"
    >
      <div class="menu-item-icon">
        <svg class="iconfont" style="font-size: 26px">
          <use :xlink:href="item.meta.iconfont"></use>
        </svg>
      </div>
      <div class="menu-item-text">{{ item.meta.text }}</div>
    </div>
  </el-aside>
</template>

<style lang="less" scoped>
.aside {
  // height: calc(100vh - 56px);
  width: 80px !important;
  box-shadow: 0 1px 1px #0000000f;
  border-right: 1px solid #f1f2f4;

  .menu-item {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #636d7e;

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
</style>
