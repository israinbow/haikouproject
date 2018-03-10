using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API.Model
{
    public class OBTCODE:DAL.T_OBTCODE_NEW
    {
        [DbColumn(ColumnName = "CITY")]
        public new string AREAID { set; get; }      
        /// <summary>
        /// 自动站地区分类，全国，广东，深圳
        /// </summary>
        [DbColumn(Ignore = true)]
        public OBTArea AREA { set; get; }
        [DbColumn(Ignore = true)]
        public OBTType TYPE { set; get; }

        public new static Access<OBTCODE> Tunnel = new Access<OBTCODE>(Connection.CtString, "T_OBTCODE_NEW");
    }
}
