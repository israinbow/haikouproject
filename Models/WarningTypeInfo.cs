using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    //预警信号类型
    public class WarningTypeInfo
    {
        private DateTime issueTime;

        public DateTime IssueTime
        {
            get { return issueTime; }
            set { issueTime = value; }
        }
        private string warningType;

        public string WarningType
        {
            get { return warningType; }
            set { warningType = value; }
        }
        private int newNum;

        public int NewNum
        {
            get { return newNum; }
            set { newNum = value; }
        }

        public WarningTypeInfo()
        {
        }
    }
}
