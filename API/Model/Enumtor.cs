using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API.Model
{
    /// <summary>
    /// 自动站地区分类，全国，广东，深圳
    /// </summary>
    public enum OBTArea
    {
        OTHER=0, LOCAL = 1
    }
    /// <summary>
    /// 自动站位置分类,陆地，高地,沿海，海洋
    /// </summary>
    public enum OBTSite
    {
        Land = 0, HighLand = 1, Coastal = 2, Sea = 3
    }
    /// <summary>
    /// 自动站类型分类，陆地，海岛，浮标，石油平台，船舶
    /// </summary>
    public enum OBTType
    {
        land = 0, Island = 1, buoy = 2, oil = 3, boat = 4
    }
}
