using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class MapTempEntity
    {   /// <summary>
        ///区域代码 
        /// </summary>
        public string PARTY { get; set; }
        /// <summary>
        /// 街道办
        /// </summary>
        public string STREET { get; set; }
        /// <summary>
        /// 区域
        /// </summary>
        public string AREA { get; set; }
        /// <summary>
        /// 包含深圳的方向片区
        /// </summary>
        public string SPELL { get; set; }
        /// <summary>
        /// 包含深圳的方向片区
        /// </summary>
        public string BELONGTO { get; set; }
        /// <summary>
        /// 信号组合
        /// </summary>
        public string SIGNAL { get; set; }
        /// <summary>
        /// 发布的时间组合
        /// </summary>
        public string TIME { get; set; }
        public List<MapTempSignalEntity> MapTempSignaList { get;set;}
        public string RECID { get; set; }
    }
    public class MapTempSignalEntity
    {
        public string RECIDKEY { get; set; }
        public string SIGNAL { get; set; }
        public string SIGNALLEVEL { get; set; }
        public string DDATETIME { get; set; }
        public string TNUMBER { get; set; }
    }
}
