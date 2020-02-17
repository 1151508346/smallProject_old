var getNativeUserId = require("../../tools/getNativeUserId.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var { forMatDate, handleAuditLog } = require("../../tools/common");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    loginStatus: false,
    waitPay: 0, // 待支付
    waitReceive: 0, //待收货（已经支付）
    waitEvaluate: 0, //待评价 （已经收货）
    orderAllCount: 0,
    hasEvaluate: 0,
    userid: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady() {
    console.log("onready");
  },
  onShow() {
    var _that = this;
    this.setData({
      waitPay: 0,
      waitReceive: 0,
      waitEvaluate: 0,
      orderAllCount: 0,
      hasEvaluate: 0
    });
    wx.getStorage({
      key: 'username', //检验本地缓存中有没有username用户信息，有则说明处于登录状态，反之为登录状态
      success: (result) => {
        console.log(result.data)
        _that.setData({
          username: result.data,
          loginStatus: true
        })
      },
      fail: (res) => {
      },
      complete: () => { }
    });
    getNativeUserId(function (res) {

      if (!res.data) {
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      _that.setData({
        userid: res.data
      })
      // wx.navigateTo({
      //   url: "/pages/collectGoods/index?userid=" + res.data
      // })
      //获取不同订单状态的数量
      var url = Domain + "getDiffOrderStatusNum?userid=" + res.data;
      getRequest(url, function (res) {
        if (res.data) {
          console.log(res.data);

          res.data.forEach(item => {
            _that.setData({
              orderAllCount: _that.data.orderAllCount + item.goodsstatusNum
            })
            switch (item.goodsstatus) {
              case 0:
                _that.setData({
                  waitPay: item.goodsstatusNum
                })
                break;
              case 1:
                _that.setData({
                  waitReceive: item.goodsstatusNum
                })
                break;
              case 2:
                _that.setData({
                  waitEvaluate: item.goodsstatusNum
                })
                break;
              case 3:
                _that.setData({
                  hasEvaluate: item.goodsstatusNum
                })
            }
          })
        } else {
          // console.log("server error")
        }
      })
    })
  },
  onLoad: function (options) {
    console.log("onload")


  },
  handelNavigatorToLoginPage() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  userExitLogin() {
    var _that = this;
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }

      //  console.log(_that.data.username)
      wx.removeStorage({
        key: "username",
        success: (result) => {
          console.log("exit")
          _that.setData({
            loginStatus: false,
            username: ""
          })
        },
        fail: () => { },
        complete: () => { }
      });
      wx.removeStorage({
        key: "userid",
        success: (result) => {
          console.log("exit")
          _that.setData({
            loginStatus: false,
            userid: ""
          })
        },
        fail: () => { },
        complete: () => { }
      });
      wx.showToast({
        title: '退出登录',
        icon: 'success',
        duration: 1500,
        mask: false,
      });
      handleAuditLog(res.data,"退出登录");
      // wx.getStorage({
      //   key: "username",
      //   success(res) {
      //     // console.log(res.data)
      //     // console.log(res.data == _that.data.username)
      //     // if (res.data == _that.data.username) {
      //       wx.removeStorage({
      //         key: "username",
      //         success: (result) => {
      //           console.log("exit")
      //           _that.setData({
      //             loginStatus: false
      //           })
      //         },
      //         fail: () => { },
      //         complete: () => { }
      //       });
      //     // }
      //   }, fail() {
      //     // console.log("失败鸟");
      //     wx.showToast({
      //       title: '您还未登录',
      //       icon: 'none',
      //       image: '',
      //       duration: 1500,
      //       mask: false,
      //       success: (result) => {
      //       },
      //       fail: () => { },
      //       complete: () => { }
      //     });
      //   }
      // })

    })

  },
  navigateToOrderListPage(e) {
    var goodsStatus = e.currentTarget.dataset.goodsstatus;
    wx.navigateTo({
      url: '/pages/order/index?goodsStatus=' + goodsStatus,
    })
  },
  navigateToCollectPage() {
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      wx.navigateTo({
        url: "/pages/collectGoods/index?userid=" + res.data
      })
    })

  },
  navigateToVisitedPage() {
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      wx.navigateTo({
        url: "/pages/visited/index?userid=" + res.data
      })
    })
  },
  handleSignIn() {
    getNativeUserId(res => {
      var userid = ""
      if (!res.data) {
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      userid = res.data;
      var url = Domain + "signIn?userid=" + res.data;
      
      getRequest(url, function (res) {
        if (res.data) {
          console.log(res.data);
          if (res.data.type === "success" && res.data.status === "200") {
            console.log("------------------------------------")
            console.log(userid)
            handleAuditLog(userid,"今日签到");
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            });
          }
          if (res.data.type === "has signed in" && res.data.status === "200") {
            wx.showToast({
              title: '今天，您已签到',
              icon: 'none',
              duration: 1500,
              mask: false,
            });
          }
        }
      })
    });
  },
  navigateToCouponPage() {
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: '您还没有登录呢',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        return;
      }
      wx.navigateTo({
        url: '/pages/coupon/index?userid=' + res.data,
      });
    });
  },
  //点击积分按钮，跳转到积分详情页面
  navigateToIntegralPage() {
    if (this.data.userid != "") {
      // var url  = Domain +"getSigninDetail?userid=" + this.data.userid
      // getRequest(url,function(res){
      //   if(res.data){
      //     console.log(res.data);
      //   }
      // })
      wx.navigateTo({
        url: '/pages/integeral/index',
      });
    } else {
      wx.showToast({
        title: '您还没有登录呢',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
  }
})