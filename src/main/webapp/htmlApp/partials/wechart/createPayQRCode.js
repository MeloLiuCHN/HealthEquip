//服务请求地址(全局变量)
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
	
/** 定义模型和控制器 */
angular.module('myApp', ["ui.router","ngCookies"])
.controller('myCtrl',['$scope',
    function($scope) {
	
	$scope.createPayQRCode = function(){
		$scope.imgurl = baseUrl + '/PayCode/createPayQRCode?machineID=' + $scope.machineID;
    }
	
}]);
