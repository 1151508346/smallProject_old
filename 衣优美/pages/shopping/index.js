var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: wx.getSystemInfoSync().windowWidth,
	screenHeight: wx.getSystemInfoSync().windowHeight ,
	modelBgToggle:false,
	shopping_bar:"shopping_bar",
	shopping_barList:{
		"全部商品":[],
		"男装":[],
		"女装":[],
		"儿童":[
			"裤子",
			"上衣",
			"连衣裙",
		],
		"明星大牌":[],
		"精品套装":[]
	},
	shoppingType:"全部商品",
	shopping_index_toggle:"",
	items_toggle:"",
	// items_toggle_flag:false
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
		console.log(app.globalData.defaultValue);
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
  handleToggleShoppingList(e){
	// console.log(e)
	this.setData({
		modelBgToggle:true,
		shopping_bar:"shopping_bar_end"
	})
  },
  handleCloseModelBg(){
	  this.setData({
		  modelBgToggle:false,
		  shopping_bar:"shopping_bar"
	  })
  },
  handleShoppingListToggle(e){
	 var data = e.currentTarget.dataset;
		console.log(data)
	
	  this.setData({
		  items_toggle:data.listname,
		  // items_toggle_flag:!this.data.items_toggle_flag,
		  shoppingType:data.listname
	  })
	 
  },
  handleShoppingListToggleItem(e){
	  var data = e.currentTarget.dataset
	  console.log(data)
	  this.setData({
	  		  shoppingType:data.listnameitem
	  })
	  console.log(this.data.shoppingType)
  },
  handleItemToggle(){
	  console.log("aaaaaaa")
  },
 
	
})