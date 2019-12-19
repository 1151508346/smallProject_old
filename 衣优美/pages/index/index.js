//index.js
//获取应用实例
var Domain = require("../../tools/domain.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var showToast = require("../../tools/showToast.js");
var getNativeUsername = require("../../tools/getNativeUsername.js");
var app = getApp();
Page({
  data: {
    background: [
      '/static/banner/banner1.jpg',
      '/static/banner/banner2.jpg',
      '/static/banner/banner3.jpg',
      '/static/banner/banner4.jpg',
      '/static/banner/banner5.jpg',
      '/static/banner/banner6.jpg'
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 4000,
    duration: 2500,
    routers1: [
      {
        name: "精品推荐",
        icon: "/static/grid/精品推荐拷贝.jpg",
        params: "recommend"
      }, {
        name: "时尚搭配",
        icon: "/static/grid/搭配 拷贝.jpg",
        params: "collocation"
      }, {
        name: "明星专区",
        icon: "/static/grid/明星专区 拷贝.jpg",
        params: "start"

      },
    ], routers2: [
      {
        name: "精品套装",
        icon: "/static/grid/套装拷贝.jpg",
        params: "suit"
      }, {
        name: "孕妇专区",
        icon: "/static/grid/积分拷贝.jpg",
        params: "pregnant"
      }, {
        name: "优惠卷",
        icon: "/static/grid/优惠券拷贝.jpg",
        params: "discount"
      }

    ],
    initDefaultImg: "/static/init.jpg",
    branchTuijian: [],
    lowPriceList: [],
    boyClothList: [],
    girlClothList:[]

  },
  //事件处理函数

  onLoad: function () {
    var _that = this;
    var url = Domain + 'initTuijian';
    getNativeUsername(function (res) {
      if (res.data) {
        url += "?username=" + res.data

      }
      getRequest(url, function (res) {
        if (!res.data) {
          showToast("获取数据失败");
          return;
        }
        // console.log(res.data);
        var tempTuijian = [];
        for (var i = 0; i < 5; i++) {
          tempTuijian.push({
            goodsimage: res.data[i].goodsimage[0],
            goodsid: res.data[i].goodsid,
          })
        }
        _that.setData({
          branchTuijian: tempTuijian
        })
      });
    });
    var urlLowPrice = Domain + "lowPrice"
    getRequest(urlLowPrice, function (res) {
      if (!res.data) {
        showToast("获取数据失败");
        return;
      }
      // console.log(res.data);
      _that.setData({
        lowPriceList: res.data,
      })

    });
    var urlboyCloth = Domain + "boyCloth";
    getRequest(urlboyCloth, function (res) {
      if (!res.data) {
        showToast("获取数据失败");
        return;
      }
      console.log(res.data);
      _that.setData({
        boyClothList: res.data,
      });
      

    });
    var urlgirlCloth = Domain + "girlCloth";
    getRequest(urlgirlCloth, function (res) {
      if (!res.data) {
        showToast("获取数据失败");
        return;
      }
      console.log(res.data);
      _that.setData({
        girlClothList: res.data,
      });
      

    });


  },
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
  handleNavigatorShoppingDetailPage(e) {
    var goodsid = e.currentTarget.dataset.goodsid;

    wx.navigateTo({
      url: '/pages/shoppingDetail/index?goodsid=' + goodsid,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  handleNavigatorShoppingPage(e) {
    var params = e.currentTarget.dataset.params;
    app.globalData.params = params;
    console.log(app.globalData)
    // wx.switchTab({
    //   url: '/pages/shopping/index?params='+params
    // })
  }
  // changeIndicatorDots() {
  //   this.setData({
  //     indicatorDots: !this.data.indicatorDots
  //   })
  // },

  // changeAutoplay() {
  //   this.setData({
  //     autoplay: !this.data.autoplay
  //   })
  // },

  // intervalChange(e) {
  //   this.setData({
  //     interval: e.detail.value
  //   })
  // },

  // durationChange(e) {
  //   this.setData({
  //     duration: e.detail.value
  //   })
  // }
})
