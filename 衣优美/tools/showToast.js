function showToast(title,icon){
    title = title||"";
    icon = icon||"none"
    wx.showToast({
        title: title,
        icon: icon,
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
        },
        fail: () => { },
        complete: () => { }
      });
}
module.exports = showToast;