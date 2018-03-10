<%@ Page Title="" Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="NCAR_WeatherPicture.aspx.cs" Inherits="GridPointPrediction_Web.Page.NCAR_WeatherPicture" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/ncarpicstyle.css?v0.06" rel="stylesheet" type="text/css" />
    <script src="../Script/PageScript/ncarpicstyle.js?v0.16" type="text/javascript"></script>
    <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/time/My97DatePicker/WdatePicker.js?v0.01" type="text/javascript"></script>
    <script src="../Script/time/ToolsDateTime.js?v0.01" type="text/javascript"></script>
    <script src="../Script/layui/layui.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="height: auto; background: #F0F8FF; margin-left: 380px;">      
        <div style="width:93%;height: 810px; display: inline-block;">
                <div id="head">
                    <div id="timeDiv" style="margin-left: 30px; width: 410px; height: 30px; float: left;">
                        <label style="float: left;color: #058dde;">时间：</label>
                        <input onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 10px; width: 120px; height: 30px; float: left;margin-top: 15px;" />
                        <%--气压--%>
                        <div id="hDiv" style="margin-left: 5px; width: 80px; height: 30px; display: none; float: left;">
                            <select id="qiya" style="font-size: 12px;">
                                <option>500hpa</option>
                                <option>700hpa</option>
                                <option>850hpa</option>
                                <option>925hpa</option>
                            </select>
                        </div>
                        <div class="hour" style="float:left; width:40px; height:30px;margin-left:12px;">
                            <select name="hour" id="hour" class="select_hour">
                                <option value="8">8</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <div class="txtdate" style="margin-left: 15px; width: 160px; height: 35px; float: left;line-height: 55px;">
                            <ul>
                                <li>
                                    <button type="button" class="btn btn-primary" onclick="updatepicture('update')" id="update">更新</button></li>
                                <li>
                                    <button type="button" class="btn btn-primary active" onclick="updatepicture('now')" id="nowdate">最新</button></li>
                            </ul>
                        </div>
                    </div>
                    <div style="margin-left: 20px; width: 220px; height: 35px; float: left;">
                        <div style="font-size: 15px; float: left; width: 50px;">
                            <label style="color: #058dde;">时次：</label>
                        </div>
                        <div class="Area" style="line-height: 56px;">
                            <ul>
                                <li>
                                    <button type="button" class="btn btn-primary" id="haikou">海口市</button></li>
                                <li>
                                    <button type="button" class="btn btn-primary active" id="hainan">海南省</button></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <%-- 图片区--%>
                <div id="NCARImg">
                    <%-- 53张--%>
                    <div class="minPicture" style="width:100%;height: auto; display: inline-block; overflow-y: auto">
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image00" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image03" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image06" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image09" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image12" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image15" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image18" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image21" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image24" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image27" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image30" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image33" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image36" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image39" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image42" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image45" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image48" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image51" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image54" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image57" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image60" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>

                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image63" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image66" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image69" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image72" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image78" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image84" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image90" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image96" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image102" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image108" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image114" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image120" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image126" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image132" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image138" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image144" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image150" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image156" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image162" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image168" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image174" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image180" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image186" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image192" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image198" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image204" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image210" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image216" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image222" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image228" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                        </div>
                        <div style="width: 99%; height: 400px; display: inline-block; margin-left: 5px; margin-top: 5px;margin-bottom:10px;">
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image234" style="width: 99.5%; height: 390px;" src="" />
                            </div>
                            <div style="width: 33%; height: 400px; display: inline-block; border: 1px solid #bde2f9; line-height: 400px;">
                                <img id="Image240" style="width: 99.5%; height: 390px;" src="" />
                            </div>                            
                        </div>
                    </div>
                    <%-- 16张--%>
                    <div class="maxPicture" style="display: none; width:100%;height: auto; overflow-y: auto;">
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic00" style="width:98%; height: 490px;" src="" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic03" style="width:98%; height: 490px;" src="" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic06" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic09" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic12" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic15" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic18" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic21" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic24" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic27" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic30" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic33" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic36" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic39" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>

                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic42" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic45" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic48" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic51" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic54" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic57" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic60" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic63" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic66" src="" style="width:98%; height: 490px;" />
                            </div>
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;margin-left:5px;">
                                <img id="Pic69" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                        <div style="width: 100%; height: 500px; display: inline-block; margin-left: 5px; margin-top: 5px;margin-bottom: 8px;">
                            <div style="width: 49%; height: 500px; display: inline-block; border: 1px solid #bde2f9;">
                                <img id="Pic72" src="" style="width:98%; height: 490px;" />
                            </div>
                        </div>
                    </div>
                </div>

                <%--雷暴图形展示--%>
                <div style="width: 100%; height: 100%; padding-right: 2px" id="HapsImg">
                    <div style="width:100%;height: 630px; margin-top: 5px;">
                        <div style="width: 673px; height: 620px; float: left; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img1" />
                        </div>
                        <div style="width: 673px; height: 620px; float: right; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img2" />
                        </div>
                    </div>
                    <div style="width:100%;height: 630px; margin-top: 1px;">
                        <div style="width: 673px; height: 620px; float: left; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img3" />
                        </div>
                        <div style="width: 673px; height: 620px; float: right; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img4" />
                        </div>
                    </div>

                    <div style="width:100%;height: 630px; margin-top: 1px;">
                        <div style="width: 673px; height: 620px; float: left; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img5" />
                        </div>
                        <div style="width: 673px; height: 620px; float: right; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img6" />
                        </div>
                    </div>

                    <div style="width:100%;height: 630px; margin-top: 1px; margin-bottom: 30px">
                        <div style="width: 673px; height: 620px; float: left; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img7" />
                        </div>
                        <div style="width: 673px; height: 620px; float: right; border: 1px solid #bde2f9;">
                            <img style="width: 668px; height: 100%;" id="img8" />
                        </div>
                    </div>
                </div>
            </div>
    </div>
</asp:Content>
