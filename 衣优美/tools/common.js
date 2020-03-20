var { postRequest } = require("./request");
var Domain = require("./domain");
function forMatDate(defaultDate) {
    var tempDate = defaultDate || new Date();
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
}
function handleAuditLog(currentUserId,operateway,callback){
        var url = Domain + "setAuditLog";
        var auditInfo = {
          operateway:operateway,
          userid:currentUserId,
          operatetime:forMatDate()
        };
        postRequest(url,auditInfo,function(res){
        //   if(res.data){
        //     console.log(res.data)
        //   }
            if(callback){
                callback(res);
            }
        
        })
}

module.exports = {
    forMatDate,
    handleAuditLog
}
