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

module.exports = {
    forMatDate
}
