/**
 * Created by liuyang on 2017/6/2.
 */
'use strict';

angular.module('WechatApp.WManager', [])

    .config(['$stateProvider','$httpProvider', function ($stateProvider,$httpProvider) {

    	
    	
        $stateProvider
            .state('wmanagercharts', {
                url: "/wmanagercharts",
                templateUrl: 'manager/charts.html',  
                controller: 'wmanagerchartsController'
            })

            .state('wmanagermore', {
                url: "/wmanagermore",
                templateUrl: 'manager/moredata.html',
                controller: 'wmanagermoreController'
            })
        
	        .state('wmanagerqushi', {
	            url: "/wmanagerqushi",
	            templateUrl: 'manager/qushi.html',
	            controller: 'wmanagerqushiController'
	        });

    }])
    .controller('wmanagerchartsController', ['$scope', 'CommonFunction', 'ParamsFunction', 'UserInfoFunction','$window',
        function ($scope, CommonFunction, ParamsFunction, UserInfoFunction,$window) {
    	 layer.load(1, {shade: [0.6, '#333']});
    	// ParamsFunction.setParams("wechat_opeid","oxNV8w_xGftJeaeEWPhAv2NjDUoM")
    
    	$scope.init = function(){
              
          	UserInfoFunction.getUserInfo(function(){
          		$scope.getData(ParamsFunction.getParams("wechat_opeid","",false));
          		$scope.headerimg=ParamsFunction.getParams("wechat_headerimg","",false);
          	});
          	$scope.qushiFlag=true;
          	$scope.flag=true; // 显示暂无数据
          	$scope.line2=true;//不显示第二条数据
          	// S 高低判断
          	$scope.dataDef=[140,90,90,60];//收缩压高，收缩压低，舒张压高，舒张压低
          	document.title='健康管理';
          	// E 高低判断
          	// S 第一行数据赋值
          	$scope.line1data = function(ssy,szy,date){
          		$scope.line1date=date.split(" ")[0].split("-")[1]+"-"+date.split(" ")[0].split("-")[2];
          		$scope.line1time=date.split(" ")[1].split(":")[0]+":"+date.split(" ")[1].split(":")[1];

    				$scope.line1pic='../../img/wechart/user/data-icon-ok.png';
  					if(ssy>$scope.dataDef[0]){
  						$scope.ssy_infostatus= 1; // 0正常 1偏高 2偏低
  						$scope.line1ssy=ssy+"↑";
  						$scope.outlier1={
  							"color":'#ef473a'
  						};
  						$scope.line1pic='../../img/wechart/user/data-icon-high.png';
    				}else if(ssy<$scope.dataDef[1] ){
    					$scope.ssy_infostatus= 2; // 0正常 1偏高 2偏低
    					$scope.line1ssy=ssy+"↓";
    					$scope.outlier1={
    							"color":'#ff8920'
    					};
    					$scope.line1pic='../../img/wechart/user/data-icon-low.png';
    				}else{
    					$scope.line1ssy=ssy;
    				}
  					if(szy>$scope.dataDef[2]){
        	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
        	    		$scope.line1szy=szy+"↑";
        	    		$scope.outlier2={
    							"color":'#ef473a'
    					};
        	    		$scope.line1pic='../../img/wechart/user/data-icon-high.png';
    				}else if(szy<$scope.dataDef[3]){
        	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
        	    		$scope.line1szy=szy+"↓";
        	    		$scope.outlier2={
    							"color":'#ff8920'
    					};
        	    		$scope.line1pic='../../img/wechart/user/data-icon-low.png';
    				}else{
    					$scope.line1szy=szy;
    				}
    			};
          	// E 第一行数据赋值
    			// S 第二行数据赋值
    			$scope.line2data = function(ssy,szy,date){
    				$scope.line2date=date.split(" ")[0].split("-")[1]+"-"+date.split(" ")[0].split("-")[2];
          		$scope.line2time=date.split(" ")[1].split(":")[0]+":"+date.split(" ")[1].split(":")[1];
    				$scope.line2pic='../../img/wechart/user/data-icon-ok.png';
  					if(ssy>$scope.dataDef[0]){
  						$scope.ssy_infostatus= 1; // 0正常 1偏高 2偏低
  						$scope.line2ssy=ssy+"↑";
  						$scope.outlier3={
  							"color":'#ef473a'
  						};
  						$scope.line2pic='../../img/wechart/user/data-icon-high.png';
    				}else if(ssy<$scope.dataDef[1] ){
    					$scope.ssy_infostatus= 2; // 0正常 1偏高 2偏低
    					$scope.line2ssy=ssy+"↓";
    					$scope.outlier3={
    							"color":'#ff8920'
    					};
    					$scope.line2pic='../../img/wechart/user/data-icon-low.png';
    				}else{
    					$scope.line2ssy=ssy;
    				}
  					if(szy>$scope.dataDef[2]){
        	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
        	    		$scope.line2szy=szy+"↑";
        	    		$scope.outlier4={
    							"color":'#ef473a'
    					};
        	    		$scope.line2pic='../../img/wechart/user/data-icon-high.png';
    				}else if(szy<$scope.dataDef[3]){
        	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
        	    		$scope.line2szy=szy+"↓";
        	    		$scope.outlier4={
    							"color":'#ff8920'
    					};
        	    		$scope.line2pic='../../img/wechart/user/data-icon-low.png';
    				}else{
    					$scope.line2szy=szy;
    				}
    			};
    			// E 第二行数据赋值
    	};
    	
    	 $scope.getData = function(uid){
    		
           	CommonFunction.zteHttp('post','/wechart/manager/getCharts',{
           		uid:uid
           	},function(data){
           		// S 获取用户近七次测量数据
           
           		if(data.rtnMap.count>0){
           			$scope.qushiFlag=false; //显示趋势图
           			$scope.redata=data.rtnMap.resultdata.reverse();
           			//$scope.redata=data.rtnMap.resultdata;
           			$scope.ssy=[];
       	    		$scope.szy=[];
       	    		$scope.xl=[];
       	    		$scope.jcdate=["","","","","","",""];
       	    		$scope.ssy_infostatus= 0; // 0正常 1偏高 2偏低
       	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
       	    		$scope.fontcolor='#000';
           			for(var l=0;l<data.rtnMap.count;l++){
           				if(data.rtnMap.resultdata[l].user_ssy>$scope.dataDef[0] ){
           					$scope.ssy.push({value:data.rtnMap.resultdata[l].user_ssy, symbol:'image://../../img/wechart/user/ssy-error.png',symbolSize:7});
           				}else if(data.rtnMap.resultdata[l].user_ssy<$scope.dataDef[1]){
           					$scope.ssy.push({value:data.rtnMap.resultdata[l].user_ssy, symbol:'image://../../img/wechart/user/ssy-error.png',symbolSize:7});
           				}else{
           					$scope.ssy.push(data.rtnMap.resultdata[l].user_ssy);
           				}
           				
           				if( data.rtnMap.resultdata[l].user_szy>$scope.dataDef[2]){
           					$scope.szy.push({value:data.rtnMap.resultdata[l].user_szy, symbol:'image://../../img/wechart/user/szy-error.png',symbolSize:7});
           				}else if(data.rtnMap.resultdata[l].user_szy<$scope.dataDef[3]){
           					$scope.szy.push({value:data.rtnMap.resultdata[l].user_szy, symbol:'image://../../img/wechart/user/szy-error.png',symbolSize:7});
           				}else{
           					$scope.szy.push(data.rtnMap.resultdata[l].user_szy);
           				}
           			
           				$scope.xl.push(data.rtnMap.resultdata[l].user_xl);
           				//$scope.jcdate.push(data.rtnMap.resultdata[l].jiance_date);

           				$scope.jcdate[l]=data.rtnMap.resultdata[l].jiance_date.split(" ")[0].split("-")[1]+'-'+data.rtnMap.resultdata[l].jiance_date.split(" ")[0].split("-")[2];
           				if(data.rtnMap.count-1===l && data.rtnMap.count>1){
           					$scope.line2=false;//显示第二条数据
           					$scope.line1xl=data.rtnMap.resultdata[l].user_xl
           					$scope.line2xl=data.rtnMap.resultdata[l-1].user_xl
           					$scope.line1data(data.rtnMap.resultdata[l].user_ssy,data.rtnMap.resultdata[l].user_szy,data.rtnMap.resultdata[l].jiance_date);
           					$scope.line2data(data.rtnMap.resultdata[l-1].user_ssy,data.rtnMap.resultdata[l-1].user_szy,data.rtnMap.resultdata[l-1].jiance_date);
           				}else if(data.rtnMap.count==1){
           					$scope.line1data(data.rtnMap.resultdata[l].user_ssy,data.rtnMap.resultdata[l].user_szy,data.rtnMap.resultdata[l].jiance_date);
           					$scope.line1xl=data.rtnMap.resultdata[l].user_xl
           					
           				}
           			}
           			
           			$scope.flag=false;
           		//	layer.alert($scope.jcdate);
           			var managerChartss=echarts.init(document.getElementById("managerChart"));
                       var managerchartsoptions={
                       	    toolbox: {
                       	        show: false
                       	    },
                       
                       	    grid:{
                       	    	zlevel:-1,
                       	    	z:-1,
                       	    	x :'35',
                       	    	x2 :'15',
                       	    	y:'20',
                       	    	y2:'30'
                       	    	
                       	    },
                       	    xAxis:  {
                       	        type: 'category',
                       	        boundaryGap: true,
                       	        axisLine : {
                       	        	show:false
                       	        },
                       	        axisLabel : {
										interval:0,
                         	    	textStyle:{
                         	    		color:'#fff'
                         	    	}
                         	     },
                         	     axisTick:{
                         	    	show:false 
                         	     },
                         	    splitLine:{
                         	    	show : false
                         	    },
                       	        data: 	$scope.jcdate
                       	        
                       	    },
                       	    yAxis: {
                       	        type: 'value',
                       	        splitLine: {
                       	            lineStyle:{
                       	            	type : 'dashed',
                       	            	color : 'rgba(255, 255, 255, 0.32)'
                       	            }
                       	        },
                       	        axisLine : {
                     	        	show:false
                     	        },
                       	        axisLabel : {
                       	     	  textStyle:{
                       	    	 	 color:'#fff'
                       	    	  }
                       	        },
                       	        min:40,
                       	        max:160
                       	    },
                       	    series: [

                       	        {
                       	        	itemStyle:{
                       	        		normal:{
                       	        			color:function(e){
                       	        				if(e.data>$scope.dataDef[0] || e.data<$scope.dataDef[1]){
                       	        					return '#d8d80c';
                       	        				}else{
                       	        					return '#fff';
                       	        				}
                       	        			},
                       	        			lineStyle:{
                       	        				color:'#fff',
                       	        				width:1
                       	        			},
                       	        			label : {
                       	        				show : true,
                       	        				formatter : function(e){
                       	        					if(e.value>$scope.dataDef[0] || e.value<$scope.dataDef[1]){
                       	        						return e.value;
                       	        					}
                       	        				},
                       	        				textStyle : {
                       	        					color:'#fff',
                       	        					baseline:'top'
                       	        				}
                       	        			}
                       	        		}
                       	        	},
                       	            name:'收缩压',
                       	            type:'line',
                       	            data:$scope.ssy,
                       	            symbol : 'diamond'
                       	        },
                       	        {
                       	        	
                       	        	itemStyle:{
                       	        		normal:{
                       	        			color:function(e){
                       	        				if(e.data>$scope.dataDef[2] || e.data<$scope.dataDef[3]){
                       	        					return '#d8d80c';
                       	        				}else{
                       	        					return '#fff';
                       	        				}
                       	        			},
                       	        			lineStyle:{
                       	        				color:'#fff',
                       	        				width:1
                       	        			},
                       	        			label : {
                       	        				show : true,
                       	        				formatter : function(e){
                       	        					//console.log(e)
                       	        					if(e.value>$scope.dataDef[2] || e.value<$scope.dataDef[3]){
                       	        						return e.value;
                       	        					}
                       	        				},
                       	        				textStyle : {
                       	        					color:'#fff',
                       	        					baseline:'top'
                       	        				}
                       	        			}
                       	        		}
                       	        	},
                       	            name:'舒张压',
                       	            type:'line',
                       	            data:$scope.szy
                       	        }
                       	    ]
                       	};
               		managerChartss.setOption(managerchartsoptions);
               		managerChartss.setTheme('infographic');
                       // E 获取用户近七次测量数据
           		}
           		layer.closeAll('loading');
           	});
           };
         // S 跳转到趋势图
          $scope.gotoQushi = function(){
          	 CommonFunction.gotoPage('wmanagerqushi', false);
          };
          // E 跳转到趋势图
          // S 跳转到更多页面
          $scope.gotomore = function(){
          	CommonFunction.gotoPage('wmanagermore', false);
          };
          // E 跳转到更多页面
    }])
    
    .controller('wmanagermoreController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    
    //	ParamsFunction.setParams("wechat_opeid","oxNV8w_xGftJeaeEWPhAv2NjDUoM")
     	$scope.dataDef=[140,90,90,60];//收缩压高，收缩压低，舒张压高，舒张压低
     	document.title='血压数据';
     	//ParamsFunction.setParams("wechat_opeid","oxNV8w_xGftJeaeEWPhAv2NjDUoM");
     	$scope.headerimg=ParamsFunction.getParams("wechat_headerimg",'',false);
     	$scope.uid=ParamsFunction.getParams("wechat_opeid",'',false);
     
     		CommonFunction.zteHttp('get','/wechart/manager/getListData',{
        		uid:$scope.uid
        	},function(data){
        		console.log(data);
        		$scope.dateval=data.rtnMap.date;
        		$scope.val=data.rtnMap.datelist;
        		$scope.info=data.rtnMap.infolist;
        	});
     
    
     	
    	/*$scope.init = function(){
    		//初始化表单高度
    		
    		$scope.dateval=['2017年06月05日','2017年06月04日','2017年05月05日','2017年05月04日'];
    		$scope.val={'2017年06月05日':[1,2],'2017年06月04日':[1],'2017年05月05日':[1,2],'2017年05月04日':[1,2]};
    		
         };*/
    }])
    //  趋势图 下个版本
    .controller('wmanagerqushiController', ['$scope', 'CommonFunction', 'ParamsFunction', '$rootScope','$window',
        function ($scope, CommonFunction, ParamsFunction, $rootScope,$window) {
    	document.title="血压趋势图";
	    	
	    	var now = new Date();     
	    	var nowDayOfWeek = now.getDay();         //今天本周的第几天     
	    	var nowDay = now.getDate();              //当前日     
	    	var nowMonth = now.getMonth();           //当前月     
	    	var nowYear = now.getYear();  
	    	nowYear += (nowYear < 2000) ? 1900 : 0;  // 
	    	function getNowFormatDate(date) {
	    		 var myyear = date.getFullYear();     
	    		    var mymonth = date.getMonth()+1;     
	    		    var myweekday = date.getDate();      
	    		         
	    		    if(mymonth < 10){     
	    		        mymonth = "0" + mymonth;     
	    		    }      
	    		    if(myweekday < 10){     
	    		        myweekday = "0" + myweekday;     
	    		    }     
	    		    var res = (myyear+"-"+mymonth + "-" + myweekday).replace(/(^\s*)|(\s*$)/g, "").substr(0, 10); // TOMCAT7.0.76 校验包含非法字符异常处理 
	    		    return res;
	    	}
	    	//获得本周的开始日期     
	    	function getWeekStartDate() {      
	    	    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek-$scope.dateOffset*7);      
	    	    return getNowFormatDate(weekStartDate);     
	    	}      
	    	    
	    	//获得本周的结束日期     
	    	function getWeekEndDate() {      
	    	    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek-$scope.dateOffset*7));      
	    	    return getNowFormatDate(weekEndDate);     
	    	}  
	    	//获得某月的天数     
	    	function getMonthDays(myMonth){     
	    	    var monthStartDate = new Date(nowYear, myMonth, 1);      
	    	    var monthEndDate = new Date(nowYear, myMonth + 1, 1);      
	    	    var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);      
	    	    return   days;      
	    	}    
	    	//获得本月的开始日期     
	    	function getMonthStartDate(){     
	    	    var monthStartDate = new Date(nowYear, (nowMonth-$scope.dateOffset), 1);      
	    	    return getNowFormatDate(monthStartDate);     
	    	}     
	    	    
	    	//获得本月的结束日期     
	    	function getMonthEndDate(){     
	    	    var monthEndDate = new Date(nowYear, (nowMonth-$scope.dateOffset), getMonthDays(nowMonth-$scope.dateOffset));      
	    	    return getNowFormatDate(monthEndDate);     
	    	}  
	    	//获取本年的开始日期
	    	function getYearStartDate(){
	    		return nowYear-$scope.dateOffset + "-01-01";
	    	}
	    	//获取本年的结束日期
	    	function getYearEndDate(){
	    		return nowYear-$scope.dateOffset + "-12-31";
	    	}
	    	//获取当天日期
	    	function getNowDayDate(){
	    		  var getDayDate = new Date(nowYear, nowMonth, nowDay-$scope.dateOffset);      
		    	    return getNowFormatDate(getDayDate);     
	    	}
    	$scope.init = function(){
    	//	ParamsFunction.setParams("wechat_opeid","oobmAvw66L_1kIuhcdtYhxF3R_-E");
    		$scope.uid=ParamsFunction.getParams("wechat_opeid",'',false);
         	$scope.dataDef=[140,90,90,60];//收缩压高，收缩压低，舒张压高，舒张压低
            // S 初始化查询段
            $scope.dateSE='本周';
            $scope.dateType='w';
            $scope.dateClassW='wmanagerqushidateSE';
            $scope.d='d';	
            $scope.w='w';
            $scope.m='m';
            $scope.y='y';
            $scope.ww="trend-current";
            $scope.dateOffset=0; //本周的偏移量
            $scope.sDateRange=getWeekStartDate(); //获取本周起始日期
            $scope.eDateRange=getWeekEndDate(); //本周的结束日期
     
            // E 初始化查询段
            // S 获取统计图数据
            $scope.getCharts();
            // E 获取统计图数据
    	};
    	// S 计算平均 最高 最低
  		$scope.getResLevel = function(){
  			// S 判断血压级别
			
			
				$scope.maxSSY=0;
				$scope.maxSZY=0;
				$scope.maxXL=0;
				$scope.tmpMaxLevel=0;
				$scope.minSSY=0;
				$scope.minSZY=0;
				$scope.minXL=0;
				$scope.tmpMinLevel=10;
				$scope.resMaxLevel.length>0?$scope.pjSSY=parseInt($scope.sumSSY/$scope.resMaxLevel.length):$scope.pjSSY=0;
				$scope.resMaxLevel.length>0?$scope.pjSZY=parseInt($scope.sumSZY/$scope.resMaxLevel.length):$scope.pjSZY=0;
				$scope.resMaxLevel.length>0?$scope.pjXL=parseInt($scope.sumXL/$scope.resMaxLevel.length):$scope.pjXL=0;
				//判断平均值偏高偏低
				$scope.dataDef=[140,90,90,60];//收缩压高，收缩压低，舒张压高，舒张压低
				$scope.pjpic='../../img/wechart/user/data-icon-ok.png';
				$scope.maxpic='../../img/wechart/user/data-icon-ok.png';
				$scope.minpic='../../img/wechart/user/data-icon-ok.png';
				if($scope.pjSZY != 0){
					if($scope.pjSZY>$scope.dataDef[2]){
						$scope.pjpic='../../img/wechart/user/data-icon-high.png';
					}else if($scope.pjSZY<$scope.dataDef[3]){
						$scope.pjpic='../../img/wechart/user/data-icon-low.png';
					}
					if($scope.pjSSY>$scope.dataDef[0]){
						$scope.pjpic='../../img/wechart/user/data-icon-high.png';
					}else if($scope.pjSSY<$scope.dataDef[1] ){
						$scope.pjpic='../../img/wechart/user/data-icon-low.png';
					}
					
				}
				
				
				for(var maxp=0;maxp<$scope.resMaxLevel.length;maxp++){
					if(parseInt($scope.resMaxLevel[maxp])>parseInt($scope.tmpMaxLevel)){
						$scope.tmpMaxLevel=$scope.resMaxLevel[maxp];
						$scope.maxSSY=$scope.resSsy[maxp];
	      				$scope.maxSZY=$scope.resSzy[maxp];
	      				$scope.maxXL=$scope.xl[maxp];
	      				if($scope.maxSSY>$scope.dataDef[0]){
	    					$scope.maxpic='../../img/wechart/user/data-icon-high.png';
	    				}else if($scope.maxSSY<$scope.dataDef[1] ){
	    					$scope.maxpic='../../img/wechart/user/data-icon-low.png';
	    				}else if($scope.maxSZY>$scope.dataDef[2]){
	    					$scope.maxpic='../../img/wechart/user/data-icon-high.png';
	    				}else if($scope.maxSZY<$scope.dataDef[3]){
	    					$scope.maxpic='../../img/wechart/user/data-icon-low.png';
	    				}else{
	    					$scope.maxpic='../../img/wechart/user/data-icon-ok.png';
	    				}
					}else if(parseInt($scope.resMaxLevel[maxp])==parseInt($scope.tmpMaxLevel)){
						if(parseInt($scope.resSsy[maxp])>parseInt($scope.maxSSY)){
							$scope.maxSSY=$scope.resSsy[maxp];
	          				$scope.maxSZY=$scope.resSzy[maxp];
	          				$scope.maxXL=$scope.xl[maxp];
	          				
		    				if($scope.maxSSY>$scope.dataDef[0]){
		    					$scope.maxpic='../../img/wechart/user/data-icon-high.png';
		    				}else if($scope.maxSSY<$scope.dataDef[1] ){
		    					$scope.maxpic='../../img/wechart/user/data-icon-low.png';
		    				}else if($scope.maxSZY>$scope.dataDef[2]){
		    					$scope.maxpic='../../img/wechart/user/data-icon-high.png';
		    				}else if($scope.maxSZY<$scope.dataDef[3]){
		    					$scope.maxpic='../../img/wechart/user/data-icon-low.png';
		    				}else{
		    					$scope.maxpic='../../img/wechart/user/data-icon-ok.png';
		    				}
		    				
						}
					}
				}
				for(var minp=0;minp<$scope.resMinLevel.length;minp++){
					if(parseInt($scope.resMinLevel[minp])<parseInt($scope.tmpMinLevel)){
						$scope.tmpMinLevel=$scope.resMinLevel[minp];
						$scope.minSSY=$scope.resSsy[minp];
	      				$scope.minSZY=$scope.resSzy[minp];
	      				$scope.minXL=$scope.xl[minp];
	      				if($scope.minSSY>$scope.dataDef[0]){
	    					$scope.minpic='../../img/wechart/user/data-icon-high.png';
	    				}else if($scope.minSSY<$scope.dataDef[1] ){
	    					$scope.minpic='../../img/wechart/user/data-icon-low.png';
	    				}else if($scope.minSZY>$scope.dataDef[2]){
	    					$scope.minpic='../../img/wechart/user/data-icon-high.png';
	    				}else if($scope.minSZY<$scope.dataDef[3]){
	    					$scope.minpic='../../img/wechart/user/data-icon-low.png';
	    				}else{
	    					$scope.minpic='../../img/wechart/user/data-icon-ok.png';
	    				}
					}else if(parseInt($scope.resMinLevel[minp])==parseInt($scope.tmpMinLevel)){
						if(parseInt($scope.resSsy[minp])<parseInt($scope.minSSY)){
							$scope.minSSY=$scope.resSsy[minp];
	          				$scope.minSZY=$scope.resSzy[minp];
	          				$scope.minXL=$scope.xl[minp];
	          				
		    				if($scope.minSSY>$scope.dataDef[0]){
		    					$scope.minpic='../../img/wechart/user/data-icon-high.png';
		    				}else if($scope.minSSY<$scope.dataDef[1] ){
		    					$scope.minpic='../../img/wechart/user/data-icon-low.png';
		    				}else if($scope.minSZY>$scope.dataDef[2]){
		    					$scope.minpic='../../img/wechart/user/data-icon-high.png';
		    				}else if($scope.minSZY<$scope.dataDef[3]){
		    					$scope.minpic='../../img/wechart/user/data-icon-low.png';
		    				}else{
		    					$scope.minpic='../../img/wechart/user/data-icon-ok.png';
		    				}
						}
					}
				}
				// E 判断血压级别
				
  		}
  		// E 计算平均 最高 最低
    	 $scope.getCharts=function(){
    		 layer.load(1, {shade: [0.6, '#333']});
    		    //layer.msg($scope.sDateRange+"++"+$scope.eDateRange)
    			 CommonFunction.zteHttp('post','/wechart/manager/qushiData',{
    	         		uid:$scope.uid,
    	         		sDate:$scope.sDateRange,
    	         		eDate:$scope.eDateRange
    	         	},function(data){
              			$scope.ssy=[];
          	    		$scope.szy=[];
          	    		$scope.xl=[];
          	    		$scope.jcdate=[];
          	    		$scope.ssy_infostatus= 0; // 0正常 1偏高 2偏低
          	    		$scope.szy_infostatus= 0; // 0正常 1偏高 2偏低
          	    		$scope.fontcolor='#000';
          	    		var managerChartss=echarts.init(document.getElementById("managerChart"));
          	    		$scope.gcNum=0;//共测次数
          	    		$scope.zcNum=0;//正常次数
          	    		$scope.ycNum=0;//异常次数
          	    		$scope.ssyLevel=[]; //收缩压级别
          				$scope.szyLevel=[]; //舒张压级别
          				$scope.resMinLevel=[]; //最低排序最终级别
          				$scope.resMaxLevel=[]; //最高最终级别
          				$scope.resSsy=[];
          				$scope.resSzy=[];
          				$scope.sumSSY=0;
          				$scope.sumSZY=0;
          				$scope.sumXL=0;
          	    		if(data.resultData.length>0){
          	    			$scope.gcNum=data.resultData.length;
          	    			for(var ei=0;ei<data.resultData.length;ei++){
          	    				if(data.resultData[ei].user_ssy>$scope.dataDef[0] ){
                  					$scope.ssy.push({value:data.resultData[ei].user_ssy, symbol:'image://../../img/wechart/user/ssy-error.png',symbolSize:7});
                  				}else if(data.resultData[ei].user_ssy<$scope.dataDef[1]){
                  					$scope.ssy.push({value:data.resultData[ei].user_ssy, symbol:'image://../../img/wechart/user/ssy-error.png',symbolSize:7});
                  				}else{
                  					$scope.ssy.push(data.resultData[ei].user_ssy);
                  				}
                  				
                  				if( data.resultData[ei].user_szy>$scope.dataDef[2]){
                  					$scope.szy.push({value:data.resultData[ei].user_szy, symbol:'image://../../img/wechart/user/szy-error.png',symbolSize:7});
                  				}else if(data.resultData[ei].user_szy<$scope.dataDef[3]){
                  					$scope.szy.push({value:data.resultData[ei].user_szy, symbol:'image://../../img/wechart/user/szy-error.png',symbolSize:7});
                  				}else{
                  					$scope.szy.push(data.resultData[ei].user_szy);
                  				}
                  				$scope.resSsy.push(data.resultData[ei].user_ssy);
                  				$scope.resSzy.push(data.resultData[ei].user_szy);
                  				if(data.resultData[ei].info_status=="异常"){
                  					$scope.ycNum+=1;
                  				}else{
                  					$scope.zcNum+=1;
                  				}
                  				$scope.sumSSY+=parseInt($scope.resSsy[ei]);
                  				if($scope.resSsy[ei] <= 90){
              						$scope.ssyLevel.push(1);
              					}else if($scope.resSsy[ei]   < 120){
              						$scope.ssyLevel.push(2);
              					}else if($scope.resSsy[ei]   < 130){
              						$scope.ssyLevel.push(3);
              					}else if($scope.resSsy[ei]   < 140){
              						$scope.ssyLevel.push(4);
              					}else if($scope.resSsy[ei]   < 150){
              						$scope.ssyLevel.push(5);
              					}else if($scope.resSsy[ei]   < 160){
              						$scope.ssyLevel.push(6);
              					}else if($scope.resSsy[ei]  < 180){
              						$scope.ssyLevel.push(7);
              					}else if($scope.resSsy[ei]   >= 180){
              						$scope.ssyLevel.push(8);
              					}
                  				$scope.sumSZY+=parseInt($scope.resSzy[ei]); 
                  				if($scope.resSzy[ei] <= 90){
              						$scope.szyLevel.push(1);
              					}else if($scope.resSzy[ei] < 120){
              						$scope.szyLevel.push(2);
              					}else if($scope.resSzy[ei] < 130){
              						$scope.szyLevel.push(3);
              					}else if($scope.resSzy[ei] < 140){
              						$scope.szyLevel.push(4);
              					}else if($scope.resSzy[ei] < 150){
              						$scope.szyLevel.push(5);
              					}else if($scope.resSzy[ei] < 160){
              						$scope.szyLevel.push(6);
              					}else if($scope.resSzy[ei] < 180){
              						$scope.szyLevel.push(7);
              					}else if($scope.resSzy[ei] >= 180){
              						$scope.szyLevel.push(8);
              					}
                  				$scope.sumXL+=parseInt(data.resultData[ei].user_xl);
                  				if($scope.szyLevel[ei]==$scope.ssyLevel[ei] || $scope.ssyLevel[ei]<$scope.szyLevel[ei]){
                  					$scope.resMinLevel.push($scope.ssyLevel[ei]);  //收缩压级别最小 所以存收缩压
                  					$scope.resMaxLevel.push($scope.szyLevel[ei]);	//舒张压级别高 所以存舒张压
                  				}else{
                  					$scope.resMinLevel.push($scope.szyLevel[ei]);
                  					$scope.resMaxLevel.push($scope.ssyLevel[ei]);
                  				}
          	    				$scope.xl.push(data.resultData[ei].user_xl);
          	    				$scope.jcdate.push("");
          	    			}
                                var managerchartsoptions={
                                	    toolbox: {
                                	        show: false
                                	    },
                                
                                	    grid:{
                                	    	zlevel:-1,
                                	    	z:-1,
                                	    	x :'35',
                                	    	x2 :'15',
                                	    	y:'20',
                                	    	y2:'30'
                                	    	
                                	    },
                                	    xAxis:  {
                                	        type: 'category',
                                	        boundaryGap: true,
                                	        axisLine : {
                                	        	show:false
                                	        },
                                	        axisLabel : {
      										//interval:0, //间隔几个显示
                                  	    	textStyle:{
                                  	    		color:'#fff'
                                  	    	}
                                  	     },
                                  	     axisTick:{
                                  	    	show:false 
                                  	     },
                                  	    splitLine:{
                                  	    	show : false
                                  	    },
                                	        data: 	$scope.jcdate
                                	        
                                	    },
                                	    yAxis: {
                                	        type: 'value',
                                	        splitLine: {
                                	            lineStyle:{
                                	            	type : 'dashed',
                                	            	color : 'rgba(255, 255, 255, 0.32)'
                                	            }
                                	        },
                                	        axisLine : {
                              	        	show:false
                              	        },
                                	        axisLabel : {
                                	     	  textStyle:{
                                	    	 	 color:'#fff'
                                	    	  }
                                	        },
                                	        min:40,
                                	        max:160
                                	    },
                                	    series: [

                                	        {
                                	        	itemStyle:{
                                	        		normal:{
                                	        			color:function(e){
                                	        				if(e.data>$scope.dataDef[0] || e.data<$scope.dataDef[1]){
                                	        					return '#d8d80c';
                                	        				}else{
                                	        					return '#fff';
                                	        				}
                                	        			},
                                	        			lineStyle:{
                                	        				color:'#fff',
                                	        				width:1
                                	        			},
                                	        			label : {
                                	        				show : true,
                                	        				formatter : function(e){
                                	        					if(e.value>$scope.dataDef[0] || e.value<$scope.dataDef[1]){
                                	        						return e.value;
                                	        					}
                                	        				},
                                	        				textStyle : {
                                	        					color:'#fff',
                                	        					baseline:'top'
                                	        				}
                                	        			}
                                	        		}
                                	        	},
                                	            name:'收缩压',
                                	            type:'line',
                                	            data:$scope.ssy,
                                	            symbol : 'diamond'
                                	        },
                                	        {
                                	        	
                                	        	itemStyle:{
                                	        		normal:{
                                	        			color:function(e){
                                	        				if(e.data>$scope.dataDef[2] || e.data<$scope.dataDef[3]){
                                	        					return '#d8d80c';
                                	        				}else{
                                	        					return '#fff';
                                	        				}
                                	        			},
                                	        			lineStyle:{
                                	        				color:'#fff',
                                	        				width:1
                                	        			},
                                	        			label : {
                                	        				show : true,
                                	        				formatter : function(e){
                                	        					//console.log(e)
                                	        					if(e.value>$scope.dataDef[2] || e.value<$scope.dataDef[3]){
                                	        						return e.value;
                                	        					}
                                	        				},
                                	        				textStyle : {
                                	        					color:'#fff',
                                	        					baseline:'top'
                                	        				}
                                	        			}
                                	        		}
                                	        	},
                                	            name:'舒张压',
                                	            type:'line',
                                	            data:$scope.szy
                                	        }
                                	    ]
                                	};
                        		managerChartss.setOption(managerchartsoptions);
                        		managerChartss.setTheme('infographic');
                        		layer.closeAll('loading');
                        		$scope.getResLevel()
          	    		}else{
          	    			managerChartss.clear();
          	    			layer.closeAll('loading');
          	    			$scope.getResLevel()
          	    		}
    	         		
    	         	});
    	 }
    	 $scope.prevDate = function(){
    		 $scope.dateOffset+=1;
    		 switch($scope.dateType){
	 		 	case 'd' :
	 		 		 $scope.sDateRange=getNowDayDate(); //获取本天起始日期
	                 $scope.eDateRange=getNowDayDate(); //本天的结束日期
	                 $scope.dateSE = $scope.sDateRange
	                 break;
	 		 	case 'w' :
	 		 		 $scope.sDateRange=getWeekStartDate(); //获取本周起始日期
	                 $scope.eDateRange=getWeekEndDate(); //本周的结束日期
	                 $scope.dateSE = $scope.sDateRange+"至"+$scope.eDateRange
	                 break;
	 		 	case 'm' :
	 		 	    
	 		 		 $scope.sDateRange=getMonthStartDate(); //获取本月起始日期
	                 $scope.eDateRange=getMonthEndDate(); //本月的结束日期
	                 $scope.dateSE = $scope.sDateRange.split('-')[0]+"年"+$scope.sDateRange.split('-')[1].split('-')[0]+'月'
	                 break;
	 		 	case 'y' :
	 		 		
	 		 		 $scope.sDateRange=getYearStartDate(); //获取本年起始日期
	                 $scope.eDateRange=getYearEndDate(); //本年的结束日期
	                 $scope.dateSE = $scope.sDateRange.split('-')[0]+'年'
	                 break;
	 		 }
    		 $scope.getCharts();
    	 }
    	 $scope.nextDate = function(){
    		 $scope.dateOffset-=1;
    		 switch($scope.dateType){
	 		 	case 'd' :
	 		 		 $scope.sDateRange=getNowDayDate(); //获取本天起始日期
	                 $scope.eDateRange=getNowDayDate(); //本天的结束日期
	                 $scope.dateSE = $scope.sDateRange
	                 break;
	 		 	case 'w' :
	 		 		 $scope.sDateRange=getWeekStartDate(); //获取本周起始日期
	                 $scope.eDateRange=getWeekEndDate(); //本周的结束日期
	                 $scope.dateSE = $scope.sDateRange+"至"+$scope.eDateRange
	                 break;
	 		 	case 'm' :
	 		 	    
	 		 		 $scope.sDateRange=getMonthStartDate(); //获取本月起始日期
	                 $scope.eDateRange=getMonthEndDate(); //本月的结束日期
	                 $scope.dateSE = $scope.sDateRange.split('-')[0]+"年"+$scope.sDateRange.split('-')[1].split('-')[0]+'月'
	                 break;
	 		 	case 'y' :
	 		 		
	 		 		 $scope.sDateRange=getYearStartDate(); //获取本年起始日期
	                 $scope.eDateRange=getYearEndDate(); //本年的结束日期
	                 $scope.dateSE = $scope.sDateRange.split('-')[0]+'年'
	                 break;
	 		 }
    		 $scope.getCharts();
    	 }
    	 $scope.dateStyle = function(e){
         	$scope.dateClassD='';
         	$scope.dateClassW='';
         	$scope.dateClassM='';
         	$scope.dateClassY='';
         	$scope.dateOffset=0;
         	$scope.dateType=e;
            $scope.dd="";
            $scope.ww="";
            $scope.mm="";
            $scope.yy="";
         	switch(e){
         		case 'd':
         			$scope.dateSE='本天';
         			$scope.sDateRange=getNowDayDate(); //获取本天起始日期
                    $scope.eDateRange=getNowDayDate(); //本天的结束日期
         			$scope.dateClassD='wmanagerqushidateSE';
         		    $scope.dd="trend-current";
         			break;
         		case 'w':
         			$scope.dateSE='本周';
         			$scope.sDateRange=getWeekStartDate(); //获取本周起始日期
                    $scope.eDateRange=getWeekEndDate(); //本周的结束日期
         			$scope.dateClassW='wmanagerqushidateSE';
         		    $scope.ww="trend-current";
         			break;
         		case 'm':
         			$scope.dateSE='本月';
         			$scope.sDateRange=getMonthStartDate(); //获取本月起始日期
                    $scope.eDateRange=getMonthEndDate(); //本月的结束日期
         			$scope.dateClassM='wmanagerqushidateSE';
         		    $scope.mm="trend-current";
         			break;
         		case 'y':
         			$scope.dateSE='本年';
         			$scope.sDateRange=getYearStartDate(); //获取本年起始日期
                    $scope.eDateRange=getYearEndDate(); //本年的结束日期
         			$scope.dateClassY='wmanagerqushidateSE';
         		    $scope.yy="trend-current";
         			break;
         	}
         	 $scope.getCharts();
         };
    }])
    
    
    ;