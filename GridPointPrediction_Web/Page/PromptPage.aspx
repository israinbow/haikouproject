<%@ Page Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="PromptPage.aspx.cs" Inherits="GridPointPrediction_Web.Page.PromptPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>强天气</title>
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/common.css" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/index.css" />
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/jquery-ui.css" />
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <script type="text/javascript" src="../Script/PageScript/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Script/PageScript/WebMethod.js?v0.2"></script>
    <script type="text/javascript" src="../Script/time/ToolsDateTime.js"></script>
    <script type="text/javascript" src="../Script/control/index.js"></script>
    <script type="text/javascript" src="../Script/PageScript/index.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <div class="container-fluid box">
            <div class="row">
                <%--左侧菜单栏--%>
                <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu">
                    <h4>强对流天气</h4>
                    <ul class="menu_list">
                        <li class="active"><a href="PromptPage.aspx" class="indexShow">综合展示</a></li>
                        <li><a href="SevereWeatherTips.aspx" class="SevereWeatherTips">强天气提示</a></li>
                        <li><a href="mesoscaleAnalysis.aspx" class="mesoscaleAnalysis">中尺度分析</a></li>
                        <li class="EC_index">
                            <span><a href="physicalEC.aspx" class="physicalEC">EC物理量</a></span>
                        </li>
                    </ul>
                    <ul class="dropDownMenu" style="display: none;">
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
                    <div class="warnInfo">
                        <div class="title">当前预警信息</div>
                        <div class="content">无</div>
                    </div>
                    <div class="physical_monitor">
                        <div class="title">物理量监测</div>
                        <div class="content">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>K指数</td>
                                        <td id="kIndex"></td>
                                        <td>CAPE值</td>
                                        <td id="cape"></td>
                                        <td>水汽通量850hPa</td>
                                        <td id="hPa"></td>
                                    </tr>
                                    <tr>
                                        <td>T850-T500</td>
                                        <td id="t850"></td>
                                        <td>风切变</td>
                                        <td id="windShear"></td>
                                        <td>PW</td>
                                        <td id="pw"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="time_selectingbox">
                        <span>时间：</span>
                        <div id="datetimePicker_div" style="display: inline-block;"></div>

                        <span class="btn_divup"><a class="update_btn" href="javascript:getgriddata()">更新</a></span>
                        <span class="btn_divdown active"><a class="newest_btn" href="javascript:SetUIDate()">最新</a></span>
                    </div>
                    <div class="weathermapInfo container-fluid">
                        <div class="weatherMap_row row">
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('KIndex')">
                                <div class="weatherMap">
                                    <h4>K指数</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('CAPE')">
                                <div class="weatherMap">
                                    <h4>CAPE</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('PW')">
                                <div class="weatherMap">
                                    <h4>PW</h4>
                                    <span></span></div>
                            </div>
                        </div>
                        <div class="weatherMap_row row">
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('RSH')">
                                <div class="weatherMap">
                                    <h4>风暴相关螺旋度</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('5001000WINDSHEAR')">
                                <div class="weatherMap">
                                    <h4>500hPa-1000hPa风切变</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('850VaporFlux')">
                                <div class="weatherMap">
                                    <h4>850hPa水汽通量</h4>
                                    <span></span></div>
                            </div>
                        </div>
                        <div class="weatherMap_row row">
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('925VaporFlux')">
                                <div class="weatherMap">
                                    <h4>925hPa水汽通量</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('T700_T500')">
                                <div class="weatherMap">
                                    <h4>T700-T500温度差</h4>
                                    <span></span></div>
                            </div>
                            <div class="MapContainer col-lg-4 col-md-4 col-sm-4" onclick="targetDetails('T850_T500')">
                                <div class="weatherMap">
                                    <h4>T850-T500温度差</h4>
                                    <span></span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script src="../Script/PageScript/jquery-ui.js" type="text/javascript"></script>
    <script src="../Script/PageScript/dojo-1.11.2.js?ver=0.1" type="text/javascript"></script>
    <script type="text/javascript" src="../Script/PageScript/common.js"></script>
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
</asp:Content>
