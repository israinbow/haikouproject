<%@ Page Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="SevereWeatherTips.aspx.cs" Inherits="GridPointPrediction_Web.Page.SevereWeatherTips" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">
    <title>强天气提示</title>
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/SevereWeatherTips.css" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/jquery-ui.css" />
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/common.css" />
    <link href="../Script/JSPackage/bootstrap-datepicker/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
   
    <link href="../Script/JSPackage/bootstrap-datepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css" />
    <script src="../Script/PageScript/SevereWeatherTips.js" type="text/javascript"></script>
    <script src="../Script/JSPackage/jquery-1.11.1.min.js?ver=1.0" type="text/javascript"></script>
    <script src="../Script/JSPackage/JSON-js-master/json2.js?ver=1.0" type="text/javascript"></script>
    <script src="../Script/Tools/Common.js?ver=0.3" type="text/javascript"></script>
    <script src="../Script/JSPackage/bootstrap-3.3.6/js/bootstrap.min.js" type="text/javascript"></script>
    <script src="../Script/JSPackage/bootstrap-datepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
    <script src="../Script/JSPackage/bootstrap-datepicker/js/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
    
    <link href="../Script/leaflet-1.0.2/leaflet.css" rel="stylesheet" />
    <script src="../Script/leaflet-1.0.2/leaflet.js" type="text/javascript"></script>
    <script src="../Script/data/dataEdge.js?v=1.0" type="text/javascript"></script>
    <script src="../Script/data/Datajson.js" type="text/javascript"></script>
    <script src="../Script/library/esri-leaflet.js" type="text/javascript"></script>
    <script src="../Script/linqjs/jquery.linq.js" type="text/javascript"></script>
    <script src="../Script/linqjs/linq.min.js" type="text/javascript"></script>
    <script src="../Script/PageScript/ToolsDateTime.js" type="text/javascript"></script>

    <script src="../Script/My97DatePicker/WdatePicker.js"></script>
    
    <script src="../Script/jquery-1.11.3/jquery-ui-1.12.0.custom/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>

    <script src="../Script/library/require.js" type="text/javascript"></script>
    <script src="../Script/PageScript/default.js?ver=1.0" type="text/javascript"></script>
