<%@ Page Title="" Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="CityForecast6Hour.aspx.cs" Inherits="GridPointPrediction_Web.Page.CityForecast6Hour" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/CityForecast12Hour.css?v0.3" rel="stylesheet" />
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/layui/layui.js"></script>
    <script src="../Script/util/common.js"></script>
    <script src="../Script/PageScript/CityForecast6Hour.js?v0.17"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div id="Max" style="margin-left: 320px;">
        <div id="head">
            <div class="txtdate" id="ForecastPeriod">
                <ul>
                    <li class="txt" style="color:#058dde">时间：</li>
                    <li>
                        <input id="ForecastTime" onchange="DateSelect()" class="Wdate" type="text" onclick="WdatePicker()" />
                    </li>
                    <li>
                        <button type="button" class="btn btn-primary active" id="NewData">最新</button></li>
                    <li class="txt" style="color:#058dde">预报时段：</li>
                    <%--<li>
                        <button type="button" class="btn btn-primary" id="Forecast6">05:45</button></li>--%>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast10">09:45</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast16">15:45</button></li>
                </ul>
            </div>
            <div id="forecast">
                <ul>
                    <li class="txt" style="color:#058dde">预报员：</li>
                    <li>
                        <select id="member" class="txtbox">
                        </select></li>
                    <li>
                        <input id="pwd" class="txtbox" type="password" /></li>
                </ul>
            </div>
            <div id="preview" style="float: left;">
                <ul>
                    <li>
                        <label class="txt" style="color:#058dde">
                            <input id="rdSW" type="radio" value="上网" checked="checked" class="radioclass input" />上网</label>
                    </li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnSave">预览</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnIsCorrect">更正报预览</button></li>
                </ul>
            </div>
        </div>
        <div id="content">
            <div id="c_head" style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                <ul>
                    <li>
                        <label>
                            <span class="txt">逐时预报</span>
                            <span class="txt" style="color: #058dde; font-size: 14px;"></span>
                        </label>
                    </li>
                </ul>
            </div>
            <div id="Day7Forecast" style="margin-top: 0px; border-top: 0px;">
            </div>
        </div>
        <div id="AWSInfo" style="border-top: 0px;">
        </div>
        <div id="foot">
            <div id="HistoryHead" style="padding-left: 0px;">
                <ul style="height:auto;">
                    <li style="height:60px;">
                        <label>
                            <span class="txt" style="color: #058dde; font-size: 15px; font-weight: bold;">预报监测</span>
                            <span class="txt" style="color: #78B0E2; font-size: 13px; margin-right: 20px;"></span>
                        </label>
                    </li>
                    <li class="txt" style="color: #058dde; font-size: 15px; font-weight: bold; margin-left: 10px;">时间：</li>
                    <li>
                        <input id="HisStartTime" class="Wdate" type="text" onclick="WdatePicker()" />
                    </li>
                    <li style="padding: 0px 8px 0px 8px; color: #058dde">至</li>
                    <li>
                        <input id="HisEndTime" class="Wdate" type="text" onclick="WdatePicker()" /></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnSelect" style="margin-left: 30px;">查询</button></li>
                    <%--<li>
                        <a class="btn btn-primary" href="ftp://gmcrsz:shenz123@10.148.72.30:12821/rcv/prog6h/" target="_blank">省局FTP上网文件查询</a>
                    </li>--%>
                </ul>
            </div>           
            <div id="HistoryData">
            </div>
            <div id="Flip">                
                <div id="Flip_div"></div>
            </div>
        </div>
    </div>
    <div class="viewpro">
        <div id="Mes_Max" style="width: 625px; height: 465px;">
        <div id="Mes_center" style="width: 620px; margin-bottom: 31px; padding-top: 10px;">
            <div id="Mes_Left" style="width: 620px;">
                <textarea id="Mes_text" style="width: 605px; margin-top: 10px; font-size: 16px; font-family: 微软雅黑;"></textarea>
            </div>
        </div>
        <div id="Mes_Foot" style="width: 620px;">
            <button type="button" class="btn btn-primary" id="btnIssue">上传</button>
            <button type="button" class="btn btn-primary" id="btnCancel">取消</button>
        </div>
    </div>
    </div>
    

    <script type="text/javascript">
        $(function () {
            $("#CityForecast6Hour").addClass("active");
        })
    </script>
</asp:Content>
