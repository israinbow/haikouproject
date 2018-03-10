using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class ObtcodeEntity
    {
        public string OBTID { get; set; }
        public string AREAID { get; set; }
        public string AREAName { get; set; }
        public string OBTNAME { get; set; }
        public DateTime DDATETIME { get; set; }
        public double HOURR { get; set; }
        public double R01H { get; set; }
        public double R02H { get; set; }
        public double R03H { get; set; }
        public double WDIDF { get; set; }
        public double WD10DF { get; set; }
        public int W_STAT { get; set; }
        public int R_STAT { get; set; }
    }
}
