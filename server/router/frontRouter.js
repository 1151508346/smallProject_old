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
var { formatDate, handleImageURL } = require("../tool/index.js");
var Url = require("./fontApi.js");
function SQLErrorInfo(err) {
  if (err) {
      throw new Error("server error");
  }
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
    var { userid } = req.query;
    var selectSQL = `
        select * from user_address where userid=\'${userid}\' 
      `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("serve error")
      }
      // console.log(data.affectedRows)
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
    var { userid, receiver, receivePhone, areaPath, detailAddress, isDefault, zipCode } = req.body;
    // console.log(username)
    var insertSQL = `insert into user_address(userid,receiver,receivephone,areapath,detailaddress,isdefault,zipcode,createtime) value(\'${userid}\',\'${receiver}\',\'${receivePhone}\',\'${areaPath}\',\'${detailAddress}\',\'${isDefault}\',\'${zipCode}\',\'${createTime}\'  )`;
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

      handleImageURL(data, baseURL);
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
        // console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      handleImageURL(data, baseURL);
      res.json(data)
    })

  });
  router.get(Url.getCollectGoods, function (req, res) {
    // console.log("----------------");
    var goodsid = req.query.goodsid; //前台传过来的商品ID号
    var username = req.query.username; //保存在本地缓存中的用户名，表示此时已经登录的用户

    var selectUsernameSQL = `select userid from user where username= \'${username}\'`;
    getFind(con, selectUsernameSQL, function (err, data) {
      if (err) {
        // console.log("哈哈~~,亲出错了");
        throw new Error("error");
      }
      // handleImageURL(data);
      var userid = data[0].userid;
      // console.log(userid)

      //在收藏表中查询有没有该或
      var selectSQL = `SELECT * FROM collecgoods WHERE  goodsid = \'${goodsid}\' AND userid=\'${userid}\'`;
      getFind(con, selectSQL, function (err, resu) {
        if (err) {
          // console.log("哈哈~~,亲出错了");
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
        handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
      console.log(data);
      res.json(data);

    });
  });
  router.get(Url.boy, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'BOY' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data, baseURL);
      console.log(data);
      res.json(data);

    });
  });
  router.get(Url.girl, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'GIRL' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data, baseURL);
      console.log(data);
      res.json(data);

    });
  });
  router.get(Url.children, function (req, res) {
    var selectSQL = `SELECT * FROM goods where typeid = 'CHILDREN' `;
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        res.json({
          type: "fail",
          status: "500"
        });
        throw new Error("serve error");
      }
      handleImageURL(data, baseURL);
      console.log(data);
      res.json(data);

    });
  });
  // payForToOrder
  router.post(Url.payForToOrder, function (req, res) {
    // var payGoodsNum = 0;
    // console.log(req.body)
    // var payGoodsList = [];
    // if (req.body.hasOwnProperty("notDelete")) {
    //   payGoodsList = req.body.tempPayForData
    // } else {
    //   payGoodsList = req.body
    // }
    // payGoodsList.forEach(function (item, index) {
    //   var { userid, goodsid, count, size, purchasetime, goodsstatus } = item;
    //   var insertSQL = `insert into orders (goodsid,userid,purchasetime,count,size,goodsstatus) value(\'${goodsid}\',\'${userid}\' ,\'${purchasetime}\' ,\'${count}\'  ,\'${size}\',\'${goodsstatus}\')`;
    //   var deleteSQL = ` delete from buycar where goodsid = \'${goodsid}\' and userid = \'${userid}\' and buycount = \'${count}\' and buysize = \'${size}\'`
    //   var selectSQL = `
    //     select * from orders 
    //     where userid = \'${userid}\' and
    //     goodsid = \'${goodsid}\' and
    //     size = \'${size}\' and
    //     goodsstatus = 0
    //   `
    //   getFind(con, selectSQL, function (err, data) {
    //     if (err) {
    //       throw new Error("server error");
    //     }
    //     console.log(data);
    //     if (data.length != 0) {
    //       var newData = data.map(item => {
    //         item.goodsstatus = 1;
    //         return item;
    //       });
    //       newData.forEach(item => {
    //         var updateSQL = `update  orders set goodsstatus = 1
    //           where orderid = \'${item.orderid}\'
    //          `
    //         getUpdate(con, updateSQL, [], function (err, updateData) {
    //           if (err) {
    //             throw new Error("server error");
    //           }
    //           if (updateData.affectedRows === 1) {

    //             getDelete(con, deleteSQL, [], function (err, deleteData) {
    //               if (err) {
    //                 throw new Error("server error");
    //               }
    //               payGoodsNum++;
    //               console.log(payGoodsNum)
    //               if (deleteData.affectedRows === 1 && payGoodsNum === payGoodsList.length) {
    //                 // console.log(payGoodsNum)
    //                 res.json({
    //                   type: "success",
    //                   status: "200"
    //                 });
    //               } else if (deleteData.affectedRows != 1 && payGoodsNum === payGoodsList.length) {
    //                 // console.log(payGoodsNum)
    //                 res.json({
    //                   type: "fail",
    //                   status: "200"
    //                 })
    //               }
    //             })
    //           }
    //         })
    //       })
    //     } else {
    //       getInsert(con, insertSQL, [], function (err, insertData) {
    //         if (insertData.affectedRows === 1 && payGoodsNum === payGoodsList.length) {
    //           if (req.body.hasOwnProperty("notDelete")) {
    //             console.log("=====================================================");
    //             res.json({
    //               type: "success",
    //               status: "200"
    //             })
    //             return;
    //           }
    //           getDelete(con, deleteSQL, [], function (err, deleteData) {
    //             if (err) {
    //               throw new Error("server error");
    //             }
    //             payGoodsNum++;
    //             if (deleteData.affectedRows === 1 && payGoodsNum === payGoodsList.length) {
    //               // console.log(payGoodsNum)
    //               res.json({
    //                 type: "success",
    //                 status: "200"
    //               });
    //             } else if (deleteData.affectedRows != 1 && payGoodsNum === payGoodsList.length) {
    //               // console.log(payGoodsNum)
    //               res.json({
    //                 type: "fail",
    //                 status: "200"
    //               })
    //             }
    //           })

    //         }
    //       })
    //     }
    //   });
    // });
    payFor(req, res);

  });
  var payForFlag ;
  function payFor(req, res) {
    //如果等于false 说明支付购物车中的商品
    payForFlag = false;
    if (req.body.hasOwnProperty("fromURL") && req.body.fromURL == "car") {
      handleBuyCarPayFor(req, res);
      return;
    }
    // console.log(req.body)
    if (req.body.hasOwnProperty("fromURL") && req.body.fromURL == "shoppingDetail") {
      insertOrdersSQLByShoppingDetail(req, res);
    }
    if (req.body.hasOwnProperty("fromURL") && req.body.fromURL == "order") {
      updateOrderStatusComePayed(req, res);
    }
  }
  //将待支付状态的商品改变为已经支付的状态
  function updateOrderStatusComePayed(req, res) {
    var tempPayForData = req.body.tempPayForData[0];
    var { orderid } = tempPayForData;
    var updateSQL = `update  orders set goodsstatus = 1
        where orderid = \'${orderid}\'`;
    getUpdate(con, updateSQL, [], function (err, updateData) {
      if (err) {
        throw new Error("server error");
      }
      if (updateData.affectedRows === 1) {
        // res.json({
        //   type:"success",
        //   status:"200"
        // });
        updateGoodsAndGoodsDetail(req, res);
      } else {
        res.json({
          type: "fail",
          status: "404"
        })
      }
    })
  }
  function handleBuyCarPayFor(req, res) {
    insertOrdersSQL(req, res);
  }
  function insertOrdersSQL(req, res) {
    var tempPayForData = req.body.tempPayForData;
    var tempPayForDataLen = tempPayForData.length;
    console.log(req.body)
    for (var i = 0; i < tempPayForDataLen; i++) {
      console.log("insert order success")
      var insertSQL = "";
      var { goodsid, userid, count, size, purchasetime, goodsstatus } = tempPayForData[i]
      console.log(goodsid, userid, count, size, purchasetime, goodsstatus)
      insertSQL = `insert into orders 
      (goodsid,userid,purchasetime,count,size,goodsstatus) 
      values(\'${goodsid}\',\'${userid}\' ,\'${purchasetime}\' ,\'${count}\'  ,\'${size}\',\'${goodsstatus}\')`;
      getInsert(con, insertSQL, [], function (err, insertData) {
        if (err) {
          throw new Error('server error');
        }
        if (insertData.affectedRows === 1 && i == tempPayForDataLen) {
          console.log("insert order success")
          deleteHasPayForInBuyCar(req, res)
        }
      });
    }
  }
  function insertOrdersSQLByShoppingDetail(req, res) {
    var tempPayForData = req.body.tempPayForData;
    var tempPayForDataLen = tempPayForData.length;
    // console.log(req.body)
    for (var i = 0; i < tempPayForDataLen; i++) {
      console.log("insert order success")
      var insertSQL = "";
      var { goodsid, userid, count, size, purchasetime, goodsstatus } = tempPayForData[i]
      console.log(goodsid, userid, count, size, purchasetime, goodsstatus)
      insertSQL = `insert into orders 
      (goodsid,userid,purchasetime,count,size,goodsstatus) 
      values(\'${goodsid}\',\'${userid}\' ,\'${purchasetime}\' ,\'${count}\'  ,\'${size}\',\'${goodsstatus}\')`;
      getInsert(con, insertSQL, [], function (err, insertData) {
        if (err) {
          throw new Error('server error');
        }
        if (insertData.affectedRows === 1 && i == tempPayForDataLen) {
          updateGoodsAndGoodsDetail(req, res);
          // res.json({
          //   type: "success",
          //   status: "200"
          // });
        }
      });
    }
  }
  function deleteHasPayForInBuyCar(req, res) {
    var deleteSQL = "";
    var tempPayForData = req.body.tempPayForData;;
    var tempPayForDataLen = tempPayForData.length;
    for (var i = 0; i < tempPayForDataLen; i++) {
      var { goodsid, userid, count, size } = tempPayForData[i]
      deleteSQL = ` delete from buycar where 
        goodsid = \'${goodsid}\' and 
        userid = \'${userid}\' and 
        buycount = \'${count}\' and 
        buysize = \'${size}\'`
      getDelete(con, deleteSQL, [], function (err, deleteData) {
        if (err) {
          throw new Error("server error");
        }
        console.log("i:"+i);
        if (deleteData.affectedRows === 1 && i == tempPayForDataLen) {
          updateGoodsAndGoodsDetail(req, res);
          // res.json({
          //   type: "success",
          //   status: "200"
          // });
        }
      })
    }
  }
  function updateGoodsAndGoodsDetail(req, res) {
    var tempPayForData = req.body.tempPayForData;
    var tempPayForDataLen = tempPayForData.length;
    for (var i = 0; i < tempPayForDataLen; i++) {
    // var i=0;
    // tempPayForData.forEach(item => {
     (function(index){
      //  console.log(tempPayForData[index])
      var { goodsid, userid, count, size } =tempPayForData[index]
      var updateSQL = `
        UPDATE goods,goodsdetail 
        SET 
          goods.goodscount = goods.goodscount - ${count},
          goodsdetail.goodssizenum = goodsdetail.goodssizenum -${count}
        WHERE goods.goodsid = goodsdetail.goodsid 
        AND   goods.goodsid = '${goodsid}' 
        AND	goodsdetail.size = ${size}
        `;
        // console.log(index)
      getUpdate(con, updateSQL, [], function (err, data) {
        if (err) {
          throw new Error("server error");
        }
          if (data.affectedRows > 1 && index == tempPayForDataLen-1) {
            if(!payForFlag){
              payForFlag = true;
              res.json({
                type: "success",
                status: "200"
              });
            }
         
        }
      })
     }(i))
    }
  }

  router.post(Url.cancelPayFor, function (req, res) {
    var payGoodsList = req.body;
    var payGoodsNum = 0;
    payGoodsList.forEach(item => {
      var { userid, goodsid, count, size, purchasetime, goodsstatus } = item;
      console.log(item);
      var selectSQL = `
          select orderid from orders
            where userid = '${userid}' and 
            goodsid = '${goodsid}' and 
            size = ${size} and 
            goodsstatus = ${goodsstatus}
          `
      var deleteSQL = ` 
          delete from buycar 
          where goodsid = \'${goodsid}\' and
           userid = \'${userid}\' and 
           buycount = \'${count}\' and 
           buysize = \'${size}\'`



      getFind(con, selectSQL, function (err, data) {
        if (err) {
          throw new Error("server error");
        }
        if (data.length > 0) {
          var updateSQL = `update orders set count = count + ${count}
            where orderid = '${data[0].orderid}'
          `;

          getUpdate(con, updateSQL, [], function (err, data) {
            if (err) {
              throw new Error("server error");
            }
            if (data.affectedRows === 1) {
              getDelete(con, deleteSQL, [], function (err, deleteData) {
                if (err) {
                  throw new Error("server error");
                }
                payGoodsNum++;
                if (deleteData.affectedRows === 1 && payGoodsNum === payGoodsList.length) {
                  // console.log(payGoodsNum)
                  res.json({
                    type: "cancelSuccess",
                    status: "200"
                  });
                } else if (deleteData.affectedRows != 1 && payGoodsNum === payGoodsList.length) {
                  // console.log(payGoodsNum)
                  res.json({
                    type: "fail",
                    status: "404"
                  })
                }
              })
            }

          });


        } else {
          //insert
          var insertSQL = `
            insert into orders(goodsid,userid,purchasetime,count,size,goodsstatus) value(
              '${goodsid}','${userid}','${purchasetime}','${count}','${size}','${goodsstatus}'
            )`;
          getInsert(con, insertSQL, [], function (err, data) {

            if (err) {
              throw new Error("server error");
            }

            if (data.affectedRows === 1) {
              getDelete(con, deleteSQL, [], function (err, deleteData) {
                if (err) {
                  throw new Error("server error");
                }
                payGoodsNum++;
                if (deleteData.affectedRows === 1 && payGoodsNum === payGoodsList.length) {
                  // console.log(payGoodsNum)
                  res.json({
                    type: "cancelSuccess",
                    status: "200"
                  });
                } else if (deleteData.affectedRows != 1 && payGoodsNum === payGoodsList.length) {
                  // console.log(payGoodsNum)
                  res.json({
                    type: "fail",
                    status: "404"
                  })
                }
              })
            }
          });


        }
      })


    });
  });
  router.get(Url.updateDefaultAddress, function (req, res) {
    var { addressid } = req.query;
    console.log(addressid);
    var updateSQLAll = `UPDATE	user_address SET isdefault = 0 `;
    getUpdate(con, updateSQLAll, [], function (err, updateRes) {
      if (err) {
        throw new Error("server error");
      }
      // console.log("**************");
      // console.log(updateRes.affectedRows)
      if (updateRes.affectedRows === 1) {
      }
    });

    var updateSQL = ` update user_address set isdefault=1 where addressid=\'${addressid}\'`;
    getUpdate(con, updateSQL, [], function (err, updateRes) {
      if (err) {
        throw new Error("server error");
      }
      // console.log(updateRes.affectedRows);
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
    if (goodsstatus === "99") {
      selectSQL = `
      SELECT * FROM  goods , orders WHERE orders.goodsid = goods.goodsid AND 
      orders.userid = (SELECT user.userid FROM USER WHERE username = \'${username}\') 
            `
    }

    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      // console.log(data)
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
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
      handleImageURL(data, baseURL);
      res.json(data);

    });
  })
  router.get(Url.insertVisited, function (req, res) {
    var { userid, goodsid } = req.query;
    var visitedTime = formatDate();
    var insertSQL = `insert into visited values('${goodsid}','${userid}','${visitedTime}')`;
    getInsert(con, insertSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      if (data.affectedRows === 1) {
        console.log("---------insert success---------")
        res.json({
          type: "insertSuccess",
          status: "200"
        });
      } else {
        res.json({
          type: "fail",
          status: "400"
        })
      }
    });
  });
  router.get(Url.applyBackMoney, function (req, res) {
    var { userid, goodsid, size, goodsstatus,count } = req.query;
    var deleteSQL = `delete from orders 
    where 
    userid= \'${userid}\' and goodsid = \'${goodsid}\' 
    and size = \'${parseFloat(size)}\' 
    and goodsstatus = \'${goodsstatus}\'`;
    getDelete(con, deleteSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
     
      if (data.affectedRows >= 1) {
        var updateSQL = `
          UPDATE goods,goodsdetail 
          SET 
            goods.goodscount = goods.goodscount + ${count},
            goodsdetail.goodssizenum = goodsdetail.goodssizenum + ${count}
          WHERE goods.goodsid = goodsdetail.goodsid 
          AND   goods.goodsid = '${goodsid}' 
          AND	goodsdetail.size = ${size}
        `;
       getUpdate(con,updateSQL,[],function(err,updateData){
         SQLErrorInfo(err);
         if(updateData.affectedRows >= 1){
            res.json({
              type: "success", status: "200"
            });
         }else{
          res.json({
            type: "not exit",
            status: "200"
          });
         }
       })
       
      } else {
        res.json({
          type: "not exit",
          status: "200"
        });
      }
    });

  });
  router.get(Url.signIn, function (req, res) {
    console.log(req.query)
    var { userid } = req.query;
    var selectSQL = `select userid,integral ,MAX(signindate) AS lastSignindate 
      from signin where userid = '${userid}'`
    /**
     * SELECT userid,integral ,MAX(signindate) AS lastSignindate FROM signin
       WHERE userid = '19'
     */
    getFind(con, selectSQL, function (err, findData) {
      if (err) {
        throw new Error("server error");
      }
      if (findData.length === 1) {
        // var currentTime = formatDate();

        if (findData[0].lastSignindate) {
          /*-------------------------------处理上次签到的时间和当前签到的时间之差是------------*/
          var currentTime = new Date();
          var LastTime = findData[0].lastSignindate; //当前用户最后一次签到
          var diffTime = currentTime.getTime() - LastTime.getTime();
          var diffDay = diffTime / (24 * 3600 * 1000); //上次签到的时间和本次签到的时间之差
          if (diffDay < 1) {
            res.json({
              type: "has signed in",
              status: "200"
            })
            return;
          }
          /*---------------------------------------------------------------------------- */
        }
        // return ;
        // var formatCurrentDate = new Date(Date.parse(currentTime)).toLocaleString().split(" ")[0];
        // console.log(formatCurrentDate);
        // var formatLastDate = LastTime.toLocaleString().split(" ")[0];

        /**
         * 上次签到的时间和当前签到的时间是否大于1天，
         * 如果大于1天 允许再次签到，否则不允许签到
         */
        // var updateSQL = `update  signin set integral=integral+1 , signindate=\'${formatDate()}\' where userid = \'${userid}\'`;
        var insertSQL = `
          insert into signin(userid,signindate,integral,pattern)
            value(${userid},'${formatDate()}',5,'签到')
        `;
        getInsert(con, insertSQL, [], function (err, inserData) {
          if (err) {
            throw new Error("server error");
          }
          if (inserData.affectedRows === 1) {
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
        });
      }
    })
  });
  router.get(Url.getDiffOrderStatusNum, function (req, res) {
    var { userid } = req.query;
    var selectSQL = `
      SELECT orderid,goodsid,goodsstatus,COUNT(goodsstatus) as goodsstatusNum FROM orders
      WHERE userid = '${userid}'
      GROUP BY goodsstatus
    `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      res.json(data);
    });
  });
  router.post(Url.isExistCoupon, function (req, res) {
    var { userid, goodsid } = req.body;
    var selectSQL = `
        select * from coupon 
          where userid = '${userid}' and
                goodsid = '${goodsid}'
    `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      if (data.length !== 0) {
        res.json({
          result: true,
          couponList: data
        });
      } else {
        res.json({
          result: false,
        })
      }
    })

  });
  router.post(Url.getCoupon, function (req, res) {
    var { userid, goodsid } = req.body;
    var updateSQL = `
      update coupon set couponstatus = 1
      where  userid = '${userid}' and goodsid = '${goodsid}'
    `
    getUpdate(con, updateSQL, [], function (err, data) {
      if (err) {
        throw new Error("serve error");
      }
      console.log(data.affectedRows);
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
  router.get(Url.useCoupon, function (req, res) {

    var { couponid } = req.query;
    console.log(couponid)
    var updateSQL = `
      update coupon set couponstatus = 2
        where  couponid = '${couponid}'
    ` ;
    getUpdate(con, updateSQL, [], function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      if (data.affectedRows === 1) {
        res.json({
          type: "success",
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
  router.get(Url.getConponList, function (req, res) {
    var { userid } = req.query;
    var selectSQL = `
      SELECT * FROM coupon , goods 
      WHERE coupon.goodsid = goods.goodsid
      AND userid = '${userid}'
    `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      handleImageURL(data, baseURL)
      res.json(data);
    })
  });
  router.get(Url.getSigninDetail, function (req, res) {
    var { userid } = req.query;
    var selectSQL = `
    SELECT * ,
      (SELECT SUM(integral) 
      FROM signin  
      WHERE userid = '${userid}') 
      AS integralTotal 
    FROM signin  
	  WHERE userid = '${userid}';
    
    
    `
    getFind(con, selectSQL, function (err, data) {
      if (err) {
        throw new Error("server error");
      }
      res.json(data);
    });

  });



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


};


