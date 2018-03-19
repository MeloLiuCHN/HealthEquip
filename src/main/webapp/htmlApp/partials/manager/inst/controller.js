/**
 * Created by chenyafeng on 2017/6/8.
 */
'use strict';

angular.module('Inst', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('main.inst', {
                url: "/inst",
                templateUrl: 'partials/manager/inst/inst.html',
                controller: 'InstController'
            })
            .state('main.selectequip', {
                url: "/selectequip",
                templateUrl: 'partials/manager/inst/selectequip.html',
                controller: 'SelectEquipController'
            });
    }])
    .controller('InstController', ['$scope', 'CommonFunction', 'ParamsFunction', 'CheckFunction', function ($scope, CommonFunction, ParamsFunction, CheckFunction) {
    	$scope.setSelected("3");
    	// 初始化分页参数
    	$scope.paginationConf = {
	        currentPage: 1,
	        itemsPerPage: 10
	    };
    	// 初始化机构列表
    	$scope.instlist = null;
    	// 定义查询对象
    	$scope.searchModel = {};
    	$scope.queryModel = angular.copy($scope.searchModel);
    	// 定义新增或编辑对象
    	$scope.addModel ={}; 
    	// 默认不显示新增或编辑界面
    	$scope.addHTMLShow = false;
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
    		CommonFunction.zteHttp('post','/ins/list',{
    			page : {
    	            currentPage : $scope.paginationConf.currentPage, 
    	            itemsPerPage : $scope.paginationConf.itemsPerPage
    	            },
	            entity : $scope.queryModel
    		},function(data){
    			CommonFunction.layerClose(index);
        		if (data.result == 0){
        			$scope.instlist = data.rtnMap.resultData;
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
    	var addFlag = "add";
    	// 显示新增机构
    	$scope.showAdd = function(){
    		addFlag = "add";
    		$scope.addModel = {};
    		$scope.addHTMLShow = true;
    	}
    	// 显示编辑机构
    	$scope.showEdit = function(index){
    		addFlag = "edit";
    		$scope.addModel = angular.copy($scope.instlist[index]);
    		$scope.copyAddModel = angular.copy($scope.instlist[index]);
        	$scope.addHTMLShow = true;
    	}
    	// 跳转关联设备
    	$scope.goSelectEquip = function(index){
    		ParamsFunction.setParams("manager.inst.institutionId",$scope.instlist[index].id);
    		CommonFunction.gotoPage('main.selectequip');
    	}
    	// 隐藏新增或编辑界面
    	$scope.cancel = function(){
    		$scope.addModel = {};
        	$scope.addHTMLShow = false;
    	}
    	//保存新增或编辑
    	$scope.save = function(){
    		if(CommonFunction.isEmpty($scope.addModel.name)){
    			CommonFunction.layerTips("必填", "#addModel_name");
    			document.getElementById("addModel_name").focus();
    			return;
    		}
    		if($scope.addModel.name.length >20){
    			CommonFunction.layerTips("最多输入20字符", "#addModel_name");
    			document.getElementById("addModel_name").focus();
    			return;
    		}
    		if(CommonFunction.isEmpty($scope.addModel.contact)){
    			CommonFunction.layerTips("必填","#addModel_contact");
    			document.getElementById("addModel_contact").focus();
    			return;
    		}
    		if($scope.addModel.contact.length >15){
    			CommonFunction.layerTips("最多输入15字符", "#addModel_contact");
    			document.getElementById("addModel_contact").focus();
    			return;
    		}
    		if(CommonFunction.isEmpty($scope.addModel.phone)){
    			CommonFunction.layerTips("必填","#addModel_phone");
    			document.getElementById("addModel_phone").focus();
    			return;
    		}
    		if(!/^1\d{10}$/.test($scope.addModel.phone)){
    			CommonFunction.layerTips("请输入正确的手机号","#addModel_phone");
    			document.getElementById("addModel_phone").focus();
    			return;
    		}
    		if(!CommonFunction.isEmpty($scope.addModel.address)){
    			if($scope.addModel.address.length > 30){
    				CommonFunction.layerTips("最多输入30字符","#addModel_address");
        			document.getElementById("addModel_address").focus();
        			return;
    			}
    		}
    		var index = CommonFunction.layerLoading("正在保存数据");
    		CommonFunction.zteHttp('post','/ins/save',$scope.addModel,
    		function(data){
    			CommonFunction.layerClose(index);
        		if (data.result == 0){
        			CommonFunction.layerMsg(data.message);
        			$scope.cancel();
        			if(addFlag=="add"){
        				$scope.query();
        			}else{
        				$scope.query();
        			}
        		}
        		if(data.result == 101){
        			CommonFunction.layerTips(data.message,"#addModel_name");
        		}
        	},function(data){
        		CommonFunction.layerClose(index);
        		CommonFunction.layerMsg("请求失败，请稍后重试");
        	});
    	}
    	/** 监听分页模块 */
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
    }])
    .controller('SelectEquipController', ['$scope', 'CommonFunction', 'ParamsFunction', 'CheckFunction', function ($scope, CommonFunction, ParamsFunction, CheckFunction) {
    	$scope.setSelected("3");
    	// 获取传递参数
    	$scope.institutionId = ParamsFunction.getParams("manager.inst.institutionId","",false);
    	// 初始化分页参数
    	$scope.paginationConf = {
	        currentPage: 1,
	        itemsPerPage: 10
	    };
    	// 初始化设备列表
    	$scope.equiplist = null;
    	// 用来存储列表操作按钮
    	$scope.buttons = new Array();
    	// 定义查询对象
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
    		$scope.queryModel.institutionId = $scope.institutionId;
    		CommonFunction.zteHttp('post','/equ/listselect',{
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
        			// 默认全选CHECKBOX为【选中】状态
        			$scope.allChecked = true;
        			// 如果列表为空，全选CHECKBOX为【未选中】状态
        			if($scope.equiplist==null || $scope.equiplist.length==0){
        				$scope.allChecked = false;
        			}
        			// 如果列表不为空，只要有未选中的数据行，那么全选CHECKBOX为【未选中】状态
        	    	angular.forEach($scope.equiplist,function(data,index){
        	    		$scope.buttons[index] = 'alter';// 列表操作图标默认为编辑
        	    		if(data.institutionId==null || data.institutionId==''){
        	    			$scope.allChecked = false;
        				}
        	    	});
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
    	// 点击“是”
    	$scope.clickYes = function(index){
    		$scope.equiplist[index].price = '1.00';
    	}
    	// 点击“否”
    	$scope.clickNo = function(index){
    		$scope.equiplist[index].price = '0.00';
    	}
    	//价格onBlur
    	$scope.setprice = function(index){
    		var price = $scope.equiplist[index].price;
    		//为0.01到99.99之间的数字时,如果不够两位小数，自动补零
    		if(!CommonFunction.isEmpty(price)&&!isNaN(price)){
    			if(price >=0.01 && price <=99.99){
    				var rs = price.indexOf('.');
        			if (rs < 0) {
        				price += '.00';
        			} else {
        				while (price.length <= rs + 2) {
        					price += '0';
        				}
        			}
        			$scope.equiplist[index].price = price;
    			}
    		}
    	}
    	// 编辑或保存
    	$scope.save = function(index) {
    		// 如果点击编辑
			if ($scope.buttons[index] == 'alter') {
				$scope.buttons[index] = 'save'; //按钮变为保存
				//copy一份以便保存时校验
				$scope.copyEditModel = angular.copy($scope.equiplist[index]);
			} else {
				// 获取当前修改对象
				$scope.editModel = $scope.equiplist[index];
				//判断对象是否发生改变
				if(angular.equals($scope.editModel,$scope.copyEditModel)){
					$scope.buttons[index] = 'alter';//如果对象没有发生变化，不提交后台，切换按钮为修改
				}else{
					if($scope.editModel.payment == "Y"){
						// 校验价格为0.01~99.99之间的数字
						var price = $scope.editModel.price;
						
						var reg = /^(0|[1-9]\d{0,1})(\.\d{1,2})?$/;
			    		if(!reg.test(price)){
			    			var price_id = "#price_id"+index;
	    					CommonFunction.layerTips("价格为0.01-99.99之间的两位小数",price_id);
	    					return;
			    		}
			    		if(price >99.99 ||price <0.01){
			    			var price_id = "#price_id"+index;
	    					CommonFunction.layerTips("价格为0.01-99.99之间的两位小数",price_id);
	    					return;
			    		}
					}
					// 保存修改
					var layerIndex = CommonFunction.layerLoading("正在保存数据");
					CommonFunction.zteHttp('post','/equ/saveEquip',$scope.editModel,function(data){
						CommonFunction.layerClose(layerIndex);
		        		if (data.result == 0){
		    				$scope.buttons[index] = 'alter';// 切换按钮为修改
		    				CommonFunction.layerMsg(data.message);// 提示修改成功
		        		}
		        		if(data.result == 101){
		        			if(data.message=="NOT_EXSIT"){
		        				CommonFunction.layerMsg("该设备已经不属于当前运营机构");
		        				$scope.query();
		        				return ;
		        			}
		        			CommonFunction.layerMsg("保存失败，请稍后重试");
		        		}
		        	},function(data){
		        		CommonFunction.layerClose(index);
		        		CommonFunction.layerMsg("请求失败，请稍后重试");
		        	});
				}
			}
		}
    	// 点击【全选】CHECKBOX
    	$scope.checkAll = function(){
    		var flag = "check";
    		if($scope.allChecked){
    			flag = "canel";
    			var layerIndex = CommonFunction.layerLoading("正在取消关联");
    		}else{
    			flag = "check";
    			var layerIndex = CommonFunction.layerLoading("正在关联设备");
    		}
    		var ids = "";
    		angular.forEach($scope.equiplist,function(data){
    			ids = ids + data.id +",";
    		});
    		var institutionId = $scope.institutionId;
    		CommonFunction.zteHttp('post','/equ/selectAllEquipByManager',{
    			ids:ids,
    			institutionId:institutionId,
    			flag:flag
			},
	        function(data){
				CommonFunction.layerClose(layerIndex);
        		if (data.result == 0){
        			$scope.query();
        			CommonFunction.layerMsg("操作成功");
        		}
        		if(data.result == 101){
        			CommonFunction.layerMsg("操作失败，请稍后重试");
        			if(flag=="check"){
        				$scope.allChecked = false;
        			}else{
        				$scope.allChecked = true;
        			}
        		}
        	},function(data){
        		CommonFunction.layerClose(layerIndex);
        		CommonFunction.layerMsg("请求失败，请稍后重试");
        		if(flag=="check"){
    				$scope.allChecked = false;
    			}else{
    				$scope.allChecked = true;
    			}
        	});
    	}
    	//选择或取消选择
    	$scope.check = function(index){
    		var flag = "";
    		var instId = $scope.equiplist[index].institutionId;
    		if(instId==null ||instId==""){
    			flag = "check";
    			var layerIndex = CommonFunction.layerLoading("正在关联设备");
    		}else{
    			flag = "cancel";
    			var layerIndex = CommonFunction.layerLoading("正在取消关联");
    		}
    		$scope.allChecked = true;
			angular.forEach($scope.equiplist,function(data){
				if(data.institutionId==null ||data.institutionId==""){
					$scope.allChecked = false;
				}
			});
    		var institutionId = $scope.institutionId;
    		var equipId = $scope.equiplist[index].id;
    		CommonFunction.zteHttp('post','/equ/selectEquipByManager',{
    			institutionId :institutionId,
    			equipId:equipId,
    			flag:flag
    		},
	        function(data){
    			CommonFunction.layerClose(layerIndex);//关闭加载层
        		if (data.result == 0){
        			$scope.query();
        			CommonFunction.layerMsg("操作成功");
        		}
        		if(data.result == 101){
        			CommonFunction.layerMsg("操作失败，请稍后重试");
        			if(flag=="check"){
        				document.getElementById('check_id'+index).checked = false;
        			}else{
        				document.getElementById('check_id'+index).checked = true;
        			}
        		}
        	},function(data){
        		CommonFunction.layerClose(layerIndex);//关闭加载层
        		CommonFunction.layerMsg("请求失败，请稍后重试");
        		if(flag=="check"){
    				document.getElementById('check_id'+index).checked = false;
    			}else{
    				document.getElementById('check_id'+index).checked = true;
    			}
        	});
    	}
    	//返回
    	$scope.goback = function(){
    		// 判断是否有未保存价格的数据行
			var jump = false;
			for(var i=0;i<$scope.buttons.length;i++){
				if($scope.buttons[i]=='save'){
					var btn_id = "#btn_id"+i;
					CommonFunction.layerTips("请先保存",btn_id);
					return;
				}
			}
			CommonFunction.gotoPage("main.inst"); 
    	}
    	/** 监听分页模块 */
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.query);
    }]);