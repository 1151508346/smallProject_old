// pages/add_address/index.js
var { checkUserName, checkPassword, isEmpty, checkTelphone, checkZipCode } = require("../../tools/check.js")
var Domain = require("../../tools/domain");
var getNativeUsername = require("../../tools/getNativeUsername");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    switchChecked: false,
    index: 0,
    multiIndex: [0, 0, 0],
    region: ['陕西省', '咸阳市', '礼泉县'],
    customItem: '全部',
    receiver: "",//收货人的姓名
    receivePhone: "",
    areaPath: "",
    detailAddress: "",
    zipCode: ""
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
  handleReceiverInput(e) {
    // console.log(e)
    this.setData({
      receiver: e.detail.value
    });
  },
  handleReceivePhoneInput(e) {
    this.setData({
      receivePhone: e.detail.value
    })
  },
  handleDetailAddressInput(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  handleZipCodeInput(e) {
    this.setData({
      zipCode: e.detail.value
    })
  },


  //保存用户的收货地址
  handleSaveUserInfo(e) {
    var _that = this;
    var regionStr = this.data.region.join(",");

    getNativeUsername(function (res) {
      var username = res.data;
      console.log(res.data);
      if (res.data) {
        var userReceiveInfo = {
          username: username,
          receiver:  _that.data.receiver,
          receivePhone:  _that.data.receivePhone,
          areaPath: regionStr,
          detailAddress:  _that.data.detailAddress,
          zipCode:  _that.data.zipCode,
          isDefault: Number( _that.data.switchChecked)
        }

        var checkEmptyInfo = [
          { receiver: userReceiveInfo.receiver, emptyToastHint: "用户名不能为空" },
          { receiver: userReceiveInfo.receivePhone, emptyToastHint: "电话不能为空" },
          { receiver: userReceiveInfo.detailAddress, emptyToastHint: "地址不能为空" },
          { receiver: userReceiveInfo.zipCode, emptyToastHint: "邮编不能为空" }
        ]
        for (var item of checkEmptyInfo) {
          //  console.log(isEmpty(item.receiver))
          if (!isEmpty(item.receiver)) {
            wx.showToast({
              title: item.emptyToastHint,
              icon: 'none',
              duration: 1500,
              mask: false,
            })
            return;
          }
        }
        if (!checkTelphone(userReceiveInfo.receivePhone)) {
          wx.showToast({
            title: '手机号不合法',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return false;
        }
        // 校验邮编的合法性
        if (!checkZipCode(userReceiveInfo.zipCode)) {
          wx.showToast({
            title: '邮编不合法',
            icon: 'none',
            duration: 1500,
            mask: false,
          })
        }
        // 将接受者的信息发送到后台
        // console.log(userReceiveInfo);
        wx.request({
          url: Domain + 'add_address',
          data: JSON.stringify(userReceiveInfo),
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "Content-Type": "application/json"
          },
          method: 'post',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {
            console.log(res.data)
            if(res.data.status === "200" && res.data.type === "success"){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1500,
                mask: false,
              })
            }
          },
          fail: function (res) {
            if (!res) {
              wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 500,
                mask: false,
              })
              return;
            }
          },
          complete: function (res) {
            // console.log(res)
          },
        })






      } else {
        wx.showToast({
          title: '你还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }


    });



    // console.log(regionStr)

  }
})