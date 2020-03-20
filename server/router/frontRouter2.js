var baseURL = "http://localhost:3000/public/static/"; //访问静态资源基础目录
var con = require("../db/connectObj");
var { getInsert, getFind, getUpdate, getDelete } = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var { formatDate, handleImageURL } = require("../tool/index.js");
var Url = require("./fontApi.js");
var baseURL = "http://localhost:3000/public/static/"; //访问静态资源基础目录
function SQLErrorInfo(err) {
    if (err) {
        throw new Error("server error");
    }
}
module.exports = function (router) {
    router.post(Url.getEvaluateDetailInfo, function (req, res) {

        if (req.body.hasOwnProperty("goodsid")) {
            var { goodsid } = req.body;
            console.log("aaaaaaaaa")
            var selectSQL = `
                select * from user,evaluatedetail 
                where goodsid = '${goodsid}' and user.userid = evaluatedetail.userid
             `
            getFind(con, selectSQL, function (err, data) {
                if (err) {
                    throw new Error("server error");
                }
                console.log(data);
                res.json(data)
            });


        } else {
            res.json({
                result: "noGoodsid"
            })
        }

    });
    router.post(Url.insertEvalueInfoToDatabase, function (req, res) {
        var { userid, goodsid, evaluatecontent, grade } = req.body;
        var insertSQL = `
            insert into evaluatedetail(userid,goodsid,evaluatecontent,grade) value('${userid}','${goodsid}','${evaluatecontent}','${grade}')
        `;
        getInsert(con, insertSQL, [], function (err, result) {
            if (err) {
                throw new Error("server error");
            }
            if (result.affectedRows === 1) {
                res.json({
                    result: "success"
                });
            } else {
                res.json({
                    result: fail
                });
            }
        });
    });
    router.post(Url.setAuditLog,function(req,res){
        var { userid, operateway,operatetime } = req.body;
        var insertSQL = `
            insert into auditlog(userid,operateway,operatetime) 
            values('${userid}','${operateway}','${operatetime}')
    
        `
        getInsert(con,insertSQL,[],function(err,data){
            SQLErrorInfo(err);
            if(data.affectedRows === 1){
                res.json({
                    type:"success",
                    status:"200"
                })
            }else{
                res.json({
                    type:"fail",
                    status:"404"
                })
            }
        })
    });
    router.post(Url.editUserInfo,function(req,res){
        console.log(req.body);
        var {userid,username,userPhone,detailAddress,sex}=req.body;
        var updateSQL = `
            update  user 
                set 
                    telphone = '${userPhone}',
                    sex = '${sex}',
                    user_address = '${detailAddress}'
                where userid = '${userid}'
        `
        getUpdate(con,updateSQL,[],function(err,data){
            SQLErrorInfo(err);
            if(data.affectedRows ==1 ){
                res.json({
                    type:"success",
                    status:"200"
                });
            }else{
                res.json({
                    type:"fail",
                    status:"400"
                })
            }
        })

    });
    router.post(Url.getUserInfoInEditUserPage,function(req,res){

        var {userid} = req.body;
        var selectSQL = `
            select * from user
            where userid = '${userid}'
        `  
        getFind(con,selectSQL,function(err,data){
            SQLErrorInfo(err);
            if(data.length>0){
                res.json(data)
            }
        })
    });
    router.post(Url.search,function(req,res){
        var {value} = req.body;
        var selectSQL = `
            select * from goods
                where goodsname like '%${value}%'
        `
        getFind(con,selectSQL,function(err,data){
            SQLErrorInfo(err);
            if(data.length == 0){
                res.json(data);
            }else{
               handleImageURL(data,baseURL);
                res.json(data);
            }
        })
    })












}