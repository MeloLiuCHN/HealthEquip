/**
 * Created by Administrator on 2016-7-13.
 */

angular.module('CommService',['ngCookies'])

    .service('CommonFunction', function ($http,$state,$cookieStore) {

        var browse_version=navigator.userAgent;
        
        var ctrlCookie=function(typeCtrl,key,value){

            if(typeCtrl=='put'){
                $cookieStore.put(key,value);
            }else if(typeCtrl=='get'){
                return $cookieStore.get(key);
            }else if(typeCtrl=='remove'){
                $cookieStore.remove(key);
            }else if(typeCtrl=='isEmpty'){
                return $cookieStore.get('userId')==undefined||$cookieStore.get('familyRoleId')==undefined;
            }

        };

        var getBriFromICard=function(icard){

            var bris=icard.substr(6,8);
            return bris.substr(0,4)+'-'+bris.substr(4,2)+'-'+bris.substr(6,2);

        };

        var zteLayer=function(title,fn){
            if(fn==undefined){
                layer.alert(title,{closeBtn:0});
            }else{
                layer.alert(title,{closeBtn:0,yes:fn});
            }

        };
        
        var layerTips = function(message,id){
        	layer.tips(message, id,{
        		tips:[2,'#676767']
        	});
        };

        var layerMsg = function(message,fn){
        	if(fn==undefined){
        		layer.msg(message,{time:2000});
        	}else{
        		layer.msg(message,{shift: -1, time:1000},function(){
            		fn();
            	});
        	}
        	
        }
        
        var layerMsgOk = function(txt,fn){
        	var msgTxt = "<font style='font-weight:bold;'>"+txt+"</font>";
        	if(fn==undefined){
        		layer.msg(msgTxt, {icon: 1});
        	}else{
        		layer.msg(msgTxt, {icon: 1}, function(){fn()});
        	}
        }
        var layerMsgErr = function(txt,fn){
        	var msgTxt = "<font style='font-weight:bold;'>"+txt+"</font>";
        	if(fn==undefined){
        		layer.msg(msgTxt, {icon: 2});
        	}else{
        		layer.msg(msgTxt, {icon: 2}, function(){fn()});
        	}
        }
        var layerSuccess = function(title,message,fn){
        	if(fn==undefined){
        		layer.alert(message, {
            		icon: 1,
            		shade: 0.3,
            		title:title
        		});
        	}else{
        		layer.alert(message, {
            		icon: 1,
            		shade: 0.3,
            		title:title
        		},function(){
        			fn();
        		});
        	}
        	
        }
        var layerError = function(title, message){
        	layer.alert(message, {
        		icon: 2,
        		shade: 0.3,
        		title:title
        	});
        }
        var layerWarning = function(title,message,fn){
        	if(fn==undefined){
        		layer.alert(message, {
            		icon: 0,
            		shade: 0.3,
            		title:title
        		});
        	}else{
        		layer.alert(message, {
            		icon: 0,
            		shade: 0.3,
            		title:title
        		},function(){
        			fn();
        		});
        	}
        	
        }
        var layerLoading =function(message){
        	var index = layer.msg(message, {
        		icon: 16,
        		shade: 0.01,
        		time:0
    		});
        	return index;
        }
        var layerClose = function(index){
        	layer.close(index);
        }
        var getDateString=function(date,datesplit,timef,istime,dtf){

            datesplit=datesplit==undefined?'-':datesplit;
            istime=istime==undefined?false:istime;
            dtf=dtf==undefined?' ':dtf;
            timef=timef==undefined?':':timef;
            var date=(date==undefined?new Date():date);
            var res=date.getFullYear()+datesplit+(date.getMonth()+1)+datesplit+date.getDate();
            if(istime){
                res+=dtf+date.getHours()+timef+date.getMinutes()+timef+date.getSeconds();
            }
            return res;
        };

        var countAgeByBrithday=function(brithday){
            var arrs=brithday.split('-');
            var year=parseInt(arrs[0]);
            var month=parseInt(arrs[1])-1;
            var day=parseInt(arrs[2]);
            var myDate=new Date();
            myDate.setFullYear(year,month,day);

            var curDate=new Date();
            return parseInt((curDate.getTime()-myDate.getTime())/1000/3600/24/30/12);
        };

        var isEmpty=function(val,TbackVal,FbackVal){

            if(val==undefined||val==''||val==null){
                if(TbackVal !=undefined){
                    return TbackVal;
                }
                return true;
            }else{
                if(FbackVal !=undefined){
                    return FbackVal;
                }
                return false;
            }
        };

        var iaAuth=function(data){
            if(data.isauth!=undefined&&!data.isauth){
                gotoPage('login',false);
                return true;
            }
            return false;

        };
        var compileStr = function(code){
        	var c=String.fromCharCode(code.charCodeAt(0)+code.length);  
        	 for(var i=1;i<code.length;i++)  
        	  {        
        	   c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
        	 }     
        	 return escape(c);
        };
        var uncompileStr = function(code){
        	 code=unescape(code);        
        	 var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
        	 for(var i=1;i<code.length;i++)  
        	 {        
        	  c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
        	 }        
        	 return c; 
        }
        /**
         * http请求
         * @param url
         * @param params
         * @param succfn
         * @param errorfn
         * @param isLabel
         * @param istoast
         */
        var zteHttp = function (type,url, data, okcallback, failcallback) {

            // if(browse_version.indexOf('MSIE 9')!=-1||browse_version.indexOf('MSIE 8')!=-1){
            //
            //     $.ajax({
            //         url: baseUrl+url,
            //         data: data,
            //         contentType: 'text/plain',
            //         type: type,
            //         dataType: 'json'
            //     }).done(function(response){okcallback(response);})
            //       .fail(function(response){alert(response)});
            // }else{

                if(type=='get'){
                    $http.get(baseUrl+url,{
                        params :data
                    }).then(function successCallback(response) {
                        if(iaAuth(response.data)){
                            return;
                        }
                        if (okcallback != undefined && typeof okcallback == 'function') {
                            okcallback(response.data);
                        }

                    }, function errorCallback(response) {
                        if(iaAuth(response.data)){
                            return;
                        }
                        if (failcallback != undefined && typeof failcallback == 'function') {
                            failcallback(response);
                        }
                    });
                }else{
                    $http.post(baseUrl+url,data).then(function successCallback(response) {
                        if(iaAuth(response.data)){
                            return;
                        }
                        if (okcallback != undefined && typeof okcallback == 'function') {
                            okcallback(response.data);
                        }

                    }, function errorCallback(response) {
                        if(iaAuth(response.data)){
                            return;
                        }
                        if (failcallback != undefined && typeof failcallback == 'function') {
                            failcallback(response);
                        }
                    });
                }

            // }

        };
        /**
         * 跳转页面
         * @param page
         * @param isvali
         */
        var gotoPage=function(page,isvali){

            if(isvali==undefined&&isvali==true){

                zteHttp('GET','',function(result){

                    if(result=='true'){
                        $state.go(page);
                    }else{
                        //$location.path('test');
                    }

                },function(){
                    //$location.path('/test');
                });

            }else{

                $state.go(page);
            }

        };
        //获取时间格式 YYYY-MM-DD HH:MM:SS
        var getCurrentDate = function(){
        	var myDate = new Date();
        	var seperator1 = "-";
        	var seperator2 = ":";
        	var month = myDate.getMonth() + 1;
        	var strDate = myDate.getDate();
        	var hour=myDate.getHours();
        	var minute=myDate.getMinutes();
        	var second=myDate.getSeconds();
        	if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
        	if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
        	if (hour >= 1 && hour <= 9) {
        		hour = "0" + hour;
            }
        	if (minute >= 0 && minute <= 9) {
        		minute = "0" + minute;
            }
        	if (second >= 0 && second <= 9) {
        		second = "0" + second;
            }
        	var currentdate = myDate.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + minute
            + seperator2 + second;
        	return currentdate;
        };
        return {
        	compileStr:compileStr,
        	uncompileStr:uncompileStr,
        	layerClose:layerClose,
        	layerSuccess:layerSuccess,
        	layerError:layerError,
        	layerWarning:layerWarning,
        	layerLoading:layerLoading,
        	layerTips:layerTips,
        	layerMsg:layerMsg,
        	layerMsgOk:layerMsgOk,
        	layerMsgErr:layerMsgErr,
            gotoPage:gotoPage,//跳转页面
            zteHttp: zteHttp,//jsonp请求
            ctrlCookie:ctrlCookie,//操作cookie
            isEmpty:isEmpty,//判断是否为空
            getBriFromICard:getBriFromICard,
            getDateString:getDateString,//得到时间字符串
            countAgeByBrithday:countAgeByBrithday,
            zteLayer:zteLayer,
            getCurrentDate:getCurrentDate //获取时间格式 YYYY-MM-DD HH:MM:SS
        }
    })
    
    .service('ParamsFunction', function (CommonFunction,$cookieStore,$cookies) {
        // var urlParams = {};

        return {
            getParams: function (key, defaultval,isclean) {
            	
                if(isclean==undefined)
                    isclean=true;
                var val = $cookieStore.get(key);
               
                if (CommonFunction.isEmpty(val)) {
                    return defaultval;
                } else {

                    if(isclean){
                        $cookieStore.remove(key);
                    }

                    return val;
                }
            },
            getReplaceParams: function (key, defaultval) {
                var val = $cookieStore.get(key);
                if (val == undefined || val == null) {
                    $cookieStore.put(key,defaultval);
                    return defaultval;
                } else {
                    return val;
                }
            },
            // getInsertParams: function (mainkey,addval) {
            //     if(CommonFunction.isEmpty(addval)){
            //         return;
            //     }
            //     var val = urlParams[mainkey];
            //     if (!CommonFunction.isEmpty(val)) {
            //         angular.forEach(addval,function(v, k){
            //             urlParams[mainkey][k]=v;
            //         });
            //     }
            // },
            setParams: function (key, value) {
                $cookieStore.put(key,value);
            },
            delParams: function (key) {
                $cookieStore.remove(key);
            },
            clearParams: function (Prename,isequal) {

                angular.forEach($cookies, function (v, k) {
                    if(Prename!=undefined){
                        if(isequal==undefined) isequal=true;
                        if(isequal&&(Prename==k||k.indexOf(Prename)>-1)){
                            $cookieStore.remove(k);
                        }else if(!isequal&&Prename!=k&&k.indexOf(Prename)==-1){
                            $cookieStore.remove(k);
                        }
                    }else{
                        $cookieStore.remove(k);
                    }

                });
            },
            setParamsWithTime:function(key,value,time){
            	$cookieStore.put(key,value,{'expires':time});
            }
        }
    })
    .service('CheckFunction',function(){
        var reg = {
            number: /(^[1-9]([0-9]*)$|^[0-9]$)/
        };

        var checkReg = function(val,regName){
            return reg[regName].test(val);
        };

        var checkMaxLength = function(val,max){
            return getLength(val) <= max;
        };

        var checkMinLength = function(val,min){
            return getLength(val) >= min;
        };

        var getLength =  function(str){
            if (str == null) return 0;
            if (typeof str != "string"){
                str += "";
            }
            return str.replace(/[^\x00-\xff]/g,"aa").length;
        };

        return {
            checkReg:checkReg,
            checkMaxLength: checkMaxLength,
            checkMinLength: checkMinLength
        }
    })
    .service('UserInfoFunction', function (CommonFunction,ParamsFunction,$cookies) {
    	 var getUserInfo = function(callback){
    		var url= location.search;
           	var oid= ParamsFunction.getParams("wechat_opeid","",false);
          // 	ParamsFunction.setParams("wechat_opeid",null);
    		 if(ParamsFunction.getParams("wechat_opeid",'',false)!=""){
         		var uid=ParamsFunction.getParams("wechat_opeid",'',false);
         		CommonFunction.zteHttp('get','/wuser/insertOrUpdateUser',{
             		uid:uid,
             		nickname:""
             	},function(msg){
             		ParamsFunction.setParams("wuserPhone",msg.rtnMap.resultData[0].userTel);
             		ParamsFunction.setParams("wechat_opeid",uid);
             		ParamsFunction.setParams("wuserNickname",msg.rtnMap.resultData[0].userNickname);
             		if (typeof callback === "function"){
        	            callback(); 
        	        }
             	});
         	}else if(url!=""){
         		var oid=url;
         		var code=location.search.split("?code=")[1].split("&")[0];// 从url中获取code

         		CommonFunction.zteHttp('get','/wechat/getuser',{
             		uid:code
             	},function(data){
             		if(data.rtnMap.headimgurl!=''){
             		//	$scope.headerimg=data.rtnMap.headimgurl;
             			ParamsFunction.setParams("wechat_headerimg",data.rtnMap.headimgurl);
             		}
             		var uid=data.rtnMap.openid;
             		ParamsFunction.setParams("wechat_usersex",data.rtnMap.sex);
             			
             		CommonFunction.zteHttp('get','/wuser/insertOrUpdateUser',{
                 		uid:uid,
                 		nickname:encodeURI(data.rtnMap.nickname)
                 	},function(msg){
                 		ParamsFunction.setParams("wuserPhone",msg.rtnMap.resultData[0].userTel);
                 		ParamsFunction.setParams("wechat_opeid",uid);
                 		ParamsFunction.setParams("wuserNickname",msg.rtnMap.resultData[0].userNickname);
                		//alert("url获取name"+msg.rtnMap.resultData[0].userNickname)

                 		if (typeof callback === "function"){
            	            callback(); 
            	        }
                 	});
             	
             
             	});
         	}
    		 
    	 };
    	 return{
    		 getUserInfo:getUserInfo
    	 }
    });
