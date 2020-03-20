var fs = require("fs");
function formatDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if(hour<10){
    hour = "0" + hour;
  }
  if(minutes<10){
    minutes = "0"+minutes;
  }
  if(seconds<10){
    seconds = "0"+seconds;
  }
   return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  // return `${year}-${month}-${day}`;
}
function handleImageURL(data,baseURL) {
  
  for (let i = 0; i < data.length; i++) {
   
    var  imageURL= `${baseURL}${data[i].typeid}/${data[i].category}/${data[i].goodsid}/`;
    console.log(imageURL)
    data[i].goodsimage = [];
    for (var j = 1; j < 5; j++) {
      data[i].goodsimage.push(imageURL + "0" + j + ".jpg");
    }
  }
}
//递归创建目录
function createMoreContents(arr,baseURL,len) {
  var i = 0;
  var baseUrl =baseURL;
  return diGUIDo(arr, len);
  function diGUIDo(arr, len) {
      if (i === len) {
        return true;
      }        
      baseUrl += "/" + arr[i];
      fs.mkdir(baseUrl, function (err) {
          if (err) {
              return console.error(err);
          }
          i++;
          diGUIDo(arr, len);
      });
  }
}
module.exports = {
  formatDate,
  handleImageURL,
  createMoreContents
}
