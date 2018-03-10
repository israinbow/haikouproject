using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Configuration;
using Common;
using System.Collections;
using System.Drawing;

namespace DAL
{
    public class CommutingForecast
    {
        public static DataTable GetUserInfo()
        {
            DataTable dt = null;
            try
            {
                string sql = "select * from TUSER";
                OracleHelper db = new OracleHelper("HAIKOUConnect");
                return db.ExecuteDataTable(sql);
            }
            catch (Exception ee)
            {
                OracleHelper.ErrWriter(ee);
            }
            return dt;
        }
        public static int IsLogin(string username, string password)
        {
            try
            {
                string sql = "select count(*) from TUSER where USERNAME='" + username + "' and UPASSWORD='" + password + "'";
                OracleHelper db = new OracleHelper("HAIKOUConnect");
                return int.Parse(db.ExecuteScalar(sql).ToString());
            }
            catch (Exception ee)
            {
                OracleHelper.ErrWriter(ee);
            }
            return 0;
        }
        public static List<List<string>> GetSZForecastTXT(DateTime dt, int dayHour)
        {
            OracleHelper db = new OracleHelper("HAIKOUConnect");
            List<List<string>> listInfo = new List<List<string>>();
            try
            {
                listInfo.Add(new List<string> { "天气回顾", "" });
                listInfo.Add(new List<string> { "天气形势", "" });
                listInfo.Add(new List<string> { "白天至傍晚", "" });
                listInfo.Add(new List<string> { "天气预报", "" });
                listInfo.Add(new List<string> { "预报员", "" });
                listInfo.Add(new List<string> { "微薄", "" });
                listInfo.Add(new List<string> { "邮件", "" });
                string strWXTS = "";
                if (dayHour > 11)
                {
                    listInfo[2][0] = "今晚到明天";
                }

                DataTable ds;
                string strSQL;
                strSQL = "select * from lfs_specialtime where DDATETIME=to_date('" + dt.ToString("yyyy-MM-dd") + " " + dayHour + ":00" + "','yyyy-mm-dd HH24:mi') order by DDATETIME desc";
                ds = db.ExecuteDataTable(strSQL);
                if (ds != null && ds.Rows.Count > 0)
                {
                    listInfo[0][1] = ds.Rows[0]["REALINFO"].ToString();
                    listInfo[1][1] = ds.Rows[0]["FORECASTSZ"].ToString();
                    listInfo[2][1] = ds.Rows[0]["FORECASTFUTURE"].ToString();
                    listInfo[3][1] = ds.Rows[0]["FORECAST1H"].ToString();
                    listInfo[4][1] = ds.Rows[0]["FORECASTER"].ToString();
                    listInfo[5][1] = ds.Rows[0]["ISMINIBLOG"].ToString();
                    listInfo[6][1] = ds.Rows[0]["ISEMAIL"].ToString();
                }
                else
                {
                    List<int> timeSubList = new List<int> { 6, 7, 8, 17, 18, 19 };
                    int timeIndex = timeSubList.IndexOf(dayHour);
                    if (timeIndex > 0)
                    {
                        strSQL = "select * from lfs_specialtime where DDATETIME =to_date('" + dt.ToString("yyyy-MM-dd") + " " + timeSubList[timeIndex - 1] + ":00" + "','yyyy-mm-dd HH24:mi') order by DDATETIME desc";
                        ds = db.ExecuteDataTable(strSQL);
                        if (ds != null && ds.Rows.Count > 0)
                        {
                            listInfo[3][1] = ds.Rows[0]["FORECAST1H"].ToString();
                            listInfo[4][1] = ds.Rows[0]["FORECASTER"].ToString();
                        }
                    }
                }

                strSQL = "select * from LFS_WELFAREFORECAST where DDATETIME=to_date('" + dt.ToString("yyyy-MM-dd") + " 8:00','yyyy-mm-dd HH24:mi') order by recid desc ";
                ds = db.ExecuteDataTable(strSQL);
                if (ds != null && ds.Rows.Count > 0)
                {
                    //天气回顾
                    listInfo[0][1] = ds.Rows[0]["WEATHERBACK"].ToString();
                    //天气形势
                    listInfo[1][1] = ds.Rows[0]["WEATHERTODAY"].ToString();
                    //天气展望
                    listInfo[2][1] = ds.Rows[0]["FUTURE"].ToString();
                    if (listInfo[4][1].Length < 1)
                    {
                        listInfo[4][1] = ds.Rows[0]["FORECASTER"].ToString();
                    }
                }
                else
                {
                    string proSql = string.Format(@"select  *  from wechat_prodocut_hn t where PRO_ID =5");
                    DataTable protable = db.ExecuteDataTable(proSql);
                    string pro_content = protable.Rows[0]["PRO_CONTEXT"].ToString();
                    string pastpro = "";
                    string futurepro = "";
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
                    
                    //天气回顾
                    listInfo[0][1] = pastpro;
                    //天气形势
                    listInfo[1][1] = "";
                    //天气展望
                    listInfo[2][1] = futurepro;
                }
                //天气预报
                if (listInfo[3][1].Length < 1)
                {
                    strSQL = "select max(t2m) as maxt,min(t2m) as mint,max(RHSFC) as maxu,min(RHSFC) as minu from t_hk_ecmwf_grid_forecast where YBSX=3 and ddatetime in ( "
                        + " select max(ddatetime) from t_hk_ecmwf_grid_forecast "
                        //+ " where DDATETIME between to_date('" + dt.ToString("yyyy-MM-dd") + " " + (dayHour - 3) + ":00" + "','yyyy-mm-dd HH24:mi') and to_date('" + dt.ToString("yyyy-MM-dd") + " " + dayHour + ":00" + "','yyyy-mm-dd HH24:mi') "
                        + " )";
                    db = new OracleHelper("HAIKOUConnect");
                    ds = db.ExecuteDataTable(strSQL);
                    if (ds != null && ds.Rows.Count > 0)
                    {
                        string strW1 = "阴天";
                        if (listInfo[2][1].IndexOf("；") > 0)
                        {
                            strW1 = listInfo[2][1].Substring(0, listInfo[2][1].IndexOf("；"));
                        }
                        double d1 = 0;
                        double.TryParse(ds.Rows[0]["mint"].ToString(), out d1);
                        double d2 = 0;
                        double.TryParse(ds.Rows[0]["maxt"].ToString(), out d2);
                        double d3 = 50;
                        double.TryParse(ds.Rows[0]["minu"].ToString(), out d3);
                        double d4 = 60;
                        double.TryParse(ds.Rows[0]["maxu"].ToString(), out d4);
                        if (d4 >= 100)
                        {
                            d4 = 99;
                        }

                        string strContent = "预计早晨6-9时，全市" + strW1 + "；气温" + d1.ToString("F0") + "-" + d2.ToString("F0") + "℃，相对湿度" + d3.ToString("F0") + "%-" + d4.ToString("F0") + "%；";
                        if (strWXTS.Trim().Length > 0)
                        {
                            strContent = strContent + strWXTS.Trim();
                        }
                        if (d2 < 1) strContent = "";
                        listInfo[3][1] = strContent;
                    }
                }
            }
            catch (Exception ex)
            {
                OracleHelper.ErrWriter(ex);
            }
            return listInfo;
        }
        public static DataTable GetAwsDatas(DateTime ddatetime, string valuesname)
        {
            DataTable dt = null;
            try
            {
                //string tablename = "T_LOCALOBTMIND";t_aws_df_pre_min
                string tablename = "t_aws_df_pre_min";
                string fieldname = valuesname;

                if (valuesname == "T" || valuesname == "U")//温度
                {
                    tablename = "surf_chn_mul_min";//取海口的从cimiss融合的分钟数据
                }

                string sql = "select t2.stname, t2.Longitude,t2.latitude," + fieldname + " from " + tablename + " t1 join t_obtcode_new t2 on  t1.obtid = t2.obtid and ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') and t2.Longitude is not null and t2.latitude is not null and " + fieldname + " is not null and " + fieldname + "<9000";
                if (valuesname == "WD2DF")//风
                {
                    tablename = "surf_chn_mul_min";//取海口的从cimiss融合的分钟数据
                    fieldname = valuesname + ",WD2DD";
                    sql = "select t2.stname, t2.Longitude,t2.latitude," + fieldname + " from " + tablename + " t1 join t_obtcode_new t2 on  t1.obtid = t2.obtid and ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') and t2.Longitude is not null and t2.latitude is not null and WD10DD is not null and WD10DF is not null and WD2DD<9000";
                }
                if (valuesname == "V")//能见度
                {
                    tablename = "surf_chn_mul_min";//取海口的从cimiss融合的分钟数据
                    fieldname = "VIS_MIN";
                    sql = "select t2.stname, t2.Longitude,t2.latitude," + fieldname + " as V from " + tablename + " t1 join t_obtcode_new t2 on  t1.obtid = t2.obtid and ddatetime=to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss') and t2.Longitude is not null and t2.latitude is not null and " + fieldname + " is not null and " + fieldname + "<999999";
                }
                OracleHelper db = new OracleHelper("HAIKOUConnect");
                dt = db.ExecuteDataTable(sql);
            }
            catch (Exception)
            {

            }
            return dt;
        }

