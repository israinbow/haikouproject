using API.Model;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API
{
    public class ClientReport
    {
        public List<AWSFieldValue> aws { set; get; }
        public StatsReport stats { set; get; }
        public DateTime time { set; get; }
    }
    /// <summary>
    /// 代表客户的浏览器
    /// </summary>
    public class ClientWindow
    {
        static Dictionary<string, OBTCODE> obtCodeList;
        static AWSQuery myQuery;

        static ClientWindow()
        {
            obtCodeList = AWSCode.OBTCodeList;
            myQuery = new AWSQuery();
        }

        static List<AWSFieldValue> getAwsFieldValueFromDb(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, OBTField dataField, int accuracy, bool isPlaying, bool orderbyDesc)
        {
            string ckey = null;
            if (date != null)
                ckey = "GetTempratureData" + date.Value.Ticks + area + timeMode + dataField + orderbyDesc;
            else
                ckey = "GetTempratureDataLastDate" + area + timeMode + dataField + orderbyDesc;
            List<AWSFieldValue> result = MyCacheManager.Get(ckey) as List<AWSFieldValue>;
            if (result == null)
            {
                result = myQuery.GetFiledValue(type, date, area, timeMode, dataField, isPlaying, accuracy, orderbyDesc);
                if (result.Count > 0)
                {
                    DateTime expire;
                    if (date != null)
                    {
                        expire = DateTime.Now.AddMinutes(4);
                        if (DateTime.Now - date > TimeSpan.FromMinutes(20))
                            expire = DateTime.Now.AddHours(8);

                    }
                    else
                        expire = DateTime.Now.AddMinutes(1);
                    MyCacheManager.Insert(ckey, result, expire);
                }
            }
            return result;
        }
        /// <summary>
        /// 获取用户地图显示需要的数据
        /// </summary>
        /// <returns></returns>
        public static ClientReport GetAWSDataInfomation(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, AWSAdmin awsAdmin, string[] citys, OBTField dataField, int accuracy, double minLng, double minLat, double maxLng, double maxLat, int canvasWidth, int canvasHeight, int minSpace, bool isPlaying, bool orderbyDesc)
        {
            List<AWSFieldValue> awsFromDb = getAwsFieldValueFromDb(type, date, area, timeMode, dataField, accuracy, isPlaying, orderbyDesc);
            List<AWSFieldValue> awsTmpResult = new List<AWSFieldValue>();
            List<AWSFieldValue> statsTarget = new List<AWSFieldValue>();
            Mercator myMercator = new Mercator(minLat, maxLat, canvasHeight, minLng, maxLng, canvasWidth);
            for (int i = 0; i < awsFromDb.Count; i++)
            {
                AWSFieldValue item = awsFromDb[i];
                if (obtCodeList.ContainsKey(item.ID))
                {
                    OBTCODE aws = obtCodeList[item.ID];
                        if (awsAdmin == AWSAdmin.city)
                        {
                            if (AWSCode.ChinaAWS.ContainsKey(item.ID))
                                continue;
                        }
                        else if (awsAdmin == AWSAdmin.state)
                        {
                            if (!AWSCode.ChinaAWS.ContainsKey(item.ID))
                                continue;
                        }
                        statsTarget.Add(item);
                        if (aws.LONGITUDE > minLng && aws.LATITUDE > minLat && aws.LONGITUDE < maxLng && aws.LATITUDE < maxLat)
                        {
                            //计算CANVAS坐标
                            item.x = myMercator.Longitude2screentX(aws.LONGITUDE);
                            item.y = myMercator.Latitude2screentY(aws.LATITUDE);
                            if (checkSpace(item, awsTmpResult, minSpace))
                            {
                                if (type == AWDType.VIS && aws.AREAID == "45005" && item.V0 < 10)
                                {
                                    item.V0 *= 1000;
                                    item.V0 = double.Parse(item.V0.ToString("f1"));
                                }
                                awsTmpResult.Add(item);
                            }
                        }
                    }
            }
            ClientReport result = new ClientReport() { aws = awsTmpResult };
            result.stats = Stats.getAwsStatis(type, statsTarget, citys);
            if (date == null)
            {
                if (awsTmpResult.Count > 0)
                    result.time = awsTmpResult[0].TM.Value;
            }
            else
                result.time = date.Value;
            return result;
        }
        /// <summary>
        /// 获取用户时间的自动站全局排序
        /// </summary>
        public static List<AWSFieldValue> GetFullViewSort(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, AWSAdmin awsAdmin, string[] citys, OBTField dataField, bool orderByDescending, int maxCount, int accuracy, bool orderbyDesc)
        {
            List<AWSFieldValue> result = new List<AWSFieldValue>();
            List<AWSFieldValue> awsFromDb = getAwsFieldValueFromDb(type, date, area, timeMode, dataField, accuracy, false, orderbyDesc);
            var dataOrderBy = orderByDescending ? awsFromDb.OrderByDescending(t => t.V0).ToArray() : awsFromDb.OrderBy(t => t.V0).ToArray();
            for (int i = 0; i < dataOrderBy.Length; i++)
            {
                var item = dataOrderBy[i];
                if (obtCodeList.ContainsKey(item.ID))
                {
                    OBTCODE aws = obtCodeList[item.ID];
                    if (citys.Length == 0 || citys.Contains(aws.AREAID))
                    {
                        if (awsAdmin == AWSAdmin.city)
                        {
                            if (AWSCode.ChinaAWS.ContainsKey(item.ID))
                                continue;
                        }
                        else if (awsAdmin == AWSAdmin.state)
                        {
                            if (!AWSCode.ChinaAWS.ContainsKey(item.ID))
                                continue;
                        }
                        result.Add(item);
                        if (--maxCount == 0)
                            break;
                    }
                }
            }
            return result;
        }

        static bool checkSpace(AWSFieldValue item, List<AWSFieldValue> others, int minSpace)
        {
            foreach (AWSFieldValue one in others)
            {
                double distance = Math.Sqrt(Math.Pow(one.x - item.x, 2) + Math.Pow(one.y - item.y, 2));
                if (distance < minSpace)
                    return false;
            }
            return true;
        }
    }
}
