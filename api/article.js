import { request } from '@/plugins/request.js'

// 获取所有文章列表
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles',
        params
    })
}
// 获取关注用户文章列表
export const getFeedArticles = params => {
    return request({
        method: 'GET',
        url: '/api/articles/feed',
        params
    })
}
// 添加文章为喜欢
export const addFavorite = slug => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/favorite`
    })
}
// 取消文章喜欢
export const deleteFavorite = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}/favorite`
    })
}
// 获取文章详情
export const getArticle = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}`
    })
}
// 获取文章所有评论
export const getComments = slug => {
    return request({
        method: 'GET',
        url: `/api/articles/${slug}/comments`
    })
}
// 给文章添加评论
export const addComment = (slug, data) => {
    return request({
        method: 'POST',
        url: `/api/articles/${slug}/comments`,
        data
    })
}
// 删除自己的评论
export const deleteComment = (slug, id) => {
    return request({    
        method: 'DELETE',
        url: `/api/articles/${slug}/comments/${id}`
    })
}
// 添加用户为关注
export const addFollow = username => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`
    })
}
// 取消关注
export const deleteFollow = username => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`
    })
}
// 创建新的文章
export const createArticle = (slug, data) => {
    return request({
        method: 'POST',
        url: '/api/articles',
        data
    })
}
// 更新文章
export const updateArticle = (slug, data) => {
    return request({
        method: 'PUT',
        url: `/api/articles/${slug}`,
        data
    })
}
// 删除文章
export const deleteArticle = slug => {
    return request({
        method: 'DELETE',
        url: `/api/articles/${slug}`
    })
}
