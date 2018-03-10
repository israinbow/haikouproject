using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class T_LOCALOBTV
    {
        /// <summary>
        /// 数据时间
        /// </summary>
        public DateTime DDATETIME { get; set; }
        /// <summary>
        /// 站点代码
        /// </summary>
        public string OBTID { get; set; }
        /// <summary>
        /// 能见度，深圳自动站点数据的单位是0.1米，香港能见度是采用代码表示，代码与值的对照关系在T_MESGCODES表中，指示码是VV。
        /// </summary>
        public Int32 V { get; set; }
        /// <summary>
        /// 时最低能见度，单位：0.1米。
        /// </summary>
        public Int32 MINV { get; set; }

        public static Access<T_LOCALOBTV> Tunnel = new Access<T_LOCALOBTV>(Connection.CtString);
    }
}
