$(function () {
    // 获取用户信息
    getUserInfo()
    // 退出登录// 引入layer
    var layer = layui.layer
    $('#btnLogout').on('click', function () {

        // 提示框
        layer.confirm('是否确认退出', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 先关闭提示框再清空跳转
            layer.close(index);
            // 删除本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
        });

    })
})
// 这些方法是全局的后面iframe要用
// 获取用户信息的函数封装
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        //jquery中的ajax专门用户设置请求头信息的属性
        // 原生里面用setRequestHeader headers属性区分大小写
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''

        // },
        success: function (res) {
            // console.log(res);
            // 1.判断用户信息是否获取成功
            if (res.status != 0) return layui.layer.msg(res.message)
            // 调用用户渲染头像
            renderUser(res.data)

        }
    })
}
// 用户渲染函数
function renderUser(user) {
    // 1.渲染用户名
    var uname = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)

    // 2.渲染用户头像
    // 3.判断用户头像信息 如果有就渲染图片 如果没有就渲染文字
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        $('.text-avatar').show().html(uname[0].toUpperCase());
    }




}



