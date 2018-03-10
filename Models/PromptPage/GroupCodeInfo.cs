using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class GroupCodeInfo
    {
        private string mainName;

        public string MainName
        {
            get { return mainName; }
            set { mainName = value; }
        }
        private List<string> nameList;
        public List<string> NameList
        {
            get { return nameList; }
            set { nameList = value; }
        }

        private List<string> codeList;
        public List<string> CodeList
        {
            get { return codeList; }
            set { codeList = value; }
        }
        private List<bool> isCheckList;
        public List<bool> IsCheckList
        {
            get { return isCheckList; }
            set { isCheckList = value; }
        }
        public GroupCodeInfo()
        {
        }
    }
}
