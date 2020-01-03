
var Url = require("./backApi");
var { getInsert, getFind, getUpdate, getDelete } = require("../db/curd.js");
var con = require("../db/connectObj");
module.exports = function(router){
    var sessionID = "";
    router.post(Url.login,function(req,res){
        sessionID = req.sessionID;
        var { username,password } = req.body;
        if(username === "admin" && password === "admin"){
            res.json({
                result:"success",
                sessionID:sessionID
            })
        }else{
            res.json({
                result:"fail",
            })
        }
    });
    router.get(Url.userVerify,function(req,res){
        // req.query.sessionID ,sessionID
        console.log( req.query.sessionID ,sessionID)
        if(req.query.sessionID === sessionID){
               console.log(req.query)
            res.json({
                result:"success",
            })
        }else{
            res.json({
                result:"fail"
            })
        }
    });
    router.get(Url.getUserInfo,function(req,res){
        var { page,limit } = req.query;
        console.log(page);
       page = (typeof page === "string" ) ? Number(page) :page;
       limit = (typeof limit === "string") ? Number(limit) :limit;
       var pl = (page-1)*limit;
       console.log(pl)
        var selectSQL = `
        select * from user limit ${ pl} , ${limit}`  ;
        
        getFind(con,selectSQL,function(err,data){
            if(err){
                throw new Error("server error");
            }
            // console.log(data);
            res.json(data)
        });
    });
    router.get(Url.getUserCount,function(req,res){
        var selectSQL = `select count(userid) from user`
        getFind(con,selectSQL,function(err,data){
            if(err){
                throw new Error("serve error");
            }
            res.json(data[0]);
        })
    });

    // getGoodsCount
    router.get(Url.getGoodsCount,function(req,res){
        var selectSQL = `select count(goodsid) from goods`
        getFind(con,selectSQL,function(err,data){
            if(err){
                throw new Error("serve error");
            }
            res.json(data[0]);
        })
    });
    // getGoodsInfo
    router.get(Url.getGoodsInfo,function(req,res){
        var { page,limit } = req.query;
       page = (typeof page === "string" ) ? Number(page) :page;
       limit = (typeof limit === "string") ? Number(limit) :limit;
       var pl = (page-1)*limit;
        var selectSQL = `select * from goods limit ${pl} , ${limit}`;
        getFind(con,selectSQL,function(err,data){
            if(err){
                throw new Error("serve error");
            }
            res.json(data);
        })
    });
    


}