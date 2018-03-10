var NowDate = new Date();

$(function(){
	
	DefaultPage.init();

});

DefaultPage = {
    YBcates: ["雷电", "雷雨", "大风", "台风"],// "高温", "台风", "灰霾", "大雾", "火险",
	YBtimes: [],
	OZcates: ["大风", "温度"],
	OZtimes: [],
	OZarea: "南山区,福田区,罗湖区,盐田区,新安,西乡,福永,石岩,大浪,龙华,民治,沙井,松岗,光明,公明,观湖,福城,观澜,葵涌,大鹏,南澳,龙岗,坑梓,坪地,龙城,坪山,横岗,南湾,平湖,坂田,布吉",
	PondsPicURL: "http://10.155.95.202:8080/data/",
	HailPicURL: "http://10.155.95.202:8080/data/",
	LFSPicURL: "http://10.155.95.202:8080/data/",
	OpticalFlowDataUrsURL: "http://10.155.95.202:8080/data/",
	YBXXchoose : '0',		//预报信息选择项
	YBtempGridDate: [], 	//储存临近预报当前时次的 预警分区提示信息
	init:function(){
		//时间
	 	$('#datetime1').datetimepicker({ minView:'month', format: 'yyyy-mm-dd', language:'zh-CN',todayBtn: 1,autoclose: 1,});
	 	$('#datetime2').datetimepicker({ startView:1, format: 'hh:ii',language:'zh-CN', autoclose: 1,todayBtn: 1, minuteStep:6});
        $('.datetimepicker-hours th.switch').css('visibility', 'hidden')
        $('#datetime11').datetimepicker({ minView: 'month', format: 'yyyy-mm-dd', pickerPosition: 'top-right', language: 'zh-CN', todayBtn: 1, autoclose: 1, });
	 	// $('#datetime12').datetimepicker({ startView:1, format: 'hh:ii',pickerPosition:'top-right',language:'zh-CN', autoclose: 1,todayBtn: 1, minuteStep:120});
	 	this.getNewTimes('yb');
	 	this.getNewTimes('oz');

	 	this.buttonListener();

		this.gridInit();
		$('.splitline').css('left', $(".gridTable div[v='0/22']").position().left);	 //设置线条的位置
		$(".gridTable div[v*='/32']").css('border-color', 'rgb(122,136,171)');

		MakeMapStyle();		//初始化leaflet地图

		this.ShowLjybGrid();
		this.ShowOzzxGrid();
	},
	gridInit:function(){		//初始化表格
		var ljdatetime = $('#datetime1').val() + ' ' + $('#datetime2').val();
		this.setYBDate(ljdatetime.toDate());

		var YBgridHtml = "",YBcateHtml='';	//临近预报
		for(var i=0; i<this.YBcates.length; i++){
			YBgridHtml += "<tr>";
			for(var j=0; j<46; j++){
				//YBgridHtml += "<td><div v='"+ (i+'/'+j) +"' onclick='alert($(this).attr(\"v\"))'>"+"</div></td>";
				YBgridHtml += "<td><div v='"+ (i+'/'+j) +"'>"+"</div></td>";
			}
			YBgridHtml += "</tr>";

			YBcateHtml += "<div>"+ this.YBcates[i] +"</div>";
		}
		$('.GridContain #cate1').html(YBcateHtml);
		$("#YBgrid").html(YBgridHtml);

		//欧洲中心
		var oztime = new Date(2016,11,05,23,00);
		for(var i=0; i<40; i+=2){ this.OZtimes.push(new Date(oztime.getTime())); oztime.addHours(3); }
		var OZtimeHtml = "";
		for(var i=0; i<this.OZtimes.length; i++){ OZtimeHtml +="<span>"+ this.OZtimes[i].format("dd日hh时") +"</span>";}
		$('.GridContain #time2').html(OZtimeHtml);

		var OZgridHtml = '', OZcateHtml='';
		for(var i=0; i<2; i++){
			OZgridHtml += "<tr>";
			for(var j=0; j<40; j++){
				OZgridHtml += "<td><div ov='"+ (i+'/'+j) +"'>"+"</div></td>";
			}
			OZgridHtml += "</tr>";
			OZcateHtml += "<div>"+ this.OZcates[i] +"</div>";
		}
		$('.GridContain #cate2').html(OZcateHtml);
		$("#OZgrid").html(OZgridHtml);

		//获取当前预警信号
		var res = WebMethod.getData("GetNewWarning", {}, "../WebService.asmx");
		if (res!=null && res.warnentList.length>0) {
		    var temp = res.warnentList[0].W_LEVEL.split("#");
		    var level = temp[0];  //预警等级
		    var type = temp[1];   //预警类型
		    var pic;

            //添加预警图标
		    if(type=="台风"){
		        if(level=="白色"){
		            pic = "1";
		        } else if (level == "蓝色") {
		            pic = "2";
		        } else if (level == "黄色") {
		            pic = "3";
		        } else if (level == "橙色") {
		            pic = "4";
		        } else if (level == "红色") {
		            pic = "5";
		        }
		    } else if (type == "暴雨") {
		        if (level == "黄色") {
		            pic = "6";
		        } else if (level == "橙色") {
		            pic = "7";
		        } else if (level == "红色") {
		            pic = "8";
		        }
		    } else if (type == "高温") {
		        if (level == "黄色") {
		            pic = "9";
		        } else if (level == "橙色") {
		            pic = "10";
		        } else if (level == "红色") {
		            pic = "11";
		        }
		    } else if (type == "寒冷") {
		        if (level == "黄色") {
		            pic = "12";
		        } else if (level == "橙色") {
		            pic = "13";
		        } else if (level == "红色") {
		            pic = "14";
		        }
		    } else if (type == "大风") {
		        if (level == "蓝色") {
		            pic = "15";
		        } else if (level == "黄色") {
		            pic = "16";
		        } else if (level == "橙色") {
		            pic = "17";
		        } else if (level == "红色") {
		            pic = "18";
		        }
		    } else if (type == "大雾") {
		        if (level == "黄色") {
		            pic = "19";
		        } else if (level == "橙色") {
		            pic = "20";
		        } else if (level == "红色") {
		            pic = "21";
		        }
		    } else if (type == "冰雹") {
		        if (level == "黄色") {
		            pic = "22";
		        }
		    } else if (type == "雷电") {
		        if (level == "黄色") {
		            pic = "23";
		        }
		    } else if (type == "干旱") {
		        if (level == "黄色") {
		            pic = "24";
		        }
		    } else if (type == "灰霾") {
		        if (level == "黄色") {
		            pic = "25";
		        } else if (level == "橙色") {
		            pic = "30";
		        } else if (level == "红色") {
		            pic = "31";
		        }
		    } else if (type == "火险") {
		        if (level == "黄色") {
		            pic = "26";
		        }
		    }
		    
		    $('#warnIcon').append("<img src='../../Images/PageImage/images/LWSPIC1505/" + pic + ".png' alt='天气图标' style='width:66px;height:60px;margin:0'/>");
		    $('#warnfbcontent').append("<span style='color:#000'>" + res.warnentList[0].W_CONTENT + "</span>");
		    
		    //res.warnentList.forEach(function(x){
			//    //console.log(x);
			//    $('#warnfbcontent').append("<p style='text-indent:2em'>"+x.W_CONTENT+"</p>"); 
			//    $('#warnfb').append("<img src='images/" + x.W_ICONNAME + "' alt='天气图标' />");
			//});
			//var rl = res.warnentList;
			//$('#warnfbtime').html(rl[rl.length-1].Time.getDateFromJSON().format('yyyy-MM-dd HH:mm'))
			//$('#warnfbarea').html(rl[rl.length-1].Area);

			//$('#warnfbcontent').html(res.strinfo);
		}else{
			$('.newWarning').html("<div style='text-align:center;margin-top:28%; font-size:20px;'>当前没有预警信号</div>");
        }
        
        //取台风预发布信息
		res = WebMethod.getData("GetWindWarming", {}, "../WebService.asmx");
        if (res && res != null && res != "") {
            $(".windWarning div").text(res);
        } else {
            $("#sub_windwarn").css("visibility", "hidden");
            $("#sub_nowwarn").removeClass("hover");
        }

	},
	ShowLjybGrid: function(){	//更新查询临近预报数据
		var ljdatetime = $('#datetime1').val() + ' ' + $('#datetime2').val();
		this.setYBDate(ljdatetime.toDate());
		this.resetYBGrid();
		this.YBtempGridDate = [];

        //预报前推两小时
		var res = WebMethod.getData("showLWS", { dt: ljdatetime }, "../WebService.asmx");
	    //========================
	    //冯 2017-2-23 15:13:01
        //========================
		$("#release_btn").hide();
		var ishave_warning = false;
        //========================
		if (res!=null) {
		    //console.log(res);

		    function data_string(str) {
		        var d = eval('new ' + str.substr(1, str.length - 2));
		        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
		        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
		        return ar_date.slice(0, 3).join('/') + ' ' + ar_date.slice(3).join(':');

		        function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
		    }

		    for(var i=0;i<res.length;i++){
		        //console.log(res[i].DDATETIME);
		        var timer = res[i].DDATETIME;
                //信号
				var idx_jsonSignalObj = warningSignal_json.filter(function(_sn) {
				    return _sn.SignalName;
				});
                //时间格点列
				var idx_col = DefaultPage.YBtimes.findIndex(function (_t) {
				    if (_t.format('hhmm') == new Date(data_string(timer)).format('hhmm')) { return 1; }
				});
		        //时间格点行
				var idx_row = DefaultPage.YBcates.findIndex(function (_c) {  
				    if (res[i].W_TYPE.length > 2) {
				        if (_c == res[i].W_TYPE.substring(0, 2)) {
				            return 1;
				        }
				    } else if (_c == res[i].W_TYPE) {
				        return 1;
				    }
				});
				if (idx_col > -1 && idx_row > -1) {
 					var idx = idx_row + '/' + idx_col;
 					var gridobj = $("#YBgrid td > div[v='"+ idx +"']");
 					gridobj.css('background-color', idx_jsonSignalObj[0].color);
 					gridobj.attr('title', res[i].TripContent);
 					gridobj.on('click', function(){
 						DefaultPage.resetImgePic(3);
 						$('#pictxt12').text('【'+ idx_jsonSignalObj[0].SignalName.substr(0,2) +'】').css('display', 'block');;
 						$('#pictxt12').css("z-index", "1000");
 						//$('#pictxt13').text(res[i].TripContent).css('display', 'block');
 						
 						$('#makeMap1').css("z-index", "0");
 					
 						var sessionStorage_release = new Array();
 						ishave_warning = true;
 						var SIGNAL = idx_jsonSignalObj[0].SignalName.substring(0, 2);
 						var SIGNALLEVEL = "";
 						if (idx_jsonSignalObj[0].SignalName.length == 4) {
 						    SIGNALLEVEL = idx_jsonSignalObj[0].SignalName.substring(2, 4);
 						}
 						var Area = "";
 						x.Region.split(',').forEach(function (_area) {
 						    FillSignalMap(LaterGroup1, _area, idx_jsonSignalObj[0].SignalName, 1, 0.5);
 						    Area = _area;
 						    if (Area.indexOf("街道") > -1) {
 						        Area = Area.substring(0, Area.indexOf("街道"));
 						    }
 						    var hoveflag = false;
 						    sessionStorage_release.forEach(function (x3) {
 						        if (x3.SIGNAL == SIGNAL && x3.Area == Area) {
 						            if (x3.imgNum < idx_jsonSignalObj[0].imgNum) {
 						                x3.SIGNALLEVEL = SIGNALLEVEL;
 						                x3.imgNum = idx_jsonSignalObj[0].imgNum;
 						                hoveflag = true;
 						            }
 						        }
 						    });
 						    if (!hoveflag) {
 						        sessionStorage_release.push({ SIGNAL: SIGNAL, SIGNALLEVEL: SIGNALLEVEL, Area: Area, imgNum: idx_jsonSignalObj[0].imgNum });
 						    }
 						});
 						if (ishave_warning) {
 						    $("#release_btn").show();
 						}
 						if (window.localStorage) {
 						    sessionStorage.setItem("release", JSON.stringify(sessionStorage_release));
 						}
 						$("#release_btn").click(function () {
 						    window.location.href = "./OperationCatalog.aspx?op=isrelease";
 						});
                        //========================
 					});

				    //存在预警分区提示，添加
 					if (idx_col == 21) {
 					    DefaultPage.YBtempGridDate.push(res[i]);
 					}
				}
			}


		}

        //预报后推两小时
		var res = WebMethod.getData("showForecastTrips", { dt: ljdatetime }, "../WebService.asmx");
		if (res!=null) {
			//console.log(res);
		    for(var i=0;i<res.length;i++){
		        var timer = res[i].DDATETIME;
				var idx_jsonSignalObj = warningSignal_json.filter(function(_sn) {
				    return _sn.SignalName;
				});
		        //时间格点列
				var idx_col = DefaultPage.YBtimes.findIndex(function (_t) {
				    if (_t.format('hhmm') == new Date(data_string(timer)).format('hhmm')) { return 1; }
				});
		        //时间格点行
				var idx_row = DefaultPage.YBcates.findIndex(function(_c){
				    if(res[i].W_TYPE.length > 2){
				        if (_c == res[i].W_TYPE.substring(0, 2)) {
				            return 1;
				        }
				    } else if (_c == res[i].W_TYPE) {
				        return 1;
				    } 
				});
				if (idx_col > -1 && idx_row > -1) {
 					var idx = idx_row + '/' + idx_col;
 					var gridobj = $("#YBgrid td > div[v='"+ idx +"']");
 					gridobj.css('background-color', idx_jsonSignalObj[0].color);
 					gridobj.attr('title', res[i].TripContent);
 					gridobj.on('click', function(){
 						DefaultPage.resetImgePic(3);
 						$('#pictxt12').text('【'+ idx_jsonSignalObj[0].SignalName.substr(0,2) +'】').css('display', 'block');;
 						$('#pictxt12').css("z-index", "1000");
 						//$('#pictxt13').text(x.TripContent).css('display', 'block');

 					    //========================
 					    //冯 2017-2-23 15:13:01
 					    //========================
 						var sessionStorage_release = new Array();
 						ishave_warning = true;
 						var SIGNAL = idx_jsonSignalObj[0].SignalName.substring(0, 2);
 						var SIGNALLEVEL = "";
 						if (idx_jsonSignalObj[0].SignalName.length == 4) {
 						    SIGNALLEVEL = idx_jsonSignalObj[0].SignalName.substring(2, 4);
 						}
 						var Area = "";
 						x.Region.split(',').forEach(function(_area){
 						    FillSignalMap(LaterGroup1, _area, idx_jsonSignalObj[0].SignalName, 1, 0.5);
 						    Area = _area;
 						    if (Area.indexOf("街道") > -1) {
 						        Area = Area.substring(0, Area.indexOf("街道"));
 						    }
 						    var hoveflag = false;
 						    sessionStorage_release.forEach(function (x3) {
 						        if (x3.SIGNAL == SIGNAL && x3.Area == Area) {
 						            if (x3.imgNum < idx_jsonSignalObj[0].imgNum) {
 						                x3.SIGNALLEVEL = SIGNALLEVEL;
 						                x3.imgNum = idx_jsonSignalObj[0].imgNum;
 						                hoveflag = true;
 						            }
 						        }
 						    });
 						    if (!hoveflag) {
 						        sessionStorage_release.push({ SIGNAL: SIGNAL, SIGNALLEVEL: SIGNALLEVEL, Area: Area, imgNum: idx_jsonSignalObj[0].imgNum });
 						    }
 						});
 						if (ishave_warning) {
 						    $("#release_btn").show();
 						}
 						if (window.localStorage) {
 						    sessionStorage.setItem("release", JSON.stringify(sessionStorage_release));
 						}
 						$("#release_btn").click(function () {
 						    window.location.href = "./OperationCatalog.aspx?op=isrelease";
 						});
 					    //========================
 					});
				}
			}
		}
	},
	setYBDate:function(YBtime){	//设置临近预报日期
		var time1, time2;
		this.YBtimes = [];
		var min = YBtime.getMinutes() % 5;
		if(min!=0) { min=YBtime.getMinutes()-min + 5; }else { min=YBtime.getMinutes() }
		time1 = new Date(YBtime.getFullYear(), YBtime.getMonth(), YBtime.getDate(), YBtime.getHours(), min-105);
		time2 = new Date(YBtime.getFullYear(), YBtime.getMonth(), YBtime.getDate(), YBtime.getHours(), YBtime.getMinutes()+6)
		for(var i=0; i<22; i++){this.YBtimes.push(new Date(time1.getTime()));time1.addMinutes(5);}
		for(var i=0; i<24; i++){this.YBtimes.push(new Date(time2.getTime()));time2.addMinutes(6);}
		//设置预报时间头部
		var YBtimeHtml = "";
		$('.GridContain #time1').html('');
		for(var i=0; i<this.YBtimes.length; i+=2){ YBtimeHtml += "<span>"+ this.YBtimes[i].format('hh:mm') +"</span>"; }
		$('.GridContain #time1').html(YBtimeHtml);
	},
	resetYBGrid:function(){		//重置预报格点
		$('#YBgrid td > div').unbind( "click" );
		$('#YBgrid td > div').css('background-color', 'rgb(211,220,227)');
	},
	ShowOzzxGrid: function(){	//欧洲中心数据
		var ozdatetime = $('#datetime11').val() + ' ' + $('#datetime12').text();
		this.setOZDate(ozdatetime.toDate());
		this.resetOZGrid();

		var res = WebMethod.getData("showEcmwf", { dt: ozdatetime }, "../WebService.asmx");
		if (res!=null) {
			//console.log(res);
			res.forEach(function(x){
			    var idx_col = DefaultPage.OZtimes.findIndex(function (_t) {
                    //判断取出的预报数据与预报时次数据
					if(_t.format('ddhh') == x.ForecastTime.getDateFromJSON().format('ddhh')){return 1;} 
				});
				if (idx_col > -1) {
					var windobj =  $("#OZgrid td > div[ov='0/"+ idx_col +"']");
					var tempobj =  $("#OZgrid td > div[ov='1/"+ idx_col +"']");
					windobj.text(Math.round(x.Wind));
					if (x.Wind > 10.8) {
					    windobj.css('background-color', 'blue');
						windobj.on('click', function(){
							DefaultPage.resetImgePic(3);
	 						$('#pictxt12').text('【大风】').css('display', 'block');;
	 						$('#pictxt13').text("全市预计"+ DefaultPage.OZtimes[idx_col].format("dd日hh时") +"半小时滑动风速将大于6级,建议发布全市大风蓝色预警信号").css('display', 'block');
	 						$('#pictxt13').css("z-index", "100");
	 						$('#pictxt12').css("z-index", "100");
						    // DefaultPage.OZarea.split(',').forEach(function(_area){
	 						// 	FillSignalMap(LaterGroup1, '全市陆地', "大风蓝色", 1, 0.5);
	 						// });

	 						FillSignalMap(LaterGroup1, '全市陆地', "大风蓝色", 1, 0.5);
	 						
						});
						
 						
					}
					tempobj.text(Math.round(x.Temp));
					if (x.Temp > 33) {
					    tempobj.css('background-color', 'yellow');
						tempobj.on('click', function(){
							DefaultPage.resetImgePic(3);
	 						$('#pictxt12').text('【温度】').css('display', 'block');;
	 						$('#pictxt13').text('全市气温预计'+ DefaultPage.OZtimes[idx_col].format("dd日hh时") +'将达到'+x.Temp+'摄氏度，建议全市发布高温黄色预警信号.').css('display', 'block');
	 						$('#pictxt13').css("z-index", "100");
	 						$('#pictxt12').css("z-index", "100");

	 						FillSignalMap(LaterGroup1, '全市陆地', "大风黄色", 1, 0.5);
	 						
						});
						
					}
				}

			});
		}
	},
	setOZDate: function(_oztime){
		var time;
		this.OZtimes = [];
		_oztime.addHours(3); //从当前预报时间后推3小时开始才有预报数据
		for(var i=0; i<41; i++){ 
			this.OZtimes.push(new Date(_oztime.getTime()));
			if (i<16) {
				 _oztime.addHours(3); 
			}else{
				_oztime.addHours(6);
			}
		}
		var OZtimeHtml = "";
		for(var i=0; i<this.OZtimes.length; i+=2){ OZtimeHtml +="<span>"+ this.OZtimes[i].format("dd日hh时") +"</span>";}
		$('.GridContain #time2').html(OZtimeHtml);
	},
	resetOZGrid: function(){
		$('#OZgrid td > div').unbind( "click" );
		$('#OZgrid td > div').css('background-color', 'rgb(211,220,227)');
		$('#OZgrid td > div').text('');
	},
	ShwoimagePic: function(){	//展示预报信息图片
		var picURL ="";
		var time = ($('#datetime1').val() + ' ' + $('#datetime2').val()).toDate();
		var yyyyMMdd = time.format("yyyyMMdd");
		var yyyyMMddHHmmss = time.format("yyyy年MM月dd日hh时mm分ss秒");
		var newyyyyMMddHHmmss = time.format("yyyyMMddhhmm");
		var yyyyMMddHHmmssYY = time.format("yyyy") + "YY" + time.format("MM") + "MM" + time.format("dd") + "DD" + time.format("hh") + "hh" + time.format("mm") + "MM" + time.format("ss") + "ss";
		LaterGroup1.clearLayers();
		LaterGroup2.clearLayers();
		LaterGroup3.clearLayers();
		leftletmap1.map.removeLayer(leftletImagePic1);
		leftletmap2.map.removeLayer(leftletImagePic2);
		leftletmap3.map.removeLayer(leftletImagePic3);
		$(".pictureMain > div:not(:last-child) > div:not(:last-child)").css('display', 'none');
		$('#pictxt11').text('最新实况').css('display', 'block');
    	$('#pictxt21').text('1小时预报').css('display', 'block');
		$('#pictxt31').text('2小时预报').css('display', 'block');
		var pos = [[(22.5419 - 350.0 * 0.01), (114.005 - 550.0 * 0.01)], [(22.5419 + 350.0 * 0.01), (114.005 + 350.0 * 0.01)]];
    	if (this.YBXXchoose == '0') { //雷暴实况
    	    pos = [[15.5, 104], [22.5, 113]];
    	    picURL = this.PondsPicURL + "newCAPPI/" + yyyyMMdd + "/" + "ref_Meta_" + newyyyyMMddHHmmss + ".png";
    		leftletImagePic1 = L.imageOverlay(picURL, pos).addTo(leftletmap1.map);
    		picURL = this.OpticalFlowDataUrsURL + "newTREC/" + yyyyMMdd + "/" + "Meta_TREC_GD_2500_" + newyyyyMMddHHmmss + "_60m.png";
    		leftletImagePic2 = L.imageOverlay(picURL, pos).addTo(leftletmap2.map);
    		picURL = this.OpticalFlowDataUrsURL + "newTREC/" + yyyyMMdd + "/" + "Meta_TREC_GD_2500_" + newyyyyMMddHHmmss + "_120m.png";
    		leftletImagePic3 = L.imageOverlay(picURL, pos).addTo(leftletmap3.map);

    	}else if(this.YBXXchoose == '1'){ //降雨预报
    	    pos = [[15.5, 104], [22.5, 113]];
    		
    	    picURL = this.LFSPicURL + "TracerLFS/SZAWSRain/" + yyyyMMdd + "/LFS_META_SZAWSRain_" + yyyyMMddHHmmss + "_60分钟.png";
    		leftletImagePic1 = L.imageOverlay(picURL, pos).addTo(leftletmap1.map);

    		pos = [[19.0419, 108.505], [26.0419, 117.505]]
    		picURL = this.HailPicURL + "newdb_files/" + yyyyMMdd + "/Meta_QPFQPF" + yyyyMMddHHmmssYY + "_60_60_2500.png";
    		leftletImagePic2 = L.imageOverlay(picURL, pos).addTo(leftletmap2.map);
    		picURL = this.HailPicURL + "newdb_files/" + yyyyMMdd + "/Meta_QPFQPF" + yyyyMMddHHmmssYY + "_120_60_2500.png";
    		leftletImagePic3 = L.imageOverlay(picURL, pos).addTo(leftletmap3.map);

    	}else if (this.YBXXchoose == '2') {	//冰雹提示
    		yyyyMMddHHmmss = time.format("yyyyMMddhhmm");

    		picURL = this.HailPicURL + "Thunder/" + yyyyMMdd + "/" + "hail_meta_" + yyyyMMddHHmmss + ".png";
    		leftletImagePic1 = L.imageOverlay(picURL, pos).addTo(leftletmap1.map);
    		picURL = this.HailPicURL + "HailTREC/" + yyyyMMdd + "/" + "Meta_TREC_GD_2500_" + yyyyMMddHHmmss + "_30_0_m.png";
    		leftletImagePic2 = L.imageOverlay(picURL, pos).addTo(leftletmap2.map);
    		picURL = this.HailPicURL + "HailTREC/" + yyyyMMdd + "/" + "Meta_TREC_GD_2500_" + yyyyMMddHHmmss + "_60_0_m.png";
    		leftletImagePic3 = L.imageOverlay(picURL, pos).addTo(leftletmap3.map);

    		$('#pictxt21').text('30分钟预报');
    		$('#pictxt31').text('1小时预报');
    		$('#pictxt21').css('display','block');
    	    $('#pictxt31').css('display','block');
    		
    	}else if (this.YBXXchoose == '3') {	//预警分区提示

    		for(var i=0; i<this.YBtempGridDate.length; i++){
				if (i>=3) break;
				var idx_obj = warningSignal_json.filter(function(_sn) {
				    return _sn.SignalName == DefaultPage.YBtempGridDate[i].W_TYPE + DefaultPage.YBtempGridDate[i].W_LEVEL;
				});
				$('#pictxt'+(i+1)+'2').text('【'+ idx_obj[0].SignalName.substr(0,2) +'】').css('display', 'block');;
 				$('#pictxt'+(i+1)+'3').text(this.YBtempGridDate[i].TripContent).css('display', 'block');
				var lg = i==0? LaterGroup1: i==1? LaterGroup2: LaterGroup3;
				this.YBtempGridDate[i].Region.split(',').forEach(function(_area){
					FillSignalMap(lg, _area, idx_obj[0].SignalName, 1, 0.5);
				});
			}

    		$('#pictxt11').css('display', 'none');
    		$('#pictxt21').css('display', 'none');
			$('#pictxt31').css('display', 'none');
    	}
	},
	showLeafletAreas: function(_area){	//预报信息切换地区
		if (_area == 'hk') {
		    $('.submenu1 .area a:first-child').addClass("active");
		    $('.submenu1 .area a:last-child').removeClass("active");

			_zoomendMovemap1 = 9;
			leftletmap1.map.setZoom(9);
			_zoomendMovemap2 = 9;
			leftletmap2.map.setZoom(9);
			_zoomendMovemap3 = 9;
			leftletmap3.map.setZoom(9);

		} else if (_area == 'hn') {
		    $('.submenu1 .area a:last-child').addClass("active");
		    $('.submenu1 .area a:first-child').removeClass("active");

			_zoomendMovemap1 = 6;
			leftletmap1.map.setZoom(6);
			_zoomendMovemap2 = 6;
			leftletmap2.map.setZoom(6);
			_zoomendMovemap3 = 6;
			leftletmap3.map.setZoom(6);
		}
	},
	resetImgePic: function(_choose){	//重置预报信息图片区域
		LaterGroup1.clearLayers();
		leftletmap1.map.removeLayer(leftletImagePic1);
		leftletmap2.map.removeLayer(leftletImagePic2);
		leftletmap3.map.removeLayer(leftletImagePic3);
		this.YBXXchoose = _choose;
		$(".submenu1 span").removeClass('hover');
		$(".submenu1 span[v='"+_choose+"']").addClass('hover');
		$('#pictxt11, #pictxt21, #pictxt31, #pictxt12, #pictxt13').text('');
	},
	buttonListener:function(){
		$(".submenu1 span[v]").on('click', function(){
			$('.submenu1 span').removeClass('hover');
			$(this).addClass('hover');
			DefaultPage.YBXXchoose = $(this).attr('v');
			DefaultPage.ShwoimagePic();
			$('#pictxt11, #pictxt21, #pictxt31, #pictxt12, #pictxt13').text('');
		});

		$('#up1').on('click', function(){
			$(this).parent().find('div').removeClass('hover');
			$(this).addClass('hover');
			DefaultPage.ShowLjybGrid();
			DefaultPage.ShwoimagePic();
		});
		$('#up2').on('click', function(){
			$(this).parent().find('div').removeClass('hover');
			$(this).addClass('hover');

			DefaultPage.ShowOzzxGrid();
		});
		$('#new1').on('click', function(){	//临近预报最新时间
			DefaultPage.getNewTimes('yb');
			
			DefaultPage.ShowLjybGrid();
			DefaultPage.ShwoimagePic();

			$(this).parent().find('div').removeClass('hover');
			$(this).addClass('hover');
		});
		$('#new2').on('click', function(){	//欧洲中心最新时间
			DefaultPage.getNewTimes('oz');

		 	DefaultPage.ShowOzzxGrid();

			$(this).parent().find('div').removeClass('hover');
			$(this).addClass('hover');
		});
		$('#ys').on('click', function() {
			$(this).parent().find('div').removeClass('hover');
			$('#up1').addClass('hover');
			$('#datetime1').val('2011-09-13');
			$('#datetime2').val('17:00');
			$('#up1').click();
		});

		$("#pre1").on('click', function() {
			var time = ($('#datetime1').val() + ' ' + $('#datetime2').val()).toDate();
			time.addMinutes(-6);
			$('#datetime1').val(time.format('yyyy-MM-dd'));
			$('#datetime2').val(time.format('hh:mm'));
			$('#up1').click();
		});
		$("#next1").on('click', function() {
			var time = ($('#datetime1').val() + ' ' + $('#datetime2').val()).toDate();
			time.addMinutes(6);
			$('#datetime1').val(time.format('yyyy-MM-dd'));
			$('#datetime2').val(time.format('hh:mm'));
			$('#up1').click();
		});
		$("#pre2").on('click', function() {
			var time = ($('#datetime11').val() + ' ' + $('#datetime12').text()).toDate();
			time.addMinutes(-720);
			$('#datetime11').val(time.format('yyyy-MM-dd'));
			$('#datetime12').text(time.format('hh:mm'));
			$('#up2').click();
		});
		$("#next2").on('click', function() {
			var time = ($('#datetime11').val() + ' ' + $('#datetime12').text()).toDate();
			time.addMinutes(720);
			$('#datetime11').val(time.format('yyyy-MM-dd'));
			$('#datetime12').text(time.format('hh:mm'));
			$('#up2').click();
		});
		$("#datetime12").parent().find('.dropdown-menu li').on('click', function(){
		    $("#datetime12").text($(this).find('a').text());
		    $(".dropDownMenu_hour").slideToggle("slow");
        });

        $("#sub_windwarn").on("click", function () {
            $("#sub_nowwarn").removeClass("hover");
            $(this).addClass("hover");
            $(".newWarning").hide();
            $(".windWarning").show();
        });
        $("#sub_nowwarn").on("click", function () {
            $("#sub_windwarn").removeClass("hover");
            $(this).addClass("hover");
            $(".newWarning").show();
            $(".windWarning").hide();
        });
	},
	getNewTimes:function(_timename){	//获取最新时间
		if (_timename=='yb') {
		    var res = WebMethod.getData("GetLjybTime", {}, "../WebService.asmx");
		 	if (res!=null) {
		 		var new_ybtime = res.getDateFromJSON();
		 		$('#datetime1').val(new_ybtime.format('yyyy-MM-dd'));
		 		$('#datetime2').val(new_ybtime.format('hh:mm'));
		 	}else{
		 		var nowdate = new Date();
				$('#datetime1').val(nowdate.format('yyyy-MM-dd'));
				$('#datetime2').val(nowdate.format('hh')+':'+ (nowdate.format('mm') - nowdate.format('mm') % 6 ));
		 	}
		}else if (_timename=='oz') {
		    var res = WebMethod.getData("GetEctime", {}, "../WebService.asmx");
		 	if (res!=null) {
		 		var new_ybtime = res.getDateFromJSON();
		 		$('#datetime11').val(new_ybtime.format('yyyy-MM-dd'));
		 		$('#datetime12').text( new_ybtime.format('hh:mm'));
		 	}else{
		 		var nowdate = new Date();
				$('#datetime11').val(nowdate.format('yyyy-MM-dd'));
		 	}
		}
	}
}

