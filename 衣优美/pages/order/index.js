// pages/order/index.js
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var getNativeUsername = require("../../tools/getNativeUsername.js");
var getNativeUserId = require("../../tools/getNativeUserId.js");
var { forMatDate, handleAuditLog } = require("../../tools/common");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImage: "/static/init.jpg",
    pendingList: [],
    defaultOrderItem: 0,
    userid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    var goodsStatus = options.goodsStatus;
    // console.log(options)
    this.getOrderList(goodsStatus);
    getNativeUserId(function (res) {
      if (res.data) {
        _that.setData({
          userid: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  //取消订单
  handleCancelOrder(e) {
    var _that = this;
    var { goodsid, size, goodsstatus, userid } = e.currentTarget.dataset;
    var orderInfo = {
      goodsid, size, goodsstatus, userid
    }

    var url = Domain + "cancelOrder";
    postRequest(url, orderInfo, function (res) {
      if (res.data) {
        if (res.data.status === '200' && res.data.type === "success") {
          var tempPaymentList = JSON.parse(JSON.stringify(_that.data.pendingList));
          var tempResult = tempPaymentList.filter((item, index) => {
            return !(item.goodsid === goodsid && item.goodsid === goodsid && item.goodsid === goodsid && item.size === size)
          })
          _that.setData({
            pendingList: tempResult
          });
        }
      }
    })
  },
  //去支付
  handleGoPayFor(e) {
    var { goodsid, price, size, count, orderid } = e.currentTarget.dataset;
    // console.log(e.currentTarget.dataset)
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: "您还未登录",
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      app.globalData.payForObjList = [
        {
          orderid: orderid,
          goodsid: goodsid,
          buycount: count,
          buysize: size,
          userid: res.data
        }
      ];
      // console.log(price)
      wx.navigateTo({
        url: "/pages/payfor/index?payforMoney=" + price + "&fromURL=order",
        success: function () {
          //        console.log('跳转到news页面成功')// success              
        },
        fail: function () {
          //     console.log('跳转到news页面失败')   fail 
        }
      })

    })


  },
  getOrderList(e) {
    var _that = this;
    // var goodsStatus = e.currentTarget.dataset.status;
    if (e.currentTarget) {
      var goodsStatus = e.currentTarget.dataset.status;
    } else {
      var goodsStatus = e;
    }
    this.setData({
      defaultOrderItem: parseInt(goodsStatus)
    });
    getNativeUsername(function (res) {
      if (res.data) {
        var url = Domain + 'getOrderList?username=' + (res.data) + "&goodsstatus=" + goodsStatus;
        getRequest(url, function (res) {
          console.log(res);
          _that.setData({
            pendingList: res.data
          })
        });
      } else {
        wx.showToast({
          title: "您还未登录",
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
    })
  },
  appliyBackMoney(e) {
    var { goodsid, size, goodsstatus,count } = e.currentTarget.dataset
    console.log(count)
    // console.log(size)
    // console.log("=====================================")
    var _that = this;
    getNativeUserId(function (res) {
      if (!res.data) {
        wx.showToast({
          title: "您还未登录",
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      var userid = res.data;
      var url = Domain + "applyBackMoney?userid=" + userid + "&goodsid=" + goodsid + "&size=" + size + "&goodsstatus=" + goodsstatus + "&count=" + count;
      getRequest(url, function (res) {
        console.log(res)
        if (res.data.type === "success" && res.data.status === "200") {
          wx.showToast({
            title: '申请退款成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
          setTimeout(() => {
            handleAuditLog(userid, "申请退款成功");
          }, 1500);

          var tempPendingList = JSON.parse(JSON.stringify(_that.data.pendingList));
          console.log(tempPendingList)
          //  tempPendingList.filter(item=>{
          //   return item.goodsid !== goodsid && item.userid !== userid;
          // });
          for (var i = 0; i < tempPendingList.length; i++) {
            if (tempPendingList[i].goodsid === goodsid && tempPendingList[i].userid === userid && tempPendingList[i].size === size && tempPendingList[i].goodsstatus === goodsstatus) {
              tempPendingList.splice(i, 1);
            }
          }
          _that.setData({
            pendingList: tempPendingList
          });
          console.log(_that.data.pendingList)
        }else{
          wx.showToast({
            title: '申请退款失败',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          setTimeout(()=>{
            handleAuditLog(userid,"申请退款失败");
          },1500);
        }
      });

    });

  },
  navigateToPXDetailPage(e) {
    if (this.data.userid != "") {
      var { goodsid, goodsimage, goodsstatus, goodsname } = e.currentTarget.dataset;
      console.log(goodsstatus)
      wx.navigateTo({
        url: '/pages/pxDetail/index?goodsid=' + goodsid + "&goodsimage=" + goodsimage + "&goodsstatus=" + goodsstatus + "&goodsname=" + goodsname,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      wx.showToast({
        title: '您还没有登录呢',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  }
})