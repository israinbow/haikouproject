using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing.Drawing2D;
using System.IO;
using Common;
using Oracle.DataAccess.Client;
using System.Configuration;
using System.Web;

namespace DAL
{
    /// <summary>
    /// 深圳市格点数据操作类
    /// </summary>
    public class DALGridDatas
    {
        class asas
        {
            public float X { get; set; }
            public float Y { get; set; }
        }
        /// <summary>
        /// 获取格点数据
        /// </summary>
        /// <param name="IsFirstLoad">判断是否是第一次加载</param>
        /// <param name="model"></param>
        /// <param name="ybsx">预报时效</param>
        /// <returns></returns>
        public static Dictionary<int, DataTable> GetGridDatas(string NewTime, string model, string ybsx, string savetype)
        {
            try
            {
                DateTime foretime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd 06:00"));
                DateTime.TryParse(NewTime, out foretime);
                DateTime newtime = new DateTime(DateTime.Now.AddDays(-1).Year, DateTime.Now.AddDays(-1).Month, DateTime.Now.AddDays(-1).Day, 20, 0, 0);
                string cmdTxt = string.Empty;
                int timelength = 168;
                if (savetype == "forecaster")
                {
                    timelength = 72;
                }
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                for (int i = 1; i <= timelength; i++)
                {
                    if (i > 72)
                    {
                        if (i % 6 != 0)
                        {
                            continue;
                        }
                    }
                    StringBuilder strSql = new StringBuilder();
                    if (savetype == "forecaster")
                    {
                        strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,MAXTEMP,MINTEMP,RAIN,FORECASTTIME,R6H,R24H, b.x,b.y,b.obtid");

                    }
                    else
                    {
                        strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid");
                    }
                    strSql.Append(" FROM T_SZ_GRID_FORECAST a left join T_SZ_GRID_POINT_5K b on a.venueid = b.recid ");
                    strSql.Append(" where ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx=" + i + " order by venueid");
                    OracleHelper oh = new OracleHelper("EJETDB247OCEAN");//TestOrecl
                    DataTable dt = oh.ExecuteDataTable(strSql.ToString());
                    //DataRow[] drArr = dt.Select("YBSX='" + i + "'");
                    //DataTable table = new DataTable();
                    //foreach (var item in drArr)
                    //{
                    //    DataRow it = item;
                    //    table.Rows.Add(it);
                    //}
                    if (!datas.ContainsKey(i))
                    {
                        datas.Add(i, dt);
                        dt.Dispose();
                    }
                }
                return datas;
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }

        /// <summary>
        /// 获取格点数据(新)
        /// </summary>
        /// <param name="IsFirstLoad">判断是否是第一次加载</param>
        /// <param name="model"></param>
        /// <param name="ybsx">预报时效</param>
        /// <returns></returns>
        public static Dictionary<int, DataTable> GetGridDatas_New(string NewTime, string model, string ybsx, string savetype, string username)
        {
            #region
            //string sqll = "select distinct venueid,X,Y from t_sz_grid_point_5k t1, t_sz_grid_forecast t2 where t1.recid = t2.venueid and ddatetime = to_date('2017/3/1 6:00:00', 'yyyy-mm-dd hh24:mi:ss') order by venueid";
            //OracleHelper ohtt = new OracleHelper("EJETDB247OCEAN");//TestOrecl
            //DataTable dttt = ohtt.ExecuteDataTable(sqll);
            //Dictionary<string, asas> listd = new Dictionary<string, asas>();
            //foreach (DataRow item in dttt.Rows)
            //{
            //    asas ass = new asas();
            //    if (!listd.ContainsKey(item["venueid"].ToString()))
            //    {
            //        listd.Add(item["venueid"].ToString(), ass);
            //    }
            //    ass.X = float.Parse(item["X"].ToString());
            //    ass.Y = float.Parse(item["Y"].ToString());
            //}
            //string dadada = JsonHelper.Serialize(listd);

            //File.WriteAllText(HttpContext.Current.Server.MapPath("/data/t_sz_grid_point_5k.txt"), dadada);
            #endregion
            try
            {
                DateTime foretime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd 06:00"));
                DateTime.TryParse(NewTime, out foretime);
                DateTime newtime = new DateTime(DateTime.Now.AddDays(-1).Year, DateTime.Now.AddDays(-1).Month, DateTime.Now.AddDays(-1).Day, 20, 0, 0);
                string cmdTxt = string.Empty;
                int timelength = 240;//设置时效，海口的数据的时效为0,3,6,9...72
                if (savetype == "forecaster")
                {
                    timelength = 72;
                }
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                if (savetype == "forecaster")
                {
                    //strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,MAXTEMP,MINTEMP,RAIN,FORECASTTIME,R6H,R24H, b.x,b.y,b.obtid  FROM");
                    //strSql.Append("  T_SZ_GRID_FORECAST_user a  left join T_SZ_GRID_POINT_5K b on a.venueid = b.recid ");
                    //strSql.Append(" where ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss')  order by venueid");
                    strSql.Append("select count(*) from T_HK_GRID_FORECAST_USER where FORECASTER='" + username + "' and ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss')");
                    oh = new OracleHelper("HAIKOUConnect");// TestOrecl
                    int count = int.Parse(oh.ExecuteScalar(strSql.ToString()).ToString());
                    string latestTime = oh.ExecuteScalar(strSql.ToString()).ToString();
                    //如果预报员表数据为空，则表示第一次加载数据，填充省台上传数据源
                    if (count > 0)
                    {
                        strSql = new StringBuilder();
                        strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,MAXTEMP,MINTEMP,FORECASTTIME,R6H,R24H, b.x,b.y,b.obtid  FROM");
                        strSql.Append(" T_HK_GRID_FORECAST_USER a left join T_HK_GRID_POINT_5K b on a.venueid = b.recid ");
                        strSql.Append(" where FORECASTER='" + username + "' and  ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss')  order by venueid");
                        oh = new OracleHelper("HAIKOUConnect");// TestOrecl
                        dt = oh.ExecuteDataTable(strSql.ToString());
                    }
                    else
                    {
                        strSql = new StringBuilder();
                        //strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid  FROM ");
                        strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,FORECASTTIME,R6H,R24H,a.MINTEMP,a.MAXTEMP, b.x,b.y,b.obtid  FROM ");
                        strSql.Append(" T_HK_NEW_GRID_FORECAST a left join T_HK_GRID_POINT_5K b on a.venueid = b.recid ");
                        strSql.Append(" where ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx<=72  order by venueid");
                        oh = new OracleHelper("HAIKOUConnect");// TestOrecl
                        dt = oh.ExecuteDataTable(strSql.ToString());
                    }
                }
                else
                {
                    string timesql = "select max(ddatetime) as latesttime from t_hk_new_grid_forecast t";
                    oh = new OracleHelper("HAIKOUConnect");// TestOrecl
                    string latestTime = oh.ExecuteScalar(timesql).ToString();
                    strSql = new StringBuilder();
                    strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid  FROM ");
                    strSql.Append(" t_hk_new_grid_forecast a left join T_HK_GRID_POINT_5K b on a.venueid = b.recid ");
                    strSql.Append(" where ddatetime = to_date('" + latestTime + "', 'yyyy-mm-dd hh24:mi:ss') order by venueid");
                    oh = new OracleHelper("HAIKOUConnect");// TestOrecl
                    dt = oh.ExecuteDataTable(strSql.ToString());
                }
                //strSql.Append("left join T_SZ_GRID_POINT_5K b on a.venueid = b.recid ");
                //strSql.Append(" where ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss')  order by venueid");
                //OracleHelper oh = new OracleHelper("EJETDB247OCEAN");// TestOrecl
                //DataTable dt = oh.ExecuteDataTable(strSql.ToString());
                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }
                //由于海口市逐3小时5KM格点数据没有0时数据，所以从3开始
                for (int i = 3; i <= timelength; i++)
                {
                    if (savetype == "forecaster")
                    {
                        if (i >= 24)
                        {
                            if (i % 24 != 0)
                            {
                                continue;
                            }
                        }
                        else
                        {
                            if (i % 6 != 0)
                            {
                                continue;
                            }
                        }
                    }
                    else
                    {
                        //if (i > 72)
                        //{
                        //    if (i % 6 != 0)
                        //    {
                        //        continue;
                        //    }
                        //}
                        //else
                        {
                            if (i % 3 != 0)//取余得到i的值，此处的i为ybsx预报时效
                            {
                                continue;
                            }
                        }
                    }
                    DataRow[] drArr = dt.Select("YBSX='" + i + "'");
                    DataTable table = new DataTable();
                    table = dt.Clone();
                    foreach (var item in drArr)
                    {
                        table.Rows.Add(item.ItemArray);
                    }
                    if (!datas.ContainsKey(i))
                    {
                        datas.Add(i, table);
                        //dataRow.Dispose();
                    }
                }
                return datas;
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }

        //格点数据保存
        public static string Savegriddata(string type, string griddata, string username)
        {
            OracleConnection Conn;
            string connNew = ConfigurationManager.ConnectionStrings["HAIKOUConnect"].ConnectionString;
            Conn = new OracleConnection(connNew); //连接数据库
            try
            {
                Dictionary<int, List<GridInfo_user>> newgrid = JsonHelper.Deserialize<Dictionary<int, List<GridInfo_user>>>(griddata);
                if (newgrid.Count == 0 || newgrid[6].Count == 0)
                {
                    return "0";
                }
                string strsql = "";
                //制作上传省局
                if (username == "test")
                {                    
                    strsql = "select count(*) from T_HK_NEW_GRID_FORECAST where ddatetime = to_date('" + Convert.ToDateTime(newgrid[1][0].DDATETIME).ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss')";
                }
                //制作预报员
                else
                {
                    strsql = "select count(*) from T_HK_GRID_FORECAST_USER where FORECASTER='" + username + "' and ddatetime = to_date('" + Convert.ToDateTime(newgrid[6][0].DDATETIME).ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss')";
                }
                OracleHelper oh = new OracleHelper("HAIKOUConnect");
                int COUNTdt = int.Parse(oh.ExecuteScalar(strsql).ToString());
                string sql = "";
                if (COUNTdt == 0)
                {
                    sql = @"INSERT INTO T_HK_GRID_FORECAST_USER(RECID,R24H,MAXTEMP,MINTEMP,R6H,FORECASTER,YBSX,FORECASTTIME,DDATETIME,VENUEID) 
                        values(SEQ_T_HK_GRID_FORECAST_USER.NEXTVAL,:R24H,:MAXTEMP,:MINTEMP,:R6H,:FORECASTER,:YBSX,:FORECASTTIME,:DDATETIME,:VENUEID)";

                }
                if (COUNTdt > 0)
                {
                    sql = "update T_HK_GRID_FORECAST_USER set R24H =:R24H,MAXTEMP =:MAXTEMP,MINTEMP =:MINTEMP,R6H=:R6H where FORECASTER=:FORECASTER and YBSX=:YBSX and DDATETIME=:DDATETIME and VENUEID=:VENUEID";
                }

                List<GridInfo_user> dataAll = new List<GridInfo_user>();
                foreach (var item in newgrid)
                {
                    if (type == "forecaster")
                    {                        
                        List<DateTime> datetime = new List<DateTime>();
                        List<DateTime> foredatetime = new List<DateTime>();
                        foreach (var _item in item.Value)
                        {
                            GridInfo_user updatedata = new GridInfo_user();
                            updatedata.T2M = _item.T2M;
                            updatedata.MAXTEMP = _item.MAXTEMP;
                            updatedata.MINTEMP = _item.MINTEMP;
                            updatedata.RAIN = _item.RAIN;
                            updatedata.R6H = _item.R6H;
                            updatedata.R24H = _item.R24H;
                            updatedata.YBSX = _item.YBSX;
                            updatedata.VENUEID = _item.VENUEID;                           
                            updatedata.FORECASTER = username;
                            updatedata.DDATETIME = DateTime.Parse(Convert.ToDateTime(_item.DDATETIME).ToString("yyyy-MM-dd HH:mm:ss"));
                            updatedata.FORECASTTIME = DateTime.Parse(Convert.ToDateTime(_item.FORECASTTIME).ToString("yyyy-MM-dd HH:mm:ss"));
                            dataAll.Add(updatedata);
                        }

                    }
                    #region 注释
                    //else
                    //{

                    //    if (COUNTdt ==0)
                    //    {
                    //        sql="insert into T_SZ_GRID_FORECAST(RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,VISI,R24H,MAXTEMP,MINTEMP,CLCT,R6H,RAINPROV,RAINPROV_6h,RAINPROV_24h,RAINEC,RAINEC_6H,RAINEC_24H,T2M_PROV,MAXTEMP_PROV,MINTEMP_PROV,T2M_EC,MAXTEMP_EC,MINTEMP_EC) values(:RECID,:DDATETIME,:VENUEID,:YBSX,:T2M,:SLP,:WSPD10M,:WDIR10M,:RHSFC,:RAIN,:FORECASTTIME,:VISI,:R24H,:MAXTEMP,:MINTEMP,:CLCT,:R6H,:RAINPROV,:RAINPROV_6h,:RAINPROV_24h,:RAINEC,:RAINEC_6H,:RAINEC_24H,:T2M_PROV,:MAXTEMP_PROV,:MINTEMP_PROV,:T2M_EC,:MAXTEMP_EC,:MINTEMP_EC)";
                    //    }
                    //    else
                    //    {
                    //        sql = "update T_SZ_GRID_FORECAST set T2M = :T2M,SLP = :SLP,WSPD10M = :WSPD10M,WDIR10M = :WDIR10M,RHSFC = :RHSFC,RAIN =:RAIN,DP2T = :DP2T,R6H = :R6H,R24H =:R24H,CLCT =:CLCT,visi = :visi,MINTEMP =:MINTEMP,MAXTEMP =:MAXTEMP,RAINPROV = :RAINPROV,RAINPROV_6H =:RAINPROV_6H,RAINPROV_24H = :RAINPROV_24H where FORECASTTIME=:FORECASTTIME and YBSX=:YBSX and RECID=:RECID and RECID=:RECID";
                    //    }

                    //    //
                    //    //t2mm 地面温度、u10m u风场 、v10m v风场、mslp 海平面气压、rh2m 地面相对湿度、tppm 降水量
                    //    List<List<string>> updatedata = new List<List<string>>();
                    //    for (int i = 0; i < 18; i++)
                    //    {
                    //        updatedata.Add(new List<string>());
                    //    }
                    //    List<DateTime> datetime = new List<DateTime>();
                    //    foreach (var _item in item.Value)
                    //    {
                    //        string[] itemdata = new string[18];
                    //        updatedata[0].Add(_item.T2M);
                    //        updatedata[1].Add(_item.SLP);
                    //        updatedata[2].Add(_item.WSPD10M);
                    //        updatedata[3].Add(_item.WDIR10M);
                    //        updatedata[4].Add(_item.RHSFC);
                    //        updatedata[5].Add(_item.RAIN);
                    //        updatedata[6].Add(_item.DP2T);
                    //        updatedata[7].Add(_item.R6H);
                    //        updatedata[8].Add(_item.R24H);
                    //        updatedata[9].Add(_item.CLCT);
                    //        updatedata[10].Add(_item.VISI);
                    //        updatedata[11].Add(_item.MINTEMP);
                    //        updatedata[12].Add(_item.MAXTEMP);
                    //        updatedata[13].Add(_item.RAINPROV);
                    //        updatedata[14].Add(_item.RAINPROV_6H);
                    //        updatedata[15].Add(_item.RAINPROV_24H);
                    //        updatedata[16].Add(_item.YBSX);
                    //        updatedata[17].Add(_item.RECID);
                    //        datetime.Add(DateTime.Parse(Convert.ToDateTime(_item.DDATETIME).ToString("yyyy-MM-dd HH:mm:ss")));
                    //    }
                    //    OracleCommand theCmmd = new OracleCommand(sql, Conn);
                    //    theCmmd.ArrayBindCount = datetime.Count;//关键点  
                    //    theCmmd.Parameters.Add(new OracleParameter("T2M", OracleDbType.Double, updatedata[0].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("SLP", OracleDbType.Double, updatedata[1].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("WSPD10M", OracleDbType.Double, updatedata[2].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("WDIR10M", OracleDbType.Double, updatedata[3].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RHSFC", OracleDbType.Double, updatedata[4].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RAIN", OracleDbType.Double, updatedata[5].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("DP2T", OracleDbType.Double, updatedata[6].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("R6H", OracleDbType.Double, updatedata[7].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("R24H", OracleDbType.Double, updatedata[8].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("CLCT", OracleDbType.Double, updatedata[9].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("visi", OracleDbType.Double, updatedata[10].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("MINTEMP", OracleDbType.Double, updatedata[11].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("MAXTEMP", OracleDbType.Double, updatedata[12].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RAINPROV", OracleDbType.Double, updatedata[13].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RAINPROV_6H", OracleDbType.Double, updatedata[14].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RAINPROV_24H", OracleDbType.Double, updatedata[15].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("FORECASTTIME", OracleDbType.Date, datetime.ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("YBSX", OracleDbType.Double, updatedata[16].ToArray(), System.Data.ParameterDirection.Input));
                    //    theCmmd.Parameters.Add(new OracleParameter("RECID", OracleDbType.Double, updatedata[17].ToArray(), System.Data.ParameterDirection.Input));
                    //    int numcount = theCmmd.ExecuteNonQuery();
                    //    theCmmd.Dispose();
                    //}
                    #endregion
                }
                if (Conn.State != System.Data.ConnectionState.Open)
                {
                    Conn.Open();
                }
                
                OracleCommand theCmmd = new OracleCommand(sql, Conn);                
                theCmmd.ArrayBindCount = dataAll.Count;//关键点  
                
                theCmmd.Parameters.Add(new OracleParameter("R24H", OracleDbType.Double, dataAll.Select(c => c.R24H).ToArray(), System.Data.ParameterDirection.Input));               
                theCmmd.Parameters.Add(new OracleParameter("MAXTEMP", OracleDbType.Double, dataAll.Select(c => c.MAXTEMP).ToArray(), System.Data.ParameterDirection.Input));
                theCmmd.Parameters.Add(new OracleParameter("MINTEMP", OracleDbType.Double, dataAll.Select(c => c.MINTEMP).ToArray(), System.Data.ParameterDirection.Input));
                theCmmd.Parameters.Add(new OracleParameter("R6H", OracleDbType.Double, dataAll.Select(c => c.R6H).ToArray(), System.Data.ParameterDirection.Input));
                theCmmd.Parameters.Add(new OracleParameter("FORECASTER", OracleDbType.NVarchar2, dataAll.Select(c => c.FORECASTER).ToArray(), System.Data.ParameterDirection.Input));
                theCmmd.Parameters.Add(new OracleParameter("YBSX", OracleDbType.Int32, dataAll.Select(c => c.YBSX).ToArray(), System.Data.ParameterDirection.Input));
                if (COUNTdt == 0)
                {
                    theCmmd.Parameters.Add(new OracleParameter("FORECASTTIME", OracleDbType.Date, dataAll.Select(c => c.FORECASTTIME).ToArray(), System.Data.ParameterDirection.Input));
                }
                theCmmd.Parameters.Add(new OracleParameter("DDATETIME", OracleDbType.Date, dataAll.Select(c => c.DDATETIME).ToArray(), System.Data.ParameterDirection.Input));
                theCmmd.Parameters.Add(new OracleParameter("VENUEID", OracleDbType.Int32, dataAll.Select(c => c.VENUEID).ToArray(), System.Data.ParameterDirection.Input));

                int numcount = theCmmd.ExecuteNonQuery();
                theCmmd.Dispose();
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
                throw;
            }
            finally
            {
                Conn.Close();
                Conn.Dispose();
            }
            return "0";
        }
        public static DataTable GetGridHchartsDatas(string datetime, string gridindex, string model, string value)
        {
            DataTable dt = null;
            try
            {
                //string tablename = "t_zh_" + model + "";
                //switch (value)
                //{
                //    case "T":
                //        value = "t2m";
                //        break;
                //    case "Wind":
                //        value = "wspd10m";
                //        break;
                //    case "U":
                //        value = "rhsfc";
                //        break;
                //    default:
                //        break;
                //}
                //string cmdTxt = "select FORECASTTIME," + value + " as value from " + tablename + " where ddatetime=" + OracleHelper.GetOracleDateFormat(DateTime.Parse(datetime)) + " and FORECASTTIME>=" + OracleHelper.GetOracleDateFormat(DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"))) + " and ybsx>0 and gridindex='" + gridindex + "' and rownum<=20 order by ybsx";
                //Common.CreateLogTxt.WriteLog(cmdTxt);
                //dt = OracleHelper.ExecuteDataTable(cmdTxt);
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
            }
            return dt;
        }
        //动态绘制色斑图
        public static string DrawGridsImg(string vluesname, DataTable dt, DateTime time)
        {
            try
            {
                double RATE = 0.01;
                //海口市范围坐标
                //110.08  20.16
                //110.76  19.47 
                double xmin = 110.08, xmax = 110.76, ymin = 19.47, ymax = 20.16;
                int xNum = 0, yNum = 0;
                double[] gridValues = CommutingForecast.AutoStationRainToGrid(dt, xmin, ymin, xmax, ymax, out xNum, out yNum, RATE);
                gridValues = InterolationForecastGrid(gridValues, xNum, yNum, xNum * 5, yNum * 5);
                xNum = xNum * 5;
                yNum = yNum * 5;
                Bitmap ScreenBuffer = new Bitmap(xNum, yNum);
                Graphics g = Graphics.FromImage(ScreenBuffer);
                g.SmoothingMode = SmoothingMode.AntiAlias;
                Image bmpClipground = Image.FromFile(AppDomain.CurrentDomain.BaseDirectory + "Images/testhk.png");
                for (int j = 0; j < yNum; j++)
                {
                    for (int i = 0; i < xNum; i++)
                    {
                        if (((Bitmap)bmpClipground).GetPixel(i, ScreenBuffer.Height - 1 - j).R == 255 && ((Bitmap)bmpClipground).GetPixel(i, ScreenBuffer.Height - 1 - j).G == 0 && ((Bitmap)bmpClipground).GetPixel(i, ScreenBuffer.Height - 1 - j).B == 0)
                        {
                            double z = gridValues[j * xNum + i] * 10;
                            if (vluesname == "T2M" || vluesname == "MAXTEMP" || vluesname == "MINTEMP")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetTempColor(z));
                            }
                            else if (vluesname == "RAIN" || vluesname == "R24H")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetRainColor(z));
                            }
                            else if (vluesname == "WSPD10M")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetSpeedColor(z));
                            }
                            else if (vluesname == "RHSFC")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetUColor(z));
                            }
                            else if (vluesname == "CLCT")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetTempColor(z));
                            }
                            else if (vluesname == "VISI")
                            {
                                ((Bitmap)ScreenBuffer).SetPixel(i, ScreenBuffer.Height - 1 - j, GetVColoe(z));
                            }
                        }
                        
                    }
                }
                string imgname = AppDomain.CurrentDomain.BaseDirectory + "Images/colourspot/" + vluesname + "_" + time.ToString("yyyyMMddHHmmss") + ".png";
                if (!Directory.Exists(Path.GetDirectoryName(imgname)))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(imgname));
                }
                if (File.Exists(imgname))
                {
                    File.Delete(imgname);
                }
                ScreenBuffer.Save(imgname);
                return Path.GetFileName(imgname);
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
            }
            return "";
        }

        /// <summary>
        /// 获取自动站点信息
        /// </summary>
        /// <param name="type">站点类型，aws为深圳全部自动站，gridaws为何格点对应的自动站</param>
        /// <returns></returns>
        public static DataTable GetobtcodeDatas(string type)
        {
            DataTable dt = null;
            try
            {
                string sql = "", conn = "";
                switch (type)
                {
                    case "aws":
                        sql = "select OBTID, STNAME, LONGITUDE AS X,LATITUDE AS Y from  t_obtcode_new where  Longitude is not null and latitude is not null";
                        conn = "HAIKOUConnect";
                        break;
                    case "gridaws":
                        sql = "select X,Y,OBTID from t_sz_grid_point_1k_new t where obtid is not null and iszone =2";
                        conn = "HAIKOUConnect";
                        break;
                    default:
                        break;
                }
                OracleHelper db = new OracleHelper(conn);// EJETDB247OCEAN SZQX14ConnectionString
                dt = db.ExecuteDataTable(sql);
                if (type == "gridaws")
                {
                    //DataTable dt = new DataTable();
                    sql = "select obtname,obtid from t_obtcode";
                    db = new OracleHelper("HAIKOUConnect");
                    DataTable dtobtnames = db.ExecuteDataTable(sql);
                    dt.Columns.Add("OBTNAME", typeof(string));
                    foreach (DataRow dr in dt.Rows)
                        dr["OBTNAME"] = dtobtnames.Select("obtid='" + dr["obtid"] + "'")[0]["obtname"].ToString();
                }
            }
            catch (Exception ex)
            {
                Common.CreateLogTxt.ErrWriter(ex);
            }
            return dt;
        }

        public static List<PFInfo> GetGridContainObtid(float[][] _bounds, int ybsx, DateTime foretime, string gridelement)
        {
            try
            {
                string sql = "select obtid from t_sz_grid_point_1k_new t where obtid is not null and x>" + _bounds[0][1] + " and x<" + _bounds[1][1] + " and y>" + _bounds[0][0] + " and y<" + _bounds[1][0] + " and iszone =2";
                OracleHelper db = new OracleHelper("EJETDB247OCEAN");// EJETDB247OCEAN SZQX14ConnectionString
                DataTable dt = db.ExecuteDataTable(sql);
                string strobtids = "";
                foreach (DataRow item in dt.Rows)
                {
                    strobtids += "'" + item[0] + "'" + ",";
                }
                sql = "select * from lfs_score_grid_6h t where  type =2 and  ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + ybsx + "' and obtid in (" + strobtids.Remove(strobtids.Length - 1) + ")";
                if (gridelement == "R24H")
                {
                    sql = "select obtid,RAINSUN,RAINNULL,RAINLOST,RAINNO,RAINNULL25 as RAINNULL10,RAINLOST25 as RAINLOST10,RAINCORRECT25 as RAINCORRECT10 from lfs_score_grid_24h t where type =2 and ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + ybsx + "' and obtid in (" + strobtids.Remove(strobtids.Length - 1) + ")";
                }
                else
                {
                    sql = "select obtid,RAINSUN,RAINNULL,RAINLOST,RAINNO,RAINNULL10,RAINLOST10,RAINCORRECT10 from lfs_score_grid_6h t where type =2 and  ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + ybsx + "' and obtid in (" + strobtids.Remove(strobtids.Length - 1) + ")";
                }
                db = new OracleHelper("EJETDB247LFSData");// EJETDB247OCEAN SZQX14ConnectionString
                DataTable newdt = db.ExecuteDataTable(sql);
                List<PFInfo> PFInfoList = new List<PFInfo>();
                foreach (DataRow item in newdt.Rows)
                {
                    try
                    {

                        PFInfo pf = new PFInfo();
                        string rain = "0";
                        pf.Obtid = item["obtid"].ToString();
                        pf.Obtname = GetObtName(foretime.AddHours(ybsx + 4), pf.Obtid, gridelement, out rain);
                        pf.Rain = rain;
                        pf.RAINSUN = int.Parse(item["RAINSUN"].ToString());
                        pf.RAINNULL = int.Parse(item["RAINNULL"].ToString());
                        pf.RAINLOST = int.Parse(item["RAINLOST"].ToString());
                        pf.RAINNO = int.Parse(item["RAINNO"].ToString());
                        pf.RAINNULL10 = int.Parse(item["RAINNULL10"].ToString());
                        pf.RAINLOST10 = int.Parse(item["RAINLOST10"].ToString());
                        pf.RAINCORRECT10 = int.Parse(item["RAINCORRECT10"].ToString());
                        PFInfoList.Add(pf);
                    }
                    catch (Exception ee)
                    {
                        Common.CreateLogTxt.ErrWriter(ee);
                    }
                }
                return PFInfoList;
            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }
        public static string GetALLGridContainPF(DateTime foretime, string forecaster)
        {
            string qy = "";
            try
            {
                string appStr = "";
                if (!string.IsNullOrEmpty(forecaster)) appStr = " and FORECASTER ='" + forecaster.Trim() + "'";
                //StringBuilder strSql = new StringBuilder();
                //strSql.Append("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,MAXTEMP,MINTEMP,RAIN,FORECASTTIME,R6H,R24H, b.x,b.y,b.obtid  FROM");
                //strSql.Append("  T_SZ_GRID_FORECAST_user a  left join T_SZ_GRID_POINT_5K b on a.venueid = b.recid ");
                //strSql.Append(" where ddatetime = to_date('" + foretime + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx<=72  order by venueid");
                //OracleHelper oh = new OracleHelper("TestOrecl");// TestOrecl
                //DataTable dt = oh.ExecuteDataTable(strSql.ToString());
                int[] ybsx = { 6, 12, 18, 24, 48, 72 };

                List<double> qylist = new List<double>();
                List<double> dylist = new List<double>();
                //string dy = "";
                for (int i = 0; i < ybsx.Length; i++)
                {
                    string sql = "";
                    if (ybsx[i] <= 24)
                    {
                        sql = "select sum(RAINSUN) as NA,sum(RAINNULL) as NB,sum(RAINLOST) as NC,sum(RAINNO) as ND,sum(RAINNULL10) as NB2,sum(RAINLOST10) as NC2,sum(RAINCORRECT10) as NA2 from lfs_score_grid_6h t where type =2 and  ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + ybsx[i] + "'" + appStr;
                        qy += (ybsx[i] - 6) + "," + ybsx[i] + ",";
                        OracleHelper oh = new OracleHelper("EJETDB247LFSData");// TestOrecl
                        DataTable dt = oh.ExecuteDataTable(sql);
                        DataRow dr = dt.Rows[0];
                        double qypf = -1;


                        if (dr["NA"].ToString() != "")
                        {
                            if ((int.Parse(dr["NA"].ToString()) + int.Parse(dr["NB"].ToString()) + int.Parse(dr["NC"].ToString()) + int.Parse(dr["ND"].ToString())) == 0)
                            {
                            }
                            else
                            {
                                qypf = Convert.ToDouble((int.Parse(dr["NA"].ToString()) + int.Parse(dr["ND"].ToString()))) / Convert.ToDouble((int.Parse(dr["NA"].ToString()) + int.Parse(dr["NB"].ToString()) + int.Parse(dr["NC"].ToString()) + int.Parse(dr["ND"].ToString()))) * 100;
                            }

                        }
                        else
                        {

                            continue;
                        }
                        double aa = Math.Round(Convert.ToDouble(111 / 116) * 100, 3);
                        qylist.Add(qypf);
                        qy += qypf.ToString("F3") + ",";
                        double dypf = -1;




                        if (dr["NA2"].ToString() != "")
                        {
                            if (int.Parse(dr["NA2"].ToString()) + int.Parse(dr["NB2"].ToString()) + int.Parse(dr["NC2"].ToString()) == 0)
                            {
                                //dylist.Add(dypf);
                            }
                            else
                            {
                                dypf = Convert.ToDouble((int.Parse(dr["NA2"].ToString()))) / Convert.ToDouble((int.Parse(dr["NA2"].ToString()) + int.Parse(dr["NB2"].ToString()) + int.Parse(dr["NC2"].ToString()))) * 100;
                            }
                        }
                        else
                        {

                            continue;
                        }
                        dylist.Add(dypf);
                        qy += (ybsx[i] - 6) + "," + ybsx[i] + ",";
                        if (dypf < 0)
                        {
                            qy += "=|";
                        }
                        else
                            qy += dypf.ToString("F3") + "|";
                    }
                    if (ybsx[i] > 24)
                    {
                        sql = "select sum(RAINSUN) as NA,sum(RAINNULL) as NB,sum(RAINLOST) as NC,sum(RAINNO) as ND,sum(RAINNULL25) as NB2,sum(RAINLOST25) as NC2,sum(RAINCORRECT25) as NA2 from lfs_score_grid_24h t where  type =2 and  ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + ybsx[i] + "'" + appStr;
                        qy += (ybsx[i] - 24) + "," + ybsx[i] + ",";
                        OracleHelper oh = new OracleHelper("EJETDB247LFSData");// TestOrecl
                        DataTable dt = oh.ExecuteDataTable(sql);
                        DataRow dr = dt.Rows[0];
                        double qypf = -1;

                        if (dr["NA"].ToString() != "")
                        {
                            if ((int.Parse(dr["NA"].ToString()) + int.Parse(dr["NB"].ToString()) + int.Parse(dr["NC"].ToString()) + int.Parse(dr["ND"].ToString())) == 0)
                            {
                            }
                            else
                            {
                                qypf = Convert.ToDouble((int.Parse(dr["NA"].ToString()) + int.Parse(dr["ND"].ToString()))) / Convert.ToDouble(((int.Parse(dr["NA"].ToString()) + int.Parse(dr["NB"].ToString()) + int.Parse(dr["NC"].ToString()) + int.Parse(dr["ND"].ToString())))) * 100;
                            }
                        }
                        else
                        {
                            continue;
                        }
                        qylist.Add(qypf);
                        qy += qypf.ToString("F3") + ",";
                        if (ybsx[i] > 48)
                        {
                            qy = qy.Remove(qy.Length - 1);
                            qy += "|";
                            continue;
                        }
                        sql = "select sum(RAINSUN) as NA,sum(RAINNULL) as NB,sum(RAINLOST) as NC,sum(RAINNO) as ND,sum(RAINNULL25) as NB2,sum(RAINLOST25) as NC2,sum(RAINCORRECT25) as NA2 from lfs_score_grid_24h t where type=2 and ddatetime = to_date('" + foretime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss') and ybsx='" + 24 + "'" + appStr;
                        oh = new OracleHelper("EJETDB247LFSData");// TestOrecl
                        dt = oh.ExecuteDataTable(sql);
                        dr = dt.Rows[0];
                        double dypf = -1;

                        if (dr["NA"].ToString() != "")
                        {
                            if ((int.Parse(dr["NA2"].ToString()) + int.Parse(dr["NB2"].ToString()) + int.Parse(dr["NC2"].ToString())) == 0)
                            {
                            }
                            else
                            {
                                dypf = Convert.ToDouble((int.Parse(dr["NA2"].ToString()))) / Convert.ToDouble((int.Parse(dr["NA2"].ToString()) + int.Parse(dr["NB2"].ToString()) + int.Parse(dr["NC2"].ToString()))) * 100;
                            }
                        }
                        else
                        {
                            continue;
                        }
                        dylist.Add(dypf);
                        qy += (24 - 24) + "," + 24 + ",";
                        if (dypf < 0)
                        {
                            qy += "=|";
                        }
                        else
                            qy += dypf.ToString("F3") + "|";
                    }
                }
                //EHall=EH0-6*0.2   +EH6-12*0.2   +EH12-18*0.2  +H18-24*0.2  +EH24-48*0.1  +EH48-72*0.1
                if (qylist.Count() == 6)
                {
                    double EHall = qylist[0] * 0.2 + qylist[1] * 0.2 + qylist[2] * 0.2 + qylist[3] * 0.2 + qylist[4] * 0.1 + qylist[5] * 0.1;
                    qy += EHall.ToString("F3") + ",";
                }

                //TSall=（TS0-24*0.2+TS0-6*0.2+TS6-12*0.2+TS12-18*0.2+TS18-24*0.2）/实际发生项的权重之和
                double TSall = 0.0;
                int count = 0;
                foreach (var item in dylist)
                {
                    if (item >= 0)//评分为0 也是有评分啊 所以 也要 0*0.2
                    {
                        TSall += item * 0.2;
                        count++;
                    }
                }
                if (TSall < 0 || count == 0) //我这么写对不对  4月20日那次 大雨 是有三段评分  count =3  
                {
                    qy += "=";
                }
                else
                {
                    qy += (TSall / (count * 0.2)).ToString("F3") + "";
                }
                return qy;
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
                return qy;
            }
            //return "";
        }
        public static string GetObtName(DateTime ddatetime, string obtid, string gridelement, out string rain)
        {
            rain = "0.0";
            try
            {
                string valuename = "r06h";
                if (gridelement == "R24H")
                {
                    valuename = "R24H";
                }
                //string sql = "select obtname from t_obtcode where obtid='" + obtid + "'";
                string sql = "select obtname," + valuename + " from t_localobthourd t1,t_obtcode t2 where t1.obtid=t2.obtid and t1.obtid='" + obtid + "' and ddatetime = to_date('" + ddatetime.ToString("yyyy-MM-dd HH:mm:ss") + "', 'yyyy-mm-dd hh24:mi:ss')";
                OracleHelper db = new OracleHelper("SZQX14ConnectionString");
                DataTable dt = db.ExecuteDataTable(sql);
                float num = 0.1F;
                float.TryParse(dt.Rows[0][1].ToString(), out num);
                rain = (num * 0.1).ToString();
                return dt.Rows[0][0].ToString();
            }
            catch (Exception ee)
            {
                Common.CreateLogTxt.ErrWriter(ee);
            }
            return "";
        }
        public static int GetCountByName(string userName)
        {
            try
            {
                string sqlStr = string.Format("select count(*) from ( select ddatetime from T_SZ_GRID_FORECAST_USER where to_char(ddatetime,'yyyyMM') = to_char(sysdate,'yyyyMM') and forecaster = '{0}'  and venueid = 106 group by ddatetime order by ddatetime )", userName);
                OracleHelper db = new OracleHelper("TestOrecl");
                return int.Parse(db.ExecuteScalar(sqlStr).ToString());
            }
            catch (Exception)
            {
                return 0;
            }
        }

        public static DataTable GetForecastRecord(string userName)
        {
            try
            {
                string sqlStr = string.Format("select rownum,t.* from ( select to_char(ddatetime,'yyyy-MM-dd hh24:mi:ss') D, to_char(crttime,'yyyy-MM-dd hh24:mi:ss') C from T_SZ_GRID_FORECAST_USER where to_char(ddatetime,'yyyyMM') = to_char(sysdate,'yyyyMM') and forecaster = '{0}'  and venueid = 106 group by ddatetime,crttime order by ddatetime,crttime ) t", userName);
                OracleHelper db = new OracleHelper("TestOrecl");
                return db.ExecuteDataTable(sqlStr);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public class ForecastRecord
        {
            public string num { get; set; }
            public string ddatetime { get; set; }
            public string crttime { get; set; }
        }


        public class PFInfo
        {
            public string Obtid { get; set; }
            public string Obtname { get; set; }
            public string Rain { get; set; }
            public int RAINSUN { get; set; }
            public int RAINNULL { get; set; }
            public int RAINLOST { get; set; }
            public int RAINNO { get; set; }
            public int RAINNULL10 { get; set; }
            public int RAINLOST10 { get; set; }
            public int RAINCORRECT10 { get; set; }
        }
        //public class AllPFInfo
        //{
        //    public string Starttime { get; set; }
        //    public string Endtime { get; set; }
        //    public string PF { get; set; }
        //    public int RAINSUN { get; set; }
        //    public int RAINNULL { get; set; }
        //    public int RAINLOST { get; set; }
        //    public int RAINNO { get; set; }
        //    public int RAINNULL10 { get; set; }
        //    public int RAINLOST10 { get; set; }
        //    public int RAINCORRECT10 { get; set; }
        //}
        public static Color GetTempColor(double rain)
        {
            if (rain < 10) return Color.FromArgb(0, 0, 255);
            if (rain >= 10 && rain < 11) return Color.FromArgb(0, 77, 255);
            if (rain >= 11 && rain < 12) return Color.FromArgb(0, 130, 255);
            if (rain >= 12 && rain < 14) return Color.FromArgb(0, 182, 255);
            if (rain >= 14 && rain < 16) return Color.FromArgb(0, 255, 255);
            if (rain >= 16 && rain < 18) return Color.FromArgb(0, 227, 198);
            if (rain >= 18 && rain < 20) return Color.FromArgb(0, 199, 115);
            if (rain >= 20 && rain < 22) return Color.FromArgb(0, 170, 0);
            if (rain >= 22 && rain < 24) return Color.FromArgb(155, 199, 0);
            if (rain >= 24 && rain < 26) return Color.FromArgb(198, 227, 0);
            if (rain >= 26 && rain < 28) return Color.FromArgb(255, 255, 0);
            if (rain >= 28 && rain < 30) return Color.FromArgb(255, 199, 0);
            if (rain >= 30 && rain < 32) return Color.FromArgb(255, 146, 0);
            if (rain >= 32 && rain < 34) return Color.FromArgb(255, 89, 0);
            if (rain >= 34 && rain < 35) return Color.FromArgb(255, 0, 0);
            if (rain >= 35 && rain < 36) return Color.FromArgb(198, 0, 0);
            if (rain >= 36 && rain < 38) return Color.FromArgb(148, 0, 0);
            if (rain >= 38 && rain < 40) return Color.FromArgb(107, 0, 0);
            if (rain >= 40) return Color.FromArgb(16, 0, 0);
            return Color.Transparent;

            //不采用
            DateTime dt = DateTime.Now;
            if (rain < 10) return Color.FromArgb(0, 0, 255);
            if (rain >= 10 && rain < 11) return Color.FromArgb(0, 77, 255);
            if (rain >= 11 && rain < 12) return Color.FromArgb(0, 130, 255);
            if (rain >= 12 && rain < 14) return Color.FromArgb(0, 182, 255);
            if (rain >= 14 && rain < 16) return Color.FromArgb(0, 255, 255);
            if (rain >= 16 && rain < 18) return Color.FromArgb(0, 227, 198);
            if (rain >= 18 && rain < 20) return Color.FromArgb(0, 199, 115);
            if (rain >= 20 && rain < 22) return Color.FromArgb(0, 170, 0);
            if (rain >= 22 && rain < 24) return Color.FromArgb(155, 199, 0);
            if (rain >= 24 && rain < 26) return Color.FromArgb(198, 227, 0);
            if (rain >= 26 && rain < 28) return Color.FromArgb(255, 255, 0);
            if (rain >= 28 && rain < 30) return Color.FromArgb(255, 199, 0);
            if (rain >= 30 && rain < 32) return Color.FromArgb(255, 146, 0);
            if (rain >= 32 && rain < 34) return Color.FromArgb(255, 89, 0);
            if (rain >= 34 && rain < 35) return Color.FromArgb(255, 0, 0);
            if (rain >= 35 && rain < 36) return Color.FromArgb(198, 0, 0);
            if (rain >= 36 && rain < 38) return Color.FromArgb(148, 0, 0);
            if (rain >= 38 && rain < 40) return Color.FromArgb(107, 0, 0);
            if (rain <= 40) return Color.FromArgb(16, 0, 0);
            //if ((dt.Month >= 11 && dt.Month <= 12) || (dt.Month >= 1 && dt.Month < 3))
            //{
            //if (rain <= 0) return Color.FromArgb(255, 0, 255);

            //if (rain > 0 && rain <= 1) return Color.FromArgb(191, 0, 255);

            //if (rain > 1 && rain <= 2) return Color.FromArgb(126, 0, 255);

            //if (rain > 2 && rain <= 3) return Color.FromArgb(0, 0, 254);

            //if (rain > 3 && rain <= 4) return Color.FromArgb(0, 89, 255);

            //if (rain > 4 && rain <= 5) return Color.FromArgb(0, 140, 255);

            //if (rain > 5 && rain <= 6) return Color.FromArgb(1, 190, 254);

            //if (rain > 6 && rain <= 8) return Color.FromArgb(0, 255, 255);

            //if (rain > 8 && rain <= 10) return Color.FromArgb(0, 230, 204);

            //if (rain > 10 && rain <= 12) return Color.FromArgb(0, 204, 125);

            //if (rain > 12 && rain <= 14) return Color.FromArgb(0, 179, 0);

            //if (rain > 14 && rain <= 16) return Color.FromArgb(126, 203, 0);

            //if (rain > 16 && rain <= 18) return Color.FromArgb(204, 230, 0);

            //if (rain > 18 && rain <= 20) return Color.FromArgb(255, 255, 0);

            //if (rain > 20 && rain <= 25) return Color.FromArgb(255, 204, 0);

            //if (rain > 25) return Color.FromArgb(254, 153, 0);
            // }
            //else
            //{
            //if (rain > 40) return Color.Red;
            //if (rain > 37 && rain <= 40) return Color.Orange;
            //if (rain > 35 && rain <= 37) return Color.Yellow;
            //if (rain >= 0 && rain < 2) return Color.FromArgb(0, 255, 255);
            //if (rain >= 2 && rain < 4) return Color.FromArgb(0, 255, 128);
            //if (rain >= 4 && rain < 6) return Color.FromArgb(0, 255, 64);

            //if (rain >= 6 && rain < 8) return Color.FromArgb(0, 255, 0);
            //if (rain >= 8 && rain < 10) return Color.FromArgb(0, 225, 0);

            //if (rain >= 10 && rain < 12) return Color.FromArgb(0, 204, 0);

            //if (rain >= 12 && rain < 15) return Color.FromArgb(126, 204, 0);

            //if (rain >= 15 && rain < 18) return Color.FromArgb(204, 230, 0);

            if (rain < 22) return Color.FromArgb(0, 230, 204);

            if (rain >= 22 && rain < 24) return Color.FromArgb(0, 204, 126);

            if (rain >= 24 && rain < 26) return Color.FromArgb(0, 179, 0);

            if (rain >= 26 && rain < 28) return Color.FromArgb(126, 204, 0);

            if (rain >= 28 && rain < 30) return Color.FromArgb(204, 230, 0);

            if (rain >= 30 && rain < 32) return Color.FromArgb(255, 255, 0);

            if (rain >= 32 && rain < 33) return Color.FromArgb(255, 204, 0);

            if (rain >= 33 && rain < 34) return Color.FromArgb(255, 153, 0);

            if (rain >= 34 && rain < 35) return Color.FromArgb(255, 102, 0);

            if (rain >= 35) return Color.FromArgb(255, 0, 0);
            //}
            return Color.Transparent;
        }
        public static Color GetSpeedColor(double rain)
        {
            if (rain >= 8.0 && rain < 10.8) return Color.FromArgb(0, 179, 0);
            if (rain >= 10.8 && rain < 13.9) return Color.FromArgb(126, 204, 0, 1);
            if (rain >= 13.9 && rain < 17.2) return Color.FromArgb(204, 230, 0, 1);
            if (rain >= 17.2 && rain < 20.8) return Color.FromArgb(255, 255, 0, 1);
            if (rain >= 20.8 && rain < 24.5) return Color.FromArgb(255, 204, 0, 1);
            if (rain >= 24.5 && rain < 28.5) return Color.FromArgb(255, 153, 0, 1);
            if (rain >= 28.5 && rain < 32.6) return Color.FromArgb(255, 102, 0, 1);
            if (rain >= 32.6) return Color.FromArgb(255, 0, 0, 1);
            return Color.Transparent;
        }
        public static Color GetRainColor(double rain)
        {
            if (rain < 0.1) return Color.Transparent;
            if (rain >= 0.1 && rain < 0.5) return Color.FromArgb(0, 235, 235);
            if (rain >= 0.5 && rain < 1) return Color.FromArgb(0, 160, 245);
            if (rain >= 1 && rain < 2) return Color.FromArgb(0, 0, 246);
            if (rain >= 2 && rain < 5) return Color.FromArgb(0, 255, 0);
            if (rain >= 5 && rain < 10) return Color.FromArgb(0, 200, 0);
            if (rain >= 10 && rain < 15) return Color.FromArgb(0, 144, 0);
            if (rain >= 15 && rain < 20) return Color.FromArgb(255, 255, 0);
            if (rain >= 20 && rain < 30) return Color.FromArgb(231, 192, 0);
            if (rain >= 30 && rain < 40) return Color.FromArgb(255, 144, 0);
            if (rain >= 40 && rain < 50) return Color.FromArgb(255, 71, 71);
            if (rain >= 50 && rain < 60) return Color.FromArgb(255, 0, 0);
            if (rain >= 60 && rain < 80) return Color.FromArgb(192, 0, 0);
            if (rain >= 80) return Color.FromArgb(255, 0, 255);
            return Color.Transparent;
        }
        public static Color GetUColor(double u)
        {
            if (u >= 0 && u < 10) return Color.FromArgb(167, 15, 20);

            if (u >= 10 && u < 20) return Color.FromArgb(200, 77, 0);

            if (u >= 20 && u < 30) return Color.FromArgb(236, 112, 17);

            if (u >= 30 && u < 40) return Color.FromArgb(253, 154, 39);

            if (u >= 40 && u < 50) return Color.FromArgb(255, 232, 157);

            if (u >= 50 && u < 60) return Color.FromArgb(232, 246, 255);

            if (u >= 60 && u < 70) return Color.FromArgb(210, 228, 239);

            if (u >= 70 && u < 80) return Color.FromArgb(169, 214, 235);

            if (u >= 80 && u < 90) return Color.FromArgb(67, 147, 199);

            if (u >= 90 && u < 100) return Color.FromArgb(36, 5, 202);

            return Color.Transparent;
        }
        public static Color GetVColoe(double num)
        {
            num = num * 1000;
            if (num <= 50 && num >= 0)
            {
                return Color.FromArgb(255, 0, 255);
            }
            if (num > 50 && num <= 100)
            {
                return Color.FromArgb(192, 0, 0);
            }
            if (num > 100 && num <= 200)
            {
                return Color.FromArgb(213, 0, 0);
            }
            if (num > 200 && num <= 500)
            {
                return Color.FromArgb(255, 0, 0);
            }
            if (num > 500 && num <= 1000)
            {
                return Color.FromArgb(255, 144, 0);
            }
            if (num > 1000 && num <= 2000)
            {
                return Color.FromArgb(231, 192, 0);
            }
            if (num > 2000 && num <= 5000)
            {
                return Color.FromArgb(255, 255, 0);
            }
            if (num > 5000 && num <= 10000)
            {
                return Color.FromArgb(0, 144, 0);
            }
            if (num > 10000 && num <= 15000)
            {
                return Color.FromArgb(0, 200, 0);
            }
            if (num > 15000 && num <= 25000)
            {
                return Color.FromArgb(0, 255, 0);
            }
            if (num > 25000 && num <= 50000)
            {
                return Color.FromArgb(0, 0, 246);
            }
            if (num > 50000 && num <= 100000)
            {
                return Color.FromArgb(0, 160, 245);
            }
            if (num > 150000 && num <= 200000)
            {
                return Color.FromArgb(0, 235, 235);
            }
            if (num > 200000)
            {
                return Color.Green;
            }
            return Color.Transparent;
        }

        public static Region GetRegion_ZH()
        {
            //118.6  26.8
            //108.5  18.34
            List<List<Double>> IX = new List<List<Double>>();
            List<List<Double>> IY = new List<List<Double>>();
            OracleHelper db = new OracleHelper("EJETDB247OCEAN");
            DataTable dt = db.ExecuteDataTable("select a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid FROM T_SZ_GRID_FORECAST a left join T_SZ_GRID_POINT_5K b on a.venueid = b.recid  where ddatetime = to_date('2017-01-25 16:00:00', 'yyyy-mm-dd hh24:mi:ss') and ybsx = 1 order by venueid");
            foreach (DataRow item in dt.Rows)
            {
                //IX.Add(float.Parse(item["X"].ToString()));
                //IY.Add(float.Parse(item["Y"].ToString()));
                IX.Add(new List<double>());
                IY.Add(new List<double>());
                IX[IX.Count - 1].Add(double.Parse(item["X"].ToString()) - 0.025);
                IY[IY.Count - 1].Add(double.Parse(item["Y"].ToString()) - 0.025);

                IX[IX.Count - 1].Add(double.Parse(item["X"].ToString()) - 0.025);
                IY[IY.Count - 1].Add(double.Parse(item["Y"].ToString()) + 0.025);

                IX[IX.Count - 1].Add(double.Parse(item["X"].ToString()) + 0.025);
                IY[IY.Count - 1].Add(double.Parse(item["Y"].ToString()) + 0.025);

                IX[IX.Count - 1].Add(double.Parse(item["X"].ToString()) + 0.025);
                IY[IY.Count - 1].Add(double.Parse(item["Y"].ToString()) - 0.025);
            }
            int width = 500;
            int height = 300;
            float xmin = 113.675f, xmax = 114.675f, ymin = 22.275f, ymax = 22.875f;
            float xr = width / (xmax - xmin);//103.960396039604
            float yr = height / (ymax - ymin);//104.0189125295508
            double X1 = xmin;
            double Y1 = ymin;
            Region rg = null;
            try
            {
                rg = GetRegion(IX, IY, height, X1, Y1, xr, yr, width, height);
            }
            catch (Exception ee)
            {

            }

            return rg;
        }

        private static Region GetRegion(List<List<Double>> IX, List<List<Double>> IY, int h, double X1, double Y1, double xr, double yr, int width, int height)
        {
            Region region = new Region();
            GraphicsPath path = new GraphicsPath();
            try
            {
                for (int i = 0; i < IX.Count(); i++)
                {
                    //GraphicsPath g = new GraphicsPath(FillMode.Alternate);
                    PointF[] f = new PointF[IX[i].Count];

                    for (int j = 0; j < IX[i].Count; j++)
                    {
                        f[j] = new PointF();
                        f[j].X = (int)((IX[i][j] - X1) * xr);
                        f[j].Y = (int)(h - (IY[i][j] - Y1) * yr);
                    }
                    path.AddPolygon(f);

                }
                //path = g;
                region = new Region(path);
            }
            catch (Exception ee)
            {
                //CreateLogTxt.ErrWriter(ee);
                //Console.WriteLine(ee.Message);
            }

            //PointF[] f = new PointF[city.Length];
            Bitmap bmp = new Bitmap(width, height);
            Graphics g1 = Graphics.FromImage(bmp);
            g1.CompositingQuality = CompositingQuality.HighQuality;
            g1.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g1.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;
            g1.SmoothingMode = SmoothingMode.HighQuality;
            g1.Clear(Color.Transparent);
            //SolidBrush brush1 = new SolidBrush(Color.FromArgb(125, 255, 0, 0));
            //for (int i = 0; i < region.Length; i++)
            //{
            //    g1.FillRegion(brush1, region[i]);
            //}
            //for (int i = 0; i < path.Length; i++)
            //{
            g1.FillPath(Brushes.Red, path);
            g1.DrawPath(new Pen(Color.Red, 1), path);
            //}
            bmp.Save(@"F:\张成志\TFS\深圳分区预报\GridPointPrediction_Web\DAL\bin\Debug\test1.png");
            return region;

        }
        static private double[] InterolationForecastGrid(double[] grid900700, int oW, int oH, int NewW, int NewH)
        {
            double[] grid800800 = new double[NewW * NewH];
            for (int y = 0; y < oH; y++)
                for (int x = 0; x < oW; x++)
                {
                    int ix = x;
                    int iy = y;
                    int newx = x * 5;
                    int newy = y * 5;
                    for (int i = -2; i <= 2; i++)
                        for (int j = -2; j <= 2; j++)
                        {
                            int nx = newx + i;
                            int ny = newy + j;
                            if (nx >= 0 && nx < NewW && ny >= 0 && ny < NewH)
                                grid800800[ny * NewW + nx] = grid900700[iy * oW + ix];
                        }
                }
            SmoothGrid(grid800800, NewW, NewH);
            return grid800800;
        }
        public static void SmoothGrid(double[] grid, int Width, int Height)
        {
            int[] d = { -2, -1, 0, 1, 2 };
            double[] back_grid = new double[grid.Length];
            for (int k = 0; k < grid.Length; k++)
                back_grid[k] = grid[k];
            for (int iy = 0; iy < Height; iy++)
                for (int ix = 0; ix < Width; ix++)
                {
                    int index = iy * Width + ix;
                    double avg = 0;
                    int count = 0;
                    for (int j = 0; j < d.Length; j++)
                        for (int i = 0; i < d.Length; i++)
                        //if(i!=0&&j!=0)
                        {
                            if ((iy + j) >= 0 && (iy + j) < Height && (ix + i) >= 0 && (ix + i) < Width)
                            {
                                avg += back_grid[(iy + j) * Width + (ix + i)];
                                count++;
                            }
                        }
                    if (count >= 1)
                    {
                        avg = (avg / count);
                        grid[index] = avg;
                    }
                }
        }
    }
}
public class GridInfo
{
    //a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid
    public int RECID { get; set; }
    public DateTime DDATETIME { get; set; }
    public string FORECASTER { get; set; }
    public int VENUEID { get; set; }
    public int YBSX { get; set; }
    public double T2M { get; set; }
    public double SLP { get; set; }
    public double WSPD10M { get; set; }
    public double WDIR10M { get; set; }
    public double RHSFC { get; set; }
    public double RAIN { get; set; }
    public DateTime FORECASTTIME { get; set; }
    public double DP2T { get; set; }
    public double R6H { get; set; }
    public double R24H { get; set; }
    public double CLCT { get; set; }
    public double VISI { get; set; }
    public double MINTEMP { get; set; }
    public double MAXTEMP { get; set; }
    public double RAINPROV { get; set; }
    public double RAINPROV_6H { get; set; }
    public double RAINPROV_24H { get; set; }
    public string X { get; set; }
    public string Y { get; set; }
    public string OBTID { get; set; }
}

public class GridInfo_user
{
    //a.RECID,DDATETIME,VENUEID,YBSX,T2M,SLP,WSPD10M,WDIR10M,RHSFC,RAIN,FORECASTTIME,DP2T,R6H,R24H,CLCT,visi,a.MINTEMP,a.MAXTEMP,a.RAINPROV,a.RAINPROV_6H,a.RAINPROV_24H, b.x,b.y,b.obtid
    public int RECID { get; set; }
    public DateTime DDATETIME { get; set; }
    public string FORECASTER { get; set; }
    public int VENUEID { get; set; }
    public int YBSX { get; set; }
    public double T2M { get; set; }
    public double RAIN { get; set; }
    public DateTime FORECASTTIME { get; set; }
    public object R6H { get; set; }
    public double R24H { get; set; }
    public object MINTEMP { get; set; }
    public object MAXTEMP { get; set; }
}