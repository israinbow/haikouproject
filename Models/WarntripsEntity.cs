using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class WarntripsEntity
    {
        public int RECID { get; set; }
        public string LWSTYPE { get; set;}
        public string LWSLEVEL { get; set; }
        public string SMSTRIPS { get; set; }
        public string MINILOGTRIPS { get; set;}
        public string TRAFFICTRIPS { get; set; }
        public string LEDTRIPS { get; set; }
        public string MINITRIP { get; set; }
        public string CARTRIPS { get; set; }
        public string CONTENTS { get; set; }
    }
    public class FlagtypeEntity
    {
        public int RECID {get;set;}
        public string TYPENAME { get; set; }
        public string LEVELNAME { get; set; }
        public int FLAGINDEX { get; set; }
        public string SUBTITLES { get; set; }
        public int REMARKS { get; set; }
        public string RADIOTIMES { get; set; }
        public string SIGNMEANS { get; set; }
        public string DEFENCEMETHOD { get; set; }
        public string DEFENCEMETHODEN { get; set; }
        public string CONTACT { get; set; }
        public string DEFENCEMETHODWEB { get; set; }

    }
}
