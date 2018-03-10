using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;

namespace DAL
{
    public class Connection
    {
        public static string CtString
        {
            get
            {
                return ConfigurationManager.ConnectionStrings["SZYM"].ConnectionString;
            }
        }
    }
}
