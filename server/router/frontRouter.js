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

    var selectSQL = "select username,password from  user where username = \'" + username + "\'and password=\'" + passwordAES + "\'";
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
          username: username


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
  //用户添加收货地址
  router.post(Url.add_address, function (req, res) {
    /**
     * 1.获取登录的用户名
     * 2.将前端添加的收货地址插入在数据库中
     */
    //
    // res.redirect("/getSession");
    var username = "aa123456"; //登录的用户名
    var createTime = new Date().toLocaleString();
    var { receiver, receivePhone, areaPath, detailAddress, isDefault, zipCode } = req.body;
    var insertSQL = `insert into user_address value(\'${username}\',\'${receiver}\',\'${receivePhone}\',\'${areaPath}\',\'${detailAddress}\',\'${isDefault}\',\'${zipCode}\',\'${createTime}\'  )`;
    getFind(con, insertSQL, function (err, data) {
      if (err) {
        res.json({
          status: "200",
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
    })

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

  // router.post("/test",function(req,res){
  //   console.log(req.body);
  //   console.log(req.headers.authorization)
  //   res.json({
  //     name:"abc",
  //     sex:"male"
  //   })
  // })

}


var goodsid = ["S00001", "S00002", "S00003", "S00004", "S00005"];

var sizenum = [
  {
    size: 170,
    goodsidsizenum: 30
  },
  {
    size: 175,
    goodsidsizenum: 30
  },
  {
    size: 180,
    goodsidsizenum: 40
  },
]
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





