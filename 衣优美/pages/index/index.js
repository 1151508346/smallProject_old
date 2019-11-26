//index.js
//获取应用实例

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
    routers1:[
      {
        name:"精品推荐",
        icon:"/static/grid/精品推荐拷贝.jpg"
      },{
        name:"时尚搭配",
        icon:"/static/grid/搭配 拷贝.jpg",
      }, {
        name: "明星专区",
        icon: "/static/grid/明星专区 拷贝.jpg",
      },
    ],routers2:[
      {
        name: "精品套装",
        icon: "/static/grid/套装拷贝.jpg",
      }, {
        name: "孕妇专区",
        icon: "/static/grid/积分拷贝.jpg",
      }, {
        name: "优惠卷",
        icon: "/static/grid/优惠券拷贝.jpg",
      }

    ],
    initDefaultImg:"/static/init.jpg",
    branchTuijian: ["/static/init.jpg", "/static/init.jpg", "/static/init.jpg", "/static/init.jpg",]
  },
  //事件处理函数
  
  onLoad: function () {
    
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
  }
})
