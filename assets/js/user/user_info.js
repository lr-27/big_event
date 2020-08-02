$(function () {
    var form = layui.form;
    var layer = layui.layer
    // 定义校验规则
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) {
                return '昵称应该输入1-6位之间'
            }
        }
    })
    initUserInfo()
    // 初始化用户信息
    function initUserInfo() {
        // 发送ajax
        // 获取用户信息校验
        // 展示用户信息
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function (res) {
                // var obj=res.data
                // console.log(res);
                if (res.status !== 0) { return layer.msg(res.message) }
                form.val('formUserInfo', res.data)
            }
        })
    }
    // var obj=null;

    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo()
        // form.val('formUserInfo', obj)
    })


    // 提交用户修改
    $('.layui-form').on('submit', function (e) {
        // 取消默认行为
        e.preventDefault()
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('修改用户信息失败')
                layer.msg('恭喜修改用户信息成功')
                // 刷新父框架里面的用户信息
                window.parent.getUserInfo()
                // $('.layui-form')[0].reset()
                // chongzhi()
            }
        })

    })





})