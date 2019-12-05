// var express = require("express");
// var router=express.Router();

// var URL = {
//     register:"/frontRegister"
// }

// router.post(URL.register,function(req,res){
//         console.log("aaaaaa")
// })
// module.exports = router;

// console.log("-------------------------------------------------")
var con = require("../db/connectObj");
var { getInsert, getFind } = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var URL = {
    register: "/frontRegister",
    login:"/frontLogin"
}
module.exports = function(router){
    router.post(URL.register, function (req, res) {
        var password = req.body.password;
        //加密后的密码
        var username = req.body.username; //注册的用户名
        var passwordAes = aesEncrypt(password);
        var email = req.body.email;
        // var passwordmw = aesDecrypt(passwordAes); //明文
        // var username = 'a123456789';
        // var passwordAes = '46b94547e01ea9ed21450ec3233e7136';
        var insertSQL = "insert into user (username,password,email) value(\'" + username + "\',\'" + passwordAes + "\',\'" + email + "\')";
        var selectSQL = "select username from user where username = \'" + username + "\'";
        var selectSQL2 = "select email from user where email = \'" + email + "\'";
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                res.json({
                    status: "500",
                    type: "fail"
                });
                console.log("server error1");
                // throw new Error(err);
                return;
            }
            //查询当前注册用户名在数据库中是否存在 data.length == 0  表示数据库中没有当前注册的用户
            if (data.length == 0) {
                // var selectSQL2 = "select email from user where email = \'" + email + "\'";
                getFind(con, selectSQL2, function (err, data) {
                    if (err) {
                        res.json({
                            status: "500",
                            type: "fail"
                        });
                        console.log("server error2");
                        throw new Error(err);
                        return;
                    }
                    //查询当前注册邮箱在数据库中是否存在 data.length == 0  表示数据库中没有当前注册的用户
                    if (data.length == 0) {
                        getInsert(con, insertSQL, [], function (err, result) {
                            if (err) {
                                res.json({
                                    status: "500",
                                    type: "fail"
                                });
                                console.log("server error");
                                throw new Error(err);
                            }
                            if (result.affectedRows == 1) {
                                res.json({
                                    status: 200,
                                    type: "success",
                                })
                                // con.end();
                            }
                        });  
                    } else {
                        // res.setHeader()
                        console.log(res.statusCode = 404)
                        console.log("email已被注册过");
                        res.statusMessage = "fail"
                        res.json({
                            status: "404",
                            type: "emailfail"
                        })
                    }
                })
               
    
            } else {
                // res.setHeader()
                console.log(res.statusCode = 404);
                console.log("user已被注册过");
                // res.statusMessage = "fail"
                res.json({
                    status: "404",
                    type: "usernamefail"
                })
            }
        })
    });
    router.post(URL.login,function(req,res){
        var username = req.body.username;
        var passwordAES = aesEncrypt(req.body.password); //加密后的密码
        var selectSQL = "select username,password from  user where username = \'"+username + "\'and password=\'"+passwordAES+"\'";
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                res.json({
                    status: "500",
                    type: "fail"
                });
                console.log("server error2");
                throw new Error(err);
                return;
            }
            //查询当前注册邮箱在数据库中是否存在 data.length == 0  表示数据库中没有当前注册的用户
            if (data.length == 0) {
                res.statusCode = 404
                console.log("用户名或密码错误")
                res.json({
                    status: "404",
                    type: "fail"
                })
            } else {
                // res.setHeader()
                // console.log(data[0].password.toString());
                // console.log(res.statusCode = 404)
                // console.log("email已被注册过");
                // res.statusMessage = "fail"
                res.json({
                    status: "200",
                    type: "success"
                })
            }
        })
        // console.log(username, passwordAES) 
    });
}
















