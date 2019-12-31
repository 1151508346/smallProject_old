// pages/login/index.js
var { checkUserName , checkPassword,isEmpty }= require("../../tools/check.js")
var  Domain = require("../../tools/domain")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    username_input:"",
    password_input:"",
    clearButtonStatus:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getSystemInfoSync())
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
  handleLoginFunc(){
    if(!isEmpty(this.data.username_input)){
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
      return false;
    }
    if(!isEmpty(this.data.password_input)){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
      return false;
    }
    var userInfo  = {
      username:this.data.username_input,
      password:this.data.password_input
    }
    if(this.userInfoCheck(userInfo)){
      // wx.showToast({
      //   title: '正在加载',
      //   icon: 'loading',
      //   duration: 1500,
      //   mask: false,
      // })
      //表示用户名和密码校验成功
      console.log(Domain+'frontLogin')
      wx.request({
        url: Domain+'frontLogin',
        data: JSON.stringify(userInfo),
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json"
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.data.status == "404" && res.data.type == "fail"){
            wx.showToast({
              title: '用户名或密码出错',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return ;
          }
          if( res.data.status == "500" && res.data.type == "fail"){
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return ;
          }
          if(res.data.status == 200 && res.data.type == "success"){
            console.log(res.data)
            // console.log(res);
            //将用户登录的信息保存在本地缓存中
            wx.setStorage({
              key:"username",
              data:res.data.username
            });
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            });
            wx.setStorage({
              key:"userid",
              data:res.data.userid
            });
            
          }
        },
        fail: function(res) {
          if(!res){
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 500,
              mask: false,
               })
               return ;
          }
        },
        complete: function(res) {
          // console.log(res)
        },
      })
    }
  },
  userInfoCheck(obj){
    //验证用户名时候合法
    if(!checkUserName(obj.username) && (obj.username.length<8 || obj.username.length >20)){
      wx.showToast({
        title: '用户名不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
        })
        return false;
    }
    //验证密码是否合法
    if(!checkPassword(obj.password) && (obj.password.length<8 || obj.password.length >20)){
      wx.showToast({
        title: '密码不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
        })
        return false;
    }
    return true;
  },
  handleUserNameInputValue(e){
    this.setData({
      username_input:e.detail.value
    });
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
  handlePasswordInputValue(e) {
    this.setData({
      password_input: e.detail.value
    })
    
  },
 
  handleInputUsernameClearValue(){
    this.setData({
      username_input: "",
      clearButtonStatus:false
    })
  },
 
 

})