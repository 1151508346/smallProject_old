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
var { getInsert, getFind, getUpdate, getDelete } = require("../db/curd.js");
var { aesEncrypt, aesDecrypt } = require("../aes_en_de.js");
var Url = require("./api.js");
function handleImageURL(data) {
  for (let i = 0; i < data.length; i++) {
    var imageURL = `${baseURL}${data[i].typeid}/${data[i].category}/${data[i].goodsid}/`;
    data[i].goodsimage = [];
    for (var j = 1; j < 5; j++) {
      data[i].goodsimage.push(imageURL + "0" + j + ".jpg");
    }
  }
}
function formatDate() {
  var date = new Date();
  console.log()
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  // var hour = date.getHours();
  // var minutes = date.getMinutes();
  // console.log(minutes);
  // var seconds = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  // if(hour<10){
  //   hour = "0" + hour;
  // }
  // if(minutes<10){
  //   minutes = "0"+minutes;
  // }
  // if(seconds<10){
  //   seconds = "0"+seconds;
  // }
  // `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  return `${year}-${month}-${day}`;
}
module.exports = function (router) {
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
  router.post(Url.login, function (req, res) {
    var username = req.body.username;

    var passwordAES = aesEncrypt(req.body.password); //加密后的密码

    var selectSQL = "select userid, username,password from  user where username = \'" + username + "\'and password=\'" + passwordAES + "\'";
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
          type: "success",
          username: username,
          userid: data[0].userid
        })
        //登录成功将用户名保存在session

      }
    })
    // console.log(username, passwordAES)
  });
  //忘记密码，检查注册的用户和邮箱是否存在
  router.post(Url.forgetCheck, function (req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var selectSQL = "select username,email from user where username = \'" + username + "\' and email = \'" + email + "\'";
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
          status: "404",
          type: "selectFail"
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
  router.post(Url.updatePassword, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password)
    var passwordAES = aesEncrypt(password);
    // UPDATE USER SET PASSWORD = "a123456789" WHERE username = "a123456789"
    var selectSQL = "update user set password = \'" + passwordAES + "\' where username = \'" + username + "\'";
    console.log(selectSQL)
    // UPDATE Person SET FirstName = 'Fred' WHERE LastName = 'Wilson'
    getUpdate(con, selectSQL, [], function (err, result) {
      // console.log(err,result)
      if (err) {
        res.statusCode = 400;
        console.log("更新失败")
        res.json({
          status: "500",
          type: "updateFail"
        });
        return;
      }
      if (result.affectedRows == 1) {
        res.json({
          status: 200,
          type: "updateSuccess"
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

  router.get(Url.initAddress, function (req, res) {
    var { username } = req.query;
    // console.log(username);
    var selectSQL = `
        select * from user_address where username=\'${username}\' 
      `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("serve error")
      }
      res.json(data);
    })



  });


































  //用户添加收货地址
  router.post(Url.add_address, function (req, res) {
    /**
     * 1.获取登录的用户名
     * 2.将前端添加的收货地址插入在数据库中
     */
    //
    // res.redirect("/getSession");
    // var username = "aa123456"; //登录的用户名
    var createTime = new Date().toLocaleString();

    var { username, receiver, receivePhone, areaPath, detailAddress, isDefault, zipCode } = req.body;
    // console.log(username)
    var insertSQL = `insert into user_address value(\'${username}\',\'${receiver}\',\'${receivePhone}\',\'${areaPath}\',\'${detailAddress}\',\'${isDefault}\',\'${zipCode}\',\'${createTime}\'  )`;
    // UPDATE	buycar SET buycount=buycount+\'${buycount}
    if (isDefault === 1) {
      var updateSQL = `UPDATE	user_address SET isdefault = 0 `;
      getUpdate(con, updateSQL, [], function (err, updateRes) {
        if (err) {
          throw new Error("server error");
        }
        console.log("**************");
        console.log(updateRes.affectedRows)
        if (updateRes.affectedRows === 1) {
        }
      });
    }
    insert_Address();

    function insert_Address() {
      getInsert(con, insertSQL, [], function (err, data) {
        if (err) {
          res.json({
            status: "500",
            type: "fail"
          })
          console.log("--------error---------");
          throw new Error(err);
          // return;
        }
        if (data.affectedRows == 1) {
          res.json({
            status: "200",
            type: "success"
          })
        }
      });
    }

  });

  router.get(Url.getGoods, function (req, res) {
    console.log(req.query)
    // { pageNum: '29', limit: '10' }
    var pageNum = req.query.pageNum; //请求页数
    var limit = req.query.limit; //每次请求数量

    // res.json(req.query)
    // var point = 35;
    // var limit = 10;
    var selectSQL = `select * from goods limit ${(pageNum - 1) * limit},${limit} `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("database operate error")
      }

      if (data.length === 0) {
        console.log("加载完整");
        res.send("over");
        return;
      }

      handleImageURL(data);
      res.json(data);


      // console.log("第"+pageNum+"数据")
    })
  })
  // SELECT * FROM goods,goodsdetail WHERE  goods.`goodsid` = 'B00001' AND goods.goodsid = goodsdetail.goodsid
  router.get(Url.getGoodsDetail, function (req, res) {
    var goodsid = req.query.goodsid;
    var selectSQL = `SELECT * FROM goods,goodsdetail WHERE  goods.goodsid = \'${goodsid}\' AND goods.goodsid = goodsdetail.goodsid`
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      handleImageURL(data);
      res.json(data)
    })

  });
  router.get(Url.getCollectGoods, function (req, res) {
    console.log("----------------");
    var goodsid = req.query.goodsid; //前台传过来的商品ID号
    var username = req.query.username; //保存在本地缓存中的用户名，表示此时已经登录的用户

    var selectUsernameSQL = `select userid from user where username= \'${username}\'`;
    getFind(con, selectUsernameSQL, function (err, data) {
      if (err) {
        console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      // handleImageURL(data);
      var userid = data[0].userid;
      // console.log(userid)

      //在收藏表中查询有没有该或
      var selectSQL = `SELECT * FROM collecgoods WHERE  goodsid = \'${goodsid}\' AND userid=\'${userid}\'`;
      getFind(con, selectSQL, function (err, resu) {
        if (err) {
          console.log("哈哈~~,亲出错了");
          res.json({
            type: "fail",
            status: "500"
          })
          throw new Error("error");
        }
        //handleImageURL(data);
        // console.log(data);
        var insertSQL = `insert into collecgoods value(\'${goodsid}\',\'${userid}\')`;
        var deleteSQL = `delete from collecgoods where goodsid = \'${goodsid}\' and userid =\'${userid}\'`;
        // console.log(goodsid,userid)
        if (resu.length === 0) {
          // console.log(resu)
          getInsert(con, insertSQL, [], function (err, result) {
            if (err) {
              res.json({
                type: "fail",
                status: "500"
              });
              // throw new Error("insert error");
            }
            if (result.affectedRows === 1) {
              res.json({
                type: "collectSuccess",
                status: "200"
              })
            }
          })
        } else {
          // deleteSQL
          //result.affectedRows
          getDelete(con, deleteSQL, [], function (err, result) {
            if (err) {
              res.json({
                type: "fail",
                status: "500"
              });
              throw new Error("delete error");
            }
            if (result.affectedRows === 1) {
              res.json({
                type: "cancelCollect",
                status: "200"
              });
            }
          })
        }

      });
    });

  })
  router.get(Url.initCollectGoodsStatus, function (req, res) {
    var goodsid = req.query.goodsid; //前台传过来的商品ID号
    var username = req.query.username; //保存在本地缓存中的用户名，表示此时已经登录的用户
    if (username == "null") {
      console.log("用户不存在");
      res.json({
        type: "noUserStatus",
        status: "200"
      })
      return;
    } else {
      var selectUsernameSQL = `select userid from user where username= \'${username}\'`;
      getFind(con, selectUsernameSQL, function (err, data) {
        if (err) {
          console.log("哈哈~~,亲出错了");
          throw new Error("error");
        }
        // handleImageURL(data);
        var userid = data[0].userid;
        //在收藏表中查询有没有该或
        var selectSQL = `SELECT * FROM collecgoods WHERE  goodsid = \'${goodsid}\' AND userid=\'${userid}\'`;
        getFind(con, selectSQL, function (err, resu) {
          if (err) {
            console.log("哈哈~~,亲出错了");
            res.json({
              type: "fail",
              status: "500"
            });
            throw new Error("error");
          };
          //表示查询的商品已经在收藏表中了
          if (resu.length !== 0) {

            res.json({
              type: "collectSuccess",
              status: "200"
            })
          }
        });
      })

    }


  });
  router.get(Url.addBuyCar, function (req, res) {
    // console.log(req.query);

    var { goodsid, username, buycount, buysize } = req.query;
    console.log({ goodsid, username, buycount, buysize });
    var selectUsernameSQL = `select userid from user where username= \'${username}\'`;
    getFind(con, selectUsernameSQL, function (err, data) {
      if (err) {
        console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      var userid = data[0].userid;
      var selectSQL = `select * from buycar
        where goodsid=\'${goodsid}\'
        and userid=\'${userid}\'
        and buysize=\'${buysize}\'`;
      getFind(con, selectSQL, function (err, data) {

        if (data.length === 0) {
          var insertSQL = `
        insert into buycar value(\'${userid}\',\'${goodsid}\',\'${buycount}\',\'${buysize}\')
    `;
          getInsert(con, insertSQL, [], function (err, insertRes) {
            if (err) {
              res.json({
                type: "fail",
                status: "500"
              });
              return;
              // throw new Error("server error");
            }
            if (insertRes.affectedRows === 1) {
              res.json({
                type: "addBuyCarSuccess",
                status: "200"
              });
            }
          })
        } else {
          // goodsid,userid,buycount,buysize
          var updateSQL = `UPDATE	buycar SET buycount=buycount+\'${buycount}\'
    WHERE userid =\'${userid}\' and goodsid=\'${goodsid}\' and buysize=\'${buysize}\'`;
          getUpdate(con, updateSQL, [], function (err, updateRes) {
            if (err) {
              // res.statusCode = 400;
              console.log("更新失败")
              res.json({
                status: "500",
                type: "updateFail"
              });
              return;
            }
            if (updateRes.affectedRows == 1) {
              res.json({
                status: "200",
                type: "updateBuyCarSuccess"
              })

            }
          })

        }
      })
    });

  });
  router.get(Url.initBuyCar, function (req, res) {
    var username = req.query.username;
    var selectUsernameSQL = `select userid from user where username= \'${username}\'`;
    getFind(con, selectUsernameSQL, function (err, data) {
      if (err) {
        console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      var userid = data[0].userid;
      console.log(userid)
      var getCarInfoSQL = `select * from buycar,goods where buyCar.userid =\'${userid}\' and goods.goodsid =buycar.goodsid`;
      getFind(con, getCarInfoSQL, function (err, data) {
        if (err) {
          res.json({
            type: "fail",
            status: "500",
          });
          throw new Error("server error");
        }
        // console.log(data);
        handleImageURL(data);
        res.json(data);

      })

    })

  });
  router.get(Url.updateBuyCarCount, function (req, res) {
    // console.log(req.query);
    var { userid, goodsid, buysize, buycount } = req.query;
    var updateSQL = `update buycar set buycount=\'${buycount}\' where userid=\'${userid}\' and goodsid=\'${goodsid}\' and buysize=\'${buysize}\'`
    getUpdate(con, updateSQL, [], function (err, updateRes) {
      if (updateRes.affectedRows == 1) {
        res.json({
          status: "200",
          type: "updateBuyCarSuccess"
        })
      }
    });
  });
  router.post(Url.deleteBuyCarGoods, function (req, res) {
    /**
     * 
    { userid: 19, goodsid: 'B00001', buycount: 1, buysize: 170 },
    { userid: 19, goodsid: 'B00001', buycount: 2, buysize: 180 },
    { userid: 19, goodsid: 'B00004', buycount: 1, buysize: 170 }
     */
    var length = req.body;
    for (var i = 0; i < req.body.length; i++) {
      var { userid, goodsid, buysize } = req.body[i];
      var flag = false;
      var deleteSQL = `delete from buycar where userid=\'${userid}\' and  goodsid = \'${goodsid}\' and buysize =\'${buysize}\'`
      getDelete(con, deleteSQL, [], function (err, data) {
        if (err) {
          res.json({
            type: "fail",
            status: "500"
          });
          throw new Error("error");
        } else {
          if (data.affectedRows === 1) {
            res.json({
              type: "deleteSuccess",
              status: "200"
            })
          } else {
            res.json({
              type: "deleteFail",
              status: "404"
            });
            throw new Error("delete error");
          }



        }
      })


    }

  });
  router.get(Url.initTuijian, function (req, res) {
    var selectSQL;
    if (req.query.username) {
      //用户登录状态，针对不同用户来推荐，通过商品的数量升序查询20
      selectSQL = `SELECT * FROM goods ORDER BY goodscount ASC LIMIT 0,20 `;

    } else {
      //未登录状态，根据创建时间降序排序查询推荐
      selectSQL = `SELECT * FROM goods ORDER BY createtime DESC LIMIT 0,20 `;
    }

    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      res.json(data)
    });
  });
  router.get(Url.lowPrice, function (req, res) {
    var selectSQL = `SELECT * FROM goods ORDER BY goodsprice ASC LIMIT 0,20 `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      res.json(data)
    });


  })
  router.get(Url.boyCloth, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'BOY' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      console.log(data);
      res.json(data);

    });
  });
  router.get(Url.girlCloth, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'GIRL' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      console.log(data);
      res.json(data);

    });
  });
  //套装
  router.get(Url.suit, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'SUIT' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      console.log(data);
      res.json(data);

    });
  });
  //明星
  router.get(Url.start, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'START' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      console.log(data);
      res.json(data);

    });
  });
  //孕妇专区
  // gravida
  router.get(Url.gravida, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'GIRL' and category = 'gravida'  `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data);
      console.log(data);
      res.json(data);

    });
  });

  // payForToOrder
  router.post(Url.payForToOrder, function (req, res) {

    req.body.forEach(function (item, index) {
      var { userid, goodsid, count, size, purchasetime, goodsstatus } = item;
      // console.log(item)
      // console.log(userid, goodsid, count, size, purchasetime, goodsstatus);
      // ,\'${userid}\',\'${purchasetime}\',\'${count}\',\'${size}\',\'${goodsstatus}\'
      var insertSQL = `insert into orders (goodsid,userid,purchasetime,count,size,goodsstatus) value(\'${goodsid}\',\'${userid}\' ,\'${purchasetime}\' ,\'${count}\'  ,\'${size}\',\'${goodsstatus}\')`;
      var deleteSQL = ` delete from buycar where goodsid = \'${goodsid}\' and userid = \'${userid}\' and buycount = \'${count}\' and buysize = \'${size}\'`
      var selectSQL = `
        select * from orders 
        where userid = \'${userid}\' and
        goodsid = \'${goodsid}\' and
        size = \'${size}\' and
        goodsstatus = 0

      `
      getFind(con, selectSQL, function (err, data) {
        if (err) {
          throw new Error("server error");
        }
        if (data.length != 0) {
          var newData = data.map(item => {
            item.goodsstatus = 1;
            return item;
          });
          newData.forEach(item => {
            var updateSQL = `update  orders set goodsstatus = 1
              where orderid = \'${item.orderid}\'
            
             `
            getUpdate(con, updateSQL, [], function (err, updateData) {
              if (err) {
                throw new Error("server error");
              }
              if (updateData.affectedRows === 1) {
                res.json({
                  type: "success",
                  status: "200"
                })
              }
            })
          })
        } else {
          getInsert(con, insertSQL, [], function (err, insertData) {
            if (insertData.affectedRows === 1) {
              getDelete(con, deleteSQL, [], function (err, deleteData) {
                console.log(deleteData);
                if (deleteData.affectedRows === 1) {
                  res.json({
                    type: "success",
                    status: "200"
                  });
                } else {
                  res.json({
                    type: "fail",
                    status: "200"
                  })
                }
              })

            }
          })
        }
      });


    });
  });
  router.get(Url.updateDefaultAddress, function (req, res) {
    console.log();
    var { addressid } = req.query;

    var updateSQLAll = `UPDATE	user_address SET isdefault = 0 `;
    getUpdate(con, updateSQLAll, [], function (err, updateRes) {
      if (err) {
        throw new Error("server error");
      }
      console.log("**************");
      console.log(updateRes.affectedRows)
      if (updateRes.affectedRows === 1) {
      }
    });

    var updateSQL = ` update user_address set isdefault=1 where addressid=\'${addressid}\'`;
    getUpdate(con, updateSQL, [], function (err, updateRes) {
      if (err) {
        throw new Error("server error");
      }
      if (updateRes.affectedRows === 1) {
        res.json({
          type: "updateSuccess",
          status: "200"
        });
      } else {
        res.json({
          type: "fail",
          status: "404"
        })
      }

    });

  });
  router.get(Url.getOrderList, function (req, res) {
    console.log(req.query);
    var { username, goodsstatus } = req.query;
    var selectSQL = `
SELECT * FROM  goods , orders WHERE orders.goodsid = goods.goodsid AND 
orders.userid = (SELECT user.userid FROM USER WHERE username = \'${username}\') AND goodsstatus = ${goodsstatus}
      `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      // console.log(data)
      handleImageURL(data);
      res.json(data);
    })
  });
  router.post(Url.cancelOrder, function (req, res) {
    var { goodsid, size, goodsstatus, userid } = req.body;
    var deleteSQL = `
      delete from orders where goodsid = \'${goodsid}\' and
      size = \'${size}\' and
      goodsstatus = \'${goodsstatus}\' and
      userid = \'${userid}\' 

    `
    getDelete(con, deleteSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      if (data.affectedRows !== 0) {
        res.json({
          status: "200",
          type: "success"
        })
      }
    });
  });
  router.get(Url.toCollect, function (req, res) {
    var { userid } = req.query;
    var selectSQL = `SELECT * FROM goods,collecgoods 
      WHERE collecgoods.userid = \'${userid}\' AND goods.goodsid = collecgoods.goodsid`;

    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("serve error");
      }
      handleImageURL(data);
      res.json(data);

    })

  });
  router.get(Url.toVisited, function (req, res) {
    var { userid } = req.query;
    var selectSQL = `SELECT * FROM goods,visited 
    WHERE visited.userid = \'${userid}\' AND goods.goodsid = visited.goodsid`;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("serve error");
      }
      handleImageURL(data);
      res.json(data);

    });
  })

  router.get(Url.insertVisited, function (req, res) {
    var { userid, goodsid } = req.query;
    console.log(userid, goodsid)
    var insertSQL = `insert into visited  value(\'${goodsid}\',\'${userid}\')`;
    getInsert(con, insertSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      if (data.affectedRows === 1) {
        res.json({
          type: "insertSuccess",
          status: "200"
        })
      } else {
        res.json({
          type: "fail",
          status: "400"
        })
      }
    })
  });
  router.get(Url.applyBackMoney, function (req, res) {
    var { userid, goodsid, size, goodsstatus } = req.query;
    var deleteSQL = `delete from orders where userid= \'${userid}\' and goodsid = \'${goodsid}\' and size = \'${parseFloat(size)}\' and goodsstatus = \'${goodsstatus}\'`;
    getDelete(con, deleteSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      console.log(data);
      if (data.affectedRows >= 1) {
        res.json({
          type: "success", status: "200"
        });
      } else {
        res.json({
          type: "not exit",
          status: "200"
        });
      }
    });

  });

  router.get(Url.signIn, function (req, res) {
    // console.log(req.query)
    var { userid } = req.query;
    var selectSQL = `select * from signin where userid = \'${userid}\'`
    getFind(con, selectSQL, function (err, findData) {
      if (err) {
        throw new Error("server error");
      }
      // console.log(findData)
      if (findData.length === 1) {
        var currentTime = formatDate();
        var LastTime = findData[0].signindate;
        var formatCurrentDate = new Date(Date.parse(currentTime)).toLocaleString().split(" ")[0];
        var formatLastDate = LastTime.toLocaleString().split(" ")[0];
        if(formatCurrentDate === formatLastDate){
          res.json({
            type:"has signed in",
            status:"200"
          })
          return ;
        }
        console.log("----------------------------------");
       
        var updateSQL = `update signin set integral=integral+1 , signindate=\'${formatDate()}\' where userid = \'${userid}\'`;
        getUpdate(con, updateSQL, [], function (err, updateData) {
          if (err) {
            throw new Error("server error");
          }
          if (updateData.affectedRows === 1) {
            res.json({
              type: "success",
              status: "200"
            });
          }
        });
      } else {
        var insertSQL = `insert into signin value (\'${userid}\',\'${formatDate()}\',1)`;
        getInsert(con, insertSQL, [], function (err, insertDate) {
          if (err) {
            throw new Error("server error");
          }
          if (insertDate.affectedRows === 1) {
            res.json({
              type: "success",
              status: "200"
            })
          }
        })
      }
    })
  })





}


























// router.post("/test",function(req,res){
  //   console.log(req.body);
  //   console.log(req.headers.authorization)
  //   res.json({
  //     name:"abc",
  //     sex:"male"
  //   })
  // })


















































// var goodsid = ["S00001", "S00002", "S00003", "S00004", "S00005"];

// var sizenum = [
//   {
//     size: 170,
//     goodsidsizenum: 30
//   },
//   {
//     size: 175,
//     goodsidsizenum: 30
//   },
//   {
//     size: 180,
//     goodsidsizenum: 40
//   },
// ]
// function test() {
//   var insertSQL = ""
//   for (var i = 0; i < goodsid.length; i++) {
//     for (var j = 0; j < sizenum.length; j++) {
//       insertSQL = `insert into goodsdetail value (\'${goodsid[i]}\',\'${sizenum[j].size}\',\'${sizenum[j].goodsidsizenum}\')`;
//       getInsert(con, insertSQL, [], function (err, data) {
//         console.log(data)
//       })
//     }

//   }
// }
// test();





