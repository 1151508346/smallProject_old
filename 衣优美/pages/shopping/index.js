var Domain = require("../../tools/domain.js");

var { getRequest, postRequest } = require("../../tools/request.js");
var getNativeUsername = require("../../tools/getNativeUsername.js");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: wx.getSystemInfoSync().windowWidth,
    screenHeight: wx.getSystemInfoSync().windowHeight,
    modelBgToggle: false,
    shopping_bar: "shopping_bar",
    shopping_barList: {

      "全部商品": [],
      "男装": [],
      "女装": [],
      "儿童": [
        "裤子",
        "上衣",
        "连衣裙",
      ],
      "明星大牌": [],
      "精品套装": [],
    },
    shoppingType: "全部商品",
    shopping_index_toggle: "",
    items_toggle: "",
    pageNum: 1,
    limit: 5,
    shoppingData: [],
    allShoppingData: [],


    // items_toggle_flag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //sign :判断用户时初始化加载，还是下来刷新，或者时上来加载更多
  requestGoods(pageNum, limit, sign) {
    wx.showLoading({
      title: '加载中',
    })
    var _that = this;


    // console.log("loadingMore....");
    wx.request({
      url: Domain + 'getGoods?pageNum=' + pageNum + '&limit=' + limit,
      // data: JSON.stringify(pageData),
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res);
        // console.log("--------------------------------------");
        if (res.data.length === 0) {
          console.log("已经到底了");
        } else {
          if (sign === "refrech" || sign === "load") {
            console.log("refrech")
            _that.setData({
              shoppingData: res.data,
              allShoppingData: res.data
            })
            var tempObj = {}
            tempObj.listname = _that.data.shoppingType
            _that.differentTypeShow(_that, tempObj);
            return;
          }
          if (res.data === "over") {
            wx.showToast({
              title: "没有更多商品了~~~",
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
              success: (result) => {

              },
              fail: () => { },
              complete: () => { }
            });
            return;
          }
          if (sign === "loadingMore") {
            _that.setData({
              shoppingData: [..._that.data.shoppingData, ...res.data],
              allShoppingData: [..._that.data.shoppingData, ...res.data]
            });
            // console.log(res.data)
            // console.log(_that.data.shoppingType);
            var tempObj = {}
            tempObj.listname = _that.data.shoppingType
            _that.differentTypeShow(_that, tempObj);
          }
        }
      },
      fail: function (res) {
        if (!res) {
          // wx.showToast({
          //   title: '登录失败',
          //   icon: 'none',
          //   duration: 500,
          //   mask: false,
          //    })
          return;
        }
      },
      complete: function (res) {
        // console.log(res)
        // console.log("--------------------------------------")
        wx.hideLoading();
      },
    })
    return;


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
    // console.log(app.globalData.defaultValue);
    if (!app.globalData.params) {
      this.requestGoods(this.data.pageNum, this.data.limit, "load");
      return;
    }
    /**
     * params :index Page 点击九宫格，所传递过来的参数;
     */

    // 
    var _that = this;
    if (app.globalData.params === "recommend") {
      var url = Domain + "inittuijian"
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
          // var tempTuijian = [];

          _that.setData({
            shoppingData: res.data,
            shoppingType: "tuijian"
          })
        });
      });
    }
    console.log(app.globalData.params)
    if (app.globalData.params === "suit") {
      var url = Domain + "suit"
      getRequest(url, function (res) {
        if (!res.data) {
          showToast("获取数据失败");
          return;
        }
        // console.log(res.data);
        // var tempTuijian = [];
        _that.setData({
          shoppingData: res.data,
          shoppingType: "精品套装"
        })
      });
    }
    if (app.globalData.params === "start") {
      var url = Domain + "start"
      getRequest(url, function (res) {
        if (!res.data) {
          showToast("获取数据失败");
          return;
        }
        // console.log(res.data);
        // var tempTuijian = [];
        _that.setData({
          shoppingData: res.data,
          shoppingType: "明星大牌"
        })
      });
    }
    //  gravida
    if (app.globalData.params === "pregnant") {
      var url = Domain + "gravida"
      getRequest(url, function (res) {
        if (!res.data) {
          showToast("获取数据失败");
          return;
        }
        // console.log(res.data);
        // var tempTuijian = [];
        _that.setData({
          shoppingData: res.data,
          shoppingType: "孕妇专区"
        })
      });
    }


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
    if (this.data.shoppingType === "tuijian") {
      return;
    }
    this.setData({
      pageNum: 1,
      limit: 5
    });
    this.requestGoods(this.data.pageNum, this.data.limit, "refrech");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.shoppingType);
    if (this.data.shoppingType === "tuijian" || this.data.shoppingType === "精品套装" || this.data.shoppingType == "明星大牌" || this.data.shoppingType === "孕妇专区") {
      wx.showToast({
        title: "没有更多商品了~~~",
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });
      return;
    }
    this.setData({
      pageNum: this.data.pageNum + 1
    });


    // console.log(this.data.pageNum)
    this.requestGoods(this.data.pageNum, this.data.limit, "loadingMore");



    // wx.request({
    //     url: '',
    //     data: {},
    //     header: {'content-type':'application/json'},
    //     method: 'GET',
    //     dataType: 'json',
    //     responseType: 'text',
    //     success: (result) => {

    //     },
    //     fail: () => {},
    //     complete: () => {}
    //   });


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  handleToggleShoppingList(e) {
    // console.log(e)
    this.setData({
      modelBgToggle: true,
      shopping_bar: "shopping_bar_end"
    })
  },
  handleCloseModelBg() {
    this.setData({
      modelBgToggle: false,
      shopping_bar: "shopping_bar"
    })
  },
  handleShoppingListToggle(e) {
    var data = e.currentTarget.dataset;
    console.log(data)
    var _that = this;
    this.setData({
      items_toggle: data.listname,
      // items_toggle_flag:!this.data.items_toggle_flag,
      shoppingType: data.listname
    });
    this.differentTypeShow(_that, data);

  },
  differentTypeShow(_that, data) {
    switch (data.listname) {
      case "男装":
        var tempShoppingData = this.data.allShoppingData.filter(item => {
          return item.typeid === "BOY"
        });
        _that.setData({
          shoppingData: tempShoppingData,
        })
        break;
      case "女装":
        var tempShoppingData = this.data.shoppingData.filter(item => {
          return item.typeid === "GIRL"
        });
        _that.setData({
          shoppingData: tempShoppingData
        })
        break;
      case "儿童":
        var tempShoppingData = this.data.shoppingData.filter(item => {
          return item.typeid === "CHILDREN";
        });
        _that.setData({
          shoppingData: tempShoppingData
        })
        break;
      case "儿童-上衣":
        var tempShoppingData = this.data.shoppingData.filter(item => {
          return item.typeid === "CHILDREN" && item.category === "Jacket"
        });
        _that.setData({
          shoppingData: tempShoppingData
        })
        break;
      case "儿童-裤子":
        var tempShoppingData = this.data.shoppingData.filter(item => {
          return item.typeid === "CHILDREN" && item.category === "pants"
        });
        _that.setData({
          shoppingData: tempShoppingData
        })
        break;
      case "儿童-连衣裙":
        var tempShoppingData = this.data.shoppingData.filter(item => {
          return item.typeid === "CHILDREN" && item.category === "dress";
        });
        _that.setData({
          shoppingData: tempShoppingData
        })
        break;
      default:
        break;
    }
  },
  handleShoppingListToggleItem(e) {
    var data = e.currentTarget.dataset
    console.log(data)
    this.setData({
      shoppingType: data.listnameitem
    })
    console.log(this.data.shoppingType)
  },
  handleItemToggle() {
    console.log("aaaaaaa")
  },
  //跳转到搜索页面
  handleNavigatorToSearchPage() {

    wx.navigateTo({
      url: '/pages/search/index',
      success: (result) => {

      },
      fail: () => { },
      complete: () => { }
    });
  },



})