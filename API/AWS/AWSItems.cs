using API.Model;
using DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OracleClient;
using System.Linq;
using System.Text;
using System.Web.Caching;

namespace API
{
    public class AWSItems
    {
        static AWSItems()
        {
            getLastAWStable("SURF_CHN_MUL_MIN", true);
        }
        static object lockKey = new object();
        public static DataTable getLastAWStable(string tableName, bool writeCachable=false)
        {
            lock (lockKey)
            {
                string ckey = "lastAWSiNFO#" + tableName;
                DataTable table = MyCacheManager.Get(ckey) as DataTable;
                if (table == null)
                {
                    string select = string.Format(@"select * from(
                SELECT ROW_NUMBER() OVER(PARTITION BY obtid ORDER BY ddatetime DESC) LEV,s.*  from( select * from (
                    select * from {0} where WD3SMAXDF>=0 ORDER BY ddatetime desc
                    ) where ROWNUM < 5000 ) s 
                ) WHERE LEV=1", tableName);
                    table = OracleHelp.ExecuteDataTable(select, T_LOCALOBTDAYD.Tunnel.connString);
                    if (writeCachable)
                        MyCacheManager.Insert(ckey, table, DateTime.Now.AddMinutes(1), System.Web.Caching.CacheItemPriority.High, null, (string key, object value, CacheItemRemovedReason reason) =>
                        {
                            if (reason == CacheItemRemovedReason.Expired)
                                getLastAWStable(key.Split('#')[1], true);
                        });
                }
                return table;
            }
        }

        public static string getTableName(DateTime date, OBTArea area, TimeMode aType, OBTField? dataField = null)
        {
            string tableName;
            if (aType == TimeMode.MINUTE)
            {
                tableName = "SURF_CHN_MUL_MIN";
            }
            else if (aType == TimeMode.HOUR)
            {
                tableName = "SURF_CHN_MUL_HOR";
            }
            else
                tableName = "SURF_CHN_MUL_DAY";
            return tableName;
        }
        public static string GetHistory(string obtid, DateTime start, DateTime current, TimeMode timeMode, OBTField[] dataField, OBTField keyField)
        {
            OBTCODE obt = AWSCode.OBTCodeList[obtid];
            StringBuilder sb = new StringBuilder();
            string tableName = getTableName(start, obt.AREA, timeMode, keyField);
            string selectField;
            for (int i = 0; i < dataField.Length; i++)
            {
                if (i > 0)
                    sb.Append(",");
                sb.Append(dataField[i].ToString());
            }
            selectField = sb.ToString();
            sb.Clear();
            sb.AppendFormat("select {0} from {1} where obtid=:obtId AND DDATETIME >= :dstart AND DDATETIME <= :dend and {2} is not null ORDER BY DDATETIME", selectField, tableName, keyField.ToString());
            DataTable data = OracleHelp.ExecuteDataTable(sb.ToString(), T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":obtId", obtid), new OracleParameter(":dstart", start), new OracleParameter(":dend", current));
            sb.Clear();
            sb.Append("[");
            int itemIndex;
            int rows = 0;
            foreach (DataRow row in data.Rows)
            {
                if (rows++ > 0)
                    sb.Append(",");
                itemIndex = 0;
                sb.Append("[");
                foreach (var item in row.ItemArray)
                {
                    if (itemIndex++ > 0)
                        sb.Append(",");
                    if (item is DateTime)
                    {
                        sb.Append("\"");
                        sb.Append(Utility.DateTimeToJson((DateTime)item));
                        sb.Append("\"");
                    }
                    else
                        sb.Append(item);
                }
                sb.Append("]");
            }
            sb.Append("]");
            return sb.ToString();
        }
    }
}
