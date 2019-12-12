Page({
  
  onLoad:function(options){
    var goodsid = options["goodsid"];

    




  },
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper'
    }
  },

  data: {
    background: ['/static/init.jpg', '/static/init.jpg', '/static/init.jpg'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    toggleAddCarAlert:false
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
      toggleAddCarAlert:false
    })
  }
  
})