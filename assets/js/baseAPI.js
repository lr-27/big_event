// 设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'
// 设置路径（生产）
// 拦截过滤每一次ajax请求 配置每次请求需要的参数
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url
})