        //自动站实况信息格点数据
        //public static List<GridWeatherInfo> GetRainGridWeatherInfoList(DateTime dt, int typeid, int typeIndex)
        public static List<CommutingForecastModel.GridWeatherInfo> GetRainGridWeatherInfoList(DateTime dt, string valuename)
        {
            List<CommutingForecastModel.GridWeatherInfo> newList = new List<CommutingForecastModel.GridWeatherInfo>();
            try
            {
                //海口市范围坐标
                //110.08  20.16
                //110.76  19.47 
                int xNum = 0; int yNum = 0;
                double xmin = 110.08;
                double ymin = 19.47;
                double xmax = 110.76;
                double ymax = 20.16;
                string strSql = "";
                
                if (valuename.ToLower() == "v")
                {
                    strSql = "select b.longitude as x, b.latitude as y, a.vis_min as z from surf_chn_mul_min a, t_obtcode_new b where  b.obtlevel>=1 and b.obtlevel<=4 and  a.v is not null   and a.obtid=b.obtid and b.longitude is not null and b.latitude is not null and  a.ddatetime = to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss')   ";
                }
                else
                {
                    strSql = "select b.longitude as x, b.latitude as y, a." + valuename + " as z from v_localobtmind a, t_obtcode_new b where  b.obtlevel>=1 and b.obtlevel<=4 and  a." + valuename + " is not null   and a.obtid=b.obtid and b.longitude is not null and b.latitude is not null and  a.ddatetime = to_date('" + dt.ToString("dd-MM-yyyy HH:mm:ss") + "', 'dd-mm-yyyy hh24:mi:ss')   ";
                }
                //}
                OracleHelper db = new OracleHelper("SZQX14ConnectionString");
                DataTable ds = db.ExecuteDataTable(strSql);
                double RATE = 0.005;
                double[] gridValues = AutoStationRainToGrid(ds, xmin, ymin, xmax, ymax, out xNum, out yNum, RATE);
                strSql = "select * from t_road_line_def where roadtype=0";
                db = new OracleHelper("EJETDB247Grid");
                DataTable dTable = db.ExecuteDataTable(strSql);
                if (dTable != null && dTable.Rows.Count > 0)
                {
                    CommutingForecastModel.GridWeatherInfo wea; int xIndex, yIndex; int index;
                    for (int i = 0; i < dTable.Rows.Count; i++)
                    {
                        wea = new CommutingForecastModel.GridWeatherInfo();
                        wea.RoadName = dTable.Rows[i]["RoadName"].ToString();
                        wea.GridID = int.Parse(dTable.Rows[i]["GridID"].ToString());
                        //wea.Date = dt;
                        wea.X1 = double.Parse(dTable.Rows[i]["X1"].ToString());
                        wea.X2 = double.Parse(dTable.Rows[i]["X2"].ToString());
                        //wea.X = (wea.X1 + wea.X2) / 2;
                        wea.Y1 = double.Parse(dTable.Rows[i]["Y1"].ToString());
                        wea.Y2 = double.Parse(dTable.Rows[i]["Y2"].ToString());
                        //wea.Y = (wea.Y1 + wea.Y2) / 2;

                        xIndex = (int)Math.Floor(((wea.X1 + wea.X2) / 2 - xmin) / RATE);
                        yIndex = (int)Math.Floor((ymax - (wea.Y1 + wea.Y2) / 2) / RATE);
                        index = (yNum - yIndex) * xNum + xIndex;
                        if (xIndex >= 0 && yIndex >= 0 && index >= 0 && index < (xNum * yNum))
                        {
                            if (valuename.ToLower() == "v")
                            {
                                wea.Z = gridValues[index] / 1000;
                            }
                            else
                            {
                                wea.Z = gridValues[index];
                            }
                        }
                        newList.Add(wea);
                    }
                }
            }
            catch (Exception ex)
            {
                //ErrWriter(ex);
            }
            return newList;
        }

