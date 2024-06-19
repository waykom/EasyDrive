<script setup>
import SubMenuBox from '@/components/home/SubMenuBox.vue'
import MainBox from '@/components/home/MainBox.vue'
</script>

<template>
  <SubMenuBox>
    <template #aside>
      <div class="sub-menu-item">
        <div class="sub-menu-item-text">删除的文件</div>
      </div>
      <div class="msg">回收站为你保存10天内删除的文件</div>
    </template>
    <template #main>
      <MainBox>
        <template #header>
          <div class="options">
            <el-button type="warning">
              <svg class="iconfont btn-icon">
                <use xlink:href="#icon-recover"></use>
              </svg>
              <span class="text">还原</span>
            </el-button>
            <el-button type="success">
              <svg class="iconfont btn-icon">
                <use xlink:href="#icon-huishouzhan"></use>
              </svg>
              <span class="text">批量删除</span>
            </el-button>
          </div>
        </template>
      </MainBox>
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
  background-color: #EEF9FE;
  color: #05A1F5;

  .sub-menu-item-text {
    font-size: 13px;
  }
}

.sub-menu-item:hover {
  background-color: #F3F3F3;
}

.msg {
  color: #888;
  font-size: 13px;
  margin-top: 10px;
}
</style>