</asp:content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;width:1590px;max-width:1920px;">
        <div class="container-fluid box" style="padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;">
        <div class="row">
            <%--左侧菜单栏--%>
            <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu">
                <h4>强对流天气</h4>
                <ul class="menu_list">
                    <li><a href="PromptPage.aspx" class="indexShow">综合展示</a></li>
                    <li class="active"><a href="SevereWeatherTips.aspx" class="SevereWeatherTips">强天气提示</a></li>
                    <li><a href="mesoscaleAnalysis.aspx" class="mesoscaleAnalysis">中尺度分析</a></li>
                    <li class="EC_index">
                        <span><a href="physicalEC.aspx" class="physicalEC">EC物理量</a></span>
                    </li>
                </ul>
                <ul class="dropDownMenu" style="display:none;">
                    <li class="KIndex" id="KIndex" onclick="changePic('KIndex')"><a href="javascript:void(0)">K指数</a></li>
                    <li id="CAPE" onclick="changePic('CAPE')"><a href="javascript:void(0)">CAPE</a></li>
                    <li id="PW" onclick="changePic('PW')"><a href="javascript:void(0)">PW</a></li>
                    <li id="RSH" onclick="changePic('RSH')"><a href="javascript:void(0)">风暴相关螺旋度</a></li>
                    <li id="5001000WINDSHEAR" onclick="changePic('5001000WINDSHEAR')"><a href="javascript:void(0)">500hPa-1000hPa风切变</a></li>
                    <li id="850VaporFlux" onclick="changePic('850VaporFlux')"><a href="javascript:void(0)">850hPa水汽通量</a></li>
                    <li id="925VaporFlux" onclick="changePic('925VaporFlux')"><a href="javascript:void(0)">925hPa水汽通量</a></li>
                    <li id="T700_T500" onclick="changePic('T700_T500')"><a href="javascript:void(0)">T700-T500温度差</a></li>
                    <li id="T850_T500" onclick="changePic('T850_T500')"><a href="javascript:void(0)">T850-T500温度差</a></li>
                </ul>
               
            </div>

            <%--菜单栏切换内容区域--%>
            <div class="col-lg-9 col-md-9 col-sm-9 content">
                
                <div class="contain">
    
            <div class="conBox" style=" height:345px; background-color: #fafafa;margin-bottom:8px;border-radius:0 0 7px 7px">
                <div class="menu">
                    <span>预警信息</span>
                </div>
                <div class="submenu1">
                    <span class="hover menulist" v='0'>雷达外推</span>
                    <span class="menulist" v='1'>降雨预报</span>
                    <span class="menulist" v='2'>冰雹提示</span>
                    <span class="menulist" v='3'>预警分区提示</span>
                    <span class="area">
                        <a class="active" onclick="DefaultPage.showLeafletAreas('hk')">海口市</a>
                        <a onclick="DefaultPage.showLeafletAreas('hn')">海南省</a>
                    </span>
                    <span id="sub_nowwarn" >当前预警信号</span>
                </div>

                <div class="pictureMain container-fluid">
                    <div class="row">
                    <div id="contentSecond" class="col-lg-3 col-md-3 col-sm-3" style=" position:relative;padding:0 3px 0px 6px">
                        <div class="boxing">
                            <div id="pictxt11">最新实况</div>
                            <div id="pictxt12"></div>
                            <div id="pictxt13"></div>
                            <div id="makeMap1" style="height:242px;"></div>
                        </div>
                    </div>
                    <div style=" position:relative;padding:0 3px" class="col-lg-3 col-md-3 col-sm-3">
                        <div class="boxing">
                            <div id="pictxt21">1小时预报</div>
                            <div id="pictxt22"></div>
                            <div id="pictxt23"></div>
                            <div id="makeMap2"></div>
                        </div>
                    </div>
                    <div style=" position:relative;padding:0 3px" class="col-lg-3 col-md-3 col-sm-3">
                        <div class="boxing">
                            <div id="pictxt31">2小时预报</div>
                            <div id="pictxt32"></div>
                            <div id="pictxt33"></div>
                            <div id="makeMap3"></div>
                        </div>
                    </div>
                    <div class="newWarning col-lg-3 col-md-3 col-sm-3" style="padding:0 6px 0px 3px">
                        <div class="boxing warnInfoBox" style="height:245px;">
                            <div id="warnIcon" style="display:block"></div>
                            <div id="warnCont" style="margin-top:10px"><span style="color:#175F85;">发布内容：</span><span id="warnfbcontent"></span></div>
                        </div>
                    </div>
                    <div class="windWarning col-lg-3 col-md-3 col-sm-3" style="display:none">
                        <div class="boxing" style="height:245px;">
                            <div>当前无台风预发布信息.</div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>

            <div class="conBox" style=" height:202px;background:#fff;margin-bottom:8px;border-radius:7px;padding:10px 1px;">
                <div class="subTimemenu">
                    <span>
                        <span style="color:#175F85;margin:0;">时间：</span>
                        <input id="datetime1" class="form-control" type="text" value="2016-10-21" readonly>
                        <input id="datetime2" class="form-control" type="text" value="10:00" readonly>
                    </span>
                    <span style="margin-top:-5px;">
                        <a id="pre1">上一时次</a>
                        <a id="next1">下一时次</a>
                    </span>
                    <span style="margin-top:-5px;">
                        <div id="up1">更新</div>
                        <div id="new1" class="hover">最新</div>
                        <div id="ys">演示日期</div>
                    </span>
                    <span style=" margin-top:-8px;"><img src="../Images/PageImage/images/defaultsound.png" /></span>
                </div>

                <div class="GridContain" style=" height:140px;">
                    <div class="splitline"></div>
                    <div class="time" id="time1" style="width:100%;"></div>
                    <div class="cate" id="cate1"></div>
                    <div class="gridDiv">
                        <table class="gridTable" id="YBgrid"></table>
                    </div>
                    <div class="trips">
                        <span style="margin-left:490px;">现在</span><span style="margin-left:215px;">未来一小时</span>
                    </div>
                </div>
            </div>

            <div class="conBox" style="height:180px;background:#fff;border-radius:7px">
                <div class="menu">
                    <span>欧洲中心</span>
                </div>
                <div class="subTimemenu" style="margin:10px 5px;">
                    <span style="margin-top:3px;">
                        <span style="color:#175F85;margin:0;">时间：</span>
                        <input id="datetime11" class="form-control" type="text" value="2016-10-18" />
                        <div class="dropdown" style="float: left;">
                            <span id="datetime12" data-toggle="dropdown">20:00</span>
                            <div class="dropdown-menu dropDownMenu_hour" style="min-width: 120px; cursor: pointer">
                                <li><a>20:00</a></li>
                                <li><a>08:00</a></li>
                            </div>
                        </div>
                    </span>
                    <span>
                        <a id="pre2">上一时次</a>
                        <a id="next2">下一时次</a>
                    </span>
                    <span>
                        <div id="up2">更新</div>
                        <div id="new2" class="hover">最新</div>
                    </span>
               </div>

                <div class="GridContain" style="height:88px;">
                    <div class="time" id="time2" style="width:115%;"></div>
                    <div class="cate" id="cate2"></div>
                    <div class="gridDiv">
                        <table class="gridTable" id="OZgrid"></table>
                    </div>
                </div>
            </div>
    
                </div>
            </div>
        </div>
    </div>

    </div>
</asp:Content>