<script setup>
import SubMenuBox from '@/components/home/SubMenuBox.vue'
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// const subMenuItem = reactive([
//   { id: 1, text: '全部', iconfont: '#icon-quanbu', path: '/main/all' },
//   { id: 2, text: '视频', iconfont: '#icon-shipin', path: '/main/video' },
//   { id: 3, text: '音频', iconfont: '#icon-toudaishierji', path: '/main/audio' },
//   { id: 4, text: '图片', iconfont: '#icon-ai-img', path: '/main/images' },
//   { id: 5, text: '文档', iconfont: '#icon-wendang', path: '/main/doc' },
//   { id: 6, text: '其他', iconfont: '#icon-qita', path: '/main/other' }
// ])

// 获取路由表里的meta信息
const subMenuItem = router.options.routes[0].children[0].children
// 动态给子侧边栏添加类名
const subMenuIndex = ref(1)
// 解决刷新页面时active元素的改变
onBeforeMount(() => {
  subMenuIndex.value = route.meta.id
})
// 点击子侧边栏事件
const handleClickSubMenu = (id, path) => {
  subMenuIndex.value = id
  // 路由跳转
  router.push(path)
}
onMounted(()=>{
  console.log('这是首页')
})

</script>

<template>
  <SubMenuBox>
    <template #aside>
      <div class="sub-menu-item" :class="subMenuIndex == item.meta.id ? 'sub-menu-item-active' : ''"
        @click="handleClickSubMenu(item.meta.id, item.meta.path)" v-for="item in subMenuItem" :key="item.meta.id">
        <div class="sub-menu-item-icon">
          <svg class="iconfont" style="font-size: 16px;">
            <use :xlink:href="item.meta.iconfont"></use>
          </svg>
        </div>
        <div class="sub-menu-item-text">{{ item.meta.text }}</div>
      </div>
    </template>
    <template #main>
      <RouterView></RouterView>
    </template>
  </SubMenuBox>
</template>

<style lang="less" scoped>
.sub-menu-item {
  display: flex;
  height: 42px;
  align-items: center;
  justify-content: center;
  color: #636D7E;
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
  background-color: #F3F3F3;
}

.sub-menu-item-active {
  background-color: #EEF9FE;
  color: #05A1F5;
}
</style>