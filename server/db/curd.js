var con = require("./connectObj"); //获取数据库连接对象

// var con = require("../appmysql.js");

function getFind(con,sql,callback){
     con.query(sql,function(err,data){
        //  console.log("sdfasfds")
        //  console.log(err)
        // if(err){
        //     console.log(err);
        //     throw new Error(err);
        //     return ;
        // }
        callback(err,data);
        // con.end();
    })
     
}
// getfind("select * from user",function(data){
//     for(var i = 0;i<data.length;i++){
//         console.log(data[i])
//     }
// })

// { username: 'aaa', password: 'bcd', userid: 122 }

//使用元字符插入数据
// var sql = 'insert into user value(?,?,0)';
// getInsert(sql,["user5","132456"],function(result){
//     if(result){
//         console.log("插入数据成功")
//     }
// })


// var sql = 'insert into user(username,password) value("user4","1234546")';
// getInsert(sql,[],function(result){
//     if(result){
//         console.log("插入数据成功")
//     }
// })
//插入数据
function getInsert(con,sql,params,callback){
    callback = callback || function(){};
    params = params || [];
    con.query(sql,params,function(err,result){
        // if(err){
        //     console.log("插入数据失败")
        //     throw new Error(err)
        // }
        // result.affectedRows
        callback(err,result);
    })
}
// var sql ='update user set password="111111" where username="user5"';
// getUpdate(sql,[],function(result){
//     if(result){
//         console.log("更新成功")
//     }
// })
function getUpdate(con,sql,params,callback){
    params = params || []
    callback  = callback || function (){};
    con.query(sql,params,function(err,result){
        // console.log("------------update----------");
        // if(err){
        //     // callback({"status":400,"type":"failure"})
        //     return;
        // }
        callback(err,result)
    })
}

//删除
// var sql = 'delete from  user where username="user5"'
function getDelete(con,sql,params,callback){
    params = params || []; //用来替换元字符的数组
    callback = callback || function(){}
    con.query(sql,[],function(err,result){
        // if(err){
        //     console.log("删除失败")
        //     throw new Error("delete error");
        // }
        // callback(result.affectedRows);
        callback(err,result);
    });
}
// getDelete(sql,function(result){
//     if(result){
//         console.log("删除成功")
//     }else{
//         console.log("您删除的用户不存在")
//     }
// })

module.exports = {getFind,getDelete,getInsert,getUpdate}


