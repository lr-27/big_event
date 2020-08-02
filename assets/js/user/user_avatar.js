$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项 
    const options = {
        // 纵横比 1代表是正方形区域 长方形4/3
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 修改上传图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // input发生改变的时候 渲染裁剪区
    $('#file').on('change', function (e) {
        // $('#file')[0].files
        // document.querySelector('#file').files
        // 1.只获取唯一的一张图片
        var file = e.target.files[0]
        // 2.原生js方法 在内存中生成一个图片的路径
        var newImgURL = URL.createObjectURL(file)
        // 3.传染到裁剪区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 头像上传
    $('#btnUpload').on('click', function () {
        // 获取base64图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL

            },
            success: function (res) {
                // 成功之后 重新渲染
                if (res.status !== 0) return layer.msg('获取头像失败')
                layer.msg('获取头像成功')
                window.parent.getUserInfo()


            }
        })


    })



})