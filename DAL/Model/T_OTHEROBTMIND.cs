using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class T_OTHEROBTMIND : OBTMIND
    {
        public static Access<T_OTHEROBTMIND> Tunnel = new Access<T_OTHEROBTMIND>(Connection.CtString);
    }
}
