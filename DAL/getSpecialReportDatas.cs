using Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.OracleClient;

namespace DAL
{   
    //专报制作数据获取
    public class getSpecialReportDatas
    {
        //获取决策预报数据
        public static Dictionary<int, DataTable> DecisionForecastToDB(string table)
        {
            try
            {
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();
                if (table == "T_HK_NEW_GRID_FORECAST")
                {
                    strSql.Append("SELECT * FROM (SELECT * FROM " + table + " ORDER BY recid DESC) WHERE ROWNUM <= 100");
                }
                else
                {
                    strSql.Append("select * FROM  " + table + " order by recid desc");
                }
                
                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                int i = 0;
                datas.Add(i, dt);

                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }

        //获取假日专报数据
        public static Dictionary<int, DataTable> HolidaysForecastToDB(string NationalTB, string GaokaoTB, string ZhongkaoTB, string SpringTB, string DuanwuTB)
        {
            try
            {
                Dictionary<int, DataTable> datas = new Dictionary<int, DataTable>();
                Dictionary<int, DataRow[]> dataRow = new Dictionary<int, DataRow[]>();
                StringBuilder strSql = new StringBuilder();
                OracleHelper oh = null;
                DataTable dt = null;
                strSql = new StringBuilder();

                strSql.Append("select RECID,DDATETIME,FORECASTER,FILEFLAG FROM  " + NationalTB + " union all ");
                strSql.Append("select RECID,DDATETIME,FORECASTER,FILEFLAG FROM  " + GaokaoTB + " union all ");
                strSql.Append("select RECID,DDATETIME,FORECASTER,FILEFLAG FROM  " + ZhongkaoTB + " union all ");
                strSql.Append("select RECID,DDATETIME,FORECASTER,FILEFLAG FROM  " + SpringTB + " union all ");
                strSql.Append("select RECID,DDATETIME,FORECASTER,FILEFLAG FROM " + DuanwuTB + "");

                oh = new OracleHelper("HAIKOUConnect");
                dt = oh.ExecuteDataTable(strSql.ToString());

                if (dt == null || dt.Rows.Count == 0)
                {
                    return null;
                }

                int i = 0;
                datas.Add(i, dt);

                return datas;

            }
            catch (Exception ee)
            {
                CreateLogTxt.ErrWriter(ee);
            }
            return null;
        }
    }
}
