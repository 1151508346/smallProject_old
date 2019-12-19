var app = getApp();
var { getRequest,postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		checkedStatus: "selected",

		checkedStatusToggle: true,
		car_shopping_list: [
			// {
			// 	goodsName:"aaa打扫房间克鲁赛德后方可上岛咖啡",
			// 	goodsPrice:10.1,
			// 	goodsImage:"/static/init.jpg",
			// 	defaultValue:1
			// },
			// {
			// 	goodsName:"aaa打扫房间克鲁赛德后方可上岛房间克鲁赛德后方可上房间克鲁赛德后方可上房间克鲁赛德后方可上咖啡",
			// 	goodsPrice:10.0,
			// 	goodsImage:"/static/init.jpg",
			// 	defaultValue:1
			// }
		],
		allPriceValue: 0.00
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
	initBuyCarSelected(){
		var length = this.data.car_shopping_list.length;
		var newData = this.data.car_shopping_list.map((value, index) => {
			value.selectStatus = true;
			return value;
		})
		// console.log(newData);
		this.setData({
			car_shopping_list: newData
		});
		var tempPriceValue = 0.00;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				tempPriceValue += this.data.car_shopping_list[i].goodsprice*this.data.car_shopping_list[i].buycount;
			}
		}

		this.setData({
			allPriceValue: tempPriceValue
		})
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var _that = this;
		this.getNativeUsername(function (res) {
			//res.data ->username;
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
			/**
			 * username->userid
			 */
			// console.log(res.data)
			var url = Domain + "initBuyCar?username=" + res.data;
			getRequest(url, function (res) {
				// console.log(res)
				if (!res.data) {
					console.log("get buyCar list error");
					return;
				}
				console.log(res.data);
				_that.setData({
					car_shopping_list: res.data
				})
				_that.initBuyCarSelected();

			})

		});
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
	handleSwitchBarShoppingPage() {
		app.globalData.defaultValue = "car"
		wx.switchTab({
			url: '/pages/shopping/index'
		});
	},
	toggleCheck(e) {
		var index = e.currentTarget.dataset.index;
		if (!this.data.car_shopping_list[index].selectStatus) {
			this.data.car_shopping_list[index].selectStatus = true
			this.setData({
				checkedStatus: "",
				car_shopping_list: this.data.car_shopping_list
			})
		} else {
			this.data.car_shopping_list[index].selectStatus = false
			this.setData({
				checkedStatus: "",
				car_shopping_list: this.data.car_shopping_list,
			})
		}
		var temp = this.data.car_shopping_list.length;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (!this.data.car_shopping_list[i].selectStatus) {
				break;
			}
		}
		if (temp === i) {
			this.setData({
				checkedStatus: "checked",
				checkedStatusToggle: true
			})
		} else {
			this.setData({
				checkedStatus: "",
				checkedStatusToggle: false
			})
		}
		/**
     * 点击列表中商品获取选中的商品，改变总值为selectStatus=true的goodsPrice
     */
		var tempPrice = 0;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				tempPrice += this.data.car_shopping_list[i].goodsprice*this.data.car_shopping_list[i].buycount;
			}
		}
		// console.log(tempPrice)
		this.setData({
			allPriceValue: tempPrice
		})


	},
	addBuyNum(e) {
		var index = e.currentTarget.dataset.index;
		++this.data.car_shopping_list[index].buycount;
		this.setData({
			car_shopping_list: this.data.car_shopping_list
		});
		// this.initBuyCarSelected();

		var tempPriceValue =this.data.allPriceValue 
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				this.data.allPriceValue += this.data.car_shopping_list[i].goodsprice*this.data.car_shopping_list[i].buycount;
			}
		}

		this.setData({
			allPriceValue: tempPriceValue
		});
		var updateInfo = {
			userid:this.data.car_shopping_list[index].userid,
			goodsid:this.data.car_shopping_list[index].goodsid,
			buysize:this.data.car_shopping_list[index].buysize,
			buycount:this.data.car_shopping_list[index].buycount,
		}
		this.updateBuyCarCount(updateInfo)
		// console.log(updateInfo)
	},
	updateBuyCarCount(updateInfo){
		var url = Domain + "updateBuyCarCount?userid=" + updateInfo.userid+"&goodsid="+updateInfo.goodsid+"&buysize="+updateInfo.buysize+"&buycount="+updateInfo.buycount;
			getRequest(url, function (res) {
				// console.log(res)
				if (!res.data) {
					console.log("get buyCar list error");
					return;
				}
				console.log(res.data);
				// _that.initBuyCarSelected();
			})
	},
	reduceBuyNum(e) {
		var index = e.currentTarget.dataset.index;
		--this.data.car_shopping_list[index].buycount;
		/*isRequestFlag 标志 ：是否发送请求更新购物车货物的数量，
			当buycount-购物商品的数量小于1的时候将其改为1，并将isRequestFlag =false
			不发送请求去更新数据库buycar中商品的数量
		*/
		var isRequestFlag = true;  
		if(this.data.car_shopping_list[index].buycount<1){
			isRequestFlag = false;
			this.data.car_shopping_list[index].buycount = 1
		}
		this.setData({
			car_shopping_list: this.data.car_shopping_list
		})
		// this.initBuyCarSelected();
		var tempPriceValue = 0.00;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				tempPriceValue += this.data.car_shopping_list[i].goodsprice*this.data.car_shopping_list[i].buycount;
			}
		}

		this.setData({
			allPriceValue: tempPriceValue
		})

		//  console.log(this.data.car_shopping_list[index].buycount);
		if(!isRequestFlag){
			return;
		}
		var updateInfo = {
			userid:this.data.car_shopping_list[index].userid,
			goodsid:this.data.car_shopping_list[index].goodsid,
			buysize:this.data.car_shopping_list[index].buysize,
			buycount:this.data.car_shopping_list[index].buycount,

		}
		this.updateBuyCarCount(updateInfo)
		// var url = Domain + "updateBuyCarCount?userid=" + updateInfo.userid+"&goodsid="+updateInfo.goodsid+"&buysize="+updateInfo.buysize+"&buycount="+updateInfo.buycount;
		// console.log(updateInfo)
		// console.log(this.data.car_shopping_list)
	},
	allSelectStatusToggle() {
		if (!this.data.checkedStatusToggle) {
			this.setData({
				checkedStatus: "selected",
				checkedStatusToggle: true
			})
			for (var i = 0; i < this.data.car_shopping_list.length; i++) {
				this.data.car_shopping_list[i].selectStatus = true
			}
			this.setData({
				car_shopping_list: this.data.car_shopping_list
			})

		} else {
			this.setData({
				checkedStatus: "",
				checkedStatusToggle: false
			});
			for (var i = 0; i < this.data.car_shopping_list.length; i++) {
				this.data.car_shopping_list[i].selectStatus = false
			}
			this.setData({
				car_shopping_list: this.data.car_shopping_list
			})
		}
		var tempPrice = 0;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				tempPrice += this.data.car_shopping_list[i].goodsprice;
			}
		}
		// console.log(tempPrice)
		this.setData({
			allPriceValue: tempPrice
		})

	},
	//获取本地缓存中的用户信息
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
	deleteSelectedGoodsList(){
		console.log("====================delete===================");
		// console.log(this.data.checkedStatusToggle)
		if(this.data.car_shopping_list.length===0){
			wx.showToast({
				title: '购物车为空',
				icon: 'none',
				duration: 1500,
				mask: false,
			});
		}
		var deleteObjList = [];
		//表示全部商品是否被选中，选中状态下点击删除按钮会将购物车清空
		if(this.data.checkedStatusToggle){
			deleteObjList = this.data.car_shopping_list;
			this.data.car_shopping_list.forEach(function(item){
				deleteObjList.push({
					userid:item.userid,
					goodsid:item.goodsid,
					buycount:item.buycount,
					buysize:item.buysize
				});
			})
			this.setData({
				car_shopping_list:[],
				allPriceValue:0
			})
		}
		var _that = this;
		//temp_car_shopping_list 临时使用的数组，用于将选中的数据删除掉，把删除掉数据的temp_car_shopping_list重新复制给car_shopping_list 
		var temp_car_shopping_list = [];
		
			temp_car_shopping_list = this.data.car_shopping_list;
			var new_car_shopping_list = [];
			var length = temp_car_shopping_list.length;
			for(var i =0 ;i<length;i++){
				if(temp_car_shopping_list[i].selectStatus){
					var deleteItem = temp_car_shopping_list[i];
					// console.log(deleteItem)
					deleteObjList.push({
						userid:deleteItem.userid,
						goodsid:deleteItem.goodsid,
						buycount:deleteItem.buycount,
						buysize:deleteItem.buysize
					});
				}else{
					new_car_shopping_list.push(
						temp_car_shopping_list[i]
					)
				}
			}
			_that.setData({
				car_shopping_list:new_car_shopping_list
			});
		
		var url = Domain+"deleteBuyCarGoods"
		postRequest(url,deleteObjList,function(res){
			if(!res.data){
				wx.showToast({
					title: '删除失败',
					icon: 'none',
					duration: 1500,
					mask: false,
				});
				return;
			}
			if(res.data.type === "deleteSuccess" && res.data.status === "200"){
				wx.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500,
					mask: false,
				});
				return;
			}
			
		})
	}
})