        //将实况信息格点化
        public static double[] AutoStationRainToGrid(DataTable ds, double xmin, double ymin, double xmax, double ymax, out int xNum, out int yNum, double RATE)
        {
            double[] gridValues = null; xNum = 0; yNum = 0;
            try
            {
                if (ds.Rows.Count > 7)
                {
                    //RATE = 0.005;
                    xNum = (int)(Math.Abs(xmax - xmin) / RATE);
                    yNum = (int)(Math.Abs(ymax - ymin) / RATE);
                    gridValues = new double[xNum * yNum];
                    IDWGrid[] list = new IDWGrid[ds.Rows.Count];
                    for (int i = 0; i < list.Length; i++)
                    {
                        list[i] = new IDWGrid();
                        list[i].x = double.Parse(ds.Rows[i]["x"].ToString());
                        list[i].y = double.Parse(ds.Rows[i]["y"].ToString());
                        list[i].z = double.Parse(ds.Rows[i]["z"].ToString()) * 0.1;
                    }

                    double gridx, gridy, gridz;
                    for (int j = 0; j < yNum; j++)
                    {
                        for (int i = 0; i < xNum; i++)
                        {
                            gridx = RATE * i + xmin;
                            gridy = RATE * j + ymin;
                            gridz = DotsToGrid(list, gridx, gridy);

                            gridValues[j * xNum + i] = 0;
                            if (gridz >= 0)
                            {
                                gridValues[j * xNum + i] = gridz;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.Writetxtlog(ex.ToString());
            }
            return gridValues;
        }
        private static double DotsToGrid(IDWGrid[] list, double gridx, double gridy)
        {
            try
            {
                for (int i = 0; i < list.Length; i++)
                {
                    list[i].m_Distance = (gridx - list[i].x) * (gridx - list[i].x) + (gridy - list[i].y) * (gridy - list[i].y);
                }
                IComparer IDWComparerGrid = new IDWComparer();
                Array.Sort(list, IDWComparerGrid);
                int numb = 5;
                double edist = 0, value = 0;

                for (int j = 0; j < numb; j++)
                {
                    double dist = list[j].m_Distance;
                    if (dist <= 0.00001)
                    {
                        return (double)list[j].z;
                    }
                    else
                    {
                        dist = ((double)1.00000) / dist;
                        edist += dist;
                        value += list[j].z * dist;
                    }
                }
                if (edist > 0.000000000001)
                    return (value / edist);
                else
                    return 0.0;
            }
            catch (Exception ex)
            {
                //Common.Writetxtlog(ex.ToString());
            }
            return -1;
        }
        class IDWComparer : IComparer
        {
            public int Compare(object info1, object info2)
            {
                IDWGrid fileInfo1 = info1 as IDWGrid;
                IDWGrid fileInfo2 = info2 as IDWGrid;
                if (fileInfo1.m_Distance < fileInfo2.m_Distance) return -1;
                if (fileInfo1.m_Distance > fileInfo2.m_Distance) return 1;
                return 0;
            }
        }
        public class IDWGrid
        {
            public double x, y, z;
            public double m_Distance = 0;
            public IDWGrid()
            {
            }
        }
    }
}
