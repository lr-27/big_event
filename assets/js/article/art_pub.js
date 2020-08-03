$(function () {
    // 初始化富文本编辑器
    initEditor()
    var layer = layui.layer
    var form = layui.form
    // 渲染文章分类
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 调用模板引擎渲染下拉菜单
                // 调用form.render()
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr)
                form.render()

            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 为选择封面的按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 监听coverfile的change事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        // var files = $(this)[0].files
        // 判断用户是否选择了文件
        if (files.length === 0) return
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 定义文章的发布状态
    var art_state = '已发布'
    // 当存为草稿时绑定点击事件将状态改为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 添加文章
    // 为表单绑定submit提交事件
    $('#form-add').on('submit', function (e) {
        e.preventDefault()
        // 阻止表单默认行为
        // 基于form表单快速创建一个formdata对象
        var fd = new FormData(this)
        // 将文章的发布状态存储到fd中
        fd.append('state', art_state)
        // console.log(...fd);
        // 生成二进制图片文件
        // base64是字符串 
        // 将封面裁剪后的文件输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 发起ajax数据请求一定要放在回调函数里面
                // 因为生成文件是耗时操作 异步 所以必须保证发送ajax的时候图片已经生成
                publishArticle(fd)



            })
        function publishArticle(fd) {
            $.ajax({
                type: 'post',
                url: '/my/article/add',
                data: fd,
                // 如果向服务器提交的是formdata的数据必须添加以下配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    // 发布文章成功后跳转到文章列表页面
                    // window.parent.document.getElementById('a2').click()
                    location.href = '/article/art_list.html'
                    window.parent.document.getElementById('a2').className = "layui-this"
                    window.parent.document.getElementById('a3').className = ""
                }
            })

        }





    })




})
