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
    /// 变温查询、统计
    /// </summary>
    public class AWSOffset
    {
        /// <summary>
        /// 自动站变温
        /// </summary>
        public static Dictionary<string, decimal> GetOffsetFromDB(DateTime date, OBTArea area, OBTField fieldName)
        {
            int offsetHours;
            string field = getFieldName(fieldName, out offsetHours);
            if (offsetHours == 0)
                return null;
            Dictionary<string, decimal> result = new Dictionary<string, decimal>();
            string tableName = AWSItems.getTableName(date, area, TimeMode.MINUTE);
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@"SELECT A.obtid, A.{0}-B.{1} FROM (select obtid,{2} from {3} where ddatetime=:dnow and {4} is not null) A inner join(select obtid, {5} from {6} where ddatetime = :dbefore and {7} is not null) B ON A.obtid = B.obtid",
                field, field, field, tableName, field, field, tableName, field);
            DataTable data = OracleHelp.ExecuteDataTable(sb.ToString(), T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":dnow", date), new OracleParameter(":dbefore", date.AddHours(offsetHours)));
            foreach (DataRow row in data.Rows)
                result.Add(row[0].ToString(), (decimal)row[1]);
            return result;
        }
        /// <summary>
        /// 历史差变查询
        /// </summary>
        public static string GetHistory(string obtid, DateTime current, OBTField fieldName)
        {
            int offsetHours;
            string field = getFieldName(fieldName, out offsetHours);
            if (offsetHours == 0)
                return null;
            DateTime start = current.AddHours(offsetHours);
            OBTCODE obt = AWSCode.OBTCodeList[obtid];
            string tableName = AWSItems.getTableName(start, obt.AREA, TimeMode.MINUTE);
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("select DDATETIME,{0} from {1} where obtid=:obtId AND DDATETIME >= :dstart AND DDATETIME<=:dend and {2} is not null ORDER BY DDATETIME", field, tableName, field);
            DataTable data = OracleHelp.ExecuteDataTable(sb.ToString(), T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":obtId", obtid), new OracleParameter(":dstart", start), new OracleParameter(":dend", current));
            List<AWSOffsetRow> offsetData = new List<AWSOffsetRow>();
            foreach (DataRow row in data.Rows)
                offsetData.Add(new AWSOffsetRow() { DDATETIME = (DateTime)row[0], VALUE = (decimal)row[1] });
            sb.Clear();
            sb.Append("[");
            if (offsetData.Count > 0)
            {
                int rows = 0;
                decimal firstValue = offsetData[0].VALUE;
                for (int i = 0; i < offsetData.Count; i++)
                {
                    if (rows++ > 0)
                        sb.Append(",");
                    sb.Append("[");
                    sb.Append("\"");
                    sb.Append(Utility.DateTimeToJson(offsetData[i].DDATETIME));
                    sb.Append("\",");
                    sb.Append(offsetData[i].VALUE - firstValue);
                    sb.Append("]");
                }
            }
            sb.Append("]");
            return sb.ToString();
        }
        static string getFieldName(OBTField fieldName, out int offsetHours)
        {
            string field = null;
            offsetHours = 0;
            if (fieldName == OBTField.TOFFSET01H) offsetHours = -1;
            else if (fieldName == OBTField.TOFFSET03H) offsetHours = -3;
            else if (fieldName == OBTField.TOFFSET24H) offsetHours = -24;
            if (offsetHours < 0)
                field = "T";
            else
            {
                if (fieldName == OBTField.POFFSET01H) offsetHours = -1;
                else if (fieldName == OBTField.POFFSET03H) offsetHours = -3;
                else if (fieldName == OBTField.POFFSET24H) offsetHours = -24;
                if (offsetHours < 0)
                    field = "P";
            }
            return field;
        }
    }
    public struct AWSOffsetRow
    {
        public DateTime DDATETIME;
        public decimal VALUE;
    }
}
