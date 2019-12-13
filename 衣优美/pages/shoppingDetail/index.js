var Domain = require("../../tools/domain.js");
Page({
  data: {
    background: ['/static/init.jpg', '/static/init.jpg', '/static/init.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    toggleAddCarAlert:false,
    goodsImage:[],
    totalNum:0,
    goodsName:"",
    goodsPrice:0,
    sizeNum:[],
    saleNum:1,
    activeSize:0
  },
  onLoad:function(options){
    var goodsid = options["goodsid"];
    console.log( goodsid)
    this.requestGoodsDetail(goodsid);

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
  hanldeAddCarAlert(){
      this.setData({
        toggleAddCarAlert:true
      });
  },
  handleCloseAlert(){
    this.setData({
      toggleAddCarAlert:false,
      activeSize:0
    })
  },
  requestGoodsDetail(goodsid){
    wx.showLoading({
      title: '加载中',
    })
    var _that = this;
    wx.request({
      url: Domain + 'getGoodsDetail?goodsid=' + goodsid ,
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
        for(var item of res.data){
          sizeNum.push({
            size:item.size,
            num :item.goodssizenum
          });
        }
        _that.setData({
          goodsImage:res.data[0].goodsimage,
          totalNum:res.data[0].goodscount,
          goodsName:res.data[0].goodsname,
          goodsPrice:res.data[0].goodsprice,  
          sizeNum:sizeNum,
          clickSize:clickSize
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
  handleCalculateGoodsNum(e){
    if(e.target.dataset.caltype === "add"){
      if(this.data.saleNum >=100){
        this.setData({
          saleNum :100
        })
        return;
      }
      this.setData({
        saleNum:this.data.saleNum+1
      });
    }else{
      if(this.data.saleNum<=1){
        this.setData({
          saleNum:1
        })
        return;
      }
      this.setData({
          saleNum:this.data.saleNum-1
      });
    }
  },
  handleInputGoodsNum(e){
    var value = e.detail.value;
    this.setData({
      saleNum:value
    })
    
  },
  handleGetSize(e){
    var size = e.target.dataset.size;
    for(var item of this.data.sizeNum){
      if(size === item.size){
          this.setData({
            activeSize:size
          })
      }
    }
  },
  submitBuyInfo(){
    if(this.data.activeSize === 0){
      wx.showToast({
        title: "~~~请选择尺寸~~~",
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


  }
  
  
})