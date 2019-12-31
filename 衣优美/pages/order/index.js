// pages/order/index.js
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var getNativeUsername = require("../../tools/getNativeUsername");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImage: "/static/init.jpg",
    pendingPaymentList: [],
    defaultOrderItem: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsStatus = options.goodsStatus;
    // console.log(options)
    this.getOrderList(goodsStatus)
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
        console.log(res)
        if (res.data.status === '200' && res.data.type === "success") {
          var tempPaymentList = JSON.parse(JSON.stringify(_that.data.pendingPaymentList));
          var tempResult = tempPaymentList.filter((item, index) => {
            return !(item.goodsid === goodsid && item.goodsid === goodsid && item.goodsid === goodsid && item.size === size)
          })
          _that.setData({
            pendingPaymentList: tempResult
          });

        }
      }
    })



  },
  //去支付
  handleGoPayFor(e) {
    console.log("123")
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
            pendingPaymentList: res.data
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


  }
})