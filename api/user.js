import { request } from '@/plugins/request.js'

// 登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}
// 注册
export const register = data => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}
// 拉取当前用户信息
export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/api/user'
    })
}
// 更新用户信息
export const updateUser = data => {
    return request({
        method: 'PUT',
        url: '/api/user',
        data
    })
}
// 获取用户的详细信息
export const getProfile = username => {
    return request({
        method: 'GET',
        url: `/api/profiles/${username}`
    })
}
