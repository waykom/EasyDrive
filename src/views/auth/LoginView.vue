<script setup>
import {
  User,
  Lock,
  Discount
} from '@element-plus/icons-vue'
import AuthBox from '@/components/auth/AuthBox.vue'
import { reactive } from 'vue'


const form = reactive({
  // email: undefined,
  // password: undefined,
  email: '1564981811@qq.com',
  password: '123',
  checkCode: undefined
})

</script>

<template>
  <AuthBox :form="form">
    <template #email>
      <el-input clearable size="large" v-model="form.email" :prefix-icon="User" placeholder="请输入邮箱" autocomplete="off" />
    </template>
    <template #password>
      <el-input clearable size="large" show-password v-model="form.password" :prefix-icon="Lock" placeholder="请输入密码" autocomplete="off" />
    </template>
    <template #checkCode>
      <el-input clearable size="large" v-model="form.checkCode" :prefix-icon="Discount" placeholder="请输入图形验证码" autocomplete="off" />
    </template>
    <template #getme>
      <el-checkbox size="small">记住我</el-checkbox>
    </template>
    <template #leftOption>
      <RouterLink to="/auth/reset">忘记密码？</RouterLink>
    </template>
    <template #rightOption>
      <RouterLink to="/auth/register">没有账号？</RouterLink>
    </template>
    <template #btn>登录</template>
  </AuthBox>
</template>