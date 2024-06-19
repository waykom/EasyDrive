<script setup>
import { onBeforeMount, onMounted, reactive, ref } from 'vue'
import { checkCode, sendEmailCode, login, register, resetPwd } from '@/api/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 接收各个表单的数据
const validateForm = defineProps(['form'])

// 图形验证码的type值 登录0 注册1 重置2
const codeType = ref()
// 邮箱验证码的type值 注册0 重置1
const emailType = ref()
onBeforeMount(() => {
  // 获取请求图形验证码所需要的type的值
  codeType.value = route.meta.codeType
  // 获取请求邮箱验证码所需要的type的值
  emailType.value = route.meta.emailType
  // 页面挂载前获取一次图形验证码
  getCheckCode()
})
// 获取图形验证码
const imgCodeUrl = ref()
const windowUrl = window.URL || window.webkitURL
const getCheckCode = async () => {
  const params = {
    type: codeType.value,
    time: new Date().getTime()
  }
  const blob = await checkCode(params)
  imgCodeUrl.value = windowUrl.createObjectURL(blob)
}
// 获取邮箱验证码
const getEmailCode = async () => {
  const params = {
    email: validateForm.form.email,
    type: emailType.value
  }
  await sendEmailCode(params)
}
// 用户登录
const userLogin = async () => {
  const { checkCode, email, password } = validateForm.form
  const data = { checkCode, email, password }
  const res = await login(data)
  if (res.code === 200) {
    localStorage.setItem('token', res.data)
    router.push('/')
  }
}
// 用户注册
const userRegister = async () => {
  const { checkCode, email, password, nickName, emailCode } = validateForm.form
  const data = { checkCode, email, password, nickName, emailCode }
  const res = await register(data)
  if (res.code === 200) {
    router.push('/auth/login')
  }
}
// 用户重置密码
const userResetPwd = async () => {
  const { checkCode, email, password, emailCode } = validateForm.form
  const data = { checkCode, email, password, emailCode }
  const res = await resetPwd(data)
  if (res.code === 200) {
    router.push('/auth/login')
  }
}


onMounted(() => {
  // console.log(route)
})

// 校验规则
const rules = reactive({
  email: [
    {
      required: true,
      message: '请输入邮箱地址',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '该邮箱地址有误！',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      type: 'any',
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  nickName: [
    {
      required: true,
      type: 'any',
      message: '请输入昵称',
      trigger: 'blur'
    }
  ],
  emailCode: [
    {
      required: true,
      type: 'any',
      message: '请输入邮箱验证码',
      trigger: 'blur'
    }
  ],
  checkCode: [
    {
      required: true,
      type: 'any',
      message: '请输入图形验证码',
      trigger: 'blur'
    }
  ],
})

// 点击图形验证码 或者 按钮·获取邮箱验证码·
const handleClickOption = (type) => {
  /**
   * type 值
   *  'btn' 为获取邮箱验证码
   *  'img' 为获取图形验证码
   */
  if (type === 'btn') {
    ruleFormRef.value.validateField('email', valid => {
      // 验证是否填写了正确的邮箱地址
      if (!valid) return
      else {
        // 若是正确的邮箱地址则获取邮箱验证码
        getEmailCode()
      }
    })
  }
  if (type === 'img') {
    // 点击图形验证码更新
    getCheckCode()
  }
}

// 获取表单元素
const ruleFormRef = ref()
// 提交表单
const handleClickBtn = () => {
  ruleFormRef.value.validate(valid => {
    if (!valid) return
    else {
      switch (codeType.value) {
        case 0:
          userLogin()
          console.log('点击了登录')
          break
        case 1:
          userRegister()
          console.log('点击了注册')
          break
        case 2:
          userResetPwd()
          console.log('点击了重置密码')
      }
    }
  })
}

</script>

<template>
  <div class="box">
    <div class="title">
      <h2>RedDrive</h2>
    </div>
    <el-form ref="ruleFormRef" :rules="rules" :model="validateForm.form" class="demo-ruleForm">
      <el-form-item v-if="validateForm.form.hasOwnProperty('email')" prop="email">
        <slot name="email"></slot>
      </el-form-item>
      <el-form-item v-if="validateForm.form.hasOwnProperty('emailCode')" prop="emailCode">
        <div class="auth-code">
          <div class="code">
            <slot name="emailCode"></slot>
          </div>
          <div class="block" @click="handleClickOption('btn')">
            <slot name="getEmailCode"></slot>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="validateForm.form.hasOwnProperty('nickName')" prop="nickName">
        <slot name="nickName"></slot>
      </el-form-item>
      <el-form-item v-if="validateForm.form.hasOwnProperty('password')" prop="password">
        <slot name="password"></slot>
      </el-form-item>
      <el-form-item v-if="validateForm.form.hasOwnProperty('checkCode')" prop="checkCode">
        <div class="auth-code">
          <div class="code">
            <slot name="checkCode"></slot>
          </div>
          <div class="block" @click="handleClickOption('img')">
            <slot name="getImgCode">
              <el-image :src="imgCodeUrl" style="height: 40px" />
            </slot>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="get-me">
      <slot name="getme"></slot>
    </div>
    <div class="options">
      <div class="lost">
        <span class="mouse">
          <slot name="leftOption"></slot>
        </span>
      </div>
      <div class="no">
        <span class="mouse">
          <slot name="rightOption"></slot>
        </span>
      </div>
    </div>
    <div class="btn">
      <el-button @click="handleClickBtn" type="primary" size="large" style="width:100%">
        <slot name="btn"></slot>
      </el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 384px;
  background-color: #fff;
  padding-bottom: 20px;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .title {
    display: flex;
    height: 60px;
    color: #666;
    justify-content: center;
    align-items: center;
  }

  .demo-ruleForm {
    margin: 10px 30px 0 30px;

    .auth-code {
      width: 100%;
      display: flex;
      align-items: center;

      .code {
        flex: 2;
      }

      .block {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 10px;
      }
    }
  }

  .get-me {
    display: flex;
    align-items: center;
    margin: 0px 30px 0 30px;
  }

  .options {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #409EFF;
    justify-content: space-between;
    margin: 5px 30px 0 30px;

    .mouse:hover {
      color: #7bbdff;
      cursor: pointer;
    }
  }

  .btn {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 30px 0 30px;
  }
}
</style>