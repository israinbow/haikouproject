<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="ForecastImage.aspx.cs" Inherits="GridPointPrediction_Web.Page.ForecastImage" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <link href="../Style/PageStyle/forecastPicture.css?var01" rel="stylesheet" type="text/css" />
    <script src="../Script/PageScript/forecastPicture.js?copyrig01" type="text/javascript"></script>
        <link href="../Script/layui/css/layui.css" rel="stylesheet" />
    <script src="../Script/time/My97DatePicker/WdatePicker.js?var001" type="text/javascript"></script> 
         <script src="../Script/time/ToolsDateTime.js?var001" type="text/javascript"></script>
       <script src="../Script/layui/layui.js"></script>
        <script src="../Script/Charts/build/dist/echarts.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

 <div style="width:1540px;height:850px;margin:auto">
        <div style="width:1540px;height:50px;line-height:50px;float:left;border-bottom:1px solid #ddd;">
  <div id="yearDay"style="text-align: center;height: 30px;width: 420px;float:left;display:block;" >
      <label>时间</label>
    <input  onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 20px;width: 100px; height: 20px;"/>
   <%-- <label onclick="updatePic('up')" id="update" class="button">更新</label>--%>
        <button id="update" type="button" class="btn btn-primary" onclick="updatePic('up')" style="height:30px;line-height:5px;">更新</button>
      <button id="newtime" type="button" class="btn btn-primary" onclick="updatePic('now')" style="height:30px;line-height:5px;">最新</button>
         <%--   <label onclick="updatePic('now')" id="newtime" class="buttonof">最新</label>--%>
        <select id="shici"><option>06</option><option>12</option><option>18</option><option>24</option></select>
    </div>
           
            <span style="float:left;color:#aaa;">|</span>
        <div class="time" style="margin-left:20px; center;height: 30px;width:160px;float:left;display:block;">
            <label>时次</label>
           <%--  <label id="6hour" class="button">逐6</label>
             <label id="24hour" class="buttonof">逐24</label>--%>

              <button id="6hour" type="button" class="btn btn-primary" style="height:30px;line-height:5px;">逐6</button>
      <button id="24hour" type="button" class="btn btn-primary" style="height:30px;line-height:5px;">逐24</button>
        </div>
                    <div class="eleType" style="text-align: center;height: 30px;width: 160px;float:left;display:block;">
            <label>类别</label>
        <%--     <label id="duibi" class="button">对比</label>
             <label id="jianyan" class="buttonof">检验</label>--%>
                  <button id="duibi" type="button" class="btn btn-primary"  style="height:30px;line-height:5px;">对比</button>
      <button id="jianyan" type="button" class="btn btn-primary"  style="height:30px;line-height:5px;">检验</button>
        </div>

                    <div class="mainElement" style="text-align: center;height: 30px;width: 160px;float:left;display:block;">
            <label>要素</label>
           <%--  <label id="rainValue" class="button">雨量</label>
             <label id="tempValue" class="buttonof">温度</label>--%>
                         <button id="rainValue" type="button" class="btn btn-primary"  style="height:30px;line-height:5px;">雨量</button>
      <button id="tempValue" type="button" class="btn btn-primary"  style="height:30px;line-height:5px;">温度</button>
        </div>

                                <div class="temp" style="text-align: center;height: 30px;width: 160px;float:left;display:none;">
            <label>温度</label>
            <%-- <label id="highTemp" class="button">最高温</label>
             <label id="lowTemp" class="buttonof">最低温</label>--%>
                                     <button id="highTemp" type="button" class="btn btn-primary"  style="height:30px;line-height:5px;">最高温</button>
      <button id="lowTemp" type="button" class="btn btn-primary" style="height:30px;line-height:5px;">最低温</button>
        </div>

        </div>
        <%--图片--%>
        <div style="width:1540px;height:800px;margin:auto;">
          <div style="width:1500px;height:400px;float:left;margin-top:10px;">
              <div style="border:1px solid #ddd;width:730px;height:400px;float:left;"><img id="shikuang" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
              <div style="border:1px solid #ddd;margin-left:10px;border:1px solid #ddd;width:730px;height:400px;float:left;"><img id="bentai" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
          </div>
            <div style="width:1500px;height:400px;float:left;margin-top:10px;">
                <div style="border:1px solid #ddd;width:730px;height:400px;float:left;"><img id="shengtai" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
                <div style="border:1px solid #ddd;margin-left:10px;border:1px solid #ddd;width:730px;height:400px;float:left;"><img id="ouzhou" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
            </div>
        </div>
    
    </div>
</asp:Content>
