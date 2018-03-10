<%@ Page Language="C#" MasterPageFile="~/Page/MainForm.Master" AutoEventWireup="true" CodeBehind="forecastTest.aspx.cs" Inherits="GridPointPrediction_Web.Page.forecastTest" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../Script/PageScript/forecastTest.js?v0.16" type="text/javascript"></script>
    <script src="../Script/Charts/highcharts.js" type="text/javascript"></script>
    <script src="../Script/time/ToolsDateTime.js" type="text/javascript"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
    <link href="../Style/PageStyle/forecastExamise.css?v0.16" rel="stylesheet" type="text/css" />

</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="background: #F0F8FF; height: 10px; width: 100%; margin: auto;"></div>
     <%--侧边二级菜单--%>
    <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu top">
        <div>
            <h4>检验评分</h4>
            <div class="menu_list">
                <ul>
                    <li id="btn01" class="hover">准确率评分</li>
                    <li id="btn02">技巧评分</li>
                    <li id="btn03">要素评分</li>
                    <%--<li id="btn06">预报评分</li>--%>
                </ul>
            </div>
        </div>
    </div>
    <div id="allContent" class="col-lg-9 col-md-9 col-sm-9">       
        <%--表单--%>
        <div style="margin-top: 10px;margin: auto;margin-left: 10px;background: white;border-radius: 9px;">
             <%--准确率--%>
            <div id="rightDate" style="padding-top:10px;">
                <div id="yearDay" style="text-align: center; height: 30px; width: 350px; float: left; display: block;">
                    <span>时间：</span>
                    <input onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px;margin-top:12px;" />
                    <span>至</span>
                    <input onchange="dateHandle()" type="text" id="dateend" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px;margin-left:5px;" />
                </div>
                <div id="yearMonth" style="text-align: center; height: 30px; width: 260px; float: left;margin:13px 0 0 25px; display: none;">
                    <span>时间：</span>
                    <select id="yearMonthChoise" style="width: 70px; height: 30px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                    <select id="MonthChoise" style="width: 50px; height: 30px;">
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                    </select>
                    <span style="margin: 0px 8px 0px 5px;">月份</span>
                </div>
                <div id="yearSeason" style="text-align: center; height: 30px; width: 260px; float: left;margin:13px 0 0 25px; display: none;">
                    <span>时间：</span>
                    <select id="yearSeasonChoise" style="width: 70px; height: 30px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                    <select id="SeasonChoise" style="width: 50px; height: 30px;">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                    <span style="margin: 0px 8px 0px 5px;">季度</span>
                </div>
                <div id="yearDiv" style="text-align: center; height: 30px; width: 260px; float: left; margin-top:13px; display: none;">
                    <span>时间：</span>
                    <select id="yearil" style="width: 70px; height: 30px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                </div>

                <div class="precisionRate">
                    <ul>
                        <li><button type="button" class="btn btn-primary active" id="dayScore">日评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="monthScore">月评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="seasonScore">季评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="yearScore">年评分</button></li>                        
                    </ul>
                </div>

                <div id="preview" style="float: left; margin-left:20px;">
                    <ul>
                        <li><button type="button" onclick="select()" class="btn btn-primary" id="scoreQuery">查询</button></li>
                        <li><button type="button" onclick="Expore('right')" class="btn btn-primary" id="scoreExport">导出</button></li>
                    </ul>
                </div>  
                             
                <label class="Textin">备注：逐时预报气温只评定整点误差</label>
            </div>

            <%--技巧--%>
            <div id="jiqiao" style="display: none;">
                <div style="float: left;margin-left: 30px;margin-top:13px;">
                    <span style="font-size: 15px; font-family: 微软雅黑; color: #058dde;">时间：</span>
                    <input onchange="dateHandle()" type="text" id="Text1" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px; margin-top: 12px;" />
                    <span style="font-size: 15px; font-family: 微软雅黑; color: #058dde;">至</span>
                    <input onchange="dateHandle()" type="text" id="Text2" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px; margin-left: 5px;" />
                </div>
                <div id="preview_skill" style="float: left; margin-left:50px;margin-top: 25px;">
                    <ul>
                        <li><button type="button" onclick="techSelect()" class="btn btn-primary">查询</button></li>
                        <li><button type="button" onclick="Expore('jiqiao')" class="btn btn-primary">导出</button></li>
                    </ul>
                </div>
                <%--<label onclick="techSelect()" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #fe5553; margin-left: 40px; color: #fff; font-size: 15px; border-radius: 5px; cursor: pointer;">查询</label>
                <label onclick="Expore('jiqiao')" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #e4e4e4; margin-left: 8px; border: 1px solid #aaa; font-size: 15px; border-radius: 5px; cursor: pointer;">导出</label>--%>
            </div>

            <%--要素--%>
            <div id="yaosu" style="display: none;">
                <div style="float: left; margin-left: 30px; margin-top: 13px;">
                    <span style="font-size: 15px; font-family: 微软雅黑; color: #058dde;">时间：</span>
                    <input onchange="dateHandle()" type="text" id="Text3" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px; margin-top: 12px;" />
                    <span style="font-size: 15px; font-family: 微软雅黑; color: #058dde;">至</span>
                    <input onchange="dateHandle()" type="text" id="Text4" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px; margin-left: 5px;" />
                </div>
                <div id="preview_element" style="float: left; margin-left: 50px; margin-top: 25px;">
                    <ul>
                        <li>
                            <button type="button" onclick="ElementSelect()" class="btn btn-primary">查询</button></li>
                        <li>
                            <button type="button" onclick="Expore('yaosu')" class="btn btn-primary">导出</button></li>
                    </ul>
                </div>
                <%--<label onclick="ElementSelect()" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #fe5553; margin-left: 40px; color: #fff; font-size: 15px; border-radius: 5px; cursor: pointer;">查询</label>
                <label onclick="Expore('yaosu')" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #e4e4e4; margin-left: 8px; border: 1px solid #aaa; font-size: 15px; border-radius: 5px; cursor: pointer;">导出</label>--%>
                <asp:Button runat="server" type="button" class="btn btn-primary" ID="Button1" OnClick="Button2_Click" Style="display: none;" Text="导出Excel" />
                <input runat="server" id="filename" type="hidden" value="" />
            </div>

            <div id="jiangyu" style="display: none;">
                <span style="font-size:15px;font-family:微软雅黑;color:#058dde;">时间：</span>
                <input onchange="dateHandle()" type="text" id="Text5" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px;margin-top:12px;" />
                <span style="font-size:15px;font-family:微软雅黑;color:#058dde;">至</span>
                <input onchange="dateHandle()" type="text" id="Text6" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px;margin-left:5px;" />
                <label onclick="rainSelect()" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #fe5553; margin-left: 40px; color: #fff; font-size: 15px; border-radius: 5px; cursor: pointer;">查询</label>
                <label style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #e4e4e4; margin-left: 8px; border: 1px solid #aaa; font-size: 15px; border-radius: 5px; cursor: pointer;">导出</label>
                <label class="Textin-rain">分级标准：大于等于0.1小于等于2为小雨，大于2小于等于10为中雨，大于10小雨等于20为大雨，大于20为暴雨（单位：毫米）</label>
            </div>

            <div id="gedian" style="display: none;">
                <span style="font-size:15px;font-family:微软雅黑;color:#058dde;">时间：</span>
                <input onchange="dateHandle()" type="text" id="Text7" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px;margin-top:12px;" />
                <span style="font-size:15px;font-family:微软雅黑;color:#058dde;">至</span>
                <input onchange="dateHandle()" type="text" id="Text8" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px;margin-left:5px;" />

                <label style="cursor: pointer; display: inline-block; width: 80px; height: 20px; text-align: center; line-height: 20px; background: #0976c2; margin-left: 80px; color: #fff; font-size: 13px;">日评分</label>
                <label style="cursor: pointer; display: inline-block; width: 80px; height: 20px; text-align: center; line-height: 20px; background: #5dbcfe; margin-left: -4px; color: #fff; font-size: 13px;">月评分</label>
                <label style="cursor: pointer; display: inline-block; width: 80px; height: 20px; text-align: center; line-height: 20px; background: #5dbcfe; margin-left: -4px; color: #fff; font-size: 13px;">季评分</label>
                <label style="cursor: pointer; display: inline-block; width: 80px; height: 20px; text-align: center; line-height: 20px; background: #5dbcfe; margin-left: -4px; color: #fff; font-size: 13px;">年评分</label>
                <label onclick="tableSelect()" style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #fe5553; margin-left: 40px; color: #fff; font-size: 15px; border-radius: 5px; cursor: pointer;">查询</label>
                <label style="display: inline-block; width: 75px; height: 25px; text-align: center; line-height: 25px; background: #e4e4e4; margin-left: 8px; border: 1px solid #aaa; font-size: 15px; border-radius: 5px; cursor: pointer;">导出</label>
            </div>

            <%--预报员--%>
            <div id="yubaoDate" style="padding-top:10px; display: none;">               
                <div id="yeartime" style="text-align: center; height: 30px; width: 350px; float: left; display: block;">
                    <span>时间：</span>
                    <input onchange="dateHandle()" type="text" id="startdate" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 5px; margin-right: 5px; width: 108px; height: 30px;margin-top:12px;" />
                    <span>至</span>
                    <input onchange="dateHandle()" type="text" id="enddate" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 108px; height: 30px;margin-left:5px;" />
                </div>
                <div id="yearMonth2" style="text-align: center; height: 30px; width: 260px; float: left; margin-top:13px; display: none;">
                    <span>时间：</span>
                    <select id="yearMonthChoise2" style="width: 70px; height: 25px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                    <select id="MonthChoise2" style="width: 50px; height: 25px;">
                        <option>01</option>
                        <option>02</option>
                        <option>03</option>
                        <option>04</option>
                        <option>05</option>
                        <option>06</option>
                        <option>07</option>
                        <option>08</option>
                        <option>09</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                    </select>
                    <span style="margin: 0px 8px 0px 5px;">月份</span>
                </div>
                <div id="yearSeason2" style="text-align: center; height: 30px; width: 260px; float: left; margin-top:13px; display: none;">
                    <span>时间：</span>
                    <select id="yearSeasonChoise2" style="width: 70px; height: 25px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                    <select id="SeasonChoise2" style="width: 50px; height: 25px;">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                    </select>
                    <span style="margin: 0px 8px 0px 5px;">季度</span>
                </div>
                <div id="yearDiv2" style="text-align: center; height: 30px; width: 260px; float: left; margin-top:13px; display: none;">
                    <span>时间：</span>
                    <select id="yearil2" style="width: 70px; height: 25px;"></select>
                    <span style="margin: 0px 8px 0px 5px;">年</span>
                </div>
                <div class="forcastScore">
                    <ul>
                        <li><button type="button" class="btn btn-primary active" id="dayScore2">日评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="monthScore2">月评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="seasonScore2">季评分</button></li>
                        <li><button type="button" class="btn btn-primary" id="yearScore2">年评分</button></li>                        
                    </ul>
                </div>
                <div id="preview_forcast" style="float: left; margin-left:50px;">
                    <ul>
                        <li><button type="button" onclick="YuBaoselect()" class="btn btn-primary">查询</button></li>
                        <li><button type="button" onclick="YuBaoExpore('right')" class="btn btn-primary">导出</button></li>
                    </ul>
                </div>
                <label class="Textin"></label>               
            </div>

            <div style="height: 10px; width: 100%; float: left;"></div>
            <%--表格--%>
            <div id="tablePf" style="height: 210px;margin: auto;padding:0 25px;">
            </div>

            <%--表格--%>
            <div id="Yubaotable" style="height: 260px;margin: auto; display: none">
            </div>

            <%--图标--%>
            <div id="Draw1" style="height: 400px; margin: auto;">
                <div id="SDMonth" style="float: left; width: 48.5%; height: 400px;"></div>
                <div id="SDtemp" style="float: left; width: 49%; height: 400px;"></div>
            </div>
            <div id="Draw2" style="height: 400px; margin: auto; display: none;">
                <div id="DivShow" style="float: left; width: 98%; height: 400px;"></div>
            </div>

        </div>
    </div>
    <div class="ifr_div" style="display: none;">
        <div class="proccess" id="loading" style="display: none;"><b>正在加载中...</b></div>
    </div>

    <script type="text/javascript">
        $(function () {
            $("#forecastTest").addClass("active");
        })
    </script>
</asp:Content>
