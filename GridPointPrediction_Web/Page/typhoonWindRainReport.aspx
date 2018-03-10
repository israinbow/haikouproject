<%@ Page Language="C#" MasterPageFile="~/Page/MainForm.Master"  AutoEventWireup="true" CodeBehind="typhoonWindRainReport.aspx.cs" Inherits="GridPointPrediction_Web.Page.typhoonWindRainReport" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <link href="../Style/PageStyle/typhoonWindRainReport.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script> 
    <script src="../Script/PageScript/typhoonWindRainReport.js" type="text/javascript"></script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div>
        <div class="container-fluid box" style="padding:0;">
            <div class="row editPage" style="width:93%;margin:0">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <%--内容区域头部--%>
                    <div class="top">
                        <label style="line-height: 45px; text-align: right; height: 45px; color: #0094e7; width: 100px; display: inline-block; float: left; font-family: 微软雅黑; font-size: 16px;">预报时段：</label>
                        <input type="text" id="date" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 110px; height: 28px; float: left; margin-top: 9px;" />
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
                    <%--内容区域中间部分 
                        摘要  
                     --%>
                    <div class="summary" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">摘要</label>
                         </div>
                        <textarea id="summaryVal" style="overflow: auto;font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#058dde; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                    <%--热带风暴动态--%>
                    <div class="hot_storm" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">热带风暴动态</label>
                         </div>
                        <table class="hot_stormTable">
                            <tr>
                                <td>时    间：</td>
                                <td><input class="reportTime" type='text' value='16日 08时' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>命    名：</td>
                                <td><input class="name" type='text' value='塔拉斯' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>中心位置：</td>
                                <td><input class="middlePosition" type='text' value='北纬17.7度、东经109.6度' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>强度等级：</td>
                                <td><input class="strength" type='text' value='热带风暴' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>最大风力：</td>
                                <td><input class="windspeed" type='text' value='9级， 23米/秒（约83公里/时）' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>中心气压：</td>
                                <td><input class="middlePressure" type='text' value='992 hPa' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>参考位置：</td>
                                <td><input class="referPosition" type='text' value='距离海南省三亚市偏南方向70公里的南海海面上' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                            <tr>
                                <td>预报结论：</td>
                                <td><input class="report" type='text' value='预计，“塔拉斯”将以每小时15公里左右的速度向西偏北方向移动，即将从南部近海擦过' onblur='input_blur(this)' onfocus='input_focus(this)' /></td>
                            </tr>
                        </table>
                    </div>
                    <%--天气实况--%>
                    <div class="weather_report">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">天气实况</label>
                         </div>
                        <div style="width:100%;height:256px;display:inline-block;padding:10px">
                            <div style="width: 48.3%; height: 100%; display: inline-block;margin-right:30px;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px; margin-bottom: 0">降雨实况</label>
                                <textarea id="rainVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 232px; width: 99.7%; border-color: #aaa; display: inline-block; margin-left: 1px;">  
                                </textarea>
                            </div>
                            <div style="width: 48.3%; height: 100%; display: inline-block;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px; margin-bottom: 0">风力实况</label>
                                <textarea id="windVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 232px; width: 99.7%; border-color: #aaa; display: inline-block; margin-left: 1px;">  
                                </textarea>
                            </div>
                        </div>
                        <div>
                            <div id="previewImg" class="preview" style="height: 460px; width: 100%; margin: 0px 40px 0px 0px">
                            </div>
                            <span class="btn_choose" style="margin: 0px 0px 10px 30px;">选择图片
                                <input type="file" name="file" id="file" class="file" multiple="multiple" />
                            </span>
                        </div>
                    </div>
                    <%-- 未来三小时短临预报--%>
                    <div class="threeHour_report" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">未来三小时短临预报</label>
                         </div>
                        <textarea id="threeHour_reportVal" style="overflow: auto;font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#058dde; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                    <%--未来三天天气预报--%>
                    <div class="threeDay_report" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px;line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">未来三天天气预报</label>
                         </div>
                        <textarea id="threeDay_reportVal" style="overflow: auto;font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#058dde; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                </div>
            </div>
            <%--预览发布显示的页面--%>
            <div class="row previewPage" style="display:none;margin: 0px;">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <span class="back" onclick="backTo_edit()">返回</span>
                    <div class="previewContainer">
                        <p class="summary_cont"></p>
                        <div class="cont1">
                            <span class="title" style="display:block;margin-bottom:5px;"></span>
                            <table class="hot_stormInfo"></table>
                        </div>
                        <div class="cont2">
                            <span class="title" style="display:block;margin-bottom:5px;"></span>
                            <p></p>
                            <div class="pic1"></div>
                            <p></p>
                            <div class="pic2"></div>
                        </div>
                        <div class="cont3">
                            <span class="title" style="display:block;margin-bottom:5px;"></span>
                            <p style="text-indent:2em"></p>
                        </div>
                        <div class="cont4">
                            <span class="title" style="display:block;margin-bottom:5px;"></span>
                            <p></p>
                        </div>
                        <span class="update_time">（下一次更新时间09：15）</span>
                        <span style="margin:30px 0px 0px 380px;">海口市气象台</span>
                        <span class="release_time"></span>
                        <a class="releaseReport" onclick="releaseReport()">发布</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function close_pic() {
            $("#previewShow").html("");
        }
    </script>
</asp:Content>
