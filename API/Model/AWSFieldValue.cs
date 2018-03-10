using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API.Model
{
    public struct AWSFieldValue
    {
        public DateTime? TM { set; get; }
        public string ID { set; get; }
        public double V0 { set; get; }
        public double V1 { set; get; }

        public int x { set; get; }
        public int y { set; get; }
    }
}
