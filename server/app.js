var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var app = express();
var routers = require("./router/index.js"); //router配置
app.use(bodyparser.json());//对数据进行json格式的处理
app.use(bodyparser.urlencoded({ extended: false }));//对数据进行加密处理
// 配置默认页面--服务器自动加载指定文件下的i

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Cache-Control","no-store");//304
    next();
});
app.use(express.static(path.join(__dirname, 'www')));
app.use(routers);

app.listen(3000, function (err) {
    if (err) {
        console.log('失败');
        throw err;
    }
    console.log('https://localhost:3000');
});

