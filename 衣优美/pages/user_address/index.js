// pages/user_address/index.js
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
    receivingAddress: [],
    defaultIndex: 9999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    // initAddress
    getNativeUserId(function (res) {
      if (res.data) {
        var url = Domain + "initAddress?userid=" + res.data;
        getRequest(url, function (res) {
          if (res.data) {
            console.log(res.data);
            _that.setData({
              receivingAddress: res.data
            });
            for (var i = 0; i < _that.data.receivingAddress.length; i++) {
              if (_that.data.receivingAddress[i].isdefault === 1) {
                _that.setData({
                  defaultIndex: _that.data.receivingAddress[i].addressid
                })
                break;
              }
            }
            console.log(_that.data.defaultIndex);
          }
        });
      } else {
        wx.showToast({
          title: '您还没有登录呢',
          icon: 'none',
          duration: 1500,
          mask: false,
        })
      }
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

  updateDefaultAddress(e) {
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      defaultIndex: e.currentTarget.dataset.index
    });
    console.log(this.data.defaultIndex);

    var url = Domain + "updateDefaultAddress?addressid=" + this.data.defaultIndex;
    getRequest(url, function (res) {
      if (res.data) {

        var { type, status } = res.data;

        if (type === "updateSuccess" && status === "200") {
          wx.showToast({
            title: "默认地址更新成功",
            icon: 'success',
            duration: 1500,
            mask: false,

          })
        }
        
        if (type === "fail" && status === "404") {
          wx.showToast({
            title: "默认地址更新失败",
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }


      } else {
        wx.showToast({
          title: "默认地址更新失败",
          icon: 'none',
          duration: 1500,
          mask: false,

        })
      }
    })





  },
  handelNavigatorToAdd_address() {
    wx.navigateTo({
      url: '/pages/add_address/index',
    })
  }

})