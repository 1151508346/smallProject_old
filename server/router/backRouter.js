var formidable = require("formidable");
var multer = require('multer');
var fs = require("fs");
var path = require("path");
var Url = require("./backApi");
var { getInsert, getFind, getUpdate, getDelete } = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var con = require("../db/connectObj");
var { createMoreContents, formatDate } = require("../tool/index.js");

var uploadURL = "";

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage: storage,
//    limits:{}
// });

//添加配置文件到muler对象。
function SQLErrorInfo(err) {
    if (err) {
        throw new Error("server error");
    }
}
function deleteall(path) {
    var files = [];
    if(fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach(function(file, index) {
        var curPath = path + "/" + file;
        if(fs.statSync(curPath).isDirectory()) { // recurse
          deleteall(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };
module.exports = function (router) {
    var sessionID = "";
    router.post(Url.login, function (req, res) {
        sessionID = req.sessionID;
        var { username, password } = req.body;
        if (username === "admin" && password === "admin") {
            res.json({
                result: "success",
                sessionID: sessionID
            })
        } else {
            res.json({
                result: "fail",
            })
        }
    });
    router.get(Url.userVerify, function (req, res) {
        // req.query.sessionID ,sessionID
        console.log(req.query.sessionID, sessionID)
        if (req.query.sessionID === sessionID) {
            console.log(req.query)
            res.json({
                result: "success",
            })
        } else {
            res.json({
                result: "fail"
            })
        }
    });
    router.get(Url.getUserInfo, function (req, res) {
        var { page, limit } = req.query;
        console.log(page);
        page = (typeof page === "string") ? Number(page) : page;
        limit = (typeof limit === "string") ? Number(limit) : limit;
        var pl = (page - 1) * limit;
        console.log(pl)
        var selectSQL = `
        select * from user limit ${ pl} , ${limit}`;

        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            // console.log(data);
            res.json(data)
        });
    });
    router.get(Url.getUserCount, function (req, res) {
        var selectSQL = `select count(userid) from user`
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            res.json(data[0]);
        })
    });

    // getGoodsCount
    router.get(Url.getGoodsCount, function (req, res) {
        var { searchInfo } = req.query;
        console.log(searchInfo);
        var selectSQL = `select count(goodsid) from goods
            where  goodsid like '%${searchInfo}%'  or goodsname like '%${searchInfo}%'
        `
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            res.json(data[0]);
        })
    });
    // getGoodsInfo
    router.get(Url.getGoodsInfo, function (req, res) {
        var { page, limit, searchInfo } = req.query;

        console.log(req.query);
        page = (typeof page === "string") ? Number(page) : page;
        limit = (typeof limit === "string") ? Number(limit) : limit;
        var pl = (page - 1) * limit;
        var selectSQL = `select * from goods 
            where goodsid like '%${searchInfo}%'  or goodsname like '%${searchInfo}%'
            limit ${pl} , ${limit}
            `;
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            res.json(data);
        })
    });
    router.post(Url.addUserInfo, function (req, res) {
        // console.log(req.body);
        var avatar = "default";
        var { username, sex, email, telphone, address, password } = req.body;
        var passwordAes = aesEncrypt(password);
        console.log(username, password, avatar, email, telphone, sex, address)
        var selectSQL = `select * from user where username = \'${username}\' or email= \'${email}\' or telphone=\'${telphone}\'`;
        getFind(con, selectSQL, function (err, selectData) {
            if (err) {
                throw new Error("select server error ");

            }

            if (selectData.length === 0) {
                var insertSQL = `
                    insert into user (username,password,avatar,email,telphone,sex,user_address) value(\'${username}\',\'${passwordAes}\',\'${avatar}\',\'${email}\',\'${telphone}\',\'${sex}\',\'${address}\')
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
                            result: "fail"
                        });
                    }
                })
            } else {
                res.json({
                    result: "has exit userInfo"
                })
            }
        });
    });
    router.post(Url.updateUserInfo, function (req, res) {
        var { username, password, avatar, email, telphone, sex, user_address, userid } = req.body;
        console.log(username, password, avatar, email, telphone, sex, user_address, userid);
        var passwordAes = aesEncrypt(password);
        // a12345 1qaz!QAZ default hanhan@qq.com 12365478933 女 shanxixianyang 18
        var updateSQL = `update user  set 
            password=\'${passwordAes}\', 
            avatar = \'${avatar}\' ,
            telphone=\'${telphone}\', 
            sex = \'${sex}\' ,
            email=\'${email}\',
            user_address=\'${user_address}\'
            where userid=${userid}
        `;

        getUpdate(con, updateSQL, [], function (err, result) {
            if (err) {
                throw new Error("serve error");
            }
            if (result.affectedRows === 1) {
                res.json({
                    result: "success"
                })
            }
            if (result.affectedRows === 0) {
                res.json({
                    result: "warning"
                })
            }
        })
    });
    router.post(Url.deleteUserInfo, function (req, res) {
        var useridList = req.body.useridList;
        var deleteSQL = ''
        for (var i = 0; i < useridList.length; i++) {
             deleteSQL = `delete from user where userid = \'${useridList[i].userid}\'; `;
        }
        getDelete(con, deleteSQL, [], function (err, deleteData) {
            if (err) {
                throw new Error("server");
            }
            console.log(deleteData)
            if(deleteData.affectedRows == 1){
                res.json({
                    result:"success"
                })
            }
        })
    });
    router.get(Url.getOrderCount, function (req, res) {
        var { searchInfo } = req.query;
        console.log(req.query)
        var selectSQL = `select count(goodsid) from orders
        where  
        orderid like '%${searchInfo}%'  or
        goodsid like '%${searchInfo}%' or 
        userid like '%${searchInfo}%' 
        `
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            res.json(data[0]);
        })
    });
    router.get(Url.getOrderInfo, function (req, res) {
        var { page, limit, searchInfo } = req.query;
        console.log(req.query);
        page = (typeof page === "string") ? Number(page) : page;
        limit = (typeof limit === "string") ? Number(limit) : limit;
        var pl = (page - 1) * limit;
        // var selectSQL = `select * from orders,user_address 
        //     where orders.userid = user_address.userid
        //     limit ${pl} , ${limit}
        // ` ;
        var selectSQL = `
            SELECT orderid,goods.goodsid,orders.goodsstatus,goodsprice,
            user_address.userid, detailaddress,user_address.receiver ,
            orders.purchasetime,user_address.addressid FROM orders,user_address ,goods
            WHERE (orders.orderid like '%${searchInfo}%'  or
            orders.goodsid like '%${searchInfo}%' or 
            user_address.userid like '%${searchInfo}%' ) AND 
                orders.userid = user_address.userid AND 
                goods.goodsid = orders.goodsid AND 
                isdefault=1 
            limit ${pl} , ${limit}
        `;
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            console.log(data)
            res.json(data);
        })
    });

    router.get(Url.deleteGoodsInfo, function (req, res) {
        var { goodsId,typeId,category } = req.query;
        var deleteSQL = `delete from goods where goodsid = \'${goodsId}\' `;
        getDelete(con, deleteSQL, [], function (err, data) {
            if (err) {
                throw new Error("error");
            }

            if (data.affectedRows === 1) {
                // // 删除对应的目录
                var baseURL = path.
                join(__dirname, "../public/static") + `\\${typeId}\\${category}\\${goodsId}`;
                deleteall(baseURL);
                res.json({
                    result: "success"
                }); 
            } else {
                res.json({
                    result: "fail"
                });
            }
        })
    });
    router.post(Url.updateGoodsInfo, function (req, res) {
        var { goodsname, goodsprice, goodscount, goodsid, createtime } = req.body;
        var updateSQL = `update goods set
                        goodsname = \'${goodsname}\' ,
                        goodsprice = \'${goodsprice}\' ,
                        goodscount = \'${goodscount}\',
                        createtime = \'${createtime}\'
                        where goodsid = \'${goodsid}\'
        `
        getUpdate(con, updateSQL, [], function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            if (data.affectedRows === 1) {
                res.json({
                    result: "success"
                })
            } else {
                res.json({
                    result: "fail"
                })
            }
        });
    });
    router.get(Url.deleteOrderData, function (req, res) {
        var orderid = req.query.orderid;
        console.log(orderid);
        var deleteSQL = `
            delete from orders where orderid=\'${orderid}\'
        `
        getDelete(con, deleteSQL, [], function (err, data) {
            console.log(data)
            if (err) {
                throw new Error("server error");
            }
            if (data.affectedRows === 1) {
                res.json({
                    result: "success"
                })
            } else (
                res.json({
                    result: "fail"
                })
            )
        })
    });
    router.post(Url.updateOrderInfo, function (req, res) {
        var { goodsid, userid, receiver, detailaddress, goodsstatus, orderid, purchasetime, addressid } = req.body;
        console.log(goodsid, userid, receiver, detailaddress, goodsstatus, orderid, purchasetime, addressid)

        var updateSQL = `
            update orders set
            goodsid = \'${goodsid}\' ,
            userid = \'${userid}\' ,
            goodsstatus = \'${goodsstatus}\',
            purchasetime = \'${purchasetime}\'
            where orderid = \'${orderid}\'
        `
        getUpdate(con, updateSQL, [], function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            console.log(addressid);
            if (data.affectedRows === 1) {
                var updateSQL2 = `
                update user_address set
                userid=\'${userid}\',
                detailaddress = \'${detailaddress}\',
                receiver = \'${receiver}\'
          where isdefault=1 and addressid=\'${addressid}\'
          
        `
                getUpdate(con, updateSQL2, [], function (err, data2) {
                    if (err) {
                        throw new Error("server error");
                    }
                    console.log(data2.affectedRows);
                    if (data2.affectedRows === 1) {
                        res.json({
                            result: "success"
                        });
                    } else {
                        res.json({
                            result: "fail"
                        })
                    }
                });

            } else {
                res.json({
                    result: "fail"
                })
            }
        });


    });
    router.get(Url.getSort, function (req, res) {
        var selectSQL = `select typeid from goodstype`
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("serve error");
            }
            res.json(data);
        })
    });
    router.get(Url.getCategoryList, function (req, res) {
        var { typeid } = req.query;
        var selectSQL = `
                SELECT category FROM goods 
                WHERE typeid = '${typeid}'
                GROUP BY category
        `;
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            if (data.length > 0) {
                res.json(data);
                console.log(data);
            }
        });
    });


    router.post(Url.createContent, function (req, res) {
        var { typeId, category, goodsId } = req.body;
        var baseURL = path.join(__dirname, "../public/static") + `\\${typeId}\\${category}\\${goodsId}`;
        fs.exists(baseURL, function (exists) {
            if (exists) {
                uploadURL = baseURL;
                res.json({
                    result: "hasexit"
                })
            } else {
                try {
                    createMoreContents([goodsId], `./public/static/${typeId}/${category}`, 1);
                    uploadURL = baseURL
                    res.json({
                        result: "createSuccess"
                    })
                } catch (error) {
                    uploadURL = ""
                    res.json({
                        result: "fail"
                    })
                }
            }
        })
    })
    /* router.post(Url.uploadFile, function (req, res) {
        var form = new formidable.IncomingForm()
        if(uploadURL !=""){
            form.uploadDir = uploadURL;
        }else{
            res.json({
                result:"fail"
            })
        }
        form.keepExtensions = true; //保留原始文件扩展名
        //fields 表示form表单中其他的字段
        //files 上传文件相关信息
        form.parse(req, (err, fields, files) => {
            console.log(form.uploadDir);
            if (err) {
                res.send("failure")
                throw err;
            }
            console.log(files);
            var oldpath = uploadURL + "/" + path.basename(files["imageList"].path);
            var newpath = uploadURL + "/" + path.basename(files["imageList"].name);
            // console.log(oldpath,newpath)
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    throw Error("改名失败");
                }
                res.json({
                    result: "success"
                });
            });

        })
    }); */
    router.post(Url.uploadFile, function (req, res) {
        var storage = multer.diskStorage({
            //设置上传后文件路径，uploads文件夹会自动创建。
            destination: function (req, file, cb) {
                cb(null, uploadURL)
            },
            //给上传文件重命名，获取添加后缀名
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");
                // cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
                cb(null, file.originalname);
            }
        });
        //添加配置文件到muler对象。
        var upload = multer({
            storage: storage
        });
        var uploadobj = upload.array("imageList", 10);
        uploadobj(req, res, function (err) {
            //添加错误处理
            if (err) {
                return console.log(err);
            }

            insertUploadFileInfoToMysql(req, res)
            //文件信息在req.file或者req.files中显示。
        });
    });
    function insertUploadFileInfoToMysql(req, res) {
        var { typeId, category, goodsId, goodsName, goodsCount, goodsPrice } = req.body //前端上传文件的input信息
        //   typeId: 'BOY',
        //   category: 'Jacket',
        //   goodsId: 'B11111',
        //   goodsName: '1212',
        //   goodsCount: '100',
        //   goodsPrice: '100'
        var createtime = formatDate();
        var insertSQL = `
    
    insert into goods value('${typeId}','${goodsId}','${goodsName}',${goodsCount},${goodsPrice},'${category}','${createtime}')
    
    `
        getInsert(con, insertSQL, [], function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            // console.log(data.affectedRows)
            if (data.affectedRows === 1) {
                var goodsDetail = [{ size: 170, num: 30 }, { size: 175, num: 30 }, { size: 180, num: 40 }];
                var insertSQLDetail = "";
                var i = 0;
                goodsDetail.forEach(item => {

                    insertSQLDetail = `
                      insert into goodsdetail value('${goodsId}',${item.size},${item.num})
                    `
                    getInsert(con, insertSQLDetail, [], function (err, insertData) {
                        if (err) {
                            throw new Error("server error");
                        }
                        i++;
                        if (insertData.affectedRows === 1 && i === goodsDetail.length) {

                            res.json({
                                result: "success"
                            });
                        }
                    });
                });



            }
        })
    }
    router.get(Url.getEvaluteCount, function (req, res) {
        var { searchInfo } = req.query;
        var selectSQL = `
        SELECT 
            COUNT(evaluateid) AS evaluteCount
        FROM 
            evaluatedetail
            where userid like '%${searchInfo}%' 
            or goodsid like '%${searchInfo}%'
        `
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            if (data[0].hasOwnProperty("evaluteCount")) {
                res.json(data[0]);
            }
        })
    });
    router.post(Url.getEvaluteDetailInfo, function (req, res) {
        // console.log(req.body);
        var { searchInfo, page, limit } = req.body;
        var start = (page - 1) * limit;
        var selectSQL = `
            select * from evaluatedetail
                where userid like '%${searchInfo}%' 
                or goodsid like '%${searchInfo}%'
            limit ${start},${limit}
        `
        getFind(con, selectSQL, function (err, data) {
            // selectSQL
            SQLErrorInfo(err);
            if (data.length != 0) {
                res.json(data);
            }
        });
    });
    router.post(Url.deleteEvaluteInfo, function (req, res) {
        // console.log(req.body);
        var deleteEvaluteList = req.body;
        var evaluteLen = deleteEvaluteList.length;
        var deleteSQL = "";
        for (var i = 0; i < evaluteLen; i++) {
             deleteSQL = `
                delete from evaluatedetail 
                where evaluateid = '${deleteEvaluteList[i].evaluateid}'
            `;
                (function (index) {
                    getDelete(con, deleteSQL, [], function (err, data) {
                        SQLErrorInfo(err);
                        if (data.affectedRows == 1 && index + 1 == evaluteLen) {
                            res.json({
                                result: "success"
                            })
                        }
                    })
                }(i));
        }
    });
    router.post(Url.editedEvaluteInfo, function (req, res) {
        // console.log(req.body)
        var { evaluateid, userid, goodsid, evaluatecontent, grade } = req.body;
        var updateSQL = `
            UPDATE evaluatedetail SET 
                userid = '${userid}' ,  
                goodsid = '${goodsid}' ,
                grade = '${grade}' ,
                evaluatecontent = '${evaluatecontent}' 
            WHERE evaluateid = '${evaluateid}'
        `
        getUpdate(con, updateSQL, [], function (err, data) {
            SQLErrorInfo(err);
            if (data.affectedRows === 1) {
                res.json({
                    result: "success"
                })
            } else {
                res.json({
                    result: "fail"
                })
            }
        })

    });
    router.get(Url.getCouponCount, function (req, res) {
        var { searchInfo } = req.query;
        var selectSQL = `
        SELECT 
            COUNT(couponid) AS couponCount
        FROM 
            coupon
            where userid like '%${searchInfo}%' 
            or goodsid like '%${searchInfo}%'
        `
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            if (data[0].hasOwnProperty("couponCount")) {
                res.json(data[0]);
            }
        })
    });
    router.post(Url.getCouponDetailInfo, function (req, res) {
        // console.log(req.body);
        var { searchInfo, page, limit } = req.body;
        var start = (page - 1) * limit;
        var selectSQL = `
            select * from coupon
                where userid like '%${searchInfo}%' 
                or goodsid like '%${searchInfo}%'
            limit ${start},${limit}
        `
        getFind(con, selectSQL, function (err, data) {
            // selectSQL
            SQLErrorInfo(err);
            if (data.length != 0) {
                res.json(data);
            }
        });
    });
    router.post(Url.editedCouponInfo, function (req, res) {
        console.log(req.body);
        var { couponid, userid, goodsid, couponprice, couponstatus, starttime, endtime, } = req.body;
        var updateSQL = `
            UPDATE coupon SET 
                userid = '${userid}' ,  
                goodsid = '${goodsid}' ,
                couponprice = '${couponprice}' ,
                couponstatus = '${couponstatus}',
                starttime = '${starttime}',
                endtime = '${endtime}'
            WHERE couponid = '${couponid}'
        `
        getUpdate(con, updateSQL, [], function (err, data) {
            SQLErrorInfo(err);
            if (data.affectedRows === 1) {
                res.json({
                    result: "success"
                })
            } else {
                res.json({
                    result: "fail"
                })
            }
        })
    })
    router.post(Url.deleteCouponInfo, function (req, res) {
        var deleteCouponList = req.body;
        var couponLen = deleteCouponList.length;
        var deleteSQL = "";
        var deleteSQL = "";
        for (var i = 0; i < couponLen; i++) {
            deleteSQL = `
            delete from coupon 
            where couponid = '${deleteCouponList[i].couponid}'
        `;
            (function (index) {
                getDelete(con, deleteSQL, [], function (err, data) {
                    SQLErrorInfo(err);
                    console.log(index)
                    if (data.affectedRows == 1 && index + 1 == couponLen) {
                        res.json({
                            result: "success"
                        })
                    }
                })

            }(i))

        }
    });
    /**
     * getAuditLogCount
        getAuditLogDetailInfo
     */
    router.get(Url.getAuditLogCount, function (req, res) {
        var { searchInfo } = req.query;
        var selectSQL = `
        SELECT 
            COUNT(auditid) AS auditCount
        FROM 
            auditlog
        where userid like '%${searchInfo}%' 
        or operateway like '%${searchInfo}%'
        `;
        getFind(con, selectSQL, function (err, data) {
            if (err) {
                throw new Error("server error");
            }
            if (data[0].hasOwnProperty("couponCount")) {
                res.json(data[0]);
            }
        })
    });
    router.post(Url.getAuditLogDetailInfo, function (req, res) {
        // console.log(req.body);
        var { searchInfo, page, limit } = req.body;
        var start = (page - 1) * limit;
        var selectSQL = `
            select auditid,auditlog.userid,username,operateway,operatetime  
            FROM user,auditlog
                where user.userid = auditlog.userid and
               ( auditlog.userid like '%${searchInfo}%' or
               operateway like '%${searchInfo}%')
            limit ${start},${limit}
        `;
        getFind(con, selectSQL, function (err, data) {
            // selectSQL
            SQLErrorInfo(err);
            if (data.length != 0) {
                res.json(data);
            }else{
                res.json(null)
            }
        });
    });
    router.post(Url.deleteAuditInfo,function(req,res){
        console.log(req.body)
        var deleteAuditList = req.body;
        var auditLen = deleteAuditList.length;
        var deleteSQL = "";
        for (var i = 0; i < auditLen; i++) {
            deleteSQL = `
            delete from auditlog 
            where auditid = '${deleteAuditList[i].auditid}'
        `;
            (function (index) {
                getDelete(con, deleteSQL, [], function (err, data) {
                    SQLErrorInfo(err);
                    console.log(index)
                    if (data.affectedRows == 1 && index + 1 == auditLen) {
                        res.json({
                            result: "success"
                        })
                    }
                })

            }(i))

        }   
    })
    /**
     * SELECT * FROM auditlog
        INSERT INTO auditlog (userid,operateway,operatetime) VALUES(19,'登录成功','2020-01-29 12:35:00')
     */
    router.post(Url.deleteNotTheSameDayLog,function(req,res){
        /**
         * 获取今天的年-月-日
         * 格式为:2020-01-30
         */
        var currentDate = formatDate().split(" ")[0];
        /**
         * 删除掉不是今天的操作日志
         * 使用取反进行like模糊查询
         */
        var deleteSQL = `
            DELETE FROM auditlog
            WHERE  !(operatetime LIKE '%${currentDate}%')
        `
        getDelete(con,deleteSQL,[],function(err,data){
            SQLErrorInfo(err);
            
                res.json({
                    result:"success"
                })
        })
    });
    router.post(Url.searchGoodsSaleNumType,function(req,res){
        var selectSQL = `
        SELECT typeid ,COUNT(typeid) AS typeNum , COUNT(typeid)*100 AS total  ,SUM(goodscount) AS remainNum FROM  goods
        GROUP BY typeid
        
        `
        getFind(con,selectSQL,function(err,data){
            SQLErrorInfo(err);
            res.json(data);
        })
    });
    router.post(Url.searchGoodsSaleNumSize,function(req,res){
        var { goodsId } = req.body;
        // console.log(req.body)
        var selectSQL = `
            SELECT goodsid,size,goodssizenum 
            AS remainNum  
            FROM goodsdetail
            WHERE goodsid = '${goodsId}'
        `;
        getFind(con,selectSQL,function(err,data){
            SQLErrorInfo(err);
            console.log(data);
            var newData = data.map(item=>{
                switch(item.size){
                case 170:
                    item.total = 30;
                    break;
                case 175:
                    item.total = 30;
                    break;
                case 180:
                    item.total = 40;
                    break;
                }
                return item;
            })
            res.json(newData);
        });
    });
    router.post(Url.getAllGoodsId,function(req,res){
        var selectSQL = `
        SELECT goodsid AS value ,goodsid AS label FROM goods
        `
        getFind(con,selectSQL,function(err,data){
            SQLErrorInfo(err);
            res.json(data);
        })
    })
    router.post(Url.addCouponInfo,function(req,res){
        var {userid,goodsid,couponprice,couponstatus,starttime,endtime} = req.body;
        var insertSQL = `
            insert into coupon (userid,goodsid,couponprice,couponstatus,starttime,endtime) 
            values('${userid}','${goodsid}','${couponprice}','${couponstatus}','${starttime}','${endtime}')
        `
        getInsert(con,insertSQL,function(err,data){
            SQLErrorInfo(err);
            if(data.affectedRows == 1){
                res.json({
                      result:"success"  
                })
            }else{
                res.json({
                    result:fail
                })
            }
        })

    })
}

//  var baseURL = path.join(__dirname, "../public/static") + `\\${typeId}\\${category}\\${goodsId}`;
//  var baseURL = path.join(__dirname, "../public/static") + `\\BOY\\Jacket\\B55550`;

// deleteall(baseURL)
