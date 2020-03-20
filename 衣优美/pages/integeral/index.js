// pages/integeral/index.js
var  Domain = require("../../tools/domain");
var { getRequest, postRequest } = require("../../tools/request.js");
var  getNativeUserId  = require("../../tools/getNativeUserId.js");
var { forMatDate } = require("../../tools/common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    signinList:[],
    integralTotal:0

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    var _that = this;
    getNativeUserId(function(res){
      if(res.data){
        var url = Domain + "getSigninDetail?userid="+res.data;
        getRequest(url,function(res){
          if(res.data){
              // console.log(res.data)
             var signinList = res.data.map(item=>{
                item.signindate = forMatDate(new Date(item.signindate));
                return item ;
              })
              console.log(signinList[0].integralTotal);
              _that.setData({
                signinList:signinList,
                integralTotal:signinList[0].integralTotal
              });
          }
        })
      }else{
        wx.showToast({
          title: '您还没有登录呢',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    })
   

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
});