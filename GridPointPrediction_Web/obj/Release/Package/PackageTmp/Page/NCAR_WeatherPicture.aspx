<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="NCAR_WeatherPicture.aspx.cs" Inherits="GridPointPrediction_Web.Page.NCAR_WeatherPicture" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
        <link href="../Style/PageStyle/ncarpicstyle.css?var02" rel="stylesheet" type="text/css" />
        <script src="../Script/PageScript/ncarpicstyle.js?31" type="text/javascript"></script>
        <link href="../Script/layui/css/layui.css" rel="stylesheet" />
        <script src="../Script/time/My97DatePicker/WdatePicker.js?var001" type="text/javascript"></script> 
        <script src="../Script/time/ToolsDateTime.js?var001" type="text/javascript"></script>
        <script src="../Script/layui/layui.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

        <div style="width:1630px;height:850px;background: #ddd;margin:auto;">
            <div style="width:1630px;height:10px;"></div>
           <%-- <div style="width:1630px;height:10px;background:#fff"></div>--%>
        <%--左--%>
            <div style="margin-left:10px;width:220px;height:830px;float:left;background:#fff;padding-top:10px;">
    <div style="width:200px;height:645px;float:left;margin-left:10px;">
        <label class="meantop">实况监测</label>
        <div class="meanil" style="width:200px;height:260px;background:#8cbee8;">
            <label id="twoTemp" class="left" style="background: rgb(189, 189, 9);">2米气温</label>
        <label id="sixrain" class="left">6小时降雨</label>
        <label id="tenwind" class="left">10米风</label>
        <label id="humit" class="left">200hpa相对湿度</label>
        <label id="temptest" class="left">温度检验</label>
        <label id="windforecast" class="left">风预报检验</label>
        <label id="humitTest" class="left">湿度检验</label>
            </div>
    </div>
                </div>
       <%-- 右--%>
            <div style="margin-left:10px; width:1380px;height:830px;display:inline-block;background:#fff;padding-top:10px;">
        <div style="width:1300px;height:810px;display:inline-block;">
            <div style="width:100%;height:30px;border-bottom: 1px solid #ddd;">
               <div id="timeDiv" style="margin-left:30px; width: 300px;height: 30px; float: left;">
            <label style="float:left;">时间</label>
              <input  onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 10px;width: 100px; height: 20px;float:left;"/>
            <%--气压--%>
                   <div id="hDiv" style="margin-left:5px; width:80px;height:30px;display:none;float:left;">
                       <select id="qiya" style="font-size:12px;">
                           <option>500hpa</option>
                           <option>700hpa</option>
                           <option>850hpa</option>
                           <option>925hpa</option>
                       </select>
            </div>
                   <div style="margin-left:5px;width:110px;height:30px;float:left;">
                   <label id="update" onclick="updatepicture('update')" class="button">更新</label>
            <label id="nowdate" onclick="updatepicture('now')" class="buttonof">最新</label>
                       </div>
                </div>
                <span style="float:left;color:#aaa;">|</span>
              <div style="margin-left:20px; width: 180px;height: 30px; float: left;">
              <div style="font-size: 15px;float: left;width: 40px;">  <label>时次</label></div>
                  <div class="Area">
            <label id="shenzhen" class="button">深圳</label>
            <label id="guangdong" class="buttonof">广东</label>
                </div>
                  </div>
                </div>
                           <%-- 图片区--%>
               <%-- 24张--%>
                <div class="minPicture" style="width:1350px;height:790px;display:inline-block;overflow-y: auto">
                    <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image01" style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image02"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image03"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                       <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image04"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image05"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image06"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image07"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image08"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image09"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image10"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image11"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image12"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image13"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image14"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image15"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image16"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image17"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image18"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image19"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image20"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image21"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>

                                           <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image22"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image23"  style="width:390px;height:390px;" src=""/>
                        </div>
                           <div style="width:400px;height:400px;display:inline-block;border: 1px solid #aaa;line-height:400px;">
                            <img id="Image24"  style="width:390px;height:390px;" src=""/>
                        </div>
                    </div>
                </div>
                 <%-- 16张--%>
            <div class="maxPicture" style="display:none;width:1350px;height:790px;overflow-y:auto;">
                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic01" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic02" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic03" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic04" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic05" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic06" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic07" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic08" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic09" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic10" src=""/>
                        </div>
                    </div>
                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic11" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic12" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic13" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic14" src=""/>
                        </div>
                    </div>

                                     <div style="width:1300px;height:400px;display:inline-block;margin-left:5px;margin-top:5px;">
                        <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic15" src=""/>
                        </div>
                           <div style="width:600px;height:400px;display:inline-block;border: 1px solid #aaa;">
                            <img id="Pic16" src=""/>
                        </div>
                    </div>


            </div>

                </div>
        </div>

    </div>
</asp:Content>
