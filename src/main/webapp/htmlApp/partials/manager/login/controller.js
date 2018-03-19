angular.module('Login', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: 'partials/manager/login/login.html',
            controller: 'LoginController'
        })
        .state('forget', {
            url: "/forget",
            templateUrl: 'partials/manager/login/forget.html',
            controller: 'ForgetController'
        })
        .state('forgetlname', {
            url: "/forgetlname",
            templateUrl: 'partials/manager/login/forgetlname.html',
            controller: 'ForgetlnameController'
        })
        .state('reg', {
            url: "/reg",
            templateUrl: 'partials/manager/login/reg.html',
            controller: 'RegController'
        })
        ;
}])
.controller('LoginController', ['$scope', 'CommonFunction', 'ParamsFunction', 'placeholder', function ($scope, CommonFunction, ParamsFunction, placeholder) {
	layer.closeAll();
	$scope.loginName = null;
	$scope.password = null;
	$scope.rememberMe = "0";
	var rememberLN = ParamsFunction.getParams("_LN","",false);
	$scope.login = function() {
		if ($scope.loginName == null || $scope.loginName == "") {
			CommonFunction.layerTips("请输入用户名", "#loginName");
			return;
		}
		if($scope.password == null || $scope.password == ""){
			CommonFunction.layerTips("请输入密码", "#password");
			return;
		}
		/*if(!/^[0-9a-zA-Z]{1,15}$/.test($scope.loginName)){
			//CommonFunction.layerTips("用户名由1-15位数字或字母组成", "#loginName");
			CommonFunction.layerMsg("用户名或密码错误");
			return;
		}
		var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		if(!re.test($scope.password)){
			//CommonFunction.layerTips("密码由6-16位数字和字母组成", "#password");
			CommonFunction.layerMsg("用户名或密码错误");
			return;
		}*/
		// 显示加载提示框
		var index = CommonFunction.layerLoading("正在登录");
		//登录
		CommonFunction.zteHttp('post','/login/login',{
			loginName:$scope.loginName,
			password:$scope.password,
			managerType:"0"
		},function(data){
			CommonFunction.layerClose(index);
    		if (data.result == 0){
    			if($scope.rememberMe=="1"){
    				var expires = new Date();  
    			    expires.setTime(expires.getTime() + 7 * 3600000 * 24);//7天
    			    var _LN = CommonFunction.compileStr($scope.loginName);
    			    var _LP = CommonFunction.compileStr($scope.password);
    				ParamsFunction.setParamsWithTime("_LN",_LN,expires.toUTCString());
					ParamsFunction.setParamsWithTime("_LP",_LP,expires.toUTCString());
    			}/*else{
    				ParamsFunction.delParams('_LN');
    				ParamsFunction.delParams('_LP');
    			}*/
    			ParamsFunction.setParams("manager.loginInfo",angular.toJson(data.resultData[0]));
    			ParamsFunction.delParams('manager.labels');
    			CommonFunction.gotoPage('main.data');
    		}
    		if(data.result == 101){
    			CommonFunction.layerMsg(data.message);
    		}
    	},function(data){
    		CommonFunction.layerClose(index);
    		CommonFunction.layerMsg("请求失败，请稍后重试");
    	});
	}
	$scope.lnameBlur = function(){
		if(rememberLN!=null && rememberLN!=""){
			var ln = CommonFunction.uncompileStr(rememberLN);
			if($scope.loginName == ln){
				var lp = ParamsFunction.getParams("_LP","",false);
				if(lp!=null && lp!=''){
					$("#password").attr('type','password');
					$scope.password = CommonFunction.uncompileStr(lp);
				}
			}
		}
	}
	//跳转忘记密码页面
	$scope.forget = function(){
		CommonFunction.gotoPage('forget',false);
	}
	//注册
	$scope.reg = function(){
		CommonFunction.gotoPage('reg');
	}
	//跳转忘记用户名页面
	$scope.forgetlname = function(){
		CommonFunction.gotoPage('forgetlname',false);
	}
}])
//忘记密码
.controller('ForgetController', ['$scope', 'CommonFunction', 'ParamsFunction', '$interval','placeholder', function ($scope, CommonFunction, ParamsFunction, $interval, placeholder) {
	$scope.loginName = null;
	$scope.phone = null;
	$scope.vcode = null;
	$scope.password = null;
	$scope.password2 = null;
	
	//显示倒计时
	$scope.vcode_btn_disabled = false;//按钮不可点击
	$scope.paracont = "获取验证码";
	$scope.second = 60;
	timePromise = undefined;
	$scope.showcounter = function(){
		$scope.vcode_btn_disabled = true;
		timePromise = $interval(function() {
			if ($scope.second <= 0) {
				$interval.cancel(timePromise);
				timePromise = undefined;
				$scope.second = 60;
				$scope.paracont = "获取验证码";
				$scope.vcode_btn_disabled = false;
			} else {
				$scope.vcode_btn_disabled = true;
				$scope.paracont = $scope.second + "秒后可重发";
				$scope.second--;
			}
		}, 1000);
	};
	
	// 发送验证码
	$scope.sendvcode = function() {
		if($scope.paracont == "获取验证码"){
			if ($scope.loginName == null || $scope.loginName == "") {
				CommonFunction.layerTips("请输入用户名", "#loginName");
				return;
			}
			if(!/^[0-9a-zA-Z]{1,15}$/.test($scope.loginName)){
				//CommonFunction.layerTips("用户名由1-15位数字或字母组成", "#loginName");
				CommonFunction.layerTips("请输入正确的用户名", "#loginName");
				return;
			}
			if ($scope.phone == null || $scope.phone == "") {
				CommonFunction.layerTips("请输入手机号","#phone");
				return;
			}
			if(!/^1\d{10}$/.test($scope.phone)){
				CommonFunction.layerTips('请输入正确的手机号', "#phone");
				return;
			}
			//按钮显示倒计时
			$scope.showcounter();
			//发送验证码到手机
			CommonFunction.zteHttp('post','/login/pwdSendVcode',{
				phone:$scope.phone,
				loginName:$scope.loginName
			},function(data){
	            var result = data.result;
	            if(result == "101"){
	            	if(data.message=="PHONE_ERR"){
	            		$scope.second = 0; //取消倒计时
	            		CommonFunction.layerTips('该手机号尚未注册', "#phone");
	            		return;
	            	}
	            	if(data.message=="LOGIN_NAME_ERR"){
	            		$scope.second = 0; //取消倒计时
	            		CommonFunction.layerTips('该用户尚未注册', "#loginName");
	            		return;
	            	}
	            	CommonFunction.layerMsg('发送失败，请稍后重试');
	            }
	            if(result == "0"){
	            	CommonFunction.layerMsg("验证码已发送");
	            }
			},function(data){
	    		CommonFunction.layerMsg("请求失败，请稍后重试");
	    	});
		}else{
			CommonFunction.layerMsg($scope.second+"秒后可重发");
		}
	}
	
	// 点击下一步，校验用户名、手机、验证码是否正确
	$scope.next = function() {
		if ($scope.loginName == null || $scope.loginName == "") {
			CommonFunction.layerTips("请输入用户名", "#loginName");
			return;
		}
		if(!/^[0-9a-zA-Z]{1,15}$/.test($scope.loginName)){
			//CommonFunction.layerTips("用户名由1-15位数字或字母组成", "#loginName");
			CommonFunction.layerTips("请输入正确的用户名", "#loginName");
			return;
		}
		if($scope.phone == null || $scope.phone == ""){
			CommonFunction.layerTips("请输入手机号", "#phone");
			return;
		}
		if(!/^1\d{10}$/.test($scope.phone)){
			CommonFunction.layerTips('请输入正确的手机号', "#phone");
			return;
		}
		if ($scope.vcode == null || $scope.vcode == "") {
			CommonFunction.layerTips("请输入验证码","#vcode");
			return;
		}
		if (!/^\d{6}\b/.test($scope.vcode)) {
			CommonFunction.layerTips("请输入正确的验证码","#vcode");
			return;
		}
		CommonFunction.zteHttp('post','/login/pwdValidate',{
			phone:$scope.phone,
			loginName:$scope.loginName,
			vcode:$scope.vcode
		},function(data){
            var result = data.result;
            if(result == "101"){
            	if(data.message=="NAME_ERR"){
            		CommonFunction.layerTips('该用户名不存在', "#loginName");
            		return;
            	}
            	if(data.message=="PHONE_ERR"){
            		CommonFunction.layerTips('请输入正确的手机号', "#phone");
            		return;
            	}
            	if(data.message=="VCODE_ERR"){
            		CommonFunction.layerTips('请输入正确的验证码', "#vcode");
            		return;
            	}
            	CommonFunction.layerMsg('操作失败，请稍后重试');
            }
            if(result == "0"){
            	//通过校验，显示修改密码界面
            	document.getElementById("pwd1").style.display = "none";
            	document.getElementById("pwd2").style.display = "block";
            	$scope.managerId = data.message;
            }
		},function(data){
    		CommonFunction.layerMsg("请求失败，请稍后重试");
    	});
	}
	
	//点击修改密码执行的方法
	$scope.changepwd = function(){
		if ($scope.password == null || $scope.password == "") {
			CommonFunction.layerTips("请输入密码","#password");
			return;
		}
		re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		if (!re.test($scope.password)) {
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
		CommonFunction.zteHttp('post','/login/pwdChange',{
			id:$scope.managerId,
			password:$scope.password,
		},function(data){
            var result = data.result;
            if(result == "101"){
            	CommonFunction.layerMsg("修改失败，请稍后重试");
            }
            if(result == "0"){
            	CommonFunction.layerMsg("密码修改成功",function(){
    				CommonFunction.gotoPage("login");//跳转返回
    			});
            }
        
		},function(data){
    		CommonFunction.layerMsg("请求失败，请稍后重试");
    	});
	}
}])
//注册
.controller('RegController', ['$scope', 'CommonFunction', 'ParamsFunction', '$interval', 'placeholder', function ($scope, CommonFunction, ParamsFunction,$interval, placeholder) {

	$scope.operationName = null;
	$scope.phone = null;
	$scope.loginName = null;
	$scope.password = null;
	$scope.password2 = null;
	$scope.vcode = null;
	$scope.btn_reg_disabled = false;//注册按钮默认可用
	
	//显示倒计时
	$scope.vcode_btn_disabled = false;//按钮不可点击
	$scope.paracont = "获取验证码";
	$scope.second = 60;
	timePromise = undefined;
	$scope.showcounter = function(){
		$scope.vcode_btn_disabled = true;
		timePromise = $interval(function() {
			if ($scope.second <= 0) {
				$interval.cancel(timePromise);
				timePromise = undefined;
				$scope.second = 60;
				$scope.paracont = "获取验证码";
				$scope.vcode_btn_disabled = false;
			} else {
				$scope.vcode_btn_disabled = true;
				$scope.paracont = $scope.second + "秒后可重发";
				$scope.second--;
			}
		}, 1000);
	};
	
	// 发送验证码
	$scope.sendvcode = function() {
		if($scope.paracont == "获取验证码"){
			//校验手机号
			if ($scope.phone == null || $scope.phone == "") {
				CommonFunction.layerTips("必填","#phone");
				return;
			}
			if(!/^1\d{10}$/.test($scope.phone)){
				CommonFunction.layerTips('请输入正确的联系电话', "#phone");
				return;
			}
			//按钮显示倒计时
			$scope.showcounter();
			//先验证手机号码是否已在系统中维护
			CommonFunction.zteHttp('post','/login/regSendVcode',{
				phone:$scope.phone
			},function(data){
	            var result = data.result;
	            if(result == "101"){
	            	if(data.message == "PHONE_ERR"){
	            		$scope.second = 0;//取消倒计时
	            		CommonFunction.layerTips('请输入正确的联系电话', "#phone");
	            		return;
	            	}
	            	if(data.message == "SEND_ERR"){
	            		CommonFunction.layerMsg("发送失败，请稍后重试");
	            		return;
	            	}
	            	CommonFunction.layerMsg("操作失败，请稍后重试");
	            }
	            if(result == "0"){
	            	CommonFunction.layerMsg("验证码已发送");
	            	return;
	            }
			},function(data){
	    		CommonFunction.layerMsg("请求失败，请稍后重试");
	    	});
		}else{
			CommonFunction.layerMsg($scope.second+"秒后可重发");
		}
	}
	
	
	//点击注册按钮调用的方法
	$scope.reg = function() {
		if ($scope.operationName == null || $scope.operationName == "") {
			CommonFunction.layerTips("必填","#operationName");
			return;
		}
		if ($scope.operationName.length > 20) {
			CommonFunction.layerTips("最多输入20字符","#operationName");
			return;
		}
		if ($scope.phone == null || $scope.phone == "") {
			CommonFunction.layerTips("必填","#phone");
			return;
		}
		if(!/^1\d{10}$/.test($scope.phone)){
			CommonFunction.layerTips('请输入正确的联系电话', "#phone");
			return;
		}
		if ($scope.loginName == null || $scope.loginName == "") {
			CommonFunction.layerTips("必填","#loginName");
			return;
		}
		var r2 = /^(?![0-9]+$)[0-9A-Za-z]{1,15}$/;
		if (!r2.test($scope.loginName)) {
			CommonFunction.layerTips("用户名为1~15位字母或数字组成</br>且不能为纯数字","#loginName");
			return;
		}
		/*if(!/^[0-9a-zA-Z]{1,15}$/.test($scope.loginName)){
			CommonFunction.layerTips("用户名为数字、字母或其组合", "#loginName");
			return;
		}
*/
		if ($scope.password == null || $scope.password == "") {
			CommonFunction.layerTips("请输入密码","#password");
			return;
		}
		var re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
		if (!re.test($scope.password)) {
			CommonFunction.layerTips("密码由6~16位数字和字母组成","#password");
			return;
		}
		if ($scope.password2 == null || $scope.password2 == "") {
			CommonFunction.layerTips("必填","#password2");
			return;
		}
		if ($scope.password != $scope.password2) {
			CommonFunction.layerTips("两次输入密码不一致","#password2");
			return;
		}
		if ($scope.vcode == null || $scope.vcode == "") {
			CommonFunction.layerTips("必填","#vcode");
			return;
		}
		if (!/^\d{6}\b/.test($scope.vcode)) {
			CommonFunction.layerTips("请输入正确的验证码","#vcode");
			return;
		}
		//禁用注册按钮
		$scope.btn_reg_disabled = true;
		CommonFunction.zteHttp('post','/login/regValidate',{
			loginName:$scope.loginName,
			password:$scope.password,
			phone:$scope.phone,
			operationName:$scope.operationName,
			vcode:$scope.vcode
		},function(data){
			var result = data.result;
			$scope.btn_reg_disabled = false;//恢复注册按钮可用
            if(result == "101"){
            	var msg = data.message;
            	if(msg == "LOGIN_NAME_EXSIT"){
            		CommonFunction.layerTips('此用户名已被注册', "#loginName");
            		return;
        		}
        		if(msg == "OPER_NAME_ERR"){
        			CommonFunction.layerTips('请输入正确的机构名称', "#operationName");
        			return;
        		}
        		if(msg == "PHONE_ERR"){
        			CommonFunction.layerTips('请输入正确的联系电话', "#phone");
        			return;
        		}
        		if(msg == "OPER_IS_REG"){
        			CommonFunction.layerTips('该经营机构已注册', "#operationName");
        			return;
        		}
        		if(msg == "VCODE_ERR"){
        			CommonFunction.layerTips('请输入正确的验证码', "#vcode");
        			return;
        		}
        		CommonFunction.layerMsg('操作失败，请稍后重试');
            }
            if(result == "0"){
            	CommonFunction.layerMsg("注册成功",function(){
    				CommonFunction.gotoPage("login");//跳转返回
    			});
            }
		},function(data){
    		CommonFunction.layerMsg("请求失败，请稍后重试");
    		$scope.btn_reg_disabled = false;//恢复注册按钮可用
    	});
	}
}])
.controller('ForgetlnameController', ['$scope', 'CommonFunction', 'ParamsFunction', '$interval', 'placeholder', function ($scope, CommonFunction, ParamsFunction,$interval, placeholder) {
	$scope.phone = null;
	$scope.vcode = null;
	
	//显示倒计时
	$scope.vcode_btn_disabled = false;//按钮不可点击
	$scope.paracont = "获取验证码";
	$scope.second = 60;
	timePromise = undefined;
	$scope.showcounter = function(){
		$scope.vcode_btn_disabled = true;
		timePromise = $interval(function() {
			if ($scope.second <= 0) {
				$interval.cancel(timePromise);
				timePromise = undefined;
				$scope.second = 60;
				$scope.paracont = "获取验证码";
				$scope.vcode_btn_disabled = false;
			} else {
				$scope.vcode_btn_disabled = true;
				$scope.paracont = $scope.second + "秒后可重发";
				$scope.second--;
			}
		}, 1000);
	};
	
	// 发送验证码
	$scope.sendvcode = function() {
		if($scope.paracont == "获取验证码"){
			if ($scope.phone == null || $scope.phone == "") {
				CommonFunction.layerTips("请输入手机号","#phone");
				return;
			}
			if(!/^1\d{10}$/.test($scope.phone)){
				CommonFunction.layerTips('请输入正确的手机号', "#phone");
				return;
			}
			//按钮显示倒计时
			$scope.showcounter();
			//发送验证码到手机
			CommonFunction.zteHttp('post','/login/lnameSendVcode',{
				phone:$scope.phone,
				loginName:$scope.loginName
			},function(data){
	            var result = data.result;
	            if(result == "101"){
	            	if(data.message=="PHONE_ERR"){
	            		$scope.second = 0; //取消倒计时
	            		CommonFunction.layerTips('请输入正确的手机号', "#phone");
	            		return;
	            	}
	            	if(data.message=="NOT_REG"){
	            		$scope.second = 0; 
	            		CommonFunction.layerTips('该手机号尚未注册', "#phone");
	            		return;
	            	}
	            	CommonFunction.layerMsg('发送失败，请稍后重试');
	            }
	            if(result == "0"){
	            	CommonFunction.layerMsg("验证码已发送");
	            }
			},function(data){
	    		CommonFunction.layerMsg("请求失败，请稍后重试");
	    	});
		}else{
			CommonFunction.layerMsg($scope.second+"秒后可重发");
		}
	}
	
	// 点击下一步，校验手机、验证码是否正确
	$scope.next = function() {
		if($scope.phone == null || $scope.phone == ""){
			CommonFunction.layerTips("请输入手机号", "#phone");
			return;
		}
		if(!/^1\d{10}$/.test($scope.phone)){
			CommonFunction.layerTips('请输入正确的手机号', "#phone");
			return;
		}
		if ($scope.vcode == null || $scope.vcode == "") {
			CommonFunction.layerTips("请输入验证码","#vcode");
			return;
		}
		if (!/^\d{6}\b/.test($scope.vcode)) {
			CommonFunction.layerTips("请输入正确的验证码","#vcode");
			return;
		}
		CommonFunction.zteHttp('post','/login/lnameValidate',{
			phone:$scope.phone,
			vcode:$scope.vcode
		},function(data){
            var result = data.result;
            if(result == "101"){
            	if(data.message=="PHONE_ERR"){
            		CommonFunction.layerTips('请输入正确的手机号', "#phone");
            		return;
            	}
            	if(data.message=="NOT_REG"){
            		CommonFunction.layerTips('该手机号尚未注册', "#phone");
            		return;
            	}
            	if(data.message=="VCODE_ERR"){
            		CommonFunction.layerTips('请输入正确的验证码', "#vcode");
            		return;
            	}
            	CommonFunction.layerMsg('操作失败，请稍后重试');
            }
            if(result == "0"){
            	CommonFunction.layerSuccess('提示',"您的用户名为：<font style='font-weight:bold;'>"+data.message+"</font>，您可以使用该用户名登录。",function(){
            		CommonFunction.gotoPage('login',false);
            	});
            }
		},function(data){
    		CommonFunction.layerMsg("请求失败，请稍后重试");
    	});
	}
}]);
