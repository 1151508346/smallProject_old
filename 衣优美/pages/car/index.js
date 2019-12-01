var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedStatus:"selected",
	
	checkedStatusToggle:true,
	car_shopping_list:[
		{
			goodsName:"aaa打扫房间克鲁赛德后方可上岛咖啡",
			goodsPrice:10.1,
			goodsImage:"/static/init.jpg",
      defaultValue:1
		},
		{
			goodsName:"aaa打扫房间克鲁赛德后方可上岛房间克鲁赛德后方可上房间克鲁赛德后方可上房间克鲁赛德后方可上咖啡",
			goodsPrice:10.0,
			goodsImage:"/static/init.jpg",
      defaultValue:1
		}
	],
	allPriceValue:0.00
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
    var length = this.data.car_shopping_list.length;
	var newData = this.data.car_shopping_list.map((value,index)=>{
		value.selectStatus = true;
		return value;
	})
	// console.log(newData);
	this.setData({
		car_shopping_list:newData
	});
  var tempPriveValue = 0.00;
  for(var i = 0;i<this.data.car_shopping_list.length;i++){
    if(this.data.car_shopping_list[i].selectStatus){
      tempPriveValue += this.data.car_shopping_list[i].goodsPrice;
    }
  }

  this.setData({
    allPriceValue:tempPriveValue
  })
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
	handleSwitchBarShoppingPage(){
	  app.globalData.defaultValue = "car"
	wx.switchTab({
		  url: '/pages/shopping/index'
	});
	},
	toggleCheck(e){
		var index = e.currentTarget.dataset.index;
		
		if(!this.data.car_shopping_list[index].selectStatus){
		  
		 this.data.car_shopping_list[index].selectStatus = true
		 this.setData({
				  checkedStatus:"",
				  car_shopping_list: this.data.car_shopping_list
		 })
		}else{
		  this.data.car_shopping_list[index].selectStatus = false
		  this.setData({
		  				  checkedStatus:"",
		  				  car_shopping_list: this.data.car_shopping_list,
		  })
		}
		var temp = this.data.car_shopping_list.length;
		for (var i =0;i<this.data.car_shopping_list.length;i++) {
			
			if(!this.data.car_shopping_list[i].selectStatus){
				break;
				
			}
		}
		if(temp===i){
			this.setData({
				checkedStatus :"checked",
				checkedStatusToggle:true
			})
		}else{
			this.setData({
				checkedStatus :"",
				checkedStatusToggle:false
			})
		}
		/**
     * 点击列表中商品获取选中的商品，改变总值为selectStatus=true的goodsPrice
     */
    var tempPrice = 0;
    for(var i =0 ;i<this.data.car_shopping_list.length;i++){
      if(this.data.car_shopping_list[i].selectStatus){
        tempPrice+=this.data.car_shopping_list[i].goodsPrice;
      }
    }
    // console.log(tempPrice)
    this.setData({
      allPriceValue:tempPrice
    })


	},
	addBuyNum(e){
		 var index = e.currentTarget.dataset.index;
		  ++this.data.car_shopping_list[index].defaultValue;
		 this.setData({
			car_shopping_list:this.data.car_shopping_list
		 })
	},
	reduceBuyNum(e){
		var index = e.currentTarget.dataset.index;
		--this.data.car_shopping_list[index].defaultValue;
		this.setData({
			car_shopping_list:this.data.car_shopping_list
		})
	},
	allSelectStatusToggle(){
		if(!this.data.checkedStatusToggle){
			this.setData({
				checkedStatus:"selected",
				checkedStatusToggle:true
			})
			for (var i=0;i<this.data.car_shopping_list.length;i++) {
				this.data.car_shopping_list[i].selectStatus = true
			}
			this.setData({
				car_shopping_list:this.data.car_shopping_list
			})
			
		}else {
			this.setData({
				checkedStatus:"",
				checkedStatusToggle:false
			});
			for (var i=0;i<this.data.car_shopping_list.length;i++) {
				this.data.car_shopping_list[i].selectStatus = false
			}
			this.setData({
				car_shopping_list:this.data.car_shopping_list
			})
		}
    var tempPrice = 0;
    for (var i = 0; i < this.data.car_shopping_list.length; i++) {
      if (this.data.car_shopping_list[i].selectStatus) {
        tempPrice += this.data.car_shopping_list[i].goodsPrice;
      }
    }
    // console.log(tempPrice)
    this.setData({
      allPriceValue: tempPrice
    })

	}
})