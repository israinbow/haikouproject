using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    //系统设置页面配置信息实体
    public class LWSSETTING
    {
        private string mESSAGEPATH;
        
        public string MESSAGEPATH
        {
            get { return mESSAGEPATH; }
            set { mESSAGEPATH = value; }
        }
        private string mESSAGEUSER;
        
        public string MESSAGEUSER
        {
            get { return mESSAGEUSER; }
            set { mESSAGEUSER = value; }
        }
        private string mESSAGEPASSWORD;
        
        public string MESSAGEPASSWORD
        {
            get { return mESSAGEPASSWORD; }
            set { mESSAGEPASSWORD = value; }
        }
        private string mCCPORT;
        
        public string MCCPORT
        {
            get { return mCCPORT; }
            set { mCCPORT = value; }
        }
        private string uNCPORT;
        
        public string UNCPORT
        {
            get { return uNCPORT; }
            set { uNCPORT = value; }
        }
        private string tVWORDPATH;
        
        public string TVWORDPATH
        {
            get { return tVWORDPATH; }
            set { tVWORDPATH = value; }
        }
        private int sTARTCODE;
        
        public int STARTCODE
        {
            get { return sTARTCODE; }
            set { sTARTCODE = value; }
        }
        private int pROJECT;
        
        public int PROJECT
        {
            get { return pROJECT; }
            set { pROJECT = value; }
        }

        public LWSSETTING()
        {
        }

    }
}
