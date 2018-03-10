using API.Model;
using DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OracleClient;
using System.Linq;
using System.Text;
using System.Net;

namespace API
{
    /// <summary>
    /// 自动站查询
    /// </summary>
    public class AWSQuery
    {
        string getFieldName(OBTField fieldName, out int offsetHours)
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
        /// <summary>
        /// 自动站属性变值
        /// </summary>
        List<AWSFieldValue> GetOffsetFromDB(DateTime? date, OBTArea area, OBTField fieldName, int accuracy)
        {
            int offsetHours;
            string field = getFieldName(fieldName, out offsetHours);
            if (offsetHours == 0)
                return null;
            DateTime checkTime;
            if (date == null)
            {
                checkTime = DateTime.Now.AddMinutes(-5);
                checkTime = checkTime.AddMinutes(-checkTime.Minute % 5);
                checkTime = checkTime.AddSeconds(-checkTime.Second);
            }
            else
                checkTime = date.Value;
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            string tableName = AWSItems.getTableName(checkTime, area, TimeMode.MINUTE, fieldName);
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@"SELECT A.obtid, (A.{0}-B.{1})/" + accuracy + " FROM (select obtid,{2} from {3} where ddatetime=:dnow and {4} is not null) A inner join(select obtid, {5} from {6} where ddatetime = :dbefore and {7} is not null) B ON A.obtid = B.obtid",
                field, field, field, tableName, field, field, tableName, field);
            DataTable data = OracleHelp.ExecuteDataTable(sb.ToString(), T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":dnow", checkTime), new OracleParameter(":dbefore", checkTime.AddHours(offsetHours)));
            foreach (DataRow row in data.Rows)
            {
                if((double)(decimal)row[1]<9999)
                result.Add(new AWSFieldValue() { TM = checkTime, ID = row[0].ToString(), V0 = (double)(decimal)row[1] });
            }
            return result;
        }
        List<AWSFieldValue> GetAWSInfoFromDB(DateTime date, OBTArea area, TimeMode aType, OBTField dataField, int accuracy)
        {
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            string tableName = AWSItems.getTableName(date, area, aType, dataField);
            if (aType == TimeMode.DAY)
                date = date.Date;
            string seleceField = dataField.ToString();
            string sql = string.Format("select OBTID,{0}/" + accuracy + " from {1} where DDATETIME=:ddate and {2} is not null", seleceField, tableName, seleceField, seleceField);
            DataTable data = OracleHelp.ExecuteDataTable(sql, T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":ddate", date));
            foreach (DataRow row in data.Rows)
                result.Add(new AWSFieldValue() { ID = row[0].ToString(), V0 = (double)(decimal)row[1] });
            return result;
        }
        /// <summary>
        /// 获取自动站最新数据
        /// </summary>
        List<AWSFieldValue> GetLastAWSInfo(OBTArea area, TimeMode aType, OBTField dataField, int accuracy)
        {
            string tableName = AWSItems.getTableName(DateTime.Now, area, aType, dataField);
            DataTable lastTable = AWSItems.getLastAWStable(tableName);
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            foreach (DataRow row in lastTable.Rows)
            {
                var v0 = row[dataField.ToString()];
                if (v0 != DBNull.Value&& (double)(decimal)v0 / accuracy<9999)
                {
                    AWSFieldValue aws = new AWSFieldValue();
                    aws.TM = (DateTime)row["DDATETIME"];
                    aws.ID = row["OBTID"].ToString();
                    aws.V0 = (double)(decimal)v0 / accuracy;
                    result.Add(aws);
                }
            }
            return result;
        }
        /// <summary>
        /// 获取海平面气压
        /// </summary>
        /// <returns></returns>
        List<AWSFieldValue> GetP0(DateTime? date)
        {
            DateTime checkTime;
            if (date == null)
            {
                checkTime = DateTime.Now.AddMinutes(-5);
                checkTime = checkTime.AddMinutes(-checkTime.Minute % 5);
            }
            else
                checkTime = date.Value;
            if (checkTime.Year >= 2017 && checkTime.DayOfYear > 110)
            {
                List<AWSFieldValue> result = new List<AWSFieldValue>();
                string dataFromWWW = new WebClient().DownloadString("http://10.153.96.179/data/output/obtmind/" + checkTime.ToString("yyyyMMdd") + "/P0_" + checkTime.ToString("yyyyMMddHHmm") + ".csv");
                string[] lines = dataFromWWW.Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries);
                for (int i = 1; i < lines.Length; i++)
                {
                    string[] content = lines[i].Split(',');
                    AWSFieldValue aws = new AWSFieldValue()
                    {
                        ID = content[0],
                        V0 = double.Parse(content[1]),
                        TM = checkTime
                    };
                    result.Add(aws);
                }
                return result;
            }
            return null;
        }
        /// <summary>
        /// 自动站属性查询
        /// </summary>
        /// <param name="date"></param>
        /// <param name="area"></param>
        /// <param name="aType"></param>
        /// <param name="awsType"></param>
        /// <param name="dataField"></param>
        /// <returns></returns>
        public List<AWSFieldValue> GetFiledValue(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, OBTField dataField, bool isPlaying, int accuracy, bool orderbyDesc)
        {
            List<AWSFieldValue> gd2mInfo = null;
            if (type == AWDType.WIND)
            {
                if (date == null)
                    gd2mInfo = AWSWind.GetLastAWSInfo(area, timeMode, dataField);
                else
                    gd2mInfo = AWSWind.GetAWSWindFromDB(date.Value, area, timeMode, dataField);
            }
            else
            {
                if (dataField == OBTField.P0)
                    gd2mInfo = GetP0(date);
                else
                {
                    gd2mInfo = GetOffsetFromDB(date, area, dataField, accuracy);
                    if (gd2mInfo == null)
                    {
                        if (date == null) gd2mInfo = GetLastAWSInfo(area, timeMode, dataField, accuracy);
                        else gd2mInfo = GetAWSInfoFromDB(date.Value, area, timeMode, dataField, accuracy);
                    }
                    if (type == AWDType.RAIN)
                    {
                        if (!isPlaying)
                        {
                            DateTime lastTime;
                            if (date == null) lastTime = gd2mInfo[0].TM.Value;
                            else lastTime = date.Value;
                            addOldRain(lastTime, area, timeMode, gd2mInfo, dataField);
                        }
                    }
                }
            }
            if (orderbyDesc)
                return gd2mInfo.OrderByDescending(t => t.V0).ToList();
            else
                return gd2mInfo.OrderBy(t => t.V0).ToList();
        }
        /// <summary>
        /// 补充滑动雨量
        /// </summary>
        void addOldRain(DateTime date, OBTArea area, TimeMode aType, List<AWSFieldValue> target, OBTField dataField)
        {
            string tableName = AWSItems.getTableName(date, area, aType, dataField);
            string seleceField = dataField.ToString();
            int sliderRainMinut = 0;
            if (dataField == OBTField.R06M) sliderRainMinut = 6;
            else if (dataField == OBTField.R12M) sliderRainMinut = 12;
            else if (dataField == OBTField.R30M) sliderRainMinut = 30;
            else if (dataField == OBTField.R01H) sliderRainMinut = 60;
            else if (dataField == OBTField.R02H) sliderRainMinut = 120;
            else if (dataField == OBTField.R03H) sliderRainMinut = 180;
            else if (dataField == OBTField.R06H) sliderRainMinut = 360;
            else if (dataField == OBTField.R12H) sliderRainMinut = 60 * 12;
            else if (dataField == OBTField.R24H) sliderRainMinut = 60 * 24;
            else if (dataField == OBTField.R48H) sliderRainMinut = 60 * 48;
            else if (dataField == OBTField.R72H) sliderRainMinut = 60 * 72;
            if (sliderRainMinut > 0)
            {
                StringBuilder sb = new StringBuilder();
                int noDataCounts = 0;
                sb.AppendFormat("select DDATETIME,OBTID,{0} from {1} where DDATETIME>:ddate0 and {2}>0 and {2}<99999 and DDATETIME<:ddate1 and OBTID in(", seleceField, tableName, seleceField);
                foreach (var code in AWSCode.OBTCodeList)
                {
                    if (!target.Exists(t => t.ID == code.Key))
                    {
                        if (noDataCounts > 200)
                            break;
                        if (noDataCounts++ > 0)
                            sb.Append(",");
                        sb.Append("'");
                        sb.Append(code.Key);
                        sb.Append("'");
                    }
                }
                sb.Append(") order by DDATETIME desc");
                if (noDataCounts > 0)
                {
                    using (IDataReader reader = OracleHelp.ExecuteReader(sb.ToString(), T_LOCALOBTMIND.Tunnel.connString, new OracleParameter(":ddate0", date.AddMinutes(-sliderRainMinut)), new OracleParameter(":ddate1", date)))
                    {
                        string obtid;
                        int maxRead = 5000;
                        while (reader.Read())
                        {
                            if (--maxRead == 0)
                                break;
                            obtid = reader[1].ToString();
                            if (!target.Exists(t => t.ID == obtid))
                            {
                                double value = (double)(decimal)reader[2];
                                target.Add(new AWSFieldValue() { ID = obtid, V0 = value, TM = (DateTime)reader[0] });
                                if (--noDataCounts == 0)
                                    break;
                            }
                        }
                    }
                }
            }
        }


    }
}
