// 验证已登录的中间件
export default ({ store, redirect }) => {
    if (store.state.user) {
        return redirect('/')
    }
}