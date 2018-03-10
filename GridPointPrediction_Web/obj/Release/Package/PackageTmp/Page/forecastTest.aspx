<%@ Page Title="预报检验评分" Language="C#" MasterPageFile="~/Page/Site.Master" AutoEventWireup="true" CodeBehind="forecastTest.aspx.cs" Inherits="GridPointPrediction_Web.Page.forecastTest" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <script src="../Script/PageScript/forecastTest.js?B2" type="text/javascript"></script>
         <script src="../Script/Charts/highcharts.js" type="text/javascript"></script>
    <script src="../Script/time/ToolsDateTime.js" type="text/javascript"></script>
    <script src="../Script/time/My97DatePicker/WdatePicker.js" type="text/javascript"></script>
     <link href="../Style/PageStyle/forecastExamise.css?var202" rel="stylesheet" type="text/css" />
    
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
        <div style="background:#DEDDDD;height:10px;width: 100%;margin: auto;"></div>
    <div id="allContent">
    <%--头部--%>




    <div class="top">
    <div id="mean" style="width:800px; height:53px;margin-left: 10px;">
    <label id="btn01" class="button" style="background:#fff;">准确率评分</label>
    <label id="btn02" class="button">技巧评分</label>
    <label id="btn03" class="button">要素评分</label>
    <label id="btn06" class="button">预报评分</label>
    <label id="btn04" class="button" style="display:none;">降雨分级检验</label>
    <label id="btn05" class="button" style="display:none;">格点预报检验</label>
    </div>

   <%--准确率--%>
    <div id="rightDate">
   <div id="yearDay"style="text-align: center;height: 30px;width: 260px;float:left;display:block;" >
    <input  onchange="dateHandle()" type="text" id="datestart" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 20px;width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="dateend" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
    </div>
    <div id="yearMonth" style="text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearMonthChoise" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    <select id="MonthChoise" style="width: 50px;height: 25px;"><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select>
   <span>月份</span>
    </div>
        <div id="yearSeason" style="text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearSeasonChoise" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    <select id="SeasonChoise" style="width: 50px;height: 25px;"><option>1</option><option>2</option><option>3</option><option>4</option></select>
   <span>季度</span>
    </div>
     <div id="yearDiv" style=" text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearil" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    </div>


    <label id="dayScore" onclick="DayScore('day')" style="    border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #0976c2;margin-left: 60px;color: #fff;font-size: 13px;">日评分</label>
     <label id="monthScore" onclick="MonthScore('month')" style="    border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">月评分</label>
      <label id="seasonScore" onclick="SeasonScore('season')" style=" border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">季评分</label>
       <label id="yearScore" onclick="YearScore('year')" style="    border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">年评分</label>
       <label onclick="select()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
       <label onclick="Expore('right')" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left: 8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
       <label  class="Textin">备注：逐时预报气温只评定整点误差</label>
        </div>

    <%--技巧--%>
    <div id="jiqiao" style="display:none;">
     <input  onchange="dateHandle()" type="text" id="Text1" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 25px;width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="Text2" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
   <label onclick="techSelect()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
   <label onclick="Expore('jiqiao')" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left:8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
    </div>

    <div id="yaosu"  style="display:none;">
     <input  onchange="dateHandle()" type="text" id="Text3" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 25px;width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="Text4" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
   <label onclick="ElementSelect()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
   <label onclick="Expore('yaosu')" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left: 8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
         <asp:button runat="server" type="button" class="btn btn-primary" id="Button1" onclick="Button2_Click" style="display:none;" Text="导出Excel" />
           <input runat="server" id="filename" type="hidden" value="" />
    </div>

    <div id="jiangyu" style="display:none;">
     <input  onchange="dateHandle()" type="text" id="Text5" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="Text6" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
   <label onclick="rainSelect()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
