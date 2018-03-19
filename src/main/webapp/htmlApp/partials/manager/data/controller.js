/**
 * Created by wangjiacheng on 2017/3/8.
 */
'use strict';

angular.module('InstData', [])

	.config(['$stateProvider', function($stateProvider) {

		$stateProvider
			.state('main.data', {
				url: "/data",
				templateUrl: 'partials/manager/data/data.html',
				controller: 'InstDataController'
			})
			.state('main.datadetail', {
				url: "/datadetail",
				templateUrl: 'partials/manager/data/datadetail.html',
				controller: 'InstDataDetailController'
			});
	}])
	.controller('InstDataController', ['$scope', 'CommonFunction', 'ParamsFunction', function($scope, CommonFunction, ParamsFunction) {
		$scope.setSelected("1");
		// 初始化分页参数
		$scope.paginationConf = {
			currentPage: 1,
			itemsPerPage: 10
		};
		// 初始化列表
		$scope.list = null;
		$scope.dayNum = 0; //今日检测次数
		$scope.monthNum = 0; //本月检测次数
		$scope.totalNum = 0; //总检测次数
		$scope.totalIncome = 0.00; //总收入
		// 定义查询对象
		$scope.searchModel = {};
		$scope.queryModel = angular.copy($scope.searchModel);
		// 查询
		$scope.search = function() {
			$scope.queryModel = angular.copy($scope.searchModel);
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}

		$scope.query = function() {
			var index = CommonFunction.layerLoading("正在加载数据");
			CommonFunction.zteHttp('post', '/instData/list', {
				page: {
					currentPage: $scope.paginationConf.currentPage,
					itemsPerPage: $scope.paginationConf.itemsPerPage
				},
				entity: $scope.queryModel
			}, function(data) {
				CommonFunction.layerClose(index);
				if(data.result == 0) {
					$scope.list = data.rtnMap.resultData;
					$scope.dayNum = data.rtnMap.dayNum;
					$scope.monthNum = $scope.subWan(data.rtnMap.monthNum);
					$scope.totalNum = $scope.subWan(data.rtnMap.totalNum);
					$scope.totalIncome = data.rtnMap.totalIncome;
					$scope.paginationConf.totalItems = data.rtnMap.totalCount;
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerClose(index);
				CommonFunction.layerMsg("请求失败，请稍后重试");
			});
		}
		$scope.subWan = function(str){
			var wan = str;
			if(str.length > 6){
				wan = str.substring(0,str.length-4) + '万';
			}
			return wan;
		}
		// 重置
		$scope.reset = function() {
			$scope.searchModel = {};
			$scope.queryModel = angular.copy($scope.searchModel);
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}

		// 跳转详细
		$scope.goDetail = function(instId) {
			ParamsFunction.setParams("manager.instData.instId", instId);
			CommonFunction.gotoPage('main.datadetail');
		}
		/** 监听分页模块 */
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
	}])
	.controller('InstDataDetailController', ['$scope', 'CommonFunction', 'ParamsFunction', function($scope, CommonFunction, ParamsFunction) {
		$scope.setSelected("1");
		//门店机构ID
		var instId = ParamsFunction.getParams("manager.instData.instId", "", false);

		$scope.totalJcNum = 0; //总检测次数
		$scope.totalJcIncome = 0.00; //总收入

		$scope.selectYear = []; //年份下拉框
		$scope.selectMonth = []; //月份下拉框

		$scope.minSelectDate; //日历控件最小可选日期

		// 初始化分页参数
		$scope.paginationConf = {
			currentPage: 1,
			itemsPerPage: 10
		};
		// 初始化列表
		$scope.list = null;
		// 定义查询对象
		$scope.searchModel = {};
		$scope.queryModel = angular.copy($scope.searchModel);
		$scope.searchModel.dateType = "month"; //默认选中按月查询
		// 查询
		$scope.search = function() {
			$scope.queryModel = angular.copy($scope.searchModel);
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}

		$scope.query = function() {
			var index = CommonFunction.layerLoading("正在加载数据");
			$scope.queryModel.instId = instId;
			CommonFunction.zteHttp('post', '/instData/listdetail', {
				page: {
					currentPage: $scope.paginationConf.currentPage,
					itemsPerPage: $scope.paginationConf.itemsPerPage
				},
				entity: $scope.queryModel
			}, function(data) {
				CommonFunction.layerClose(index);
				if(data.result == 0) {
					$scope.list = data.rtnMap.resultData;
					$scope.totalJcNum = data.rtnMap.totalNum; //总检测次数
					$scope.totalJcIncome = data.rtnMap.totalIncome; //总收入
					$scope.paginationConf.totalItems = data.rtnMap.totalCount; //总条数
					$scope.setSelectDate(data.rtnMap.minSelectDate); //设置可选日期
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerClose(index);
				CommonFunction.layerMsg("请求失败，请稍后重试");
			});
		}
		
		$scope.setSelectDate = function(minSelectDate) {
			if(minSelectDate==null){
				return;
			}
			// 设置日历控件最小可选日期
			$scope.minSelectDate = minSelectDate; 
			start.min = $scope.minSelectDate;
			// 如果开始时间不为空，截至时间的最小可选日期为开始时间
			if($scope.searchModel.dateStart!=null &&$scope.searchModel.dateStart !=''){
				end.min = $scope.searchModel.dateStart;
			}else{
				end.min = $scope.minSelectDate;
			}
			// 年份下拉框可选范围
			var str = minSelectDate.split("-");
			var minSelectYear = str[0];
			var date = new Date;
			var maxSelectYear = date.getFullYear();
			
			$scope.selectYear = [];
			for(var i = minSelectYear; i <= maxSelectYear; i++) {
				$scope.selectYear.push(i);
			}
		}
		//每次选择年份后重新设置月份下拉框
		$scope.setSelectMonth = function(selectYear) {
			$scope.selectMonth = [];
			$scope.searchModel.month = '';
			if($scope.selectYear.length == 0) {
				return;
			}
			var str = $scope.minSelectDate.split("-");
			var minMonth = str[1]; //最小可选月份
			var maxMonth = new Date().getMonth() + 1; //最大可选月份
			//1.如果不选择年份，月份下拉为空
			if(selectYear == null) {
				$scope.selectMonth = [];
			//2.如果只有一个年份，那么月份范围：min ~ max
			} else if($scope.selectYear.length == 1) { 
				for(var a = minMonth; a <= maxMonth; a++) {
					if(a.toString().length == 1) {
						$scope.selectMonth.push("0" + a);
					} else {
						$scope.selectMonth.push(a);
					}
				}
			//3.如果选择第一个年份，难么月份范围：min ~ 12
			} else if(selectYear == $scope.selectYear[0]) { //选择第一个年份
				for(var b = minMonth; b <= 12; b++) {
					if(b.toString().length == 1) {
						$scope.selectMonth.push("0" + b);
					} else {
						$scope.selectMonth.push(b);
					}
				}
			//4.如果选择最后一个年份，月份范围：1 ~ max
			} else if(selectYear == $scope.selectYear[$scope.selectYear.length - 1]) { //选择最后一个年份
				for(var c = 1; c <= maxMonth; c++) {
					if(c.toString().length == 1) {
						$scope.selectMonth.push("0" + c);
					} else {
						$scope.selectMonth.push(c);
					}
				}
			} else {
				$scope.selectMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
			}

		}
		// 重置
		$scope.reset = function() {
			var dateType = $scope.searchModel.dateType;
			$scope.searchModel = {};
			$scope.queryModel = angular.copy($scope.searchModel);
			$scope.searchModel.dateType = dateType; //时间类型保持不变
			//清空开始时间和截至时间
			document.getElementById("start").value = "";
			document.getElementById("end").value = "";
			//重置月份下拉框
			$scope.selectMonth = [];
			//恢复开始日期、截至日期的min/max可选值
			start.min = $scope.minSelectDate;
			start.max = laydate.now();
			end.min = $scope.minSelectDate;
			end.max = laydate.now();
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}
		// 开始日期
		var start = {
			elem: '#start',
			//event: 'focus', //如果不设置，默认click触发
			min: laydate.now(),
			max: laydate.now(),
			istoday:false,
			choose: function(data) {
				$scope.searchModel.dateStart = data;
				end.min = data; //选择开始日期后，设置截止日期最小可选为开始日期
			},
			lyclear: function() {
				$scope.searchModel.dateStart = null;
				end.min = minSelectEndDate; //开始日期清空后，恢复截至日期的最小可选
			},
			lyok: function(data) {
				$scope.searchModel.dateStart = data;
				end.min = data;
			},
			lytoday: function(data) {
				$scope.searchModel.dateStart = data;
				end.min = data;
			}
		};
		// 截至日期
		var end = {
			elem: '#end',
			//event: 'focus',
			min: laydate.now(),
			max: laydate.now(),
			istoday:false,
			choose: function(data) {
				$scope.searchModel.dateEnd = data;
				start.max = data;//选择截止日期后，设置开始日期最大可选为截止日期
			},
			lyclear: function() {
				$scope.searchModel.dateEnd = null;
				start.max = laydate.now(); //清空截止日期后，恢复开始日期最大可选
			},
			lyok: function(data) {
				$scope.searchModel.dateEnd = data;
				start.max = data;
			},
			lytoday: function(data) {
				$scope.searchModel.dateEnd = data;
				start.max = data;
			}
		};
		//选择开始日期
		$scope.layerDateStart = function() {
			laydate(start);
		}
		// 选择截至日期
		$scope.layerDateEnd = function() {
			laydate(end);
		}
		// 点击导出按钮
		$scope.exportData = function() {
			var index = layer.confirm('您确认要导出到Excel吗？', {
				icon : 3,
				btn : [ '确认', '取消' ]
				}, function() {
					layer.close(index);
					var params = angular.toJson($scope.queryModel);
					var url = baseUrl + '/instData/export?params=' + params;
					window.open(url);
				}, function() {
					layer.close(index);
			});
		}
		// 返回
		$scope.goBack = function() {
			CommonFunction.gotoPage('main.data');
		}
		/** 监听分页模块 */
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
	}]);