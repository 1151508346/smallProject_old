// pages/register/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    username_input:"",
    email_input:"",
    clearButtonStatus:false, //判断用户名中有没有值，有值显示清除按钮，反之隐藏按钮
    clearButtonStatus2:false //判断email中有没有值，有值显示清除按钮，反之隐藏按钮
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
  },


  handleUserNameInputValue(e){
  
    this.setData({
      username_input:e.detail.value
    })
    if (e.detail.value !=""){
      this.setData({
        clearButtonStatus: true
      })
    }else{
      this.setData({
        clearButtonStatus: false
      })
    }
    
  },

  handleEmailInputValue(e) {

    this.setData({
      email_input: e.detail.value
    })
    if (e.detail.value != "") {
      this.setData({
        clearButtonStatus2: true
      })
    } else {
      this.setData({
        clearButtonStatus2: false
      })
    }

  },


  // handleUserNameBlurValue(e) {
  //   var that = this
  //  setTimeout(function(){
  //    that.setData({
  //      clearButtonStatus: false
  //    },100)
  //  })
  // },
  handleInputUsernameClearValue(){
      this.setData({
        username_input: "",
        clearButtonStatus:false
      })
  },
  handleInputEmailClearValue() {
    this.setData({
      email_input: "",
      clearButtonStatus2: false
    })
  }



})