import { createRouter, createWebHashHistory } from 'vue-router'
import HomeContainer from '@/components/home/HomeContainer.vue'
import AuthContainer from '@/components/auth/AuthContainer.vue'

import Layout from '@/layout/index.vue'
import HomeLayout from '@/layout/components/HomeLayout/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/main/all',
      component: HomeContainer,
      children: [
        {
          path: 'main',
          name: 'main',
          redirect: '/main/all',
          meta: {
            bid: 1,
            text: '首页',
            iconfont: '#icon-weiwangguanicon-defuben-',
            path: '/main'
          },
          component: () => import('@/views/aside/MainView.vue'),
          children: [
            {
              path: 'all',
              component: () => import('@/views/main/AllView.vue'),
              meta: {
                id: 1,
                text: '全部',
                iconfont: '#icon-quanbu',
                path: '/main/all'
              }
            },
            {
              path: 'video',
              component: () => import('@/views/main/VideoView.vue'),
              meta: {
                id: 2,
                text: '视频',
                iconfont: '#icon-shipin',
                path: '/main/video',
                type: 1
              }
            },
            {
              path: 'audio',
              component: () => import('@/views/main/AudioView.vue'),
              meta: {
                id: 3,
                text: '音频',
                iconfont: '#icon-toudaishierji',
                path: '/main/audio',
                type: 2
              }
            },
            {
              path: 'images',
              component: () => import('@/views/main/ImagesView.vue'),
              meta: {
                id: 4,
                text: '图片',
                iconfont: '#icon-ai-img',
                path: '/main/images',
                type: 3
              }
            },
            {
              path: 'doc',
              component: () => import('@/views/main/DocView.vue'),
              meta: {
                id: 5,
                text: '文档',
                iconfont: '#icon-wendang',
                path: '/main/doc',
                type: 4
              }
            },
            {
              path: 'other',
              component: () => import('@/views/main/OtherView.vue'),
              meta: {
                id: 6,
                text: '其他',
                iconfont: '#icon-qita',
                path: '/main/other',
                type: 5
              }
            }
          ]
        },
        {
          path: 'share',
          name: 'share',
          component: () => import('@/views/aside/ShareView.vue'),
          meta: {
            bid: 2,
            text: '分享',
            iconfont: '#icon-fenxiang',
            path: '/share'
          }
        },
        {
          path: 'recycle',
          name: 'recycle',
          component: () => import('@/views/aside/RecycleView.vue'),
          meta: {
            bid: 3,
            text: '回收站',
            iconfont: '#icon-huishouzhan',
            path: '/recycle'
          }
        }
      ]
    },
    {
      path: '/auth',
      name: 'about',
      redirect: '/auth/login',
      component: AuthContainer,
      children: [
        {
          path: 'login',
          name: 'login',
          meta: {
            codeType: 0
          },
          component: () => import('@/views/auth/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          meta: {
            codeType: 1,
            emailType: 0
          },
          component: () => import('@/views/auth/RegisterView.vue')
        },
        {
          path: 'reset',
          name: 'reset',
          meta: {
            codeType: 2,
            emailType: 1
          },
          component: () => import('@/views/auth/ResetView.vue')
        }
      ]
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestView.vue')
    },
    {
      path: '/new',
      name: 'New',
      component: Layout,
      children: [
        {
          path: 'home',
          name: 'Home',
          component: HomeLayout,
          redirect: 'home/all',
          meta: {
            text: '首页',
            iconfont: '#icon-weiwangguanicon-defuben-'
          },
          children: [
            {
              path: 'all',
              name: 'All',
              component: () => import('@/views/AllView.vue'),
              meta: {
                text: '全部',
                iconfont: '#icon-quanbu'
              }
            },
            {
              path: 'audio',
              name: 'Audio',
              component: () => import('@/views/AudioView.vue'),
              meta: {
                text: '音频',
                iconfont: '#icon-toudaishierji'
              }
            },
            {
              path: 'doc',
              name: 'Doc',
              component: () => import('@/views/DocView.vue'),
              meta: {
                text: '文档',
                iconfont: '#icon-wendang'
              }
            },
            {
              path: 'other',
              name: 'Other',
              component: () => import('@/views/OtherView.vue'),
              meta: {
                text: '其他',
                iconfont: '#icon-qita'
              }
            },
            {
              path: 'photo',
              name: 'Photo',
              component: () => import('@/views/PhotoView.vue'),
              meta: {
                text: '图片',
                iconfont: '#icon-ai-img'
              }
            },
            {
              path: 'video',
              name: 'Video',
              component: () => import('@/views/VideoView.vue'),
              meta: {
                text: '视频',
                iconfont: '#icon-shipin'
              }
            }
          ]
        },
        {
          path: 'share',
          name: 'Share',
          component: () => import('@/views/TestView.vue'),
          meta: {
            text: '分享',
            iconfont: '#icon-fenxiang'
          }
        },
        {
          path: 'recycle',
          name: 'Recycle',
          component: () => import('@/views/TestView.vue'),
          meta: {
            text: '回收站',
            iconfont: '#icon-huishouzhan'
          }
        }
      ]
    }
  ]
})

// 使用全局前置路由守卫鉴权
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (to.path !== '/auth/login') {
      next()
    } else {
      next('/')
    }
  } else {
    if (
      to.path == '/auth/register' ||
      to.path == '/auth/login' ||
      to.path == '/auth/reset'
    ) {
      next()
    } else {
      next('/auth/login')
    }
  }
})

export default router
