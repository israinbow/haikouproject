using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class WarningStstistics
    {
        //次数
        public String color { get; set; }   //颜色
        public int qscount { get; set; }       //全市数量
        public int fqcount { get; set; }    //分区数量
        public int sum { get; set; }         //总数
        //时长（分钟）
        public string time_color { get; set; }
        public int time_qscount { get; set; }
        public int time_fqcount { get; set; }
        public int time_sum { get; set; }
    }
}
