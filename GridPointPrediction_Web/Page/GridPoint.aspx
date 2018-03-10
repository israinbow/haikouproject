<%@ Page Title="" Language="C#" MasterPageFile="Site.Master" AutoEventWireup="true" CodeBehind="GridPoint.aspx.cs" Inherits="GridPointPrediction_Web.Page.GridPoint" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../Style/PageStyle/GridPoint.css?v1.6" rel="stylesheet" />
    <script src="../Script/webContextMenu/js/web.contextmenu.js"></script>
    <script src="../Script/PageScript/GridPoint.js?v1.8"></script>
    <script src="../Script/util/jquery.contextify.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <div id="map">
            <div id="mapid"></div>
        </div>
        <div id="TimeChoice">
            <div class="tc_forestTime">
                <div class="tc_forestTime" data-toggle="buttons">
                    <input id="HisStartTime" class="Wdate" type="text" onchange="SetForetime()" onfocus="WdatePicker({isShowClear:false,readOnly:true})" />
                    <ul>
                        <li>
                            <button type="button" class="btn btn-primary btn-sm active" data-foresthour="8">08:00</button></li>
                        <%--<li>
                            <button type="button" class="btn btn-primary btn-sm" data-foresthour="15">11:00</button></li>--%>
                        <li>
                            <button type="button" class="btn btn-primary btn-sm" data-foresthour="20">20:00</button></li>
                    </ul>                    
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
            <div style="float: left; height: 30px; margin-top: 7px;" class="BtncopyData">
                <button id="BtncopyNextDay" type="button" class="btn btn-primary btn-sm">复制数据至下一天</button>
                <button id="BtncopyNextHour" type="button" class="btn btn-primary btn-sm">复制数据至下一时次</button>
            </div>
        </div>
        <div class="map_toolbar">
            <div class="row map_toolbarcon div-tool">
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded T2M active" title="温度" data-valuesname="T2M" data-src="icon_T" src="../Images/PageImage/icon_T_S.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded MAXTEMP" title="最高温" data-valuesname="MAXTEMP" data-src="icon_HT" src="../Images/PageImage/icon_HT.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded MINTEMP" title="最低温" data-valuesname="MINTEMP" data-src="icon_LT" src="../Images/PageImage/icon_LT.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded RAIN" title="降雨" data-valuesname="RAIN" data-src="icon_Rain" src="../Images/PageImage/icon_Rain.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded R24H" title="24H降水" data-valuesname="R24H" data-src="icon_24Rain" src="../Images/PageImage/icon_24Rain.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded WSPD10M" title="10米风速" data-valuesname="WSPD10M" data-src="icon_Wind" src="../Images/PageImage/icon_Wind.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded RHSFC" title="湿度" data-valuesname="RHSFC" data-src="icon_U" src="../Images/PageImage/icon_U.png" />
                </div>
                <div class="col-md-1 map_toolbar_item">
                    <img class="img-rounded CLCT" title="云量" data-valuesname="CLCT" data-src="icon_Tcco" src="../Images/PageImage/icon_Tcco.png" />
                </div>
                <div class="col-md-1 map_toolbar_item" style="display: none">
                    <img class="img-rounded VISI" title="能见度" data-valuesname="VISI" data-src="icon_V" src="../Images/PageImage/icon_V.png" />
                </div>
                <div class="col-md-3 map_toolbar_item" style="width: 236px">
                    <%--<button type="button" class="btn btn-primary">复制上一次数据</button>--%>
                    <button type="button" class="btn btn-primary" id="Revoke" disabled="disabled">撤销<span id="modifynum" style="color: #1ff911;"></span></button>
                    <button type="button" class="btn btn-primary" id="btnsave"  disabled="disabled">保存</button>
                    <%--<button type="button" class="btn btn-primary disabled">上传省局</button>  --%>
                    <label class="btn btn-warning"><a href="ForecasterPage.aspx" style="color:white">预报员制作</a></label>
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
                    <img title="选择格点" class="img-rounded map_gridoperation_circle" data-type="SelectArea" data-src="icon_circle" src="../Images/PageImage/icon_circle.png" /></span>
                <span class="imgselect">
                    <img title="风速" class="img-rounded map_gridoperation_windf" data-type="SelectArea" data-src="icon_windf" src="../Images/PageImage/icon_windf.png" /></span>
                <span class="imgselect">
                    <img title="风向" class="img-rounded map_gridoperation_windd" data-type="SelectArea" data-src="icon_windd" src="../Images/PageImage/icon_windd.png" /></span>
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
    <script>
        $(function () {
            $("#GridPoint").addClass("active");
        })
        var foreday = 10;//预报时效，海口目前提供的预报数据的预报时效是72H，因此预报时效的天数为3,海口ecmwf_thin欧洲中心细网格数据的预报时效是240H，因此预报时效的天数为10
        var savetype = "allgrid";
        var gridelement = "T2M"; //格点数据要素
    </script>
</asp:Content>
