// pages/search/index.js
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var getNativeUsername = require("../../tools/getNativeUsername.js");
var getNativeUserId = require("../../tools/getNativeUserId.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSearchInputFill:false,
    searchInput:"",
    searchList:false,
    searchHistoryList:[],
    isClearButtonShow:false,
    isShowPersentSearchWrapper:false,
    shoppingData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      // wx.getStorage({
      //   key: 'searchHistoryList',
      //   success: (result)=>{
      //       // console.log(result+"asdasdassds")
      //       this.setData({
      //         searchHistoryList: result.data
      //       })
      //   },
      //   fail: (err)=>{
      //     // console.log(err)
      //   },
      //   complete: ()=>{}
      // });
    // console.log(wx.getStorageSync("searchHistoryList"))
      if( wx.getStorageSync("searchHistoryList").length !=0){
          this.setData({
            searchHistoryList: wx.getStorageSync("searchHistoryList")
        })
      }
      // console.log(this.data.searchHistoryList.length)
      if(this.data.searchHistoryList.length != 0){
          this.setData({
            isClearButtonShow :true
          })
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
  handleShoppingInput(e){
    // console.log(e)
    var value = e.detail.value;
    this.setData({
      searchInput:value
    });
    if(value != ""){
      this.setData({
        isSearchInputNotFill :true
      })
     
    } else{
      this.setData({
        isSearchInputNotFill :false
      })
    }


  },
  handelClearSearchInput(){
    this.setData({
      isSearchInputNotFill :false,
      searchInput:""
    })
  },
  searchShoppingName(){
    if(this.data.searchInput != ""){
      // console.log(typeof this.data.searchHistoryList)
        var value = this.data.searchInput;
        var searchHistoryList = this.data.searchHistoryList;
        // console.log(searchHistoryList)
        var tempIndex = -1;
        for (var i = 0; i < searchHistoryList.length;i++){
          if (searchHistoryList[i] == value) {
              tempIndex = i;
              break;
            }
        }
        if(tempIndex != -1){
          searchHistoryList.unshift(searchHistoryList.splice(tempIndex, 1)[0]) ;
        }else{
          searchHistoryList.unshift(value);
        }
        
        if(searchHistoryList.length >10){
          searchHistoryList.length = 10
        }
        wx.setStorage({
          key: 'searchHistoryList',
          data: searchHistoryList,
          success: (result)=>{
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        if(searchHistoryList.length !=0){
          this.setData({
            isClearButtonShow:true
          });
        }
        
        this.setData({
          searchHistoryList:searchHistoryList,
          searchInput:"",
          isSearchInputNotFill:false
        });
        this.sendSearchRequest(value);
    }
    // console.log(this.data.searchHistoryList)

  },
  clearSearchHistoryList(){
    this.setData({
      searchHistoryList:[],
      isClearButtonShow:false
    });
    wx.getStorage({
      key:"searchHistoryList",
      success(result){
        wx.removeStorage({
          key: 'searchHistoryList',
          success: (result)=>{
              
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  },
  sendSearchRequest(value){
    var url = Domain+"search";
    var _that = this;
    postRequest(url,{value:value},function(res){
      if(res.data){
        console.log(res.data)
          _that.setData({
            shoppingData: res.data
          })
      }
    })
  },
  clickHistoryButtonSearch(e){
    var {value,index} = e.currentTarget.dataset;
    console.log(value,index)
    this.sendSearchRequest(value);
    var searchHistoryList = JSON.parse(JSON.stringify(this.data.searchHistoryList));
    searchHistoryList.unshift(searchHistoryList.splice(index,1)[0]);
    // console.log(index, searchHistoryList)
    this.setData({
      searchHistoryList:searchHistoryList
    })
    wx.setStorage({
      key: 'searchHistoryList',
      data: searchHistoryList,
      success: (result) => {
      },
      fail: () => { },
      complete: () => { }
    });
  },
  handleInputBlur(){
   setTimeout(()=>{
     this.setData({
       isShowPersentSearchWrapper: false
     })
   })
  },
  handleInputFocus(){
    this.setData({
      isShowPersentSearchWrapper: true
    })
  }


 
})