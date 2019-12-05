module.exports = {
    checkUserName(username){
        // var rex = /[a-zA-Z][a-zA-Z0-9_*$%!@]{8,20}/
        // var Rex = /^[a-zA-z][a-zA-Z0-9_*!@#$%&]*$/
        var Rex = /^[a-zA-Z][a-zA-Z0-9]{8,20}/
        return Rex.test(username);
    } ,
    checkPassword(password){
        var Rex = /^[a-zA-z][a-zA-Z0-9_*!@#$%&]*$/
        return Rex.test(password);
    },
    isEmpty(userinfo){
        if(userinfo == "" || userinfo.trim() == "" || userinfo == null){
            return false;
        }
        return true;
    },
    checkEmail(email){
        var Rex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
       return Rex.test(email);
    },
    // checkTelphone(tel){
    //     var Rex = /^[1][0-9]{10}$/;
    //     return Rex.test(tel)
    // }
}