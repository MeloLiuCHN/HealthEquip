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
angular.module('myApp', ["ui.router","ngCookies","CommService"])
.controller('myCtrl',['$scope','CommonFunction',
    function($scope,CommonFunction) {
	
	// 初始化设备列表
	$scope.list = null;
	$scope.query = function(){
		if($scope.equipid == null ||$scope.equipid == ''){
			$scope.list = null;
			return;
		}
		var index = CommonFunction.layerLoading("正在加载数据");
		CommonFunction.zteHttp('post','/wechat/user/showdata',{
            equipid:$scope.equipid
		},function(data){
			CommonFunction.layerClose(index);
    		if (data.result == 0){
    			$scope.list = data.rtnMap.list;
    		}
    		if(data.result == 101){
    			CommonFunction.layerMsg("查询失败");
    		}
    	},function(data){
    		CommonFunction.layerClose(index);
    		CommonFunction.layerMsg("查询失败");
    	});
	}
}]);
