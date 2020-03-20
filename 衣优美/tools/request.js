function getRequest(url,callback){
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
}
function postRequest(url,data,callback){
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: url,
    data: JSON.stringify(data),
    header: {
      "content-type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json"
    },
    method: 'post',
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
}

module.exports = {
    getRequest,
    postRequest
}