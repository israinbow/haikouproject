<%@ Page Language="C#"   MasterPageFile="MainForm.Master" AutoEventWireup="true" CodeBehind="Help.aspx.cs" Inherits="GridPointPrediction_Web.Page.Help" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">
    <title>帮助</title>
    <link rel="stylesheet" type="text/css" href="../style/PageStyle/Help.css" />
    <link rel="stylesheet" href="../Script/bootstrap-3.3.5/css/bootstrap.css" />
    <script type="text/javascript" src="../Script/PageScript/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Script/PageScript/Help.js"></script>
</asp:content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <div class="container-fluid box">
            <div class="row">
                <%--左侧菜单栏--%>
                <div class="col-lg-2 col-md-2 col-sm-2 sidebar_menu">
                    <h4>帮助</h4>
                    <ul class="menu_list">
                        <li class="active">关于系统</li>
                        <li>关于使用</li>
                        <li>操作指南</li>
                        <li>运行环境</li>
                        <li>系统功能</li>
                    </ul>
                </div>
                 <%--菜单栏切换内容区域--%>
                <div class="col-lg-9 col-md-9 col-sm-9 content">
                    <div class="innerCont">
                        <div class="aboutSys">
                            <h4 style="text-align: center; color: #337ab7; border-bottom: 1px solid #D4D4D4; width: 100%; padding-bottom: 20px;">关于系统</h4>
                            <span>系统介绍</span>
                            <p>该系统是建设海口预报服务支撑平台，形成一个集信息采集、监测、制作、分发、监控、显示、检验、管理于一体的高效集约化的业务支撑平台。平台包括监测显示、智能预报制作、一键式分发、产品管理查看、客观检验评分、工作提醒等功能模块。</p>
                            <span>开发单位</span>
                            <p style="margin-bottom: 40px;">
                                深圳市雅码科技有限公司是一家从事地理信息系统应用、多媒体空间可视化系统、数据可视化处理、电信管理系统等软件研发、生产和销售的高科技企业。
    公司拥有一支由电GIS专家、信息可视化专家、统计制图专家及勇于创新的管理者组成的高素质团队，公司致力于将优秀的信息可视化技术与行业应用相结合，为行业客户提供优质专业的GIS、信息可视化、网络业务管理、统计制图等领域的技术服务和成熟而实用的个性化软件产品。
    雅码科技注册于高科技企业云集的深圳市南山区。公司在立足于自主知识产权产品开发的同时，积极与国内外优秀软件企业合作，引进吸收国外先进的技术和产品。雅码科技秉承开发与市场并重的经营理念，强调优质的服务是公司的核心竞争力。
                            </p>
                            <b>深圳市雅码科技有限公司</b>
                            <b>网址：www.yamatech.cn</b>
                            <b>服务电话：0755-86228368 </b>
                            <b>传真：0755-86228362</b>
                            <b>邮件：zwh@yamatech.cn sssabc@126.com</b>
                        </div>
                        <div class="sysFunc" style="display: none;">
                            <h4 style="text-align: center; color: #337ab7; border-bottom: 1px solid #D4D4D4; width: 100%; padding-bottom: 20px;">系统功能</h4>
                            <p>该系统是建设海口预报服务支撑平台，形成一个集信息采集、监测、制作、分发、监控、显示、检验、管理于一体的高效集约化的业务支撑平台。平台包括监测显示、智能预报制作、一键式分发、产品管理查看、客观检验评分、工作提醒等功能模块。具体内容有：</p>
                            <span>1、综合信息显示平台</span>
                            <p>基于WEBGIS，可动态显示各类定量估测预报、雷达回波实况及预报、自动站、探空资料、闪电定位等各类监测信息以及多产品合成图等多轨道监测及多模式数值预报产品。</p>
                            <span>2、格点精细化预报产品显示制作子系统</span>
                            <p>系统具备向导式的编辑制作发布流程。支持格点和分区预报多时次（24小时逐小时更新、空间分辨率3公里）的天空状况、风（风速、风向）、气温、降雨量、湿度、能见度等要素信息的精细化制作，系统以海南省格点预报产品为默认预报结果，根据自动站实况自动订正，作为精细预报制作的参考依据在制作主窗口的可视化图表中集约展示。实现城市热岛、通风廊道、暴雨强度公式、风能、太阳能辐射细网格气候信息城市气象服务系统的应用。</p>
                            <span>3、强对流天气提醒</span>
                            <p>根据短临系统预警提示和未来1-3小时定量降水预报及探空资料，提供降强水、雷电、雷雨大风、冰雹等的强对流天气指导提醒，建立完善强对流天气预报概念模型，对流特征量（Cape、Dcape、K指数、对流温度、SI指数、风切变、强天气威胁指数等）及变量为基础的预报指标滚动提醒。</p>
                            <span>4、预报产品集成子系统</span>
                            <p>
                                系统支持分区预报、格点预报、站点预报切换制作，文字和图形编辑模式，并可选择叠加雷达回波产品。系统能根据制作完成的格点、分区预报产品，自动生成乡镇预报、景点预报、交通预报、内涝预报、空气污染扩散条件预报、生活指数、上下班预报、短时预报等预报产品。
同时，系统可固定模板，自动读取省级指导产品或前一次预报产品，实现各决策产品的制作模块，决策产品包含临近预报、农业气象专报、交通气象专报、一周专报、快报、节假日专报及重大活动专报、旬月报、今冬明春及汛期预报。
实现城市内涝系统对接，可通过预报服务平台完成城市内涝预警发布和制作。实现内涝点、雷电灾害风险隐患点等信息在城市内涝预警系统显示，城市内涝模型的集成。
系统具备产品预览审核功能，强制预报员在发布产品前必须审查过后才可发布。
                            </p>
                            <span>5、预报产品分发子系统</span>
                            <p>系统与各分发渠道建立标准的接口，具备精细化分区预报产品的快速分发功能，同时自动入库备份，同时，该系统与突发预警信息发布系统对接，可实现城市预警产品的一键式发布。各分发渠道为独立显存，分发模式为多线程并发模式。分发时效在5分钟内，分发渠道包括国突、气象信息服务网、微博、微信、手机短信、电子显示屏、大喇叭、产品库、传真、邮箱。</p>
                            <span>6、产品回溯显示子系统</span>
                            <p>实现对历史格点预报、分区预报以及各预报产品的回溯及查看，查看范围包括制作、分发、显示详情。</p>
                            <span>7、客观检验评分子系统</span>
                            <p>实现对精细化预报各要素进行客观检验和评分。检验内容包括各区温度预报的误差和准确率，降水预报的误差，TS评分、空报率、漏报率等，风速的误差和准确率，风向的误差和准确率。可按任意时段自动到处评分结果，评分结果在系统上直观显示。</p>
                            <span>8、预报制作管理子系统</span>
                            <p>实现各用户绑定登陆、操作记录、查看，并针对预报服务制作流程，实现提醒功能。</p>
                        </div>
                        <div class="operateEnvironment" style="display: none">
                            <h4 style="text-align: center; color: #337ab7; border-bottom: 1px solid #D4D4D4; width: 100%; padding-bottom: 20px;">运行环境</h4>
                            <p>系统运行软件环境：</p>
                            <span>1、操作系统 Windows Server 2003</span>
                            <span>2、开发环境 Visual Studio 2005</span>
                            <span>3、数据环境 Oracle 10g</span>
                            <span>4、控件环境 Yamamap</span>
                            <span>5、框架环境 dotnetfxcn1.1 dotnetfxcn2.0及3.5</span>
                            <span>6、GIS环境 ARCGIS 9</span>
                            <span>7、Office2007</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
