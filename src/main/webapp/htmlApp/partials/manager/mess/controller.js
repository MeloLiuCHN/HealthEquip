/**
 * Created by chenyafeng on 2017/6/8.
 */
'use strict';

angular.module('Mess', [])

	.config(['$stateProvider', function($stateProvider) {

		$stateProvider
			.state('main.mess', {
				url: "/mess",
				templateUrl: 'partials/manager/mess/mess.html',
				controller: 'MessController'
			});
	}])
	.controller('MessController', ['$scope', 'CommonFunction', 'ParamsFunction', function($scope, CommonFunction, ParamsFunction) {
		$scope.setSelected("2");
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
		// 定义新增对象
		$scope.addModel = {};
		// 查询
		$scope.search = function() {
			if($scope.searchModel.uploadDate!=null &&$scope.searchModel.uploadDate!=''){
				if($scope.searchModel.publishDate!=null && $scope.searchModel.publishDate!=''){
					if($scope.searchModel.publishDate < $scope.searchModel.uploadDate){
						CommonFunction.layerTips("不能小于提交日期","#publishDate");
						return;
					}
				}
			}
			$scope.queryModel = angular.copy($scope.searchModel);
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}

		$scope.query = function() {
			var index = CommonFunction.layerLoading("正在加载数据");
			CommonFunction.zteHttp('post', '/mess/list', {
				page: {
					currentPage: $scope.paginationConf.currentPage,
					itemsPerPage: $scope.paginationConf.itemsPerPage
				},
				entity: $scope.queryModel
			}, function(data) {
				if(data.result == 0) {
					$scope.list = data.rtnMap.resultData;
					$scope.paginationConf.totalItems = data.rtnMap.totalCount;
					CommonFunction.layerClose(index);
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerMsg("请求失败，请稍后重试");
			});
		}
		$scope.addShow = false; //默认不显示新增区域
		// 重置
		$scope.reset = function() {
			$scope.searchModel = {};
			$scope.queryModel = angular.copy($scope.searchModel);
			//
			document.getElementById("uploadDate").value = "";
			document.getElementById("publishDate").value = "";
			if($scope.paginationConf.currentPage == 1) {
				$scope.query();
			} else {
				$scope.paginationConf.currentPage = 1;
			}
		}
		$scope.showAdd = function(){
			$scope.addShow = true; 
		}
		$scope.hideAdd = function(){
			$scope.addShow = false;
			$scope.addModel = {};
		}
		//发布日期
		var publishDate = {
				elem: '#publishDate',
				///min: $scope.minSelectDate,
				///max: laydate.now(),
				istoday:false,
				choose: function(data) {
					$scope.searchModel.publishDate = data;
				},
				lyclear: function() {
					$scope.searchModel.publishDate = null;
				},
				lyok: function(data) {
					$scope.searchModel.publishDate = data;
				},
				lytoday: function(data) {
					$scope.searchModel.publishDate = data;
				}
			};
			// 提交日期
			var uploadDate = {
				elem: '#uploadDate',
				//min: $scope.minSelectDate,
				//max: laydate.now(),
				istoday:false,
				choose: function(data) {
					$scope.searchModel.uploadDate = data;
				},
				lyclear: function() {
					$scope.searchModel.uploadDate = null;
				},
				lyok: function(data) {
					$scope.searchModel.uploadDate = data;
				},
				lytoday: function(data) {
					$scope.searchModel.uploadDate = data;
				}
			};
			// 发布日期
			$scope.layerDateP = function() {
				laydate(publishDate);
			}
			// 提交日期
			$scope.layerDateU = function() {
				laydate(uploadDate);
			}
		// 删除
		$scope.deleteMess = function(messId){
			var index = layer.confirm('您确认要删除该广告消息吗？', {
				icon : 3,
				btn : [ '确认', '取消' ]
				}, function() {
					layer.close(index);
					$scope.doDeleteMess(messId);
				}, function() {
					layer.close(index);
			});
		}
		$scope.doDeleteMess = function(messId){
			CommonFunction.layerLoading("正在删除");
			CommonFunction.zteHttp('post', '/mess/delete', {
				pk:messId
			}, function(data) {
				if(data.result == 0) {
					$scope.query();
					CommonFunction.layerMsg("删除成功");
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerMsg("操作失败，请稍后重试");
			});
		}
		// 发布
		$scope.publish = function(messId){
			var index = layer.confirm("您确认要发布该广告消息吗？", {
				icon : 3,
				btn : [ '确认', '取消' ]
				}, function() {
					layer.close(index);
					$scope.doPublish(messId);
				}, function() {
					layer.close(index);
			});
		}
		$scope.doPublish = function(messId){
			CommonFunction.layerLoading("正在发布");
			CommonFunction.zteHttp('post', '/mess/publish', {
				pk:messId
			}, function(data) {
				if(data.result == 0) {
					$scope.query();
					CommonFunction.layerMsg("发布成功");
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerMsg("操作失败，请稍后重试");
			});
		}
		// 撤销
		$scope.cancel = function(messId){
			var index = layer.confirm('您确认要撤销该广告消息吗？', {
				icon : 3,
				btn : [ '确认', '取消' ]
				}, function() {
					layer.close(index);
					$scope.doCanel(messId);
				}, function() {
					layer.close(index);
			});
		}
		$scope.doCanel = function(messId){
			CommonFunction.layerLoading("正在撤销");
			CommonFunction.zteHttp('post', '/mess/cancel', {
				pk:messId
			}, function(data) {
				if(data.result == 0) {
					$scope.query();
					CommonFunction.layerMsg("撤销成功");
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerMsg("操作失败，请稍后重试");
			});
		}
		//保存
		$scope.save = function(){
			if($scope.addModel.messText==null ||$scope.addModel.messText==''){
				CommonFunction.layerTips("必填","#addModel_messText");
				return;
			}
			if($scope.addModel.messUrl==null ||$scope.addModel.messUrl==''){
				CommonFunction.layerTips("必填","#addModel_messUrl");
				return;
			}
			var re=/(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			//var re = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
			if(!re.test($scope.addModel.messUrl)){
				CommonFunction.layerTips("请输入正确的http://或https://链接","#addModel_messUrl");
				return;
			}
			CommonFunction.layerLoading("正在保存");
			CommonFunction.zteHttp('post', '/mess/add', $scope.addModel, function(data) {
				if(data.result == 0) {
					$scope.hideAdd();
					$scope.query();
					CommonFunction.layerMsg("新增广告消息成功");
				}
				if(data.result == 101) {
					CommonFunction.layerMsg(data.message);
				}
			}, function(data) {
				CommonFunction.layerMsg("操作失败，请稍后重试");
			});
		}
		/** 监听分页模块 */
		$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
	}]);