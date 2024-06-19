<script setup>
import {
  User,
  Lock,
  Unlock
} from '@element-plus/icons-vue'
import AuthBox from '@/components/auth/AuthBox.vue'
import { reactive } from 'vue'


const form = reactive({
  email: undefined,
  emailCode: undefined,
  nickName: undefined,
  password: undefined,
  checkCode: undefined
})


</script>

<template>
  <AuthBox :form="form">
    <template #email>
      <el-input clearable size="large" v-model="form.email" :prefix-icon="User" placeholder="请输入邮箱" autocomplete="off" />
    </template>
    <template #emailCode>
      <el-input clearable size="large" v-model="form.emailCode" :prefix-icon="Unlock" placeholder="请输入邮箱验证码" autocomplete="off" />
    </template>
    <template #getEmailCode>
      <el-button type="primary" size="large">获取验证码</el-button>
    </template>
    <template #checkCode>
      <el-input clearable size="large" v-model="form.checkCode" :prefix-icon="Unlock" placeholder="请输入图形验证码" autocomplete="off" />
    </template>
    <template #nickName>
      <el-input clearable size="large" v-model="form.nickName" :prefix-icon="User" placeholder="请输入昵称" autocomplete="off" />
    </template>
    <template #password>
      <el-input clearable size="large" show-password v-model="form.password" :prefix-icon="Lock" placeholder="请输入密码" autocomplete="off" />
    </template>
    <template #leftOption>
      <RouterLink to="/auth/login">去登录</RouterLink>
    </template>
    <template #btn>注册</template>
  </AuthBox>
</template>