using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class T_TyforecastEntity
    {
        public string TCNO { get; set; }
        public string Cname { get; set; }
        public string Longitude { get; set; }
        public string Latitude { get; set; }
        public string Issuedate { get; set; }
        public string AIRPRESSURE { get; set; }
        public string WIND { get; set; }
        public string MOVEDIR { get; set; }
        public string MOVESPEED { get; set; }
    }
}