var LaterGroup1, LaterGroup2, LaterGroup3;
var leftletmap1, leftletmap2, leftletmap3;
var latergroupBack1, latergroupBack2, latergroupBack3;
var leftletImagePic1, leftletImagePic2, leftletImagePic3;
var _freePolygonTime;
var extentGD = [[20.224197, 109.664430], [25.524197, 117.21443]];
var unDoNotEffectiveStreet = [];
var unCancelDoEffectiveStreet = [];
var _zoomendMovemap1 = 0,_zoomendMovemap2 = 0, _zoomendMovemap3 = 0;
function MakeMapStyle(_mapid) {
    ClearEdge_jsonSignal();
    var w = $("#contentSecond").width();
    var h = $("#contentSecond").height();
    $("#makeMap1").width(w);
    $("#makeMap1").height(h);
    $("#makeMap2").width(w);
    $("#makeMap2").height(h);
    $("#makeMap3").width(w);
    $("#makeMap3").height(h);
    require(["../Script/PageScript/loadMap"], function (loadMap) {
		if (typeof leftletmap1 == "undefined") {
            leftletmap1 = new loadMap("makeMap1", 9.3, 199);
            LaterGroup1 = L.featureGroup().addTo(leftletmap1.map);
            latergroupBack1 = L.featureGroup().addTo(leftletmap1.map);
            leftletImagePic1 = L.imageOverlay("", extentGD).addTo(leftletmap1.map);
            $('#makeMap1').css('background-color','white');
        }
        latergroupBack1.clearLayers();
        LaterGroup1.clearLayers();

        if (typeof leftletmap2 == "undefined") {
            leftletmap2 = new loadMap("makeMap2", 9.3, 199);
            LaterGroup2 = L.featureGroup().addTo(leftletmap2.map);
            latergroupBack2 = L.featureGroup().addTo(leftletmap2.map);
            leftletImagePic2 = L.imageOverlay("", extentGD).addTo(leftletmap2.map);
            $('#makeMap2').css('background-color','white');
        }
        latergroupBack2.clearLayers();
        LaterGroup2.clearLayers();

        if (typeof leftletmap3 == "undefined") {
            leftletmap3 = new loadMap("makeMap3", 9.3, 199);
            LaterGroup3 = L.featureGroup().addTo(leftletmap3.map);
            latergroupBack3 = L.featureGroup().addTo(leftletmap3.map);
            leftletImagePic3 = L.imageOverlay("", extentGD).addTo(leftletmap3.map);
            $('#makeMap3').css('background-color','white');
        }
        latergroupBack3.clearLayers();
        LaterGroup3.clearLayers();

        // for (var i = 0; i < edge_json.length; i++) {
        //     var geoJson = L.geoJson(edge_json[i], {
        //         style: function (feature) {
        //             return { weight: 0, opacity: 1, color: "#ffdfbf", fillOpacity: .5 };
        //         }
        //     })
        //     geoJson.addTo(latergroupBack1).bringToBack();
        // }

        leftletmap1.map.on('zoomend', function(){
        	if(_zoomendMovemap1==9){
	    		leftletmap1.map.setView([20.045751, 110.321662]); _zoomendMovemap1 = 0;
        	}
	    	else if (_zoomendMovemap1==6) {
	    		leftletmap1.map.setView([19.231806,109.820377]); _zoomendMovemap1 = 0;
	    	}else {
		    	leftletmap2.map.setZoom(leftletmap1.map._zoom);
		    	leftletmap3.map.setZoom(leftletmap1.map._zoom);
	    	}
	    });
	    leftletmap2.map.on('zoomend', function(){
	    	if(_zoomendMovemap2==9){
	    		leftletmap2.map.setView([20.045751, 110.321662]); _zoomendMovemap2 = 0;
        	}
	    	else if (_zoomendMovemap2==6) {
	    		leftletmap2.map.setView([19.231806,109.820377]); _zoomendMovemap2 = 0;
	    	}else{
	    		leftletmap1.map.setZoom(leftletmap2.map._zoom);
	    		leftletmap3.map.setZoom(leftletmap2.map._zoom);
	    	}
	    	
	    });
	    leftletmap3.map.on('zoomend', function(){
	    	if(_zoomendMovemap3==9){
	    		leftletmap3.map.setView([20.045751, 110.321662]); _zoomendMovemap3 = 0;
        	}
	    	else if (_zoomendMovemap3==6) {
	    		leftletmap3.map.setView([19.231806,109.820377]); _zoomendMovemap3 = 0;
	    	}else{
		    	leftletmap1.map.setZoom(leftletmap3.map._zoom);
		    	leftletmap2.map.setZoom(leftletmap3.map._zoom);
		    }
	    });

	    leftletmap1.map.on('mousemove', function(event) {
	    	var center = leftletmap1.map.getCenter();
	    	leftletmap2.map.setView(center);
	    	leftletmap3.map.setView(center);
	    });
	    leftletmap2.map.on('mousemove', function(event) {
	    	var center = leftletmap2.map.getCenter();
	    	leftletmap1.map.setView(center);
	    	leftletmap3.map.setView(center);
	    });
	    leftletmap3.map.on('mousemove', function(event) {
	    	var center = leftletmap3.map.getCenter();
	    	leftletmap1.map.setView(center);
	    	leftletmap2.map.setView(center);
	    });
		DefaultPage.ShwoimagePic();
    });

}

