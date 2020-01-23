// pages/payfor/index.js
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payforMoney: 0,
    isCancelPay: true,
    useCoupon: false,
    couponid: "",
  },
  onLoad(options) {
    console.log(options);
    if (options.hasOwnProperty("couponid")) {
      this.setData({
        useCoupon: true,
        couponid: options.couponid
      });
    }
    this.setData({
      payforMoney: options.payforMoney
    })
    // console.log(options.payforMoney)

  },
  onHide() {
  },
  onUnload() {
    if (this.data.isCancelPay) {
      app.globalData.path = "/pages/payfor/index";
    }
  },


  handleNowPayFor() {
    var _that = this;
    if (app.globalData.payForObjList.length !== 0) {
      // console.log(app.globalData.payForObjList);
      var tempPayForData = app.globalData.payForObjList.map(function (item) {
        //  console.log(item);
        var tempObj = {};
        tempObj.goodsid = item.goodsid;
        tempObj.userid = item.userid;
        tempObj.count = item.buycount;
        tempObj.size = item.buysize;
        tempObj.purchasetime = _that.forMatDate();
        tempObj.goodsstatus = 1;
        return tempObj;
      });
      //  console.log(tempPayForData)
      var url = Domain + "payForToOrder";
      // console.log(tempPayForData)
      postRequest(url, {tempPayForData,notDelete:true}, function (res) {
        console.log(res)
        if (res.data.type === "success" && res.data.status === '200') {
          _that.setData({
            isCancelPay: false
          })
          if (_that.data.useCoupon || _that.data.couponid != "") {
            _that.handleUseCoupon();
          } else {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            });
          }

        } else {
          console.log("支付失败2")
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
      })
      /**
       * 发送请求更新数据order中的数据
       * 删除购物车中的数据
       */

    } else {
      console.log("支付失败1")
      wx.showToast({
        title: '支付失败',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  },
  forMatDate() {
    var tempDate = new Date();
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var date = tempDate.getDate();
    var hour = tempDate.getHours();
    var minutes = tempDate.getMinutes();
    var seconds = tempDate.getSeconds();

    if (month < 10) {
      return year + "-0" + month + "-" + date + " " + hour + ":" + minutes + ":0" + seconds;
    }
    if (date < 10) {
      return year + "-" + month + "-0" + date + " " + hour + ":" + minutes + ":0" + seconds;
    }
    if (hour < 10) {
      return year + "-" + month + "-" + date + " 0" + hour + ":" + minutes + ":0" + seconds;
    }
    if (minutes < 10) {
      return year + "-" + month + "-" + date + " " + hour + ":0" + minutes + ":0" + seconds;
    }
    if (seconds < 10) {
      return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":0" + seconds;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
  },
  handleUseCoupon() {
    var _that = this;
    console.log(_that.data)
    var useCouponUrl = Domain + "useCoupon?couponid=" + _that.data.couponid;
    getRequest(useCouponUrl, function (res) {
      console.log(res)
      if (res.data.type === "success" && res.data.status === "200") {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
      } else {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    });
  }
})