// 入口函数
$(function () {
    // 点击按钮切换登录
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 定义layui表单校验规则
    var form = layui.form;
    // 利用form这个对象创建规则
    form.verify({
        // 属性值可以是数组也可以是函数
        pwd: [/^[\S]{6,12}$/, "密码是6到12位，且不能为空"],
        // 确认密码校验规则
        repwd: function (value) {
            if ($('#reg-pwd').val() !== value) {
                return '两次密码输入不一致';
            }
        }


    })

    // 注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // ajax发送异步提交
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name="username"]').val(),
                password: $('#form_reg [name="password"]').val()
                // $('#form_reg').serialize()

            },
            success: function (res) {
                // 注册失败校验 
                if (res.status !== 0) return layer.msg(res.message)
                // 注册成功提示
                layer.msg(res.message);
                // 触动切换到登录的a链接的点击行为
                $('#link_login').click()
                // 清空表单
                $('#form_reg')[0].reset()
                // location.reload()
            }
        })

    })

    // 登录功能
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // ajax发送异步提交
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 注册失败校验 
                if (res.status !== 0) return layer.msg(res.message)
                // 注册成功提示
                layer.msg(res.message);
                // 保存token
                localStorage.setItem('token', res.token)
                // 页面跳转
                location.href = '/index.html';
            }
        })

    })







})
