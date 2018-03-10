using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class OBTDAYD
    {
        /// <summary>
        /// 数据时间，这是一个时间型字段，只包括了日期，查询的时候，可以用to_date(ddatetime,'yyyymmdd')方法把它转换为字符串。
        /// </summary>
        public DateTime DDATETIME { get; set; }
        /// <summary>
        /// 站点代码
        /// </summary>
        public string OBTID { get; set; }

        /// <summary>
        /// 最大风速，单位：0.1m/s。取一天中某自动站全部整点记录的最大风速字段（wd10maxdf)的最大值
        /// </summary>
        public int WD10MAXDF { get; set; }
        public int WD10MAXDD { set; get; }
        public DateTime WD10MAXTIME { set; get; }
        /// <summary>
        /// 极大风速，单位：0.1m/s。取一天中某自动站全部整点记录的极大风速字段（wd3smaxdf)的最大值。
        /// </summary>
        public int WD3SMAXDF { set; get; }
        public int WD3SMAXDD { set; get; }
        public DateTime WD3SMAXTIME { set; get; }
        /// <summary>
        /// 最高气温，单位：0.1摄氏度。取一天中某自动站全部分钟记录的空气温度字段（t)的最大值。
        /// </summary>
        public Int32 MAXT { get; set; }
        /// <summary>
        /// 最低气温，单位：0.1摄氏度。取一天中某自动站全部分钟记录的空气温度字段（t)的最小值。
        /// </summary>
        public Int32 MINT { get; set; }
        /// <summary>
        /// 平均气温，单位：0.1摄氏度，采用02、08、14、20时四个定时次的平均值，当缺测一个或一个时次以上是，不做平均值统计
        /// </summary>
        public int AVGT { set; get; }
        /// <summary>
        /// 累计雨量，昨20时至今20时的累计雨量，单位：0.1mm
        /// </summary>
        public int R24H { set; get; }

        /// <summary>
        /// 最大湿度，一个百分比值，取值1到100
        /// </summary>
        public int MAXU { set; get; }
        /// <summary>
        /// 最小湿度，一个百分比值，取值1到100
        /// </summary>
        public int MINU { set; get; }
        /// <summary>
        /// 平均湿度，一个百分比值，取值从1到100，采用02、08、14、20时四个定时次的平均值
        /// </summary>
        public int AVGU { set; get; }

        /// <summary>
        /// 最高气压，单位：0.1百帕。取一天中某自动站全部分钟记录的本站气压字段（p)的最大值
        /// </summary>
        public int MAXP { set; get; }
        /// <summary>
        /// 最低气压，单位：0.1百帕。取一天中某自动站全部分钟记录的本站气压字段（p)的最小值
        /// </summary>
        public int MINP { set; get; }
        /// <summary>
        /// 平均气压，单位：0.1百帕，采用02、08、14、20时四个定时次的平均值，当缺测一个或一个时次以上是，不做平均值统计
        /// </summary>
        public int AVGP { set; get; }
    }

    public class OBTMIND
    {
        public DateTime DDATETIME { get; set; }
        public string OBTID { get; set; }
        /// <summary>
        /// 瞬时风速
        /// </summary>
        public Int32 WDIDF { set; get; }
        /// <summary>
        /// 瞬时风向
        /// </summary>
        public Int32 WDIDD { set; get; }
        /// <summary>
        /// 二分钟风速，单位：0.1m/s。
        /// </summary>
        public Int32 WD2DF { get; set; }
        /// <summary>
        /// 二分钟风向，取值0到360。
        /// </summary>
        public Int32 WD2DD { get; set; }
        /// <summary>
        /// 十分钟风速，单位：0.1m/s。
        /// </summary>
        public Int32 WD10DF { get; set; }
        /// <summary>
        /// 十分钟风向，取值0到360。
        /// </summary>
        public Int32 WD10DD { get; set; }
        /// <summary>
        /// 小时极大风速，本小时内出现的最大瞬时风速值，单位：0.1m/s。
        /// </summary>
        public Int32 WD3SMAXDF { get; set; }
        /// <summary>
        /// 极大风向，极大风速的风向，取值0到360。
        /// </summary>
        public Int32 WD3SMAXDD { get; set; }
        /// <summary>
        /// 最大风速，本小时内出现的最大10分钟平均风速值，单位：0.1m/s。
        /// </summary>
        public int WD10MAXDF { set; get; }
        public int WD10MAXDD { set; get; }

        /// <summary>
        /// 空气温度，单位：0.1摄氏度。
        /// </summary>
        public Int32 T { get; set; }
        /// <summary>
        /// 最高气温，本小时内的最高气温，单位：0.1摄氏度。
        /// </summary>
        public Int32 MAXT { get; set; }
        /// <summary>
        /// 最低气温，本小时内的最低气温，单位：0.1摄氏度。
        /// </summary>
        public Int32 MINT { get; set; }


        /// <summary>
        /// 小时雨量，单位：0.1mm
        /// </summary>
        public int HOURR { set; get; }
        /// <summary>
        /// 5分钟滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近5分钟的累计雨量。
        /// </summary>
        public Int32 R06M { get; set; }
        /// <summary>
        /// 5分钟滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近5分钟的累计雨量。
        /// </summary>
        public Int32 R12M { get; set; }
        /// <summary>
        /// 30分钟滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近30分钟的累计雨量。
        /// </summary>
        public Int32 R30M { get; set; }
        /// <summary>
        /// 1小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近1小时的累计雨量。
        /// </summary>
        public Int32 R01H { get; set; }
        /// <summary>
        /// 2小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近2小时的累计雨量。
        /// </summary>
        public Int32 R02H { get; set; }
        /// <summary>
        /// 3小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近3小时的累计雨量。
        /// </summary>
        public Int32 R03H { get; set; }
        /// <summary>
        /// 6小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近6小时的累计雨量。
        /// </summary>
        public Int32 R06H { get; set; }
        /// <summary>
        /// 12小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近12小时的累计雨量。
        /// </summary>
        public Int32 R12H { get; set; }
        /// <summary>
        /// 24小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近24小时的累计雨量。
        /// </summary>
        public Int32 R24H { get; set; }
        /// <summary>
        /// 48小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近48小时的累计雨量。
        /// </summary>
        public Int32 R48H { get; set; }
        /// <summary>
        /// 72小时滑动雨量，单位：0.1mm，由本小时累计雨量计算出来的，表示该站点最近72小时的累计雨量。
        /// </summary>
        public Int32 R72H { get; set; }

        /// <summary>
        /// 相对湿度，一个百分比值，取值1到100
        /// </summary>
        public int U { set; get; }
        /// <summary>
        /// 最大湿度，本小时内的最大湿度，一个百分比值，取值1到100。
        /// </summary>
        public int MAXU { set; get; }
        /// <summary>
        /// 最小湿度，本小时内的最小湿度，一个百分比值，取值1到100。
        /// </summary>
        public int MINU { set; get; }

        /// <summary>
        /// 本站气压
        /// </summary>
        public int P { set; get; }
        /// <summary>
        /// 最高气压，本小时内的最高气压，单位：0.1百帕。
        /// </summary>
        public int MAXP { set; get; }
        /// <summary>
        /// 最低气压，本小时内的最低气压，单位：0.1百帕
        /// </summary>
        public int MINP { set; get; }
    }
}
