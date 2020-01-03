var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var app = express();
var routers = require("./router/index.js"); //router配置
var expressSession  = require("express-session"); 
app.use(expressSession({
    secret:"key", //随便写的string，用作服务器生成session前面来进行加密
    name:"connect_id",// 保存本地cookie 的一个名字，默认为connect_id ，
    resave:false,//强制保存session即使它没有发生变化，默认为true建议设置为false,
    saveUninitialized:true , //强制将未初始化的sesson进行存储，默认值为true 建议是设置成true，
    cookie:{
        maxAge:50000, //过期时间,
    } ,
    // 强制重新设置cookie ，每次请求都设置cookie 
    //防止过期时间太短，而用户在操作的时候已经超过了过期时间，出现自动退出
    rolling:true   
}))
app.use(bodyparser.json());//对数据进行json格式的处理
app.use(bodyparser.urlencoded({ extended: false }));//对数据进行加密处理
// 配置默认页面--服务器自动加载指定文件下的i
app.use("/public",express.static(path.join(__dirname, '/public')));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization,X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Cache-Control","no-store");//304
    next();
});

app.use(routers);
app.use("/",function(req,res){

})
app.listen(3000, function (err) {
    if (err) {
        console.log('失败');
        throw err;
    }
    console.log('http://localhost:3000');
});
var {aesDecrypt} = require("./aes_en_de");

// 46b94547e01ea9ed21450ec3233e7136

// console.log(aesDecrypt("46b94547e01ea9ed21450ec3233e7136","1qaz!QAZ"))