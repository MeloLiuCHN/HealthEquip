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

angular.module('HealthEquipApp', [
    "ngSanitize",
    "ui.router",
    "ngCookies",
    "Login",
    "Main",
    "Equip",
    "Inst",
    "InstData",
    "Mess",
    "CommService",
    "truncate",
    "tm.pagination",
    "html5.placeholder"
    ])
    .config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }]).run(function ($rootScope, $location, CommonFunction) {
    $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams, options) {
            if(toState.name != "login" && toState.name != "reg" && toState.name != "forget" && toState.name != "forgetlname"){
                if(CommonFunction.ctrlCookie('get','manager.loginInfo')==undefined){
                    event.preventDefault();
                    CommonFunction.gotoPage('login');
                }
            }
        });
});
