<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="CommutingForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.WebForm1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/CommutingForecast.css" rel="stylesheet" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="container maxcontainer padding0">
        <div style="width:1540px">
        <%--功能选择模块--%>
        <div class="row FunctionSelection" style="margin:0px;">
            <div class="row FunctionSelection_top padding0">
                <div class="col-md-5 col-sm-5" style="width: 646px;">
                    <span class="FS_title">时次</span>
                    <input id="FS_ForeTime" class="foretime text-center" type="text" />
                    <span id="SF_forehourmin">
                        <button type="button" data-index="1" data-hour="6" class="choosebtn active btn btn-primary btn-sm">06:00</button>
                        <button type="button" data-index="2" data-hour="7" class="choosebtn btn btn-primary btn-sm">07:00</button>
                        <button type="button" data-index="3" data-hour="8" class="choosebtn btn btn-primary btn-sm">08:00</button>
                        <button type="button" data-index="4" data-hour="17" class="choosebtn btn btn-primary btn-sm">17:00</button>
                        <button type="button" data-index="5" data-hour="18" class="choosebtn btn btn-primary btn-sm">18:00</button>
                        <button type="button" data-index="6" data-hour="19" class="choosebtn btn btn-primary btn-sm">19:00</button>
                    </span>
                </div>
                <div class="col-md-4 timeOperation">
                    <span class="FS_title">时间</span>
                    <input id="FS_AWSTime" class="foretime text-center" type="text" value="" />
                    <select id="time_hour" style="height: 28px; line-height: 28px;">
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                    </select>
                    <select id="time_min" style="height: 28px; line-height: 28px;">
                        <option>00</option>
                        <option>01</option>
                        <option>02</option>
                    </select>
                    <button type="button" class="btn btn-primary btn-sm" id="FS_Toupdate">更新</button>
                    <button type="button" class="btn btn-success btn-sm" id="FS_ToNewest">最新</button>
                </div>
                
            </div>
            <div class="row FunctionSelection_bottom"">
                <div class="col-md-5 publishingoperation">
                    <span class="FS_title">发布渠道</span>
                    <input type="checkbox" checked="checked" id="inlineCheckbox1" value="option1" />
                    公众网
                       <input type="checkbox" checked="checked" id="inlineCheckbox2" value="option2" />
                       决策网
                        <input id="microblog" type="checkbox" value="option3" />
                        微博
                        <input id="email" type="checkbox" value="option3" />
                        邮件
                    <span class="FS_title" style="margin-left: 17px;">预报员</span>
                    <select id="SF_Forecaster" style="width: 76px;height: 28px; text-align: center">
                    </select>
                    <button type="button" class="btn btn-primary btn-sm btn_preview" style="width: 80px; margin-left: 20px;">预览</button>
                </div>
                <div class="col-md-3" style="width: 338px;">
                    <span class="FS_title">类别</span>
                    <span id="SF_awselement">
                        <button type="button" data-valuename="RAIN" class="choosebtn active btn btn-primary btn-sm">降雨</button>
                        <button type="button" data-valuename="V" class="choosebtn btn btn-primary btn-sm">能见度</button>
                        <button type="button" data-valuename="T" class="choosebtn btn btn-primary btn-sm">温度</button>
                        <button type="button" data-valuename="WD2DF" class="choosebtn btn btn-primary btn-sm">风力</button>
                    </span>
                </div>
                <div class="col-md-4 awswhenlong">
                    <span class="FS_title">时长</span>
                    <span id="SF_awswhenlong">
                        <button type="button" title="半小时" data-min="30" data-type="R30M" class="choosebtn active btn btn-primary btn-sm">30M</button>
                        <button type="button" title="一小时" data-min="60" data-type="R01H" class="choosebtn btn btn-primary btn-sm">1H</button>
                        <button type="button" title="两小时" data-min="120" data-type="R02H" class="choosebtn btn btn-primary btn-sm">2H</button>
                        <button type="button" title="三小时" data-min="180" data-type="R03H" class="choosebtn btn btn-primary btn-sm">3H</button>
                    </span>
                </div>
            </div>
        </div>
        <div class="row" style="width:1540px;margin:5px 0px 0px 0px;height:650px;">
            <div class="col-md-4 col-sm-4 FS_Forecastdisplay padding0" style="height: 100%;width:510px;margin-right:5px;">
                <div class="col-md-12 FS_Weatherreview padding0" style="height:50%;">
                    <p class="FS_Weather_title"><span class="line"></span>天气回顾</p>
                    <textarea class="FS_Forecastcontent" style="height:276px"><%--预计17-20时，全市晴天间多云；气温14-16℃，相对湿度70%-85%；全市能见度普遍在7-15公里之间。早晨天气不错，适宜出行。--%></textarea>
                </div>
                <div class="col-md-12 FS_WeatherCommute" style="height:50%;">
                    <p class="FS_Weather_title"><span class="line"></span>上下班时段分区预报</p>
                    <textarea class="FS_Forecastcontent" style="height:276px"><%--预计17-20时，全市晴天间多云；气温14-16℃，相对湿度70%-85%；全市能见度普遍在7-15公里之间。早晨天气不错，适宜出行。--%></textarea>
                </div>
            </div>
            <%--            <div class="col-md-1" style="border:1px solid red;height:400px;width:13px"></div>--%>
            <div class="col-md-8 col-sm-8 FS_AWStomapdisplay padding0" style="height: 100%;width:1021px">
                <div style="background-color: white;height:50%">
                    <p class="FS_Weather_title" style="padding-top: 6px;"><span class="line"></span><span class="FS_awsmaptitle">深圳市雨量分布图</span></p>
                    <div id="map_aws">
                        <h4 class="map_aws_title">深圳市雨量分布图</h4>
                    </div>
                </div>
                <div id="map_road" style="height:50%">
                    <h4 class="map_aws_title">深圳市雨量分布图</h4>
                    <img class="colourcode img-rounded" src="../Images/rain.png" style="position: absolute; right: 50px; bottom: 0px; z-index: 999999" />
                </div>
            </div>
            <%--<div class="col-md-12 padding0">
                
            </div>--%>
        </div>
        <%--报文预览页--%>
        <div class="row MessagePreview padding0" style="display: none">
            <div class="col-md-12 mp_con">
                <h1 class="mp_title text-center" style="font-weight: bold; color: red;">深圳市气象台公报</h1>
                <p class="mp_line top text-center">第<span style="color: blue; font-weight: bold;" class="mp_number">2017022104</span>号</p>
                <h4 class="mp_title text-center FS_Onandoffduty" style="font-weight: bold; margin-top: 15px; margin-bottom: 15px;">下班重点时段分区天气预报</h4>
                <div class="mp_content">
                    <p class="FS_Hg" style="text-indent: 2em;">
                        昨天夜间到今天早晨，我市阴天，有轻雾，全市大部分地区的能见度在1-5公里，白天转多云，吹和缓的偏东风；能见度逐渐由5公里上升到15公里；上午气温气温在17-19℃，午后气温上升到22-24℃；相对湿度65%-99%。
                    </p>
                    <p class="FS_Fore" style="text-indent: 2em; color: blue">
                        预计17-20时，全市阴天间多云，部分地区有轻雾；气温18-21℃；吹微弱的偏东风；相对湿度75%-95%；部分地区有轻雾，能见度低于3公里，其它地区能见度在5公里以上。早晨部分地区有轻雾，请注意行车安全。
                    </p>
                </div>
                <p style="font-size: 16px;">本预报发布时间：每天6:00、7:00、8:00、17:00、18:00、19:00</p>
                <p>下一次预报将在<span class="mp_ReleaseTime" style="color: red; font-weight: bold;">7:00</span>发出</p>
                <p class="mp_line bottom text-center">预报员：<span class="mp_Forecaster" style="color: blue; font-weight: bold;">张琳琳</span> 预报值班电话：83136599 通信值班电话：82511601</p>
            </div>

        </div>
    </div></div>
    <script src="../Script/PageScript/CommutingForecast.js"></script>
</asp:Content>
