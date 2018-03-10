<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="CityForecast6Hour.aspx.cs" Inherits="GridPointPrediction_Web.Page.CityForecast6Hour" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/CityForecast12Hour.css?copyright" rel="stylesheet" />
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/layui/layui.js"></script>
    <script src="../Script/util/common.js"></script>
    <script src="../Script/PageScript/CityForecast6Hour.js?var01"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div id="Max" style="margin:auto; padding: 0 0 0 18px;width:1540px;">
        <div id="head">
            <div class="txtdate" id="ForecastPeriod">
                <%--<input type="text" id="date" class="timetxt" />--%>
                <ul>
                    <li class="txt">时间：</li>
                    <li>
                        <input id="ForecastTime" onchange="DateSelect()" class="Wdate" type="text" onclick="WdatePicker()" />
                    </li>
                    <li>
                        <label class="btn btn-primary" id="NewData" style="background-color: red; border: 1px solid red; height: 26px; line-height: 14px; margin-right: 10px;">最新</label></li>
                    <li class="txt">预报时段：</li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast6">05:45</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast10">09:45</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast16">15:45</button></li>
                </ul>
            </div>
            <div id="forecast">
                <ul>
                    <li class="txt">预报员：</li>
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
                        <label class="txt">
                            <input id="rdSW" type="radio" value="上网" checked="checked" class="radioclass input" />
                            上网</label>
                    </li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnSave">预览</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnIsCorrect">更正报预览</button></li>
                </ul>
            </div>
        </div>
        <div id="content">
            <div id="c_head">
                <ul>
                    <li>
                        <span style="font-weight: bold; color: #F2A444; font-size: 18px; margin-right: 10px;">|</span>
                        <label><span class="txt">逐时预报</span><span class="txt" style="color: #78B0E2; font-size: 13px;"></span></label>
                    </li>
                </ul>
            </div>
            <div id="Day7Forecast" style="margin-top: 0px; border-top: 0px;">
            </div>
        </div>
            <div id="AWSInfo" style=" border-top: 0px;">
                
            </div>
        <div id="foot">
            <div id="HistoryHead" class="txtdate" style="padding-left: 0px;">
                <ul>
                    <li><span style="font-weight: bold; color: #F2A444; font-size: 18px; margin-right: 10px;">|</span>
                        <label><span class="txt">预报监测</span><span class="txt" style="color: #78B0E2; font-size: 13px; margin-right: 20px;"> </span></label>
                    </li>
                    <li class="txt">时间：</li>
                    <li>
                        <input id="HisStartTime" class="Wdate" type="text" onclick="WdatePicker()" />
                    </li>
                    <li>至</li>
                    <li>
                        <input id="HisEndTime" class="Wdate" type="text" onclick="WdatePicker()" /></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnSelect">查询</button></li>
                    <li>
                        <%--<button type="button" class="btn btn-primary">省局FTP上网文件查询</button>--%>
                        <a class="btn btn-primary" href="ftp://gmcrsz:shenz123@10.148.72.30:12821/rcv/prog6h/" target="_blank">省局FTP上网文件查询</a>
                    </li>
                </ul>
            </div>
            <%--<div id="TypeFile">
                <input type="button"  value="历史上网文件"/>
                <input type="button"  value="呼叫记录"/>
            </div>--%>
            <div id="HistoryData">
            </div>
            <div id="Flip">
                <%--<button type="button" >上一页</button>
                <label>第<span>1</span>页</label>
                <span>/</span>
                <label>总<span>10</span>页</label>
                <button type="button" >下一页</button>--%>
                <div id="Flip_div"></div>
            </div>
        </div>
    </div>


    <div id="Mes_Max" class="hide" style="width: 600px; height: 470px;">
        <div id="Mes_center" style="width: 580px; margin-bottom: 31px; padding-top: 20px;">
            <div id="Mes_Left" style="width: 580px;">
                <%--<input type="text" value="" />--%>
                <textarea id="Mes_text" style="width: 570px; margin-top: 10px;"></textarea>
            </div>
        </div>
        <div id="Mes_Foot" style="width: 580px;">
            <button type="button" class="btn btn-primary" id="btnIssue">上传</button>
            <button type="button" class="btn btn-primary" id="btnCancel">取消</button>
        </div>
    </div>
</asp:Content>
