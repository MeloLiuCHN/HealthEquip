// var version=window.localStorage.getItem('version');//app版本
// var dtoken=window.localStorage.getItem('dtoken');//设备厂家
var struserId=window.localStorage.getItem('strUserId');//业主电话
var userImg=window.localStorage.getItem('userImg');
var firstUse=window.localStorage.getItem('firstUse');
var strAlias=window.localStorage.getItem('strAlias');
var curscope=undefined;
var setAlias = function (alias) {
    strAlias=alias;
    window.localStorage.setItem('strAlias',alias);
};
var setlocalStore = function (name, value) {
    window.localStorage.setItem(name, value);
};
