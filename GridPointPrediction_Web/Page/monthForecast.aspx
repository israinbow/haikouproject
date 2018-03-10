<%@ Page Language="C#"  MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="monthForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.monthForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <link href="../Style/PageStyle/month_Forecast.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script> 
    <script src="../Script/PageScript/month_Forecast.js" type="text/javascript"></script>
    <script src="../Script/PageScript/SpecialReportCommon.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div>
        <div class="container-fluid box" style="padding:0;">
            <div class="row editPage" style="width:93%;margin:0">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <%--内容区域头部--%>
                    <div class="top">
                        <label style="text-align: right; height: 45px; color: #0094e7; width: 100px; display: inline-block; float: left; font-family: 微软雅黑; font-size: 16px;">预报时段：</label>
                        <input  type="text" id="date" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 110px; height: 28px; float: left; margin-top: 15px;" />
                        <ul class="selectHour">
                            <li>
                                <button id="button08" type="button" onclick="selectData('08')">08:00</button></li>
                            <li>
                                <button id="button20" type="button" onclick="selectData('20')">20:00</button></li>
                        </ul>
                        <label style="line-height: 45px; text-align: right; width: 70px; color: #0094e7; height: 45px; display: inline-block;font-family:微软雅黑;font-size: 16px;margin-left: 30px;">预报员：</label>
                        <select id="cbUser" style="width: 100px;border: 1px solid #ccc;text-align: center;height: 28px; border-radius: 4px;"">
                        </select>        
                        <div class="col-xs-3" style="width: 110px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                            <div class="form-group" style="width: 30px;">
                                <input value="" id="passwad" type="password" class="form-control" style="padding-left: 17px; background: url(../../Images/mima.png) no-repeat 0,0; width: 360%; height: 28px; display: inline-block; line-height: 10px;" />
                            </div>
                        </div>
                        <button id="publishPre" type="button" onclick="realase()" >预览发布</button>
                    </div>
                    <div class="Month_forecast1">
                        <div class="month_detail1">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="width:100%;height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;"><input type="text" value="" class="title1" style="height:100%;width:100%;background-color:transparent;border:none" /></label>
                            </div>
                            <textarea id="month_detail1" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color: #aaa; margin: 5px 0px 5px 12px;">
                            </textarea>
                        </div>
                    </div>
                    <div class="Month_forecast2">
                        <div class="month_detail2">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="width:100%;height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;"><input type="text" value=""  class="title2" style="height:100%;width:100%;background-color:transparent;border:none" /></label>
                            </div>
                            <textarea id="month_detail2" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color: #aaa; margin: 5px 0px 5px 12px;">
                            </textarea>
                        </div>
                    </div>
                    <div class="Month_forecast3">
                        <div class="month_detail3">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="width:100%;height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;"><input type="text" value="" class="title3"  style="height:100%;width:100%;background-color:transparent;border:none" /></label>
                            </div>
                            <textarea id="month_detail3" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color: #aaa; margin: 5px 0px 5px 12px;">
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
            <%--预览发布显示页面--%>
            <div class="row previewPage" style="display:none;margin: 0px;">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin: 10px 0px 0px 345px; padding: 0;">
                    <span class="back" onclick="backTo_edit()">返回</span>
                    <div class="previewContainer">
                        <h1 style="color: red; font-weight: bold; margin-bottom: 50px; font-size: 40px;">海口市天气预报</h1>
                        <div class="copyright" style="position:relative;width:100%;height:30px;">
                            <span style="position: absolute; left: 20px;">海口市气象局</span><span style="position: absolute; right: 10px;">电话：65821333</span>
                            <div style="position: absolute;width:100%;top:30px;"></div>
                        </div>
                        <h3 style="font-weight: bold; margin-bottom:40px;"></h3>
                        <div class="cont1">
                            <span class="title"></span>
                            <p></p>
                        </div>
                        <div class="cont2">
                            <span class="title"></span>
                            <p></p>
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>
                        <div class="cont3">
                            <span class="title"></span>
                            <p></p>
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>
                        <span class="release_time"></span>
                        <a class="releaseReport" onclick="releaseReport()">发布</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
