using API.Model;
using DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OracleClient;
using System.Linq;
using System.Text;

namespace API
{

    /// <summary>
    /// 自动站风速数据
    /// </summary>
    public class AWSWind
    {
        static double[] windLevelScale = new double[] { 0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37, 41.5, 46.2, 51, 56.1, 61.2 };

        static int GetWindLevel(double windSpeed)
        {
            for (int i = 0; i < windLevelScale.Length; i++)
            {
                if (windSpeed >= windLevelScale[i]) continue;
                else return i - 1;
            }
            return 18;
        }
        static void getQueryField(OBTField dataField,out string wdf,out string wdd)
        {
            if (dataField == OBTField.WDIDF) { wdf = "WDIDF"; wdd = "WDIDD"; }
            else if (dataField == OBTField.WD2DF) { wdf = "WD2DF"; wdd = "WD2DD"; }
            else if (dataField == OBTField.WD10DF) { wdf = "WD10DF"; wdd = "WD10DD"; }
            else if (dataField == OBTField.WD10MAXDF) { wdf = "WD10MAXDF"; wdd = "WD10MAXDD"; }
            else if (dataField == OBTField.WD3SMAXDF) { wdf = "WD3SMAXDF"; wdd = "WD3SMAXDD"; }
            else wdf = wdd = null;
        }
        /// <summary>
        /// 风速
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static List<AWSFieldValue> GetAWSWindFromDB(DateTime date, OBTArea area, TimeMode aType, OBTField dataField)
        {
            string wdf = null, wdd = null;       
            getQueryField(dataField,out wdf,out wdd);
            string tableName = AWSItems.getTableName(date, area, aType);
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            string selectSQL = string.Format("select OBTID,{0},{1} from {2} where DDATETIME=:ddate AND {3}>=0 AND {4}>=0 ORDER BY {5} DESC", wdf, wdd, tableName, wdf,wdd, wdf);
            DataTable data = OracleHelp.ExecuteDataTable(selectSQL, T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":ddate", aType == TimeMode.DAY ? date.Date : date));
            foreach (DataRow row in data.Rows)
            {
                if ((double)(decimal)row[1] < 9999)
                    result.Add(new AWSFieldValue() { ID = row[0].ToString(), V0 = (double)(decimal)row[1], V1 = (double)(decimal)row[2] });
            }
            return result;
        }
        public static List<AWSFieldValue> GetLastAWSInfo(OBTArea area, TimeMode aType, OBTField dataField)
        {
            string wdf = null, wdd = null;
            getQueryField(dataField, out wdf, out wdd);
            string tableName = AWSItems.getTableName(DateTime.Now, area, aType, dataField);
            DataTable lastTable = AWSItems.getLastAWStable(tableName);
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            foreach (DataRow row in lastTable.Rows) {
                var df = row[wdf];
                if (df != DBNull.Value)
                {
                    var dd = row[wdd];
                    if (dd != DBNull.Value&& (double)(decimal)df<9999)
                    {
                        AWSFieldValue aws = new AWSFieldValue();
                        aws.TM = (DateTime)row["DDATETIME"];
                        aws.ID = row["OBTID"].ToString();
                        aws.V0 = (double)(decimal)df;
                        aws.V1 = (double)(decimal)dd;
                        result.Add(aws);
                    }
                }
            }
            return result;
        }
    }
}
