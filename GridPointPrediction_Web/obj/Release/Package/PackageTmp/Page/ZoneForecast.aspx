<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="ZoneForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.ZoneForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/ZoneForecast.css?copyright" rel="stylesheet" />
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/layui/layui.js"></script>
    <script src="../Script/Charts/build/dist/echarts.js"></script>
    <script src="../Script/util/common.js"></script>
    <script src="../Script/PageScript/ZoneForecast.js?var01"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="Max" style="margin: auto; width: 1540px;">
        <div id="head">
            <div class="txtdate" id="ForecastPeriod">
                <%--<input type="text" id="date" class="timetxt" />--%>
                <ul>
                    <li class="txt">时间：</li>
                    <li>
                        <input onchange="DateSelect()" id="ForecastTime" class="Wdate" type="text" onclick="WdatePicker()" <%-- onselect="DateSelect()"--%> />
                    </li>
                    <!--  <li>
                        <label class="btn btn-primary" id="NewData" style="background-color: red; border: 1px solid red; height: 26px; line-height: 14px; margin-right: 10px;">最新</label></li>
                    <li class="txt">预报时段:</li>-->
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast6">06:00</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast10">11:00</button></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="Forecast16">16:00</button></li>
                </ul>
            </div>
            <div id="SelectPan">
                <div id="ForecastType" style="padding-left: 100px;">
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
                        <li>
                            <button type="button" class="btn btn-primary" id="ZoneShow" disabled="disabled" style="width: 130px; background-color: #306DA8; color: white; margin-left: 20px">预览区域数据</button></li>
                    </ul>
                </div>

                <div id="ForecastZone" style="float: left">
                    <ul>
                        <li>
                            <button type="button" class="btn btn-primary" id="FTArea">福田区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="LuoHArea">罗湖区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="NSArea">南山区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="YTArea">盐田区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="BAArea">宝安区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="LGArea">龙岗区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="GMArea">光明新区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="PSArea">坪山新区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="LongHArea">龙华新区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="DPArea">大鹏新区</button></li>
                        <li>
                            <button type="button" class="btn btn-primary" id="SSArea">深汕新区</button></li>

                    </ul>
                </div>
                <div id="CopyData" style="margin-left: 200px">
                    <ul>
                        <li>
                            <select id="LisQY" class="txtbox" name="Zone" disabled="disabled">
                            </select>
                        </li>
                        <li>
                            <button type="button" disabled="disabled" class="txt btn btn-primary" id="copyQY" style="width: 130px; background-color: #306DA8; color: white;">复制区域数据</button></li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="content">
            <div id="ChartT">
            </div>
        </div>
        <div id="foot">
            <div id="DataShow">
            </div>
        </div>
    </div>


    <div class="realsePage" style="display: none;">
        <div class="Text">
            <div class="content">
                <div class="topTitle">
                    深圳市气象台公报
                </div>
                <div class="xuhao">第<span id="yearEdit" style="color: blue;"></span>号</div>
                <div style="font-weight: bold;">一、天气回顾</div>
                <div id="weathHG" style="line-height: 30px;">&nbsp;&nbsp;</div>
                <div id="zhanwang" style="font-weight: bold;">二、今天中午到傍晚（12-20时）天气预测</div>
                <div style="line-height: 5px;">
                    <%--&nbsp;&nbsp;<%=weather%>--%>
                    <label id="row1" style="height: 30px; width: 820px; display: inline-block; line-height: 30px;"></label>
                    <label id="row2" style="height: 30px; width: 820px; display: inline-block; line-height: 30px;"></label>
                    <label id="row3" style="height: 30px; width: 820px; display: inline-block; line-height: 30px;"></label>
                    <label id="row4" style="height: 30px; width: 820px; display: inline-block; line-height: 30px;"></label>
                    <label id="row5" style="height: 30px; width: 820px; display: inline-block; line-height: 30px;"></label>
                </div>

                <div style="font-weight: bold;">三、未来逐日天气预测</div>
                <div id="weilai" style="line-height: 30px;">&nbsp;&nbsp;</div>
                <div id="biaoge" style="margin-bottom: 15px;"></div>
                <div id="tvCity">
                    <div style="font-weight: bold;">四、今日天气预报电视图标（专为电视台摄制）</div>
                    <label style="float: left; line-height: 70px; width: 130px; height: 70px; text-align: center; display: inline-block;"></label>
                    <img id="dianshi" style="float: left; line-height: 70px; width: 50px; height: 70px; text-align: center; display: inline-block;" src="../../Images/tq/" />
                    <label style="line-height: 70px; width: 120px; height: 70px; text-align: center; display: inline-block;"></label>
                    <div style="font-size: 10px;">（提示 ：天气如有变化，气象台将随时更新早晨天气预报。请注意采用最新版本）</div>
                </div>
                <div style="height: 50px; text-align: right; width: 800px; border-bottom: 2px solid red; line-height: 50px;"></div>
                <div class="footContent">预报员：<span id="foreaceUser"></span>&nbsp;&nbsp;&nbsp;&nbsp;预报值班电话：83136599  通信值班电话：82511601</div>
            </div>
        </div>
        <div style="line-height: 50px; height: 50px; margin: auto; width: 800px;">
            <input id="chuanzhen" type="checkbox" checked="true" value="传真" />
            <label>传真</label>
            <input id="weibo" type="checkbox" checked="true" value="微博" />
            <label>微博</label>
            <input id="word" type="checkbox" checked="true" value="Word文档" />
            <label>Word文档</label>
            <input id="realsofa" type="checkbox" checked="true" value="网站发布" />
            <label>网站发布</label>
            <label class="realse" onclick="realse_button()">发布</label>
            <label class="canlle" onclick="canlle_buuton()">取消</label>
        </div>

    </div>
</asp:Content>
