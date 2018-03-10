<%@ Page Title="" Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="ZoneForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.ZoneForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/ZoneForecast.css?v0.08" rel="stylesheet" />
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/layui/layui.js"></script>
    <script src="../Script/Charts/build/dist/echarts.js"></script>
    <script src="../Script/util/common.js"></script>
    <script src="../Script/PageScript/ZoneForecast.js?v0.39"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="Max" style="/*margin: auto;*/margin-left: 320px;">
        <div id="head">
            <div class="txtdate" id="ForecastPeriod">
                <ul>
                    <li class="txt">时间：</li>
                    <li>
                        <input onchange="DateSelect()" id="ForecastTime" class="Wdate" type="text" onclick="WdatePicker()" />
                    </li>                   
                    <%--<li>
                        <button type="button" class="btn btn-primary" id="Forecast6">06:00</button></li>--%>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast10">08:00</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast16">20:00</button></li>
                </ul>
            </div>
            <div id="ForecastType">
                    <ul>
                        <li>
                            <button type="button" class="btn btn-primary" id="Rain">降雨(mm)</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="Tempture">温度(℃)</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="Humidity">湿度(%)</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="Wind">风速(m/s)</button></li>
                    </ul>
                </div>
                <div id="DetailDiv">
                    <ul>
                        <li class="disabled" id="ZoneShowli">
                            <button type="button" class="btn btn-primary" id="ZoneShow" style="margin-left: 20px" onclick="ZoneShow_btn()">预览区域数据</button></li>
                    </ul>
                </div>
        </div>    
        <div id="secondhead">
            <div id="SelectPan">                
                <div id="ForecastZone" style="float: left">
                    <ul>
                        <li>
                            <button type="button" class="btn btn-primary active" id="FTArea">美兰区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="LuoHArea">秀英区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="NSArea">龙华区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="YTArea">琼山区</button></li>                        
                    </ul>
                </div>
                <div id="CopyData" style="margin-left: 200px">
                    <ul>
                        <li>
                            <select id="LisQY" class="txtbox" name="Zone" disabled="disabled">
                            </select>
                        </li>
                        <li class="disabled" id="copyQYli">
                            <button type="button" class="txt btn btn-primary" id="copyQY">复制区域数据</button></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div id="content">           
            <div id="ChartT">
            </div>
        </div>
        <div id="foot">
            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 150px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">逐时预报<span class="txt" style="color: white; font-size: 13px; opacity:0.8;">-源于格点数据</span></label>
            </div>
            <div id="DataShow">
            </div>
        </div>
    </div>


    <div class="realsePage" style="display: none;">
        <div id="AreaN" style="width: 930px; overflow: auto; margin-left: 360px">
            <ul>
                <li>
                    <button type="button" class="btn btn-primary" id="FTAreaD">美兰区</button></li>
                <li>
                    <button type="button" class="btn btn-primary" id="LuoHAreaD">秀英区</button></li>
                <li>
                    <button type="button" class="btn btn-primary" id="NSAreaD">龙华区</button></li>
                <li>
                    <button type="button" class="btn btn-primary" id="YTAreaD">琼山区</button></li>
            </ul>
        </div>
        <div class="Text">
            <div class="content">
                <div class="topTitle">
                    海口市气象台公报
                </div>
                <div class="xuhao">第<span id="yearEdit" style="color: blue;"></span>号</div>
                <div id="text2" style="font-family: KaiTi; font-size: x-large; font: bold; text-align: center"></div>
                <div style="font-weight: bold;">一、天气回顾</div>
                <div id="huigu" style="margin-top: 10px"></div>
                <div style="margin-top: 15px">
                    二、<label id="Area"></label>
                    <label id="Area2"></label>
                </div>
                <div style="line-height: 5px; display: inline;">
                    <div style="float: left">
                        <img id="img" src="" />
                    </div>
                    <div id="data" style="height: 30px"></div>
                </div>

                <div style="font-weight: bold; margin-top: 60px">三、未来12小时逐小时预报</div>
                <div id="biaoge1" style="margin-bottom: 15px;"></div>
                <div id="biaoge2" style="margin-bottom: 15px;"></div>
                <div style="font-weight: bold; margin-top: 10px">四、天气趋势预测</div>
                <div id="qushi"></div>
                <div id="yuceTab" style="width: 100%"></div>
                <div style="font-size: 10px;">（提示 ：天气如有变化，气象台将随时更新早晨天气预报。请注意采用最新版本）</div>
                <div style="height: 50px; text-align: right; width: 800px; border-bottom: 2px solid red; line-height: 50px;"></div>
                <div class="footContent">预报员：<span id="foreaceUser"></span>&nbsp;&nbsp;&nbsp;&nbsp;预报值班电话：83136599  通信值班电话：82511601</div>
            </div>
        </div>
        <div style="line-height: 50px; height: 50px; margin: auto; width: 800px;">
            <label style="line-height: 45px; text-align: right; width: 70px; color: #0094e7; height: 45px; display: inline-block;">预报员</label>
            <select id="cbUser" style="width: 100px; border: 1px solid #ccc; text-align: center; height: 28px; border-radius: 4px;" onblur="selectChange()">
            </select>
            <div class="col-xs-3" style="width: 110px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                <div class="form-group" style="width: 30px;">
                    <input value="" id="passwad" type="password" class="form-control" style="padding-left: 17px; background: url(../../Images/mima.png) no-repeat 0,0; width: 360%; height: 28px; display: inline-block; line-height: 10px;" />
                </div>
            </div>
            <label class="realse" onclick="realse_button()">发布</label>
            <label class="canlle" onclick="canlle_buuton()">取消</label>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $("#ZoneForecast").addClass("active");//使一级菜单处于选中状态
        })
    </script>
</asp:Content>
