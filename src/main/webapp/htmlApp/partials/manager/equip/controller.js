/**
 * Created by chenyafeng on 2017/6/8.
 */
'use strict';

angular.module('Equip', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('main.equip', {
                url: "/equip",
                templateUrl: 'partials/manager/equip/equip.html',
                controller: 'EquipController'
            });
    }])
    .controller('EquipController', ['$scope', 'CommonFunction', 'ParamsFunction', function ($scope, CommonFunction, ParamsFunction) {
    	$scope.setSelected("4");
    	// 初始化分页参数
    	$scope.paginationConf = {
	        currentPage: 1,
	        itemsPerPage: 10
	    };
    	// 初始化设备列表
    	$scope.equiplist = null;
    	// 初始化查询对象
    	$scope.searchModel = {};
    	$scope.queryModel = angular.copy($scope.searchModel);
    	// 查询
    	$scope.search = function(){
    		$scope.queryModel = angular.copy($scope.searchModel);
    		if($scope.paginationConf.currentPage==1){
    			$scope.query();
    		}else{
    			$scope.paginationConf.currentPage=1;
    		}
    	}
    	$scope.query = function(){
    		var index = CommonFunction.layerLoading("正在加载数据");
    		CommonFunction.zteHttp('post','/equ/listequip',{
    			page : {
    	            currentPage : $scope.paginationConf.currentPage, 
    	            itemsPerPage : $scope.paginationConf.itemsPerPage
    	            },
	            entity : $scope.queryModel
    		},function(data){
    			CommonFunction.layerClose(index);
        		if (data.result == 0){
        			$scope.equiplist = data.rtnMap.resultData;
        			$scope.paginationConf.totalItems = data.rtnMap.totalCount;
        		}
        		if(data.result == 101){
        			CommonFunction.layerMsg(data.message);
        		}
        	},function(data){
        		CommonFunction.layerClose(index);
        		CommonFunction.layerMsg("请求失败，请稍后重试");
        	});
    	}
    	
    	// 重置
    	$scope.reset = function(){
    		$scope.searchModel = {};
    		$scope.queryModel = angular.copy($scope.searchModel);
    		if($scope.paginationConf.currentPage==1){
    			$scope.query();
    		}else{
    			$scope.paginationConf.currentPage=1;
    		}
    	}
    	/** 监听分页模块 */
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
    }]);