 <%@ Page Title="" Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="CityForecast12Hour.aspx.cs" Inherits="GridPointPrediction_Web.Page.CityForecast12Hour" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/CityForecast12Hour.css?v0.24" rel="stylesheet" />
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/layui/layui.js"></script>
    <script src="../Script/Charts/build/dist/echarts.js"></script>
    <script src="../Script/util/common.js"></script>
    <script src="../Script/PageScript/CityForecast12Hour.js?v0.32"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="Max" style="margin-left: 320px;">
        <div id="head">
            <div class="txtdate" id="ForecastPeriod">
                <ul>
                    <li class="txt" style="color:#058dde">时间：</li>
                    <li>
                        <input onchange="DateSelect()" id="ForecastTime" class="Wdate" type="text" onclick="WdatePicker()" /></li>
                    <li>                        
                        <label class="btn btn-primary" id="NewData">最新</label>
                    </li>
                    <li class="txt" style="color:#058dde">预报时段：</li>
                    <li>
                        <button type="button" data-hour="08" class="btn btn-primary" id="Forecast10">09:30</button>
                    </li>
                    <%--<li>
                        <button type="button" class="btn btn-primary" id="Forecast15">14:40</button></li>--%>
                    <li>
                        <button type="button" data-hour="20" class="btn btn-primary" id="Forecast16">15:30</button>
                    </li>
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
                            <input id="rdSW" type="radio" value="上网" checked="checked" class="radioclass input" />
                            上网</label>
                    </li>
                    <li id="btnSaveli" class="disabled">
                        <button type="button" class="btn btn-primary" name="ll" id="btnSave">预览</button></li>
                    <li id="btnIsCorrectli" class="disabled">
                        <button type="button" class="btn btn-primary" name="ll" id="btnIsCorrect">更正报预览</button></li>
                </ul>
            </div>
        </div>

        <div id="content">
            <div id="c_head" style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <ul>
                    <li>
                        <label><span class="txt">分区预报数据</span><span class="txt" style="color: white; font-size: 13px; opacity:0.8;">     （请注意气温预报不分段，只报24小时内的最高和最低气温。）</span></label>
                    </li>
                    <li>
                        <button id="ft" type="button" class="DQY btn btn-primary active" name="DQY">琼山区</button></li>                          
                </ul>
            </div>
            <div id="ChartT">
            </div>
            <div id="Day7Forecast">
            </div>
        </div>

        <div id="foot">
            <div id="HistoryHead" class="txtdate">
                <ul>
                    <li class="txt" style="color: #058dde">时间：</li>
                    <li>
                        <input id="HisStartTime" class="Wdate" type="text" onclick="WdatePicker()" /></li>
                    <li>至</li>
                    <li>
                        <input id="HisEndTime" class="Wdate" type="text" onclick="WdatePicker()" /></li>
                    <li>
                        <button type="button" class="btn btn-primary" id="btnSelect">查询</button></li>
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
        <div id="Mes_Max" class="hide">
            <div id="Mes_Head">
                <%--<button type="button" class="btn btn-danger">上网文件</button>--%>
            </div>
            <div id="Mes_center">
                <div id="Mes_Left">
                    <textarea id="Mes_text" style="width: 100%; margin-top: 10px;"></textarea>
                </div>
                <div id="Mes_Right">
                    <h4>比武评分规则：</h4>
                    <p>1、全国统一的预报比武结果按中国局要求的技巧评分统计，评技巧分按天气现象评，上网录入的降雨量是参加定量降水预报按定量降水检验办法检验（但是上网的天气现象和雨量要保持一致）。</p>
                    <p>2、关于暴雨预报，报大到暴雨，如雨量小于25算暴雨以上预报空报；雨量25-50一般性降水预报正确，暴雨以上预报不评；超过50，暴雨以上预报正确。雨量0.1以上晴雨算正确。</p>
                    <p>3、降水检验分为两类：一般性降水和暴雨以上降水检验。如果说暴雨，指的就是分级里的暴雨了，且暴雨预报是按12小时降水评定。12小时达到50毫米算暴雨。</p>
                    <p>4、关于质量评比和次数，上午10时只算发报次数，不参加质量评比。</p>
                </div>
            </div>
            <div id="Mes_Foot">
                <button type="button" class="btn btn-primary" id="btnIssue">上传</button>
                <button type="button" class="btn btn-primary" id="btnCancel">取消</button>
            </div>
        </div>
    </div>

    <div id="SinglePoint" class="hide">
    </div>

    <script type="text/javascript">
        $(function () {
            $("#CityForecast12Hour").addClass("active");
        })
    </script>
</asp:Content>

