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
var baseURL = "http://localhost:3000/public/static/"; //访问静态资源基础目录
var con = require("../db/connectObj");
var { getInsert, getFind ,getUpdate} = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var Url = {
    register: "/frontRegister",
    login:"/frontLogin",
    forgetCheck:"/frontForgetCheck",
    updatePassword:"/frontUpdatePassword",
    add_address:"/add_address",  //添加收货地址
    getGoods:"/getGoods"
}
module.exports = function(router){
    router.post(Url.register, function (req, res) {
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
    router.post(Url.login,function(req,res){
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
                    status:"200",
                    type:"success",
                    username:username
                      
                    
                })
                //登录成功将用户名保存在session
               
            }
        })
        // console.log(username, passwordAES) 
    });
       //忘记密码，检查注册的用户和邮箱是否存在 
    router.post(Url.forgetCheck,function(req,res){

        var username = req.body.username;
        var email = req.body.email;
        var selectSQL = "select username,email from user where username = \'"+username+"\' and email = \'"+email+"\'";
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
                res.statusCode = 404;
                 res.json({
                     status:"404",
                     type:"selectFail"
                 })
            } else {
                // res.setHeader()
                // console.log(res.statusCode = 404)
                // console.log("email已被注册过");
                res.statusMessage = "fail"
                res.json({
                    status: "200",
                    type: "selectSuccess"
                })
            }
        })
       
    });
    router.post(Url.updatePassword,function(req,res){
        var username = req.body.username;
        var password = req.body.password;
        console.log(username,password)
        var passwordAES = aesEncrypt(password);
        // UPDATE USER SET PASSWORD = "a123456789" WHERE username = "a123456789"
        var  selectSQL = "update user set password = \'"+passwordAES+"\' where username = \'"+username+"\'";
        console.log(selectSQL)
        // UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson' 
        getUpdate(con,selectSQL,[],function(err,result){
            // console.log(err,result)
                if(err){
                    res.statusCode = 400;
                    console.log("更新失败")
                    res.json({
                        status:"500",
                        type:"updateFail"
                    });
                    return ;
                }
                if(result.affectedRows == 1){
                        res.json({
                            status:200,
                            type:"updateSuccess"
                        })
                        console.log("更新成功")
                }
        })
    });
    // router.get("/login",function(req,res){
    //     req.session.username = req.query.username;
    //     res.send(JSON.stringify(req.session));
    // })
    
    // router.get("/getSession",function(req,res){
    //     console.log(req);
    //     res.send(JSON.stringify(req.session));
    // });
    //用户添加收货地址
    router.post(Url.add_address,  function(req,res) {
        /**
         * 1.获取登录的用户名
         * 2.将前端添加的收货地址插入在数据库中
         */
        // 
        // res.redirect("/getSession");
        var username = "aa123456"; //登录的用户名
        var createTime = new Date().toLocaleString();
        var {receiver,receivePhone,areaPath,detailAddress,isDefault,zipCode} = req.body;
        var insertSQL = `insert into user_address value(\'${username}\',\'${receiver}\',\'${receivePhone}\',\'${areaPath}\',\'${detailAddress}\',\'${isDefault}\',\'${zipCode}\',\'${createTime}\'  )`;
            getFind(con,insertSQL,function(err,data){
                if(err){
                    res.json({
                        status:"200",
                        type:"fail"
                    })
                    console.log("--------error---------");
                    throw new Error(err);
                    // return;
                }
                if(data.affectedRows == 1){
                    res.json({
                        status:"200",
                        type:"success"
                    })
                }
            })
    
    });

    router.get(Url.getGoods,function(req,res){
        console.log(req.query)
        // { pageNum: '29', limit: '10' }
        var pageNum = req.query.pageNum; //请求页数
        var limit = req.query.limit; //每次请求数量

        // res.json(req.query)
        // var point = 35;
        // var limit = 10;
        var selectSQL = `select * from goods limit ${(pageNum-1)*limit},${limit} `;
        getFind(con,selectSQL,function(err, data){
            if(err){
                throw new Error("database operate error")
            }
           
            if(data.length===0){
                console.log("加载完整");
                res.send("over");
                return ;
            }
            
            for (let i = 0; i < data.length; i++) {
                var imageURL = `${baseURL}${data[i].typeid}/${data[i].category}/${data[i].goodsid}/`;
                data[i].goodsimage = [];
                for(var j = 1; j<5;j++){
                    data[i].goodsimage.push(imageURL+"0"+j+".jpg");
                }
                
            }
            res.json(data);


            // console.log("第"+pageNum+"数据")
        })
    })
    


}

function insertDemo(goodsid,size,goodssizenum){
    var  insertSQL  = `insert into goodsdetail value (\'${goodsid}\',\'${size}\',\'${goodssizenum}\')`
    getInsert(con,insertSQL,function(err,result){
        if(err){
            console.log("--------error--------");
            return;
        }
        insertSQL
    })

}

// insertDemo("B10005",170,30)

var id = ["C20001","C20002","C20003","C20004","C20005"];
var obj = [
    {
        size:170,
        num:30
    },{
        size:175,
        num:30
    },
    {
        size:180,
        num:40
    }

];
for(var i = 0 ;i<id.length;i++){
   for(var j = 0;j<obj.length;j++){
        insertDemo(id[i],obj[j].size,obj[j].num);
   }
}
 











