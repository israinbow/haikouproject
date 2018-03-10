using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
   
    public class TrackingModel
    {   /// <summary>
        /// 开始站台数
        /// </summary>
        public int Beginawscount { get; set; }
        /// <summary>
        /// 结束站台数
        /// </summary>
        public int Endawscount { get; set; }
        /// <summary>
        /// 最大站台数
        /// </summary>
        public int Maxawscount { get; set; }
        /// <summary>
        /// 最小站台数
        /// </summary>
        public int Minawscount { get; set; }
        /// <summary>
        /// 开始概率
        /// </summary>
        public double Beginprobability { get; set; }
        /// <summary>
        /// 结束概率
        /// </summary>
        public double Endprobability { get; set; }
        /// <summary>
        /// 最大概率
        /// </summary>
        public double Maxprobability { get; set; }
        /// <summary>
        /// 最小概率
        /// </summary>
        public double Minprobability { get; set; }
        /// <summary>
        /// 台站数
        /// </summary>
        public int cxstations { get; set; }
        /// <summary>
        /// 概率
        /// </summary>
        public double CXPROBABILITY { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public string ddatetime { get; set; }
        public string ddatetimestr { get; set; }
        public List<OBTRealInfo> Ls_OBTRealInfo { get; set; }
    }
}
