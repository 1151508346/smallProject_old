// pages/coupon/index.js
var getNativeUserId = require("../../tools/getNativeUserId.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var { forMatDate } = require("../../tools/common.js");
var Domain = require("../../tools/domain");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_goods_Info: [],
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = '';
    var _that = this;
    if (options.userid && options.hasOwnProperty("userid")) {
      url = Domain + "getConponList?userid=" + options.userid;
      getRequest(url, function (res) {
        if (res.data) {
          console.log(res.data);
          res.data.map(item => {

            item.starttime = forMatDate(new Date(item.starttime));
            item.endtime = forMatDate(new Date(item.endtime));
            console.log(item.endtime)
            return item;
          })

          _that.setData({
            coupon_goods_Info: res.data
          })
        }
      })
    }
  },
  getCoupon(e) {
    var _that = this;
    var { couponstatus,userid,goodsid,couponid } = e.currentTarget.dataset;
    // console.log(userid,goodsid,couponid)
    switch (couponstatus) {
      case 0:
        /**
      * 发送请求领取优惠券
      */
        this.sentRequestToGetCoupon(userid,goodsid,couponid);
        break;
      case 1:
        /**
         * 使用优惠券
         */
        this.setRequestToUseCoupon(goodsid);
        break;
      case 2:
        /**
         * 优惠券已经使用了
         */
        this.handleHadUseCouponHint();
        break;
      case 3:
        /**
         * 优惠券过期了
         */
        break;
    }

  },
  sentRequestToGetCoupon(userid,goodsid,couponid) {
    var _that = this;
    var url = Domain + "getCoupon";
    var sendInfo = {
      userid: userid,
      goodsid: goodsid
    }
    postRequest(url, sendInfo, function (res) {
      if (res.data) {
          // console.log(res.data);
        if (res.data.result === "success") {
          // _that.setData({
          //   couponHint: "已领取"
          // })
          var temp_CGI = JSON.parse(JSON.stringify(_that.data.coupon_goods_Info));
          temp_CGI = temp_CGI.map(item=>{
            if(item.couponid == couponid){
              item.couponstatus = 1;
            }
            return item;
          });
          _that.setData({
            coupon_goods_Info:temp_CGI
          });
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          });
        }

      }
    })
  },
  setRequestToUseCoupon(goodsid){
    wx.navigateTo({
      url: '/pages/shoppingDetail/index?goodsid='+goodsid,
    });
  },
  handleHadUseCouponHint(){
    wx.showToast({
      title: '对不起，您已使用该优惠券',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: false,
    });
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})