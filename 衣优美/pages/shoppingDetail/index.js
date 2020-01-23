var getNativeUserId = require("../../tools/getNativeUserId.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var { forMatDate } = require("../../tools/common.js");
var app = getApp();
Page({
  data: {
    background: ['/static/init.jpg', '/static/init.jpg', '/static/init.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    toggleAddCarAlert: false,
    goodsImage: [],
    totalNum: 0,
    goodsName: "",
    goodsPrice: 0,
    sizeNum: [],
    saleNum: 1,
    goodsid: "",
    activeSize: 0,
    isCollect: false,
    username: "",
    isExistCoupon: false,
    couponList: [],
    couponHint: "",
    userid: "",
    buyTitle: "立即购买",
    couponid:""
    // collectBgImage:"/static/shoppingDetail/defaultCollect.png"
  },
  onLoad: function (options) {
    var goodsid = options["goodsid"];
    var _that = this;
    console.log(goodsid)
    this.requestGoodsDetail(goodsid);
    this.getNativeUsername(function (res) {
      if (!res.data) {
        res.data = null
      }
      _that.setData({
        username: res.data
      });

      var url = Domain + 'initCollectGoodsStatus?goodsid=' + goodsid + "&username=" + res.data;
      _that.requestData(url, function (res) {
        console.log(res)
        if (res.data.type === "noUserStatus" && res.data.status === "200") {
          wx.showToast({
            title: "~~您还未登录哦！亲~~",
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
        }
        if (res.data.type === "collectSuccess" && res.data.status === "200") {
          _that.setData({
            isCollect: true
          })
        }

      })
    });

    getNativeUserId(function (res) {
      console.log(res);
      if (res.data) {
        _that.setData({
          userid: res.data
        })
        _that.sendInsertVisitedTableInfo(res.data, goodsid)
        _that.isExistCoupon(goodsid, res.data)
      }
    })



  },
  //是否存在优惠券
  isExistCoupon(goodsid, userid) {
    var _that = this;
    var url = Domain + "isExistCoupon";
    // console.log("-----------------------------------")
    var sendInfo = { userid, goodsid };
    // console.log(url,sendInfo);
    postRequest(url, sendInfo, function (res) {
      // console.log(res.data);
      if (res.data && res.data.couponList) {
        console.log(res.data.couponList[0].couponstatus)
        switch (res.data.couponList[0].couponstatus) {
          case 0:
            _that.setData({
              couponHint: "立即领取",
              buyTitle: "立即购买"
            });
            break;
          case 1:
            _that.setData({
              couponHint: "已领取",
              buyTitle: "领券购买",
              couponid:res.data.couponList[0].couponid
            })
            break;
          case 2:
            _that.setData({
              couponHint: "已过期",
              buyTitle: "立即购买"
            })
        }

        res.data.couponList.map(item => {
          item.starttime = new Date(item.starttime).toLocaleString();
          item.endtime = new Date(item.endtime).toLocaleString();
          console.log(item.starttime.toLocaleString())
          return item;
        })
        _that.setData({
          isExistCoupon: res.data.result,
          couponList: res.data.couponList
        });
      }
    });

  },
  sendInsertVisitedTableInfo(userid, goodsid) {
    console.log("================");
    var url = Domain + "insertVisited?userid=" + userid + "&goodsid=" + goodsid;
    console.log(url)
    getRequest(url, function (res) {
      // console.log(res)
      if (res.data.type === "insertSuccess" && res.data.status === "200") {
      }
      if (res.data.type === "fail" && res.data.status === "400") {
        wx.showToast({
          title: "服务端出现故障",
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    })


  },
  requestData(url, callback) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      // data: JSON.stringify(pageData),
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        callback(res)
      },
      fail: function (res) {
        // if (!res) {
        //   return;
        // }
        callback(res);
      },
      complete: function (res) {
        wx.hideLoading();
      },
    });
  },
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  hanldeAddCarAlert() {
    this.setData({
      toggleAddCarAlert: true
    });
  },
  handleCloseAlert() {
    this.setData({
      toggleAddCarAlert: false,
      // activeSize: 0
    })
  },
  requestGoodsDetail(goodsid) {
    wx.showLoading({
      title: '加载中',
    })
    var _that = this;

    wx.request({
      url: Domain + 'getGoodsDetail?goodsid=' + goodsid,
      // data: JSON.stringify(pageData),
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        var sizeNum = [];//每种商品及其对应的数量
        var clickSize = [];
        for (var item of res.data) {
          sizeNum.push({
            size: item.size,
            num: item.goodssizenum
          });
        }
        _that.setData({
          goodsImage: res.data[0].goodsimage,
          totalNum: res.data[0].goodscount,
          goodsName: res.data[0].goodsname,
          goodsPrice: res.data[0].goodsprice,
          sizeNum: sizeNum,
          clickSize: clickSize,
          goodsid: res.data[0].goodsid
        });
      },
      fail: function (res) {
        if (!res) {
          return;
        }
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },
  handleCalculateGoodsNum(e) {
    if (e.target.dataset.caltype === "add") {
      if (this.data.saleNum >= 100) {
        this.setData({
          saleNum: 100
        })
        return;
      }
      this.setData({
        saleNum: this.data.saleNum + 1
      });
    } else {
      if (this.data.saleNum <= 1) {
        this.setData({
          saleNum: 1
        })
        return;
      }
      this.setData({
        saleNum: this.data.saleNum - 1
      });
    }
  },
  handleInputGoodsNum(e) {
    var value = e.detail.value;
    this.setData({
      saleNum: value
    })

  },
  handleGetSize(e) {
    var size = e.target.dataset.size;
    for (var item of this.data.sizeNum) {
      if (size === item.size) {
        this.setData({
          activeSize: size
        })
      }
    }
  },
  submitBuyInfo() {
    var _that = this;
    if (this.data.activeSize === 0) {
      wx.showToast({
        title: "~~~请选择尺寸~~~",
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
    wx.showModal({
      title: '添加购物车',
      content: '是否加入购物车',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        // console.log(result)
        if(result.confirm){
          this.handleAddBuyCar(this.data.saleNum, this.data.activeSize);
        }else{
          setTimeout(function(){
            _that.handleCloseAlert() 
          },500);
        }
      },
      fail: ()=>{
      },
      complete: ()=>{}
    });
    return ;

   
  },
  getNativeUsername(callback) {
    wx.getStorage({
      key: 'username', //检验本地缓存中有没有username用户信息，有则说明处于登录状态，反之为登录状态
      success: (result) => {
        // console.log(result.data)
        callback(result)
      },
      fail: (res) => {
        callback(res)
      },
      complete: () => { }
    })
  },
  handleCollectGoods() {
    // console.log(this.data.isCollect)
    // console.log(this.data.goodsid)
    // var goodsid= "B00001"
    var _that = this;
    // var username = '';
    this.getNativeUsername(function (res) {
      //  console.log(res.data)
      // username = res.data;
      // console.log(username)
      if (!res.data) {
        console.log("没有登录");
        wx.showToast({
          title: '您还没有登录呢！亲~~',
          icon: 'none',
          duration: 1500,
          mask: false,
        })
        return;
      }
      // console.log(res.data);
      _that.setData({
        username: res.data
      });
      wx.request({
        url: Domain + 'getCollectGoods?goodsid=' + _that.data.goodsid + "&username=" + _that.data.username,
        // data: JSON.stringify(pageData),
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Content-Type": "application/json"
        },
        method: 'get',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log(res)
          if (res.data.type === 'collectSuccess' && res.data.status === '200') {
            _that.setData({
              isCollect: true,
            })
          } if (res.data.type === "cancelCollect" && res.data.status === '200') {
            _that.setData({
              isCollect: false,
            })
          }

        },
        fail: function (res) {
          if (!res) {
            return;
          }
        },
        complete: function (res) {
          wx.hideLoading();
        },
      });
    });
    // if (username === '') {
    //   console.log(username)
    //   return;
    // }


  },
  //添加购物车
  handleAddBuyCar(saleNum, activeSize) {
    var _that = this;
    this.getNativeUsername(function (res) {
      _that.setData({
        username: res.data
      });
      // console.log(this.data.saleNum);
      // console.log(this.data.activeSize)
      var url = Domain + 'addBuyCar?goodsid=' + _that.data.goodsid + "&username=" + res.data + "&buycount=" + saleNum + "&buysize=" + activeSize;
      _that.requestData(url, function (res) {
        console.log(res)
        /**
         * 初次加入购物车
         * type:"addBuyCarSuccess",
          status:"200"
         
          //购物车中已存在，更新已经加入购物车的货物数量
          type: "updateBuyCarSuccess",
           status: 200
         */
        if ((res.data.type === "addBuyCarSuccess" && res.data.status === "200") || (res.data.type === "updateBuyCarSuccess" && res.data.status === "200")) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500,
            mask: false,
          })
          return
        }
      })
    })
  },
  switchTabCar() {
    console.log("switch car page")
    wx.switchTab({
      url: '/pages/car/index'
    });
  },
  getCoupon() {
    var _that = this;
    if (this.data.couponHint === "立即领取") {
      /**
       * 发送请求领取优惠券
       */
      var url = Domain + "getCoupon";
      var sendInfo = {
        userid: this.data.userid,
        goodsid: this.data.goodsid
      }
      postRequest(url, sendInfo, function (res) {
        if (res.data) {
          console.log(res.data);
          if (res.data.result === "success") {
            _that.setData({
              couponHint: "已领取"
            })
            wx.showToast({
              title: '领取成功',
              icon: 'success',
              duration: 1500,
              mask: false,
            })
          }

        }
      })
    } else {
      wx.showToast({
        title: '您已经领取过了',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }

  },
  handleFastBuy() {
    var _that = this;
    var payforMoney = this.data.goodsPrice - this.data.couponList[0].couponprice;
    // console.log( this.data.goodsPrice,this.data.couponList[0].couponprice)
    // 
    if(this.data.activeSize==0){
      wx.showToast({
        title: "~~~请选择尺寸~~~",
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return;
    }
    var tempHandleObjList = [];
    tempHandleObjList.push({
      userid: this.data.userid,
      goodsid: this.data.goodsid,
      buycount:this.data.saleNum,
      buysize: this.data.activeSize
    });
    app.globalData.payForObjList = tempHandleObjList
    var url = "";
    if(this.data.buyTitle === "立即领取"){
      url = '/pages/payfor/index?payforMoney=' + payforMoney
    }else{
      url = '/pages/payfor/index?payforMoney=' + payforMoney+'&couponid='+_that.data.couponid;
    }
    wx.navigateTo({
      url: url,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },


})