<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="GridPointDetial.aspx.cs" Inherits="GridPointPrediction_Web.Page.GridPointDetial" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
      <link href="../Style/PageStyle/GridPointdetail.css?var0011" rel="stylesheet" type="text/css" />
        <link href="../Script/layui/css/layui.css" rel="stylesheet" />
       <script src="../Script/layui/layui.js"></script>
        <script src="../Script/Charts/build/dist/echarts.js"></script>
     <script src="../Script/PageScript/GridPointdetail.js?st"></script>
        <script src="../Script/util/common.js"></script>

      <link href="../Script/Flat-UI-master/dist/css/flat-ui.css" rel="stylesheet"/>
     <script src="../Script/Flat-UI-master/dist/js/flat-ui.min.js"></script>
    <script src="../Script/Flat-UI-master/dist/js/vendor/jquery.min.js"></script>
    <script src="../Script/Flat-UI-master/dist/js/vendor/video.js"></script>
    <script src="../Script/Flat-UI-master/docs/assets/js/application.js"></script>


</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <div class="textContent">
    <div style="width: 100%;height: 30px;float: left">
        <label style="text-align: center;width: 100px;float: left;height: 30px;line-height: 30px;"">天气预测</label>
        <label   style="cursor:pointer; text-align: center; width: 100px; float: right;height: 30px; line-height: 30px;">返回首页</label>  
    </div>
           <label id="Point">弹窗</label>







    <div id="SinglePoint"  class="hide">

         <%--天气预报--%>
       <div class="weather" style="width: 100%;float: left; height: 100px;"> 
       </div>
        <%--趋势图--%>
        <div style="width:850px;height:600px;float:left;">
              <%--气温--%>
            <div id="tempPicture" style="width:850px;height:250px;float:left;"></div>
              <%--相对湿度--%>
            <div id="humitPicture" style="width:850px;height:250px;float:left;"></div>
              <%--风速--%>
            <div id="windPicture" style="width:850px;height:250px;float:left"></div>
        </div>
    </div>


    </div>


</asp:Content>
