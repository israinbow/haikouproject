using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class WarningEntity
    {
        public string CITY { get; set; }
        public string W_TYPE { get; set; }
        public string W_LEVEL { get; set; }
        public DateTime DDATETIME { get; set; }
        //public string W_DEFENSE { get; set; }
        public string W_ICONNAME { get; set; }
        //public string STATE { get; set; }
        //public string CRTTIME { get; set; }
        public string W_CONTENT { get; set; } 
    }
}
