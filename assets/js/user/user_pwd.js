$(function () {
    // console.log(123);
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码是6到12位，且不能为空"],
        samePwd: function (value) {
            if ($('[name="oldPwd"]').val() == value) {
                return '新旧密码不能一致'
            }
        },
        rePwd: function (value) {
            if ($('[name="newPwd"]').val() !== value) {
                return '两次输入密码不一致'
            }
        }

    })
    // 修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg('恭喜修改密码成功')
                // 重置表单
                $('.layui-form')[0].reset()


            }
        })

    })
})