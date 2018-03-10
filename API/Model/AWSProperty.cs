using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API.Model
{
   
    /// <summary>
    /// 气像站要素
    /// </summary>
    public enum OBTField
    {
        DDATETIME,
        T, MAXT, MINT, AVGT,MINTTIME,MAXTTIME, TOFFSET01H, TOFFSET03H, TOFFSET24H,
        HOURR, R06M, R12M, R30M, R01H, R02H, R03H, R06H, R12H, R24H, R48H, R72H,
        U, MAXU, MINU, AVGU, MAXUTIME, MINUTIME,
        P, MAXP, MINP, AVGP, MAXPTIME, MINPTIME, P0, POFFSET01H, POFFSET03H, POFFSET24H,
        V, MINV, MINVTIME,
        WDIDF, WDIDD, WD2DF, WD2DD, WD10DF, WD10DD, WD10MAXDF, WD10MAXDD, WD10MAXTIME, WD3SMAXDF, WD3SMAXDD, WD3SMAXTIME

    }
    /// <summary>
    /// 国家站还是区域站
    /// </summary>
    public enum AWSAdmin
    {
        all,state,city
    }
    /// <summary>
    /// 分钟实时，小时统计，日统计
    /// </summary>
    public enum TimeMode
    {
        MINUTE,HOUR,DAY
    }
    public enum AWDType {
        WIND, TEP, RAIN, HUM, PRE, VIS
    }
}
