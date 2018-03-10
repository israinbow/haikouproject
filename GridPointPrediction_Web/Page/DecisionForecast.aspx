<%@ Page Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="DecisionForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.DecisionForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <link href="../Style/PageStyle/DecisionForecast.css?v0.05" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script> 
     <script src="../Script/time/ToolsDateTime.js"></script>
    <script src="../Script/PageScript/DecisionForecast.js?v0.16" type="text/javascript"></script>
    <script src="../Script/PageScript/SpecialReportCommon.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div>
        <div class="container-fluid box" style="padding:0;">
            <div class="row editPage" style="width:93%;margin:0">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <%--内容区域头部--%>
                    <div class="top">
                        <label style="line-height: 45px; text-align: right; height: 45px; color: #0094e7; width: 100px; display: inline-block; float: left; font-family: 微软雅黑; font-size: 16px;">预报时段：</label>
                        <input onchange="dateHandle()" type="text" id="date" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 110px; height: 28px; float: left; margin-top: 9px;" />
                        <ul>
                            <li>
                                <button id="button08" type="button" onclick="selectData('08')">08:00</button></li>
                            <li>
                                <button id="button20" type="button" onclick="selectData('20')">20:00</button></li>
                        </ul>
                        <div class="preview" style="float: left; margin-left: 30px;">                            
                            <ul>
                                <li>
                                    <button id="typhooninfo" type="button" onclick="selectType('typhoon')">台风</button>
                                </li>
                                <li>
                                    <button id="convectioninfo" type="button" onclick="selectType('convection')">强对流</button>
                                </li>
                                <li>
                                    <button id="coldairinfo" type="button" onclick="selectType('coldair')">冷空气</button>
                                </li>
                            </ul>
                        </div>
                        <label style="line-height: 45px; text-align: right; width: 70px; color: #0094e7; height: 45px; display: inline-block;font-family:微软雅黑;font-size: 16px;margin-left: 50px;">预报员：</label>
                        <select id="cbUser" style="width: 100px;border: 1px solid #ccc;text-align: center;height: 28px; border-radius: 4px;""></select>        
                        <div class="col-xs-3" style="width: 110px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                            <div class="form-group" style="width: 30px;">
                            <input value="" id="passwad" type="password" class="form-control" style="padding-left: 17px; background: url(../../Images/mima.png) no-repeat 0,0; width: 360%; height: 28px; display: inline-block; line-height: 10px;" />
                            </div>
                        </div>
                        <button id="publishPre" type="button" onclick="realase()" >预览发布</button>
                    </div>
                    <%--摘要、副标题--%>
                    <div style="width:100%;display: inline-block;">
                        <div style="width: 49%; display: inline-block;margin:0 16px 10px 0;">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;">摘要</label>
                            </div>
                            <div style="width: 100%; background-color: #fff;border-radius:10px;">
                                <textarea id="remark" style="overflow: auto; font-size: 14px; line-height: 22px; height: 126px; width: 95.5%; display: inline-block; border-color: #aaa; margin: 5px 0 5px 12px;">
                                </textarea>
                            </div>
                        </div>
                        <div style="width:49%;display:inline-block;">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;">副标题</label>
                            </div>
                            <div style="width: 100%; background-color: #fff;border-radius:10px;">
                                <textarea id="subhead" style="overflow: auto; font-size: 14px; line-height: 22px; height: 126px; width: 95.5%; display: inline-block; border-color: #aaa; margin: 5px 0 5px 12px;">
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <%--内容区域中间部分 
                        台风动态   
                     --%>
                    <div class="typhoon_trend" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">台风动态</label>
                         </div>
                        <div class="cont1" style="width:48%;margin:5px;display:inline-block">
                            <input class="typhoon_topic1" value="" style="display:inline-block;width: 92%; height: 25px; border: 1px solid #aaa; color: #0094e7;font-size:12px;"/>
                            <textarea id="typhoonVal1" style="overflow: auto;font-size: 14px; line-height: 22px; height: 126px; width: 92%; display:inline-block;border-color:#aaa; margin:10px 0 0 32px;">
                            </textarea>
                        </div>
                        <div class="cont2" style="width:48%;margin:5px 0 5px 0;display:inline-block">
                            <input class="typhoon_topic2" value="" style="display:inline-block;width: 92%; height: 25px; border: 1px solid #aaa; color: #0094e7;font-size:12px;"/>
                            <textarea id="typhoonVal2" style="overflow: auto;font-size: 14px; line-height: 22px; height: 126px; width: 92%; display:inline-block;border-color:#aaa; margin:10px 0 0 32px;">
                            </textarea>
                        </div>
                        <div>
                            <div id="previewImg" class="preview" style="height:460px;width:100%;margin:0px 40px 0px 0px"></div>
                            <span class="btn_choose" style="margin:0px 0px 10px 30px;">选择图片
                                <input type="file" name="file" id="file" class="file"  multiple="multiple"/>
                            </span>
                            <span class="btn_up" style="margin-bottom:10px;">上传图片</span>
                        </div>
                    </div>

                    <%--天气实况--%>
                    <div class="weather_live" style="position:relative">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">天气实况</label>
                         </div>
                        <div class="cont1" style="width:48%;margin:5px;display:inline-block">
                            <input class="weatherlive_topic1" value="" style="display:inline-block;width: 92%; height: 25px; border: 1px solid #aaa; color: #0094e7;font-size:12px;"/>
                            <textarea id="weatherliveVal1" style="overflow: auto;font-size: 14px; line-height: 22px; height: 126px; width: 92%; display:inline-block;border-color:#aaa; margin:10px 0 0 32px;">
                            </textarea>
                        </div>
                        <div class="cont2" style="width:48%;margin:5px 0 5px 0;display:inline-block">
                            <input class="weatherlive_topic2" value="" style="display:inline-block;width: 92%; height: 25px; border: 1px solid #aaa; color: #0094e7;font-size:12px;"/>
                            <textarea id="weatherliveVal2" style="overflow: auto;font-size: 14px; line-height: 22px; height: 126px; width: 92%; display:inline-block;border-color:#aaa; margin:10px 0 0 32px;">
                            </textarea>
                        </div>
                        <div>
                            <div id="previewImg2" class="preview" style="height:460px;width:100%;margin:0px 40px 0px 0px"></div>
                            <span class="btn_choose" style="margin:0px 0px 10px 30px;">选择图片
                                <input type="file" name="file" id="file2" class="file"  multiple="multiple"/>
                            </span>
                            <span class="btn_up" style="margin-bottom:10px;">上传图片</span>
                        </div>
                    </div>
                    <%--天气预报--%>
                    <div class="weather_forecast">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">天气预报</label>
                         </div>
                        <textarea id="weatherForecastVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 156px; width: 50%; border-color:#aaa; margin: 5px 0px 5px 12px;display:inline-block">
                        </textarea>
                        <div class="weatherpart" style="width:45%;height:156px;display:inline-block;margin-left:30px">
                            <div style="width:48%;height:100%;display:inline-block;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;margin-bottom:0">海洋方面</label>
                                <textarea id="seapartVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 132px; width: 99.5%; border-color: #aaa;display: inline-block;margin-left:1px;">
                                </textarea>
                            </div>
                            <div style="width:48%;height:100%;display:inline-block;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;margin-bottom:0">陆地方面</label>
                                <textarea id="landpartVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 132px; width: 99.5%; border-color: #aaa;display: inline-block;margin-left:1px;">
                                </textarea>
                            </div>
                        </div>
                    </div>
                    <%--防御建议--%>
                    <div class="defense_proposal">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label style="height: 40px; color: #FFFFFF; margin-left: 15px;width:100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">防御建议</label>
                         </div>
                        <textarea id="defense_proposal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#aaa; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                </div>
            </div>
            <%--预览发布显示的页面--%>
            <div class="row previewPage" style="display:none;margin: 0px;">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <span class="back" onclick="backTo_edit()">返回</span>
                    <div class="previewContainer">
                        <h1 style="color:red;font-weight:bold;margin-bottom:30px;">重要气象信息快报</h1>
                        <span style="display:block;">
                            <span id="MessYear">2016</span>年第<span id="numid">51</span>期
                        </span>
                        <div class="copyright" style="position:relative"><span style="position:absolute;left:10px;">海口市气象局</span><span style="margin-right:-450px;">签发人：<span id="forecaster"></span></span></div>
                        <h3 style="margin-top:20px;">暴雨和台风预警</h3>
                        <h4 style="font-weight:bold;margin-bottom:25px;" class="subheadVal"></h4>
                        <div class="remarkContainer">
                            <p style="text-align:left;text-indent:2em;"><b class="remarkTitle"></b><span class="remarkCont"></span></p>
                        </div>

                        <div class="cont1">
                            <span class="title" style="display:block;margin-bottom:5px;"></span>
                            <div class="cont">
                                <span style="margin-bottom:5px;"></span>
                                <p></p>
                                <span style="margin-bottom:5px;"></span>
                                <p></p>
                            </div>
                            <div class="typic" style="margin-left:50px;">

                            </div>
                            <p style="margin-left:180px"></p>
                        </div>
                        <div class="cont2">
                            <span class="title" style="display:block;margin-bottom:5px;margin-top:20px;"></span>
                            <div class="cont">
                                <span style="margin-bottom:5px;"></span>
                                <p></p>
                                <span style="margin-bottom:5px;"></span>
                                <p></p>
                            </div>
                             <div class="rainpic1" style="margin-left:60px;">

                            </div>
                            <p class="rainp1" style="margin-left:180px"></p>
                            <div class="rainpic2" style="margin-left:60px;">

                            </div>
                            <p class="rainp2" style="margin-left:180px"></p>
                        </div>
                        <div class="cont3">
                            <span class="title" style="display:block;margin-bottom:10px;margin-top:20px;"></span>
                            <div class="cont">
                                <p></p>
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                        <div class="cont4">
                            <span class="title" style="display:block;margin-bottom:10px;margin-top:20px;"></span>
                            <p class="cont"></p>
                        </div>
                        <b class="release_time">二0一六年十月十四日十时</b>
                        <a class="releaseReport">发布</a>
                    </div>
                </div>
            </div>
        </div>

    </div>
    
    <script>
        function close_pic() {
            $("#previewShow").html("");
        }
        function close_pic2() {
            $("#previewShow2").html("");
        }        
    </script>
</asp:Content>