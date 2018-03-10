using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class UserInfo
    {
        private string userName;
        public string UserName
        {
            get { return userName; }
            set { userName = value; }
        }

        private string uPassword;
        public string UPassword
        {
            get { return uPassword; }
            set { uPassword = value; }
        }

        public UserInfo()
        {
        }
    }
}
