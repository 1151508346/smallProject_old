// pages/pxDetail/index.js
var getNativeUserId = require("../../tools/getNativeUserId.js");
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: wx.getSystemInfoSync().windowHeight,
    evaluteList: [],
    starImages: [
      "/static/selectedStar.png",
      "/static/selectedStar.png",
      "/static/selectedStar.png",
      "/static/selectedStar.png",
      "/static/selectedStar.png"
    ],
    isStartGrade: false,
    gradeTitle:"",
    inputInfo:"",
    goodsid :""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gradeTitle:this.gradeHint(4)
    })
    // getNativeUserId(function(res){
    //   if(res.data){
    //     _that.setData({
    //       userid:res.data //当前登录的用户id
    //     })
    //   }
    // })
    options.goodsid = 'B00002';
    this.setData({
      goodsid:options.goodsid
    })
    if (options.hasOwnProperty("goodsid")) {
      var { goodsid } = options;
      this.getEvaluateDetailInfo(goodsid)
    }

  },
  getEvaluateDetailInfo(goodsid) {
    var _that = this;
    var url = Domain + "getEvaluateDetailInfo" // 获取评价详情列表
    var sendInfo = {
      goodsid
    }
    postRequest(url, sendInfo, function (res) {
      if (res.data) {
        // console.log(res.data)
        var result = res.data.map(item => {
          var starList = [];
          for (var i = 0; i < item.grade; i++) {

            starList.push("/static/selectedStar.png")
          }
          while (true) {
            if (i < 5) {
              starList.push("/static/defaultStar.png");
              i++;
              continue;
            }
            break;
          }
          item.starList = starList;
          return item;
        })
        console.log(result)
        _that.setData({
          evaluteList: result
        })
      }
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gradeHint(i) {
    // var len = this.data.starImages.length;
    // var temp = 0;
    // console.log(this.data.starImages)
    // for (var i = 0; i < len; i++) {
    //   if (this.data.starImages[i] === "/static/selectedStar.png") {
    //     temp++;
    //   };
    // }
    // console.log(temp)
    switch (i) {
      case 0:
        return "差";
      case 1:
        return "一般";
      case 2:
        return "较好";
      case 3:
        return "很好";
      case 4:
        return "非常好";
    }
  },
  setGrade(e) {
    // console.log(this.gradeHint())
    if(!this.data.isStartGrade){
      this.setData({
        isStartGrade:true
      })
    }
    var _that = this;
    // console.log(gradeTitle)
    var index = e.currentTarget.dataset.index;
    var starImages = [];
    for (var i = 0; i <= index; i++) {
      starImages.push("/static/selectedStar.png")
    }
    
    this.setData({
     gradeTitle: _that.gradeHint(i-1)
    })
    while (true) {
      if (i < 5) {
        starImages.push("/static/defaultStar.png");
        i++;
        continue;
      }
      break;
    }
    this.setData({
      starImages: starImages,
      // gradeTitle :_that.gradeHint()
    })
  },
  getEvaluateInfo(e){
    // console.log(e.detail.value);
    this.setData({
      inputInfo : e.detail.value
    })
  },
  submitEvaluateInfo(){
      if(!this.data.isStartGrade){
        wx.showToast({
          title: '请给出好评等级',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        return;
      }
      if(this.data.inputInfo.trim() === "" ){
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        
        });
        return ;
      }
      this.sendEvaluteInfo();
  },
  sendEvaluteInfo(){
    var _that = this;
    var grade = this.getValueCountInArray(this.data.starImages);
    console.log(grade)
    getNativeUserId(function(res){
      if(res.data){
        var userid = res.data;
        var url = Domain+"insertEvalueInfoToDatabase";
        var sendInfo = {
          userid:userid,
          goodsid:_that.data.goodsid,
          evaluatecontent:_that.data.inputInfo,
          grade:grade
        }
        postRequest(url,sendInfo,function(res){
          if(res.data){
            if(res.data.result === "success"){
              _that.getEvaluateDetailInfo(_that.data.goodsid)
            }else{
              wx.showToast({
                title: '评价失败',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
              });
            }
          }
        })
      }
    })
  },
  getValueCountInArray(arr){
    var grade = 0;
    arr.map(item=>{
      item === "/static/selectedStart.png";
      grade++
    });
    return grade;
  }
  
})