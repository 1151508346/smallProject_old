// pages/add_address/index.js
var { checkUserName , checkPassword,isEmpty,checkTelphone,checkZipCode }= require("../../tools/check.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    switchChecked:false,
    index: 0,
    multiIndex: [0, 0, 0],
    region: ['陕西省', '咸阳市', '礼泉县'],
    customItem: '全部',
    receiver:"" ,//收货人的姓名
    receivePhone:"",
    areaPath:"",
    detailAddress:"",
    zipCode:""
  },
  switchChange(e){
    this.setData({
      switchChecked:e.detail.value
    });
  },
 
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  handleReceiverInput(e){
    console.log(e)
      this.setData({
        receiver:e.detail.value
      });
  },
  handleReceiverPhoneInput(e){
      this.setData({
        receivePhone:this.detail.value
      })
  },
  handleDetailAddressInput(e){
    this.setData({
      detailAddress:this.detail.value
    })
  },
  handleZipCodeInput(e){
    this.setData({
      zipCode:this.detail.value
    })
  },


  //保存用户的收货地址
  handleSaveUserInfo(e){
    var regionStr = this.data.region.join(",");
    console.log(regionStr)
    var userReceiveInfo = {
      receiver:this.data.receiver,
      receivePhone:this.data.receivePhone,
      areaPath:regionStr,
      detailAddress:this.data.detailAddress,
      zipCode:this.data.zipCode,
      isDefault:this.data.switchChecked
    }
    if(!checkTelphone(userReceiveInfo.receivePhone)){
      wx.showToast({
        title: '手机号不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
         });
         return false;
    }
    // 校验邮编的合法性
    if(!checkZipCode(userReceiveInfo.zipCode)){
      wx.showToast({
        title: '邮编不合法',
        icon: 'none',
        duration: 1500,
        mask: false,
         })
    }
    // 将接受者的信息发送到后台
    


  }
})