//清除地图信号
function ClearEdge_jsonSignal() {
    edge_json.forEach(function (e) {
        e.properties.signal = "";
    });
}
//地图填色
var arrX = [], arrY = [];//坐标串
function FillSignalMap(featureGroup, areaName, signaType, weightw, Opacity) {
    var color = "#";
    Enumerable.From(warningSignal_json).Where("$.SignalName=='" + signaType + "'").ToArray().forEach(function (i) {
        color = i.color;
    });
    var arr = [];
    if (areaName == "全市陆地") {
        for (var i = 0; i < edge_json.length - 2; i++) {
            arr.push(edge_json[i]);
            for (var j = 0; j < edge_json[i].geometry.coordinates[0].length; j++) {
                arrX.push(edge_json[i].geometry.coordinates[0][j][0]);
                arrY.push(edge_json[i].geometry.coordinates[0][j][1]);
            }
        }
    }
    else if (areaName == "东部海区") {
        arr.push(edge_json[edge_json.length - 1]);
        for (var j = 0; j < edge_json[edge_json.length - 1].geometry.coordinates[0].length; j++) {
            arrX.push(edge_json[edge_json.length - 1].geometry.coordinates[0][j][0]);
            arrY.push(edge_json[edge_json.length - 1].geometry.coordinates[0][j][1]);
        }

    }
    else if (areaName == "西部海区") {
        arr.push(edge_json[edge_json.length - 2]);
        for (var j = 0; j < edge_json[edge_json.length - 2].geometry.coordinates[0].length; j++) {
            arrX.push(edge_json[edge_json.length - 2].geometry.coordinates[0][j][0]);
            arrY.push(edge_json[edge_json.length - 2].geometry.coordinates[0][j][1]);
        }
    }
    // else if (areaName == "深圳西北部" || areaName == "深圳北部" || areaName == "深圳西部" || areaName == "东部沿海" || areaName == "西部沿海") {
    //     Enumerable.From(edge_json).Where("$.properties.belongto.indexOf('"+ areaName +"') > -1").ToArray().forEach(function (i) {
    //         arr.push(i);
    //         for (var j = 0; j < i.geometry.coordinates[0].length; j++) {
    //             arrX.push(i.geometry.coordinates[0][j][0]);
    //             arrY.push(i.geometry.coordinates[0][j][1]);
    //         }
    //     });
    // }
    else if (areaName == "南山区" || areaName == "盐田区" || areaName == "罗湖区" || areaName == "福田区" || areaName == "龙岗区" || areaName == "宝安区" || areaName == "坪山新区" || areaName == "光明新区" || areaName == "大鹏新区" || areaName == "龙华新区") {
        Enumerable.From(edge_json).Where("$.properties.area=='" + areaName + "'").ToArray().forEach(function (i) {
            arr.push(i);
            for (var j = 0; j < i.geometry.coordinates[0].length; j++) {
                arrX.push(i.geometry.coordinates[0][j][0]);
                arrY.push(i.geometry.coordinates[0][j][1]);
            }
        });
    }
    else {
        Enumerable.From(edge_json).Where("$.properties.street=='" + areaName + "'").ToArray().forEach(function (i) {
            arr.push(i);
            for (var j = 0; j < i.geometry.coordinates[0].length; j++) {
                arrX.push(i.geometry.coordinates[0][j][0]);
                arrY.push(i.geometry.coordinates[0][j][1]);
            }
        });
    }
    for (var i = 0; i < arr.length; i++) {
        var geoJson = L.geoJson(arr[i], {
            style: function (feature) {
                //return { weight: weightw, opacity: 0.9, color: "#fe522c", fillColor: color, fillOpacity: Opacity };
                return { weight: weightw, opacity: 1, color: "#fe522c", fillColor: color, fillOpacity: 1 };
            }
        })
        geoJson.addTo(featureGroup).bringToFront();
    }
}



