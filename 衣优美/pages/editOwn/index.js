// pages/add_address/index.js
var { checkUserName, checkPassword, isEmpty, checkTelphone, checkZipCode } = require("../../tools/check.js")
var Domain = require("../../tools/domain");
var { getRequest, postRequest } = require("../../tools/request.js");
var getNativeUsername = require("../../tools/getNativeUsername");
var getNativeUserId = require("../../tools/getNativeUserId");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    switchChecked: false,
    index: 0,
    sexIndex:0,
    multiIndex: [0, 0, 0],
    region: ['陕西省', '咸阳市', '礼泉县'],
    sexArray:[ "选择性别","男","女"],
    sex:"",
    customItem: '全部',
    receiver: "",//收货人的姓名
    userPhone: "",
    areaPath: "",
    detailAddress: "",
    username:"",
    userid:null
  },
  onLoad(){
    var _that = this;
    getNativeUserId(res=>{
      if(res.data){
        _that.setData({
          userid:res.data
        })
      _that.getUserInfo(res.data)
      }
    })
    getNativeUsername(res=>{
      if(res.data){
        _that.setData({
          username:res.data
        })
      }
    })
  },
  switchChange(e) {
    console.log(e.detail.value)
    this.setData({
      switchChecked: e.detail.value
    });
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindSexChange(e){
    console.log(e.detail)
    this.setData({
      sexIndex: e.detail.value
    })
  }
  ,
  handleReceivePhoneInput(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  handleDetailAddressInput(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  //保存用户的收货地址
  handleSaveUserInfo(e) {
    if (!this.data.userPhone){
      wx.showToast({
        title: '电话不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (this.data.sexIndex == 0) {
      wx.showToast({
        title: '请选择性别',
        icon: "none",
        duration: 1500,
      })
      return;
    }
    if (!this.data.detailAddress) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (!checkTelphone(this.data.userPhone)) {
          wx.showToast({
            title: '手机号不合法',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return ;
     }
  
   
   if(this.data.sexIndex == 1){
     this.setData({
       sex:"男"
     })
   } else if (this.data.sexIndex == 2){
     this.setData({
       sex:"女"
     })
   }
    console.log(this.data.sexIndex)
   //提交信息

    this.submitEditUserInfo();

  },
  submitEditUserInfo(){
    var _that = this;
    var userInfo = {
      userid:_that.data.userid,
      username:_that.data.username,
      sex:_that.data.sex,
      userPhone:_that.data.userPhone,
      detailAddress:_that.data.detailAddress
    }
    var url = Domain+"editUserInfo"
    postRequest(url, userInfo,function(res){
      if(res.data.type=="success" && res.data.status=='200'){
          wx.showToast({
            title: '用户信息修改成功',
            icon:"success",
            duration:1500
          });
        setTimeout(function(){
          _that.getUserInfo(userInfo.userid);
        },1500)
      }else{
        wx.showToast({
          title: '用户信息修改失败',
          icon:"none",
          duration:1500
        })
      }
    });
  },
  getUserInfo(userid){
    var _that = this;
    var url = Domain + "getUserInfoInEditUserPage"
    postRequest(url,{userid},function(res){
      if(res.data){
        console.log(res.data)
        _that.setData({
          username:res.data[0].username,
          detailAddress:res.data[0].user_address,
          userPhone:res.data[0].telphone
        });
        if(res.data[0].sex == '男'){
          _that.setData({
            sexIndex : 1
          })
        }else if(res.data[0].sex == '女'){
          _that.setData({
            sexIndex: 2
          })
        }else{
          _that.setData({
            sexIndex: 0
          })
        }
      }
    })
  }
 
})