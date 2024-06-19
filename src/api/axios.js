import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const request = axios.create({
  // timeout: 6000
})


const funcReq = (config) => {
  // console.log('请求拦截器', config)
  NProgress.start()

  return config
}
const funcReqError = (error) => {
  return Promise.reject(error)
}

request.interceptors.request.use(funcReq, funcReqError)


const funcRes = (response) => {
  // console.log('相应拦截器', response)

  NProgress.done()

  const data = response.data
  if (!(data instanceof Blob)) {
    // console.log(data)
    // // 添加交互效果
    // ElNotification({
    //   title: String(data.code),
    //   message: data.message,
    //   type: 'info',
    //   position: 'bottom-right'
    // })
  }
  return response.data
}
const funcResError = (error) => {
  ElMessage.warning('网络连接异常,请稍后再试!')
  NProgress.done()
  return Promise.reject(error)
}

request.interceptors.response.use(funcRes, funcResError)


export default request