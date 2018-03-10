<%@ Page Language="C#" MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="HKGridPoint.aspx.cs" Inherits="GridPointPrediction_Web.Page.HKGridPoint" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <title>精细化预报</title>
    <link href="../Style/PageStyle/HKGridPoint.css?3.50" rel="stylesheet" />
    <script src="../Script/webContextMenu/js/web.contextmenu.js"></script>
    <script src="../Script/PageScript/HKGridPoint.js?v2.24"></script>
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
            <div class="BtncopyData">
                <button id="BtncopyNextDay" type="button" class="btn btn-primary btn-sm">复制数据至下一天</button>
                <button id="BtncopyNextHour" type="button" class="btn btn-primary btn-sm">复制数据至下一时次</button>
            </div>
        </div>
        <div class="map_toolbar">
            <div class="row map_toolbarcon div-tool">
                <div class="col-md-1 map_toolbar_item" style="width:92px;">
                    <img class="img-rounded T2M active" title="温度" data-valuesname="T2M" data-src="bg_t" src="../Images/NewPageImage/bg_t_s.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:90px;">
                    <img class="img-rounded MAXTEMP" title="最高温" data-valuesname="MAXTEMP" data-src="bg_tmax" src="../Images/NewPageImage/bg_tmax.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:90px;">
                    <img class="img-rounded MINTEMP" title="最低温" data-valuesname="MINTEMP" data-src="bg_tmin" src="../Images/NewPageImage/bg_tmin.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:90px;">
                    <img class="img-rounded RAIN" title="降雨" data-valuesname="RAIN" data-src="bg_shower" src="../Images/NewPageImage/bg_shower.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:131px;">
                    <img class="img-rounded R24H" title="24H降水" data-valuesname="R24H" data-src="bg_24rain" src="../Images/NewPageImage/bg_24rain.png" />
 
                </div>
                <div class="col-md-1 map_toolbar_item" style="width:121px;">
                    <img class="img-rounded WSPD10M" title="10米风速" data-valuesname="WSPD10M" data-src="bg_10wind" src="../Images/NewPageImage/bg_10wind.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:90px;">
                    <img class="img-rounded RHSFC" title="湿度" data-valuesname="RHSFC" data-src="bg_humity" src="../Images/NewPageImage/bg_humity.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:90px;">
                    <img class="img-rounded CLCT" title="云量" data-valuesname="CLCT" data-src="bg_tcc" src="../Images/NewPageImage/bg_tcc.png" />

                </div>
                <div class="col-md-1 map_toolbar_item" style="width:103px;display: none">
                    <img class="img-rounded VISI" title="能见度" data-valuesname="VISI" data-src="bg_visiable" src="../Images/NewPageImage/bg_visiable.png" />

                </div>                
            </div>
        </div>
        <div class="toolbar_btn">
            <div class="col-md-3 map_toolbar_item" style="width: 382px;padding-left:20px;">
                <ul>
                    <li id="Revokeli" class="disabled">
                        <button type="button" class="btn btn-primary" id="Revoke">撤销<span id="modifynum" style="color: #1ff911;font-family:微软雅黑;font-size:14px"></span></button></li>
                    <li id="btnsaveli" class="disabled">
                        <button type="button" class="btn btn-primary" id="btnsave">保存</button></li>
                    <%--<li id="loginli" class="disabled">
                        <button type="button" class="btn btn-warning" id="btnlogin" onclick="showlogin(this)"><span title='点击登录'>登录</span></button></li>--%>
                </ul>                              
                <%--<label class="btn btn-warning" style="width:110px;height:32px;margin-left:25px;background-color:#1054c9;border-color:#1054c9;border-radius:8px;"><a class="forcastproduct" href="ForecasterPage.aspx" style="color: white;font-family:微软雅黑;">预报员制作</a></label>--%>
            </div>
        </div>
        <div class="map_gridoperation">
            <div style="height: 50px; line-height: 50px; margin-right: 10px;">
                <span>
                    <label class="_title">天气数值</label>：<input id="numvalue" style="display: inline-block; width: 60px; height: 30px; margin-right: 10px; text-align: center; font-family:微软雅黑;" type="text" class="form-control" value="1" /></span>
                <span class="imgselect">
                    <img class="img-rounded map_gridoperation_hand active" data-src="icon_hand" src="../Images/NewPageImage/icon_hand_s.png" /></span>
                <span class="imgselect">
                    <img title="选择格点" class="img-rounded map_gridoperation_circle" data-type="SelectArea" data-src="icon_circle" src="../Images/NewPageImage/icon_circle.png" /></span>
                <span class="imgselect">
                    <img title="风速" class="img-rounded map_gridoperation_windf" data-type="SelectArea" data-src="icon_windf" src="../Images/NewPageImage/icon_windf.png" /></span>
                <span class="imgselect">
                    <img title="风向" class="img-rounded map_gridoperation_windd" data-type="SelectArea" data-src="icon_windd" src="../Images/NewPageImage/icon_windd.png" /></span>
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
                <li><button id="btncolourspot" type="button" class="btn btn-primary btn-sm" data-type="colourspot">色斑图</button></li>
                <li><button id="btnaws" type="button" class="btn btn-primary btn-sm" data-type="aws">自动站点</button></li>
                <%--<li data-type="gridaws"><button type="button" class="btn btn-primary btn-sm">格点自动站点</button></li>--%>
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
