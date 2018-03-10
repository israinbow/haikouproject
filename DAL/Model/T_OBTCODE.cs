using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    /// <summary>
    /// 广东自动站基本信息
    /// </summary>
    public class T_OBTCODE_NEW
    {
        /// <summary>
        /// 自动站ID
        /// </summary>
        public string OBTID { set; get; }
        /// <summary>
        /// 名称
        /// </summary>
        public string STNAME { set; get; }
        /// <summary>
        /// 经度
        /// </summary>
        public double LONGITUDE { set; get; }
        /// <summary>
        /// 纬度
        /// </summary>
        public double LATITUDE { set; get; }  
        /// <summary>
        /// 城市
        /// </summary>
        public string CITY { set; get; }
        /// <summary>
        /// 城市ID
        /// </summary>
        public string PROVINCE_CODE { set; get; }

        public static Access<T_OBTCODE_NEW> Tunnel = new Access<T_OBTCODE_NEW>(Connection.CtString);
    }
}
