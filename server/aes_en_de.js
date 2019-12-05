var crypto = require("crypto");
function aesEncrypt(data, key) {
    if(!key) key = "1qaz!QAZ";
    const cipher = crypto.createCipher('aes128', key);
    // const cipher = crypto.createCipher('aes-128-ccm', key);
    // aes-128-ccm
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}


function aesDecrypt(encrypted, key) {
    if(!key) key = "1qaz!QAZ";
    const decipher = crypto.createDecipher('aes128', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
var data = 'Hello,';
// var key = 'Password!';
// var encrypted = aesEncrypt(data ) 
// var decrypted = aesDecrypt(encrypted);
// console.log(decrypted);//Hello, this is a secret message!

module.exports = { aesEncrypt, aesDecrypt}