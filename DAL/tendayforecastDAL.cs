using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DAL
{
    public class tendayforecastDAL
    {

        public List<ScoreTotalInfo> GetScoreRainGradetextDAL(string dtStart, string dtEnd)
        {
            #region 新方法
            List<ScoreTotalInfo> infoList = null;
            try
            {
                //晴雨
                string sql = @"select round((t.forecasttime-t.ddatetime) * 24,2) hour,
sum(t.raincorrect2) raincorrect2,sum(t.rainnull2) rainnull2,sum(t.rainlost2) rainlost2,
sum(t.raincorrect10) raincorrect10,sum(t.rainnull10) rainnull10,sum(t.rainlost10) rainlost10,
sum(t.raincorrect20) raincorrect20,sum(t.rainnull20) rainnull20,sum(t.rainlost20) rainlost20,
sum(t.raincorrect20plus) raincorrect20plus,sum(t.rainnull20plus) rainnull20plus,sum(t.rainlost20plus) rainlost20plus
from lfs_scoredata_rain_new t  where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and " +
        "to_date('" + dtEnd + @" 23:59:59','yyyy-mm-dd hh24:mi:ss') group by  round((t.forecasttime-t.ddatetime) * 24,2)
order by round((t.forecasttime-t.ddatetime) * 24,2)";
                OracleHelper oh = new OracleHelper("EJETDB247LFS");
                DataTable dtTable = oh.ExecuteDataTable(sql);
                infoList = new List<ScoreTotalInfo>();
                if (dtTable == null || dtTable.Rows.Count == 0) return null;
                double dScore; double d0, d1, d2;
                for (int i = 0; i < dtTable.Rows.Count; i++)
                {
                    ScoreTotalInfo info;
                    info = new ScoreTotalInfo();

                    info.ScoreHour = "第" + dtTable.Rows[i]["hour"].ToString() + "小时";
                    dScore = 0;
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["raincorrect2"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["rainnull2"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["rainlost2"].ToString(), out d2);
                    if ((d0 + d1 + d2) > 0)
                    {
                        dScore = double.Parse(Getpercent((d0) / (d0 + d1 + d2)));
                        dScore = Math.Round(dScore, 1);
                        info.SmallRain = dScore.ToString();
                    }
                    else
                    {
                        info.SmallRain = "无";
                    }
                    dScore = 0;
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["raincorrect10"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["rainnull10"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["rainlost10"].ToString(), out d2);
                    if ((d0 + d1 + d2) > 0)
                    {
                        dScore = double.Parse(Getpercent((d0) / (d0 + d1 + d2)));
                        dScore = Math.Round(dScore, 1);
                        info.MediumRain = dScore.ToString();
                    }
                    else
                    {
                        info.MediumRain = "无";
                    }
                    dScore = 0;
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["raincorrect20"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["rainnull20"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["rainlost20"].ToString(), out d2);
                    if ((d0 + d1 + d2) > 0)
                    {
                        dScore = double.Parse(Getpercent((d0) / (d0 + d1 + d2)));
                        dScore = Math.Round(dScore, 1);
                        info.LargeRain = dScore.ToString();
                    }
                    else
                    {
                        info.LargeRain = "无";
                    }
                    dScore = 0;
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["raincorrect20plus"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["rainnull20plus"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["rainlost20plus"].ToString(), out d2);
                    if ((d0 + d1 + d2) > 0)
                    {
                        dScore = double.Parse(Getpercent((d0) / (d0 + d1 + d2)));
                        dScore = Math.Round(dScore, 1);
                        info.StormRain = dScore.ToString();
                    }
                    else
                    {
                        info.StormRain = "无";
                    }

                    infoList.Add(info);
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return infoList;
            #endregion
        }
        public List<ScoreTotalInfo> Get6HourScoreTotaltestDAL(string dtStart, string dtEnd)
        {
            #region 新方法
            List<ScoreTotalInfo> infoList = null;
            try
            {
                //晴雨
                string sql = "select sum(RAINSUN)  RAINSUN,sum(RAINNULL)  RAINNULL,sum(RAINLOST)  RAINLOST,sum(RAINNO)"
                    + " RAINNO,cityname,max(ddatetime) maxtime,min(ddatetime) mintime , sum(RAINSUN30MM) RAINSUN30MM,"
                    + " sum(RAINNULL30MM) RAINNULL30MM,sum(RAINLOST30MM) RAINLOST30MM,round(avg(MINT),2) minTemp, round(avg(MAXT),2) maxTemp from lfs_scorecity12hourdata t where"
                    + " ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss')"
                    + " and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss') and cityname <> '广州'"
                    + " and to_char(ddatetime,'hh24miss')<>'100000' and (to_char(t.ddatetime, 'hh24') = '08' or to_char(t.ddatetime, 'hh24') = '20') group by cityname";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtTable = oh.ExecuteDataTable(sql);
                DataTable dtTemp = null;
                dtTemp = dtTable.Copy();
                //晴雨（欧洲中心）
                sql = "select '欧洲中心' cityname, sum(RAINSUN)  RAINSUN,sum(RAINNULL)  RAINNULL,sum(RAINLOST)  RAINLOST,sum(RAINNO) " +
        "RAINNO,max(ddatetime) maxtime,min(ddatetime) mintime ,sum(RAINCORRECT20) RAINSUN30MM, sum(RAINNULL20) RAINNULL30MM,sum(RAINLOST20) RAINLOST30MM,round(avg(MINT),2) minTemp, round(avg(MAXT),2) maxTemp from lfs_scoreecmwfdata t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and " +
        "to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                DataTable dtTableEurope = oh.ExecuteDataTable(sql);
                if (dtTableEurope.Rows.Count > 0)
                {
                    dtTable.ImportRow(dtTableEurope.Rows[0]);
                }

                //晴雨（精细化数值预报气象要素释用技术研究项目）
                sql = @"select '精细化数值' cityname, sum(RAINSUN)  RAINSUN,sum(RAINNULL)  RAINNULL,sum(RAINLOST)  RAINLOST,sum(RAINNO)
RAINNO,max(ddatetime) maxtime,min(ddatetime) mintime ,sum(raincorrectheavy) RAINSUN30MM,
sum(rainnullheavy) RAINNULL30MM,sum(rainlostheavy) RAINLOST30MM,
round(avg(mintempdiff),2) minTemp, round(avg(maxtempdiff),2) maxTemp from LFS_SCORE_RESEARCH t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and " +
        "to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss') and ybsx = 24";
                DataTable dtTableBigCity = oh.ExecuteDataTable(sql);
                if (dtTableBigCity.Rows[0][1].ToString() != "")
                {
                    //dtTable.ImportRow(dtTableBigCity.Rows[0]);//注意：由于没有精细化数值预报数据，此处暂时不添加
                }


                infoList = new List<ScoreTotalInfo>();
                if (dtTable == null || dtTable.Rows.Count == 0) return null;
                double dScore; double d0, d1, d2, d3;
                for (int i = 0; i < dtTable.Rows.Count; i++)
                {
                    ScoreTotalInfo info;
                    info = new ScoreTotalInfo();

                    //info.ScoreName = dtStart + "至" + dtEnd;
                    if (dtTable.Rows[i]["cityname"].ToString() == "北京")
                    {
                        info.ScoreName = "中国局";
                    }
                    else
                    {
                        info.ScoreName = dtTable.Rows[i]["cityname"].ToString();
                    }
                    dScore = 0;
                    double.TryParse(dtTable.Rows[i]["maxTemp"].ToString(), out dScore);
                    info.Score1 = Math.Round(dScore, 1, MidpointRounding.AwayFromZero);
                    dScore = 0;
                    double.TryParse(dtTable.Rows[i]["minTemp"].ToString(), out dScore);
                    info.Score2 = Math.Round(dScore, 1, MidpointRounding.AwayFromZero);
                    dScore = 0;
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["rainsun"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINNULL"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINLOST"].ToString(), out d2);
                    d3 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINNO"].ToString(), out d3);
                    if ((d0 + d1 + d2 + d3) > 0)
                    {
                        dScore = double.Parse(Getpercent((d0 + d3) / (d0 + d1 + d2 + d3)));
                        dScore = Math.Round(dScore, 1);
                    }
                    info.Score3 = dScore;
                    dScore = 0;
                    //double.TryParse(dtTable.Rows[0]["RAINACCURACY"].ToString(), out dScore);
                    //if ((d0 + d1 + d2) > 0)
                    //{
                    //    dScore = (dScore-d3) / (d0 + d1 + d2);
                    //    dScore = Math.Round(dScore, 3);
                    //}
                    d0 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINSUN30MM"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINNULL30MM"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(dtTable.Rows[i]["RAINLOST30MM"].ToString(), out d2);
                    dScore = 0;
                    if (d0 + d1 + d2 > 0)
                    {
                        dScore = double.Parse(Getpercent(d0 / (d0 + d1 + d2)));
                        dScore = Math.Round(dScore, 1);
                        info.ScoreRain = dScore.ToString();
                    }
                    else
                    {
                        info.ScoreRain = "无";
                    }
                    infoList.Add(info);
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return infoList;
            #endregion

            #region 原方法
            //List<ScoreTotalInfo> infoList = null;
            //try
            //{
            //    string sql = " select    sum(rainsun) rainsun, sum(RAINNULL) RAINNULL, sum(RAINLOST) RAINLOST, sum(RAINNO) RAINNO,round(avg(MINTEMPACCURACY),3) MINTEMPACCURACY,round(avg(MAXTEMPACCURACY),3) MAXTEMPACCURACY,round(avg(RAINACCURACY),3) RAINACCURACY  from lfs_score6hourdata where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')    ";
            //    DataTable dtTable = db_GreateDataTable("EJETDB247LFS", sql);
            //    infoList = new List<ScoreTotalInfo>();
            //    if (dtTable == null || dtTable.Rows.Count == 0) return null;

            //    double dScore; double d0, d1, d2, d3;
            //    ScoreTotalInfo info;
            //    info = new ScoreTotalInfo();

            //    info.ScoreName = dtStart + "至" + dtEnd;

            //    dScore = 0;
            //    double.TryParse(dtTable.Rows[0]["MAXTEMPACCURACY"].ToString(), out dScore);
            //    info.Score1 = dScore;
            //    dScore = 0;
            //    double.TryParse(dtTable.Rows[0]["MINTEMPACCURACY"].ToString(), out dScore);
            //    info.Score2 = dScore;
            //    dScore = 0;
            //    d0 = 0;
            //    double.TryParse(dtTable.Rows[0]["rainsun"].ToString(), out d0);
            //    d1 = 0;
            //    double.TryParse(dtTable.Rows[0]["RAINNULL"].ToString(), out d1);
            //    d2 = 0;
            //    double.TryParse(dtTable.Rows[0]["RAINLOST"].ToString(), out d2);
            //    d3 = 0;
            //    double.TryParse(dtTable.Rows[0]["RAINNO"].ToString(), out d3);
            //    if ((d0 + d1 + d2 + d3) > 0)
            //    {
            //        dScore = (d0 + d3) / (d0 + d1 + d2 + d3);
            //        dScore = Math.Round(dScore, 3);
            //    }
            //    info.Score3 = dScore;
            //    dScore = 0;
            //    double.TryParse(dtTable.Rows[0]["RAINACCURACY"].ToString(), out dScore);
            //    //if ((d0 + d1 + d2) > 0)
            //    //{
            //    //    dScore = (dScore-d3) / (d0 + d1 + d2);
            //    //    dScore = Math.Round(dScore, 3);
            //    //}
            //    info.Score4 = dScore;

            //    infoList.Add(info);
            //}
            //catch (Exception ex)
            //{
            //    ErrWriter(ex);
            //}
            //return infoList;
            #endregion
        }

        public List<Score12HourStrEntity> Get12HourgrostestSScoreDAL(string dtStart, string dtEnd)
        {
            try
            {
                //如果欧洲中心表在该时间段没有数据，则不评欧洲中心
                bool isOuZhou = false;
                List<Score12HourStrEntity> ls = new List<Score12HourStrEntity>();
                //晴雨
                string sql = "select sum(RAINSUN)  RAINSUN,sum(RAINNULL)  RAINNULL,sum(RAINLOST)  RAINLOST,sum(RAINNO) RAINNO,cityname,max(ddatetime) maxtime,min(ddatetime) mintime "
                    +"from lfs_scorecity12hourdata t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') "
                    +"and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss') "
                    +"and to_char(ddatetime,'hh24miss')<>'100000' "
                    +"and (to_char(t.ddatetime, 'hh24') = '08' or  to_char(t.ddatetime, 'hh24') = '20') group by cityname";

                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtTable = oh.ExecuteDataTable(sql);
                //晴雨（欧洲中心）
                sql = "select '欧洲中心' cityname, sum(RAINSUN)  RAINSUN,sum(RAINNULL)  RAINNULL,sum(RAINLOST)  RAINLOST,sum(RAINNO) RAINNO,max(ddatetime) maxtime,min(ddatetime) mintime "
                    +"from lfs_scoreecmwfdata t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') "
                    +"and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";

                DataTable dtTableEurope = oh.ExecuteDataTable(sql);
                if (dtTableEurope.Rows[0]["RAINSUN"] != null && dtTableEurope.Rows[0]["RAINSUN"].ToString() != "")
                {
                    dtTable.ImportRow(dtTableEurope.Rows[0]);
                    isOuZhou = true;
                }
                double dScore; double d0, d1, d2, d3;
                foreach (DataRow item in dtTable.Rows)
                {
                    Score12HourStrEntity she = new Score12HourStrEntity();

                    d0 = 0;
                    double.TryParse(item["rainsun"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(item["RAINNULL"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(item["RAINLOST"].ToString(), out d2);
                    d3 = 0;
                    double.TryParse(item["RAINNO"].ToString(), out d3);
                    dScore = 0;
                    if ((d0 + d1 + d2 + d3) > 0)
                    {
                        dScore = (d0 + d3) / (d0 + d1 + d2 + d3);
                        //dScore = Math.Round(dScore, 2);
                        dScore = Math.Round(dScore, 2, MidpointRounding.AwayFromZero);
                    }
                    she.CityName = item["cityname"].ToString();
                    she.SzPc = dScore.ToString();
                    she.StrDtime = Convert.ToDateTime(item["mintime"].ToString()).ToString("yyyy-MM-dd") + "至" + Convert.ToDateTime(item["maxtime"].ToString()).ToString("yyyy-MM-dd");
                    ls.Add(she);
                }
                Score12HourStrEntity she2 = new Score12HourStrEntity();
                Score12HourStrEntity she3 = new Score12HourStrEntity();
                she2.SzPc = (from a in ls where a.CityName == "海口" select a.SzPc).FirstOrDefault();
                she2.GzPc = (from a in ls where a.CityName == "欧洲中心" select a.SzPc).FirstOrDefault();
                she2.BjPc = (from a in ls where a.CityName == "北京" select a.SzPc).FirstOrDefault();

                d0 = Convert.ToDouble(she2.SzPc);
                d1 = Convert.ToDouble(she2.BjPc);
                if (1 - d1 != 0)
                {
                    //深圳台对中央台晴雨技巧
                    she2.SzBjGzPc = Math.Round((d0 - d1) / (1 - d1), 2, MidpointRounding.AwayFromZero).ToString();
                }
                else
                {
                    she2.SzBjGzPc = "1";
                }

                d0 = Convert.ToDouble(she2.SzPc);
                d1 = Convert.ToDouble(she2.GzPc);
                //深圳台对欧洲中心晴雨技巧
                if (1 - d1 != 0)
                {
                    she3.SzBjGzPc = Math.Round((d0 - d1) / (1 - d1), 2, MidpointRounding.AwayFromZero).ToString();
                }
                else
                {
                    she3.SzBjGzPc = "1";
                }

                she2.StrDtime = (from a in ls where a.CityName == "海口" select a.StrDtime).FirstOrDefault();
                she3.StrDtime = (from a in ls where a.CityName == "海口" select a.StrDtime).FirstOrDefault();
                List<Score12HourStrEntity> ls_new = new List<Score12HourStrEntity>();

                sql = "select round(avg(MINT),2) avgmint, round(avg(MAXT),2) avgmaxt,cityname, " +
     " max(ddatetime) maxtime,min(ddatetime) mintime from lfs_scorecity12hourdata t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and " +
     "to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')  and to_char(ddatetime,'hh24miss')<>'100000' and (to_char(t.ddatetime, 'hh24') = '08' or  to_char(t.ddatetime, 'hh24') = '20') group by cityname";
                dtTable = oh.ExecuteDataTable(sql);

                sql = "select round(avg(MINT),2) avgmint, round(avg(MAXT),2) avgmaxt,'欧洲中心' cityname ,max(ddatetime) maxtime,min(ddatetime) mintime " +
     " from lfs_scoreecmwfdata t   where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') " +
     " and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss') and to_char(ddatetime,'hh24miss')<>'100000'";
                dtTableEurope = oh.ExecuteDataTable(sql);
                if (dtTableEurope.Rows[0]["avgmaxt"] != null && dtTableEurope.Rows[0]["avgmaxt"].ToString() != "")
                {
                    dtTable.ImportRow(dtTableEurope.Rows[0]);
                }
                List<Score12HourStrEntity> ls_tmpe = new List<Score12HourStrEntity>();
                foreach (DataRow item in dtTable.Rows)
                {
                    Score12HourStrEntity she = new Score12HourStrEntity();
                    d0 = 0;
                    double.TryParse(item["avgmaxt"].ToString(), out d0);
                    she.StrDtime = Convert.ToDateTime(item["mintime"].ToString()).ToString("yyyy-MM-dd") + "至" + Convert.ToDateTime(item["maxtime"].ToString()).ToString("yyyy-MM-dd");
                    she.SzAVGMaxT = d0;
                    d1 = 0;
                    double.TryParse(item["avgmint"].ToString(), out d1);
                    she.SzAVGMinT = d1;
                    she.CityName = item["cityname"].ToString();
                    ls_tmpe.Add(she);
                }
                //she2 = new Score12HourStrEntity();
                she2.SzPc = (from a in ls_tmpe where a.CityName == "海口" select a.SzAVGMaxT.ToString()).FirstOrDefault();
                she2.GzPc = (from a in ls_tmpe where a.CityName == "欧洲中心" select a.SzAVGMaxT.ToString()).FirstOrDefault();
                she2.BjPc = (from a in ls_tmpe where a.CityName == "北京" select a.SzAVGMaxT.ToString()).FirstOrDefault();
                //深圳台对中央台最高气温技巧
                double v = Convert.ToDouble(she2.BjPc);
                if (v == 0) v = 0.01;
                she2.SzBjMaxTempPc = Math.Round((v - Convert.ToDouble(she2.SzPc)) / v, 2, MidpointRounding.AwayFromZero);
                //深圳台对欧洲中心最高气温技巧
                double vOuZhou = Convert.ToDouble(she2.GzPc);
                if (vOuZhou == 0) vOuZhou = 0.01;
                she3.SzBjMaxTempPc = Math.Round((vOuZhou - Convert.ToDouble(she2.SzPc)) / vOuZhou, 2, MidpointRounding.AwayFromZero);

                v = Convert.ToDouble(she2.GzPc);
                //if (v == 0) v = 0.01;
                if (v == 0)
                {
                    she2.SzGzPc = "1.01";
                }
                else
                {
                    she2.SzGzPc = Math.Round((v - Convert.ToDouble(she2.SzPc)) / v, 2, MidpointRounding.AwayFromZero).ToString();
                }

                she2.StrDtime = (from a in ls_tmpe where a.CityName == "海口" select a.StrDtime).FirstOrDefault();
                she2.TypeName = "高温(平均绝对误差)";
                //ls_new.Add(she2);

                //she2 = new Score12HourStrEntity();
                she2.SzPc = (from a in ls_tmpe where a.CityName == "海口" select a.SzAVGMinT.ToString()).FirstOrDefault();
                she2.GzPc = (from a in ls_tmpe where a.CityName == "欧洲中心" select a.SzAVGMinT.ToString()).FirstOrDefault();
                she2.BjPc = (from a in ls_tmpe where a.CityName == "北京" select a.SzAVGMinT.ToString()).FirstOrDefault();

                //深圳台对中央台最低气温技巧
                double vMin = Convert.ToDouble(she2.BjPc);
                if (vMin == 0) vMin = 0.01;
                she2.SzBjMinTempPc = Math.Round((vMin - Convert.ToDouble(she2.SzPc)) / vMin, 2, MidpointRounding.AwayFromZero);
                //深圳台对欧洲中心最低气温技巧
                double vOuZhouMin = Convert.ToDouble(she2.GzPc);
                if (vOuZhouMin == 0) vOuZhouMin = 0.01;
                she3.SzBjMinTempPc = Math.Round((vOuZhouMin - Convert.ToDouble(she2.SzPc)) / vOuZhouMin, 2, MidpointRounding.AwayFromZero);

                she2.StrDtime = (from a in ls_tmpe where a.CityName == "海口" select a.StrDtime).FirstOrDefault();
                she2.TypeName = "低温(平均绝对误差)";

                //暴雨
                //ls_new.Add(GetSore12HourRainstormSpc(dtStart, dtEnd, 1)[0]);
                ls = new List<Score12HourStrEntity>();
                sql = "select sum(RAINSUN30MM) RAINSUN30MM, " +
     "sum(RAINNULL30MM) RAINNULL30MM,sum(RAINLOST30MM) RAINLOST30MM,cityname " +
     "from lfs_scorecity12hourdata t where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') " +
     "and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss') and t.RAINNO30MM=1  and to_char(ddatetime,'hh24miss')<>'100000' and (to_char(t.ddatetime, 'hh24') = '08' or  to_char(t.ddatetime, 'hh24') = '20') group by cityname";
                dtTable = oh.ExecuteDataTable(sql);

                sql = "select '欧洲中心' cityname,sum(RAINCORRECT20) RAINSUN30MM, sum(RAINNULL20) RAINNULL30MM,sum(RAINLOST20) RAINLOST30MM " +
     "from lfs_scoreecmwfdata t   where ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') " +
     "and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                dtTableEurope = oh.ExecuteDataTable(sql);
                //如果
                DataRow[] dRow = dtTableEurope.Select("RAINSUN30MM >0 or RAINNULL30MM > 0 or RAINLOST30MM >0 ");
                if (dRow.Length > 0)
                {
                    if (dtTableEurope.Rows[0]["RAINSUN30MM"] != null && dtTableEurope.Rows[0]["RAINSUN30MM"].ToString() != "")
                    {
                        dtTable.ImportRow(dtTableEurope.Rows[0]);
                    }
                }
                foreach (DataRow item in dtTable.Rows)
                {
                    Score12HourStrEntity she = new Score12HourStrEntity();
                    d0 = 0;
                    double.TryParse(item["RAINSUN30MM"].ToString(), out d0);
                    d1 = 0;
                    double.TryParse(item["RAINNULL30MM"].ToString(), out d1);
                    d2 = 0;
                    double.TryParse(item["RAINLOST30MM"].ToString(), out d2);
                    she.CityName = item["cityname"].ToString();
                    dScore = 0;
                    if (d0 + d1 + d2 > 0)
                    {
                        dScore = d0 / (d0 + d1 + d2);
                        dScore = Math.Round(dScore, 2, MidpointRounding.AwayFromZero);
                    }

                    she.SzPc = dScore.ToString();
                    ls.Add(she);
                }

                she2.SzPc = (from a in ls where a.CityName == "海口" select a.SzPc).FirstOrDefault();
                she2.GzPc = (from a in ls where a.CityName == "欧洲中心" select a.SzPc).FirstOrDefault();
                she2.BjPc = (from a in ls where a.CityName == "北京" select a.SzPc).FirstOrDefault();

                if (string.IsNullOrEmpty(she2.SzPc))
                {
                    she2.SzPc = "无";
                }
                if (string.IsNullOrEmpty(she2.GzPc))
                {
                    she2.GzPc = "无";
                }
                if (string.IsNullOrEmpty(she2.BjPc))
                {
                    she2.BjPc = "无";
                }
                if (Isnum(she2.SzPc) && Isnum(she2.BjPc))
                {
                    d0 = Convert.ToDouble(she2.SzPc);
                    d1 = Convert.ToDouble(she2.BjPc);
                    she2.SzBjRain = Math.Round((d0 - d1), 2, MidpointRounding.AwayFromZero).ToString();
                }
                else
                {
                    she2.SzBjRain = "无";
                }
                if (Isnum(she2.SzPc) && Isnum(she2.GzPc))
                {
                    d0 = Convert.ToDouble(she2.SzPc);
                    d1 = Convert.ToDouble(she2.GzPc);
                    she3.SzBjRain = Math.Round((d0 - d1), 2, MidpointRounding.AwayFromZero).ToString();
                }
                else
                {
                    she3.SzBjRain = "无";
                }

                she2.StrDtime = dtStart + "至" + dtEnd;
                she3.StrDtime = dtStart + "至" + dtEnd;

                she2.TypeName = "暴雨评分";

                she2.TypeName = "海口市气象台对中央台";
                she3.TypeName = "海口市气象台对欧洲中心";
                //ls_new.Add(she2);//注意：由于海口市气象台目前没有中央指导报预报数据，因此不加载海口市气象台对中央台的评分数据数据
                if (isOuZhou)
                {
                    ls_new.Add(she3);
                }

                return ls_new;
            }
            catch (Exception ex)
            {
                // ErrWriter(ex);
            }
            return null;
        }
        public bool Isnum(string num)
        {
            // string pattern = @"^\d+(\.\d)?$";
            string pattern = @"^(-?\d+)(\.\d+)?$";

            if (!Regex.IsMatch(num, pattern))
            {
                return false;
            }
            else
            {
                return true;
            }

        }

        //zhou
        public List<ScoreTotalInfo> GetPredictionInfotestDAL(string dtStart, string dtEnd, string dateType)
        {
            List<ScoreTotalInfo> infoList = null;
            try
            {
                #region 初始化
                DataTable dt = null;
                string sql = "";

                //降水预报正确的站（次）数
                double rCountSun = 0;
                //空报站（次）数
                double rCountNull = 0;
                //漏报站（次）数
                double rCountLost = 0;
                //无降水预报正确的站（次）数
                double rCountNo = 0;


                //降水预报正确的站（次）数
                double rCountSunBig = 0;
                //空报站（次）数
                double rCountNullBig = 0;
                //漏报站（次）数
                double rCountLostBig = 0;

                //降水预报正确的站（次）数
                double rCountSun50 = 0;
                //空报站（次）数
                double rCountNull50 = 0;
                //漏报站（次）数
                double rCountLost50 = 0;


                //最低气温绝对误差
                double maxT = 0;
                //最高气温绝对误差
                double minT = 0;

                double tCount = 0;
                double tPer = 0;


                double wCount = 0;
                double wPer = 0;

                double vCount = 0;
                double vPer = 0;
                double dCount;

                DataTable dtScore = null;

                string sqlWhere = "";
                //判断日期类型
                if (dateType == "day")
                {
                    sqlWhere = " ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                }
                else if (dateType == "month")
                {
                    int year = 0;
                    int month = 0;

                    year = Convert.ToInt32(dtStart);
                    month = Convert.ToInt32(dtEnd);

                    if (month == 12)
                    {
                        year = year + 1;
                        month = 1;
                    }
                    else
                    {
                        month = month + 1;
                    }

                    sqlWhere = " ddatetime >= to_date('" + dtStart + "-" + dtEnd + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and ddatetime < to_date('" + year + "-" + month + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss')";

                }
                else if (dateType == "season")
                {
                    if (dtEnd == "全部")
                    {
                        dtEnd = dtStart + "-12-31";
                        dtStart = dtStart + "-01";

                    }
                    else if (dtEnd == "1")
                    {
                        dtEnd = dtStart + "-03-31";
                        dtStart = dtStart + "-01";
                    }
                    else if (dtEnd == "2")
                    {
                        dtEnd = dtStart + "-06-30";
                        dtStart = dtStart + "-04";
                    }
                    else if (dtEnd == "3")
                    {
                        dtEnd = dtStart + "-09-30";
                        dtStart = dtStart + "-07";
                    }
                    else if (dtEnd == "4")
                    {
                        dtEnd = dtStart + "-12-31";
                        dtStart = dtStart + "-10";
                    }
                    sqlWhere = " ddatetime between to_date('" + dtStart + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                }
                else if (dateType == "year")
                {
                    sqlWhere = " ddatetime between to_date('" + dtStart + "-01-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('" + dtStart + "-12-31 23:59:59','yyyy-mm-dd hh24:mi:ss') ";
                }
                else
                {
                    sqlWhere = "1=1";
                }
                #endregion

                infoList = new List<ScoreTotalInfo>();

                sql = @"select '逐24小时'||'-'||ybsx as ScoreName,ybsx,round(sum(RAINSUN),2) RAINSUN,round(sum(RAINNULL),2) RAINNULL,round(sum(RAINLOST),2) RAINLOST,round(sum(RAINNO),2) RAINNO,
round(sum(RAINCORRECT25),2) RAINCORRECTBig,round(sum(RAINNULL25),2) RAINNULLBig,round(sum(RAINLOST25),2) RAINLOSTBig,
count(*) count1,round(avg(MINTEMPDIFF),2) mint,round(avg(MAXTEMPDIFF),2) maxt from lfs_score_grid_24h 
where " + sqlWhere + "group by ybsx order by ybsx desc";

                //dt = db_GreateDataTable("EJETDB247LFS", sql);

                OracleHelper oh = new OracleHelper("EJETDB247LFS");
                dt = oh.ExecuteDataTable(sql);

                if (dt != null && dt.Rows.Count > 0)
                {
                    if (dtScore == null) dtScore = dt.Clone();
                    foreach (DataRow item in dt.Rows)
                    {
                        dtScore.Rows.Add(item.ItemArray);
                    }
                    //dtScore.ImportRow(dt.Rows[0]);
                }

                sql = @"select '逐6小时'||'-'||ybsx as ScoreName,ybsx,round(sum(RAINSUN),2) RAINSUN,round(sum(RAINNULL),2) RAINNULL,round(sum(RAINLOST),2) RAINLOST,round(sum(RAINNO),2) RAINNO,
round(sum(RAINCORRECT10),2) RAINCORRECTBig,round(sum(RAINNULL10),2) RAINNULLBig,round(sum(RAINLOST10),2) RAINLOSTBig,
count(*) count1,round(avg(MINTEMPDIFF),2) mint,round(avg(MAXTEMPDIFF),2) maxt from lfs_score_grid_6h 
where " + sqlWhere + "group by ybsx order by ybsx desc";

                // dt = db_GreateDataTable("EJETDB247LFS", sql);
                OracleHelper oh2 = new OracleHelper("EJETDB247LFS");
                dt = oh.ExecuteDataTable(sql);

                if (dt != null && dt.Rows.Count > 0)
                {
                    if (dtScore == null) dtScore = dt.Clone();
                    foreach (DataRow item in dt.Rows)
                    {
                        dtScore.Rows.Add(item.ItemArray);
                    }
                    //dtScore.ImportRow(dt.Rows[0]);
                }



                #region 注释掉省台的
                //            sql = @"select '逐24小时预报(省台)' as ScoreName,round(sum(RAINSUN_prov),2) RAINSUN,round(sum(RAINNULL_prov),2) RAINNULL,round(sum(RAINLOST_prov),2) RAINLOST,round(sum(RAINNO_prov),2) RAINNO,
                //round(sum(RAINCORRECT25_prov),2) RAINCORRECTBig,round(sum(RAINNULL25_prov),2) RAINNULLBig,round(sum(RAINLOST25_prov),2) RAINLOSTBig,
                //round(sum(RAINCORRECT50_prov),2) RAINCORRECT50,round(sum(RAINNULL50_prov),2) RAINNULL50,round(sum(RAINLOST50_prov),2) RAINLOST50,
                //count(*) count1,round(avg(MINTEMPDIFF_prov),2) mint,round(avg(MAXTEMPDIFF_prov),2) maxt from lfs_score_grid_24h 
                //where " + sqlWhere; // + " and MINTEMPDIFF_prov<15 "温度差要小于15度 才是正常数据

                //            dt = db_GreateDataTable("EJETDB247LFS", sql);
                //            if (dt != null && dt.Rows.Count > 0)
                //            {
                //                if (dtScore == null) dtScore = dt.Clone();
                //                dtScore.ImportRow(dt.Rows[0]);
                //            }

                //            sql = @"select '逐6小时预报(省台)' as ScoreName,round(sum(RAINSUN_prov),2) RAINSUN,round(sum(RAINNULL_prov),2) RAINNULL,round(sum(RAINLOST_prov),2) RAINLOST,round(sum(RAINNO_prov),2) RAINNO,
                //round(sum(RAINCORRECT10_prov),2) RAINCORRECTBig,round(sum(RAINNULL10_prov),2) RAINNULLBig,round(sum(RAINLOST10_prov),2) RAINLOSTBig,
                //count(*) count1,round(avg(MINTEMPDIFF_prov),2) mint,round(avg(MAXTEMPDIFF_prov),2) maxt from lfs_score_grid_6h 
                //where " + sqlWhere; //+ " and MINTEMPDIFF_prov<15 "温度差要小于15度 才是正常数据

                //            dt = db_GreateDataTable("EJETDB247LFS", sql);
                //            if (dt != null && dt.Rows.Count > 0)
                //            {
                //                if (dtScore == null) dtScore = dt.Clone();
                //                dtScore.ImportRow(dt.Rows[0]);
                //            }
                #endregion

                if (dtScore == null || dtScore.Rows.Count == 0) return null;
                //infoList = new List<ScoreTotalInfo>();
                ScoreTotalInfo info;
                for (int i = dtScore.Rows.Count - 1; i >= 0; i--)
                {

                    dCount = 0;
                    double.TryParse(dtScore.Rows[i]["count1"].ToString(), out dCount);
                    if (dCount <= 0) continue;
                    info = new ScoreTotalInfo();

                    info.ScoreName = dtScore.Rows[i]["ScoreName"].ToString();
                    #region 晴雨预报准确率
                    rCountSun = 0;
                    double.TryParse(dtScore.Rows[i]["RAINSUN"].ToString(), out rCountSun);
                    rCountNull = 0;
                    double.TryParse(dtScore.Rows[i]["RAINNULL"].ToString(), out rCountNull);
                    rCountLost = 0;
                    double.TryParse(dtScore.Rows[i]["RAINLOST"].ToString(), out rCountLost);
                    rCountNo = 0;
                    double.TryParse(dtScore.Rows[i]["RAINNO"].ToString(), out rCountNo);
                    //晴雨预报准确率%
                    if (rCountSun + rCountLost + rCountNo + rCountNull != 0)
                    {
                        info.ScoreRain = Math.Round(double.Parse(Getpercent((rCountSun + rCountNo) / (rCountSun + rCountLost + rCountNo + rCountNull))), 1).ToString();
                    }
                    else
                    {
                        info.ScoreRain = "无";
                    }
                    #endregion

                    #region 大雨预报准确率
                    rCountSun = 0;
                    double.TryParse(dtScore.Rows[i]["RAINCORRECTBig"].ToString(), out rCountSunBig);
                    rCountNull = 0;
                    double.TryParse(dtScore.Rows[i]["RAINNULLBig"].ToString(), out rCountNullBig);
                    rCountLost = 0;
                    double.TryParse(dtScore.Rows[i]["RAINLOSTBig"].ToString(), out rCountLostBig);
                    //大雨预报准确率%
                    if (rCountSunBig + rCountLostBig + rCountNullBig != 0)
                    {
                        info.LargeRain = Math.Round(double.Parse(Getpercent(rCountSunBig / (rCountSunBig + rCountLostBig + rCountNullBig))), 1).ToString();
                    }
                    else
                    {
                        info.LargeRain = "无";
                    }
                    #endregion

                    #region 暴雨预报准确率
                    //rCountSun = 0;
                    //double.TryParse(dtScore.Rows[i]["RAINCORRECT50"].ToString(), out rCountSun50);
                    //rCountNull = 0;
                    //double.TryParse(dtScore.Rows[i]["RAINNULL50"].ToString(), out rCountNull50);
                    //rCountLost = 0;
                    //double.TryParse(dtScore.Rows[i]["RAINLOST50"].ToString(), out rCountLost50);
                    ////暴雨预报准确率%
                    //if (rCountSun50 + rCountLost50 + rCountNull50 != 0)
                    //{
                    //    info.StormRain = Math.Round(double.Parse(Getpercent(rCountSun50 / (rCountSun50 + rCountLost50 + rCountNull50))), 1).ToString();
                    //}
                    //else
                    //{
                    //    info.StormRain = "无";
                    //}
                    #endregion

                    #region 气温预报精确度改为气温绝对误差
                    //maxT = 0;
                    //double.TryParse(dtScore.Rows[i]["maxt"].ToString(), out maxT);
                    //minT = 0;
                    //double.TryParse(dtScore.Rows[i]["mint"].ToString(), out minT);
                    ////温度预报误差的目标值=1.2℃
                    //if (maxT + minT >= 0)
                    //{
                    //    //info.SmallRain = double.Parse(Getpercent((2 * 1.2) / (maxT + minT))).ToString();
                    //    info.SmallRain =Math.Round(double.Parse(((maxT + minT)/2).ToString()), 1).ToString();//
                    //}
                    //else
                    //{
                    //    info.SmallRain = "无";
                    //}
                    #endregion

                    infoList.Add(info);
                }
            }
            catch (Exception ex)
            {
            }
            return infoList;
        }
        //zhou
        public List<ScoreTotalInfo> GetScoreTotalInfotestDAL(string dtStart, string dtEnd, string dateType)
        {
            List<ScoreTotalInfo> infoList = null;
            try
            {
                #region 降雨准确率 所有评分都只评早上和下午共两次

                #region 初始化
                DataTable dt = null;
                string sql = "";

                //降水预报正确的站（次）数
                double rCountSun = 0;
                //空报站（次）数
                double rCountNull = 0;
                //漏报站（次）数
                double rCountLost = 0;
                //无降水预报正确的站（次）数
                double rCountNo = 0;

                //最低气温绝对误差
                double maxT = 0;
                //最高气温绝对误差
                double minT = 0;

                double tCount = 0;
                double tPer = 0;


                double wCount = 0;
                double wPer = 0;

                double vCount = 0;
                double vPer = 0;
                double dCount;

                DataTable dtScore = null;

                #endregion

                string sqlWhere = "";
                //判断日期类型
                if (dateType == "day")
                {
                    sqlWhere = " ddatetime between to_date('" + dtStart + " 00:00:00','yyyy-mm-dd hh24:mi:ss') and to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                }
                else if (dateType == "month")
                {
                    int year = 0;
                    int month = 0;

                    year = Convert.ToInt32(dtStart);
                    month = Convert.ToInt32(dtEnd);

                    if (month == 12)
                    {
                        year = year + 1;
                        month = 1;
                    }
                    else
                    {
                        month = month + 1;
                    }
                    sqlWhere = " ddatetime >= to_date('" + dtStart + "-" + dtEnd + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and ddatetime < to_date('" + year + "-" + month + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss')";
                }
                else if (dateType == "season")
                {
                    if (dtEnd == "全部")
                    {
                        dtEnd = dtStart + "-12-31";
                        dtStart = dtStart + "-01";
                    }
                    else if (dtEnd == "1")
                    {
                        dtEnd = dtStart + "-03-31";
                        dtStart = dtStart + "-01";
                    }
                    else if (dtEnd == "2")
                    {
                        dtEnd = dtStart + "-06-30";
                        dtStart = dtStart + "-04";
                    }
                    else if (dtEnd == "3")
                    {
                        dtEnd = dtStart + "-09-30";
                        dtStart = dtStart + "-07";
                    }
                    else if (dtEnd == "4")
                    {
                        dtEnd = dtStart + "-12-31";
                        dtStart = dtStart + "-10";
                    }
                    sqlWhere = " ddatetime between to_date('" + dtStart + "-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('" + dtEnd + " 23:59:59','yyyy-mm-dd hh24:mi:ss')";
                }
                else if (dateType == "year")
                {
                    sqlWhere = " ddatetime between to_date('" + dtStart + "-01-01 00:00:00','yyyy-mm-dd hh24:mi:ss') and  to_date('" + dtStart + "-12-31 23:59:59','yyyy-mm-dd hh24:mi:ss') ";
                }
                else
                {
                    sqlWhere = "1=1";
                }
                //总共
                DataTable dTotal;
                //明细
                DataTable dtDetail;
                infoList = new List<ScoreTotalInfo>();
                ScoreTotalInfo info10Day = new ScoreTotalInfo();
                sql = "select ddatetime from lfs_score10daydata t where " + sqlWhere + " group by ddatetime order by ddatetime";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                dTotal = oh.ExecuteDataTable(sql);
                if (dTotal != null && dTotal.Rows.Count > 0)
                {
                    for (int i = 1; i <= 10; i++)
                    {
                        rCountSun = 0;
                        rCountNull = 0;
                        rCountLost = 0;
                        rCountNo = 0;
                        maxT = 0;
                        minT = 0;
                        int timePart = 0;
                        if (i == 1)
                        {
                            //第一天替换成用24小时预报评的结论
                            sql = @"select '24小时预报' as ScoreName,sum(RAINSUN) RAINSUN,sum(RAINNULL) RAINNULL,sum(RAINLOST) RAINLOST,sum(RAINNO) RAINNO,round(avg(MINTEMPACCURACY),2) MINTEMPACCURACY,round(avg(MAXTEMPACCURACY),2) MAXTEMPACCURACY,round(avg(mint),2) mint,round(avg(maxt),2) maxt,count(*) count1 from lfs_scorecity12hourdata t 
                            where " + sqlWhere + " and cityname = '海口' and to_char(ddatetime,'hh24miss')<>'100000' and (to_char(t.ddatetime, 'hh24') = '08' or  to_char(t.ddatetime, 'hh24') = '20') order by ddatetime";
                            dtDetail = oh.ExecuteDataTable(sql);
                            rCountSun = Convert.ToDouble(dtDetail.Rows[0]["RAINSUN"]);
                            rCountNull = Convert.ToDouble(dtDetail.Rows[0]["RAINNULL"]);
                            rCountLost = Convert.ToDouble(dtDetail.Rows[0]["RAINLOST"]);
                            rCountNo = Convert.ToDouble(dtDetail.Rows[0]["RAINNO"]);
                            maxT = Convert.ToDouble(dtDetail.Rows[0]["maxt"]);
                            minT = Convert.ToDouble(dtDetail.Rows[0]["mint"]);
                        }
                        else
                        {
                            foreach (DataRow item in dTotal.Rows)
                            {
                                timePart = timePart + 1;
                                sql = "select '10天预报' as ScoreName,ddatetime,forecasttime,RAINSUN,RAINNULL,RAINLOST, RAINNO, MINTEMPACCURACY, MAXTEMPACCURACY,mint, maxt from lfs_score10daydata t where ddatetime = to_date('" + item["ddatetime"] + "','yyyy-MM-dd hh24:mi:ss') and forecasttime  = to_date('" + Convert.ToDateTime(item["ddatetime"]).AddDays(i).ToString("yyyy-MM-dd") + "','yyyy-MM-dd')  order by forecasttime";
                                dtDetail = oh.ExecuteDataTable(sql);
                                if (dtDetail.Rows.Count > 0)
                                {
                                    rCountSun += Convert.ToDouble(dtDetail.Rows[0]["RAINSUN"]);
                                    rCountNull += Convert.ToDouble(dtDetail.Rows[0]["RAINNULL"]);
                                    rCountLost += Convert.ToDouble(dtDetail.Rows[0]["RAINLOST"]);
                                    rCountNo += Convert.ToDouble(dtDetail.Rows[0]["RAINNO"]);
                                    maxT += Convert.ToDouble(dtDetail.Rows[0]["maxt"]);
                                    minT += Convert.ToDouble(dtDetail.Rows[0]["mint"]);
                                }
                                else
                                {
                                    timePart = timePart - 1;
                                }
                            }
                            rCountSun = rCountSun / timePart;
                            rCountNull = rCountNull / timePart;
                            rCountLost = rCountLost / timePart;
                            rCountNo = rCountNo / timePart;
                            maxT = maxT / timePart;
                            minT = minT / timePart;
                        }

                        //晴雨预报准确率%
                        if (rCountSun + rCountLost + rCountNo + rCountNull != 0)
                        {
                            info10Day.Score1 += Math.Round(double.Parse(Getpercent((rCountSun + rCountNo) / (rCountSun + rCountLost + rCountNo + rCountNull))), 1);
                        }

                        //TS评分≥0mm
                        if (rCountSun + rCountNull + rCountLost != 0)
                        {
                            info10Day.Score2 += double.Parse(Getpercent((rCountSun) / (rCountSun + rCountLost + rCountNull)));
                        }

                        //空报率≥0.1mm
                        rCountSun += rCountNo;
                        if (rCountSun + rCountNull != 0)
                        {
                            info10Day.Score3 += double.Parse(Getpercent((rCountNull) / (rCountSun + rCountNull)));
                        }

                        if (rCountSun + rCountLost != 0)
                        {
                            info10Day.Score4 += Math.Round(double.Parse(Getpercent((rCountLost) / (rCountSun + rCountLost))), 1);
                        }


                        //最低气温平均绝对值误差
                        info10Day.Score5 += Math.Round(minT, 1, MidpointRounding.AwayFromZero);

                        //最高气温平均绝对误差
                        info10Day.Score6 += Math.Round(maxT, 1, MidpointRounding.AwayFromZero);
                    }


                    //晴雨预报准确率%
                    if (rCountSun + rCountLost + rCountNo + rCountNull != 0)
                    {
                        info10Day.Score1 = Math.Round(info10Day.Score1 / 10, 1, MidpointRounding.AwayFromZero);
                    }

                    //TS评分≥0mm
                    if (rCountSun + rCountNull + rCountLost != 0)
                    {
                        info10Day.Score2 = Math.Round(info10Day.Score2 / 10, 1, MidpointRounding.AwayFromZero);
                    }

                    //空报率≥0.1mm
                    rCountSun += rCountNo;
                    if (rCountSun + rCountNull != 0)
                    {
                        info10Day.Score3 = Math.Round(info10Day.Score3 / 10, 1, MidpointRounding.AwayFromZero);
                    }

                    if (rCountSun + rCountLost != 0)
                    {
                        info10Day.Score4 = Math.Round(info10Day.Score4 / 10, 1, MidpointRounding.AwayFromZero);
                    }


                    //最低气温平均绝对值误差
                    info10Day.Score5 = Math.Round(info10Day.Score5 / 10, 1, MidpointRounding.AwayFromZero);

                    //最高气温平均绝对误差
                    info10Day.Score6 = Math.Round(info10Day.Score6 / 10, 1, MidpointRounding.AwayFromZero);

                    info10Day.ScoreName = "10天预报";
                    infoList.Add(info10Day);

                }
                //分区预报

                sql = @"select '分区预报' as ScoreName,round(sum(RAINSUN),2) RAINSUN,round(sum(RAINNULL),2) RAINNULL,round(sum(RAINLOST),2) RAINLOST,round(sum(RAINNO),2) RAINNO,round(avg(MINTEMPACCURACY),2) MINTEMPACCURACY,round(avg(MAXTEMPACCURACY),2) MAXTEMPACCURACY,count(*) count1 ,round(avg(mint),2) mint,round(avg(maxt),2) maxt from lfs_scoreareadata  where  " + sqlWhere + " and to_char(ddatetime,'hh24miss')<>'110000' ";

                dt = oh.ExecuteDataTable(sql);
                if (dt != null && dt.Rows.Count > 0)
                {
                    if (dtScore == null) dtScore = dt.Clone();
                    dtScore.ImportRow(dt.Rows[0]);
                }


                //逐6小时预报 之取出了福田区的 2015-06-02
                sql = @"select '逐6小时预报' as ScoreName,round(sum(RAINSUN),2) RAINSUN,round(sum(RAINNULL),2) RAINNULL,round(sum(RAINLOST),2) RAINLOST,round(sum(RAINNO),2) RAINNO,round(avg(MINTEMPACCURACY),2) MINTEMPACCURACY,round(avg(MAXTEMPACCURACY),2) MAXTEMPACCURACY,round(avg(RAINACCURACY),2) RAINACCURACY ,count(*) count1,round(avg(mint),2) mint,round(avg(maxt),2) maxt from lfs_score6hourdata where " + sqlWhere + " and to_char(ddatetime,'hh24miss')<>'100000' ";

                dt = oh.ExecuteDataTable(sql);
                if (dt != null && dt.Rows.Count > 0)
                {
                    if (dtScore == null) dtScore = dt.Clone();
                    dtScore.ImportRow(dt.Rows[0]);
                }

                //逐时预报
                sql = @"select '逐时预报' as ScoreName,round(sum(RAINSUN),2) RAINSUN,round(sum(RAINNULL),2) RAINNULL,round(sum(RAINLOST),2) RAINLOST,round(sum(RAINNO),2) RAINNO,count(*) count1,round(avg(TEMPDIFF),2) mint,round(avg(TEMPDIFF),2) maxt from lfs_scoredata where  ROUND(TO_NUMBER(forecasttime - ddatetime) * 24) <= 12 and " + sqlWhere + " and to_char(ddatetime,'hh24miss')<>'110000' ";

                dt = oh.ExecuteDataTable(sql);
                if (dt != null && dt.Rows.Count > 0)
                {

                    dtScore.ImportRow(dt.Rows[0]);
                }

                sql = @"select '24小时预报' as ScoreName,sum(RAINSUN) RAINSUN,sum(RAINNULL) RAINNULL,sum(RAINLOST) RAINLOST,sum(RAINNO) RAINNO,round(avg(MINTEMPACCURACY),2) MINTEMPACCURACY,round(avg(MAXTEMPACCURACY),2) MAXTEMPACCURACY,round(avg(mint),2) mint,round(avg(maxt),2) maxt,count(*) count1 from lfs_scorecity12hourdata t 
                       where " + sqlWhere + " and cityname = '海口' and to_char(ddatetime,'hh24miss')<>'100000' and (to_char(t.ddatetime, 'hh24') = '08' or  to_char(t.ddatetime, 'hh24') = '20') order by ddatetime";

                dt = oh.ExecuteDataTable(sql);
                if (dt != null && dt.Rows.Count > 0)
                {

                    if (dtScore == null) dtScore = dt.Clone();
                    dtScore.ImportRow(dt.Rows[0]);
                }

                if (dtScore == null || dtScore.Rows.Count == 0) return null;

                ScoreTotalInfo info;
                for (int i = 0; i < dtScore.Rows.Count; i++)
                {

                    dCount = 0;
                    double.TryParse(dtScore.Rows[i]["count1"].ToString(), out dCount);
                    if (dCount <= 0) continue;
                    info = new ScoreTotalInfo();

                    info.ScoreName = dtScore.Rows[i]["ScoreName"].ToString();

                    rCountSun = 0;
                    double.TryParse(dtScore.Rows[i]["RAINSUN"].ToString(), out rCountSun);
                    rCountNull = 0;
                    double.TryParse(dtScore.Rows[i]["RAINNULL"].ToString(), out rCountNull);
                    rCountLost = 0;
                    double.TryParse(dtScore.Rows[i]["RAINLOST"].ToString(), out rCountLost);
                    rCountNo = 0;
                    double.TryParse(dtScore.Rows[i]["RAINNO"].ToString(), out rCountNo);

                    maxT = 0;
                    double.TryParse(dtScore.Rows[i]["maxt"].ToString(), out maxT);
                    minT = 0;
                    double.TryParse(dtScore.Rows[i]["mint"].ToString(), out minT);
                    //晴雨预报准确率%
                    if (rCountSun + rCountLost + rCountNo + rCountNull != 0)
                    {
                        info.Score1 = Math.Round(double.Parse(Getpercent((rCountSun + rCountNo) / (rCountSun + rCountLost + rCountNo + rCountNull))), 1);
                    }

                    //TS评分≥0mm
                    if (rCountSun + rCountNull + rCountLost != 0)
                    {
                        info.Score2 = double.Parse(Getpercent((rCountSun) / (rCountSun + rCountLost + rCountNull)));
                    }

                    //空报率≥0.1mm
                    rCountSun += rCountNo;
                    if (rCountSun + rCountNull != 0)
                    {
                        info.Score3 = Math.Round(double.Parse(Getpercent((rCountNull) / (rCountSun + rCountNull))), 1);
                    }

                    if (rCountSun + rCountLost != 0)
                    {
                        info.Score4 = Math.Round(double.Parse(Getpercent((rCountLost) / (rCountSun + rCountLost))), 1);
                    }
                    info.Score5 = Math.Round(minT, 1, MidpointRounding.AwayFromZero);

                    info.Score6 = Math.Round(maxT, 1, MidpointRounding.AwayFromZero);
                    infoList.Add(info);
                }
                #endregion
            }
            catch (Exception ex)
            {
                //  ErrWriter(ex);
            }
            return infoList;
        }

        private string Getpercent(double value)
        {
            return ChinaRound(value * 100, 2).ToString("F1");
        }
        private double ChinaRound(double value, int decimals)
        {
            if (value < 0)
            {

                return Math.Round(value + 5 / Math.Pow(10, decimals + 1), decimals, MidpointRounding.AwayFromZero);
            }
            else
            {
                return Math.Round(value, decimals, MidpointRounding.AwayFromZero);
            }
        }
        public bool InsertWelfareForecast(DateTime dt, WelfareForecastInfo info, List<WelfareForecastInfo> daysList, string forecaster)
        {
            try
            {
                string strSQL = "";
                string strID = "";
                string picPath = "";
                string picPath2 = "";

                List<string> weatherList = new List<string> { "01晴.bmp", "02多云.bmp", "02多云.bmp", "03阴.bmp", "04阵雨.bmp", "05雷阵雨.bmp", "04阵雨.bmp", "07小雨.bmp", "08中雨.bmp", "09大雨.bmp", "10暴雨.bmp", "10暴雨.bmp", "11夜晴.bmp", "12夜多云.bmp", "12夜多云.bmp", "13夜阵雨.bmp", "14轻雾.bmp", "15雾.bmp", "01晴.bmp", "01晴.bmp" };
                List<string> weatherTag = new List<string> { "01.png", "02.png", "02_2.png", "03.png", "04.png", "05.png", "06.png", "07.png", "08.png", "09.png", "10.png", "10_2.png", "11.png", "12.png", "12_2.png", "13.png", "14.png", "15.png", "16.png", "17.png" };
                int indexWeather;

                int result1 = 0;

                List<string> dataNameList = new List<string>();
                List<string> dataValueList = new List<string>();
                List<string> dataDateList = new List<string>();


                List<int> hourList2 = new List<int> { 6, 11, 16 };
                int indexHour = hourList2.IndexOf(dt.Hour);
                List<string> nameList3 = new List<string> { "zc_day", "wj_day", "xw_day" };

                int indexDate = 1;
                if (indexHour == 2)
                {
                    //List<WelfareForecastInfo> noonData = GetWelfareForecastDaysInfo(DateTime.Parse(dt.ToString("yyyy-MM-dd 11:00")));
                    //if (noonData != null && noonData.Count > 0)
                    //{
                    dataNameList.Add("天气状况");
                    indexWeather = info.Weather.IndexOf("；");
                    if (indexWeather > 0)
                    {
                        dataValueList.Add(info.Weather.Substring(0, indexWeather));
                    }
                    else
                    {
                        dataValueList.Add(info.Weather);
                    }
                    dataDateList.Add(nameList3[indexHour] + indexDate);

                    dataNameList.Add("最高温度");
                    dataValueList.Add(info.MaxTemp);
                    dataDateList.Add(nameList3[indexHour] + indexDate);

                    dataNameList.Add("最低温度");
                    dataValueList.Add(info.MinTemp);
                    dataDateList.Add(nameList3[indexHour] + indexDate);

                    picPath = "";
                    picPath2 = "";
                    indexWeather = weatherTag.IndexOf(info.WeatherIcon2);
                    if (indexWeather >= 0)
                    {
                        picPath = "/Images/tq/" + weatherList[indexWeather];
                        picPath2 = "/Images/baozhi/" + weatherList[indexWeather];
                    }
                    dataNameList.Add("天气图标");
                    dataValueList.Add(picPath);
                    dataDateList.Add(nameList3[indexHour] + indexDate);

                    dataNameList.Add("天气图标");
                    dataValueList.Add(picPath2);
                    dataDateList.Add("xw_day_media" + indexDate);
                    //}
                }

                foreach (WelfareForecastInfo info1 in daysList)
                {
                    if (indexHour >= 0 && info1.ForecastDate.Date > info1.DDatetime.Date)
                    {
                        indexDate = indexDate + 1;

                        dataNameList.Add("天气状况");
                        dataValueList.Add(info1.Weather);
                        dataDateList.Add(nameList3[indexHour] + indexDate);

                        dataNameList.Add("最高温度");
                        dataValueList.Add(info1.MaxTemp);
                        dataDateList.Add(nameList3[indexHour] + indexDate);

                        dataNameList.Add("最低温度");
                        dataValueList.Add(info1.MinTemp);
                        dataDateList.Add(nameList3[indexHour] + indexDate);

                        picPath = "";
                        picPath2 = "";
                        indexWeather = weatherTag.IndexOf(info1.WeatherIcon);
                        if (indexWeather >= 0)
                        {
                            picPath = "/images/tq/" + weatherList[indexWeather];
                            picPath2 = "/images/baozhi/" + weatherList[indexWeather];
                        }
                        dataNameList.Add("天气图标");
                        dataValueList.Add(picPath);
                        dataDateList.Add(nameList3[indexHour] + indexDate);
                        if (indexHour == 2)
                        {
                            dataNameList.Add("天气图标");
                            dataValueList.Add(picPath2);
                            dataDateList.Add("xw_day_media" + indexDate);
                        }
                    }


                    strSQL = "select recid from LFS_WELFAREFORECASTDAYS where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and FORECASTDATE= to_date('" + info1.ForecastDate.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  ";
                    //OracleHelper oh = new OracleHelper("EJETDB247LFSData");  //正式库
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");  //测试库
                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_WELFAREFORECASTDAYS set WEATHER ='" + info1.Weather + "'"
                             + ",WEATHERPIC='" + info1.WeatherIcon + "'"
                             + ",MINTEMP='" + info1.MinTemp + "'"
                             + ",MAXTEMP='" + info1.MaxTemp + "'"
                             + ",WEATHERWORD='" + info1.Word + "'"
                             + ",WEATHERPIC2='" + info1.WeatherIcon2 + "'"
                              + ",MINWIND='" + info1.WindName + "'"
                               + ",MAXWIND='" + info1.WindGust + "'"
                                + ",WINDDIRECT='" + info1.WindDirectName + "'"
                              + ",MINHUMIDITY='" + info1.Humidity + "'"
                               + ",MAXHUMIDITY='" + info1.MaxHumidity + "'"
                                + ",WEATHEREN='" + info1.WEATHEREN + "'"
                                  + ",RAIN='" + info1.Rain + "'"
                            + " ,WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd HH24:mi:ss')"
                             + " where RECID=" + strID; ;
                    }
                    else
                    {
                        strSQL = "insert into LFS_WELFAREFORECASTDAYS(ddatetime,WEATHER,WEATHERPIC,MINTEMP,MAXTEMP,WEATHERWORD,WEATHERPIC2,MINWIND,MAXWIND,MINHUMIDITY,MAXHUMIDITY,WINDDIRECT,WEATHEREN,RAIN,FORECASTDATE,recid) values("
                        + " to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",'" + info1.Weather + "'"
                        + ",'" + info1.WeatherIcon + "'"
                        + ",'" + info1.MinTemp + "'"
                        + ",'" + info1.MaxTemp + "'"
                        + ",'" + info1.Word + "'"
                        + ",'" + info1.WeatherIcon2 + "'"
                         + ",'" + info1.WindName + "'"
                          + ",'" + info1.WindGust + "'"
                            + ",'" + info1.Humidity + "'"
                               + ",'" + info1.MaxHumidity + "'"
                                 + ",'" + info1.WindDirectName + "'"
                                   + ",'" + info1.WEATHEREN + "'"
                                      + ",'" + info1.Rain + "'"
                        + ",to_date('" + info1.ForecastDate.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        + ",seq_LFS_WELFAREFORECASTDAYS.Nextval)";
                    }
                    result1 = oh.db_ExecuteNonQuery(strSQL);
                    if (result1 <= 0)
                    {
                        return false;
                    }

                }
                if (result1 > 0)
                {
                    strSQL = "select recid from  LFS_WELFAREFORECAST where ddatetime=to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                    // OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                    OracleHelper oh = new OracleHelper("HAIKOUConnect");  //测试库

                    strID = oh.db_GreateQuery(strSQL);
                    if (strID.Length > 0)
                    {
                        strSQL = "update LFS_WELFAREFORECAST set WEATHERBACK='" + info.PastTimes + "'"
                        + ",WEATHERTODAY='" + info.Weather + "'"
                        + ",FUTURE='" + info.Future + "'"
                        + ",WRITETIME=to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')  "
                        + ",WEATHERPIC='" + info.WeatherIcon + "'"
                        + ",MINTEMP='" + info.MinTemp + "'"
                        + ",MAXTEMP='" + info.MaxTemp + "'"
                        + ",FORECASTER='" + forecaster + "'"
                        + ",RAIN='" + info.Rain + "'"
                        + ",SIXHOURRAINONE='" + info.SixHourRainOne + "'"
                        + ",SIXHOURRAINTWO='" + info.SixHourRainTwo + "'"
                        + ",SIXHOURRAINTHREE='" + info.SixHourRainThree + "'"
                        + ",SIXHOURRAINFOUR='" + info.SixHourRainFour + "'"
                        + ",WINDSPEED='" + info.WindName + "'"
                        + ",WINDDIRECT='" + info.WindDirectName + "'"
                        + ",WINDDIRECT2='" + info.WindDirectName2 + "'"
                        + ",HUMIDITY='" + info.Humidity + "'"
                        + ",MAXHUMIDITY='" + info.MaxHumidity + "'"
                        + ",WINDGUST='" + info.WindGust + "'"
                        + ",MINRAIN='" + info.MinRain + "'"
                        + ",CITYFIRE='" + info.CityFire + "'"
                        + ",FORESTFIRE='" + info.ForestFire + "'"
                        + ",CITYFIRELEVEL='" + info.CityFireLevel + "'"
                        + ",FORESTFIRELEVEL='" + info.ForestFireLevel + "'"
                        + ",WEATHERPIC2='" + info.WeatherIcon2 + "'"
                        + ",NEXTDAYWEATHERPIC1='" + info.NextdayIcon1 + "'"
                        + ",NEXTDAYWEATHERPIC2='" + info.NextdayIcon2 + "'"
                        + ",NEXTDAYMINTEMP='" + info.NextdayMinTemp + "'"
                        + ",NEXTDAYMAXTEMP='" + info.NextdayMaxTemp + "'"
                        + ",NEXTDAYWEATHER='" + info.NextdayWeather + "'"
                        + ",NEXTDAYWEATHERWORD='" + info.NextdayWord + "'"
                        + ",TODAYWEATHERWORD='" + info.Word + "'"
                        + ",CITYTVPIC='" + info.CityTVIcon + "'"
                        + ",BAOANTVPIC='" + info.BaoanTVIcon + "'"
                        + ",LONGGANGTVPIC='" + info.LonggangTVIcon + "'"
                        + ",AIR='" + info.Air + "'"
                        + ",AIRLEVEL='" + info.AirLevel + "'"
                        + ",RAYS='" + info.Rays + "'"
                        + ",SUNLEVEL='" + info.SunLevel + "'"
                        + ",FILEFLAG=0"
                         + ",HIGHTEMPLEVEL='" + info.HIGHTEMPLEVEL + "'"
                          + ",HIGHTEMPCONTENT='" + info.HIGHTEMPCONTENT + "'"
                            + ",NOPOISONINGLEVEL='" + info.NOPOISONINGLEVEL + "'"
                              + ",NOPOISONINGCONTENT='" + info.NOPOISONINGCONTENT + "'"
                               + ",WEATHEREN='" + info.WEATHEREN + "'"
                                 + ",WEATHER2EN='" + info.WEATHER2EN + "'"
                        + "  where RECID=" + strID;
                    }
                    else
                    {
                        strSQL = "insert into LFS_WELFAREFORECAST(RECID"
                            + ",DDATETIME"
                            + ",WEATHERBACK"
                            + ",WEATHERTODAY"
                            + ",FUTURE"
                            + ",WRITETIME"
                            + ",WEATHERPIC"
                            + ",MINTEMP"
                            + ",MAXTEMP"
                            + ",FORECASTER"
                            + ",RAIN"
                            + ",SIXHOURRAINONE"
                            + ",SIXHOURRAINTWO"
                            + ",SIXHOURRAINTHREE"
                            + ",SIXHOURRAINFOUR"
                            + ",WINDSPEED"
                            + ",WINDDIRECT"
                            + ",WINDDIRECT2"
                            + ",HUMIDITY"
                            + ",MAXHUMIDITY"
                            + ",WINDGUST"
                            + ",MINRAIN"
                            + ",CITYFIRE"
                            + ",FORESTFIRE"
                            + ",CITYFIRELEVEL"
                            + ",FORESTFIRELEVEL"
                            + ",WEATHERPIC2"
                            + ",NEXTDAYWEATHERPIC1"
                            + ",NEXTDAYWEATHERPIC2"
                            + ",NEXTDAYMINTEMP"
                            + ",NEXTDAYMAXTEMP"
                            + ",NEXTDAYWEATHER"
                            + ",NEXTDAYWEATHERWORD"
                            + ",TODAYWEATHERWORD"
                            + ",CITYTVPIC"
                            + ",BAOANTVPIC"
                            + ",LONGGANGTVPIC"
                            + ",AIR"
                            + ",AIRLEVEL"
                            + ",RAYS"
                            + ",SUNLEVEL"
                             + ",HIGHTEMPLEVEL"
                             + ",HIGHTEMPCONTENT"
                              + ",NOPOISONINGLEVEL"
                                 + ",NOPOISONINGCONTENT"
                                  + ",WEATHEREN"
                                    + ",WEATHER2EN"
                            + ") values(seq_LFS_WELFAREFORECAST.Nextval"
                            + " ,to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                            + ",'" + info.PastTimes + "'"
                            + ",'" + info.Weather + "'"
                            + ",'" + info.Future + "'"
                            + ",to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')"
                            + ",'" + info.WeatherIcon + "'"
                            + ",'" + info.MinTemp + "'"
                            + ",'" + info.MaxTemp + "'"
                            + ",'" + forecaster + "'"
                            + ",'" + info.Rain + "'"
                             + ",'" + info.SixHourRainOne + "'"
                              + ",'" + info.SixHourRainTwo + "'"
                               + ",'" + info.SixHourRainThree + "'"
                                + ",'" + info.SixHourRainFour + "'"
                            + ",'" + info.WindName + "'"
                            + ",'" + info.WindDirectName + "'"
                            + ",'" + info.WindDirectName2 + "'"
                            + ",'" + info.Humidity + "'"
                            + ",'" + info.MaxHumidity + "'"
                            + ",'" + info.WindGust + "'"
                            + ",'" + info.MinRain + "'"
                            + ",'" + info.CityFire + "'"
                            + ",'" + info.ForestFire + "'"
                            + ",'" + info.CityFireLevel + "'"
                            + ",'" + info.ForestFireLevel + "'"
                            + ",'" + info.WeatherIcon2 + "'"
                            + ",'" + info.NextdayIcon1 + "'"
                            + ",'" + info.NextdayIcon2 + "'"
                            + ",'" + info.NextdayMinTemp + "'"
                            + ",'" + info.NextdayMaxTemp + "'"
                            + ",'" + info.NextdayWeather + "'"
                            + ",'" + info.NextdayWord + "'"
                            + ",'" + info.Word + "'"
                            + ",'" + info.CityTVIcon + "'"
                            + ",'" + info.BaoanTVIcon + "'"
                            + ",'" + info.LonggangTVIcon + "'"
                            + ",'" + info.Air + "'"
                            + ",'" + info.AirLevel + "'"
                            + ",'" + info.Rays + "'"
                            + ",'" + info.SunLevel + "'"
                            + ",'" + info.HIGHTEMPLEVEL + "'"
                             + ",'" + info.HIGHTEMPCONTENT + "'"
                               + ",'" + info.NOPOISONINGLEVEL + "'"
                                + ",'" + info.NOPOISONINGCONTENT + "'"
                                   + ",'" + info.WEATHEREN + "'"
                                     + ",'" + info.WEATHER2EN + "'"
                            + ")";
                    }
                    result1 = oh.db_ExecuteNonQuery(strSQL);

                    List<string> nameList1 = new List<string> { "早晨公益", "午间公益", "下午公益" };
                    List<string> nameList2 = new List<string> { "zcgy", "wjgy", "xwgy" };
                    List<string> nameList4 = new List<string> { "白天至傍晚", "中午到傍晚", "今晚到明天" };
                    List<string> nameList5 = new List<string> { "6-20", "12-20", "24" };//森林火险等级date
                    List<string> nameList6 = new List<string> { "9-20", "12-20", "20-20" };//白天至傍晚date
                    List<string> nameList7 = new List<string> { "6-9", "12-20", "20-20" };//天气回顾date
                    List<string> nameList8 = new List<string> { "6-9", "9-20", "20-20" };//天气图标date
                    List<string> nameList9 = new List<string> { "早晨天气", "天气回顾", "天气回顾" };
                    string strRec = "";
                    if (indexHour >= 0)
                    {
                        //strSQL = "select REC from  ybdb.dbys_index where to_char(CREATEDATE,'yyyy-mm-dd')='" + dt.ToString("yyyy-MM-dd") + "' and NAME='" + nameList1[indexHour] + "'";
                        //strRec = db_GreateQuery("EXOAYBDB", strSQL);
                        //if (strRec.Length == 0)
                        //{
                        //    strSQL = "insert into ybdb.dbys_index(REC,NAME,TYPE,CREATEDATE,CREATOR) values("
                        //        + "ybdb.dbys_index_rec.Nextval"
                        //        + ",'" + nameList1[indexHour] + "'"
                        //        + ",'" + nameList2[indexHour] + "'"
                        //        + ", to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                        //        + ",'" + forecaster + "'"
                        //        + ")";
                        //    db_ExecuteNonQuery("EXOAYBDB", strSQL);
                        //    strSQL = "select REC from  ybdb.dbys_index where to_char(CREATEDATE,'yyyy-mm-dd')='" + dt.ToString("yyyy-MM-dd") + "' and NAME='" + nameList1[indexHour] + "'";
                        //    strRec = db_GreateQuery("EXOAYBDB", strSQL);
                        //}
                        //else
                        //{
                        //    strSQL = "update ybdb.dbys_index set CREATOR='" + forecaster + "',CREATEDATE= to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') where REC=" + strRec;
                        //    db_ExecuteNonQuery("EXOAYBDB", strSQL);
                        //}
                        if (strRec.Length > 0)
                        {

                            dataNameList.Add("城市火灾警告信号");
                            dataValueList.Add(info.CityFire);
                            dataDateList.Add(nameList5[indexHour]);

                            dataNameList.Add("森林火险等级");
                            dataValueList.Add(info.ForestFire);
                            dataDateList.Add(nameList5[indexHour]);

                            dataNameList.Add("天气形势");
                            dataValueList.Add(info.Future);
                            dataDateList.Add(nameList7[indexHour]);
                            //天气回顾
                            dataNameList.Add(nameList9[indexHour]);
                            dataValueList.Add(info.PastTimes);
                            dataDateList.Add(nameList7[indexHour]);
                            //中午到傍晚
                            dataNameList.Add(nameList4[indexHour]);
                            dataValueList.Add(info.Weather);
                            dataDateList.Add(nameList6[indexHour]);

                            dataNameList.Add("今日温度范围");
                            dataValueList.Add(info.MinTemp + "-" + info.MaxTemp);
                            dataDateList.Add(nameList5[indexHour]);

                            picPath = "";

                            indexWeather = weatherTag.IndexOf(info.WeatherIcon);
                            if (indexWeather >= 0)
                            {
                                picPath = "/images/tq/" + weatherList[indexWeather];

                            }
                            dataNameList.Add("天气图标");
                            dataValueList.Add(picPath);
                            dataDateList.Add(nameList8[indexHour]);
                            //for (int i = 0; i < dataNameList.Count; i++)
                            //{
                            //    strSQL = "select rec from  ybdb.dbys_details where INDEXID=" + strRec + " and ATTRIBNAME='" + dataNameList[i] + "' and YBDATE='" + dataDateList[i] + "' ";
                            //    strID = db_GreateQuery("EXOAYBDB", strSQL);
                            //    if (strID.Length > 0)
                            //    {
                            //        strSQL = "update ybdb.dbys_details set ATTRIBVALUE='" + dataValueList[i] + "'"
                            //            + ",CREATOR='" + forecaster + "'"
                            //            + ",CREATEDATE= to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')"
                            //            + " where rec=" + strID; ;
                            //    }
                            //    else
                            //    {
                            //        strSQL = "insert into ybdb.dbys_details (rec,INDEXID,ATTRIBNAME,YBDATE, ATTRIBVALUE,CREATEDATE,CREATOR) values("
                            //            + "ybdb.dbys_details_rec.Nextval"
                            //            + "," + strRec + ""
                            //            + ", '" + dataNameList[i] + "'"
                            //            + ", '" + dataDateList[i] + "'"
                            //            + ", '" + dataValueList[i] + "'"
                            //            + ", to_date('" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') "
                            //            + ",'" + forecaster + "'"
                            //            + ")";
                            //    }
                            //    db_ExecuteNonQuery("EXOAYBDB", strSQL);
                            //}
                        }
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return false;

        }
        /// <summary>
        /// 十天预报数值预报数据查询
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public WelfareForecastInfo GetForecastDaysInfo(string dateTime)
        {
            try
            {
                DateTime dt = DateTime.Parse(dateTime);
                DateTime dtF = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd HH:00"));
                if (dt < dtF)
                {
                    dtF = dt.AddHours(-1);
                }
                WelfareForecastInfo infoList = new WelfareForecastInfo();
                string strSQL = "select max(RHSFC) as maxu , min(RHSFC) as minu , max(T2M) as maxt, min(T2M) as mint"
                  + ",max(rain) as maxrain,min(rain) as minrain,round(avg(WDIR10M)) wdir,max(WSPD10M) as maxwind,min(WSPD10M) as minwind "
                  + " from TOP_PRODUCT_VENUE_CAPS1 where ddatetime  =to_date('" + dtF.AddHours(-1).ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =55  and FORECASTTIME>to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and T2M>0 and rain >=0";
                OracleHelper oh = new OracleHelper("EJETDB247LFS");
                DataTable dTable = oh.ExecuteDataTable(strSQL);
                //if (dTable == null || dTable.Rows.Count < 9)
                //{
                //    strSQL = "select max(RHSFC) as maxu , min(RHSFC) as minu , max(T2M) as maxt, min(T2M) as mint"
                //    + ",max(rain) as maxrain,min(rain) as minrain,round(avg(WDIR10M)) wdir,max(WSPD10M) as maxwind,min(WSPD10M) as minwind "
                //    + " from TOP_PRODUCT_VENUE_CAPS1 where ddatetime  =to_date('" + dtF.AddHours(-2).ToString("yyyy-MM-dd HH:00") + "','yyyy-mm-dd hh24:mi')  and VENUEID =55 and FORECASTTIME>to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi')";
                //    dTable = db_GreateDataTable("EJETDB247LFS", strSQL);
                //}
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    //double dT1= 0;
                    //double dT2 = 0;
                    double d0;
                    infoList.DDatetime = dt;
                    infoList.Future = "";
                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["mint"].ToString(), out d0);
                    infoList.MinTemp = d0.ToString("F0");
                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["maxt"].ToString(), out d0);
                    infoList.MaxTemp = d0.ToString("F0");
                    //if (dt.Hour==16&& dT1 < dT2 - 1)
                    //{
                    //    dT2 = dT2 - 1;
                    //}
                    infoList.Rain = dTable.Rows[0]["maxrain"].ToString();
                    //加载10天预报第一天逐六小时的雨量
                    double sumRain = Convert.ToDouble(dTable.Rows[0]["maxrain"].ToString().Trim() == "" ? "0" : dTable.Rows[0]["maxrain"].ToString().Trim());
                    infoList.SixHourRainOne = Math.Round(sumRain / 4, 1).ToString();
                    infoList.SixHourRainTwo = Math.Round(sumRain / 4, 1).ToString();
                    infoList.SixHourRainThree = Math.Round(sumRain / 4, 1).ToString();
                    infoList.SixHourRainFour = Math.Round(sumRain / 4, 1).ToString();

                    infoList.MinRain = dTable.Rows[0]["minrain"].ToString();
                    infoList.WindGust = "";
                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["minu"].ToString(), out d0);
                    infoList.Humidity = d0.ToString("F0");

                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["maxu"].ToString(), out d0);
                    infoList.MaxHumidity = d0.ToString("F0");

                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["wdir"].ToString(), out d0);
                    infoList.WindDirectName = getDirect(d0);

                    double dWind = 0;
                    d0 = 0;
                    double.TryParse(dTable.Rows[0]["minwind"].ToString(), out d0);
                    double.TryParse(dTable.Rows[0]["maxwind"].ToString(), out dWind);
                    string strWind = "";
                    if (d0 > 0 && dWind > 0)
                    {
                        if (GetWindSpeedClass(dWind) > GetWindSpeedClass(d0))
                        {
                            strWind = GetWindSpeedClass(d0) + "-" + GetWindSpeedClass(dWind);
                        }
                        else
                        {
                            strWind = "" + GetWindSpeedClass(dWind);
                        }
                    }
                    else if (dWind > 0)
                    {
                        strWind = "" + GetWindSpeedClass(dWind);
                    }
                    infoList.WindName = strWind;


                    string strWeatherPic = "01.png";
                    d0 = 0;
                    double.TryParse(infoList.Rain, out d0);
                    if (d0 <= 0.05 && d0 > 0)
                    {

                        strWeatherPic = "02.png";
                    }
                    else if (d0 > 0.05 && d0 <= 1)
                    {

                        strWeatherPic = "02_2.png";
                    }
                    else if (d0 > 1 && d0 <= 10)
                    {

                        strWeatherPic = "07.png";
                    }
                    else if (d0 > 10 && d0 <= 30)
                    {

                        strWeatherPic = "08.png";
                    }
                    else if (d0 > 30)
                    {

                        strWeatherPic = "09.png";
                    }

                    infoList.WeatherIcon = strWeatherPic;
                    //if (dt.Hour == 16) {
                    //    infoList.NextdayIcon1 = strWeatherPic;
                    //    infoList.NextdayMinTemp = (dT1+2).ToString("F0");
                    //    if (dT2 < dT1 + 2) {
                    //        dT2 = dT1 + 3;
                    //    }
                    //    infoList.NextdayMaxTemp = dT2.ToString("F0");
                    //}
                    infoList.CityTVIcon = strWeatherPic;
                    infoList.BaoanTVIcon = strWeatherPic;
                    infoList.LonggangTVIcon = strWeatherPic;
                    //实况
                    strSQL = "select max(R01H*0.1) rain,min(t*0.1) mint,max(t*0.1) maxt,max(u) maxu,min(u) minu  from t_localobtmind where obtid ='G3501' and ddatetime between to_date('" + dt.AddDays(-1).ToString("yyyy-MM-dd 20:00") + "','yyyy-mm-dd hh24:mi') and to_date('" + dt.AddHours(-1).ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by ddatetime";
                    OracleHelper sh = new OracleHelper("SZQX13ConnectionString");
                    dTable = sh.ExecuteDataTable(strSQL);
                    if (dTable != null && dTable.Rows.Count > 0)
                    {
                        double dRain = 0;
                        double.TryParse(dTable.Rows[0]["rain"].ToString(), out dRain);
                        double dMinT = 0;
                        double.TryParse(dTable.Rows[0]["mint"].ToString(), out dMinT);
                        double dMaxT = 0;
                        double.TryParse(dTable.Rows[0]["maxt"].ToString(), out dMaxT);
                        double dMinU = 0;
                        double.TryParse(dTable.Rows[0]["minu"].ToString(), out dMinU);
                        double dMaxU = 0;
                        double.TryParse(dTable.Rows[0]["maxu"].ToString(), out dMaxU);
                        //天空状况
                        string strWeather = "晴";
                        if (dRain <= 0.05 && dRain > 0)
                        {
                            strWeather = "晴间多云";
                        }
                        else if (dRain > 0.05 && dRain <= 1)
                        {
                            strWeather = "多云";
                        }
                        else if (dRain > 1 && dRain <= 10)
                        {
                            strWeather = "小雨";
                        }
                        else if (dRain > 10 && dRain <= 30)
                        {
                            strWeather = "中雨";
                        }
                        else if (dRain > 30)
                        {
                            strWeather = "大雨";
                        }
                        switch (dt.Hour)
                        {
                            case 6:
                                infoList.PastTimes = "昨天夜间到今天早晨我市" + strWeather + "，截止早上5点全市最低气温普遍在" + dMinT.ToString("F0") + "℃左右，相对湿度" + dMinU.ToString("F0") + "%-" + dMaxU.ToString("F0") + "%";
                                break;
                            case 11:
                                infoList.PastTimes = "昨日夜间至今天上午我市" + strWeather + "；早晨最低气温" + dMinT.ToString("F1") + "℃；相对湿度" + dMinU.ToString("F0") + "%-" + dMaxU.ToString("F0") + "%。昨晚20时到今天上午10时";
                                break;
                            case 16:
                                infoList.PastTimes = "昨日夜间到今天白天我市" + strWeather + "，全市大部分地区最高气温达" + dMaxT.ToString("F0") + "度；深圳国家基本气象站气温" + dMinT.ToString("F1") + "-" + dMaxT.ToString("F1") + "℃，相对湿度" + dMinU.ToString("F0") + "%-" + dMaxU.ToString("F0") + "%，昨晚20时到今天下午16时";
                                break;
                        }
                        if (dRain == 0) infoList.PastTimes += "，深圳国家基本气象站没有记录到降水。";
                        else
                        {
                            infoList.PastTimes += "，深圳国家基本气象站记录到" + dRain + "毫米降雨。";
                        }
                    }

                    return infoList;
                }

            }
            catch (Exception ex)
            {
                // ErrWriter(ex);
            }
            return null;
        }
        public List<UserInfo> GetTendayUser()
        {
            string strSQL = "select * from tuser where sysprivate = '2'";
            try
            {
                List<UserInfo> listUser = new List<UserInfo>();
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dtReturn = oh.ExecuteDataTable(strSQL);
                if (dtReturn != null && dtReturn.Rows.Count > 0)
                {
                    UserInfo info;
                    for (int i = 0; i < dtReturn.Rows.Count; i++)
                    {
                        info = new UserInfo();
                        info.UserName = dtReturn.Rows[i]["USERNAME"].ToString();
                        info.UPassword = dtReturn.Rows[i]["UPASSWORD"].ToString();
                        info.UserType = dtReturn.Rows[i]["sysprivate"].ToString();
                        listUser.Add(info);
                    }
                }
                return listUser;
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return null;
        }

        public string GetWelfareForecasttime(string dateTime)
        {
            try
            {
                DateTime dt = DateTime.Parse(dateTime);
                string strSQL = "select FORECASTER from lfs_welfareforecast where DDATETIME=to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss') order by recid desc ";
                OracleHelper oh = new OracleHelper("EJETDB247LFSData");
                return oh.db_GreateQuery(strSQL);
            }
            catch (Exception ex)
            {
                // ErrWriter(ex);
            }
            return null;
        }
        public List<WelfareForecastInfo> GetWelfareForecastInfolister(string dateTime)
        {
            try
            {
                DateTime dt = DateTime.Parse(dateTime);
                List<WelfareForecastInfo> infoList = new List<WelfareForecastInfo>();

                DateTime dtF = dt;
                DateTime dtFirst = dt.AddDays(1);
                string strSQL = "select * from LFS_WELFAREFORECASTDAYS where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') order by FORECASTDATE";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable ds = oh.ExecuteDataTable(strSQL);
                if (ds == null || ds.Rows.Count == 0)
                {
                    switch (dt.Hour)
                    {
                        case 6:
                            dtF = DateTime.Parse(dt.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                            break;
                        case 11:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 6:00"));
                            break;
                        case 16:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 11:00"));
                            break;
                        case 8:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                            break;
                        case 20:
                            dtF = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                            break;
                    }
                    if (dt.Hour == 20)
                    {
                        dtFirst = dt.AddDays(2);
                    }
                    strSQL = "select * from LFS_WELFAREFORECASTDAYS where  ddatetime = to_date('" + dtF.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') and forecastdate >= to_date('" + dtFirst.ToString("yyyy-MM-dd") + "', 'yyyy-MM-dd') order by FORECASTDATE";
                    ds = oh.ExecuteDataTable(strSQL);
                }

                if (ds != null && ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        infoList.Add(new WelfareForecastInfo());
                        infoList[i].DDatetime = dt;
                        dtF = dt;
                        DateTime.TryParse(ds.Rows[i]["FORECASTDATE"].ToString(), out dtF);
                        infoList[i].ForecastDate = dtF;
                        infoList[i].MinTemp = ds.Rows[i]["MINTEMP"].ToString();
                        infoList[i].MaxTemp = ds.Rows[i]["MAXTEMP"].ToString();
                        infoList[i].WeatherIcon = ds.Rows[i]["WEATHERPIC"].ToString();
                        infoList[i].WeatherIcon2 = ds.Rows[i]["WEATHERPIC2"].ToString();
                        infoList[i].Weather = ds.Rows[i]["WEATHER"].ToString();
                        infoList[i].WindName = ds.Rows[i]["MinWind"].ToString();
                        infoList[i].WindGust = ds.Rows[i]["MaxWind"].ToString();
                        infoList[i].WindDirectName = ds.Rows[i]["WINDDIRECT"].ToString();
                        infoList[i].Humidity = ds.Rows[i]["MINHUMIDITY"].ToString();
                        infoList[i].MaxHumidity = ds.Rows[i]["MaxHUMIDITY"].ToString();
                        infoList[i].Rain = ds.Rows[i]["RAIN"].ToString();
                        infoList[i].WEATHEREN = ds.Rows[i]["WEATHEREN"].ToString();

                    }
                }
                else
                {
                    switch (dt.Hour)
                    {
                        case 20:
                            dtF = dt.Date.AddDays(2);
                            break;
                        default:
                            dtF = dt.Date.AddDays(1);
                            break;
                    }
                    for (int i = 0; i < 9; i++)
                    {
                        infoList.Add(new WelfareForecastInfo());
                        infoList[i].DDatetime = dt;
                        infoList[i].ForecastDate = dtF;
                        infoList[i].MinTemp = "25";
                        infoList[i].MaxTemp = "30";
                        infoList[i].WeatherIcon = "01.png";
                        infoList[i].WeatherIcon2 = "01.png";
                        infoList[i].Weather = "晴";
                        infoList[i].WindName = "2";
                        infoList[i].WindGust = "3";
                        infoList[i].WindDirectName = "东";
                        infoList[i].Humidity = "30";
                        infoList[i].MaxHumidity = "50";
                        infoList[i].Rain = "0";
                        infoList[i].WEATHEREN = "Sunny and sun-drenched";
                        dtF = dtF.Date.AddDays(1);
                    }
                }
                return infoList;
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return null;
        }


        /// <summary>
        /// 十天预报下半部分格点数据获取与处理
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public List<WelfareForecastInfo> GetWelfareForecastInfolist(string dateTime)
        {
            try
            {
                int start_ybsx = 24;//预报时次开始位置
                int end_ybsx = 168;//预报时次结束位置
                string timesql = "select max(ddatetime) as latesttime from t_hk_ecmwf_grid_forecast t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string latestTime = oh.ExecuteScalar(timesql).ToString();//欧洲中心最新数据时间
                DateTime ecdt = DateTime.Parse(latestTime);
                DateTime dt = DateTime.Parse(dateTime);//系统最新时间
                string dtstr = dt.Hour.ToString();//得到时间的小时，08或20
                string ecdtstr = ecdt.Hour.ToString();//得到时间的小时，08或20
                //如果没有当前最新时间的欧洲中心数据还没入库，则取前一天的08或20时的与当前时间匹配预报数据，因此相应的预报时次需要调整
                if (dt.Ticks > ecdt.Ticks)
                {
                    //如果系统时间大于欧洲中心最新数据的时间，则取前一天的预报时间数据
                    if (dtstr == "8")
                    {
                        if (ecdtstr == "20")
                        {
                            start_ybsx = 36;
                            end_ybsx = 204;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 48;
                            end_ybsx = 192;
                        }
                    }
                    else
                    {
                        if (ecdtstr == "20")
                        {
                            start_ybsx = 48;
                            end_ybsx = 216;
                        }

                        if (ecdtstr == "8")
                        {
                            start_ybsx = 60;
                            end_ybsx = 228;
                        }
                    }
                }
                else
                {
                    latestTime = dt.ToString();
                    if (dtstr == "20")
                    {
                        start_ybsx = 36;
                        end_ybsx = 204;
                    }
                }
                List<WelfareForecastInfo> infoList = null;
                //格点数据获取
                infoList = new List<WelfareForecastInfo>();
                for (int i = 0; i < 9; i++)
                {
                    infoList.Add(new WelfareForecastInfo());
                }

                string strSql = string.Format(@"select ybsx,t2m,rhsfc,WDIR10M,WSPD10M,CLCT,visi,RAIN,t2m,forecasttime from T_HK_ECMWF_GRID_FORECAST t where ddatetime =to_date('{0}','yyyy-MM-dd hh24:mi:ss') and venueid = 106  and ybsx >0 order by ybsx ", latestTime);
                OracleHelper sh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = sh.ExecuteDataTable(strSql);
                List<string[]> mintemp = new List<string[]>();
                List<string[]> humit = new List<string[]>();
                int flag = 0;
                for (int i = start_ybsx; i < end_ybsx; i = i + 24)
                {
                    string[] temp = new string[2];//存储最低最高温度 
                    string[] hum = new string[2];//存储最低最高相对湿度
                    temp[0] = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24) + " and t2m<>0", "T2M asc")[0].ItemArray[1].ToString();
                    temp[1] = dTable.Select("ybsx >= " + i + " and ybsx<= " + (i + 24) + " and t2m<>0", "T2M desc")[0].ItemArray[1].ToString();

                    hum[0] = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24) + " and rhsfc<>0", "rhsfc asc")[0].ItemArray[2].ToString();
                    hum[1] = dTable.Select("ybsx >= " + i + " and ybsx<= " + (i + 24) + " and rhsfc<>0", "rhsfc desc")[0].ItemArray[2].ToString();

                    //infoList[flag].WindDirectName = getDirect(Convert.ToDouble(dTable.Compute("avg(WDIR10M)", "WDIR10M<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)))).ToString();//风向     

                    DataTable newdt = dTable.Clone();
                    DataRow[] rows = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24));
                    foreach (DataRow row in rows)
                    {
                        newdt.Rows.Add(row.ItemArray);
                    }
                    //infoList[flag].WindDirectName=  newdt.Compute("Avg(WDIR10M)", "true").ToString();
                    infoList[flag].WindDirectName = getDirect(Convert.ToDouble(newdt.Rows.Cast<DataRow>().Average(r => r.Field<decimal>("WDIR10M")))).ToString();//风向

                    // infoList[flag].WindName = GetWindSpeedClass(Convert.ToDouble(dTable.Compute("min(WSPD10M)", "WSPD10M<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)))).ToString();//最小风力 
                    // infoList[flag].WindGust = GetWindSpeedClass(Convert.ToDouble(dTable.Compute("max(WSPD10M)", "WSPD10M<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)))).ToString();//最大风力 
                    DataTable newdt1 = dTable.Clone();
                    DataRow[] rows1 = dTable.Select("ybsx >= " + i + " and ybsx<=" + (i + 24));
                    foreach (DataRow row in rows1)
                    {
                        newdt1.Rows.Add(row.ItemArray);
                    }
                    // infoList[flag].WindName = newdt.Compute("min(WSPD10M)", "true").ToString();
                    // infoList[flag].WindGust = newdt.Compute("max(WSPD10M)", "true").ToString();
                    infoList[flag].WindName = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Min(r => r.Field<decimal>("WSPD10M")))).ToString();//最小风速转换为最小风力级别
                    infoList[flag].WindGust = GetWindSpeedClass(Convert.ToDouble(newdt1.Rows.Cast<DataRow>().Max(r => r.Field<decimal>("WSPD10M")))).ToString();//最大风速转换为最大风力级别

                    #region 天气图片
                    int CLCT = Convert.ToInt32(dTable.Compute("max(CLCT)", "ybsx >= " + i + " and ybsx<=" + (i + 24)));//云量
                    // double rain = Convert.ToDouble(dTable.Select("1=1", "rain desc")[0].ItemArray[7]);////雨量
                    // double rain = Convert.ToDouble(dTable.Select("ybsx >= " + i + " and ybsx<= " + (i + 24), "rain desc")[0].ItemArray[7]);
                    double rain = Convert.ToDouble(dTable.Compute("sum(RAIN)", "ybsx >= " + i + " and ybsx< " + (i + 24)));

                    int MaxT = Convert.ToInt32(dTable.Compute("max(T2M)", "t2m<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)));//温度
                    int dictyure = Convert.ToInt32(dTable.Compute("max(RHSFC)", "RHSFC<>0 and ybsx >= " + i + " and ybsx<=" + (i + 24)));// 相对湿度
                    //double visi = Convert.ToDouble(dTable.Compute("max(visi)", "ybsx >= " + i + " and ybsx<=" + (i + 24)));// 能见度
                    double visi = 0.0;
                    int hourSc = dt.Hour;
                    double rain6 = 0.0;
                    double rain11 = 0.0;

                    #region  十天预报获取天气图标 已经注释
                    /*
                      //06-18、07-19、08-20
                      if (dt.Hour == 6)
                      {                        
                          var query = (from forecasttime in dTable.AsEnumerable()
                                       where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 06:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 18:mm:ss"))
                                       select forecasttime.Field<decimal>("rain")).Sum();
                          // DataTable SwapDt= query.CopyToDataTable<DataRow>();

                          var query1 = (from forecasttime in dTable.AsEnumerable()
                                        where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 07:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 19:mm:ss"))
                                        select forecasttime.Field<decimal>("rain")).Sum();

                          var query2 = (from forecasttime in dTable.AsEnumerable()
                                        where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 08:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"))
                                        select forecasttime.Field<decimal>("rain")).Sum();

                      rain6 = Convert.ToDouble(query) >= Convert.ToDouble(query1) ? Convert.ToDouble(query) : Convert.ToDouble(query1);
                      rain6 = rain6 >= Convert.ToDouble(query2) ? rain6 : Convert.ToDouble(query2);

                      }
                      //12-18、13-19、14-20
                      else if (dt.Hour == 11)
                      {
                          var query = (from forecasttime in dTable.AsEnumerable()
                                       where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 12:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 18:mm:ss"))
                                       select forecasttime.Field<decimal>("rain")).Sum();

                          var query1 = (from forecasttime in dTable.AsEnumerable()
                                        where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 13:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 19:mm:ss"))
                                        select forecasttime.Field<decimal>("rain")).Sum();

                          var query2 = (from forecasttime in dTable.AsEnumerable()
                                        where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 14:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"))
                                        select forecasttime.Field<decimal>("rain")).Sum();

                          rain11 = Convert.ToDouble(query) >= Convert.ToDouble(query1) ? Convert.ToDouble(query) : Convert.ToDouble(query1);
                          rain11 = rain11 >= Convert.ToDouble(query2) ? rain6 : Convert.ToDouble(query2);
                      }
                       */
                    #endregion

                    infoList[flag].WeatherIcon = GetTendaysWeatherIcon(CLCT, rain, MaxT, dictyure, visi, hourSc, rain6, rain11);//获取天气图片  
                    #endregion  天气图片

                    mintemp.Add(temp);
                    humit.Add(hum);
                    flag++;
                }
                for (int i = 0; i < mintemp.Count; i++)
                {
                    infoList[i].MinTemp = Math.Round(Convert.ToDouble(mintemp[i][0]), 0).ToString();
                    infoList[i].MaxTemp = Math.Round(Convert.ToDouble(mintemp[i][1]), 0).ToString();
                    infoList[i].Humidity = Math.Round(Convert.ToDouble(humit[i][0]), 0).ToString();
                    infoList[i].MaxHumidity = Math.Round(Convert.ToDouble(humit[i][0]), 0).ToString();
                }

                return infoList;
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return null;
        }

        private string getDirect(double angle)
        {
            string strDir = "北";
            try
            {
                double dTemp = angle / 22.5;
                if (dTemp >= 1 && dTemp < 3)
                {
                    strDir = "东北";
                }
                else if (dTemp >= 3 && dTemp < 5)
                {
                    strDir = "东";
                }
                else if (dTemp >= 5 && dTemp < 7)
                {
                    strDir = "东南";
                }
                else if (dTemp >= 7 && dTemp < 9)
                {
                    strDir = "南";
                }
                else if (dTemp >= 9 && dTemp < 11)
                {
                    strDir = "西南";
                }
                else if (dTemp >= 11 && dTemp < 13)
                {
                    strDir = "西";
                }
                else if (dTemp >= 13 && dTemp < 15)
                {
                    strDir = "西北";
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return strDir;
        }
        //风力级别
        public int GetWindSpeedClass(double rain)
        {
            if (rain > 0.0 && rain < 0.2) return 0;
            if (rain >= 0.3 && rain < 1.6) return 1;
            if (rain >= 1.6 && rain < 3.4) return 2;
            if (rain >= 3.4 && rain < 5.5) return 3;
            if (rain >= 5.5 && rain < 8.0) return 4;
            if (rain >= 8.0 && rain < 10.8) return 5;
            if (rain >= 10.8 && rain < 13.9) return 6;
            if (rain >= 13.9 && rain < 17.2) return 7;
            if (rain >= 17.2 && rain < 20.8) return 8;
            if (rain >= 20.8 && rain < 24.5) return 9;
            if (rain >= 24.5 && rain < 28.5) return 10;
            if (rain >= 28.5 && rain < 32.6) return 11;
            if (rain >= 32.6) return 12;
            return 0;
        }


        /// <summary>
        /// 十天天气预报 处理天气图标
        /// </summary>
        /// <param name="CLCT">云量</param>
        /// <param name="rain">降雨</param>
        /// <param name="MaxT">最大温度</param>
        /// <param name="dictyure">相对湿度</param>
        /// <param name="visi">能见度</param>
        /// <param name="hourSc">预报时次</param>
        /// <param name="rain6"></param>
        /// <param name="rain11"></param>
        /// <returns></returns>
        public string GetTendaysWeatherIcon(int CLCT, double rain, int MaxT, int dictyure, double visi, int hourSc, double rain6, double rain11)
        {
            string resuIcon = string.Empty;
            int temp = MaxT;//温度
            int hour = DateTime.Now.Hour;//当前小时

            //与word文档一一对应
            string[] weIcon = new string[] { "01.png", "11.png", "02.png", "12.png", "02_2.png", "12_2.png", "04.png", "13.png", "03.png", "05.png", "07.png", "08.png", "09.png", "05.png", "10.png", "16.png", "17.png", "15.png", "14.png" };
            //12-20时，在时段中所有的小时图标里，按照“气温>能见度>云量”的优先级
            //未降水
            if (rain == 0.0)
            {
                if (temp >= 35)
                {
                    resuIcon = weIcon[15];
                }
                else if (temp <= 10)
                {
                    resuIcon = weIcon[16];
                }
                else if (visi < 1 && dictyure >= 90)
                {
                    resuIcon = weIcon[17];
                }
                else if (visi < 3 && dictyure <= 80)
                {
                    resuIcon = weIcon[18];
                }
                else if (CLCT < 2 && CLCT > 0)
                {
                    resuIcon = weIcon[0];
                }

                else if (CLCT < 5 && CLCT > 3)
                {
                    resuIcon = weIcon[2];
                }
                else if (CLCT < 8 && CLCT > 6)
                {
                    resuIcon = weIcon[4];
                }
                else if (CLCT > 9)
                {
                    resuIcon = weIcon[8];
                }
                else if (temp > 10 && temp < 35 && visi > 3)
                {
                    resuIcon = weIcon[18];
                }
                else if (temp > 10 && temp < 35 && visi > 1 && visi < 3)
                {
                    resuIcon = weIcon[17];
                }
                else if (CLCT >= 2 && CLCT <= 3)
                {
                    resuIcon = weIcon[2];
                }
                else if (CLCT >= 5 && CLCT <= 6)
                {
                    resuIcon = weIcon[4];
                }
                else if (CLCT >= 8 && CLCT <= 9)
                {
                    resuIcon = weIcon[8];
                }

            }
            //出现降雨
            else if (rain > 0.0)
            {
                if (rain > 0.01 && rain <= 1)
                {
                    resuIcon = weIcon[6];
                }

                if (rain > 1 && rain <= 9.9)
                {
                    resuIcon = weIcon[10];
                }
                if (rain >= 10 && rain <= 24.9)
                {
                    resuIcon = weIcon[11];
                }
                if (rain >= 25 && rain <= 49.9)
                {
                    resuIcon = weIcon[12];
                }
                if (rain >= 50)
                {
                    resuIcon = weIcon[14];
                }
            }
            if (!string.IsNullOrEmpty(resuIcon))
            {
                return resuIcon;
            }
            else
                return "";
        }

        /// <summary>
        /// 公益预报 处理天气图标
        /// </summary>
        /// <param name="CLCT">云量</param>
        /// <param name="rain">降雨</param>
        /// <param name="MaxT">最大温度</param>
        /// <param name="dictyure">相对湿度</param>
        /// <param name="visi">能见度</param>
        /// <param name="hourSc">预报时次</param>
        /// <param name="rain6"></param>
        /// <param name="rain11"></param>
        /// <returns></returns>
        public string HandleWeatherIcon(int CLCT, double rain, int MaxT, int dictyure, double visi, int hourSc, double rain6, double rain11)
        {
            string resuIcon = string.Empty;
            int temp = MaxT;//温度
            int hour = DateTime.Now.Hour;//当前小时

            //与word文档一一对应
            string[] weIcon = new string[] { "01.png", "11.png", "02.png", "12.png", "02_2.png", "12_2.png", "04.png", "13.png", "03.png", "05.png", "07.png", "08.png", "09.png", "05.png", "10.png", "16.png", "17.png", "15.png", "14.png" };
            //对于06-20、12-20两个时段内未出现降水时，在时段中所有的小时图标里，按照“气温>能见度>云量”的优先级
            if (hourSc == 6 || hourSc == 11)
            {
                if (rain == 0.0)
                {
                    if (temp >= 35)
                    {
                        resuIcon = weIcon[15];
                    }
                    else if (temp <= 10)
                    {
                        resuIcon = weIcon[16];
                    }
                    else if (visi < 1 && dictyure >= 90)
                    {
                        resuIcon = weIcon[17];
                    }
                    else if (visi < 3 && dictyure <= 80)
                    {
                        resuIcon = weIcon[18];
                    }
                    else
                    {
                        if (CLCT < 2 && CLCT > 0)
                        {
                            if (hour >= 6 && hour <= 20)
                            {
                                resuIcon = weIcon[0];//白天
                            }
                            else
                            {
                                resuIcon = weIcon[1];//夜间
                            }
                        }
                        if (CLCT < 5 && CLCT > 3)
                        {
                            if (hour >= 6 && hour <= 20)
                            {
                                resuIcon = weIcon[2];
                            }
                            else
                            {
                                resuIcon = weIcon[3];
                            }
                        }
                        if (CLCT < 8 && CLCT > 6)
                        {
                            if (hour >= 6 && hour <= 20)
                            {
                                resuIcon = weIcon[4];
                            }
                            else
                            {
                                resuIcon = weIcon[5];
                            }
                        }
                    }

                }
                else if (rain > 0.0)
                {
                    if (hourSc == 6)//06-18、07-19、08-20
                    {
                        if (rain6 > 0.1 && rain6 < 1)
                        {
                            if (hour >= 6 && hour <= 20)
                            {
                                resuIcon = weIcon[6];
                            }
                            else
                            {
                                resuIcon = weIcon[7];
                            }
                        }
                        if (rain6 > 1 && rain6 <= 4.9)
                        {
                            resuIcon = weIcon[10];
                        }
                        if (rain6 >= 5 && rain6 <= 14.9)
                        {
                            resuIcon = weIcon[11];
                        }
                        if (rain6 >= 15 && rain6 <= 29.9)
                        {
                            resuIcon = weIcon[12];
                        }
                        if (rain6 >= 30)
                        {
                            resuIcon = weIcon[14];
                        }

                    }
                    else if (hourSc == 11)//12-18、13-19、14-20
                    {
                        if (rain11 > 0.1 && rain11 < 1)
                        {
                            if (hour >= 12 && hour <= 20)
                            {
                                resuIcon = weIcon[6];
                            }
                            else
                            {
                                resuIcon = weIcon[7];
                            }
                        }
                        if (rain11 > 1 && rain11 <= 4.9)
                        {
                            resuIcon = weIcon[10];
                        }
                        if (rain11 >= 5 && rain11 <= 14.9)
                        {
                            resuIcon = weIcon[11];
                        }
                        if (rain11 >= 15 && rain11 <= 29.9)
                        {
                            resuIcon = weIcon[12];
                        }
                        if (rain11 >= 30)
                        {
                            resuIcon = weIcon[14];
                        }
                        //雷电
                    }
                }
            }
            //夜间  分别计算20-08时和08-20时的图标。20-08为夜间图标，08-20为白天图标。
            else if (hourSc == 16)
            {
                //未出现降水
                if (rain == 0.0)
                {
                    if (temp >= 35)
                    {
                        resuIcon = weIcon[15];
                    }
                    else if (visi < 1 && dictyure >= 90)
                    {
                        resuIcon = weIcon[17];
                    }
                    else if (visi < 3 && dictyure <= 80)
                    {
                        resuIcon = weIcon[18];
                    }
                    else
                    {
                        if (CLCT < 2 && CLCT > 0)
                        {
                            if (hour > 20 || hour <= 8)//当前日20至次日8市 夜间图标
                            {
                                resuIcon = weIcon[0];
                            }
                            else
                            {
                                resuIcon = weIcon[1];
                            }
                        }
                        if (CLCT < 5 && CLCT > 3)
                        {
                            if (hour > 20 || hour <= 8)
                            {
                                resuIcon = weIcon[2];
                            }
                            else
                            {
                                resuIcon = weIcon[3];
                            }
                        }
                        if (CLCT < 8 && CLCT > 6)
                        {
                            if (hour > 8 && hour <= 20)//白天图标
                            {
                                resuIcon = weIcon[4];
                            }
                            else
                            {
                                resuIcon = weIcon[5];
                            }
                        }
                    }
                }

                //  16 出现降水
                else if (rain > 0.0)
                {
                    if (rain11 > 0.1 && rain11 < 1)
                    {
                        if (hour >= 20 && hour <= 32)
                        {
                            resuIcon = weIcon[6];
                        }
                        else
                        {
                            resuIcon = weIcon[7];
                        }
                    }
                    if (rain6 > 1 && rain6 <= 4.9)
                    {
                        resuIcon = weIcon[10];
                    }
                    if (rain6 >= 5 && rain6 <= 14.9)
                    {
                        resuIcon = weIcon[11];
                    }
                    if (rain6 >= 15 && rain6 <= 29.9)
                    {
                        resuIcon = weIcon[12];
                    }
                    if (rain6 >= 30)
                    {
                        resuIcon = weIcon[14];
                    }
                }
            }
            if (!string.IsNullOrEmpty(resuIcon))
            {
                return resuIcon;
            }
            else
                return "";

        }

        /// <summary>
        /// 十天预报上半部分数据处理函数
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public WelfareForecastInfo GetWelfareForecastInfo(DateTime DDateTime)
        {
            WelfareForecastInfo info = GetWelfareForecastInfoNow(DDateTime);
            if (info == null)
            {
                return GetWelfareForecastFromGrid(DDateTime);
            }
            return info;
        }

        /// <summary>
        /// 十天预报上半部分数据处理函数
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        private WelfareForecastInfo GetWelfareForecastInfoNow(DateTime dt)
        {
            try
            {
                WelfareForecastInfo infoList = null;
                // 原始方法
                string strSQL = "select * from LFS_WELFAREFORECAST where  ddatetime = to_date('" + dt.ToString("yyyy-MM-dd HH:mm") + "','yyyy-mm-dd hh24:mi') ";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                DataTable dTable = oh.ExecuteDataTable(strSQL);

                if (dTable != null && dTable.Rows.Count > 0)
                {
                    infoList = new WelfareForecastInfo();
                    infoList.DDatetime = dt;
                    infoList.PastTimes = dTable.Rows[0]["WEATHERBACK"].ToString();
                    infoList.Weather = dTable.Rows[0]["WEATHERTODAY"].ToString();
                    infoList.Future = dTable.Rows[0]["FUTURE"].ToString();
                    infoList.WeatherIcon = dTable.Rows[0]["WEATHERPIC"].ToString();

                    infoList.WeatherIcon2 = dTable.Rows[0]["WEATHERPIC2"].ToString();

                    infoList.NextdayIcon1 = dTable.Rows[0]["NEXTDAYWEATHERPIC1"].ToString();
                    infoList.NextdayIcon2 = dTable.Rows[0]["NEXTDAYWEATHERPIC2"].ToString();
                    infoList.NextdayMinTemp = dTable.Rows[0]["NEXTDAYMINTEMP"].ToString();
                    infoList.NextdayMaxTemp = dTable.Rows[0]["NEXTDAYMAXTEMP"].ToString();
                    infoList.NextdayWeather = dTable.Rows[0]["NEXTDAYWEATHER"].ToString();
                    infoList.NextdayWord = dTable.Rows[0]["NEXTDAYWEATHERWORD"].ToString();

                    infoList.Word = dTable.Rows[0]["TODAYWEATHERWORD"].ToString();
                    infoList.CityTVIcon = dTable.Rows[0]["CITYTVPIC"].ToString();
                    infoList.BaoanTVIcon = dTable.Rows[0]["BAOANTVPIC"].ToString();
                    infoList.LonggangTVIcon = dTable.Rows[0]["LONGGANGTVPIC"].ToString();

                    infoList.Air = dTable.Rows[0]["AIR"].ToString();
                    infoList.AirLevel = dTable.Rows[0]["AIRLEVEL"].ToString();
                    infoList.Rays = dTable.Rows[0]["RAYS"].ToString();
                    infoList.SunLevel = dTable.Rows[0]["SUNLEVEL"].ToString();

                    infoList.MinTemp = Convert.ToDouble(dTable.Rows[0]["MINTEMP"]).ToString("F1");
                    infoList.MaxTemp = Convert.ToDouble(dTable.Rows[0]["MAXTEMP"]).ToString("F1");
                    infoList.Rain = dTable.Rows[0]["RAIN"].ToString();
                    infoList.MinRain = dTable.Rows[0]["MINRAIN"].ToString();
                    infoList.WindGust = dTable.Rows[0]["WINDGUST"].ToString();
                    infoList.MaxHumidity = dTable.Rows[0]["MAXHUMIDITY"].ToString();
                    infoList.Humidity = dTable.Rows[0]["HUMIDITY"].ToString();
                    infoList.WindDirectName = dTable.Rows[0]["WINDDIRECT"].ToString();
                    infoList.WindName = dTable.Rows[0]["WINDSPEED"].ToString();
                    infoList.WindDirectName2 = dTable.Rows[0]["WINDDIRECT2"].ToString();

                    infoList.CityFireLevel = dTable.Rows[0]["CITYFIRELEVEL"].ToString();
                    infoList.ForestFireLevel = dTable.Rows[0]["FORESTFIRELEVEL"].ToString();
                    infoList.HIGHTEMPLEVEL = dTable.Rows[0]["HIGHTEMPLEVEL"].ToString();
                    infoList.HIGHTEMPCONTENT = dTable.Rows[0]["HIGHTEMPCONTENT"].ToString();
                    infoList.NOPOISONINGLEVEL = dTable.Rows[0]["NOPOISONINGLEVEL"].ToString();
                    infoList.NOPOISONINGCONTENT = dTable.Rows[0]["NOPOISONINGCONTENT"].ToString();
                    infoList.WEATHEREN = dTable.Rows[0]["WEATHEREN"].ToString();
                    infoList.WEATHER2EN = dTable.Rows[0]["WEATHER2EN"].ToString();

                    infoList.SixHourRainOne = dTable.Rows[0]["SIXHOURRAINONE"].ToString();
                    infoList.SixHourRainTwo = dTable.Rows[0]["SIXHOURRAINTWO"].ToString();
                    infoList.SixHourRainThree = dTable.Rows[0]["SIXHOURRAINTHREE"].ToString();
                    infoList.SixHourRainFour = dTable.Rows[0]["SIXHOURRAINFOUR"].ToString();

                    #region 天气图片
                    string rainSQL = string.Format(@"select  ybsx,t2m,rhsfc,WDIR10M,WSPD10M,CLCT,visi,RAIN,t2m,forecasttime from t_hk_new_grid_forecast t where ddatetime =to_date('{0}','yyyy-MM-dd hh24:mi:ss') and venueid = 106  and ybsx >0 order by ybsx ", dt.ToString("yyyy-MM-dd HH:mm:00"));

                    OracleHelper sh = new OracleHelper("HAIKOUConnect");
                    OracleHelper thTest = new OracleHelper("HAIKOUConnect");
                    DataTable ds = thTest.ExecuteDataTable(rainSQL);
                    if (ds == null || ds.Rows.Count == 0)
                        ds = sh.ExecuteDataTable(rainSQL);

                    DateTime Bdt = dt;
                    DateTime Edt = dt;
                    if (dt.Hour == 6 || dt.Hour == 11)
                    {
                        Bdt = Convert.ToDateTime(dt.ToString("yyyy-MM-dd 06:mm:ss"));
                        Edt = Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"));
                    }
                    else
                    {
                        Bdt = Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"));
                        Edt = Convert.ToDateTime(dt.AddDays(1).ToString("yyyy-MM-dd 20:mm:ss"));
                    }
                    int CLCT = Convert.ToInt32((from Coloumn in ds.AsEnumerable()
                                                where Coloumn.Field<DateTime>("forecasttime") >= Convert.ToDateTime(Bdt.ToString("yyyy-MM-dd HH:mm:ss")) && Coloumn.Field<DateTime>("forecasttime") <= Convert.ToDateTime(Edt.ToString("yyyy-MM-dd HH:mm:ss"))
                                                select Coloumn.Field<object>("CLCT")).Max());//云量

                    var swapRain = (from Column in ds.AsEnumerable()
                                    where Column.Field<DateTime>("forecasttime") >= Convert.ToDateTime(Bdt.ToString("yyyy-MM-dd HH:mm:ss")) && Column.Field<DateTime>("forecasttime") <= Convert.ToDateTime(Edt.ToString("yyyy-MM-dd HH:mm:ss"))
                                    select Column.Field<object>("rain")).Max();
                    double rain = Convert.ToDouble(swapRain);//雨量

                    int MaxT = Convert.ToInt32((from Column in ds.AsEnumerable()
                                                where Column.Field<DateTime>("forecasttime") >= Convert.ToDateTime(Bdt.ToString("yyyy-MM-dd HH:mm:ss")) && Column.Field<DateTime>("forecasttime") <= Convert.ToDateTime(Edt.ToString("yyyy-MM-dd HH:mm:ss"))
                                                select Column.Field<object>("T2M")).Max());//温度

                    int dictyure = Convert.ToInt32((from Column in ds.AsEnumerable()
                                                    where Column.Field<DateTime>("forecasttime") >= Convert.ToDateTime(Bdt.ToString("yyyy-MM-dd HH:mm:ss")) && Column.Field<DateTime>("forecasttime") <= Convert.ToDateTime(Edt.ToString("yyyy-MM-dd HH:mm:ss"))
                                                    select Column.Field<object>("RHSFC")).Max());// 相对湿度

                    double visi = Convert.ToDouble((from Column in ds.AsEnumerable()
                                                    where Column.Field<DateTime>("forecasttime") >= Convert.ToDateTime(Bdt.ToString("yyyy-MM-dd HH:mm:ss")) && Column.Field<DateTime>("forecasttime") <= Convert.ToDateTime(Edt.ToString("yyyy-MM-dd HH:mm:ss"))
                                                    select Column.Field<object>("visi")).Max());// 能见度
                    int hourSc = dt.Hour;
                    double rain6 = 0.0;
                    double rain11 = 0.0;
                    //06-18、07-19、08-20
                    if (dt.Hour == 6)
                    {
                        var query = (from forecasttime in ds.AsEnumerable()
                                     where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 06:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 18:mm:ss"))
                                     select forecasttime.Field<decimal>("rain")).Sum();
                        // DataTable SwapDt= query.CopyToDataTable<DataRow>();

                        var query1 = (from forecasttime in ds.AsEnumerable()
                                      where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 07:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 19:mm:ss"))
                                      select forecasttime.Field<decimal>("rain")).Sum();

                        var query2 = (from forecasttime in ds.AsEnumerable()
                                      where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 08:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"))
                                      select forecasttime.Field<decimal>("rain")).Sum();

                        rain6 = Convert.ToDouble(query) >= Convert.ToDouble(query1) ? Convert.ToDouble(query) : Convert.ToDouble(query1);
                        rain6 = rain6 >= Convert.ToDouble(query2) ? rain6 : Convert.ToDouble(query2);

                    }
                    //12-18、13-19、14-20
                    else if (dt.Hour == 11)
                    {
                        var query = (from forecasttime in ds.AsEnumerable()
                                     where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 12:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 18:mm:ss"))
                                     select forecasttime.Field<decimal>("rain")).Sum();

                        var query1 = (from forecasttime in ds.AsEnumerable()
                                      where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 13:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 19:mm:ss"))
                                      select forecasttime.Field<decimal>("rain")).Sum();

                        var query2 = (from forecasttime in ds.AsEnumerable()
                                      where forecasttime.Field<DateTime>("forecasttime") >= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 14:mm:ss")) && forecasttime.Field<DateTime>("forecasttime") <= Convert.ToDateTime(dt.ToString("yyyy-MM-dd 20:mm:ss"))
                                      select forecasttime.Field<decimal>("rain")).Sum();

                        rain11 = Convert.ToDouble(query) >= Convert.ToDouble(query1) ? Convert.ToDouble(query) : Convert.ToDouble(query1);
                        rain11 = rain11 >= Convert.ToDouble(query2) ? rain6 : Convert.ToDouble(query2);
                    }
                    if (infoList.WeatherIcon2 == "")
                        infoList.WeatherIcon2 = HandleWeatherIcon(CLCT, rain, MaxT, dictyure, visi, hourSc, rain6, rain11);//获取天气图片
                    #endregion  天气图片
                    return infoList;
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }

        private WelfareForecastInfo GetWelfareForecastFromGrid(DateTime dt)
        {
            #region
            int BeYBSX = 0, Enybsx = 0, index = 6;
            switch (dt.Hour)
            {
                case 6:
                    BeYBSX = 3;//08时开始
                    Enybsx = 14;
                    index = 8;
                    break;
                case 08:
                    BeYBSX = 3;//今天08时
                    Enybsx = 12;//今天20时
                    break;
                case 11:
                    BeYBSX = 1;
                    Enybsx = 9;
                    index = 3;
                    break;
                case 16:
                    BeYBSX = 1;
                    Enybsx = 24;
                    break;
                case 20:
                    BeYBSX = 12;//今日晚间20时
                    Enybsx = 36;//明日晚间20时
                    break;
            }
            try
            {
                string sql = string.Empty;
                string timesql = "select max(ddatetime) as latesttime from t_hk_new_grid_forecast t";
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                string latestTime = oh.ExecuteScalar(timesql).ToString();//由于欧洲中心数据晚到，因此通过此方式取最新的欧洲中心预报时间（08或20）
                DateTime newTime = Convert.ToDateTime(latestTime);
                if (dt.Ticks < newTime.Ticks)
                {
                    latestTime = dt.ToString();
                }

                if (dt.Hour == 6 || dt.Hour == 11 || dt.Hour == 08)
                {
                    sql = string.Format(@" select *  from ( select* from T_HK_NEW_GRID_FORECAST t
                                         where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                           and venueid = 106
                                           and ybsx > 0 
                                         order by ybsx
                                         )
                                         where forecasttime>=to_date('{1}', 'yyyy-MM-dd hh24:mi:ss')  and forecasttime<=to_date('{2}', 'yyyy-MM-dd hh24:mi:ss')", latestTime, dt.ToString("yyyy-MM-dd 08:mm:00"), dt.AddDays(1).ToString("yyyy-MM-dd 08:mm:00"));
                }
                else
                {
                    sql = string.Format(@" select *  from ( select* from T_HK_NEW_GRID_FORECAST t
                                         where ddatetime = to_date('{0}', 'yyyy-MM-dd hh24:mi:ss') 
                                           and venueid = 106
                                           and ybsx > 0 
                                         order by ybsx
                                         )
                                         where forecasttime>=to_date('{1}', 'yyyy-MM-dd hh24:mi:ss')  and forecasttime<=to_date('{2}', 'yyyy-MM-dd hh24:mi:ss')", latestTime, dt.ToString("yyyy-MM-dd 20:mm:00"), dt.AddDays(1).ToString("yyyy-MM-dd 20:mm:00"));
                }


                string strSql = string.Format(@"select  *  from T_HK_NEW_GRID_FORECAST t where ddatetime =to_date('{0}','yyyy-MM-dd hh24:mi:ss') and venueid = 106  and ybsx >0 and ybsx between {1} and {2} order by ybsx ", latestTime, BeYBSX, Enybsx);
                OracleHelper thTest = new OracleHelper("HAIKOUConnect");
                OracleHelper th = new OracleHelper("HAIKOUConnect");

                DataTable dRain = thTest.ExecuteDataTable(sql);
                if (dRain == null || dRain.Rows.Count == 0)
                    dRain = th.ExecuteDataTable(sql);

                DataTable dtable = thTest.ExecuteDataTable(strSql);
                if (dtable == null || dtable.Rows.Count == 0)
                    dtable = th.ExecuteDataTable(sql);

                WelfareForecastInfo infoList = new WelfareForecastInfo();
                if (dtable != null && dtable.Rows.Count > 0)
                {
                    infoList.DDatetime = dt;
                    infoList.MinTemp = dtable.Select("T2M<>0", " T2M asc")[0].Table.Rows.OfType<DataRow>().Select(T => Convert.ToDouble(T["T2M"])).Min().ToString("F1");//当天最低温度
                    infoList.MaxTemp = dtable.Select("T2M<>0", " T2M asc")[0].Table.Rows.OfType<DataRow>().Select(T => Convert.ToDouble(T["T2M"])).Max().ToString("F1");//当天最高温度
                    infoList.MaxHumidity = dtable.Select("RHSFC<>0", " RHSFC asc")[0].Table.Rows.OfType<DataRow>().Select(T => Convert.ToDouble(T["RHSFC"])).Max().ToString();//
                    infoList.Humidity = dtable.Select("RHSFC<>0", " RHSFC desc")[0].Table.Rows.OfType<DataRow>().Select(T => Convert.ToDouble(T["RHSFC"])).Min().ToString();//湿度
                    infoList.WindDirectName = getDirect(Convert.ToDouble(dRain.Compute("avg(WDIR10M)", "WDIR10M<>0"))).ToString();//风向
                    infoList.WindName = GetWindSpeedClass(Convert.ToDouble(dRain.Compute("avg(WSPD10M)", "WSPD10M<>0"))).ToString();//风力 

                    infoList.SixHourRainOne = Math.Round(Convert.ToDouble(dRain.Compute("sum(rain)", "ybsx<=" + (index) + "").ToString()), 1).ToString("F1"); //第一个逐六小时雨量
                    infoList.SixHourRainTwo = Math.Round(Convert.ToDouble(dRain.Compute("sum(rain)", "ybsx>" + (index) + " and ybsx<=" + (index + 6) + "").ToString()), 1).ToString("F1");//第2个逐六小时雨量
                    infoList.SixHourRainThree = Math.Round(Convert.ToDouble(dRain.Compute("sum(rain)", "ybsx>" + (index + 6) + " and ybsx<=" + (index + 12) + "").ToString()), 1).ToString("F1");//第3个逐六小时雨量
                    infoList.SixHourRainFour = Math.Round(Convert.ToDouble(dRain.Compute("sum(rain)", "ybsx>" + (index + 12) + " and ybsx<=" + (index + 18) + "").ToString()), 1).ToString("F1");//第4个逐六小时雨量

                    int CLCT = Convert.ToInt32(dRain.Compute("max(CLCT)", ""));//云量
                    double rain = Convert.ToDouble(dRain.Compute("sum(rain)", ""));//雨量
                    int MaxT = Convert.ToInt32(dRain.Compute("max(T2M)", "t2m<>0"));//温度
                    int dictyure = Convert.ToInt32(dRain.Compute("max(RHSFC)", "RHSFC<>0"));// 相对湿度
                    //double visi = Convert.ToDouble(dRain.Compute("max(visi)", ""));// 能见度
                    double visi = 0.0;
                    int hourSc = dt.Hour;
                    double rain6 = 0.0;
                    double rain11 = 0.0;

                    infoList.WeatherIcon = GetTendaysWeatherIcon(CLCT, rain, MaxT, dictyure, visi, hourSc, rain6, rain11);//获取天气图片
                    infoList.WEATHEREN = GetDesByImg(infoList.WeatherIcon)[1];//英文用语天气状况一
                    string info = "气温" + infoList.MinTemp + "-" + infoList.MaxTemp + "℃；" + infoList.WindDirectName + "；相对湿度" + infoList.Humidity + "%-" + infoList.MaxHumidity + "% ";
                    infoList.Weather = string.IsNullOrEmpty(GetDesByImg(infoList.WeatherIcon)[0]) ? info : GetDesByImg(infoList.WeatherIcon)[0] + "；" + info;

                }
                else
                {
                    infoList.MinTemp = "0";
                    infoList.MaxTemp = "0";
                    infoList.MaxHumidity = "0";
                    infoList.Humidity = "0";
                    infoList.WindDirectName = "无";
                    infoList.WindName = "0";
                    infoList.SixHourRainOne = "0";
                    infoList.SixHourRainTwo = "0";
                    infoList.SixHourRainThree = "0";
                    infoList.SixHourRainFour = "0";
                    infoList.Weather = "晴；气温0-0℃；相对湿度0%-0% ";
                    infoList.WeatherIcon = "01.png";//天气预测图标
                    infoList.WEATHEREN = "";//英文用语天气状况一
                }
                string proSql = string.Format(@"select * from wechat_prodocut_hn t where PRO_ID =5");//取入库的三天预报报文数据
                DataTable protable = th.ExecuteDataTable(proSql);
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
                else if (pro_content.Split('。').Length >= 3)
                {
                    pastpro = pro_content.Split('。')[0].Split('：')[1] + "。";
                    futurepro = pro_content.Split('。')[1] + "。" + pro_content.Split('。')[2] + "。";
                }
                else if (pro_content.Split('；').Length == 2)
                {
                    pastpro = pro_content.Split('。')[0].Split('：')[1];
                    futurepro = pro_content.Split('。')[1];
                }
                //天空状况
                switch (dt.Hour)
                {
                    case 6:
                        infoList.PastTimes = "昨天夜间到今天早晨我市晴，截止早上5点全市最低气温普遍在0℃左右，相对湿度0%-0%";
                        break;
                    case 11:
                        infoList.PastTimes = "昨日夜间至今天上午我市晴；早晨最低气温0℃；相对湿度0%-0%。昨晚20时到今天上午10时";
                        break;
                    case 16:
                        infoList.PastTimes = "昨日夜间到今天白天我市晴，全市大部分地区最高气温达0度；海口国家基本气象站气温0-0℃，相对湿度0%-0%，昨晚20时到今天下午16时";
                        break;
                    case 8:
                        if (pastpro != "")
                        {
                            infoList.PastTimes = pastpro;
                        }
                        else
                        {
                            infoList.PastTimes = "昨日夜间到今天白天我市晴，全市大部分地区最高气温达0度；海口国家基本气象站气温0-0℃，相对湿度0%-0%，昨晚20时到今天下午16时";
                        }
                        break;
                    case 20:
                        if (pastpro != "")
                        {
                            infoList.PastTimes = pastpro;
                        }
                        else
                        {
                            infoList.PastTimes = "昨日夜间到今天白天我市晴，全市大部分地区最高气温达0度；海口国家基本气象站气温0-0℃，相对湿度0%-0%，昨晚20时到今天下午16时";
                        }
                        break;
                }
                infoList.WindDirectName2 = "无"; //风向2
                infoList.Rain = "0";//降雨量
                infoList.MinRain = "";//最小降雨量
                infoList.WindGust = "0";//阵风
                infoList.Future = "";
                if (futurepro != "")
                {
                    infoList.Future = futurepro;
                }
                infoList.WeatherIcon2 = "";//当天天气图标
                infoList.NextdayIcon1 = "";
                infoList.NextdayIcon2 = "";
                infoList.NextdayMinTemp = "";
                infoList.NextdayMaxTemp = "";
                infoList.NextdayWeather = "";
                infoList.NextdayWord = "";
                infoList.Word = "";
                infoList.CityTVIcon = "";//城市天气图标
                infoList.BaoanTVIcon = "";
                infoList.LonggangTVIcon = "";
                infoList.Air = "";//空气质量等级
                infoList.AirLevel = "";//空气质量等级
                infoList.Rays = "";//紫外线等级
                infoList.SunLevel = "";//暴晒等级
                infoList.CityFireLevel = "";//城市火灾警告信号
                infoList.ForestFireLevel = "";//森林火险等级
                infoList.HIGHTEMPLEVEL = "";//高温预警等级
                infoList.HIGHTEMPCONTENT = "";//高温预警内容
                infoList.NOPOISONINGLEVEL = "";//一氧化碳中毒气象等级
                infoList.NOPOISONINGCONTENT = "";//一氧化碳中毒气象等级内容
                infoList.WEATHER2EN = "";//英文用语天气状况一
                return infoList;
            #endregion
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return null;
        }
        private List<string> GetDesByImg(string Img)
        {
            List<string> list = new List<string>();
            switch (Img)
            {
                case "01.png":
                    list.Add("天气晴朗，阳光强烈");
                    list.Add("Sunny and sun-drenched");
                    break;

                case "02.png":
                    list.Add("大致天晴，阳光充足");
                    list.Add("Mainly fine with plenty of sunshine");
                    break;

                case "02_2.png":
                    list.Add("多云，大部分时间可见阳光");
                    list.Add("Cloudy, mostly sunny");
                    break;

                case "03.png":
                    list.Add("阴天，日温差小");
                    list.Add("Overcast, with small diurnal temperature range");
                    break;

                case "04.png":
                    list.Add("阵雨或雷阵雨，部分时间可见阳光");
                    list.Add("Shower or thundershower, partly sunny");
                    break;

                case "05.png":
                    list.Add("雷阵雨");
                    list.Add("Thundershower");
                    break;

                case "06.png":
                    list.Add("阵雨");
                    list.Add("Shower");
                    break;
                case "07.png":
                    list.Add("小雨");
                    list.Add("Light rain");
                    break;
                case "08.png":
                    list.Add("中雨");
                    list.Add("Moderate rain");
                    break;
                case "09.png":
                    list.Add("大雨");
                    list.Add("Heavy rain");
                    break;
                case "10.png":
                    list.Add("暴雨");
                    list.Add("Rainstorm");
                    break;
                case "11.png":
                    list.Add("晴");
                    list.Add("Fine");
                    break;
                case "12.png":
                    list.Add("少云");
                    list.Add("Partly Cloudy");
                    break;
                case "13.png":
                    list.Add("阵雨");
                    list.Add("Shower");
                    break;
                case "14.png":
                    list.Add("大致多云，有中度灰霾，能见度低");
                    list.Add("Mainly cloudy, with moderate haze and low visibility");
                    break;
                case "15.png":
                    list.Add("大致多云，潮湿多雾，能见度低");
                    list.Add("Mainly cloudy, humid, foggy, with low visibility");
                    break;
                case "16.png":
                    list.Add("大致天晴，天气酷热");
                    list.Add("Mainly sunny, extremely hot");
                    break;
                case "17.png":
                    list.Add("阴天寒冷，短暂时间有阳光");
                    list.Add("Overcast, cold, with sunny intervals");
                    break;
                default:
                    list.Add("");
                    list.Add("");
                    break;
            }
            return list;
        }

    }
}
