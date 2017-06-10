var util = require('./util.js');
/**
 * @param obj (leanCloud查询返回对象)
 * @returns formatObj
 */
function orderFormate(obj) {
    var retObj = {};
    retObj.author = obj.get('author'); //作者
    retObj.id = obj.id;
    retObj.title = obj.get('title');
    retObj.content = obj.get('content');
    retObj.time = obj.get('time');
    retObj.date = obj.get('date');
    retObj.positiondata = obj.get('positiondata');//位置
    retObj.pictures = obj.get('pictures');
    retObj.comments = obj.get('comments');
    retObj.updatedAt = obj.updatedAt;
    retObj.createdAt = obj.createdAt;
    retObj.formatDate = util.formatTime(obj.updatedAt);
    retObj.QRCode = obj.get('QRCode');
    return retObj;
}

module.exports = {
    orderFormat: orderFormate
}