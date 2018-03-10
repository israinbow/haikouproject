using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class T_LOCALOBTDAYD : OBTDAYD
    {
        public static Access<T_LOCALOBTDAYD> Tunnel = new Access<T_LOCALOBTDAYD>(Connection.CtString);
    }
}
