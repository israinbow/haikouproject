using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Models
{
    public class UserEntity
    {
        public string USERNAME { get; set; }
        public string UPASSWORD { get; set; }
        public string UPRIVATE { get; set; }
        public string SYSPRIVATE { get; set; }
        public string GROUPNAME { get; set; }
    }
}
