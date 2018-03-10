using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{ 
    /// <summary>
    /// LWS_HAILTRIPS:实体类(下击暴流，QPFQPE暴雨自动提示信息表)
    /// </summary>
    [Serializable]
    public class T_INTELLIGENTLTRIPSEntity
    {
        public T_INTELLIGENTLTRIPSEntity()
        { }
        #region Model
        private decimal _recid;
        private DateTime? _ddatetime;
        private decimal? _leadtime;
        private decimal? _regiontype;
        private string _region;
        private decimal? _flagindex;
        private string _tripcontent;
        private decimal? _usetype;
        private decimal? _notriptimelen;
        /// <summary>
        /// 
        /// </summary>
        public decimal RECID
        {
            set { _recid = value; }
            get { return _recid; }
        }
        public string DDATETIMEStr { get; set; }
        /// <summary>
        /// 预警提示生成时间
        /// </summary>
        public DateTime? DDATETIME
        {
            set { _ddatetime = value; }
            get { return _ddatetime; }
        }
        /// <summary>
        /// 预报实效 =0 时为实况 >0时 是未来的预报
        /// </summary>
        public decimal? LEADTIME
        {
            set { _leadtime = value; }
            get { return _leadtime; }
        }
        /// <summary>
        /// 预警区域是全市或者分区
        /// </summary>
        public decimal? REGIONTYPE
        {
            set { _regiontype = value; }
            get { return _regiontype; }
        }
        /// <summary>
        /// 预警区域
        /// </summary>
        public string REGION
        {
            set { _region = value; }
            get { return _region; }
        }
        /// <summary>
        /// 预警信号索引,100为下击暴流,101为QPEQPF暴雨
        /// </summary>
        public decimal? FLAGINDEX
        {
            set { _flagindex = value; }
            get { return _flagindex; }
        }
        /// <summary>
        /// 预警提示内容
        /// </summary>
        public string TRIPCONTENT
        {
            set { _tripcontent = value; }
            get { return _tripcontent; }
        }
        /// <summary>
        /// 预报员是否启用标记
        /// </summary>
        public decimal? USETYPE
        {
            set { _usetype = value; }
            get { return _usetype; }
        }
        /// <summary>
        /// 该预警不在提示的时间长度
        /// </summary>
        public decimal? NOTRIPTIMELEN
        {
            set { _notriptimelen = value; }
            get { return _notriptimelen; }
        }
        #endregion Model
    }
}
