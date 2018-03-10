using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OracleClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

namespace GridPointPrediction_Web.Page
{

    public class werathof
    {
        public string mintemp { get; set; }
        public string maxtemp { get; set; }
        public string forecast { get; set; }
        public string wether { get; set; }
        public string time { get; set; }



    }
    public partial class GridPointDetial : System.Web.UI.Page
    {
        public static string dateTime = null;
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        [WebMethod]
        public static List<werathof> getTideHigh(string dateTime)
        {
            try
            {
                string foreTime = "2016-8-27 16:00:00";
                string vennue = "106";
                List<werathof> info = new List<werathof>();
                werathof ss = new werathof();
                string sql = string.Format(@" select *  from   t_sz_grid_forecast where ddatetime = to_date('{0}', 'yyyy-mm-dd hh24:mi:ss')--20
                            and ybsx in (24,48,72,96,120,144,168)
                            and venueid = {1}", foreTime, vennue);
                DataTable dt = db_GreateDataTable(sql);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    ss.mintemp = dt.Rows[i]["MINTEMP"].ToString();
                    ss.maxtemp = dt.Rows[i]["MAXTEMP"].ToString();
                    ss.forecast = Convert.ToDateTime(dt.Rows[i]["FORECASTTIME"]).ToString("MM月dd日");
                    ss.time = Convert.ToDateTime(foreTime).ToString("yyyy-MM-dd HH:mm:ss");
                    info.Add(ss);
                    ss = new werathof();
                }
                return info;
            }
            catch (Exception e)
            {
                string err = e.Message;
                return null;
            }
        }
        [WebMethod]
        public static List<werathof> getdata(string dateTime)
        {
            try
            {
                string foreTime = "2016-8-27 16:00:00";
                string vennue = "106";
                List<werathof> info = new List<werathof>();
                werathof ss = new werathof();
                string sql = string.Format(@"select* from   t_sz_grid_forecast
    where ddatetime = to_date('{0}', 'yyyy-mm-dd hh24:mi:ss')--20
            and venueid = {1}
            and ybsx between 0 and 23", foreTime, vennue);
                DataTable dt = db_GreateDataTable(sql);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    ss.mintemp = dt.Rows[i]["T2M"].ToString();
                    ss.maxtemp = dt.Rows[i]["rhsfc"].ToString();
                    ss.wether = dt.Rows[i]["wspd10m"].ToString();
                    ss.forecast = dt.Rows[i]["YBSX"].ToString();


                    info.Add(ss);
                    ss = new werathof();
                }
                return info;
            }
            catch (Exception e)
            {
                string err = e.Message;
                return null;
            }
        }
        [WebMethod]
        public static List<werathof> GetforecastData(int day, string forTime)
        {

            List<werathof> info = new List<werathof>();
            werathof ss = new werathof();
            string sql = string.Format(@"select* from   t_sz_grid_forecast
    where ddatetime = to_date('{0}', 'yyyy-mm-dd hh24:mi:ss')--20
            and venueid = 106
            and ybsx between " + 24 * (day - 1) + " and " + 24 * day, forTime);
            DataTable dt = db_GreateDataTable(sql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                ss.mintemp = dt.Rows[i]["T2M"].ToString();
                ss.maxtemp = dt.Rows[i]["rhsfc"].ToString();//相随湿度
                ss.wether = dt.Rows[i]["wspd10m"].ToString();//10米风
                ss.forecast = dt.Rows[i]["YBSX"].ToString();


                info.Add(ss);
                ss = new werathof();
            }
            return info;
        }
        private static DataTable db_GreateDataTable(string strSQL)
        {
            DataTable dtReturn = null;
            OracleConnection OraConnect = new OracleConnection("Data Source=EJETDB247;Persist Security Info=True;User ID=oceanuser;Password=nowgis");
            try
            {
                OraConnect.Open();
                OracleCommand OraCommand = new OracleCommand(strSQL, OraConnect);
                OracleDataAdapter OraDataAdp = new OracleDataAdapter(OraCommand);
                DataSet ds = new DataSet();
                OraDataAdp.Fill(ds);

                if (ds.Tables.Count > 0)
                {
                    dtReturn = ds.Tables[0];
                }
                OraConnect.Close();
                OraConnect = null;
            }
            catch (Exception e)
            {
                //ErrWriter(e, strConType + "\n" + strSQL);
                OraConnect.Close();
                OraConnect = null;
            }

            return dtReturn;
        }

    }
}