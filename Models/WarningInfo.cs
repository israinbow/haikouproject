using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class WarningInfo
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
        private int tnumber;
 
        public int Tnumber
        {
            get { return tnumber; }
            set { tnumber = value; }
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
        private string issueContent;
        
        public string IssueContent
        {
            get { return issueContent; }
            set { issueContent = value; }
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
        private string issueState;
        
        public string IssueState
        {
            get { return issueState; }
            set { issueState = value; }
        }
        private string newTime;
        
        public string NewTime
        {
            get { return newTime; }
            set { newTime = value; }
        }
        private string diff;
        
        public string Diff
        {
            get { return diff; }
            set { diff = value; }
        }
        
        public int Diffint
        {
            get;
            set;
        }
        
        public int CountA1 { set; get; }
        
        public int CountA2 { set; get; }
        
        public int CountB1 { set; get; }
        
        public int CountB2 { set; get; }
        
        public int CountA { set; get; }
        
        public int CountB { set; get; }
        
        public int ID { set; get; }
        
        public int Count { set; get; }
        
        public string CONTENTSEN { set; get; }
        
        public string CONTACT { set; get; }
        public WarningInfo()
        {
        }
    }
}
