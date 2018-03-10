<%@ Page Language="C#" MasterPageFile="~/Page/MainForm.Master"  AutoEventWireup="true" CodeBehind="SpringForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.SpringForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <link href="../Style/PageStyle/SpringForecast.css?0.01" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Script/bootstrap-3.3.5/js/bootstrap.js"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script> 
    <script src="../Script/PageScript/SpringForecast.js?0.07" type="text/javascript"></script>
    <%--<script src="../Script/PageScript/SpecialReportCommon.js" type="text/javascript"></script>--%>
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
                    <%--2017年春运天气总趋势预测--%>
                    <div class="trend_predict">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label id="trend_predict_title" style="height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">2017年春运天气总趋势预测</label><p style="font-family:微软雅黑;font-size:12px;color:red;">（注意：该段落为可选段落，当内容为空时该段落将不显示！）</p>
                         </div>
                        <textarea id="trend_predict" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#aaa; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                    <%--未来三天春运天气预报--%>
                    <div class="nextThreeday_forecast">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label id="threeday_forecast_title" style="height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">未来三天春运天气预报</label>
                         </div>
                        <div style="width:100%;height:256px;display:inline-block;padding:10px;position:relative">
                            <div style="width: 33%; height: 100%; display: inline-block;">
                                <label id="weatherpartVal_title" style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px; margin-bottom: 0">未来3天天气预报</label>
                                <textarea id="weatherpartVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 232px; width: 99.5%; border-color: #aaa; display: inline-block; margin-left: 1px;">
                                </textarea>
                            </div>
                           <div style="width: 33%; height: 100%; display: inline-block;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px; margin-bottom: 0">未来三天交通气象预报 — 主要交通路段</label>
                                <textarea id="trafficpartVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 232px; width: 99.5%; border-color: #aaa; display: inline-block; margin-left: 1px;">
                                </textarea>
                            </div>
                            <div style="width: 33%; height: 100%; display: inline-block;">
                                <label style="height: 30px; color: #FFFFFF; padding-left: 15px; width: 100%; line-height: 28px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px; margin-bottom: 0">未来三天交通气象预报 — 琼州海峡</label>
                                <textarea id="qiongzhoupartVal" style="overflow: auto; font-size: 14px; line-height: 24px; height: 232px; width: 99.5%; border-color: #aaa; display: inline-block; margin-left: 1px;">
                                </textarea>
                            </div>
                        </div>
                        <div class="foot">
                            <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd; background: #2eb1e8; border-top-left-radius: 7px; border-top-right-radius: 7px;">
                                <label style="height: 40px; color: #FFFFFF; margin-left: 15px; width: 500px; line-height: 38px; display: inline-block; font-family: 微软雅黑; font-size: 15px; font-weight: bold;">未来3天天气预报&nbsp;&nbsp;&nbsp;&nbsp;数据来源：格点预报，仅供预报员参考</label>
                            </div>
                            <div style="margin-left: 5px; margin-top: 5px; width: 99%; font-family: 微软雅黑; border: 2px solid #bde2f9; background: linear-gradient(to bottom, #D4EBFF, #B5DDFF); height: 36px;">
                                <label class="eroupe">时间</label>
                                <label class="skystate">天空状况</label>
                                <label class="temp">温度</label>
                                <label class="landwindx">陆地风向</label>
                                <label class="landwindl">陆地风力</label>
                                <label class="seawindx">近海海面风向</label>
                                <label class="seawindl">近海海面风力</label>
                            </div>
                            <%--欧洲中心 1天--%>
                            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 92px; border: 1px solid #ddd;">
                                <div style="width: 6%; height: 70px; display: inline-block; margin-left: 10px; float: left;margin-top: 15px;">
                                    <span id="date01" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                                </div>                                
                                <%--天空状况--%>
                                <div style="float: left; width: 9%; height: 68px; display: inline-block;margin-top: 10px;">
                                    <div style="height: 68px; width: 48%; display: inline-block;">
                                        <label style="height: 70px; width: 100%; display: inline-block;">
                                            <img id="oneday01-img1" class="Imghover" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="../Images/tq/01.png" />
                                        </label>
                                    </div>
                                    <img id="oneday01-img2" class="Imghover" style="width: 48%; height: 68px;" src="../Images/tq/01.png" />
                                </div>
                                <div style="float: left; width: 28%; height: 68px; display: inline-block; margin-left: 5px;margin-top: 10px;">
                                    <input id="oneday01-Ctext" style="margin-top: 4px; width: 98%; height: 60px; display: inline-block;" value="" />
                                </div>
                                <%--温度--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ectemp01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">25-30</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left01-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right01-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--陆地风向--%>
                                <div style="float: left; width: 12.5%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindfx01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
                                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
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
                                <%--陆地风力--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindli01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left01-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right01-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--近海海面风向--%>
                                <div style="float: left; width: 12%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecseawindfx01" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
                                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                                        <select id="seawindfx01" style="border: 1px solid #ccc;">
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
                                <%--近海海面风力--%>
                                <div style="float: left; width: 11%; height: 70px; display: inline-block;">
                                    <label id="seawindli01" style="display: inline-block; width: 100%; height: 20px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 30px;">
                                        <input id="left01-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right01-seawindli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 20px;">
                                        <span>阵风</span>
                                        <input id="gust01-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>级</span>
                                    </label>
                                </div>
                            </div>

                            <%--欧洲中心 2天--%>
                            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 92px; border: 1px solid #ddd;">
                                <div style="width: 6%; height: 70px; display: inline-block; margin-left: 10px; float: left; margin-top: 15px;">
                                    <span id="date02" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                                </div>                               
                                <%--天空状况--%>
                                <div style="float: left; width: 9%; height: 68px; display: inline-block;margin-top: 10px;">
                                    <div style="height: 68px; width: 48%; display: inline-block;">
                                        <label style="height: 70px; width: 100%; display: inline-block;">
                                            <img id="oneday02-img1" class="Imghover" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="../Images/tq/01.png" />
                                        </label>
                                    </div>
                                    <img id="oneday02-img2" class="Imghover" style="width: 48%; height: 68px;" src="../Images/tq/01.png" />
                                </div>
                                <div style="float: left; width: 28%; height: 68px; display: inline-block; margin-left: 5px;margin-top: 10px;">
                                    <input id="oneday02-Ctext" style="margin-top: 4px; width: 98%; height: 60px; display: inline-block;" value="" />
                                </div>
                                <%--温度--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ectemp02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">25-30</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left02-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right02-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--陆地风向--%>
                                <div style="float: left; width: 12.5%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindfx02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
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
                                <%--陆地风力--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindli02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left02-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right02-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--近海海面风向--%>
                                <div style="float: left; width: 12%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecseawindfx02" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
                                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                                        <select id="seawindfx02" style="border: 1px solid #ccc;">
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
                                <%--近海海面风力--%>
                                <div style="float: left; width: 11%; height: 70px; display: inline-block;">
                                    <label id="seawindli02" style="display: inline-block; width: 100%; height: 20px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 30px;">
                                        <input id="left02-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right02-seawindli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 20px;">
                                        <span>阵风</span>
                                        <input id="gust02-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>级</span>
                                    </label>
                                </div>
                            </div>
                            <%--欧洲中心 3天--%>
                            <div style="background: #F0F7FB; margin-left: 5px; width: 99%; margin-top: 10px; height: 92px; border: 1px solid #ddd;">
                                <div style="width: 6%; height: 70px; display: inline-block; margin-left: 10px; float: left;margin-top: 15px;">
                                    <span id="date03" style="width: 100%; display: inline-block; margin-top: 20px; font-weight: bold; text-align: center;">8/10</span>
                                </div>                               
                                <%--天空状况--%>
                                <div style="float: left; width: 9%; height: 68px; display: inline-block;margin-top: 10px;">
                                    <div style="height: 68px; width: 48%; display: inline-block;">
                                        <label style="height: 70px; width: 100%; display: inline-block;">
                                            <img id="oneday03-img1" class="Imghover" style="cursor: pointer; border: 1px solid #B2CCB2; width: 100%; height: 70px;" src="../Images/tq/01.png" />
                                        </label>
                                    </div>
                                    <img id="oneday03-img2" class="Imghover" style="width: 48%; height: 68px;" src="../Images/tq/01.png" />
                                </div>
                                <div style="float: left; width: 28%; height: 68px; display: inline-block; margin-left: 5px;margin-top: 10px;">
                                    <input id="oneday03-Ctext" style="margin-top: 4px; width: 98%; height: 60px; display: inline-block;" value="" />
                                </div>
                                <%--温度--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ectemp03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">25-30</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left03-Temp1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right03-Temp2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--陆地风向--%>
                                <div style="float: left; width: 12.5%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindfx03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
                                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
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
                                <%--陆地风力--%>
                                <div style="float: left; width: 10%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecwindli03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 35px;">
                                        <input id="left03-windli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right03-windli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                </div>
                                <%--近海海面风向--%>
                                <div style="float: left; width: 12%; height: 70px; display: inline-block;margin-top: 10px;">
                                    <label id="Ecseawindfx03" style="display: inline-block; width: 100%; height: 35px; text-align: center; line-height: 35px; color:red;">东北</label>
                                    <label style="display: inline-block; width: 100%; height: 35px; text-align: center;">
                                        <select id="seawindfx03" style="border: 1px solid #ccc;">
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
                                <%--近海海面风力--%>
                                <div style="float: left; width: 11%; height: 70px; display: inline-block;">
                                    <label id="seawindli03" style="display: inline-block; width: 100%; height: 20px; text-align: center; line-height: 35px; color:red;">2-3</label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 30px;">
                                        <input id="left03-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>-</span>
                                        <input id="right03-seawindli2" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                    </label>
                                    <label style="text-align: center; display: inline-block; width: 100%; height: 20px;">
                                        <span>阵风</span>
                                        <input id="gust03-seawindli1" style="display: inline-block; width: 28px; height: 20px; border: 1px solid #aaa; border-radius: 3px; text-align: center;" type="text" value="" />
                                        <span>级</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <%--未来4～7天全省天气趋势预报--%>
                    <div class="nextFourtoSeven">
                        <div style="width: 100%; height: 40px; border-bottom: 1px solid #ddd;background: #2eb1e8;border-top-left-radius: 7px;border-top-right-radius: 7px;">
                            <label id="nextFourtoSeven_title" style="height: 40px; color: #FFFFFF; margin-left: 15px; line-height: 38px; display: inline-block;font-family:微软雅黑;font-size:15px;font-weight:bold;">未来4～7天全省天气趋势预报</label>
                         </div>
                        <textarea id="nextFourtoSeven" style="overflow: auto; font-size: 14px; line-height: 24px; height: 126px; width: 98%; border-color:#aaa; margin: 5px 0px 5px 12px;">
                        </textarea>
                    </div>
                </div>
            </div>

            <div class="xuanfu" style="display: none;">
                <div class="typetitle" style="border-bottom: 1px dashed green; width: 820px; height: 25px; background: linear-gradient(to bottom, #D4EBFF, #B5DDFF); position: fixed;">
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
                        <label id="twelenve01-11" onmouseout="out('twelenve01-11')" onmouseover="over('twelenve01-11')" style="cursor: pointer; font-size: 14px; width: 700px; display: inline-block;">晴(Fine)</label>
                    </div>
                </div>

                <div style="width: 800px; height: 80px; border-bottom: 1px solid #ddd;">
                    <div style="float: left; width: 100px; height: 80px;">
                        <img style="margin-left: 25px;" src="../../Images/tq/12.png" />
                    </div>
                    <div>                        
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

            <%--预览发布显示页面--%>
            <div class="row previewPage" style="display:none;margin:0;">
                <div class="col-lg-9 col-md-9 col-sm-9" style="margin:10px 0px 0px 380px;padding:0;">
                    <span class="back" onclick="backTo_edit()">返回</span>
                    <div class="previewContainer">
                        <h1 style="color:red;font-weight:bold;margin-bottom:30px;">春运天气趋势预报</h1>
                        <span style="display:block; font-size: 18px; font-weight: bold;">
                            <span id="MessYear">2018</span>年第<span id="numid">1</span>期
                        </span>
                        <div class="copyright" style="position:relative"><span style="position:absolute;left:10px; font-size: 18px; font-weight: bold;">海口市气象局</span><span style="margin-right:-82%; font-size: 18px; font-weight: bold;">签发人：<span id="publisher"></span></span></div>
                        <h3 style="margin:20px 0px 40px 0px;font-weight:bold">海口市春运天气预报</h3>
                        <div class="cont1" style="display:block;">
                            <span class="title" style="display:block;margin-bottom:5px;font-size: 18px;"></span>
                            <p></p>
                        </div>
                        <div class="cont2">
                            <span class="title" style="display: block; margin-bottom: 5px;font-size: 18px;"></span>

                            <b style="margin-bottom: 5px;"></b>
                            <p></p>
                            <div id="biaoge" style="margin-bottom: 15px;"></div>
                            <b style="margin-bottom: 5px;font-size: 18px;"></b>
                            <span style="margin-top:10px;font-size: 18px;"></span>
                            <p></p>
                            <span style="font-size: 18px;"></span>
                            <p></p>
                        </div>
                        <div class="cont3">
                            <span class="title" style="display:block;margin-bottom:5px;font-size: 18px;"></span>
                            <p></p>
                        </div>
                        <b class="release_time" style="font-size: 18px;">二0一七年一月十二日</b>                       
                        <p style="text-align:left;margin-top:100px;border-top:1px solid #000;padding-top:10px;font-size: 16px;">报：市委、市人大、市政府、市政协，市“三防”办、市国土局、市海洋厅、市民政局、市农业局、市林业局、市卫生局、市交通和港航管理局、市教育局、市旅游局、市水务局、市水文局、市春运办。</p><br />
                        <a class="releaseReport">发布</a>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</asp:Content>