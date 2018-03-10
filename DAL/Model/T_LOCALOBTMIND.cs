using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class T_LOCALOBTMIND : OBTMIND
    {
        public static Access<T_LOCALOBTMIND> Tunnel = new Access<T_LOCALOBTMIND>(Connection.CtString);
    }
}
