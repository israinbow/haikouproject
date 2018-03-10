using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    //降水概率
    public class RainProbabilityEntity
    {
        public DateTime Ddatetime { get; set; }

        public int AWSCount { get; set; }

        public double Probability { get; set; }
    }
}
