$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义一个全局变量 存储分页参数
    var p = {
        pagenum: 1,//	页码值
        pagesize: 2,//	每页显示多少条数据
        cate_id: "",	//	文章分类的 Id
        state: "",	//	文章的状态，可选值有：已发布、草稿

    }

    // 定义格式美化的过滤器
    template.defaults.imports.dateFormat = function (date) {
        var dt = new Date(date)
        var y = getZero(dt.getFullYear())
        var m = getZero(dt.getMonth() + 1)
        var d = getZero(dt.getDate())
        var hh = getZero(dt.getHours())
        var mm = getZero(dt.getMinutes())
        var ss = getZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}：${mm}：${ss}`


    }

    // 定义补零函数
    function getZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    // 定义获取文章列表数据方法
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: p,
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                renderPage(res.total)

            }
        })

    }
    // 初始化文件列表
    initCate()


    // 获取select数据
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                // 调用模板引擎分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('.cate_id').val()
        var state = $('.state').val()
        // console.log(cate_id);
        // 为查询参数对象q对应的属性赋值
        p.cate_id = cate_id
        p.state = state
        // 根据最新的筛选条件重新传染数据
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',//分页容器
            count: total,//总页数
            limit: p.pagesize,//每页显示几条数据
            curr: p.pagenum,
            // 在回调函数中的第二个参数判断使用的是哪一种方式触发的
            // 第一种方式是undefined
            // 第二种方式是true
            // 分页切换触发回调jump 最新的页码值
            // 如果是第一种方式触发的就调用这个table
            // obj包含当前所有分页的参数
            jump: function (obj, first) {
                // 把最新的页码值赋值到p这个查询对象中
                p.pagenum = obj.curr
                // 切换条目的时候也会触发jump回调 把最新的条目数赋值到p.pageSize
                p.pagesize = obj.limit
                // console.log(first);
                // 根据最新的p获取最新的列表并且渲染
                // 只有在点击页码的时候才会触发渲染页面
                if (!first) {
                    initTable()
                }
                // !first && initTable()
            },
            theme: '#ccc',
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 自定义限制每页显示多少条数据
            limits: [2, 3, 5, 10]

        })

    }

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 给删除按钮绑定自定义属性传递id
        // 获取文章id
        var id = $(this).attr('data-id')
        // 询问用户是否删除数据 在询问的时候发起请求
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                    layer.close(index);
                    // 虽然删除完了当前页面的数据但是又渲染了一次
                    // 判断当前页是否有数据 如果没有剩余的数据就要页码值减1再重新调用当前页面加载方法
                    // 如果len值是1证明删除完后就没有数据了
                    // if (len === 1) {
                    //     // 页码值的最小值是1 所以要先判断页码值是否为1
                    //     p.pagenum = p.pagenum == 1 ? 1 : p.pagenum - 1

                    // }
                    len === 1 && p.pagenum > 1 && p.pagenum--

                    initTable()

                }
            })
        });



    })

    $('tbody').on('click', '.btn-edit', function () {
        location.href = '/article/art_edit.html'
    })




})