function getNativeUserId(callback) {
    wx.getStorage({
        key: 'userid', //检验本地缓存中有没有username用户信息，有则说明处于登录状态，反之为登录状态
        success: (result) => {
            
            callback(result)
        },
        fail: (res) => {
            callback(res)
        },
        complete: () => { }
    })
}
module.exports = getNativeUserId;