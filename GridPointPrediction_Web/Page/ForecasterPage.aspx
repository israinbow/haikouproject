<%@ Page Title="" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="ForecasterPage.aspx.cs" Inherits="GridPointPrediction_Web.Page.WebForm2" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/GridPoint.css" rel="stylesheet" />

    <script src="../Script/PageScript/GridPoint.js"></script>
    <style type="text/css">
        ._pf_table, ._pf_table_All {
            min-height: 88px;
        }

            ._pf_table tr td, ._pf_table_All tr td {
                border: 1px solid black;
                text-align: center;
            }

        .ybsx ul li {
            width: 50px;
        }

        legend {
            display: block;
            width: auto;
            padding: 0;
            margin-bottom: 0px;
            font-size: 14px;
            line-height: inherit;
            color: #333;
            border: 0;
            border-bottom: 1px solid #e5e5e5;
        }

        fieldset {
            min-width: 0;
            padding: 5px;
            margin: auto;
            border: 1px solid #808080;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <%--<div id="gridtitle" style="position: absolute; top: 50px; right: 50%; left: 39%; margin: auto; width: 240px; height: 35px; text-align: center; line-height: 35px; z-index: 999; background-color: white; border-radius: 5px;">
            <h5>当前预报要素：降水；预报时间：2017年6月6日14时</h5>
        </div>--%>
        <div id="map">
            <div id="mapid"></div>
        </div>
        <div id="TimeChoice">
            <div class="tc_forestTime">
                <div class="tc_forestTime" data-toggle="buttons">
                    <input id="HisStartTime" <%-- disabled="disabled"--%> class="Wdate" type="text" onchange="SetForetime()" onfocus="WdatePicker({isShowClear:false,readOnly:true})" />
                    <ul>
                        <%--<li>
                            <button disabled="disabled" type="button" class="btn btn-primary btn-sm" data-foresthour="6">06:00</button></li>
                        <li>
                            <button disabled="disabled" type="button" class="btn btn-primary btn-sm" data-foresthour="11">11:00</button></li>--%>
                        <li>
                            <button type="button" class="btn btn-primary btn-sm active" data-foresthour="20">20:00</button></li>
                    </ul>
                    <%--<label class="btn btn-primary btn-sm">
                        <input type="radio" name="options" id="option0600" />
                        06:00
                    </label>
                    <label class="btn btn-primary btn-sm">
                        <input type="radio" name="options" id="option1100" />
                        11:00
                    </label>
                    <label class="btn btn-primary btn-sm">
                        <input type="radio" name="options" id="option1600" />
                        16:00
                    </label>--%>
                </div>
            </div>
            <div class="Prescription">
                <ul>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm active">29日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">30日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">31日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">1日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">2日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">3日</button></li>
                    <li>
                        <button type="button" class="btn btn-primary btn-sm">4日</button></li>
                </ul>
            </div>
            <div class="ybsx">
                <ul>
                </ul>
            </div>
            <%--<div style="float: left; height: 30px; margin-top: 7px;" class="BtncopyData">
                <button id="BtncopyNextDay" type="button" class="btn btn-primary btn-sm">复制数据至下一天</button>
                <button id="BtncopyNextHour" type="button" class="btn btn-primary btn-sm">复制数据至下一时次</button>
            </div>--%>
        </div>
        <div class="map_toolbar">
            <div class="row map_toolbarcon div-tool">


                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded RAIN active" title="降雨" data-valuesname="R6H" data-src="icon_Rain" src="../Images/PageImage/icon_Rain_S.png" />
                </div>
                <%--   <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded R24H" title="6H降水" data-valuesname="R6H" data-src="icon_6Rain" src="../Images/PageImage/icon_6Rain.png" />
                </div>--%>
                <%-- <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded R24H" title="24H降水" data-valuesname="R24H" data-src="icon_24Rain" src="../Images/PageImage/icon_24Rain.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded T2M" title="温度" data-valuesname="T2M" data-src="icon_T" src="../Images/PageImage/icon_T.png" />
                </div>
              <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded MAXTEMP" title="最高温" data-valuesname="MAXTEMP" data-src="icon_HT" src="../Images/PageImage/icon_HT.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded MINTEMP" title="最低温" data-valuesname="MINTEMP" data-src="icon_LT" src="../Images/PageImage/icon_LT.png" />
                </div>--%>
                <%-- <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded WSPD10M" title="10米风速" data-valuesname="WSPD10M" data-src="icon_Wind" src="../Images/PageImage/icon_Wind.png" />
                </div>--%>
                <%--<div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded RHSFC" title="湿度" data-valuesname="RHSFC" data-src="icon_U" src="../Images/PageImage/icon_U.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded CLCT" title="云量" data-valuesname="CLCT" data-src="icon_Tcco" src="../Images/PageImage/icon_Tcco.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded VISI" title="能见度" data-valuesname="VISI" data-src="icon_V" src="../Images/PageImage/icon_V.png" />
                </div>--%>
                <div class="col-md-3 map_toolbar_item" style="width: 275px;margin-left:-8px;">
                    <%--<button type="button" class="btn btn-primary">复制上一次数据</button>--%>
                    <button type="button" class="btn btn-primary" id="Revoke" disabled="disabled">撤销<span id="modifynum" style="color: #1ff911;"></span></button>
                    <button type="button" class="btn btn-primary" id="btnsave" disabled="disabled">保存</button>
                    <button type="button" class="btn btn-primary disabled hide">上传省局</button>
                    <button type="button" class="btn btn-warning" id="btnlogin" onclick="showlogin(this)"><span title='点击登录'>登录</span></button>
                    <button type="button" class="btn btn-warning" id="btnshowpf" onclick="showpf(this)">格点评分</button>
                </div>
            </div>
        </div>
        <div class="map_gridoperation">
            <div style="height: 45px; line-height: 45px;">
                <span>
                    <label class="_title">天气数值</label>：<input id="numvalue" style="display: inline-block; width: 60px; height: 30px; margin-right: 10px; text-align: center;" type="text" class="form-control" value="1" /></span>
                <span class="imgselect">
                    <img class="img-rounded map_gridoperation_hand active" data-src="icon_hand" src="../Images/PageImage/icon_hand_s.png" /></span>
                <span class="imgselect">
                    <img title="选择格点" class="img-rounded map_gridoperation_circle changegrid" data-type="SelectArea" data-src="icon_circle" src="../Images/PageImage/icon_circle.png" /></span>
                <%--<span class="imgselect">
                    <img title="风速" class="img-rounded map_gridoperation_windf" data-type="SelectArea" data-src="icon_windf" src="../Images/PageImage/icon_windf.png" /></span>
                <span class="imgselect">
                    <img title="风向" class="img-rounded map_gridoperation_windd" data-type="SelectArea" data-src="icon_windd" src="../Images/PageImage/icon_windd.png" /></span>--%>
            </div>
            <fieldset class="windtool hide">
                <legend>风场规则:</legend>
                <p>
                    <input type="radio" name="values" id="ryz" checked="checked" /><label for="ryz">任意值</label>
                </p>
                <p>
                    <input type="radio" name="values" id="fwz" /><label for="fwz">范围值</label><input type="text" value="0" class="form-control" style="display: inline-block; width: 50px; height: 25px; margin-left: 5px;" id="windmin" /><b style="padding: 5px; line-height: 30px">-</b><input type="text" value="1" id="windmax" class="form-control" style="display: inline-block; width: 50px; height: 25px;" />
                </p>
                <p>
                    <input type="radio" name="wind" id="windftool" checked="checked" /><label for="windftool">风速</label><input style="margin-left: 15px;" type="radio" name="wind" id="winddtool" /><label for="winddtool">风向</label>
                </p>
                <p>
                    <input type="radio" name="change" id="gdz" checked="checked" /><label for="gdz">固定值</label>
                    <input style="margin-left: 8px;" type="radio" name="change" id="dz" /><label for="dz">递增</label>
                    <input style="margin-left: 8px;" type="radio" name="change" id="dj" /><label for="dj">递减</label>
                </p>
                <p>
                    <label>改变值：</label><input id="windvalues" value="1" style="display: inline-block; width: 50px; height: 25px;" type="text" id="windfvalues" class="form-control" />
                    <button type="button" class="btn btn-primary btn-sm btnconfirm">确定</button>
                </p>
            </fieldset>
        </div>
        <div class="media-right" style="visibility: collapse"></div>

        <div id="LayerTools">
            <ul>
                <li data-type="colourspot"><i class="glyphicon glyphicon-ok-circle"></i>色斑图</li>
                <li data-type="aws"><i class="glyphicon glyphicon-ok-circle"></i>自动站点</li>
                <li data-type="gridaws"><i class="glyphicon glyphicon-ok-circle"></i>格点自动站点</li>
            </ul>
        </div>
    </div>
    <div id="login"></div>
    <div id="pf_alltable" style="display: none">
        <table class="_pf_table_All" style="border-collapse: collapse; border: 1px solid black; width: 400px; text-align: center;">
            <thead>
                <tr>
                    <td rowspan="1">基本信息</td>
                    <td colspan="5">起报时间：<label class="foretime_all">加载中……</label></td>
                </tr>
                <tr>
                    <td colspan="3">晴雨</td>
                    <td colspan="3">大雨</td>
                </tr>
                <tr>
                    <td>开始时间</td>
                    <td>结束时间</td>
                    <td>评分</td>
                    <td>开始时间</td>
                    <td>结束时间</td>
                    <td>评分</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="6" rowspan="6">加载中……</td>
                </tr>
                <%--<tr>
                    <td></td>
                    <td></td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>
                 <tr>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>
                 <tr>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>
                 <tr>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>
                 <tr>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>
                 <tr>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                    <td>加载中……</td>
                </tr>--%>
            </tbody>
            <tfoot>
                <tr>
                    <%--   <td colspan="2">总评分：</td>
                    <td class="qypf">加载中……</td>
                    <td colspan="2"></td>
                    <td class="qypf">加载中……</td>--%>
                </tr>
            </tfoot>
        </table>
    </div>
    <script>
        $(function () {
            $("#GridPoint").addClass("active");
        })
        
        var foreday = 3;//预报时效(预报员只显示三天)
        var savetype = "forecaster";//格点数据保存更新时的类别区分
        var gridelement = "R6H"; //格点数据要素        
        
    </script>
</asp:Content>
