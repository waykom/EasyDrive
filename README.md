## 一、项目的构建

### 安装的依赖

1. Vue-Router

2. Element-UI

3. Axios

4. 其他依赖

   ```
   nprogress
   ```



### VueRouter 的配置

1. 在 **src** 目录下创建 **router/index.ts**

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
```

2. **main.ts** 中引入使用

```ts
import router from ./router
app.use(router)
```

3. **Router** 的使用：在 **Vue3** 中已经没有了 **this** ，通过 vue-router 的常用**API** 如：
   **RouterLink RouterView useRouter useRoute** 来操作和使用 vue-router



### 二次封装 Axios

1. 提示信息
2. 拦截操作
3. 页面交互
4. 错误处理



### 全局路由守卫

1. 根据token检查用户是否登录
2. 已登录用户的访问权限



## 二、组件与业务的复用

### 登录、注册和重置密码组件

> 登录、注册和重置密码都有一个共同点：表单校验

1. 登录、注册和重置密码页面相似，抽取**表单盒子**作为其基本组件，通过**具名插槽**对其进行复用，业务逻辑也都放在**表单盒子**里，这样就可以优化代码，减少校验代码的耦合度
2. 组件复用
3. 校验代码复用
4. 调用接口的方法复用