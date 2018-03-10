using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class TripstypeEntity
    {
        
        public int RECID { get; set; }
        
        public string TYPENAME { get; set; }
        
        public string CONTENTS { get; set; }
        
        public string SHOWNAME { get; set; }
        
        public string GROPIDS { get; set; }
        
        public string GROPIDSName { get; set; }
        
        public int ISSMS { get; set; }
        
        public int ISWEB { get; set; }
        
        public int ISBLOG { get; set; }
        
        public string WROTE { get; set; }
    }
}
