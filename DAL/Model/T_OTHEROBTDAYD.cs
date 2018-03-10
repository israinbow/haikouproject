using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{  
    /// <summary>
    /// 广东省和香港自动站日统计数据表
    /// </summary>
    public class T_OTHEROBTDAYD : OBTDAYD
    {
        public static Access<T_OTHEROBTDAYD> Tunnel = new Access<T_OTHEROBTDAYD>(Connection.CtString);
    }
}