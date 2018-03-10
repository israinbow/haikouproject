<%@ Page Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="physicalEC.aspx.cs" Inherits="GridPointPrediction_Web.Page.physicalEC" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">
    <title>EC物理量</title>
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/common.css?v0.1" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/physicalEC.css" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/jquery-ui.css" />
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <script type="text/javascript" src="../Script/PageScript/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Script/PageScript/WebMethod.js?v0.2"></script>
    <script type="text/javascript" src="../Script/library/jquery-ui.min.js"></script>
    <script type="text/javascript" src="../Script/library/leaflet.js"></script>
    <script type="text/javascript" src="../Script/library/esri-leaflet.js"></script>
    <script type="text/javascript" src="../Script/common/commoni.js"></script>
    <script type="text/javascript" src="../Script/control/index.js?v0.1"></script>
    <script type="text/javascript" src="../Script/PageScript/index.js?v0.1"></script>
</asp:content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;width:1583px;max-width:1920px;">
        <div class="container-fluid box">
        <div class="row">
            <%--左侧菜单栏--%>
            <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu">
                <h4>强对流天气</h4>
                <ul class="menu_list">
                    <li><a href="PromptPage.aspx" class="indexShow">综合展示</a></li>
                    <li><a href="SevereWeatherTips.aspx" class="SevereWeatherTips">强天气提示</a></li>
                    <li><a href="mesoscaleAnalysis.aspx" class="mesoscaleAnalysis">中尺度分析</a></li>
                    <li class="EC_index active">
                        <span><a href="physicalEC.aspx" class="physicalEC">EC物理量</a><img class="control_arrow" src="../Images/PageImage/images/open.png" /></span>
                    </li>
                </ul>
                <ul class="dropDownMenu">
                    <li class="KIndex active" id="KIndex" onclick="changePic('KIndex')"><a href="javascript:void(0)">K指数</a></li>
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
                <div class="time_selectbox">
                    <span style="top:-10px;position:relative;">时间：</span>
                    <div id="datetimePicker_div" style="display: inline-block;top:-10px;position:relative;"></div>
               
                    <span style="top:-10px;position:relative;" class="btn_divup"><a class="update_btn" href="javascript:refreshDate()">更新</a></span>
                    <span style="top:-10px;position:relative;" class="btn_divdown active"><a class="newest_btn" href="javascript:SetUIDate()">最新</a></span>

                    <div class="predictTime" style="top:-10px;position:relative;">
                        <span class="title">预报时次：</span>
                    </div>

                    <table style="height: 35px; margin-left: 15px;" id="predictTime_table">
                        <tr>
                            <td>
                                <table>
                                    <tr id="table_date">
                                        <td style="display:none"></td>
                                        <td>
                                            <span id="startDay"></span>
                                            <span id="startDay2"></span>
                                            <span id="startDay3"></span>
                                        </td>
                                        <td style="display:none"></td>
                                        <td style="display:none"></td>
                                    </tr>
                                    <tr>
                                        
                                        <td id="playerContainer_td" style="width: 280px"></td>
                                        <td id="flash_img">
                                            <div style="margin-top: 3px">
                                                <img alt="back" id="play_back_img" src="../Images/PageImage/images/button/left.png" /><img alt="play" id="play_img" src="../Images/PageImage/images/button/play.png" /><img alt="front" id="play_front_img" src="../Images/PageImage/images/button/right.png" />
                                            </div>
                                        </td>
                                        <td><span id="show_time" style="font-size: 20px; line-height: 20px;"></span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="mapShow">
                    <div class="container"></div>
                </div>
                
            </div>
        </div>
    </div>
    </div>

    <script src="../Script/PageScript/jquery-ui.js" type="text/javascript"></script>
    <script src="../Script/PageScript/dojo-1.11.2.js?ver=0.1" type="text/javascript"></script>
    <script type="text/javascript" src="../Script/PageScript/common.js"></script>
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
    <script src="../Script/PageScript/physicalEC.js" type="text/javascript"></script>
</asp:Content>