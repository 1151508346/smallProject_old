// pages/payfor/index.js
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var { forMatDate, handleAuditLog } = require("../../tools/common");
var  getNativeUserId  = require("../../tools/getNativeUserId");
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
    fromURL:"", //判断是从哪个页面跳转到支付页面的
  },
  onLoad(options) {
    console.log(options);
    if (options.hasOwnProperty("couponid")) {
      this.setData({
        useCoupon: true,
        couponid: options.couponid
      });
    }
    if(options.hasOwnProperty('fromURL') && options.fromURL == "car"){
      //表示从购物车页面跳转过来的
      this.setData({
        fromURL:"car"
      })
    } else if(options.hasOwnProperty('fromURL') && options.fromURL == "shoppingDetail"){
      //表示从购物车页面跳转过来的
      this.setData({
        fromURL:"shoppingDetail"
      })
    }else if(options.hasOwnProperty('fromURL') && options.fromURL == "order"){
      //表示从购物车页面跳转过来的
      this.setData({
        fromURL:"order"
      })
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
      getNativeUserId(res=>{
        if(res.data){
          handleAuditLog(res.data,"取消支付")
        }
      });
    }
  },


  handleNowPayFor() {
    var _that = this;
    console.log(app.globalData.payForObjList)
    if (app.globalData.payForObjList.length !== 0) {
      // console.log(app.globalData.payForObjList);
      var tempPayForData = app.globalData.payForObjList.map(function (item) {
        var tempObj = {};
        //  console.log(item);
        if(item.orderid){
          tempObj.orderid = item.orderid;
        }
        tempObj.goodsid = item.goodsid;
        tempObj.userid = item.userid;
        tempObj.count = item.buycount;
        tempObj.size = item.buysize;
        tempObj.purchasetime = _that.forMatDate();
        tempObj.goodsstatus = 1;
        return tempObj;
      });
       console.log(tempPayForData)
      var url = Domain + "payForToOrder";
      // console.log(tempPayForData)
      var sendPayForData = {};
      switch(this.data.fromURL){
        case "car":
          sendPayForData = {tempPayForData,fromURL:"car"}
          break;
        case "shoppingDetail":
          sendPayForData = {tempPayForData,fromURL:"shoppingDetail"}
          break;
        case "order":
          sendPayForData ={tempPayForData,fromURL:"order"};
          break;
        
      }
        //  如何支付是从购物车跳转过来的就要删除掉保存在购物车中的商品内容
        // 如果支付是从shoppingDetail跳转过来的，就不用删除掉购物车中的内容，因为购物车中没有添加该内容
        // sendPayForData = {tempPayForData,notDelete:true}
      postRequest(url,sendPayForData, function (res) {
        console.log(res)
        if (res.data.type === "success" && res.data.status === '200') {
          _that.setData({
            isCancelPay: false
          })
          console.log(_that.data.useCoupon || _that.data.couponid != "")
          if (_that.data.useCoupon || _that.data.couponid != "") {
            _that.handleUseCoupon();
          } else {
             wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            });
            setTimeout(()=>{
              getNativeUserId(res=>{
                if(res.data){
                  console.log(res.data)
                  handleAuditLog(res.data,"原价支付成功");
                }
              });
              wx.switchTab({
                url: '/pages/ownCenter/index'
              });
            },1500)
          }

        } else {
       
          setTimeout(()=>{
            getNativeUserId(res=>{
              if(res.data){
                handleAuditLog(res.data,"原价支付失败")
              }
            })
          },1500);
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
        console.log("aaaaaaaaaaaaaaaaaaaaaa")
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
          mask: false,
        });
        getNativeUserId(res=>{
          if(res.data){
            handleAuditLog(res.data,"使用优惠卷支付成功")
          }
        })
        
      } else {
        getNativeUserId(res=>{
          if(res.data){
            handleAuditLog(res.data,"使用优惠卷支付失败");
          }
        })
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