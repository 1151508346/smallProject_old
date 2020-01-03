function formatDate() {
    var date = new Date();
    console.log()
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    // var hour = date.getHours();
    // var minutes = date.getMinutes();
    // console.log(minutes);
    // var seconds = date.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    // if(hour<10){
    //   hour = "0" + hour;
    // }
    // if(minutes<10){
    //   minutes = "0"+minutes;
    // }
    // if(seconds<10){
    //   seconds = "0"+seconds;
    // }
    // `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    return `${year}-${month}-${day}`;
  }
  function handleImageURL(data) {
    for (let i = 0; i < data.length; i++) {
      var imageURL = `${baseURL}${data[i].typeid}/${data[i].category}/${data[i].goodsid}/`;
      data[i].goodsimage = [];
      for (var j = 1; j < 5; j++) {
        data[i].goodsimage.push(imageURL + "0" + j + ".jpg");
      }
    }
  }
  module.exports = {
    formatDate,
    handleImageURL
  }
  