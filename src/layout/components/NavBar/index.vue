<script setup></script>

<template>
  <el-header class="header">
    <div class="icon">
      <span>
        <svg class="iconfont" style="font-size: 40px">
          <use xlink:href="#icon-B"></use>
        </svg>
      </span>
      <span class="title">waykom1的小屋</span>
    </div>
    <div class="right">
      <el-dropdown trigger="click">
        <div class="user">
          <div class="block">
            <el-avatar
              :size="46"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
          </div>
          <div class="username">
            <span>{{ 'waykom' }}</span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>修改头像</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="less" scoped>
.header {
  box-shadow: 0 1px 1px #0000000f;
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
      color: #636d7e;
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
</style>
