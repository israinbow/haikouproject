using API.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API
{
    public class Stats
    {
        static double[] temperatureSacle = new double[] { -5, 0, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 35, 36, 38, 40 };
        static double[] rainSacle = new double[] { 0,0.1,0.5,1,2,5,10,15,20,30,40,50,60,80,100,120,130,150,300,600 };
        static double[] humSacle = new double[] { 0, 30,50,60, 65,70,75,80,85,90,95};
        static double[] preSacle = new double[] { 850, 900, 920, 940, 950, 960, 980, 990, 1000, 1010, 1020,1030 };
        static double[] windSacle = new double[] { 0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7, 37, 41.5, 46.2, 51, 56.1, 61.2 };
        public static StatsReport getAwsStatis(AWDType type, List<AWSFieldValue> awsFields, string[] citys)
        {
            double[] scale = null;
            if (type == AWDType.TEP) scale = temperatureSacle;
            else if (type == AWDType.RAIN) scale = rainSacle;
            else if (type == AWDType.HUM) scale = humSacle;
            else if (type == AWDType.PRE) scale = preSacle;
            else if (type == AWDType.WIND) scale = windSacle;
            else return null;

            double[] counts = new double[scale.Length];
            double maxValue = double.MinValue, minValue = double.MaxValue;
            foreach (AWSFieldValue field in awsFields)
            {
                if (field.V0 > maxValue) maxValue = field.V0;
                else if (field.V0 < minValue) minValue = field.V0;
                bool jump = false;
                for (int i = 0; i < scale.Length; i++)
                {
                    if (field.V0 >= scale[i])
                        continue;
                    counts[i == 0 ? 0 : i - 1]++;
                    jump = true;
                    break;
                }
                if (!jump)
                    counts[counts.Length - 1]++;
            }
            return new StatsReport()
            {
                itemCount = counts,
                maxValue = maxValue,
                minValue = minValue
            };
        }
    }
    public class StatsReport
    {
        public double minValue { set; get; }
        public double maxValue { set; get; }
        public double[] itemCount { set; get; }
    }
}
