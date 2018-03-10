using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class CommutingForecastModel
    {
        public class GridWeatherInfo
        {
            public int GridID { get; set; }
            public int Recid { get; set; }
            public string RoadName { get; set; }//坐标上对应道路名称
            //public double X { get; set; }//经度
            //public double Y { get; set; }//纬度
            public double X1 { get; set; }
            public double Y1 { get; set; }
            public double X2 { get; set; }
            public double Y2 { get; set; }
            public double Z { get; set; }
            //public DateTime Date { get; set; }//发布时间
           // public double Temperature { get; set; }//温度
            //public double Wdidf { get; set; }//风力
            //public double R01h { get; set; }
            //public double R03h { get; set; }
            //public double R06h { get; set; }
            //public double R24h { get; set; }
            //public string Wdir { get; set; }//风向
            //public double Vkm { get; set; }//能见度 公里
        }
    }
}
