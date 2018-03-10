using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class ScoreInfo
    {
        //时间 
        private string scoreName;
        public string ScoreName
        {
            get { return scoreName; }
            set { scoreName = value; }
        }
        private double sendcount;
        public double SendCount
        {
            get { return sendcount; }
            set { sendcount = value; }
        }
        private double transmitcount;
        public double TransmitCount
        {
            get { return transmitcount; }
            set { transmitcount = value; }
        }
        private double commentcount;
        public double CommentCount
        {
            get { return commentcount; }
            set { commentcount = value; }
        }


        private string wbtype;
        public string WBType
        {
            get { return wbtype; }
            set { wbtype = value; }
        }

        public ScoreInfo()
        {
        }
    }
}
