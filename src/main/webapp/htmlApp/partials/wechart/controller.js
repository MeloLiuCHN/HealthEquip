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


angular.module('WechatApp', [
    "ngSanitize",
    "ui.router",
    "ngCookies",
    "WechatApp.WManager",
    "CommService"
    ])
    .config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/wmanagercharts');
    }]).run(function ($rootScope, $location, CommonFunction,ParamsFunction) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {
    
   
            /*if(toState.name != "login" || toState.name != "reg" || toState.name != "forget"){
                if(CommonFunction.ctrlCookie('get','login.userName')==undefined){
                    event.preventDefault();
                    CommonFunction.gotoPage('login',false);
                }
            }*/
        });
});
