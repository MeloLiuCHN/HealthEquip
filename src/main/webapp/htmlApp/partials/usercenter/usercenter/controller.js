/**
 * Created by liuyang on 2017/6/2.
 */
'use strict';

angular.module('UserCenterApp.Weuser', [])

    .config(['$stateProvider', function ($stateProvider) {

        $stateProvider
            .state('wusercenter', {
                url: "/wusercenter",
                templateUrl: 'usercenter/user.html',
                cache:'false',
                controller: 'wusercenterController'
            })
            .state('wuserpaylist', {
                url: "/wuserpaylist",
                templateUrl: 'usercenter/userpaylist.html',
                cache:'false',
                controller: 'wuserpaylistController'
            })
	        .state('wusergrzx', {
	            url: "/wusergrzx",
	            templateUrl: 'usercenter/grzx.html',
	            cache:'false',
	            controller: 'wusergrzxController'
	        })
	        .state('wuserequip', {
	            url: "/wuserequip",
	            templateUrl: 'usercenter/bdequip.html',
	            cache:'false',
	            controller: 'wuserequipController'
	        })
	        .state('wuserequip2', {
	            url: "/wuserequip2",
	            templateUrl: 'usercenter/bdequip2.html',
	            cache:'false',
	            controller: 'wuserequip2Controller'
	        })
	        .state('wuserequip3', {
	            url: "/wuserequip3",
	            templateUrl: 'usercenter/bdequip3.html',
	            cache:'false',
	            controller: 'wuserequip3Controller'
	        })
	        
	        .state('wuserphone2', {
	            url: "/wuserphone2",
	            templateUrl: 'usercenter/bdphone2.html',
	            cache:'false',
	            controller: 'wuserphone2Controller'
	        })
	        .state('wuserhelp', {
	            url: "/wuserhelp",
	            templateUrl: 'usercenter/userhelp.html',
	            cache:'false',
	            controller: 'wuserhelpController'
	        })
	        .state('whelpque', {
	            url: "/whelpque",
	            templateUrl: 'usercenter/helpque.html',
	            cache:'false',
	            controller: 'whelpqueController'
	        })
	        .state('wuserphone', {
	            url: "/wuserphone",
	            templateUrl: 'usercenter/bdphone.html',
	            cache:'false',
	            controller: 'wuserphoneController'
	        })
	        .state('wuserzhaohui', {
	            url: "/wuserzhaohui",
	            templateUrl: 'usercenter/zhequip.html',
	            cache:'false',
	            controller: 'wuserzhaohuiController'
	        });
    }])
    .controller('wusercenterController', ['$scope', 'CommonFunction', 'ParamsFunction', 'UserInfoFunction','$timeout',
        function ($scope, CommonFunction, ParamsFunction, UserInfoFunction,$timeout) {
    	document.title='个人中心';
    	$scope.sumequip = 0;
    	layer.closeAll()
    	$('.mobileSelect').css('display','none')
    	layer.load(1, {shade: [0.6, '#333']});
    //	ParamsFunction.setParams("wechat_opeid","oobmAvw66L_1kIuhcdtYhxF3R_-E");
    //	ParamsFunction.setParams("wechat_opeid","oobmAvw66L_1kIuhcdtYhxF3R_-E");
    	$scope.init = function(){
    		
    		UserInfoFunction.getUserInfo(function(){
    			$scope.getEquip(ParamsFunction.getParams("wechat_opeid","",false));
    			$scope.headerimg=ParamsFunction.getParams("wechat_headerimg","",false);
          	});
       
        	// S 获取设备数量
        	//layer.alert($scope.uid)
        	$scope.getEquip = function(uuid){
        		
        	  	CommonFunction.zteHttp('get','/wequip/getSumUserEquip',{
            		uid:uuid
            	},function(msg){
            		$scope.sumequip=msg.message;
            		$scope.phone=ParamsFunction.getParams("wuserPhone","",false);
                	$scope.nickname=ParamsFunction.getParams("wuserNickname","",false);
                	layer.closeAll('loading');
            	});
        	}
      
        	// E 获取设备数量
        	
    	};
    	
    	// S 跳转到消费记录
    	$scope.gotolist = function(){
    		CommonFunction.gotoPage('wuserpaylist', false);
    	}
    	// E 跳转到消费记录
    	// S 跳转到绑定手机号
    	$scope.gotoPhone = function(){
    		CommonFunction.gotoPage('wuserphone', false);
    	}
    	//跳转到帮助与反馈界面
    	$scope.gotoQue= function(){
    		CommonFunction.gotoPage('wuserhelp', false);
    	}
    	
    	// E 跳转到绑定手机号
    	// S 跳转到绑定设备
    	$scope.gotoEquip = function(){
    		CommonFunction.gotoPage('wuserequip', false);
    		//window.location.href="./equip.html"
    	}
    	// E 跳转到绑定设备
    	// S 跳转到基本信息
    	$scope.gotoGrzx = function(){
    		CommonFunction.gotoPage('wusergrzx', false);
    	}
    	
	
    	// E 跳转到基本信息
    }])

    	
    .controller('wuserpaylistController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='消费记录';
    	$scope.listhide=true
    	//ParamsFunction.setParams("wechat_opeid","oxNV8w_xGftJeaeEWPhAv2NjDUoM1");
    	$scope.uid=ParamsFunction.getParams("wechat_opeid",'',false);
    	CommonFunction.zteHttp('get','/wechat/user/getpaylist',{
    		uid:$scope.uid
    	},function(data){
    		$scope.dateval=data.rtnMap.date;
    		if($scope.dateval.length==0){
    			$scope.listhide=false;
    		}
    		$scope.val=data.rtnMap.datelist;
    		$scope.info=data.rtnMap.infolist;
    		$scope.countList=data.rtnMap.countList;
    		$scope.sumtList=data.rtnMap.sumtList;
    	});
	//	$scope.dateval=['2017年06月05日','2017年06月04日','2017年05月05日','2017年05月04日','2016年06月05日','2016年06月04日','2016年05月05日','2016年05月04日'];
		//$scope.val={'2017年06月05日':[1,2],'2017年06月04日':[1],'2017年05月05日':[1,2],'2017年05月04日':[1,2],'20167年06月05日':[1,2],'2016年06月04日':[1],'2016年05月05日':[1,2],'2016年05月04日':[1,2]};
    }])
     .controller('wuserhelpController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='帮助与反馈';
    	$scope.url= location.search;
    	CommonFunction.zteHttp('post','/wque/getuserhelplist',{
    	},function(data){
    		
    		$scope.userhelplist = data.rtnMap.resultData;
      	});
    	
    	
    	//跳转到常见问题界面
    	$scope.gotoMes = function(queId){
    		ParamsFunction.setParams("queId",queId);
    		CommonFunction.gotoPage('whelpque',false);	
    	};
     }])

     .controller('whelpqueController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	$scope.url = location.search;
    	var qid = ParamsFunction.getParams("queId",'',false);
    	CommonFunction.zteHttp('post','/wque/getContent',{
    		queId : qid
    	},function(data){
    		$scope.wxquelist = data.rtnMap.resultData[0];	
    		document.title=$scope.wxquelist.queName;
    	});

    }])

     .controller('wusergrzxController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$timeout',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$timeout) {
    	

    	document.title='个人基本信息';
    	
    	// S 初始化表单
    	$scope.wxuser_id=null;
    	$scope.wxuser_nickname="";
    	$scope.wxuser_relname="";
    	$scope.wxuser_code="";
    	$scope.wxuser_code_show="";
    	$scope.wxuser_sex=ParamsFunction.getParams("wechat_usersex",'',false);
    	$scope.wxuser_height=null;
    	$scope.wxuser_btype=null;
    	// E初始化表单
    	$scope.url= location.search;
		//ParamsFunction.setParams("wechat_opeid","oobmAvw66L_1kIuhcdtYhxF3R_-E");
    	$scope.uid= ParamsFunction.getParams("wechat_opeid",'',false);
    	$scope.headerimg=ParamsFunction.getParams("wechat_headerimg",'',false);
    	if($scope.headerimg==""){
    		$scope.headerimg='../../img/wechart/user/default-user.png';
    	}
    
    		// S 获取用户基本信息 
    		CommonFunction.zteHttp('post','/wuser/getWxUserInfo',{
          		uid:$scope.uid
          	},function(data){
          		
          		$scope.wxuser_id=data.rtnMap.resultData[0].fid.substr(0,10);
            	$scope.wxuser_nickname=data.rtnMap.resultData[0].userNickname;
            	
            	data.rtnMap.resultData[0].userRelname!=null?$scope.wxuser_relname=data.rtnMap.resultData[0].userRelname:false;
            	data.rtnMap.resultData[0].userCode!=null?$scope.wxuser_code=data.rtnMap.resultData[0].userCode:false;
            	$scope.wxuser_code!=""?$scope.wxuser_code_show=$scope.wxuser_code.substr(0,6)+"******"+$scope.wxuser_code.substr(-4):$scope.wxuser_code_show=""
            	if(data.rtnMap.resultData[0].userSex){
            		$scope.wxuser_sex=data.rtnMap.resultData[0].userSex;
            	}
            	if($scope.wxuser_sex=="0"){
            		$("#female").siblings("span").addClass("active");
            		$("#female").parents("div").siblings("div").children("span").removeClass("active");
            	}else if($scope.wxuser_sex=="1"){
            		$("#male").siblings("span").addClass("active");
        			$("#male").parents("div").siblings("div").children("span").removeClass("active");
            	}
            	data.rtnMap.resultData[0].userHeight!=null?$scope.wxuser_height=data.rtnMap.resultData[0].userHeight:$scope.showheight=true;
            	data.rtnMap.resultData[0].userBloodtype!=null?$scope.wxuser_btype=data.rtnMap.resultData[0].userBloodtype:$scope.showbtype=true;
            	$scope.init();
          	});
        	// E 获取用户基本信息
    
    	
    	
 	$scope.init = function(){
 		
    	// S 修改昵称
    	$scope.changeNickName = function(){
    		if($scope.wxuser_nickname != undefined){
    			layer.open({
      			  btn: ['确定','取消'],
      			  btnAlign:'c',
      			  title : false,
      			  closeBtn : false,
      			  skin : 'myLayer',
      			  yes: function(index, layero){
      				  if($("#NickName").val().length>15){
      					layer.msg("昵称最多15个字！");
      				  }else if($("#NickName").val().length==0){
      					layer.msg("请输入昵称！");
      				  }else{
      					$scope.wxuser_nickname=$("#NickName").val().replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      					$timeout(function () {  
      						layer.close(index);
      					}, 10);
      				  }
      			  },
      			  cancel: function(index, layero){
      	        	  console.log(index)
      	          },
      	          success:function(){
      	        	// S 清空昵称
      	            $('.clearBtn').click(function(e){
      	            
      	            	$("#NickName").val("")
      	            })
      	        	// E 清空昵称
      	          },
      			  area: ['300px', '150px'], //宽高
      			  content: '<p style="text-align: center;">昵称</p><input style="width:250px;border-top: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;" type="text" id="NickName" maxlength="15" value="'+$scope.wxuser_nickname+'"><img src="../../img/wechart/user/clear.png" class="clearBtn">'
      			});
    		}
    	}
    
    	// E 修改昵称
    
    	// S 修改真实姓名
    	$scope.changRelname=function(){
    		layer.open({
    			  btn: ['确定','取消'],
    			  btnAlign:'c',
    			  title : false,
    			  closeBtn : false,
    			  skin : 'myLayer',
    			  yes: function(index, layero){
    				  if($("#relname").val().length>15){
    					layer.msg("真实姓名最多15个字！");
    				  }else{
    					  $scope.wxuser_relname=$("#relname").val().replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
    					$timeout(function () {  
    						layer.close(index);
    					}, 10);
    				  }
    			  },
    			  cancel: function(index, layero){
    	        	  console.log(index)
    	          },
    	          success:function(){
        	        	// S 清空真实姓名
        	            $('.clearBtn').click(function(e){
        	            
        	            	$("#relname").val("")
        	            })
        	        	// E 清空真实姓名
        	          },
    			  area: ['290px', '150px'], //宽高
    			  content: '<p style="text-align: center;">真实姓名</p><input style="width:250px;border-top: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;" type="text" id="relname" maxlength="15" value="'+$scope.wxuser_relname+'"><img src="../../img/wechart/user/clear.png" class="clearBtn" ng-click="clearBtn(wxuser_relname)">'
    			});
    	};
    	// E 修改真实姓名
    	// S 修改身份证号
    	$scope.changCode = function(){
    		layer.open({
  			  btn: ['确定','取消'],
  			  btnAlign:'c',
  			  title : false,
  			  closeBtn : false,
  			  skin : 'myLayer',
  			  yes: function(index, layero){
  				  if($("#usercode").val().length>0&&($("#usercode").val().length>18 || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test($("#usercode").val()))){
  					layer.msg("身份证号输入有误！");
  				  }else{
  					$scope.wxuser_code=$("#usercode").val()
  					if($("#usercode").val()!=""){
  						$scope.wxuser_code_show=$scope.wxuser_code.substr(0,6)+"******"+$scope.wxuser_code.substr(-4)
  					}else{
  						$scope.wxuser_code_show=""
  					}
  					
  					//获取身份证倒数第二位
  					
  					if($("#usercode").val()!="" && $("#usercode").val().substr(16, 1)%2==1){
  						// 男
  						$scope.wxuser_sex="1";
  		            	$("#male").siblings("span").addClass("active");
  		        		$("#male").parents("div").siblings("div").children("span").removeClass("active");
  					}else if($("#usercode").val()!="" && $("#usercode").val().substr(16, 1)%2==0){
  						// 女
  						$scope.wxuser_sex="0";
  		            	$("#female").siblings("span").addClass("active");
  		            	$("#female").parents("div").siblings("div").children("span").removeClass("active");
  					}
  					$timeout(function () {  
  						layer.close(index);
  					}, 10);
  				  }
  			  },
  			  cancel: function(index, layero){
  	        	  console.log(index)
  	          },
  	          success:function(){
	        	// S 清空身份证号
	            $('.clearBtn').click(function(e){
	            
	            	$("#usercode").val("")
	            })
	        	// E 清空身份证号
	          },
  			  area: ['260px', '150px'], //宽高
  			  content: '<p style="text-align: center;">身份证号</p><input style="width:210px;border-top: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;" type="text" id="usercode" maxlength="18" value="'+$scope.wxuser_code+'"><img src="../../img/wechart/user/clear.png" class="clearBtn" ng-click="clearBtn(wxuser_code)">'
  			});
    	};
    	// E 修改身份证号
    	// S 选择性别
 
    	$("#male").click( function () {
			$(this).siblings("span").addClass("active");
			$(this).parents("div").siblings("div").children("span").removeClass("active");
			$scope.wxuser_sex="1";
		});
		$("#female").click( function () {
			$(this).siblings("span").addClass("active");
			$(this).parents("div").siblings("div").children("span").removeClass("active");
			$scope.wxuser_sex="0";
		});
		// S 选择身高
		var hList=[];
		var hp=165;
		for(var i=100;i<221;i++){
			hList.push(i);
			if(i==$scope.wxuser_height){
				hp=i;
			}
		}
		$scope.wxuser_height_p=hp-100;
	
		var mobileSelect1 = new MobileSelect({
    	    trigger: '#hlist', 
    	    title: '身高',  
    	    wheels: [
    	             	{data: hList,isdanwei:"<span style='float: right;line-height: 39px;margin-right: 100px;'>cm</span>"}
    	                //{data: sexList,  isdanwei:"<span style='float: right;line-height: 35px;'>cm</span>"}
    	            ],
    	    position:[$scope.wxuser_height_p], //初始化定位 打开时默认选中的哪个  如果不填默认为0
    	    callback:function(e){
    	    	$scope.wxuser_height=hList[e[0]];
    	    	$scope.showheight=false;
    	    	$timeout(function () {  
						return ;
				}, 10);
    	    },
    	    transitionEnd:false
    	  
    	});
		// E 选择身高
		// S 选择血型
		var bList=["A","B","AB","O"];
		var bp=0;
		for(var j = 0;j<4;j++){
			if(bList[j]==$scope.wxuser_btype){
				bp=j
			}
		}
		var mobileSelect2 = new MobileSelect({
    	    trigger: '#blist', 
    	    title: '血型',  
    	    wheels: [
    	             	{data: bList,isdanwei:""}
    	            ],
    	    position:[bp], //初始化定位 打开时默认选中的哪个  如果不填默认为0
    	    callback:function(e){
    	    	$scope.wxuser_btype=bList[e[0]];
    	    	$scope.showbtype=false;
    	    	$timeout(function () {  
						return ;
				}, 10);
    	    },
    	    transitionEnd:false
    	  
    	});
		// E 选择血型
		// S 提交
		$scope.doSubmit = function(){
			CommonFunction.zteHttp('post','/wuser/updateUserInfo',{
    			uid:$scope.uid,
    			nickname:$scope.wxuser_nickname,
    			relname:$scope.wxuser_relname,
    			code:$scope.wxuser_code,
    			sex:$scope.wxuser_sex,
    			height:$scope.wxuser_height,
    			btype:$scope.wxuser_btype
    		},function(data){
    			layer.msg("保存成功！",{ionic:1})
    		});
		}
		// E提交
		
 		}; // E init
   
     }])
    .controller('wuserequipController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='绑定设备';
    	$scope.isEquip=false;
    	// S 微信扫一扫配置
    	CommonFunction.zteHttp('post','/wechat/getWechatConfig',{
    		 url : location.href.split("#")[0] 
		},function(data){
			wx.config({
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: data.rtnMap.appId, // 必填，公众号的唯一标识
			    timestamp: data.rtnMap.timestamp, // 必填，生成签名的时间戳
			    nonceStr: data.rtnMap.noncestr, // 必填，生成签名的随机串
			    signature: data.rtnMap.signature,// 必填，签名，见附录1
			    jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		});
    	$scope.scanEquip = function(){

    		wx.scanQRCode({
    		    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
    		    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
    		    success: function (res) {
    		    	var uid= ParamsFunction.getParams("wechat_opeid",'',false);
    		    	var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

    		    	var resurl=result.split("#MD");

    		    	if(resurl.length===1){
    		    		//不是通过系统注册的设备

    		    		var tmpMid = resurl[0].trim().split(/\s+/g)[resurl[0].trim().split(/\s+/g).length-1];
    		    		if(tmpMid>0){
    		    			//查找equip中是否有这个设备
        		    		CommonFunction.zteHttp('get','/wequip/countEquipByEquipId',{
          			   		    equipid:tmpMid
    	      				},function(data){
    	      					if(data>0){
    	      						//跳转到绑定设备页面
    	      						ParamsFunction.setParams("bdequip_did","tmpDeviceId");
    		  			    		ParamsFunction.setParams("bdequip_snno",tmpMid);
    		  						CommonFunction.gotoPage('wuserequip3', false);
    	      					}else{

    	      						layer.msg("未找到此设备！",{ionic:0});
    	      					}
    	      				});
    		    			
    		    		}else{
    		    			layer.msg("二维码信息错误！",{ionic:0});
    		    		}

    		    		
    		    		
    		    	}else{
				resurl=resurl[1]
    		    		var mid=resurl.split("#PD")[0];
        		    	var did=resurl.split("#PD")[1];
        		    	
        		    	//先查找这个did是否存在  以此判断二维码是否过期
        		    	CommonFunction.zteHttp('get','/wequip/getEquipByDeviceId',{
      			   		  did:did
    	  				},function(data){
    	  					if(data===0){
    	  						return;
    	  					}else{
    	  						CommonFunction.zteHttp('get','/wequip/getEquipByEquipid',{
    	      			   		    mid:mid
    		      				},function(data){
    		      					//$scope.uEquip =  data.resultData[0];
    		  			    		ParamsFunction.setParams("bdequip_did",did);
    		  			    		ParamsFunction.setParams("bdequip_snno",mid);
    		  						CommonFunction.gotoPage('wuserequip3', false);
    		      				});
    	  					}
    	  				});
    		    	}
    		    	
    		    	
    		    	return ;
    		    }
    		});
    	}
    	// E 微信扫一扫配置
    	// S 获取设备信息
    	$scope.uid= ParamsFunction.getParams("wechat_opeid",'',false);
    	CommonFunction.zteHttp('get','/wequip/getUserEquip',{
   		  uid :$scope.uid
		},function(data){
			if(data.resultData.length>0){
				$scope.isEquip=true;
				for(var i=0;i<data.resultData.length;i++)
				{
					switch(data.resultData[i].model)
					{
						case 'BP88B':
							data.resultData[i].pic="../../img/wechart/user/BP88B.png";
							break;
						case 'RBP9801':
							data.resultData[i].pic="../../img/wechart/user/RBP9801.png";
							break;
						default:
							data.resultData[i].pic="../../img/wechart/user/equipment.png";
							break;
					}
				}
				$scope.uEquip=data.resultData;
			}else{
				$scope.isEquip=false;
			}
		});
    	// E 获取设备信息
    	
    	// S 跳转到设备详细
    	$scope.searchEquip = function(name,model,snno){
    		ParamsFunction.setParams("bdequip_name",name);
    		ParamsFunction.setParams("bdequip_model",model);
    		ParamsFunction.setParams("bdequip_snno",snno);
    		$scope.uid= ParamsFunction.getParams("wechat_opeid",'',false);
    		CommonFunction.gotoPage('wuserequip2', false);
    	}
    	// E 跳转到设备详细
    	
    }])
    // S 取消绑定
     .controller('wuserequip2Controller', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='取消绑定';
		$scope.uid= ParamsFunction.getParams("wechat_opeid",'',false);
		if(ParamsFunction.getParams("bdequip_snno",'',false)==""){
			CommonFunction.gotoPage('wuserequip', false);
		}
		CommonFunction.zteHttp('get','/wequip/getEquipByEquipid',{
	   		  mid:ParamsFunction.getParams("bdequip_snno",'',false)
		},function(data){
			$scope.uEquip =  data.resultData[0];
		});
		$scope.deleteEquip = function(){
			// getTokenAPI
			CommonFunction.zteHttp('get','/wechat/getTokenAPI',{
		   		 
			},function(token){
				CommonFunction.zteHttp('get','/wequip/deleteUserEquip',{
			   		  uid :$scope.uid,
			   		  token:token,
			   		  mid:ParamsFunction.getParams("bdequip_snno",'',false)
				},function(data){
					if(data.result==0){
						layer.msg("取消成功！");
			    		ParamsFunction.setParams("bdequip_snno","");
						CommonFunction.gotoPage('wuserequip', false);
					}else{
						layer.msg("系统繁忙！");
					}
				});
			});
		}
    }])// E 取消绑定
    // S 绑定
    .controller('wuserequip3Controller', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='设备绑定';
		$scope.uid= ParamsFunction.getParams("wechat_opeid",'',false);
		if(ParamsFunction.getParams("bdequip_snno",'',false)==""){
			CommonFunction.gotoPage('wuserequip', false);
		}
		CommonFunction.zteHttp('get','/wequip/getEquipByEquipid',{
	   		  mid:ParamsFunction.getParams("bdequip_snno",'',false)
		},function(data){
			$scope.uEquip =  data.resultData[0];
			$scope.mid = data.resultData[0].snNo;
		});
	
		$scope.bdEquip = function(){
	    	CommonFunction.zteHttp('get','/wechat/insertUserEquipByWx',{
	     		  uid :$scope.uid,
	     		  mid :$scope.mid,
	     		  did :ParamsFunction.getParams("bdequip_did",'',false)
	  		},function(data){
	  			
	  			if(data.result=="0"){
	  				layer.msg("绑定成功！");
	  				CommonFunction.gotoPage('wuserequip', false);
	  			}else if(data.result=="101"){
	  				if(data.message==null){
	  					data.message="";
	  				}
	  				layer.msg("<div style=\"max-width:240px\">设备已被"+data.message+"绑定</div>");
	  				CommonFunction.gotoPage('wuserequip', false);
	  			}
	  		});
		}
    }])
    .controller('wuserphone2Controller', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title='绑定手机号';
    	$scope.phone=ParamsFunction.getParams("wuserPhone",'',false);
    	$scope.rePhone = function(){
    		ParamsFunction.setParams("wuserPhone",$scope.phone);
        	CommonFunction.gotoPage('wuserphone', false);
    	};
    	$scope.uid=ParamsFunction.getParams("wechat_opeid",'',false);
    	$scope.bindPhone = function(){
    		CommonFunction.zteHttp('post','/wuser/updatePhone',{
    			uid:$scope.uid,
    			phone:$scope.phone
    		},function(data){
    			var result = data.result;
                if(result == "0"){
                	layer.open({
            			  btn: ['确定'],
            			  yes: function(index, layero){
            				  layer.close(index);
            				  CommonFunction.gotoPage('wusercenter', false);
            				
            			  },
            			  cancel: function(index, layero){
            				  layer.close(index);
            				  CommonFunction.gotoPage('wusercenter', false);
            				 
              	          },
            			  content: "绑定成功！"
            			});
                	
                	
                }
    		})
    	};
    }])
    .controller('wuserphoneController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$interval',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$interval) {
    	document.title='绑定手机号';
    	// S 获取验证码
    	$scope.phone=ParamsFunction.getParams("wuserPhone",'',false);
    	$scope.vcode = null;
    	$scope.btn_reg_disabled = false;//注册按钮默认可用
    	$scope.vcode_btn_disabled = false;//按钮不可点击
    	$scope.paracont = "获取验证码";
    	$scope.second = 60;
    	var timePromise = undefined;
    	$scope.uid=ParamsFunction.getParams("wechat_opeid",'',false);
    	// S 获取用户绑定手机号
    	if($scope.phone==null){
    		CommonFunction.zteHttp('post','/wuser/getUserPhone',{
    			uid:$scope.uid
    		},function(data){
    			if(data.rtnMap.resultData[0].userTel!=null){
    				$scope.phone=data.rtnMap.resultData[0].userTel;
    				//ParamsFunction.getParams("wuserPhone",'',false);
    			}
    		});
    	}
    	// E 获取用户绑定手机号
    	$scope.clearPhone = function(){
    		$scope.phone=null;
    	}
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
    				layer.msg('请输入正确的联系电话');
    				return;
    			}
    			if(!/^1\d{10}$/.test($scope.phone)){
    				layer.msg('请输入正确的联系电话');
    				return;
    			}
    			//按钮显示倒计时
    			$scope.showcounter();
    			//先验证手机号码是否已在系统中维护
    			CommonFunction.zteHttp('post','/wuser/regSendVcode',{
    				phone:$scope.phone
    			},function(data){
    	            var result = data.result;
    	            if(result == "101"){
    	            	if(data.message == "PHONE_ERR"){
    	            		$scope.second = 0;//取消倒计时
    	            		layer.msg('请输入正确的联系电话');
    	            		return;
    	            	}
    	            	if(data.message == "SEND_ERR"){
    	            		layer.msg("发送失败，请稍后重试");
    	            		return;
    	            	}
    	            	layer.msg("操作失败，请稍后重试");
    	            }
    	            if(result == "0"){
    	            	layer.msg("验证码已发送");
    	            	return;
    	            }
    			},function(data){
    				layer.msg("请求失败，请稍后重试");
    	    	});
    		}else{
    			layer.msg($scope.second+"秒后可重发");
    		}
    	}
    	
    	// E 获取验证码
    	// S 下一步
    	//点击注册按钮调用的方法
    	$scope.nextStep = function() {
    		
    		if ($scope.phone == null || $scope.phone == "") {
    			layer.msg('请输入正确的联系电话');
    			return;
    		}
    		if(!/^1\d{10}$/.test($scope.phone)){
    			layer.msg('请输入正确的联系电话');
    			return;
    		}
    		
    		if ($scope.vcode == null || $scope.vcode == "") {
    			layer.msg("请输入验证码");
    			return;
    		}
    		if (!/^\d{6}\b/.test($scope.vcode)) {
    			layer.msg("验证码有误");
    			return;
    		}
    		//禁用注册按钮
    		$scope.btn_reg_disabled = true;
    		CommonFunction.zteHttp('post','/wuser/regValidate',{
    			
    			phone:$scope.phone,
    		
    			vcode:$scope.vcode
    		},function(data){
    			var result = data.result;
    			$scope.btn_reg_disabled = false;//恢复注册按钮可用
                if(result == "101"){
                	var msg = data.message;
                	
            		if(msg == "VCODE_ERR"){
            			layer.msg('验证码错误！');
            			return;
            		}
            		layer.msg('操作失败，请稍后重试');
                }
                if(result == "0"){
                	ParamsFunction.setParams("wuserPhone",$scope.phone);
                	CommonFunction.gotoPage('wuserphone2', false);
                }
    		},function(data){
    			layer.msg("请求失败，请稍后重试");
        		$scope.btn_reg_disabled = false;//恢复注册按钮可用
        	});
    	}
    	// E 下一步
    }])
    .controller('wuserzhaohuiController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$timeout',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$timeout) {
    	$scope.deviceid=decodeURIComponent(location.href).split("#DEVICEID")[1];
    	$scope.uid=decodeURIComponent(location.href).split("#UID")[1].split("#DEVICEID")[0];
    	$scope.checkRecordInfo = function(){
    		if($scope.ssyRecord=="请测量"||$scope.szyRecord=="请测量"||$scope.xlRecord=="请测量"){
    			layer.msg("请选择测量结果！")
    		}else{
    			layer.load(1, {shade: [0.6, '#333']});
    			CommonFunction.zteHttp('get','/wechat/getTokenAPI',{
   		   		 
    			},function(token){
    					
    	    		CommonFunction.zteHttp('get','/wequip/zhaohuiEquip',{
    	    			did:$scope.deviceid,
    	    			ssy:$scope.ssyRecord,
    	    			szy:$scope.szyRecord,
    	    			xl:$scope.xlRecord,
    	    			uid:$scope.uid,
    	    			token:token
    	    		},function(data){
    	    			if(data.result=="0"){
    	    				layer.msg("找回成功！");
    	    				CommonFunction.gotoPage('wuserequip', false);
    	    			}else{
    	    				layer.msg("找回失败！");
    	    			}
    	    			layer.closeAll('loading');
    	    		});
    			});
    		}
    		
    	};
    	document.title='找回设备';
    	$scope.ssyRecord="请测量";
    	$scope.szyRecord="请测量";
    	$scope.xlRecord="请测量";
    	var ssyList=[];
    	var szyList=[];
    	var xlList=[];
    	for(var ssylp=60;ssylp<180;ssylp++){
    		ssyList.push(ssylp);
    	}
    	for(var szylp=30;szylp<140;szylp++){
    		szyList.push(szylp);
    	}
    	for(var xllp=30;xllp<120;xllp++){
    		xlList.push(xllp);
    	}
    
		var mobileSelect3 = new MobileSelect({
    	    trigger: '#zhList', 
    	    title: '添加数据',  
    	    wheels: [
    	             	{data: ssyList,isdanwei:"<p style='width: 25px;line-height: 39px;margin-left:3%;font-size: 12px;display: inline;position: absolute;'>高压</p><p style='line-height: 39px;width: 40px;font-size:12px;display:inline;margin-left: 21%;position: absolute;'>mmHg</p><p style='line-height: 39px;width:25px;font-size:12px;display:inline;margin-left: 38%;position: absolute;'>低压</p><p style='line-height: 39px;width: 40px;font-size:12px;display:inline;margin-left: 54%;position: absolute;'>mmHg</p><p style='line-height: 39px;width:25px;font-size:12px;display:inline;margin-left: 71%;position: absolute;'>心率</p><p style='line-height: 39px;width: 30px;font-size:12px;display:inline;margin-left: 87%;position: absolute;'>次/分</p>"},
    	             	{data: szyList,isdanwei:""},
    	             	{data: xlList,isdanwei:""},
    	             	
    	            ],
    	    position:[30,30,30], //初始化定位 打开时默认选中的哪个  如果不填默认为0
    	    callback:function(e){
    	    	console.log(e)
    	    	$scope.ssyRecord=ssyList[e[0]]
    	    	$scope.szyRecord=szyList[e[1]]
    	    	$scope.xlRecord=xlList[e[2]]
    	    	$timeout(function () {  
					return ;
    	    	}, 10);
    	    	/*$scope.wxuser_btype=bList[e[0]];
    	    	$scope.showbtype=false;
    	    	$timeout(function () {  
						return ;
				}, 10);*/
    	    },
    	    transitionEnd:false
    	  
    	});
    	
    }])
    ;