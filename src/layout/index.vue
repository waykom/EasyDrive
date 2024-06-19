<script setup>
import NavBar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
</script>

<template>
  <NavBar></NavBar>
  <div style="display: flex;">
    <SideBar></SideBar>
    <div style="display: flex;">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
