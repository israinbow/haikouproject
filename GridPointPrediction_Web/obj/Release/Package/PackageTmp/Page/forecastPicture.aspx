<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="forecastPicture.aspx.cs" Inherits="GridPointPrediction_Web.Page.forecastPicture" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <link href="../Style/PageStyle/forecastPicture.css?var02" rel="stylesheet" type="text/css" />
    <script src="../Script/PageScript/forecastPicture.js?ie1" type="text/javascript"></script>
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
 <label onclick="updatePic('up')" id="update" class="button">更新</label>
           <label onclick="updatePic('now')" id="newtime" class="buttonof">最新</label>
        <select id="shici"><option>06</option><option>12</option><option>18</option><option>24</option></select>
    </div>
           
            <span style="float:left;color:#aaa;">|</span>
        <div class="time" style="margin-left:20px; center;height: 30px;width:160px;float:left;display:block;">
            <label>时次</label>
             <label id="6hour" class="button">逐6</label>
             <label id="24hour" class="buttonof">逐24</label>

        </div>
                    <div class="eleType" style="text-align: center;height: 30px;width: 160px;float:left;display:block;">
            <label>类别</label>
             <label id="duibi" class="button">对比</label>
             <label id="jianyan" class="buttonof">检验</label>

        </div>

                    <div class="mainElement" style="text-align: center;height: 30px;width: 160px;float:left;display:block;">
            <label>要素</label>
             <label id="rainValue" class="button">雨量</label>
             <label id="tempValue" class="buttonof">温度</label>
        </div>

                   <div class="temp" style="text-align: center;height: 30px;width: 160px;float:left;display:none;">
            <label>温度</label>
             <label id="highTemp" class="button">最高温</label>
             <label id="lowTemp" class="buttonof">最低温</label>
                          
        </div>

        </div>
        <%--图片--%>
        <div style="width:1540px;height:800px;margin:auto;">
          <div style="width:1500px;height:400px;float:left;margin-top:10px;">
              <div style="border:1px solid #ddd;width:732px;height:403px;float:left;"><img id="shikuang" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
              <div style="border:1px solid #ddd;margin-left:10px;border:1px solid #ddd;width:732px;height:403px;float:left;"><img id="bentai" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
          </div>
            <div style="width:1500px;height:400px;float:left;margin-top:10px;">
                <div style="border:1px solid #ddd;width:732px;height:403px;float:left;"><img id="shengtai" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
                <div style="border:1px solid #ddd;margin-left:10px;border:1px solid #ddd;width:732px;height:403px;float:left;"><img id="ouzhou" style="width:730px;height:400px;float:left;" src="http://10.153.96.173:8080/GridPic/Rain/Europe/20160901/24h/20160901_24h.png" /></div>
            </div>
        </div>
    
    </div>
</asp:Content>