<label style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left: 8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
<label class="Textin-rain">分级标准：大于等于0.1小于等于2为小雨，大于2小于等于10为中雨，大于10小雨等于20为大雨，大于20为暴雨（单位：毫米）</label>
    </div>
    
    <div id="gedian" style="display:none;">
    <input  onchange="dateHandle()" type="text" id="Text7" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="Text8" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
    
    <label style="cursor: pointer;display: inline-block;width: 80px;height: 20px;text-align: center;line-height: 20px;background: #0976c2;margin-left: 80px;color: #fff;font-size: 13px;">日评分</label>
     <label style="cursor: pointer;display: inline-block;width: 80px;height: 20px;text-align: center;line-height: 20px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">月评分</label>
      <label style="cursor: pointer;display: inline-block;width: 80px;height: 20px;text-align: center;line-height: 20px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">季评分</label>
       <label style="cursor: pointer;display: inline-block;width: 80px;height: 20px;text-align: center;line-height: 20px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">年评分</label>
       <label onclick="tableSelect()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
       <label style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left: 8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
    </div>

   
   <%--预报员--%>
    <div id="yubaoDate" style="display:none">
   <div id="yeartime"style="text-align: center;height: 30px;width: 260px;float:left;display:block;" >
    <input  onchange="dateHandle()" type="text" id="startdate" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="margin-left: 20px;width: 100px; height: 20px;"/>
    <span>至</span>
    <input  onchange="dateHandle()" type="text" id="enddate" class="Wdate dtPack" onclick="WdatePicker({ skin: 'whyGreen', dateFmt: 'yyyy-MM-dd' })" style="width: 100px; height: 20px;"/>
    </div>
    <div id="yearMonth2" style="text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearMonthChoise2" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    <select id="MonthChoise2" style="width: 50px;height: 25px;"><option>01</option><option>02</option><option>03</option><option>04</option><option>05</option><option>06</option><option>07</option><option>08</option><option>09</option><option>10</option><option>11</option><option>12</option></select>
   <span>月份</span>
    </div>
        <div id="yearSeason2" style="text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearSeasonChoise2" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    <select id="SeasonChoise2" style="width: 50px;height: 25px;"><option>1</option><option>2</option><option>3</option><option>4</option></select>
   <span>季度</span>
    </div>
     <div id="yearDiv2" style=" text-align: center;height: 30px;width: 260px;float:left;display:none;">
    <select id="yearil2" style="width: 70px;height: 25px;"></select>
    <span>年</span>
    </div>


    <label id="DayScore2" onclick="DayScore2('day')" style="border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #0976c2;margin-left: 60px;color: #fff;font-size: 13px;">日评分</label>
     <label id="monthScore2" onclick="MonthScore2('month')" style="    border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">月评分</label>
      <label id="seasonScore2" onclick="SeasonScore2('season')" style=" border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">季评分</label>
       <label id="yearScore2" onclick="YearScore2('year')" style="    border-right: 1px solid rgb(221, 221, 221);cursor: pointer;display: inline-block;width: 80px;height: 25px;text-align: center;line-height: 25px;background: #5dbcfe;margin-left: -4px;color: #fff;font-size: 13px;">年评分</label>
       <label onclick="YuBaoselect()" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #fe5553;margin-left: 40px;color: #fff;font-size: 15px;border-radius: 5px;cursor: pointer;">查询</label>
       <label onclick="YuBaoExpore('right')" style="display: inline-block;width: 75px;height: 25px;text-align: center;line-height: 25px;background: #e4e4e4;margin-left: 8px;border: 1px solid #aaa;font-size: 15px;border-radius: 5px;cursor: pointer;">导出</label>
       <label  class="Textin"></label>
        </div>



    </div>
     <div style="background:#DEDDDD;height:10px;"></div>
    <%--表单--%>
    <div  style="margin-top: 10px;width: 1520px;margin: auto;height: 675px; background: #fff;margin-left: 10px;">
        <div style="height:10px;width:100%;float:left;"></div>
    <%--表格--%>
     <div id="tablePf" style="height: 210px;width: 1470px;margin: auto;">
     </div>

     <%--表格--%>
     <div id="Yubaotable" style="height: 260px;width: 1470px;margin: auto;display:none">
     </div>

    <%--图标--%>
    <div id="Draw1" style="width: 1485px;height: 400px;margin: auto;">
    <div id="SDMonth" style="float: left; width:740px;height: 400px;"></div>
    <div id="SDtemp" style="float: left; width: 740px;height: 400px;"></div>
    </div>
     <div id="Draw2" style="width: 1485px;height: 400px;margin: auto;display: none;">
    <div id="DivShow" style="float: left; width: 1460px;height: 400px;"></div>
    </div>

    </div>
</div>
 <div class="ifr_div" style="display:none;"> 
    <div class="proccess" id="loading" style="display:none;"><b>正在加载中...</b></div> 
<%--    <iframe id="sfa" name="sfa" frameborder="0" scrolling="auto" height="600" width="600"></iframe> --%>
</div> 


</asp:Content>
