/**
 * Created by chenyafeng on 2017/6/10.
 */
'use strict';

angular.module('Main', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('main', {
            	abstract: true,
                url: "/main",
                templateUrl: 'partials/manager/main.html',
                controller: 'MainController'
            });
    }])
    .controller('MainController', ['$scope', '$interval', 'CommonFunction', 'ParamsFunction', 'placeholder', function ($scope, $interval, CommonFunction, ParamsFunction, placeholder) {

    	// 获取登录信息
    	var manager = ParamsFunction.getParams("manager.loginInfo","",false);
    	if(manager!=null && manager!=""){
    		$scope.manager = angular.fromJson(manager);
    	}
		// 获取当前时间
		$scope.theTimeNow = new Date().toLocaleString();
		$interval(function () {
			$scope.theTimeNow =  new Date().toLocaleString();
		}, 1000);
		// 初始化菜单数据
		$scope.menus = [
           {id:'1',txt:'数据统计',url:'main.data',icon:'menu-icon-(1).png',iconCurrent:'menu-icon-current-(1).png',selected:false},
           {id:'2',txt:'广告消息',url:'main.mess',icon:'menu-icon-(2).png',iconCurrent:'menu-icon-current-(2).png',selected:false},
           {id:'3',txt:'机构管理',url:'main.inst',icon:'menu-icon-(3).png',iconCurrent:'menu-icon-current-(3).png',selected:false},
           {id:'4',txt:'设备管理',url:'main.equip',icon:'menu-icon-(4).png',iconCurrent:'menu-icon-current-(4).png',selected:false}
           
       ];
		// 初始化标签数据
		$scope.labels = [];
		
		// 设置选中样式
		$scope.setSelected = function(id) {
			for (var m = 0; m < $scope.menus.length; m++) {
				if ($scope.menus[m].id == id) {
					$scope.menus[m].selected = true;// 设置当前选中菜单样式
					var flag = false;
					for (var n = 0; n < $scope.labels.length; n++) {
						if ($scope.labels[n].id == id) {
							flag = true;
							$scope.labels[n].selected = true; // 设置label选中样式
						} else {
							$scope.labels[n].selected = false;
						}
					}
					if (!flag) { //如果label不存在，添加
						var label = {
							id : $scope.menus[m].id,
							txt : $scope.menus[m].txt,
							url : $scope.menus[m].url,
							selected : $scope.menus[m].selected
						};
						$scope.labels.push(label);
					}
				} else {
					$scope.menus[m].selected = false;
				}
			}
		}
		// 设置默认选中
		var labelsStr = ParamsFunction.getParams("manager.labels", "", false);
		if (labelsStr != null && labelsStr != "") {
			var labels = angular.fromJson(labelsStr);
			angular.forEach(labels, function(data, index) {
				if (data.selected) {
					$scope.labels = labels;
					$scope.setSelected(data.id);
				}
			});
		} else {
			$scope.setSelected('1');
		}
		// 点击左侧菜单
		$scope.changeMenu = function(index){
			//$scope.setSelected($scope.menus[index].id);//设置样式
			CommonFunction.gotoPage($scope.menus[index].url);//跳转页面
			ParamsFunction.setParams('manager.labels', angular.toJson($scope.labels));//存储label信息，页面刷新时使用
		}
		// 点击标签
		$scope.changeLabel = function(index){
			//$scope.setSelected($scope.labels[index].id);//设置样式
			CommonFunction.gotoPage($scope.labels[index].url);//跳转页面
			ParamsFunction.setParams('manager.labels', angular.toJson($scope.labels));
		}
		// 关闭标签
		$scope.closeLabel = function(index) {
			if ($scope.labels.length == 1) {
				CommonFunction.layerMsg("至少保留一个标签页");
				return;
			}
			var label = $scope.labels[index];
			$scope.labels.splice(index, 1);// 删除对象
			// 如果关闭的是已选中的标签
			if (label.selected) {
				//$scope.setSelected($scope.labels[$scope.labels.length-1].id);//设置样式
				CommonFunction.gotoPage($scope.labels[$scope.labels.length-1].url);
			}
			ParamsFunction.setParams('manager.labels', angular.toJson($scope.labels));
		}
		//退出登录
    	$scope.logout = function(){
			var index = layer.confirm('确定退出登录?', {
				icon : 3,
				btn : [ '确定', '取消' ]
				}, function() {
					layer.close(index);
					var loadingIndex = CommonFunction.layerLoading("正在注销");
					ParamsFunction.delParams('manager.labels');
					ParamsFunction.delParams('manager.loginInfo');
		    		CommonFunction.zteHttp('post','/login/logout',{},function(data){
		    			layer.close(loadingIndex);
		    			CommonFunction.gotoPage('login'); //跳转页面
		        	},function(data){
		        		layer.close(loadingIndex);
		        		CommonFunction.gotoPage('login');
		        	});
				}, function() {
					layer.close(index);
			});
    	}
    	
    	$scope.showchangepwd = function(){
    		var index = layer.open({
    			title:'修改密码',
    			type:1,
    			btn:['确认','取消'],
    			area:['400px','300px'],
    			content:$("#changepwd"),
    			cancel:function(){
    				$scope.password=null;
    				$scope.password2=null;
    				layer.close(index);
    			},
    			yes:function(){
    				$scope.changepwd();
    			}
    		});
    	}
    	$scope.changepwd = function(){
    		if ($scope.password == null || $scope.password == "") {
    			CommonFunction.layerTips("请输入密码","#password");
    			return;
    		}
    		if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test($scope.password)) {
    			CommonFunction.layerTips("密码由6~16位数字和字母组成","#password");
    			return;
    		}
    		if ($scope.password2 == null || $scope.password2 == "") {
    			CommonFunction.layerTips("请输入确认密码","#password2");
    			return;
    		}
    		if ($scope.password != $scope.password2) {
    			CommonFunction.layerTips("两次输入密码不一致","#password2");
    			return;
    		}
    		CommonFunction.zteHttp('post','/manager/changepwd',{
    			id:$scope.manager.id,
    			password:$scope.password
    		},function(data){
                var result = data.result;
                if(result == "101"){
                	CommonFunction.layerMsg("修改失败，请稍后重试");
                }
                if(result == "0"){
                	CommonFunction.layerMsg("密码修改成功",function(){
                		layer.closeAll();
        				CommonFunction.gotoPage("login");//跳转返回
        			});
                }
            
    		},function(data){
        		CommonFunction.layerMsg("请求失败，请稍后重试");
        	});
    	}
    }]);
