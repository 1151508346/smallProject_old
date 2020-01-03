var express = require("express");
var router = express.Router();
//前端路由
require("./frontRouter")(router);

require("./backRouter")(router);

/**
 * 注册返回值
 * 1.注册成功
 *      type :success 
 *      status:200  
 * 2.username重复
 *      status:404    
 *      type:usernamefail ;
 * 3.email重复
 *      status:404 
 *      type:emailfail
 * 4.服务端出错
 *      status:500 
 *      type:fail

 */
// router.post(URL.login,function(req,res){
//     var password = req.body.password;
//     //加密后的密码
//     var username = req.body.username; //登录的用户名
//     var passwordAes = aesEncrypt(password);
// })

module.exports = router;












