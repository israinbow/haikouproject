using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    //系统信息
    public class LWSTripsInfo
    {

        public string DDateTimestr { get; set; }
        private DateTime ddatetime;

        public DateTime DDATETIME//发布时间，精确到时
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }

        private string level;

        public string W_LEVEL//类别
        {
            get { return level; }
            set { level = value; }
        }

        private string typeindex;

        public string W_TYPE//类别
        {
            get { return typeindex; }
            set { typeindex = value; }
        }

        private string city;

        public string CITY//街道办
        {
            get { return city; }
            set { city = value; }
        }
        private string tripcontent;

        public string W_CONTENT//内容
        {
            get { return tripcontent; }
            set { tripcontent = value; }
        }
        //private int triptype;
         
        //public int TripType//数据类别
        //{
        //    get { return triptype; }
        //    set { triptype = value; }
        //}

        //private int usetype;
         
        //public int UseType//是否启用
        //{
        //    get { return usetype; }
        //    set { usetype = value; }
        //}

        public int STATE { get; set; }

        public LWSTripsInfo()
        {
        }

    }
}
