#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：DecisionForcastDAL
// 文件功能描述：决策专报报文处理类
//
// 
// 创建者：xgq
// 时间：2017/12/12 18:02:38
//
// 修改人：xgq
// 时间：2017/12/14 14:48:38
// 修改说明：添加决策专报报文内容入库函数
//
//
// 版本：V1.0.0
//----------------------------------------------------------------*/
#endregion
using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class DecisionForcastDAL
    {
        /// <summary>
        /// 决策专报报文内容入库
        /// </summary>
        /// <param name="dt">预报时间</param>
        /// <param name="info">报文内容</param>
        /// <param name="forecaster">预报员</param>
        /// <returns></returns>
        public bool InsertDecisionForecast(DateTime dt, DecisionForecastInfo info, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strID = "";
                int result1 = 0;
                strSQL = "select recid from LFS_DECISIONFORCAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                OracleHelper oh = new OracleHelper("HAIKOUConnect"); 
                strID = oh.db_GreateQuery(strSQL);
                if (strID.Length > 0)
                {
                    strSQL = "update LFS_DECISIONFORCAST set NUMID ='" + info.Numid + "'"
                             + ",SUBHEAD='" + info.Subhead + "'"
                             + ",ABSTRACT='" + info.Abstractcontent + "'"
                             + ",TYPHOONSECONDTITLE1='" + info.Typhoontitle1 + "'"
                             + ",TYPHOONCONTENT1='" + info.Typhooncontent1 + "'"
                             + ",TYPHOONSECONDTITLE2='" + info.Typhoontitle2 + "'"
                              + ",TYPHOONCONTENT2='" + info.Typhooncontent2 + "'"
                               + ",TYPHOONPIC='" + info.Pictyphoontrack + "'"
                                + ",TYHOONPICEXPLAIN='" + info.Pictyphoonexplain + "'"
                              + ",WEATHERSECONDTITLE1='" + info.Weathertitle1 + "'"
                               + ",WEATHERCONTENT1='" + info.Weathercontent1 + "'"
                                + ",WEATHERSECONDTITLE2='" + info.Weathertitle2 + "'"
                                  + ",WEATHERCONTENT2='" + info.Weathercontent2 + "'"
                                  + ",WEATHERPIC1='" + info.Weaherpic1 + "'"
                                  + ",WEATHEREXPLAIN1='" + info.Weatherpicexplain1 + "'"
                                  + ",WEATHERPIC2='" + info.Weaherpic2 + "'"
                                  + ",WEATHEREXPLAIN2='" + info.Weatherpicexplain2 + "'"
                                  + ",RAINSTATABLEPIC='" + info.Rainstatablepic + "'"
                                  + ",RAINSTAEXPLAIN='" + info.Rainstaexplain + "'"
                                  + ",WEATHERFORCAST='" + info.Weatherforcast + "'"
                                  + ",DEFENCEADVICE='" + info.Defenceadvice + "'"
                                  + ",CREATEWORD='" + info.Createword + "'"
                                  + ",OCEANFORECAST='" + info.Oceanforecast + "'"
                                  + ",LANDFORECAST='" + info.Landforecast + "'"
                                  + ",FORECASTER='" + info.Forecastname + "'"
                                  + ",FORECASTDATE='" + info.Forecastdate + "'"
                                  + ",FILEFLAG=0"
                            + " ,WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd HH24:mi:ss')"
                             + " where RECID=" + strID; ;
                }
                else
                {
                    strSQL = "insert into LFS_DECISIONFORCAST(ddatetime,WRITETIME,NUMID,SUBHEAD,ABSTRACT,TYPHOONSECONDTITLE1,TYPHOONCONTENT1,TYPHOONSECONDTITLE2,TYPHOONCONTENT2,TYPHOONPIC,TYHOONPICEXPLAIN,WEATHERSECONDTITLE1,WEATHERCONTENT1,WEATHERSECONDTITLE2,WEATHERCONTENT2,WEATHERPIC1,WEATHEREXPLAIN1,WEATHERPIC2,WEATHEREXPLAIN2,RAINSTATABLEPIC,RAINSTAEXPLAIN,WEATHERFORCAST,DEFENCEADVICE,CREATEWORD,OCEANFORECAST,LANDFORECAST,FORECASTER,FORECASTDATE,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ", to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info.Numid + "'"
                        + ",'" + info.Subhead + "'"
                        + ",'" + info.Abstractcontent + "'"
                        + ",'" + info.Typhoontitle1 + "'"
                        + ",'" + info.Typhooncontent1 + "'"
                        + ",'" + info.Typhoontitle2 + "'"
                        + ",'" + info.Typhooncontent2 + "'"
                         + ",'" + info.Pictyphoontrack + "'"
                          + ",'" + info.Pictyphoonexplain + "'"
                            + ",'" + info.Weathertitle1 + "'"
                               + ",'" + info.Weathercontent1 + "'"
                                 + ",'" + info.Weathertitle2 + "'"
                                   + ",'" + info.Weathercontent2 + "'"
                                      + ",'" + info.Weaherpic1 + "'"
                                      + ",'" + info.Weatherpicexplain1 + "'"
                                      + ",'" + info.Weaherpic2 + "'"
                                      + ",'" + info.Weatherpicexplain2 + "'"
                                      + ",'" + info.Rainstatablepic + "'"
                                      + ",'" + info.Rainstaexplain + "'"
                                      + ",'" + info.Weatherforcast + "'"
                                      + ",'" + info.Defenceadvice + "'"
                                      + ",'" + info.Createword + "'"
                                      + ",'" + info.Oceanforecast + "'"
                                      + ",'" + info.Landforecast + "'"
                                      + ",'" + info.Forecastname + "'"
                                      + ",'" + info.Forecastdate + "'"
                        + ",SEQ_SF_DECISIONFORECAST.Nextval)";
                }
                result1 = oh.db_ExecuteNonQuery(strSQL);
                if (result1 <= 0)
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DDateTime"></param>
        /// <returns></returns>
        public DecisionForecastInfo GetDecisionForecastInfo(DateTime DDateTime)
        {
            DecisionForecastInfo info = GetDecisionForecastInfoNow(DDateTime);
            if (info == null)
            {
                return GetDecisionForecastFromGrid(DDateTime);
            }
            return info;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private DecisionForecastInfo GetDecisionForecastInfoNow(DateTime dt)
        {
            try
            {
                DecisionForecastInfo infoList = null;
                // 原始方法
                string strSQL = "select * from LFS_DECISIONFORCAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new DecisionForecastInfo();
                    infoList.Ddatetime = dt;
                    infoList.Numid = Convert.ToInt32(dTable.Rows[0]["NUMID"]); //报文期号
                    infoList.Subhead = dTable.Rows[0]["SUBHEAD"].ToString(); //副标题
                    infoList.Abstractcontent = dTable.Rows[0]["ABSTRACT"].ToString();//摘要
                    infoList.Typhoontitle1 = dTable.Rows[0]["TYPHOONSECONDTITLE1"].ToString(); //一、台风动态 第一段 标题
                    infoList.Typhooncontent1 = dTable.Rows[0]["TYPHOONCONTENT1"].ToString(); //一、台风动态 第一段 内容
                    infoList.Typhoontitle2 = dTable.Rows[0]["TYPHOONSECONDTITLE2"].ToString(); //一、台风动态 第二段 标题
                    infoList.Typhooncontent2 = dTable.Rows[0]["TYPHOONCONTENT2"].ToString(); //一、台风动态 第二段 内容
                    infoList.Pictyphoontrack = dTable.Rows[0]["TYPHOONPIC"].ToString(); //台风路径图片地址
                    infoList.Pictyphoonexplain = dTable.Rows[0]["TYHOONPICEXPLAIN"].ToString(); //台风路径图片说明
                    infoList.Weathertitle1 = dTable.Rows[0]["WEATHERSECONDTITLE1"].ToString(); //二、天气实况 第一段 标题
                    infoList.Weathercontent1 = dTable.Rows[0]["WEATHERCONTENT1"].ToString(); //二、天气实况 第一段 内容
                    infoList.Weathertitle2 = dTable.Rows[0]["WEATHERSECONDTITLE2"].ToString(); //二、天气实况 第二段 标题
                    infoList.Weathercontent2 = dTable.Rows[0]["WEATHERCONTENT2"].ToString(); //二、天气实况 第二段 内容
                    infoList.Weaherpic1 = dTable.Rows[0]["WEATHERPIC1"].ToString();//过程雨量产品图片1
                    infoList.Weatherpicexplain1 = dTable.Rows[0]["WEATHEREXPLAIN1"].ToString();//过程雨量产品图片说明1
                    infoList.Weaherpic2 = dTable.Rows[0]["WEATHERPIC2"].ToString();//过程雨量产品图片2
                    infoList.Weatherpicexplain2 = dTable.Rows[0]["WEATHEREXPLAIN2"].ToString();//过程雨量产品图片说明2
                    infoList.Rainstatablepic = dTable.Rows[0]["RAINSTATABLEPIC"].ToString();//过程雨量统计表
                    infoList.Rainstaexplain = dTable.Rows[0]["RAINSTAEXPLAIN"].ToString();//过程雨量统计表说明
                    infoList.Weatherforcast = dTable.Rows[0]["WEATHERFORCAST"].ToString(); //三、天气预报
                    infoList.Defenceadvice = dTable.Rows[0]["DEFENCEADVICE"].ToString();//三、天气预报 - 海洋预报
                    infoList.Oceanforecast = dTable.Rows[0]["OCEANFORECAST"].ToString();//三、天气预报 - 陆地预报
                    infoList.Landforecast = dTable.Rows[0]["LANDFORECAST"].ToString();//四、防御建议
                }
                return infoList;
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private DecisionForecastInfo GetDecisionForecastFromGrid(DateTime dt)
        {

            DecisionForecastInfo infoList = null;
            try
            {
                infoList = new DecisionForecastInfo();
                string sql = "select max(NUMID) as NOID from LFS_DECISIONFORCAST t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string newNum = oh.ExecuteScalar(sql).ToString();//欧洲中心最新数据时间

                string timesql = "select max(ddatetime) as latesttime from LFS_DECISIONFORCAST t";
                string latestTime = oh.ExecuteScalar(timesql).ToString();//欧洲中心最新数据时间
                if (latestTime != "")
                {
                    DateTime ecdt = DateTime.Parse(latestTime);

                    if (dt.Ticks > ecdt.Ticks)
                    {
                        infoList.Numid = Convert.ToInt32(newNum) + 1; //报文期号
                    }
                    else
                    {
                        infoList.Numid = Convert.ToInt32(newNum);//报文期号
                    }
                }
                else
                {
                    infoList.Numid = 1;
                }

                string proSql = string.Format(@"select * from wechat_prodocut_hn t where PRO_ID =5");//取入库的三天预报报文数据
                DataTable protable = oh.ExecuteDataTable(proSql);
                string pro_content = protable.Rows[0]["PRO_CONTEXT"].ToString();
                string pastpro = "";//天气回顾
                string futurepro = "";//天气展望
                if (pro_content.Split('；').Length >= 3)
                {
                    pastpro = pro_content.Split('；')[0].Split('：')[1];
                    futurepro = pro_content.Split('；')[1] + "；" + pro_content.Split('；')[2];
                }
                else if (pro_content.Split('；').Length == 2)
                {
                    pastpro = pro_content.Split('；')[0].Split('：')[1];
                    futurepro = pro_content.Split('；')[1];
                }

                string oceansql = string.Format(@"select * from wechat_prodocut_hn t where PRO_ID =2");//取入库的三天预报报文数据
                DataTable oceantable = oh.ExecuteDataTable(oceansql);
                string ocean_content = oceantable.Rows[0]["PRO_CONTEXT"].ToString();
                string[] arrayOcean = ocean_content.Split(new char[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries);
                //string[] arrayOcean = ocean_content.Split(' ');//new char[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries 
                string typhoonContent = "";
                string oceanContent = "";
                if (arrayOcean.Length >= 4)
                {
                    typhoonContent = arrayOcean[1];
                    oceanContent = arrayOcean[3];
                }
                else
                {
                    typhoonContent = "";
                    oceanContent = arrayOcean[1];
                }
                infoList.Ddatetime = dt;
                infoList.Subhead = "——我市今天XXX，“XXX”已生成"; //副标题
                infoList.Abstractcontent = "";//摘要
                infoList.Typhoontitle1 = "1、热带低压"; //一、台风动态 第一段 标题
                infoList.Typhooncontent1 = ""; //一、台风动态 第一段 内容
                infoList.Typhoontitle2 = "2、X号台风“XXX”"; //一、台风动态 第二段 标题
                infoList.Typhooncontent2 = typhoonContent; //一、台风动态 第二段 内容
                infoList.Pictyphoontrack = "1507877525.png"; //台风路径图片
                infoList.Pictyphoonexplain = "图1 台风“XXX”和热带低压预报路径图"; //台风路径图片说明
                infoList.Weathertitle1 = "1、昨天降水实况"; //二、天气实况 第一段 标题
                infoList.Weathercontent1 = "受XXX影响，昨天（" + dt.AddDays(-1).Day.ToString() + "日08时～" + dt.Day.ToString() + "日08时），我市XXX，详见图2、表1。"; //二、天气实况 第一段 内容
                infoList.Weathertitle2 = "2、过程雨量实况"; //二、天气实况 第二段 标题
                infoList.Weathercontent2 = "据统计，" + dt.AddDays(-2).Day.ToString() + "日20时～" + dt.Day.ToString() + "日08时，强降水中心在我市XXX，市区出现XXX。共有X个乡镇超过100毫米，分别为XXX，详见图3、表1。"; //二、天气实况 第二段 内容
                infoList.Weaherpic1 = "1508145946.jpg";//过程雨量产品图片1
                infoList.Weatherpicexplain1 = "图2 " + dt.Year.ToString() + "年" + dt.Month.ToString() + "月" + dt.AddDays(-1).Day.ToString() + "日08时-" + dt.Day.ToString() + "日08时过程雨量（单位：毫米）";//过程雨量产品图片说明1
                infoList.Weaherpic2 = "1508145984.jpg";//过程雨量产品图片2
                infoList.Weatherpicexplain2 = "图3 " + dt.Year.ToString() + "年" + dt.Month.ToString() + "月" + dt.AddDays(-2).Day.ToString() + "日20时-" + dt.Day.ToString() + "日08时过程雨量（单位：毫米）";//过程雨量产品图片说明2
                infoList.Rainstatablepic = "";//过程雨量统计表
                infoList.Rainstaexplain = "表1 海口市过程雨量统计表（单位：毫米）";//过程雨量统计表说明
                infoList.Weatherforcast = pastpro; //三、天气预报
                infoList.Defenceadvice = "";//四、防御建议
                infoList.Oceanforecast = oceanContent;//三、天气预报 - 海洋预报
                infoList.Landforecast = futurepro;//三、天气预报 - 陆地预报
                return infoList;
            }
            catch (Exception ex)
            {

            }           
            return null;
        }
    }
}
