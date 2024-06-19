import request from "./axios"

/**
 * 接口文档
 * http://localhost:8180/api/user/doc.html#/home
 */

// 获取图形验证码
export const checkCode = (params) => request({
  url: '/api/user/checkCode',
  method: 'get',
  responseType: 'blob',
  params
})

// 获取邮箱验证码
export const sendEmailCode = (params) => request({
  url: '/api/user/sendEmailCode',
  method: 'get',
  params
})

// 获取当前登录用户的用户信息
export const getUser = (params) => request({
  url: '/api/user/getUser',
  method: 'get',
  params
})

// 用户登录
export const login = (data) => request({
  url: '/api/user/login',
  method: 'post',
  data
})

// 用户注册
export const register = (data) => request({
  url: '/api/user/register',
  method: 'post',
  data
})

// 重置密码
export const resetPwd = (data) => request({
  url: '/api/user/resetPwd',
  method: 'post',
  data
})

// 退出登录
export const logout = (params) => request({
  url: '/api/logout',
  method: 'get',
  params
})


// 获取用户网盘空间
export const getUserSpace = () => request({
  url: '/api/getUserSpace',
  method: 'get'
})

// 获取全部的文件数据(树型)
export const getAllFileTree = () => request({
  url: '/api/file/getAllFileTree',
  method: 'post'
})

// 获取全部的文件数据(树型)
export const getFileByType = (type) => request({
  url: `/api/file/getFileByType/${type}`,
  method: 'get',
})

// 创建文件目录
export const createCategory = (data) => request({
  url: '/api/file/createCategory',
  method: 'post',
  data
})

// 文件分片上传接口
// export const upload = (params) => request({
//   url: '/api/file/upload',
//   method: 'post',
//   dataType: 'file',
//   params,
// })
// 文件分片上传接口
export const upload = (params) => {
  let formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key] == undefined ? '' : params[key])
  }
  return request({
    url: '/api/file/upload',
    method: 'post',
    dataType: 'file',
    data: formData,
  })
}


