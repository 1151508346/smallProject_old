var baseURL = "http://localhost:3000/public/static/"; //访问静态资源基础目录
var con = require("../db/connectObj");
var { getInsert, getFind, getUpdate, getDelete } = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var { formatDate, handleImageURL } = require("../tool/index.js");
var Url = require("./fontApi.js");

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












}