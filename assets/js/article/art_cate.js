$(function () {
    var layer = layui.layer
    var form = layui.form
    // console.log(123);
    // 添加文章分类
    $('#addArtCate').on('click', function () {
        index = layer.open(
            {
                // 1代表页面层
                type: 1,
                // 第一项是宽第二项是高
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html(),
            }
        )
    })
    // 文章分类添加
    var index = null;
    $('body').on('submit', '#boxAddCate', function (e) {

        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                initArtCateList()
                layer.msg(res.message)
                // 关闭添加区域
                layer.close(index)

            }
        })
    })
    // 文章分类修改
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            // 1代表页面层
            type: 1,
            // 第一项是宽第二项是高
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })

        // 发起请求获取数据
        var id = $(this).attr('data-id')
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                // 关闭修改区域
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })

    // 通过代理的形式为删除数据绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    layer.close(index);
                    initArtCateList()
                }
            })

        });

    })

    // 提示用户是否要删除
    // 文章分类渲染
    initArtCateList()
    // 文章渲染函数封装
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 模板引擎渲染(传递对象使用属性)
                var htmlStr = template('tpl-table', res);
                $('tbody').empty().html(htmlStr)
            }
        })
    }





})