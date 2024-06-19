<script setup>
import SubMenuBox from '@/components/home/SubMenuBox.vue'
import MainBox from '@/components/home/MainBox.vue'
</script>

<template>
  <SubMenuBox>
    <template #aside>
      <div class="sub-menu-item">
        <div class="sub-menu-item-text">分享记录</div>
      </div>
    </template>
    <template #main>
      <MainBox>
        <template #header>
          <div class="options">
            <el-button type="primary">
              <svg class="iconfont btn-icon">
                <use xlink:href="#icon-quxiao"></use>
              </svg>
              <span class="text">取消分享</span>
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
</style>