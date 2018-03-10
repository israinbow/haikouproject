<%@ Page Title="" Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="tenday_Forecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.tenday_Forecast" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../Script/PageScript/tenForeace.js?v0.07" type="text/javascript"></script>
      <link href="../Style/PageStyle/tenForeace.css?v0.0.02" rel="stylesheet" type="text/css" />
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script> 
     <script src="../Script/time/ToolsDateTime.js"></script>
    <script src="../Script/util/common.js"></script>

   
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
<div id="allContent" style="margin-left: 320px;">
     <input id="Hiddimg1" type="hidden" value="" />
     <input id="Hiddimg2" type="hidden" value="" />
     <div style="background:#F0F8FF;height:10px;"></div>
    <%--公益预报页面头部--%>
    <div class="top">
        <label style="line-height: 45px; text-align: right; height: 45px; color: #0094e7; width: 100px; display: inline-block;float: left;font-family:微软雅黑;font-size: 16px;">预报时段：</label>
        <input onchange="dateHandle()" type="text" id="date" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 110px; height: 28px;float: left;margin-top: 9px;" />
        <ul>
            <li>
                <button id="button06" type="button" onclick="selectData('00')">08:00</button></li>
            <li> 
                <button id="button16" type="button" onclick="selectData('20')">20:00</button></li>
        </ul>
              
        <label style="line-height: 45px; text-align: right; width: 70px; color: #0094e7; height: 45px; display: inline-block;font-family:微软雅黑;font-size: 16px;margin-left: 30px;">预报员：</label>
        <select id="cbUser" style="width: 100px;border: 1px solid #ccc;text-align: center;height: 28px; border-radius: 4px;""></select>        
        <div class="col-xs-3" style="width: 110px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
            <div class="form-group" style="width: 30px;">
                <input value="" id="passwad" type="password" class="form-control" style="padding-left: 17px; background: url(../../Images/mima.png) no-repeat 0,0; width: 360%; height: 28px; display: inline-block; line-height: 10px;" />
            </div>
        </div>
        <button id="publishpreview" type="button" class="btn btn-primary" onclick="realase()" >预览发布</button>
        <%--<button id="luruResult" type="button" class="btn btn-primary"  onclick="GetluruResult()">读取06:00录入结果</button>
        <button id="readforecast" type="button" class="btn btn-primary" onclick="ReadValueForease()">读取数值预报</button>--%>
    </div>
    <%--公益预报页面中间部分--%>
    <div class="CenterContent" style="width: 93%;">
        <div class="center-left">
            <div class="weatherReview">
                <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                    <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">天气回顾</label>
                </div>
                <textarea id="weatherValue" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 96%; border-color:#058dde; margin: 5px 0px 5px 12px;"></textarea>
            </div>
            <div class="weatherProspect">
                <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                    <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 100px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">天气展望</label>
                </div>
                <textarea id="weatherFuture" style="font-size: 14px; line-height: 24px; height: 126px; width: 96%;border-color:#058dde; margin: 5px 0px 5px 12px;"></textarea>
            </div>
        </div>
        <div class="center-right">
            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <label id="nameil" style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 96%; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">今天早晨至傍晚（6-20时）天气预测&nbsp;&nbsp;&nbsp;&nbsp;(数据来源：格点预报，仅供预报员参考)</label>
            </div>
            <div>
                <div style="height: 60px; margin-top: 15px">
                    <label id="dateser01" style="margin-left: 15px; color: Red; font-size: 14px;">逐6小时雨量（mm）08-14:</label>
                    <div class="col-xs-3" style="width: 30px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 30px;">
                            <input type="text" value="0" id="rainoneHour" class="form-control" style="display: inline-block; width: 100%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>
                    <label id="dateser02" style="color: Red; font-size: 14px; margin-left: 5px;">14-20:</label>
                    <div class="col-xs-3" style="width: 30px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 30px;">
                            <input type="text" value="0" id="raintwoHour" class="form-control" style="display: inline-block; width: 100%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>

                    <label id="dateser03" style="color: Red; font-size: 14px; margin-left: 5px;">20-02:</label>
                    <div class="col-xs-3" style="width: 30px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 30px;">
                            <input type="text" value="0" id="rainthreeHour" class="form-control" style="display: inline-block; width: 100%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>

                    <label id="dateser04" style="color: Red; font-size: 14px; margin-left: 5px;">02-08:</label>
                    <div class="col-xs-3" style="width: 30px; height: 25px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 30px;">
                            <input type="text" value="0" id="rainfourHour" class="form-control" style="display: inline-block; width: 100%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>
                </div>
                <div style="float: left;width:100%;">
                    <div style="width: 60%; float: left;">
                        <div style="height: 60px;">
                            <label style="margin-left: 15px; font-size: 14px;">天气状况（英文）</label>
                            <input id="english" type="text" style="width: 64%; height: 25px; border: 1px solid #aaa; color: #0094e7;" value="" />
                        </div>
                    </div>

                    <div style="width:35%; height: 120px; float: left;">
                        <div>
                            <label class="weatherTip0" style="font-size: 14px;"></label>
                            <label class="weatherTip1" style="margin-left: 10px; font-size: 14px;"></label>
                            <label id="cityId" style="font-size: 14px; float: right;">电视台图标</label>
                        </div>
                        <div style="height: 80px;margin-top: 10px;">
                            <img id="ye" onclick="choiseWeath('ye')" style="width: 50px; height: 70px; margin-top: 12px; border: 1px solid #B2CCB2; cursor: pointer;" src="" />
                            <img id="bai" onclick="choiseWeath('bai')" style="width: 50px; height: 70px; margin-top: 12px; margin-left: 10px; border: 1px solid #B2CCB2; cursor: pointer;" src="" />
                            <img id="cityImg" onclick="choiseWeath('cityImg')" style="width: 50px; height: 70px; margin-top: 12px; margin-left: 10px; border: 1px solid #B2CCB2; cursor: pointer; float: right;" src="" />
                        </div>
                    </div>
                </div>
                <div style="margin-left: 15px; float: left; margin-top: -75px;width:60%">
                    <input id="chinese" type="text" style="height: 80px; width: 92%; border: 1px solid #aaa; color: #0094e7;" value="" />
                </div>
                <div style="height: 50px; margin-top: 150px;">
                    <label style="margin-left: 15px; font-size: 14px; display: inline-block; width: 57px; height: 35px; line-height: 35px;">火险警告</label>
                    <select id="fire" style="color: #34495e; border-radius: 3px; height: 30px; width: 10%; border: 1px solid #ccc; text-align: center;">
                        <option>请选择...</option>
                        <option>五级</option>
                        <option>四级</option>
                        <option>三级</option>
                        <option>无</option>
                    </select>
                    <label style="margin-left: 15px; font-size: 14px; display: inline-block; width: 85px; height: 35px; line-height: 35px;">高温中暑等级</label>
                    <select id="Hightemp" style="color: #34495e; border-radius: 3px; height: 30px; width: 26%; border: 1px solid #ccc; text-align: center;">
                        <option>请选择...</option>
                        <option>一级：气温较高，可能导致中暑</option>
                        <option>二级：高温天气，较易发生中暑</option>
                        <option>三级：高温炎热持续，容易发生中暑</option>
                        <option>四级：气温极高，极易发生中暑</option>
                    </select>

                    <label style="margin-left: 15px; font-size: 14px; display: inline-block; width: 112px; height: 35px; line-height: 35px;">一氧化碳中毒等级</label>
                    <select id="CO1" style="color: #34495e; border-radius: 3px; height: 30px; width: 10%; border: 1px solid #ccc; text-align: center;">
                        <option>请选择...</option>
                        <option>一级</option>
                        <option>二级</option>
                        <option>三级</option>
                        <option>四级</option>
                    </select>
                    
                </div>

                <div>
                    <label style="margin-left: 15px; font-size: 14px; display: inline-block; width: 6%; height: 35px; line-height: 35px;">温度</label>
                    <div class="col-xs-3" style="width: 40px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 35px;">
                            <input type="text" value="" id="mintemp" placeholder="" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>                    
                    <span style="font-size: 14px;">℃&nbsp;-</span>
                    <div class="col-xs-3" style="width: 40px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 35px;">
                            <input type="text" value="" id="maxtemp" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>                    
                    <span style="font-size: 14px;">℃</span>
                    <label style="text-align: center; margin-left: 6%; font-size: 14px; display: inline-block; width: 8%; height: 35px; line-height: 35px;">风力</label>
                    <div class="col-xs-3" style="width: 50px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group">
                            <input type="text" value="" id="windli" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>                    
                    <span style="text-align: center; font-size: 14px;">级</span>
                    <label style="text-align: center; margin-left: 6%; font-size: 14px; display: inline-block; width: 8%; height: 35px; line-height: 35px;">阵风</label>
                    <div class="col-xs-3" style="width: 50px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group">
                            <input type="text" value="" id="zhenwind" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>
                    <span style="text-align: center; font-size: 14px;">级</span>
                    
                </div>    
                
                <div style="margin-top:15px;">
                    <label style="text-align: center; margin-left: 10px; font-size: 14px; display: inline-block; width: 35px; height: 35px; line-height: 35px;">风向</label>
                    <select id="windleft" style="color: #34495e; border-radius: 3px; height: 30px; width: 10%; border: 1px solid #ccc; text-align: center;">
                        <option>请选择...</option>
                        <option>东北</option>
                        <option>东</option>
                        <option>东南</option>
                        <option>南</option>
                        <option>西南</option>
                        <option>西</option>
                        <option>西北</option>
                        <option>北</option>
                    </select>
                    <span style="font-size: 14px;">转</span>
                    <select id="windright" style="color: #34495e; border-radius: 3px; height: 30px; width: 10%; border: 1px solid #ccc; text-align: center;">
                        <option>请选择...</option>
                        <option>东北</option>
                        <option>东</option>
                        <option>东南</option>
                        <option>南</option>
                        <option>西南</option>
                        <option>西</option>
                        <option>西北</option>
                        <option>北</option>
                    </select>
                    <label style="margin-left: 5%; font-size: 14px; display: inline-block; width: 10%; height: 35px; line-height: 35px;">相对湿度</label>
                    <div class="col-xs-3" style="width: 40px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 35px;">
                            <input type="text" value="" id="minHumidity" placeholder="" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;"/>
                        </div>
                    </div>
                    <span style="font-size: 14px;">%&nbsp;-</span>
                    <div class="col-xs-3" style="width: 40px; height: 30px; float: none; display: inline-block; padding-left: 0px;">
                        <div class="form-group" style="width: 35px;">
                            <input type="text" value="" id="maxHumidity" class="form-control" style="display: inline-block; width: 120%; height: 30px; padding: 0px 0px; text-align: center;" />
                        </div>
                    </div>
                    <span style="font-size: 14px;">%</span>
                </div>           
            </div>
    </div>
    <%--公益预报页面底部--%>
        <div class="foot">
            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 500px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">未来10天预报&nbsp;&nbsp;&nbsp;&nbsp;数据来源：格点预报，仅供预报员参考</label>
            </div>
            <div style="margin-left: 5px;margin-top:5px; width: 99%;font-family:微软雅黑;border: 2px solid #bde2f9; background: linear-gradient(to bottom, #D4EBFF, #B5DDFF); height: 30px;">
                <label class="eroupe">格点数据预报</label>
                <label class="temp">温度</label>
                <label class="windx">风向</label>
                <label class="windl">风力</label>
                <label class="reality">相对湿度</label>
                <label class="rain">降雨量</label>
            </div>
            <%--欧洲中心 1天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date01" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week01" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday01-img1" class="Imghover" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday01-img2" class="Imghover" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday01-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday01-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left01-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right01-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width:100%; height: 35px; text-align: center;">
                        <select id="windfx01" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left01-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right01-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 70px; text-align: center; line-height: 70px;">
                        <input id="left01-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right01-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue01-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <div style="width: 23px; height: 25px; display: inline-block;">
                            <select id="rainValue01" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue01')">
                            </select>
                        </div>
                    </label>
                </div>
            </div>
            <%--欧洲中心 2天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date02" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week02" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 50px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday02-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday02-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday02-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday02-text" style="width:  98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left02-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right02-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx02" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left02-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right02-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 70px; text-align: center; line-height: 70px;">
                        <input id="left02-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right02-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue02-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue02" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue02')">
                        </select>
                    </label>
                </div>



            </div>
            <%--欧洲中心 3天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date03" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week03" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday03-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday03-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday03-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday03-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left03-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right03-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 110px; height: 35px; text-align: center;">
                        <select id="windfx03" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left03-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right03-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 70px; text-align: center; line-height: 70px;">
                        <input id="left03-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right03-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue03-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue03" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue03')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 4天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date04" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week04" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday04-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday04-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday04-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday04-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp04" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left04-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right04-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx04" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx04" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli04" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left04-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right04-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 50px; text-align: center; line-height: 70px;">
                        <input id="left04-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right04-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue04-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue04" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue04')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 5天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date05" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week05" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday05-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday05-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday05-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday05-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp05" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left05-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right05-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx05" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx05" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli05" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left05-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right05-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 50px; text-align: center; line-height: 70px;">
                        <input id="left05-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right05-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue05-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue05" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue05')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 6天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date06" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week06" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday06-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday06-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday06-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday06-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp06" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left06-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right06-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx06" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx06" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli06" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left06-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right06-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 50px; text-align: center; line-height: 70px;">
                        <input id="left06-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right06-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue06-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue06" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue06')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 7天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 70px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date07" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week07" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday07-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday07-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday07-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday07-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp07" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left07-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right07-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx07" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx07" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli07" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left07-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right07-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 50px; text-align: center; line-height: 70px;">
                        <input id="left07-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right07-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue07-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue07" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue07')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 8天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 50px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date08" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week08" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday08-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday08-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday08-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday08-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp08" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left08-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right08-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block; line-height: 35px;">
                    <label id="Ecwindfx08" style="display: inline-block; width: 100%; height: 35px; text-align: center;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx08" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli08" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left08-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right08-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 50px; text-align: center; line-height: 70px;">
                        <input id="left08-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right08-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue08-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue08" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue08')">
                        </select>
                    </label>
                </div>
            </div>
            <%--欧洲中心 9天--%>
            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 70px; border: 1px solid #ddd;">
                <div style="width: 5%; height: 50px; display: inline-block; margin-left: 10px; float: left;">
                    <span id="date09" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                    <span id="week09" style="width: 100%; text-align: center; display: inline-block;">Sum</span>
                </div>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label style="height: 70px; width: 43%; display: inline-block;">
                        <img id="oneday09-img1" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="" />
                    </label>
                    <img id="oneday09-img2" style="width: 43%; height: 70px;" src="../Images/tq/01.png" />
                </div>
                <div style="float: left; width: 34%; height: 70px; display: inline-block;">
                    <input id="oneday09-Ctext" style="margin-top: 4px; width: 98%; height: 30px; display: inline-block;" value="CN:" />
                    <input id="oneday09-text" style="width: 98%; height: 30px; display: inline-block; margin-top: 2px;" value="EN:" />
                </div>
                <%--温度--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ectemp09" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">25-30</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left09-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right09-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--风向--%>
                <div style="float: left; width: 10%; height: 70px; display: inline-block;">
                    <label id="Ecwindfx09" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">东北</label>
                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                        <select id="windfx09" style="border: 1px solid #ccc;">
                            <option>无</option>
                            <option>东北</option>
                            <option>东</option>
                            <option>东南</option>
                            <option>南</option>
                            <option>西南</option>
                            <option>西</option>
                            <option>西北</option>
                            <option>北</option>
                        </select>
                    </label>
                </div>
                <%--风力--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block;">
                    <label id="Ecwindli09" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px;">2-3</label>
                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                        <input id="left09-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right09-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--相随湿度--%>
                <div style="float: left; width: 15%; height: 70px; display: inline-block;">
                    <label style="display: inline-block; width: 100%; height: 70px; text-align: center; line-height: 70px;">
                        <input id="left09-Humidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                        <span>-</span>
                        <input id="right09-maxHumidity" style="line-height: 20px; display: inline-block; width: 35px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                    </label>
                </div>
                <%--降雨量--%>
                <div style="float: left; width: 7%; height: 70px; display: inline-block; text-align: center;">
                    <label style="display: inline-block; padding-top: 20px;">
                        <input id="rainValue09-edit" value="" style="width: 50px; height: 25px; border: 1px solid #aaa; border-radius: 3px; text-align: center;"/>
                        <select id="rainValue09" style="border: 1px solid #ccc; line-height: 70px; height: 25px; display: inline-block; width: 23px;" onchange="selerainValue('rainValue09')">
                        </select>
                    </label>
                </div>
            </div>
        </div>
    </div>
    </div>
    <div class="xuanfu" style="display: none;">
        <div style="border-bottom: 1px dashed green; width: 820px; height: 25px; background: linear-gradient(to bottom, #D4EBFF, #B5DDFF); position: fixed;">
            <label class="leixing">天气类型</label>
            <img onclick="onblue()" style="cursor: pointer; position: absolute; top: 4px; right: 15px;" src="../../Images/SelClose.png" />
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd; margin-top: 40px;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="01" style="margin-left: 25px;" src="../../Images/tq/01.png" />
            </div>
            <div>
                <label id="one01-01" onmouseout="out('one01-01')" onmouseover="over('one01-01')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气晴朗，阳光强烈(Sunny and sun-drenched)</label>
                <label id="one02-01" onmouseout="out('one02-01')" onmouseover="over('one02-01')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气晴朗，秋高气爽(Sunny and refreshing)</label>
                <label id="one03-01" onmouseout="out('one03-01')" onmouseover="over('one03-01')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气晴朗(Sunny)</label>
                <label id="one04-01" onmouseout="out('one04-01')" onmouseover="over('one04-01')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气晴朗(Sunny and dry)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="02" style="margin-left: 25px;" src="../../Images/tq/02.png" />
            </div>
            <div>
                <label id="two01-02" onmouseout="out('two01-02')" onmouseover="over('two01-02')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大致天晴，阳光充足(Mainly fine with plenty of sunshine)</label>
                <label id="two02-02" onmouseout="out('two02-02')" onmouseover="over('two02-02')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">晴间少云，阳光强烈，空气干燥(Dry and sun-drenched, with some cloud)</label>
                <label id="two03-02" onmouseout="out('two03-02')" onmouseover="over('two03-02')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">晴间少云，大气通透，空气干燥(Clear and fine with some cloud and dry air)</label>
            </div>
        </div>


        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="02_2" style="margin-left: 25px;" src="../../Images/tq/02_2.png" />
            </div>
            <div>
                <label id="three01-02_2" onmouseout="out('three01-02_2')" onmouseover="over('three01-02_2')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">多云，大部分时间可见阳光(Cloudy, mostly sunny)</label>
                <label id="three02-02_2" onmouseout="out('three02-02_2')" onmouseover="over('three02-02_2')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">多云，大部分时间可见阳光 ，早晚有轻雾(Cloudy, mostly sunny, with light fog in the morning and evening)</label>
                <label id="three03-02_2" onmouseout="out('three03-02_2')" onmouseover="over('three03-02_2')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">多云，大部分时间可见阳光 ，有轻度灰霾(Cloudy, mostly sunny, with light haze)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="03" style="margin-left: 25px;" src="../../Images/tq/03.png" />
            </div>
            <div>
                <label id="four01-03" onmouseout="out('four01-03')" onmouseover="over('four01-03')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阴天，日温差小(Overcast, with small diurnal temperature range)</label>
                <label id="four02-03" onmouseout="out('four02-03')" onmouseover="over('four02-03')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天色阴沉，偶有零星小雨(Sullen, with scattered drizzles)</label>
                <label id="four03-03" onmouseout="out('four03-03')" onmouseover="over('four03-03')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">短暂时间可见阳光，偶有零星小雨(Sunny intervals, with scattered drizzles)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="04" style="margin-left: 25px;" src="../../Images/tq/04.png" />
            </div>
            <div>
                <label id="five01-04" onmouseout="out('five01-04')" onmouseover="over('five01-04')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阵雨或雷阵雨，部分时间可见阳光(Shower or thundershower, partly sunny)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="05" style="margin-left: 25px;" src="../../Images/tq/05.png" />
            </div>
            <div>
                <label id="six01-05" onmouseout="out('six01-05')" onmouseover="over('six01-05')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">雷阵雨(Thundershower)</label>
                <label id="six02-05" onmouseout="out('six02-05')" onmouseover="over('six02-05')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">雷阵雨，部分时间雨势较大，伴有短时大风(Thundershower, heavy at times, with brief strong wind)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="06" style="margin-left: 25px;" src="../../Images/tq/06.png" />
            </div>
            <div>
                <label id="serven01-06" onmouseout="out('serven01-06')" onmouseover="over('serven01-06')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阵雨(Shower)</label>
                <label id="serven02-06" onmouseout="out('serven02-06')" onmouseover="over('serven02-06')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阵雨，短暂时间可见阳光(Shower, with sunny intervals)</label>
                <label id="serven03-06" onmouseout="out('serven03-06')" onmouseover="over('serven03-06')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阵雨，天色阴沉，部分时间雨势较大(Sullen, with shower (heavy at times))</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="07" style="margin-left: 25px;" src="../../Images/tq/07.png" />
            </div>
            <div>
                <label id="eight01-07" onmouseout="out('eight01-07')" onmouseover="over('eight01-07')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">小雨(Light rain)</label>
                <label id="eight02-07" onmouseout="out('eight02-07')" onmouseover="over('eight02-07')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">小雨，短暂时间可见阳光(Light rain, with sunny intervals)</label>
                <label id="eight03-07" onmouseout="out('eight03-07')" onmouseover="over('eight03-07')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">小雨，天色阴沉(Light rain, sullen)</label>
                <label id="eight04-07" onmouseout="out('eight04-07')" onmouseover="over('eight04-07')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">小雨，日温差小，天气阴冷(Gloomy and cold, with light rain and small diurnal temperature range)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="08" style="margin-left: 25px;" src="../../Images/tq/08.png" />
            </div>
            <div>
                <label id="nine01-08" onmouseout="out('nine01-08')" onmouseover="over('nine01-08')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">中雨(Moderate rain)</label>
                <label id="nine02-08" onmouseout="out('nine02-08')" onmouseover="over('nine02-08')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">中雨，短暂时间可见阳光(Moderate rain, with sunny intervals)</label>
                <label id="nine03-08" onmouseout="out('nine03-08')" onmouseover="over('nine03-08')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">中雨，雨势平缓、持续时间长(Steady and prolonged moderate rain)</label>
                <label id="nine04-08" onmouseout="out('nine04-08')" onmouseover="over('nine04-08')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">中雨，部分时间雨势较大(Moderate rain, heavy at times)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="09" style="margin-left: 25px;" src="../../Images/tq/09.png" />
            </div>
            <div>
                <label id="ten01-09" onmouseout="out('ten01-09')" onmouseover="over('ten01-09')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大雨(Heavy rain)</label>
                <label id="ten02-09" onmouseout="out('ten02-09')" onmouseover="over('ten02-09')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大雨，并伴有雷暴大风(Heavy rain, accompanied by thunderstorm and strong wind)</label>
                <label id="ten03-09" onmouseout="out('ten03-09')" onmouseover="over('ten03-09')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大雨，雨势平缓，持续时间长(Steady and prolonged heavy rain)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="10" style="margin-left: 25px;" src="../../Images/tq/10.png" />
            </div>
            <div>
                <label id="eleven01-10" onmouseout="out('eleven01-10')" onmouseover="over('eleven01-10')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">暴雨(Rainstorm)</label>
                <label id="eleven02-10" onmouseout="out('eleven02-10')" onmouseover="over('eleven02-10')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">暴雨，雨势猛烈，伴有雷暴和短时大风(Torrential rainstorm, accompanied by thunderstorm and brief strong wind)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="11" style="margin-left: 25px;" src="../../Images/tq/11.png" />
            </div>
            <div>
                <%--<label id="twelenve01-11" onmouseout="out('twelenve01-11')" onmouseover="over('twelenve01-11')" style="cursor: pointer;font-size: 14px;width:700px;display: inline-block;">暴雨，雨势猛烈，伴有雷暴大风等剧烈天气(Torrential rainstorm, accompanied by severe weather conditions like thunderstorm and strong wind)</label>--%>
                <label id="twelenve01-11" onmouseout="out('twelenve01-11')" onmouseover="over('twelenve01-11')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">晴(Fine)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img style="margin-left: 25px;" src="../../Images/tq/12.png" />
            </div>
            <div>
                <%--<label id="threething01-12" onmouseout="out('threething01-12')" onmouseover="over('threething01-12')" style="cursor: pointer;font-size: 14px;width:700px;display: inline-block;">晴(Fine)</label>--%>
                <label id="threething01-12" onmouseout="out('threething01-12')" onmouseover="over('threething01-12')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">少云(Partly Cloudy)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="12_2" style="margin-left: 25px;" src="../../Images/tq/12_2.png" />
            </div>
            <div>
                <label id="fourthing01-12_2" onmouseout="out('fourthing01-12_2')" onmouseover="over('fourthing01-12_2')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">多云(Cloudy)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="13" style="margin-left: 25px;" src="../../Images/tq/13.png" />
            </div>
            <div>
                <label id="fivething01-13" onmouseout="out('fivething01-13')" onmouseover="over('fivething01-13')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阵雨(Shower)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="14" style="margin-left: 25px;" src="../../Images/tq/14.png" />
            </div>
            <div>
                <label id="sixthing01-14" onmouseout="out('sixthing01-14')" onmouseover="over('sixthing01-14')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大致多云，有中度灰霾，能见度低(Mainly cloudy, with moderate haze and low visibility)</label>
                <label id="sixthing02-14" onmouseout="out('sixthing02-14')" onmouseover="over('sixthing02-14')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大致多云，有重度灰霾，能见度低(Mainly cloudy, with heavy haze and low visibility)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="15" style="margin-left: 25px;" src="../../Images/tq/15.png" />
            </div>
            <div>
                <label id="serventhing01-15" onmouseout="out('serventhing01-15')" onmouseover="over('serventhing01-15')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大致多云，潮湿多雾，能见度低(Mainly cloudy, humid, foggy, with low visibility)</label>
                <label id="serventhing02-15" onmouseout="out('serventhing02-15')" onmouseover="over('serventhing02-15')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">潮湿多雾，有回南天，能见度低(Humid, foggy, turning warm  damp, with low visibility)</label>
            </div>
        </div>

        <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 80px;">
                <img id="16" style="margin-left: 25px;" src="../../Images/tq/16.png" />
            </div>
            <div>
                <label id="eightthing01-16" onmouseout="out('eightthing01-16')" onmouseover="over('eightthing01-16')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">大致天晴，天气酷热(Mainly sunny, extremely hot)</label>
                <label id="eightthing02-16" onmouseout="out('eightthing02-16')" onmouseover="over('eightthing02-16')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">高温酷热，午后有短时阵雨(Extremely hot, with brief afternoon showe)</label>
                <label id="eightthing03-16" onmouseout="out('eightthing03-16')" onmouseover="over('eightthing03-16')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天晴酷热，中北部和人口密集区最高气温可达35℃或以上(Sunny, extremely hot, with the highest temperature of the North Central and densely populated regions hitting 35℃ or above)</label>
            </div>
        </div>

        <div style="width: 800px; height: 110px; border-bottom: 1px solid #ddd;">
            <div style="float: left; width: 100px; height: 110px;">
                <img id="17" style="margin-left: 25px;" src="../../Images/tq/17.png" />
            </div>
            <div>
                <label id="ninething01-17" onmouseout="out('ninething01-17')" onmouseover="over('ninething01-17')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阴天寒冷，短暂时间有阳光(Overcast, cold, with sunny intervals)</label>
                <label id="ninething02-17" onmouseout="out('ninething02-17')" onmouseover="over('ninething02-17')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">早晚天气寒冷，白天阳光充足(Plenty of sunshine in the daytime, cold in the morning and evening)</label>
                <label id="ninething03-17" onmouseout="out('ninething03-17')" onmouseover="over('ninething03-17')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">阴天有小雨，日温差小，天气寒冷(Overcast, light rain, with small diurnal temperature range, cold)</label>
                <label id="ninething04-17" onmouseout="out('ninething04-17')" onmouseover="over('ninething04-17')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气寒冷，北部和山区最低气温将降至10℃或以下(Cold, with the lowest temperature of the Northern and mountainous regions falling to 10℃ or below)</label>
                <label id="ninething05-17" onmouseout="out('ninething05-17')" onmouseover="over('ninething05-17')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">天气寒冷，北部和山区最低气温将降至5℃或以下(Cold, with the lowest temperature of the Northern and mountainous regions falling to 5℃ or below)</label>
            </div>
        </div>
    </div>

    <div class="realsePage" style="display: none;">
        <div class="Text">
            <div class="content">
                <div class="topTitle">
                    海口市气象台公报
                </div>
                <div class="xuhao">第<span id="yearEdit" style="color: blue;"></span>号</div>
                <div style="font-weight: bold;">一、天气回顾</div>
                <div id="weathHG" style="line-height: 30px;">&nbsp;&nbsp;</div>
                <div id="zhanwang" style="font-weight: bold;">二、今天中午到傍晚（12-20时）天气预测</div>
                <div style="line-height: 5px;">
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
                    <img id="dianshi" style="float: left; line-height: 70px; width: 50px; height: 70px; text-align: center; display: inline-block;" src="../../Images/tq/04.png" />
                    <label style="line-height: 70px; width: 120px; height: 70px; text-align: center; display: inline-block;"></label>
                    <div style="font-size: 10px;">（提示 ：天气如有变化，气象台将随时更新早晨天气预报。请注意采用最新版本）</div>
                </div>
                <div style="height: 50px; text-align: right; width: 800px; border-bottom: 2px solid red; line-height: 50px;"></div>
                <div class="footContent">预报员：<span id="foreaceUser"></span>&nbsp;&nbsp;&nbsp;&nbsp;预报值班电话：0898-65873961  通信值班电话：0898-65873961</div>
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
     <script type="text/javascript">
         $(function () {
             $("#tenday_Forecast").addClass("active");
         })
</script>
</asp:Content>
