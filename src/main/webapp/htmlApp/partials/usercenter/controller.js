/**
 * Created by wangjiacheng on 2016/9/21.
 */
'use strict';

//服务请求地址
//获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
var curWwwPath=window.document.location.href;
//获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
var pathName=window.document.location.pathname;
var pos=curWwwPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8083
var localhostPaht=curWwwPath.substring(0,pos);
//获取带"/"的项目名，如：/uimcardprj
var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);

var baseUrl=localhostPaht+projectName;


angular.module('UserCenterApp', [
    "ngSanitize",
    "ui.router",
    "ngCookies",
    "UserCenterApp.Weuser",
    "CommService"
    ])
    .config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/wusercenter');
    }]).run(function ($rootScope, $location, CommonFunction) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {
    	// S 微信扫一扫配置
    	/*layer.alert("1"+encodeURIComponent(location.href.split("#")[0]))
    	CommonFunction.zteHttp('post','/wechat/getWechatConfig',{
    		 url : encodeURIComponent(location.href.split("#")[0])
		},function(data){
			wx.config({
			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: data.rtnMap.appId, // 必填，公众号的唯一标识
			    timestamp: data.rtnMap.timestamp, // 必填，生成签名的时间戳
			    nonceStr: data.rtnMap.noncestr, // 必填，生成签名的随机串
			    signature: data.rtnMap.signature,// 必填，签名，见附录1
			    jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
			wx.error(function(res){
				console.log(res)
				layer.alert("1"+JSON.stringify(res))
				debugger;
			    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
			});
		});*/
    	// E 微信扫一扫配置
            /*if(toState.name != "login" || toState.name != "reg" || toState.name != "forget"){
                if(CommonFunction.ctrlCookie('get','login.userName')==undefined){
                    event.preventDefault();
                    CommonFunction.gotoPage('login',false);
                }
            }*/
        });
});
