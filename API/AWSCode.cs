using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DAL;
using System.Data.OracleClient;
using System.Data;
using System.Timers;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using API.Model;

namespace API
{
    public class AWSCode
    {
        protected static Dictionary<string, AWSInfo> _chinaAWS;
        protected static Dictionary<string, OBTCODE> _HKAws;
        protected static Dictionary<string, OBTCODE> _OBTCodeList;
        /// <summary>
        /// 国家气象站列表
        /// </summary>
        public static Dictionary<string, AWSInfo> ChinaAWS
        {
            get
            {
                if (_chinaAWS == null)
                {
                    string cnw = "[{'id':'59473','name':'鹤山','lng':112.967,'lat':22.767},{'id':'59673','name':'上川','lng':112.767,'lat':21.733},{'id':'59279','name':'三水','lng':112.867,'lat':23.183},{'id':'59480','name':'顺德','lng':113.25,'lat':22.85},{'id':'59469','name':'阳春','lng':111.783,'lat':22.167},{'id':'59754','name':'徐闻','lng':110.183,'lat':20.333},{'id':'59750','name':'雷州','lng':110.067,'lat':20.967},{'id':'59650','name':'遂溪','lng':110.25,'lat':21.4},{'id':'59654','name':'廉江','lng':110.3,'lat':21.633},{'id':'59656','name':'吴川','lng':110.817,'lat':21.4},{'id':'59655','name':'化州','lng':110.617,'lat':21.65},{'id':'59653','name':'高州','lng':110.85,'lat':21.933},{'id':'59456','name':'信宜','lng':110.933,'lat':22.35},{'id':'59664','name':'电白','lng':110.983,'lat':21.533},{'id':'59276','name':'四会','lng':112.65,'lat':23.35},{'id':'59271','name':'广宁','lng':112.433,'lat':23.633},{'id':'59270','name':'怀集','lng':112.183,'lat':23.917},{'id':'59264','name':'封开','lng':111.517,'lat':23.4},{'id':'59269','name':'德庆','lng':111.783,'lat':23.167},{'id':'59268','name':'郁南','lng':111.533,'lat':23.25},{'id':'59462','name':'罗定','lng':111.6,'lat':22.7},{'id':'59470','name':'新兴','lng':112.2,'lat':22.7},{'id':'59088','name':'英德','lng':113.417,'lat':24.183},{'id':'59075','name':'阳山','lng':112.633,'lat':24.483},{'id':'59074','name':'连山','lng':112.15,'lat':24.567},{'id':'59071','name':'连南','lng':112.283,'lat':24.733},{'id':'59072','name':'连州','lng':112.367,'lat':24.8},{'id':'59087','name':'佛冈','lng':113.533,'lat':23.867},{'id':'59287','name':'广州','lng':113.483,'lat':23.217},{'id':'59488','name':'珠海','lng':113.583,'lat':22.283},{'id':'59312','name':'潮州','lng':116.7,'lat':23.667},{'id':'59289','name':'东莞','lng':113.733,'lat':22.967},{'id':'59288','name':'南海','lng':113.017,'lat':23.15},{'id':'59293','name':'河源','lng':114.683,'lat':23.733},{'id':'59298','name':'惠州','lng':114.367,'lat':23.067},{'id':'59476','name':'江门','lng':113.017,'lat':22.533},{'id':'59315','name':'揭阳','lng':116.4,'lat':23.583},{'id':'59659','name':'茂名','lng':110.917,'lat':21.75},{'id':'59117','name':'梅州','lng':116.067,'lat':24.283},{'id':'59280','name':'清远','lng':113.083,'lat':23.7},{'id':'59284','name':'花都区气象局观测站','lng':113.233,'lat':23.417},{'id':'59285','name':'从化市江埔街江头村','lng':113.6,'lat':23.567},{'id':'59500','name':'汕尾县海丰气象局观测站','lng':115.317,'lat':22.967},{'id':'59278','name':'肇庆','lng':112.45,'lat':23.033},{'id':'59485','name':'中山','lng':113.4,'lat':22.5},{'id':'59471','name':'云浮','lng':112.05,'lat':22.933},{'id':'59314','name':'普宁','lng':116.133,'lat':23.3},{'id':'59306','name':'揭西','lng':115.85,'lat':23.45},{'id':'59097','name':'新丰','lng':114.2,'lat':24.05},{'id':'57988','name':'乐昌','lng':113.35,'lat':25.15},{'id':'57989','name':'仁化','lng':113.767,'lat':25.067},{'id':'57996','name':'南雄','lng':114.25,'lat':25.083},{'id':'59090','name':'始兴','lng':114.067,'lat':24.95},{'id':'59094','name':'翁源','lng':114.117,'lat':24.35},{'id':'59081','name':'乳源','lng':113.267,'lat':24.783},{'id':'59096','name':'连平','lng':114.483,'lat':24.367},{'id':'59099','name':'和平','lng':114.933,'lat':24.45},{'id':'59107','name':'龙川','lng':115.283,'lat':24.117},{'id':'59304','name':'紫金','lng':115.183,'lat':23.633},{'id':'59114','name':'蕉岭','lng':116.167,'lat':24.65},{'id':'59116','name':'大埔','lng':116.7,'lat':24.333},{'id':'59310','name':'丰顺','lng':116.183,'lat':23.767},{'id':'59303','name':'五华','lng':115.75,'lat':23.917},{'id':'59109','name':'兴宁','lng':115.733,'lat':24.15},{'id':'59106','name':'平远','lng':115.9,'lat':24.583},{'id':'59297','name':'博罗','lng':114.283,'lat':23.183},{'id':'59492','name':'惠东','lng':114.7,'lat':22.917},{'id':'59290','name':'龙门','lng':114.233,'lat':23.733},{'id':'59502','name':'陆丰','lng':115.65,'lat':22.95},{'id':'59478','name':'台山','lng':112.783,'lat':22.25},{'id':'59475','name':'开平','lng':112.65,'lat':22.4},{'id':'59477','name':'恩平','lng':112.3,'lat':22.183},{'id':'59294','name':'增城','lng':113.833,'lat':23.333},{'id':'59481','name':'番禺','lng':113.317,'lat':22.933},{'id':'59487','name':'斗门','lng':113.3,'lat':22.233},{'id':'59318','name':'潮阳','lng':116.583,'lat':23.267},{'id':'59319','name':'澄海','lng':116.833,'lat':23.433},{'id':'59324','name':'南澳','lng':117.017,'lat':23.433},{'id':'59313','name':'饶平','lng':116.983,'lat':23.683},{'id':'59317','name':'惠来','lng':116.3,'lat':23.033},{'id':'59316','name':'汕头','lng':116.683,'lat':23.4},{'id':'59501','name':'汕尾','lng':115.367,'lat':22.8},{'id':'59082','name':'韶关','lng':113.6,'lat':24.683},{'id':'59663','name':'阳江','lng':111.967,'lat':21.833},{'id':'59658','name':'湛江','lng':110.3,'lat':21.15}]";
                    _chinaAWS = new JavaScriptSerializer().Deserialize<AWSInfo[]>(cnw).ToDictionary(c => c.id);
                }
                return _chinaAWS;
            }
        }
        /// <summary>
        /// 香港自动站
        /// </summary>
        public static Dictionary<string, OBTCODE> HongKongAws
        {
            get
            {
                if (_HKAws == null)
                    _HKAws = OBTCodeList.Where(t => t.Value.AREAID == "45005").ToDictionary(t => t.Key, t => t.Value);
                return _HKAws;
            }
        }      
        /// <summary>
        /// 自动站基本信息(缓存),key是OBTID
        /// </summary>
        public static Dictionary<string, OBTCODE> OBTCodeList
        {
            get
            {
                try
                {
                    if (_OBTCodeList == null)
                    {
                        List<OBTCODE> temp = OBTCODE.Tunnel.getList("LONGITUDE>0 ", queryByTable: true);
                        string[] costalSite = new string[] { "59865", "59490", "59681", "G3358", "G3359", "G6526", "G3212", "G5317", "59494", "G2422", "G5942", "59672", "59479", "59495", "G2310", "G1205", "G1201", "G1211", "G1207", "59682", "59683", "59680", "G1810", "G1091", "G7426", "G2304", "59311", "59503", "59504", "59511", "59513", "59667", "59668", "59669", "59674", "59751", "59755", "59759", "G1217", "G2424", "G7190", "G7492", "G2314", "59765", "59506" };
                        string[] seaSite = new string[] { "G3597", "G3598", "G3599", "G3358", "G3359" };
                        _OBTCodeList = temp.ToDictionary(r =>
                        {
                            if (r.OBTID == "G1018")
                                r.STNAME = "四会市威井镇威井圩";
                            if (r.OBTID == "G3668")
                            {
                                r.LONGITUDE = 114.6363;
                                r.LATITUDE = 22.46;
                            }
                            r.STNAME = Regex.Replace(r.STNAME, "\\s*", "");
                            //补充完善数据库信息
                            r.AREA = OBTArea.OTHER;
                            int areaid;
                            if (int.TryParse(r.AREAID, out areaid) && areaid > 5949300 && areaid < 5949312)
                                r.AREA = OBTArea.LOCAL;
                            if (costalSite.Contains(r.OBTID))
                            {
                                r.TYPE = OBTType.Island;
                            }
                            else if (seaSite.Contains(r.OBTID))
                            {
                                r.TYPE = OBTType.oil;
                            }
                            r.LONGITUDE = Math.Round(r.LONGITUDE, 5);
                            r.LATITUDE = Math.Round(r.LATITUDE, 5);
                            return r.OBTID;
                        });
                    }
                    return _OBTCodeList;
                }
                catch (Exception ex)
                {                    
                    ErrorLog.Write(ex);
                    throw ex;
                }
            }
        }
        /// <summary>
        /// 前端缓存自动站基本数据
        /// </summary>
        /// <returns></returns>
        public virtual string ClientCacheAWSJSON()
        {
            Dictionary<string, OBTCODE> allcode = OBTCodeList;
            StringBuilder sb = new StringBuilder("{");
            string[] level1 = new string[] { "G8323", "G8530", "G5006", "G1664", "G2851", "G2935", "G3423", "G1802", "G1647", "G1585", "G5320", "G2776", "G4622", "G8401", "G1624", "G1426", "G2770", "G1513", "G1524", "G1731", "G3748", "G8443", "G8541", "G4454", "G4567", "G4600", "G4710", "G5014", "G8906", "G1706", "G1656", "G8542", "G4451", "G1541", "G1560", "G1586", "G3766", "G3566", "G7026", "G3011", "G3727", "G1908", "G2774", "G2624", "G8500", "G4540", "G3082", "G2633", "G3067", "G2181", "G8017", "G8009", "G7021", "G7411", "G2531", "G2564", "G2502", "G2364", "G2520", "G7717", "G2353", "G2613", "G2662", "G2635", "g3055", "G7410", "G7432", "G7421", "G7465", "G7812", "G2546", "G2366", "G2321", "G6505", "G2345", "G3087", "G2643" };
            string[] level2 = new string[] { "G4501", "G1546", "G1535", "G1516", "G1583", "G1630", "G1626", "G1680", "G1653", "G1354", "G2807", "G2842", "G2971", "G1363", "G1420", "G4637", "G1543", "G4715", "G1567", "G1563", "G1576", "G1578", "G5322", "G2833", "G2975", "G2986", "G1625", "G1632", "G5104", "G5031", "G1687", "G1674", "G1654", "G1665", "G1667", "G1622", "G4524", "G1463", "G1444", "G1495", "G4669", "G5551", "G1743", "G1572", "G5449", "G1821", "G1815", "G1822", "G1840", "G1862", "G2945", "G2950", "G2938", "G2993", "G2920", "G1317", "G2811", "G2837", "G2803", "G2849", "G2852", "G2820", "G4525", "G4462", "G4546", "G4564", "G1493", "G4650", "G3319", "G1919", "G1986", "G1990", "G1901", "G3756", "G3556", "G3737", "G3541", "G5552", "G5553", "G5413", "G5441", "G5310", "G5313", "G5501", "G5511", "G1734", "G8458", "G2753", "G8509", "G2775", "G2780", "G4518", "G4603", "G4544", "G4407", "G4408", "G4639", "G1482", "G1483", "G4742", "G4646", "G1441", "G4461", "G1453", "G8055", "G2644", "G8215", "G8427", "G2725", "G2756", "G8448", "G2766", "G8538", "G2790", "G2781", "G1046", "G2641", "G8157", "G2611", "G8015", "G2615", "G2623", "G3424", "G2674", "G7023", "G6963", "G2222", "G6942", "G2237", "G3448", "G3204", "G3437", "G3124", "G1021", "G1060", "G2188", "G2157", "G6516", "G2165", "G2140", "G2136", "G2138", "G2131", "G2187", "G1207", "G2039", "G2061", "G2050", "G2368", "G2348", "G2322", "G3044", "G3045", "G3033", "G3024", "G3071", "G3002", "G7762", "G7765", "G2561", "G2317", "G2347", "G2367", "G2307", "G7190", "G2185", "G2570", "G2516", "G7911", "G2550", "G2533", "G7415", "G2465", "G2460", "G7816", "G7864", "G7867", "G7854", "G2538", "G2537", "G2535", "G2482", "G2444", "G7414", "G2476", "G2471", "G2462", "G2554", "G7464", "G7820", "G2454" };
            string[] level3 = new string[] { "G1343", "59512", "G2955", "G2974", "G2960", "G1571", "G1504", "G1510", "G1666", "G4718", "G1600", "G1655", "G5053", "G4714", "G1544", "G1440", "G4530", "G4606", "G4555", "G8404", "G8008", "G8211", "G7035", "G8508", "G3535", "G1830", "G1869", "G1868", "G5314", "G1573", "G5324", "G5549", "G1522", "G1084", "G1552", "G4520", "G4613", "G1605", "G1637", "G2841", "G2961", "G1371", "59511", "G1837", "G2350", "G2332", "G2532", "G2330", "G2318", "G3056", "59672", "G2153", "G6510", "G2365", "G3070", "G3034", "G3006", "G2642", "G8106", "G8261", "HKTWN", "G1090", "G6845", "G1017", "G2443", "G7417", "G7416", "G2484", "G7434", "G2480", "G2451", "G7461", "G2464", "G2455", "G2541", "G7469", "G7853", "G2352", "G2526", "G2562", "G2352", "G2161", "G2156", "G3048", "G3026" };
            foreach (var obt in allcode)
            {
                if (sb.Length > 1)
                    sb.AppendFormat(",");
                sb.AppendFormat("\"{0}\":", obt.Key);
                int viewLevel = 4;
                if (ChinaAWS.ContainsKey(obt.Key))
                    viewLevel = 0;
                else
                {
                    if (level1.Contains(obt.Key)) viewLevel = 1;
                    else if (level2.Contains(obt.Key)) viewLevel = 2;
                    else if (level3.Contains(obt.Key)) viewLevel = 3;
                }
                sb.AppendFormat("[{0},{1},\"{2}\",\"{3}\",{4},\"{5}]", obt.Value.LATITUDE, obt.Value.LONGITUDE, obt.Value.AREAID, obt.Value.STNAME, viewLevel,  (int)obt.Value.TYPE);
            }
            sb.Append("}");
            return sb.ToString();
        }
    }
}
