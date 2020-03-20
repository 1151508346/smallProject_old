// pages/forget/index.js
var { checkUserName, checkPassword, isEmpty, checkEmail, checkTelphone } = require("../../tools/check.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    checkEndStatus: true,
    username_input: "",
    email_input: "",
    password_input: "",
    password2_input: "",
    clearButtonStatus: false, //判断用户名中有没有值，有值显示清除按钮，反之隐藏按钮
    clearButtonStatus2: false, //判断email中有没有值，有值显示清除按钮，反之隐藏按钮
  },
  handleEnterFunc() {
    var _that = this;
    var userInfo = {
      username: this.data.username_input,
      email: this.data.email_input
    }
    if (this.userInfoCheck(userInfo)) {
      // console.log("success")
      wx.request({
        url: 'http://localhost:3000/frontForgetCheck',
        data: JSON.stringify(userInfo),
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json"
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.status == "200" && res.data.type == "selectSuccess") {
            console.log("asdfsf")
            //表示该用户名和邮箱存在
            //进行下一步 输入新密码
            _that.setData({
              checkEndStatus: false
            })

          }
          if (res.data.status == "404" && res.data.type == "selectFail") {
            wx.showToast({
              title: '用户信息不存在',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }
          if (res.data.status == "500" && res.data.type == "fail") {
            wx.showToast({
              title: '服务器出错',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }

        },
        fail: function (res) {
          // console.log(res)
          // console.log("-----------");
          if (!res) {
            wx.showToast({
              title: '查询失败',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }
        },
        complete: function (res) {
          // console.log(res)
        },
      });

    }
  },
  userInfoCheck(obj) {
    if (!isEmpty(this.data.username_input)) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    if (!isEmpty(this.data.email_input)) {
      wx.showToast({
        title: '邮件不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    if (!checkUserName(obj.username) && (obj.username.length < 8 || obj.username.length > 20)) {
      wx.showToast({
        title: '用户名不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    if (!checkEmail(obj.email) || obj.email.length > 20) {
      wx.showToast({
        title: '邮箱不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    return true;

  },
  handleSubmitFunc(){
    if(this.passwordCheck()){
      var userInfo = {
        username : this.data.username_input,
        password :this.data.password_input
      }
      console.log("password 校验成功");
      wx.request({
        url: 'http://localhost:3000/frontUpdatePassword',
        data: JSON.stringify(userInfo),
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json"
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.status == "200" && res.data.type == "updateSuccess") {
            wx.showToast({
              title: '密码更改成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            })
              
          }
          
          if (res.data.status == "500" && res.data.type == "fail") {
            wx.showToast({
              title: '服务器出错',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }

        },
        fail: function (res) {
          if (!res) {
            wx.showToast({
              title: '更改失败',
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }
        },
        complete: function (res) {
          // console.log(res)
        },
      });
    }
  },
  passwordCheck(){

    if (!isEmpty(this.data.password_input)) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    if (!isEmpty(this.data.password2_input)) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      return false;
    }
    if(this.data.password2_input !== this.data.password_input){
      wx.showToast({
        title: '两次密码输入不相同',
        icon: 'none',
        duration: 1500,
        mask: false,
      })
      this.setData({
          password_input:"",
          password2_input:""
        }
      )
      return false;
    }
    return true;
  },










  handleUserNameInputValue(e) {
    this.setData({
      username_input: e.detail.value
    });
    if (e.detail.value != "") {
      this.setData({
        clearButtonStatus: true
      })
    } else {
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

  },


  handleInputUsernameClearValue() {
    this.setData({
      username_input: "",
      clearButtonStatus: false
    })
  },
  handleInputEmailClearValue() {
    this.setData({
      email_input: "",
      clearButtonStatus2: false
    })
  }

})