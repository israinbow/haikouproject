using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class SignalInfo
    {
        private DateTime issueTime;
        public DateTime IssueTime
        {
            get { return issueTime; }
            set { issueTime = value; }
        }
        private string signalType;
        public string SignalType
        {
            get { return signalType; }
            set { signalType = value; }
        }
        private int newNum;
        public int NewNum
        {
            get { return newNum; }
            set { newNum = value; }
        }

        public SignalInfo()
        {
        }
    }
}
