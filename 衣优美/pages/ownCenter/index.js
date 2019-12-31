var getNativeUserId = require("../../tools/getNativeUserId.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    loginStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady(){
    console.log("onready")
  },
  onShow(){
    var _that = this;
    
    wx.getStorage({
      key: 'username', //检验本地缓存中有没有username用户信息，有则说明处于登录状态，反之为登录状态
      success: (result) => {
        console.log(result.data)
        _that.setData({
          username: result.data,
          loginStatus: true
        })
      },
      fail: (res) => {
      },
      complete: () => { }
    })
  },
  onLoad: function (options) {
    console.log("onload")
    

  },
  handelNavigatorToLoginPage() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
  userExitLogin(){
   var _that = this;
  //  console.log(_that.data.username)
    wx.getStorage({
      key:"username",
      success(res){
        console.log(res.data)
        console.log(res.data == _that.data.username)
        if(res.data == _that.data.username){
          wx.removeStorage({
            key: "username",
            success: (result)=>{
              console.log("exit")
              _that.setData({
                loginStatus:false
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
      },fail(){
        // console.log("失败鸟");
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  },
  navigateToOrderListPage(e){
    var goodsStatus = e.currentTarget.dataset.goodsstatus;
    wx.navigateTo({
      url: '/pages/order/index?goodsStatus='+goodsStatus,
      
     })
  },
  navigateToCollectPage(){
    getNativeUserId(function(res){
        if(!res.data){
          wx.showToast({
            title: '您还未登录',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          return ;
        }
        wx.navigateTo({
          url:"/pages/collectGoods/index?userid="+res.data
        })
    })

  },
 
  navigateToVisitedPage(){
    getNativeUserId(function(res){
      if(!res.data){
        wx.showToast({
          title: '您还未登录',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return ;
      }
      wx.navigateTo({
        url:"/pages/visited/index?userid="+res.data
      })
  })
  }



})