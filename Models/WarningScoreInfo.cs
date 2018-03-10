using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class WarningScoreInfo
    {
        private string recid;
        public string Recid
        {
            get { return recid; }
            set { recid = value; }
        }

        private DateTime issueTime;
        public DateTime IssueTime
        {
            get { return issueTime; }
            set { issueTime = value; }
        }
        private DateTime cancelTime;
        public DateTime CancelTime
        {
            get { return cancelTime; }
            set { cancelTime = value; }
        }

        private string signalType;
        public string SignalType
        {
            get { return signalType; }
            set { signalType = value; }
        }
        private string signalLevel;
        public string SignalLevel
        {
            get { return signalLevel; }
            set { signalLevel = value; }
        }

        private string district;
        public string District
        {
            get { return district; }
            set { district = value; }
        }
        private string underWriter;
        public string UnderWriter
        {
            get { return underWriter; }
            set { underWriter = value; }
        }
        private double rightPer;
        public double RightPer
        {
            get { return rightPer; }
            set { rightPer = value; }
        }
        private double tsPer;
        public double TSPer
        {
            get { return tsPer; }
            set { tsPer = value; }
        }
        private double nullPer;
        public double NullPer
        {
            get { return nullPer; }
            set { nullPer = value; }
        }
        private string lostPer;
        public string LostPer
        {
            get { return lostPer; }
            set { lostPer = value; }
        }
        private double pretimes;
        public double PreTimes
        {
            get { return pretimes; }
            set { pretimes = value; }
        }
        private double syspretimes;
        public double SysPreTimes
        {
            get { return syspretimes; }
            set { syspretimes = value; }
        }
        private string systimes;
        public string SysTimes
        {
            get { return systimes; }
            set { systimes = value; }
        }

        public WarningScoreInfo()
        {
        }
    }
}
