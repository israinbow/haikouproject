<%@ Page Title="灾害预报" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="dateForecast.aspx.cs" Inherits="GridPointPrediction_Web.Page.dateForecast" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
    <script src="../Script/time/ToolsDateTime.js" type="text/javascript"></script>
    <script src="../../Script/PageScript/dateforecast.js?01" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="width: 1258px; height: 850px; margin: auto;">
        <%--  头部--%>
        <div style="width: 100%; height: 7%; border-bottom: 1px solid #ddd;">
            <div style="height: 20%; background: #ddd;"></div>
            <div style="padding-top: 10px; height: 80%;">
                <div id="yearDay" style="text-align: center; height: 30px; width: 315px; float: left; display: block;">
                    <label>时间</label>
                    <input onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin: 0px 5px 0 20px; width: 100px; height: 28px;" />
                    <button id="update" type="button" class="btn btn-primary" onclick="updatePic('up')" style="height: 30px; line-height: 5px;">更新</button>
                    <button id="newtime" type="button" class="btn btn-primary" onclick="updatePic('now')" style="height: 30px; line-height: 5px;">最新</button>
                </div>
                <span style="float: left; color: #aaa; height: 30px; line-height: 30px;">|</span>
                <div class="time" style="margin-left: 20px; center; height: 30px; width: 160px; float: left; display: block; line-height: 30px;">
                    <label>类型</label>
                    <button id="rain" type="button" class="btn btn-primary" style="height: 30px; line-height: 5px;">降雨</button>
                </div>
            </div>
        </div>
        <%--图形展示--%>
        <div style="width: 100%; height: 90%;">
            <div style="width: 1490px; height: 630px; padding-top: 10px;">
                <div style="width: 710px; height: 620px; float: left; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img1" />
                </div>
                <div style="width: 710px; height: 620px; float: right; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img2" />
                </div>
            </div>
            <div style="width: 1490px; height: 630px; padding-top: 10px;">
                <div style="width: 710px; height: 620px; float: left; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img3" />
                </div>
                <div style="width: 710px; height: 620px; float: right; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img4" />
                </div>
            </div>

            <div style="width: 1490px; height: 630px; padding-top: 10px;">
                <div style="width: 710px; height: 620px; float: left; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img5" />
                </div>
                <div style="width: 710px; height: 620px; float: right; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img6" />
                </div>
            </div>

            <div style="width: 1490px; height: 630px; padding-top: 10px; margin-bottom: 30px">
                <div style="width: 710px; height: 620px; float: left; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img7" />
                </div>
                <div style="width: 710px; height: 620px; float: right; border: 1px solid #ccc;">
                    <img style="width: 100%; height: 100%;" id="img8" />
                </div>
            </div>
        </div>
    </div>
</asp:Content>
