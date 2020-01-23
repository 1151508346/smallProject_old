var app = getApp();
var { getRequest, postRequest } = require("../../tools/request.js");
var Domain = require("../../tools/domain");
var getNativeUsername = require("../../tools/getNativeUsername");

var getNativeUserId = require("../../tools/getNativeUserId");
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
		allPriceValue: 0.00,
		parforStatus: false,
		userAddress: [],

	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
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
				// console.log(res.data);
				_that.setData({
					car_shopping_list: res.data
				})
				_that.initBuyCarSelected();

			})

		});
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
	},
	initBuyCarSelected() {
		var length = this.data.car_shopping_list.length;
		var newData = this.data.car_shopping_list.map((value, index) => {
			value.selectStatus = true;
			return value;
		})
		this.setData({
			car_shopping_list: newData
		});
		var tempPriceValue = 0.00;
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus) {
				tempPriceValue += this.data.car_shopping_list[i].goodsprice * this.data.car_shopping_list[i].buycount;
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
		
		if (app.globalData.path === "/pages/payfor/index") {
			/**
			 * 没有支付进入待付款中
			 * 获取选中的商品  
			 * 发送ajax ，insert selected的 shopping
			 */
			var tempSendData = [];
			var _that = this;
			// 2019-12-11 20:24:46
			for (var i = 0; i < _that.data.car_shopping_list.length; i++) {
				if (_that.data.car_shopping_list[i].selectStatus) {
					tempSendData.push({
						goodsid: _that.data.car_shopping_list[i].goodsid,
						userid: _that.data.car_shopping_list[i].userid,
						purchasetime: this.forMatDate(),
						count: _that.data.car_shopping_list[i].buycount,
						size: _that.data.car_shopping_list[i].buysize,
						// goodsstatus = 0 表示待支付状态
						goodsstatus: 0,
					});
				}
			}
			//将待支付的商品插入到order表中
			var url = Domain + "cancelPayFor";
			postRequest(url, tempSendData, function (res) {
				if (res.data.type === "cancelSuccess" && res.data.status === "200") {
					wx.showToast({
						title: '您已取消支付',
						icon: 'none',
						duration: 1500,
						mask: false,
					});
					return;
				}
				wx.showToast({
					title: '服务器出现错误',
					icon: 'none',
					duration: 1500,
					mask: false,
				});
			})
		}
	},
	//格式化日期
	forMatDate() {
		var tempDate = new Date();
		var year = tempDate.getFullYear();
		var month = tempDate.getMonth() + 1;
		var date = tempDate.getDate();
		var hour = tempDate.getHours();
		var minutes = tempDate.getMinutes();
		var seconds = tempDate.getSeconds();

		if (month < 10) {
			return year + "-0" + month + "-" + date + " " + hour + ":" + minutes + ":0" + seconds;
		}
		if (date < 10) {
			return year + "-" + month + "-0" + date + " " + hour + ":" + minutes + ":0" + seconds;
		}
		if (hour < 10) {
			return year + "-" + month + "-" + date + " 0" + hour + ":" + minutes + ":0" + seconds;
		}
		if (minutes < 10) {
			return year + "-" + month + "-" + date + " " + hour + ":0" + minutes + ":0" + seconds;
		}
		if (seconds < 10) {
			return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":0" + seconds;
		}
		return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + seconds;
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
				tempPrice += this.data.car_shopping_list[i].goodsprice * this.data.car_shopping_list[i].buycount;
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
		var tempPriceValue = this.data.allPriceValue
		for (var i = 0; i < this.data.car_shopping_list.length; i++) {
			if (this.data.car_shopping_list[i].selectStatus && i === index) {
				tempPriceValue += this.data.car_shopping_list[i].goodsprice * this.data.car_shopping_list[i].buycount;
			}
		}
		// console.log(tempPriceValue)
		this.setData({
			allPriceValue: tempPriceValue
		});
		var updateInfo = {
			userid: this.data.car_shopping_list[index].userid,
			goodsid: this.data.car_shopping_list[index].goodsid,
			buysize: this.data.car_shopping_list[index].buysize,
			buycount: this.data.car_shopping_list[index].buycount,
		}
		this.updateBuyCarCount(updateInfo)
		// console.log(updateInfo)
	},
	updateBuyCarCount(updateInfo) {
		var url = Domain + "updateBuyCarCount?userid=" + updateInfo.userid + "&goodsid=" + updateInfo.goodsid + "&buysize=" + updateInfo.buysize + "&buycount=" + updateInfo.buycount;
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
		if (this.data.car_shopping_list[index].buycount < 1) {
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
				tempPriceValue += this.data.car_shopping_list[i].goodsprice * this.data.car_shopping_list[i].buycount;
			}
		}

		this.setData({
			allPriceValue: tempPriceValue
		})

		//  console.log(this.data.car_shopping_list[index].buycount);
		if (!isRequestFlag) {
			return;
		}
		var updateInfo = {
			userid: this.data.car_shopping_list[index].userid,
			goodsid: this.data.car_shopping_list[index].goodsid,
			buysize: this.data.car_shopping_list[index].buysize,
			buycount: this.data.car_shopping_list[index].buycount,

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
	deleteSelectedGoodsList() {
		console.log("====================delete===================");
		// console.log(this.data.checkedStatusToggle)
		var deleteObjList = this.handleSelecedShopping("delete");
		if (!deleteObjList) {
			return;
		}

		var url = Domain + "deleteBuyCarGoods";
		postRequest(url, deleteObjList, function (res) {
			if (!res.data) {
				wx.showToast({
					title: '删除失败',
					icon: 'none',
					duration: 1500,
					mask: false,
				});
				return;
			}
			if (res.data.type === "deleteSuccess" && res.data.status === "200") {
				wx.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500,
					mask: false,
				});
				return;
			}

		})
	},
	handleSelecedShopping(operateType) {
		var _that = this;

		if (this.data.car_shopping_list.length === 0) {
			wx.showToast({
				title: '购物车为空',
				icon: 'none',
				duration: 1500,
				mask: false,
			});
		}
		var handleObjList = [];
		//表示全部商品是否被选中，选中状态下点击删除按钮会将购物车清空
		if (operateType === "delete") {
			if (this.data.checkedStatusToggle) {
				handleObjList = this.data.car_shopping_list;
				var tempHandleObjList = [];
				this.data.car_shopping_list.forEach(function (item) {
					tempHandleObjList.push({
						userid: item.userid,
						goodsid: item.goodsid,
						buycount: item.buycount,
						buysize: item.buysize
					});
				});
				this.setData({
					car_shopping_list: [],
					allPriceValue: 0
				});
				return tempHandleObjList;
			}
		}
		if (operateType === "payfor") {
			console.log("payfor");
			if (this.data.checkedStatusToggle) {
				handleObjList = this.data.car_shopping_list;
				var tempHandleObjList = [];
				this.data.car_shopping_list.forEach(function (item) {
					tempHandleObjList.push({
						userid: item.userid,
						goodsid: item.goodsid,
						buycount: item.buycount,
						buysize: item.buysize
					});
				});
				// _that.payForAlert(_that);
				return tempHandleObjList;
				// this.setData({
				// 	car_shopping_list:[],
				// 	allPriceValue:0
				// });
			}
		}
		// var _that = this;
		//temp_car_shopping_list 临时使用的数组，用于将选中的数据删除掉，把删除掉数据的temp_car_shopping_list重新复制给car_shopping_list 
		var temp_car_shopping_list = [];
		temp_car_shopping_list = this.data.car_shopping_list;
		var new_car_shopping_list = [];
		var length = temp_car_shopping_list.length;
		for (var i = 0; i < length; i++) {
			if (temp_car_shopping_list[i].selectStatus) {
				var deleteItem = temp_car_shopping_list[i];
				// console.log(deleteItem)
				handleObjList.push({
					userid: deleteItem.userid,
					goodsid: deleteItem.goodsid,
					buycount: deleteItem.buycount,
					buysize: deleteItem.buysize
				});
			} else {
				new_car_shopping_list.push(
					temp_car_shopping_list[i]
				);
			}
		}

		if (operateType === "payfor") {

		} else {
			this.setData({
				car_shopping_list: new_car_shopping_list
			});
		}
		// console.log(handleObjList.length);
		if (handleObjList.length === 0) {
			wx.showToast({
				title: '~亲~,没有选中商品',
				icon: 'none',
				duration: 1500,
				mask: false,
			});
			return;
		}
		return handleObjList;
	},
	payForAlert() {
		var _that = this;
		console.log(this.data.checkedStatusToggle)
		var temp_car_shopping_list = this.data.car_shopping_list
		for (var i = 0; i < temp_car_shopping_list.length; i++) {
			console.log(temp_car_shopping_list[i].selectStatus)
			if (temp_car_shopping_list[i].selectStatus) {
				break;
			}
		}
		if (temp_car_shopping_list.length === i) {
			wx.showToast({
				title: '~亲~,没有选中商品！',
				icon: 'none',
				duration: 1500,
				mask: false,
			});
			return;
		}

		wx.showModal({
			title: '支付',
			content: '您要支付的金额: ' + _that.data.allPriceValue + ' 元',
			success(res) {
				if (res.confirm) {
					var payForObjList = _that.handleSelecedShopping('payfor');
					// console.log(payForObjList);
					if (!payForObjList) {
						wx.showToast({
							title: '支付出现异常',
							icon: 'none',
							duration: 1500,
							mask: false,
						});
						return;
					}
					app.globalData.payForObjList = payForObjList;
					wx.navigateTo({
						url: "/pages/payfor/index?payforMoney=" + _that.data.allPriceValue,
						success: function () {
							//        console.log('跳转到news页面成功')// success              
						},
						fail: function () {
							//     console.log('跳转到news页面失败')   fail 
						}
					})

				} else if (res.cancel) {
					wx.showToast({
						title: '~亲~,您取消了支付',
						icon: 'none',
						duration: 1500,
						mask: false,
					});
				}
			}
		})
	},
	//结算
	handelPayforSelectedGoods() {
		var _that = this;
		getNativeUserId(function (res) {
			if (res.data) {
				_that.getInitAddress(res.data);
			} else {
				wx.showToast({
					title: '您还没有登录哦',
					icon: 'none',
					duration: 1500,
					mask: false,
				});
			}
		});
		// console.log("可以结算了");
	},
	getInitAddress(userid) {
		var _that = this;
		var url = Domain + "initAddress?userid=" + userid;
		getRequest(url, function (res) {
			// console.log(res.data);
			// console.log(res.data)
			if (res.data) {
				_that.setData({
					userAddress: res.data
				})
			}
			// console.log(_that.data.userAddress.length);
			if (_that.data.userAddress.length === 0) {
				// wx.showToast({
				// 	title: '您还没有收货地址',
				// 	icon: 'none',
				// 	duration: 1500,
				// 	mask: false,
				// 	complete: () => {
						
				// 	}
				// });
				wx.showModal({
					title: '提示',
					content: '您还没有添加收货地址，是否添加',
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: "/pages/add_address/index",
								success: function () {
								},
								fail: function () {
								}
							})
						} else if (res.cancel) {
							wx.showToast({
								title: '取消添加收货地址',
								icon: 'none',
								duration: 1500,
								mask: false,
							});
						}
					}
				})
				return;
			}
			var userAddressNum  = _that.data.userAddress.length;
			for (var i= 0; i <userAddressNum; i++) {
				if(_that.data.userAddress[i].isdefault ===1){
					break;
				}
			}
			if(i===userAddressNum){
				wx.showModal({
					title: '提示',
					content: '是否设置默认收货地址',
					success(res) {
						if (res.confirm) {
							wx.navigateTo({
								url: "/pages/user_address/index",
								success: function () {
								},
								fail: function () {
								}
							})
						} else if (res.cancel) {
							wx.showToast({
								title: '取消设置默认收货地址',
								icon: 'none',
								duration: 1500,
								mask: false,
							});
						}
					}
				})
				return ;
			}

			_that.payForAlert();

		})
	}
})