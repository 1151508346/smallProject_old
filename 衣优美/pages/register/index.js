// pages/register/index.js
var { checkUserName , checkPassword,isEmpty,checkEmail,checkTelphone}= require("../../tools/check.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    username_input:"",
    email_input:"",
    password_input:"",
    password2_input:"",
    telphone_input:"",
    clearButtonStatus:false, //判断用户名中有没有值，有值显示清除按钮，反之隐藏按钮
    clearButtonStatus2:false, //判断email中有没有值，有值显示清除按钮，反之隐藏按钮
    // clearButtonStatus3:false //判断telphone中有没有值，有值显示清除按钮，反之隐藏按钮
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
    // if (e.detail.value != "") {
    //   this.setData({
    //     clearButtonStatus2: true
    //   })
    // } else {
    //   this.setData({
    //     clearButtonStatus2: false
    //   })
    // }

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
  // handleTelphoneInputValue(e){
  //   this.setData({
  //     telphone_input: e.detail.value
  //   })
  //   if (e.detail.value != "") {
  //     this.setData({
  //       clearButtonStatus3: true
  //     })
  //   } else {
  //     this.setData({
  //       clearButtonStatus3: false
  //     })
  //   }
  // },
  handlePasswordInputValue2(e) {
    this.setData({
      password2_input: e.detail.value
    })
    // if (e.detail.value != "") {
    //   this.setData({
    //     clearButtonStatus2: true
    //   })
    // } else {
    //   this.setData({
    //     clearButtonStatus2: false
    //   })
    // }

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
  },
  // handleInputTelphoneClearValue(){
  //   this.setData({
  //     telphone_input: "",
  //     clearButtonStatus3: false
  //   })
  // },
  
  handleRegisterFunc(){
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
    if(!isEmpty(this.data.password2_input)){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
      return false;
    }
    if(!isEmpty(this.data.email_input)){
      wx.showToast({
        title: '邮件不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
      return false;
    }
    // if(!isEmpty(this.data.telphone_input)){
    //   wx.showToast({
    //     title: '手机号不能为空',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: false,
    //      })
    //   return false;
    // }
    if(this.data.password_input !== this.data.password2_input){
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
      return false;
    }

    var userInfo = {
      username:this.data.username_input,
      password:this.data.password_input,
      email:this.data.email_input,
      // telphone:this.data.telphone_input
    }
    
   if( this.userInfoCheck(userInfo)){
    wx.request({
      url: 'http://localhost:3000/frontRegister',
      data: JSON.stringify(userInfo),
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if( res.data.status == "404" && res.data.type == "usernamefail"){
          wx.showToast({
            title: '用户已存在',
            icon: 'none',
            duration: 1500,
            mask: false,
             })
             return ;
        }
        if( res.data.status == "404" && res.data.type == "emailfail"){
          wx.showToast({
            title: '邮箱已存在',
            icon: 'none',
            duration: 1500,
            mask: false,
             })
             return ;
        }
        if( res.data.status == "200" && res.data.type == "success"){
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500,
            mask: false,
             });
             //登陆成功后跳转
                // wx.navigateTo({
                //   url: 'test?id=1',
                //   events: {
                //     // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                //     acceptDataFromOpenedPage: function(data) {
                //       console.log(data)
                //     },
                //     someEvent: function(data) {
                //       console.log(data)
                //     }
                  
                //   },
                //   success: function(res) {
                //     // 通过eventChannel向被打开页面传送数据
                //     res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
                //   }
                // })
             return ;
        }
        if( res.data.status == "500" && res.data.type == "updateFail"){
          wx.showToast({
            title: '密码更新失败',
            icon: 'none',
            duration: 1500,
            mask: false,
             })
             return ;
        }
      },
      fail: function(res) {
        console.log(res)
        console.log("-----------");
        if(!res){
          wx.showToast({
            title: '注册失败',
            icon: 'none',
            duration: 1500,
            mask: false,
             })
             return ;
        }
      },
      complete: function(res) {
        // console.log(res)
      },
    });
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
    if(!checkEmail(obj.email) || obj.email.length >20){
      wx.showToast({
        title: '邮箱不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
         return false;
    }
    // if(!checkTelphone(obj.telphone) && obj.telphone.length !== 11){
    //   wx.showToast({
    //     title: '手机号不合法',
    //     icon: 'none',
    //     duration: 1500,
    //     mask: false,
    //      })
    //      return false;
    // }
   
   
    return true;
  }

})