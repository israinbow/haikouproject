<%@ Page Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="OperationCatalog.aspx.cs" Inherits="GridPointPrediction_Web.Page.OperationCatalog" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>回溯显示</title>
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/OperationCatalog.css?v0.5" />
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <script type="text/javascript" src="../Script/PageScript/jquery-1.9.1.min.js"></script>

    <script src="../Script/JSPackage/bootstrap-datepicker/js/bootstrap-datetimepicker.js" type="text/javascript"></script>
    <script src="../Script/JSPackage/bootstrap-datepicker/js/bootstrap-datetimepicker.zh-CN.js" type="text/javascript"></script>
    <link href="../Script/JSPackage/bootstrap-datepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="../Script/PageScript/OperationCatalog.js?v0.5"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <div class="container-fluid box">
            <div class="row">
                <%--左侧菜单栏--%>
                <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu">
                    <h4>回溯显示</h4>
                    <ul class="menu_list">
                        <li class="active">逐6时预报</li>
                        <li>逐12时预报</li>
                        <li>十天预报</li>
                        <li>分区预报</li>
                        <li>格点预报</li>
                        <li>决策预报</li>
                        <li>旬报</li>
                        <li>月报</li>
                        <li>实况预报</li>
                        <li>日常预报</li>
                        <li>假日专报</li>
                        <li>政府专报</li>
                        <li>农业专报</li>
                        <li>春运专报</li>
                        <li>交通专报</li>
                    </ul>
                </div>
                <%--菜单栏切换内容区域--%>
                <div class="col-lg-9 col-md-9 col-sm-9 content">
                    <div class="subTimemenu">
                        <span>时间：</span>
                        <input id="datetimeStart" class="form-control" type="text" value="2017-10-16" style="margin-right: 10px;" />至
                        <input id="datetimeEnd" class="form-control" type="text" value="2017-10-18" />
                        <span class="searchData">查询</span>
                    </div>
                    <div style="padding-bottom: 10px;">
                        <h4 class="forecastListTitle">历史<span class="forecastList_title">逐6小时预报</span>回溯列表</h4>
                        <div class="out_container" style="padding-bottom: 5px; background: #fff">
                            <div class="inner_container" style="background: #fff; padding-right: 15px; padding-top: 5px;">
                                <table id="forecastList_table">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="showbg"></div>
    <div class="showDt">
        <p>回溯显示详情<span class="file_del" id="close_pic" title="关闭" onclick="close_pic()" style="position: absolute; top: 35%; left: 90%; z-index: 10000; width: 15px; height: 15px; background: #208DDF url(../../Images/upload/UploadAction/delete_white.png) no-repeat scroll 0 0;"></span></p>
        <ul></ul>
    </div>
</asp:Content>
