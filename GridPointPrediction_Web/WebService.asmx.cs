using BLL;
using Common;
using DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Windows.Forms;
using System.Web.Security;
using Models;
using API.Model;
using API;
using System.Configuration;


namespace GridPointPrediction_Web
{

    /// <summary>
    /// WebService 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。 
    [System.Web.Script.Services.ScriptService]
    public class WebService : System.Web.Services.WebService
    {
        public static string dataTime = string.Empty;
        public static string WeatherValue = string.Empty;
        public static string WeatherFuture = string.Empty;
        public static string weather = string.Empty;

        public static string Todaydate = string.Empty;
        public static string TodayWeather = string.Empty;
        public static string TodayDetil = string.Empty;
        public static string html = string.Empty;
        public static string Todaysrc = string.Empty;
        public static string foreaceUser = string.Empty;
        public string foreaceDate;

        public static WelfareForecastInfo dataList;
        public static DecisionForecastInfo decisionList;
        public static SpringForecastModel springList;
        public static TrafficForecastModel trafficList;
        public static List<WelfareForecastInfo> dicinfoList = null;
        public static List<SpringForecastModel> springinfoList = null;
        public static List<TrafficForecastModel> trafficinfoList = null;
        public static List<weather> Ldic = null;
        public static List<springweather> Sdic = null;
        public static List<trafficweather> Tdic = null;
        public static Common.LiveForecastModel.LiveForecastInfo LiveList=new LiveForecastModel.LiveForecastInfo();
        public static Common.LiveForecastModel.LiveForecastTBInfo LiveTBList=new LiveForecastModel.LiveForecastTBInfo();

        public static Common.NationalForecastModel.NationalForecastInfo NationalList=new Common.NationalForecastModel.NationalForecastInfo();
        public static Common.NationalForecastModel.NationalForecastTBInfo NationalTBlist=new Common.NationalForecastModel.NationalForecastTBInfo();

        public static Common.GaokaoForecastModel.GaokaoForecastInfo GaokaoList = new Common.GaokaoForecastModel.GaokaoForecastInfo();
        public static Common.GaokaoForecastModel.GaokaoForecastTBInfo GaokaoTBlist = new Common.GaokaoForecastModel.GaokaoForecastTBInfo();

        public static Common.ZhongkaoForecastModel.ZhongkaoForecastInfo ZhongkaoList = new Common.ZhongkaoForecastModel.ZhongkaoForecastInfo();
        public static Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo ZhongkaoTBlist = new Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo();

        public static Common.SpringFestivalModel.SpringFestivalInfo SpringList = new Common.SpringFestivalModel.SpringFestivalInfo();
        public static Common.SpringFestivalModel.SpringFestivalTBInfo SpringTBList = new Common.SpringFestivalModel.SpringFestivalTBInfo();

        public static Common.DuanwuForecastModel.DuanwuForecastInfo DuanwuList = new Common.DuanwuForecastModel.DuanwuForecastInfo();
        public static Common.DuanwuForecastModel.DuanwuForecastTBInfo DuanwuTBList = new Common.DuanwuForecastModel.DuanwuForecastTBInfo();

        public static Common.GovtForecastModel.GovtForecastInfo GovtList=new Common.GovtForecastModel.GovtForecastInfo();
        public static Common.GovtForecastModel.GovtForecastTBInfo GovtTBList = new Common.GovtForecastModel.GovtForecastTBInfo();

        public static Common.FarmForecastModel.FarmForecastInfo FarmList = new Common.FarmForecastModel.FarmForecastInfo();
        public static Common.FarmForecastModel.FarmForecastTBInfo FarmTBList = new Common.FarmForecastModel.FarmForecastTBInfo();

        public static string weatherValue = string.Empty;
        public static string weatherFuture = string.Empty;

        [WebMethod]
        public string HelloWorld()
        {
            return "Hello World";
        }
        #region zhangchengzhi
        [WebMethod(Description = "获取最新事件")]
        public void GetNewTime()
        {
            Context.Response.Write(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            Context.Response.End();
        }
        [WebMethod(Description = "登录")]
        public void IsLogin(string username, string password)
        {
            Context.Response.Write(CommutingForecast.IsLogin(username, password));
            Context.Response.End();
        }
        #region
        /// <summary>
        /// 判断系统用户是否存在，用户名和密码是否正确
        /// </summary>
        /// <param name="name">用户名</param>
        /// <param name="pwd">密码</param>
        [WebMethod(Description = "判断系统用户是否存在，用户名和密码是否正确")]
        public void exitSysUser(string username, string password)
        {
            string result = "1";
            if (CommutingForecast.IsLogin(username, password) != 0)
            {
                //Form表单验证-写入cookie
                FormsAuthenticationTicket ticket = new FormsAuthenticationTicket
                    (
                        1,
                        username,
                        DateTime.Now,
                        DateTime.Now.AddMinutes(2),
                        true,
                        result,
                        "/"
                    );
                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
                cookie.HttpOnly = true;
                Context.Response.Cookies.Add(cookie);
            }
            else
            {
                result = "0";
            }
            Context.Response.Write(result);
            Context.Response.End();
        }
        /// <summary>
        /// 退出登录，用空值覆盖原cookies
        /// </summary>
        [WebMethod(Description = "退出登录")]
        public void sysUserLogOut()
        {
            HttpCookie cookie1 = new HttpCookie(FormsAuthentication.FormsCookieName, "");
            cookie1.Expires = DateTime.Now.AddYears(-1);
            Context.Response.Cookies.Add(cookie1);
        }
        /// <summary>
        /// 测试用户是否登录
        /// </summary>
        [WebMethod(Description = "测试用户是否登录")]
        public void isLogin()
        {
            try
            {
                var cookie = Context.Request.Cookies[FormsAuthentication.FormsCookieName];
                var ticket = FormsAuthentication.Decrypt(cookie.Value);
                string name = ticket.Name;
                string result = string.Empty;
                Context.Response.Write(name);
                Context.Response.End();
            }
            catch (Exception ee)
            {
                // throw ee;
            }
        }
        #endregion
        [WebMethod(Description = "获取预报员信息")]
        public void GetUserInfo()
        {
            //return JsonHelper.Serialize(DALGridDatas.GetGridDatas());
            Context.Response.Write(JsonHelper.Serialize(CommutingForecast.GetUserInfo()));
            Context.Response.End();
        }
        /// <summary>
        /// 格点预报模块
        /// </summary>
        /// <param name="IsFirstLoad"></param>
        /// <param name="model"></param>
        /// <param name="ybsx"></param>
        [WebMethod(Description = "获取格点数据")]
        public void GetGridDatas(string NewTime, string model, string ybsx, string savetype, string username)
        {
            //return JsonHelper.Serialize(DALGridDatas.GetGridDatas());
            //string ddd = JsonHelper.Serialize(DALGridDatas.GetGridDatas(NewTime, model, ybsx));
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.GetGridDatas_New(NewTime, model, ybsx, savetype, username)));
            Context.Response.End();
        }
        [WebMethod(Description = "保存格点数据")]
        public void Savegriddata(string type, string griddata, string username)
        {
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.Savegriddata(type, griddata, username)));
            Context.Response.End();
        }
        [WebMethod(Description = "获取自动站站点数据")]
        public void GetobtcodeDatas(string type)
        {
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.GetobtcodeDatas(type)));
            Context.Response.End();
        }
        [WebMethod(Description = "获取自动站站点数据")]
        public void DrawGridsImg(string vluesname, string strdt, string strtime)
        {
            DataTable dt = JsonHelper.Deserialize<DataTable>(strdt);
            DateTime time = DateTime.Parse(strtime);
            Context.Response.Write((DALGridDatas.DrawGridsImg(vluesname, dt, time)));
            Context.Response.End();
        }
        [WebMethod(Description = "获取格点包含的自动站站点")]
        public void GetGridContainObtid(string bounds, int ybsx, string foretime, string gridelement)
        {
            DateTime _foretime = DateTime.Parse(foretime);
            float[][] _bounds = JsonHelper.Deserialize<float[][]>(bounds);
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.GetGridContainObtid(_bounds, ybsx, _foretime, gridelement)));
            Context.Response.End();
        }
        [WebMethod(Description = "获取全部格点评分")]
        public void GetALLGridContainPF(string foretime, string forecaster)
        {
            DateTime _foretime = DateTime.Parse(foretime);
            Context.Response.Write(DALGridDatas.GetALLGridContainPF(_foretime, forecaster));
            Context.Response.End();
        }

        [WebMethod(Description = "获取预报员本月已制作的预报次数")]
        public void GetCountByName(string userName)
        {
            Context.Response.Write(DALGridDatas.GetCountByName(userName));
            Context.Response.End();
        }

        [WebMethod(Description = "获取预报员本月已制作的预报记录")]
        public void GetForecastRecord(string Name)
        {
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.GetForecastRecord(Name)));
            Context.Response.End();
        }


        [WebMethod(Description = "得到海口市的预报")]
        public void GetSZForecastTXT(string strdt, int dayHour)
        {
            DateTime dt = DateTime.Parse(strdt);
            //return JsonHelper.Serialize(DALGridDatas.GetGridDatas());
            Context.Response.Write(JsonHelper.Serialize(CommutingForecast.GetSZForecastTXT(dt, dayHour)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取自动站数据")]
        public void GetAwsDatas(string strdt, string valuesname)
        {
            DateTime ddatetime = DateTime.Parse(strdt);
            Context.Response.Write(JsonHelper.Serialize(CommutingForecast.GetAwsDatas(ddatetime, valuesname)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取道路实况据")]
        public void GetRainGridWeatherInfoList(string strdt, string valuesname)
        {
            DateTime ddatetime = DateTime.Parse(strdt);
            Context.Response.Write(JsonHelper.Serialize(CommutingForecast.GetRainGridWeatherInfoList(ddatetime, valuesname)));
            Context.Response.End();
        }

        #endregion
        // <summary>
        /// 格点预报模块
        /// </summary>
        /// <param name="IsFirstLoad"></param>
        /// <param name="model"></param>
        /// <param name="ybsx"></param>
        [WebMethod(Description = "获取单个格点数据走势")]
        public void GetGridHchartsDatas(string datetime, string gridindex, string model, string value)
        {
            //return JsonHelper.Serialize(DALGridDatas.GetGridDatas());
            Context.Response.Write(JsonHelper.Serialize(DALGridDatas.GetGridHchartsDatas(datetime, gridindex, model, value)));
            Context.Response.End();
        }

        #region 精细化城镇预报逐12小时

        CityForecast12HourBLL CityFBLL = new CityForecast12HourBLL();
        public DateTime GetForecastTime(string ForecastId)
        {
            DateTime dt = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd 08:00"));
            try
            {
                DateTime dtN = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                switch (ForecastId)
                {
                    case "Forecast6":
                    case "Forecast10":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 08:00"));
                        break;
                    case "Forecast15":
                    case "Forecast16":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 20:00"));
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {

            }
            return dt;
        }

        public DateTime GetORigreCurrentForecastNameTime(string ForecastId, string DtPage)
        {
            DateTime dt = DateTime.Parse(DtPage + " 08:00");
            try
            {
                DateTime dtN = DateTime.Parse(dt.ToString("yyyy-MM-dd HH:mm:ss"));
                switch (ForecastId)
                {
                    case "Forecast6":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 06:00"));
                        break;
                    case "Forecast10":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 08:00"));
                        break;
                    case "Forecast15":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 15:00"));
                        break;
                    case "Forecast16":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 20:00"));
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {

            }
            return dt;
        }

        public DateTime GetCurrentForecastNameTime(string ForecastId, string DtPage)
        {
            DateTime dt = DateTime.Parse(DtPage + " 10:00");
            try
            {
                DateTime dtN = DateTime.Parse(dt.ToString("yyyy-MM-dd HH:mm:ss"));
                switch (ForecastId)
                {
                    case "Forecast6":
                        dt = DateTime.Parse(dtN.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                        break;
                    case "Forecast10":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 08:00"));//xgq修改
                        break;
                    case "Forecast15":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 11:00"));
                        break;
                    case "Forecast16":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 20:00"));//xgq修改
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {

            }
            return dt;
        }
        //zhou添加
        public DateTime Get12CurrentForecastNameTime(string ForecastId, string DtPage)
        {
            DateTime dt = DateTime.Parse(DtPage + " 10:00");
            try
            {
                DateTime dtN = DateTime.Parse(dt.ToString("yyyy-MM-dd HH:mm:ss"));
                switch (ForecastId)
                {
                    case "Forecast6":
                        dt = DateTime.Parse(dtN.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                        break;
                    case "Forecast10":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 08:00"));//xgq修改
                        break;
                    case "Forecast15":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 16:00"));
                        break;
                    case "Forecast16":
                        dt = DateTime.Parse(dtN.ToString("yyyy-MM-dd 20:00"));//xgq修改
                        break;
                    default:
                        break;
                }
            }
            catch (Exception)
            {

            }
            return dt;
        }

        [WebMethod(Description = "获取当前值班预报员")]
        public string Get12HourForecaster(string ForecastId, string DtPage)
        {
            string ForecastName = "";
            try
            {
                DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
                ForecastName = CityFBLL.Get12HourForecastName(dt);
            }
            catch (Exception)
            {
            }
            return ForecastName;
        }

        [WebMethod(Description = "获取所有预报员名称")]
        public List<string> GetAllUserName()
        {
            List<string> UserName = new List<string>();
            try
            {
                List<Common.UserInfo> UserInfoAll = CityFBLL.GetHour12UserInfo();
                if (UserInfoAll != null && UserInfoAll.Count > 0)
                {
                    for (int i = 0; i < UserInfoAll.Count; i++)
                    {
                        UserName.Add(UserInfoAll[i].UserName);
                    }
                }
            }
            catch (Exception)
            { }
            return UserName;
        }

        [WebMethod(Description = "判断输入的密码是否匹配成功")]
        public bool JudgeUserOrPwd(string UserName, string UserPwd)
        {
            bool User_Pwd = false;
            try
            {
                List<Common.UserInfo> UserInfoAll = CityFBLL.GetHour12UserInfo();
                for (var i = 0; i < UserInfoAll.Count; i++)
                {
                    if (UserInfoAll[i].UserName == UserName)
                    {
                        if (UserInfoAll[i].UPassword == UserPwd)
                        {
                            User_Pwd = true;
                        }
                        else
                        {
                            User_Pwd = false;
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return User_Pwd;
        }

        [WebMethod(Description = "七天预报数据（逐12小时）")]
        public List<WelfareForecastInfo> Get12HourForecastInfo(string AreaName, string ForecastId, string DtPage)
        {
            DateTime dt = DateTime.Now;
            if (AreaName == "琼山区")
                dt = Get12CurrentForecastNameTime(ForecastId, DtPage); //zhou修改
            else
                dt = GetORigreCurrentForecastNameTime(ForecastId, DtPage);
            return CityFBLL.Get12HourForecastInfo(dt, AreaName);
        }

        [WebMethod(Description = "获取数据验证提醒")]
        public string GetDataMes(string AreaName, string ForecastId, string DtPage)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            return CityFBLL.GetDataMes(dt, AreaName);
        }


        [WebMethod(Description = "获取历史上网文件")]
        public List<Common.ScoreInfo> GetHour12InfoListS(string StartDt, string EndDt, int Max, int Min)
        {
            return CityFBLL.GetHour12InfoList(StartDt, EndDt, Max, Min);
        }

        [WebMethod(Description = "获取历史上网文件总条数")]
        public int GetHour12InfoListCountS(string StartDt, string EndDt)
        {
            return CityFBLL.GetHour12InfoListCount(StartDt, EndDt);
        }



        [WebMethod(Description = "获取上网文件")]
        public string ShowPreviewWeb(string ForecastId, string DtPage, int isCorrect)
        {
            DateTime DDateTime = GetCurrentForecastNameTime(ForecastId, DtPage);
            return CityFBLL.ShowPreviewWeb(DDateTime, isCorrect);
        }


        [WebMethod(Description = "获取上网文件")]
        public string ShowPreviewWeb2(string ForecastId, int isCorrect, string DtPage, string hourInfo)
        {
            List<WelfareForecastInfo> hourInfos1 = JsonHelper.Deserialize<List<WelfareForecastInfo>>(hourInfo);
            List<List<WelfareForecastInfo>> hourInfos = new List<List<WelfareForecastInfo>>();
            hourInfos.Add(hourInfos1);
            return CityFBLL.ShowPreviewWeb2(DtPage, isCorrect, hourInfos);
        }



        [WebMethod(Description = "上传入库")]
        public bool InsertHour12WeatherInfo(string ForecastId, string DtPage, string strForecaster, int isUser, int isCompany, int isCorrect, string hourInfo)
        {
            List<WelfareForecastInfo> hourInfos1 = JsonHelper.Deserialize<List<WelfareForecastInfo>>(hourInfo);
            List<List<WelfareForecastInfo>> hourInfos = new List<List<WelfareForecastInfo>>();
            hourInfos.Add(hourInfos1);

            DateTime dt = Get12CurrentForecastNameTime(ForecastId, DtPage);
            return CityFBLL.InsertHour12WeatherInfo(dt, strForecaster, isUser, isCompany, isCorrect, hourInfos);
        }
        [WebMethod(Description = "获取全市预报数据")]
        public List<List<List<WelfareForecastInfo>>> GetInfoAll(string ForecastId, string DtPage)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            return CityFBLL.GetInfoAll(dt);
        }

        #endregion

        #region 精细化城镇预报逐6小时


        CityForecast6HourBLL City6Hour = new CityForecast6HourBLL();


        [WebMethod(Description = "获取所有预报员名称")]
        public List<string> GetAll6HourUserName()
        {
            List<string> UserName = new List<string>();
            try
            {
                List<Common.UserInfo> UserInfoAll = City6Hour.GetUserInfo();
                if (UserInfoAll != null && UserInfoAll.Count > 0)
                {
                    for (int i = 0; i < UserInfoAll.Count; i++)
                    {
                        UserName.Add(UserInfoAll[i].UserName);
                    }
                }
            }
            catch (Exception)
            { }
            return UserName;
        }

        [WebMethod(Description = "获取当前值班预报员")]
        public string Get6HourForecaster(string ForecastId, string DtPage)
        {
            string ForecastName = "";
            try
            {
                DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
                ForecastName = City6Hour.Get6HourForecastName(dt);
            }
            catch (Exception)
            {
            }
            return ForecastName;
        }

        [WebMethod(Description = "判断输入的密码是否匹配成功")]
        public bool JudgeUserOrPwd6Hour(string UserName, string UserPwd)
        {
            bool User_Pwd = false;
            try
            {
                List<Common.UserInfo> UserInfoAll = City6Hour.GetUserInfo();
                for (var i = 0; i < UserInfoAll.Count; i++)
                {
                    if (UserInfoAll[i].UserName == UserName)
                    {
                        if (UserInfoAll[i].UPassword == UserPwd)
                        {
                            User_Pwd = true;
                        }
                        else
                        {
                            User_Pwd = false;
                        }
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
            return User_Pwd;
        }

        [WebMethod(Description = "获取逐6小时预报数据")]
        public List<Common.OBTRealInfo> GetCityForecastInfoList6(string ForecastId, string DtPage)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            DateTime dtStart;
            switch (ForecastId)
            {
                case "Forecast6":
                    dtStart = DateTime.Parse(dt.AddDays(1).ToString("yyyy-MM-dd 8:00"));
                    break;
                case "Forecast10":
                    dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 8:00"));
                    break;
                default:
                    dtStart = DateTime.Parse(dt.ToString("yyyy-MM-dd 20:00"));
                    break;
            }
            return City6Hour.GetCityForecastInfoList(dt, dtStart);
        }


        [WebMethod(Description = "获取上网文件")]
        public string ShowPreview(string ForecastId, string DtPage, int isCorrect)
        {
            DateTime DDateTime = GetCurrentForecastNameTime(ForecastId, DtPage);
            return City6Hour.ShowPreview(DDateTime, isCorrect);
        }

        [WebMethod(Description = "获取上网文件")]
        public string ShowPreview2(string m_WeatherInfoList, string DDateTime, int isCorrect)
        {
            List<Common.OBTRealInfo> hourInfo = JsonHelper.Deserialize<List<Common.OBTRealInfo>>(m_WeatherInfoList);
            return City6Hour.ShowPreview2(hourInfo, DDateTime, isCorrect);
        }


        [WebMethod(Description = "获取逐6小时历史上网文件")]
        public List<Common.ScoreInfo> GetCityUploadInfoList(string StartDt, string EndDt, int Max, int Min)
        {
            return City6Hour.GetCityUploadInfoList(StartDt, EndDt, Max, Min);
        }
        [WebMethod(Description = "获取逐六小时历史上网文件总条数")]
        public int GetCityUploadInfoListCount(string StartDt, string EndDt)
        {
            return City6Hour.GetCityUploadInfoListCount(StartDt, EndDt);
        }

        [WebMethod(Description = "获取验证后的提示信息")]
        public string ShowMes(string ForecastId, string DtPage)
        {
            DateTime DDateTime = GetCurrentForecastNameTime(ForecastId, DtPage);
            return City6Hour.ShowMes(DDateTime);

        }

        [WebMethod(Description = "保存全市预报数据")]
        public bool InsertCityWeatherInfoList(string ForecastId, string DtPage, string hourInfoS, string strForecaster, int ISCORRECT)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            List<Common.OBTRealInfo> hourInfo = JsonHelper.Deserialize<List<Common.OBTRealInfo>>(hourInfoS);
            return City6Hour.InsertCityWeatherInfoList(dt, hourInfo, strForecaster, ISCORRECT);
        }

        [WebMethod(Description = "获取实况信息")]
        public List<Common.OBTRealInfo> GetHour6OBTRealInfo(string ForecastId, string DtPage)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            return City6Hour.GetHour6OBTRealInfo(dt);
        }
        #endregion

        #region 十天预报
        TendayForecastBLL Tdforecast = new TendayForecastBLL();
        [WebMethod(Description = "天气情况")]
        public void getTideHigh(string dateTime)
        {
            // return GetWelfareForecastInfo(Convert.ToDateTime(dateTime));
            Context.Response.Write(JsonHelper.Serialize(GetWelfareForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }
        public WelfareForecastInfo GetWelfareForecastInfo(DateTime strdt)
        {
            WelfareForecastInfo infoList = Tdforecast.GetTendayforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                dataTime = infoList.DDatetime.ToString("yyyyMMdd");
                WeatherValue = infoList.PastTimes;
                WeatherFuture = infoList.Future;
                Todaydate = infoList.DDatetime.ToString("MM月dd日");
                TodayWeather = infoList.CityTVIcon;
                TodayDetil = infoList.MinTemp + "-" + infoList.MaxTemp + "℃";
                Todaysrc = infoList.DDatetime.ToString("yyyy年MM月dd日 HH时mm分");
                string Tweather = "我市" + infoList.Weather.Replace("；", "；\n         ");
                weather = string.Empty;
                for (int i = 0; i < Tweather.Split('\n').Length; i++)
                {
                    if (i > 0)
                    {
                        weather += "<p>&nbsp;&nbsp;&nbsp;&nbsp;" + Tweather.Split('\n')[i] + "</p>";
                    }
                    else
                    {
                        weather += "<p>&nbsp;&nbsp;" + Tweather.Split('\n')[i] + "</p>";
                    }
                }

                if (infoList.Future.Length > 0 && infoList.Future.Substring(infoList.Future.Length - 1) != "。")
                {
                    weather += "。";
                }
                if (infoList.CityFire != null && infoList.CityFire.Length > 0)
                {
                    weather += "\n  <p id='cs'>&nbsp;&nbsp;       " + infoList.CityFire + "。</p>";
                }
                if (infoList.ForestFire != null && infoList.ForestFire.Length > 0)
                {
                    weather += "\n  <p id='hx'>&nbsp;&nbsp;       " + infoList.ForestFire + "。</p>";
                }
                if (infoList.HIGHTEMPLEVEL != null && infoList.HIGHTEMPLEVEL.Length > 0)
                {
                    weather += "\n  <p id='zs'>&nbsp;&nbsp;    中暑气象等级为" + infoList.HIGHTEMPLEVEL + "，" + infoList.HIGHTEMPCONTENT + "。</p>";
                }
                if (infoList.NOPOISONINGLEVEL != null && infoList.NOPOISONINGLEVEL.Length > 0)
                {
                    weather += "\n  <p id='yyht'>&nbsp;&nbsp;       一氧化碳中毒气象等级为" + infoList.NOPOISONINGLEVEL + "，表明气象条件" + infoList.NOPOISONINGCONTENT + "。</p>";
                }
                dataList = infoList;
            }
            return infoList;
        }

        [WebMethod(Description = "入库")]
        public bool insertSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = Tdforecast.InsertWelfareForecastDays(realseDate, dataList, dicinfoList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }
        [WebMethod(Description = "保存数据")]
        public void SaveDate(string todayData, string Arain, string AimageUrl, string AChEnEdit, string ATempEdit, string AWindEdit, string AHumitEdit, string Stat)
        {
            try
            {
                todayData = todayData.Replace("请选择...", "");
                string[] todayDataNew = JsonHelper.Deserialize<string[]>(todayData);
                string[] ArainNew = JsonHelper.Deserialize<string[]>(Arain);
                string[] AimageUrlNew = JsonHelper.Deserialize<string[]>(AimageUrl);
                string[] AChEnEditNew = JsonHelper.Deserialize<string[]>(AChEnEdit);
                string[] ATempEditNew = JsonHelper.Deserialize<string[]>(ATempEdit);
                string[] AWindEditNew = JsonHelper.Deserialize<string[]>(AWindEdit);
                string[] AHumitEditaNew = JsonHelper.Deserialize<string[]>(AHumitEdit);
                string[] StatNew = JsonHelper.Deserialize<string[]>(Stat);

                if (dicinfoList != null)
                {
                    for (int i = 0; i < dicinfoList.Count; i++)
                    {
                        dicinfoList[i].Weather = AChEnEditNew[i].Split('|')[0].Split(':')[1];
                        dicinfoList[i].WEATHEREN = AChEnEditNew[i].Split('|')[1].Split(':')[1];
                        dicinfoList[i].WeatherIcon = AimageUrlNew[i].Split('|')[0];
                        dicinfoList[i].WeatherIcon2 = AimageUrlNew[i].Split('|')[1];
                        dicinfoList[i].MinTemp = ATempEditNew[i].Split('|')[0];
                        dicinfoList[i].MaxTemp = ATempEditNew[i].Split('|')[1];
                        dicinfoList[i].WindDirectName = AWindEditNew[i].Split('|')[0];
                        dicinfoList[i].WindName = AWindEditNew[i].Split('|')[1];
                        dicinfoList[i].WindGust = AWindEditNew[i].Split('|')[2];
                        dicinfoList[i].Humidity = AHumitEditaNew[i].Split('|')[0];
                        dicinfoList[i].MaxHumidity = AHumitEditaNew[i].Split('|')[1];
                        dicinfoList[i].Rain = ArainNew[i];
                    }
                }
                if (dataList != null)
                {
                    if (StatNew[0] == "true")
                        dataList.AirLevel = "1";
                    else
                        dataList.AirLevel = "0";
                    if (StatNew[1] == "true")
                        dataList.LonggangTVIcon = "1";
                    else
                        dataList.LonggangTVIcon = "0";
                    if (StatNew[2] == "true")
                        dataList.BaoanTVIcon = "1";
                    else
                        dataList.BaoanTVIcon = "0";
                    if (StatNew[3] == "true")
                        dataList.Air = "1";
                    else
                        dataList.Air = "0";

                    dataList.PastTimes = todayDataNew[0];
                    dataList.Future = todayDataNew[1];
                    dataList.ForestFireLevel = todayDataNew[2];
                    dataList.HIGHTEMPLEVEL = todayDataNew[3]; //中暑
                    dataList.NOPOISONINGLEVEL = todayDataNew[4];    //一氧化碳中毒
                    dataList.MinTemp = todayDataNew[5].Split('-')[0];
                    dataList.MaxTemp = todayDataNew[5].Split('-')[1];
                    dataList.WindName = todayDataNew[6];
                    dataList.WindGust = todayDataNew[7];//阵风
                    dataList.WindDirectName = todayDataNew[8].Split('-')[0];//风向
                    dataList.WindDirectName2 = todayDataNew[8].Split('-')[1];//风向
                    dataList.Humidity = todayDataNew[9].Split('-')[0];//湿度
                    dataList.MaxHumidity = todayDataNew[9].Split('-')[1];
                    dataList.SixHourRainOne = todayDataNew[10].Split('-')[0];
                    dataList.SixHourRainTwo = todayDataNew[10].Split('-')[1];
                    dataList.SixHourRainThree = todayDataNew[10].Split('-')[2];
                    dataList.SixHourRainFour = todayDataNew[10].Split('-')[3];

                    dataList.WEATHEREN = todayDataNew[11];
                    if (string.IsNullOrEmpty(todayDataNew[12].Split('-')[0]) || todayDataNew[12].Split('-')[0] == "undefined")
                        dataList.WeatherIcon = "";
                    else
                        dataList.WeatherIcon = todayDataNew[12].Split('-')[0];

                    if (string.IsNullOrEmpty(todayDataNew[12].Split('-')[1]) || todayDataNew[12].Split('-')[1] == "undefined")
                        dataList.WeatherIcon = "";
                    else
                        dataList.WeatherIcon2 = todayDataNew[12].Split('-')[1];

                    if (string.IsNullOrEmpty(todayDataNew[12].Split('-')[2]) || todayDataNew[12].Split('-')[2] == "undefined")
                        dataList.CityTVIcon = "";
                    else
                        dataList.CityTVIcon = todayDataNew[12].Split('-')[2];
                    dataList.Weather = todayDataNew[13];
                }
            }
            catch (Exception ex)
            {

            }
        }
        [WebMethod(Description = "预报员预报")]
        public void GetWelfareForecastCapsInfo(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetWelfareForecastDaysInfo(dateTime)));
            Context.Response.End();
        }
        [WebMethod]
        public void GetweatherResult(string weather)
        {
            try
            {
                DateTime DDateTime = DateTime.Parse(weather);
                DateTime dt = Convert.ToDateTime("0001-01-01");
                switch (DDateTime.Hour)
                {
                    case 6:
                        dt = DateTime.Parse(DDateTime.AddDays(-1).ToString("yyyy-MM-dd 16:00"));
                        break;
                    case 11:
                        dt = DateTime.Parse(DDateTime.ToString("yyyy-MM-dd 6:00"));
                        break;
                    case 16:
                        dt = DateTime.Parse(DDateTime.ToString("yyyy-MM-dd 11:00"));
                        break;
                }
                Context.Response.Write(JsonHelper.Serialize(WelfareForecastDaysInfo(dt.ToString("yyyy-MM-dd HH:mm:ss"))));
                Context.Response.End();

            }
            catch (Exception ex)
            {
            }
            //return null;
        }

        public List<WelfareForecastInfo> WelfareForecastDaysInfo(string dateTime)
        {
            List<WelfareForecastInfo> infoList = Tdforecast.GetTendayforecastinfoten(dateTime);
            List<weather> dic = new List<weather>();
            weather wlist = new weather();
            for (int i = 0; i < infoList.Count; i++)
            {
                wlist.date = infoList[i].ForecastDate.ToString("MM月dd日") + "@" + infoList[i].ForecastDate.DayOfWeek.ToString();
                wlist.tianqi = infoList[i].WeatherIcon + "@" + infoList[i].Weather;
                wlist.temp = infoList[i].MinTemp + "@" + infoList[i].MaxTemp;
                wlist.wind = infoList[i].WindDirectName + "@" + infoList[i].WindName + "@" + infoList[i].WindGust;
                wlist.humity = infoList[i].Humidity + "@" + infoList[i].MaxHumidity;
                dic.Add(wlist);
                wlist = new weather();
            }
            Ldic = dic;

            html = "<table style='border-collapse: collapse;'>";
            for (int row = 0; row < 5; row++)
            {
                if (row == 0)
                {
                    html += "<tr><th style='border: 1px solid #4F4E4E'>时间</th>";
                }
                if (row == 1)
                {
                    html += "<tr><th style='border: 1px solid #4F4E4E'>天气</th>";
                }
                if (row == 2)
                {
                    html += "<tr><th style='border: 1px solid #4F4E4E'>温度</th>";
                }
                if (row == 3)
                {
                    html += "<tr><th style='border: 1px solid #4F4E4E'>风</th>";
                }
                if (row == 4)
                {
                    html += "<tr><th style='border: 1px solid #4F4E4E'>相对湿度</th>";
                }
                for (int t = 0; t < dic.Count; t++)
                {
                    switch (row)
                    {
                        case 0:
                            html += "<th style='border: 1px solid #4F4E4E'>" + dic[t].date.ToString().Split('@')[0] + GetWeek(dic[t].date.ToString().Split('@')[1]) + "</th>";
                            break;
                        case 1:
                            html += "<th style='border: 1px solid #4F4E4E'><img id=imag_0" + t + " src=../../Images/tq/" + dic[t].tianqi.ToString().Split('@')[0] + "/><p id=weather_0" + t + ">" + dic[t].tianqi.ToString().Split('@')[1] + "</p></th>";
                            break;
                        case 2:
                            html += "<th id=temp_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].temp.ToString().Split('@')[0] + "~" + dic[t].temp.ToString().Split('@')[1] + "℃</th>";
                            break;
                        case 3:
                            html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].wind.ToString().Split('@')[0] + "风</br>" + dic[t].wind.ToString().Split('@')[1] + "-" + dic[t].wind.ToString().Split('@')[2] + "级</th>";
                            break;
                        case 4:
                            html += "<th id=shidu_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].humity.ToString().Split('@')[0] + "-" + dic[t].humity.ToString().Split('@')[1] + "%</th>";
                            break;
                    }
                }
                html += "</tr>";
            }
            html += "</table>";
            dicinfoList = infoList;
            return infoList;
        }
        [WebMethod]
        public void GetUserInfoname()
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetTendayforecastUser()));
            Context.Response.End();
        }
        [WebMethod(Description = "")]
        public void Get10DaysForecaster(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetTendayforecasttime(dateTime)));
            Context.Response.End();
        }
        [WebMethod(Description = "十天")]
        public void GetWelfareForecastDaysInfo(string dateTime)
        {
            try
            {
                List<WelfareForecastInfo> infoList = Tdforecast.GetTendayforecastinfoten(dateTime);
                List<weather> dic = new List<weather>();
                weather wlist = new weather();
                if (infoList != null && infoList.Count > 0)
                {
                    for (int i = 0; i < infoList.Count; i++)
                    {
                        wlist.date = infoList[i].ForecastDate.ToString("MM月dd日") + "@" + infoList[i].ForecastDate.DayOfWeek.ToString();
                        wlist.tianqi = infoList[i].WeatherIcon + "@" + infoList[i].Weather;
                        wlist.temp = infoList[i].MinTemp + "@" + infoList[i].MaxTemp;
                        wlist.wind = infoList[i].WindDirectName + "@" + infoList[i].WindName + "@" + infoList[i].WindGust;
                        wlist.humity = infoList[i].Humidity + "@" + infoList[i].MaxHumidity;
                        dic.Add(wlist);
                        wlist = new weather();
                    }
                    Ldic = dic;

                    html = "<table style='border-collapse: collapse;'>";
                    for (int row = 0; row < 5; row++)
                    {
                        if (row == 0)
                        {
                            html += "<tr><th style='border: 1px solid #4F4E4E'>时间</th>";
                        }
                        if (row == 1)
                        {
                            html += "<tr><th style='border: 1px solid #4F4E4E'>天气</th>";
                        }
                        if (row == 2)
                        {
                            html += "<tr><th style='border: 1px solid #4F4E4E'>温度</th>";
                        }
                        if (row == 3)
                        {
                            html += "<tr><th style='border: 1px solid #4F4E4E'>风</th>";
                        }
                        if (row == 4)
                        {
                            html += "<tr><th style='border: 1px solid #4F4E4E'>相对湿度</th>";
                        }
                        for (int t = 0; t < dic.Count; t++)
                        {
                            switch (row)
                            {
                                case 0:
                                    html += "<th style='border: 1px solid #4F4E4E'>" + dic[t].date.ToString().Split('@')[0] + GetWeek(dic[t].date.ToString().Split('@')[1]) + "</th>";
                                    break;
                                case 1:
                                    html += "<th style='border: 1px solid #4F4E4E'><img id=imag_0" + t + " src=../../Images/tq/" + dic[t].tianqi.ToString().Split('@')[0] + "/><p id=weather_0" + t + ">" + dic[t].tianqi.ToString().Split('@')[1] + "</p></th>";
                                    break;
                                case 2:
                                    html += "<th id=temp_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].temp.ToString().Split('@')[0] + "~" + dic[t].temp.ToString().Split('@')[1] + "℃</th>";
                                    break;
                                case 3:
                                    html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].wind.ToString().Split('@')[0] + "风</br>" + dic[t].wind.ToString().Split('@')[1] + "-" + dic[t].wind.ToString().Split('@')[2] + "级</th>";
                                    break;
                                case 4:
                                    html += "<th id=shidu_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].humity.ToString().Split('@')[0] + "-" + dic[t].humity.ToString().Split('@')[1] + "%</th>";
                                    break;
                            }
                        }
                        html += "</tr>";
                    }
                    html += "</table>";
                    dicinfoList = infoList;
                    Context.Response.Write(JsonHelper.Serialize(infoList));
                    Context.Response.End();
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
        public string GetWeek(string weekday)
        {
            try
            {
                string[] weenk = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };
                string[] weenkcn = { "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" };
                for (int i = 0; i < weenk.Length; i++)
                {
                    if (weekday == weenk[i])
                    {
                        return weenkcn[i];
                    }
                    else
                    {
                        continue;
                    }
                }
            }
            catch (Exception ex)
            { }
            return null;
        }
        [WebMethod(Description = "欧洲")]
        public void GetWelfareForecastDaysECInfo(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetTendayforecastinfo(dateTime)));
            Context.Response.End();
        }
        #endregion

        #region 预报检验

        //预报员评分 zhou
        [WebMethod]
        public void GetPredictionInfo(string dtStart, string dtEnd, string dateType)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetPredictionInfotest(dtStart, dtEnd, dateType)));
            Context.Response.End();
        }

        [WebMethod]
        public void GetScoreTotalInfo(string dtStart, string dtEnd, string dateType)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetScoreTotalInfotest(dtStart, dtEnd, dateType)));
            Context.Response.End();
        }

        [WebMethod]
        public void Get12HourgrosSScore(string dtStart, string dtEnd)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.Get12HourgrostestSScore(dtStart, dtEnd)));
            Context.Response.End();
        }
        [WebMethod]
        public void Get6HourScoreTotal(string dtStart, string dtEnd)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.Get6HourScoreTotaltest(dtStart, dtEnd)));
            Context.Response.End();
        }
        [WebMethod]
        public void GetScoreRainGrade(string dtStart, string dtEnd)
        {
            Context.Response.Write(JsonHelper.Serialize(Tdforecast.GetScoreRainGradetext(dtStart, dtEnd)));
            Context.Response.End();
        }
        [WebMethod(Description = "导出数据")]
        public void LastExporeData(string[] data, string dType)
        {
            //Thread td = new Thread(delegate () 
            //{ call(data,dType); });
            //td.SetApartmentState(ApartmentState.STA);
            //td.Start();

        }
        [WebMethod(Description = "导出数据")]
        public string ExporeData(string data, string dType)
        {
            try
            {
                string[] datas = null;
                List<string> list = datas.ToList();
                //创建对象
                //OpenFileDialog ofg = new OpenFileDialog();
                //SaveFileDialog ofg = new SaveFileDialog();
                //设置默认打开路径(绝对路径)
                //ofg.InitialDirectory = @"D:\Test\Debug1";
                //ofg.Title = "请选择导入xml文件";
                //ofg.Filter = "Excel文件(*.xls,xlsx)|*.xls;*.xlsx";
                //string path = "";
                //if (ofg.ShowDialog() == DialogResult.OK)
                //{
                // path = ofg.FileName.ToString();
                string time = DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
                string path = Server.MapPath(time);

                if (dType == "jiqiao")//准确率
                {
                    FileStream objFileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write);
                    StreamWriter objStreamWriter = new StreamWriter(objFileStream, System.Text.Encoding.Unicode);
                    for (int i = 0; i < list.Count; i++)
                    {
                        objStreamWriter.Write(list[i] + "\t");
                        //list.RemoveAt(0);
                        if ((i + 1) % 6 == 0 && i != 0)
                        {
                            objStreamWriter.Write("\r\n");
                        }
                    }
                    objStreamWriter.Close();
                    objFileStream.Close();
                }
                if (dType == "yaosu")//准确率
                {
                    FileStream objFileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write);
                    StreamWriter objStreamWriter = new StreamWriter(objFileStream, System.Text.Encoding.Unicode);
                    for (int i = 0; i < list.Count; i++)
                    {
                        objStreamWriter.Write(list[i] + "\t");
                        //list.RemoveAt(0);
                        if ((i + 1) % 5 == 0 && i != 0)
                        {
                            objStreamWriter.Write("\r\n");
                        }
                    }
                    objStreamWriter.Close();
                    objFileStream.Close();
                }
                if (dType == "right")//准确率
                {
                    FileStream objFileStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write);
                    StreamWriter objStreamWriter = new StreamWriter(objFileStream, System.Text.Encoding.Unicode);
                    for (int i = 0; i < list.Count; i++)
                    {
                        objStreamWriter.Write(list[i] + "\t");
                        //list.RemoveAt(0);
                        if ((i + 1) % 4 == 0 && i != 0)
                        {
                            objStreamWriter.Write("\r\n");
                        }
                    }
                    objStreamWriter.Close();
                    objFileStream.Close();
                }
                return time;
                // }
                //HttpContext.Current.Response.Write("<script language=javascript>alert('导出完成!');</script>");
            }
            catch (Exception ex)
            {
                string error = ex.Message;
                return "error";
            }
        }
        #endregion


        ZoneForecastBLL zoneBLL = new ZoneForecastBLL();
        //[WebMethod(Description = "分区预报数据（逐时）")]
        //public List<ZoneForecastInfo> GetForecastInfo(string AreaName, string ForecastId, string DtPage)
        //{
        //    DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
        //    DateTime dtStart = GetDateTime(ForecastId, DtPage);
        //    return zoneBLL.GetForecastInfo(dt, AreaName, dtStart);
        //}

        [WebMethod(Description = "4个分区预报全部数据（逐小时）")]
        public List<List<ZoneForecastInfo>> GetAllForInfo(string AreaList, string ForecastId, string DtPage)
        {
            DateTime dt = GetCurrentForecastNameTime(ForecastId, DtPage);
            DateTime dtStart = GetDateTime(ForecastId, DtPage);

            return zoneBLL.GetAllForInfo(dt, AreaList, dtStart);
        }

        [WebMethod(Description = "分区预报起始时间")]
        public DateTime GetDateTime(string ForecastId, string DtPage)
        {
            string dt = Convert.ToDateTime(DtPage).ToString("yyyy-MM-dd");
            switch (ForecastId)
            {
                case "Forecast10":
                    dt += " 08:00";
                    break;
                case "Forecast16":
                    dt += " 20:00";
                    break;
            }
            return Convert.ToDateTime(dt);
        }
        [WebMethod(Description = "分区预报数据发布")]
        public bool SaveForInfo(List<ZoneForecastInfo> InfoList, string Name, string ForecastId, string DtPage)
        {
            DateTime dt = GetDateTime(ForecastId, DtPage);
            return zoneBLL.SaveForInfoList(InfoList, Name, dt);
        }

        [WebMethod(Description = "分区预报的天气预报部分")]
        public List<WeatherForecastInfo> GetAllWearthInfo(string ForecastId, string DtPage)
        {
            DateTime dt = GetDateTime(ForecastId, DtPage);
            return zoneBLL.GetAllWearthInfo(dt);
        }
        [WebMethod(Description = "分区预报的天气回顾部分")]
        public List<string> GetAllWelfareForeInfo(string ForecastId, string DtPage)
        {
            DateTime dt = GetDateTime(ForecastId, DtPage);
            return zoneBLL.GetAllWelfareForeInfo(dt);
        }

        [WebMethod(Description = "分区预报的天气趋势预测")]
        public List<WeatherForecastInfo> GetWeatherHis(string ForecastId, string DtPage)
        {
            DateTime dt = GetDateTime(ForecastId, DtPage);
            return zoneBLL.GetWeatherHis(dt);
        }

        [WebMethod(Description = "获取Scwcas数据")]
        public void GetScwcasDatas(string NewTime)
        {
            Context.Response.Write(JsonHelper.Serialize(ScwcasDatas.GetScwcasDatasToDB(NewTime)));
            Context.Response.End();
        }


        [WebMethod(Description = "获取回溯显示数据——逐6小时、逐12小时预报")]
        public void GetOperatCatalogDatas(string tableInfo, string tableInfoRecord)
        {
            Context.Response.Write(JsonHelper.Serialize(ScwcasDatas.GetOperatCatalogDatasToDB(tableInfo)));
            Context.Response.Write("+" + JsonHelper.Serialize(ScwcasDatas.GetOperatCatalogDatasToDBRecord(tableInfoRecord)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取回溯显示数据——十天预报")]
        public void GettenDayDatas(string tableInfo)
        {
            Context.Response.Write(JsonHelper.Serialize(ScwcasDatas.GettenDayDatasToDB(tableInfo)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取回溯显示数据——分区预报")]
        public void GetZoneDatas(string tableInfo)
        {
            Context.Response.Write(JsonHelper.Serialize(ScwcasDatas.GetZoneDatasToDB(tableInfo)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取决策预报数据")]
        public void GetSpecialReportDatas(string table)
        {
            Context.Response.Write(JsonHelper.Serialize(getSpecialReportDatas.DecisionForecastToDB(table)));
            Context.Response.End();
        }

        [WebMethod(Description = "获取假日专报数据")]
        public void GetHolidays(string NationalTB, string GaokaoTB, string ZhongkaoTB, string SpringTB, string DuanwuTB)
        {
            Context.Response.Write(JsonHelper.Serialize(getSpecialReportDatas.HolidaysForecastToDB(NationalTB, GaokaoTB, ZhongkaoTB, SpringTB, DuanwuTB)));
            Context.Response.End();
        }

        [WebMethod(Description = "插入数据——决策预报")]
        public bool DecisionDatas(string strData)
        {
            bool cont = true;
            try
            {
                cont = insertDatas.DecisionData(strData);
            }

            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "插入数据—日常专报制作")]
        public bool DailyForecastDatas(string strData)
        {
            bool cont = true;
            try
            {
                cont = insertDatas.DailyForecastData(strData);
            }

            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "插入数据——月报")]
        public bool MonthForecastDatas(string strData)
        {
            bool cont = true;
            try
            {
                cont = insertDatas.MonthForecastData(strData);
            }

            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "插入数据——旬报")]
        public bool periodMonthForecastDatas(string strData)
        {
            bool cont = true;
            try
            {
                cont = insertDatas.periodMonthForecastData(strData);
            }

            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }



        /// <summary>
        [WebMethod(Description = "专报生成word文档")]
        public string CreatWord(string strWordData)
        {
            try
            {
                createWordForecast.creatRainWord(strWordData);
            }
            catch (Exception ee)
            {
                return ee.Message;
            }
            return createWordForecast.creatRainWord(strWordData);
        }


        DefaultManager dfm = new DefaultManager();

        [WebMethod]
        public List<List<WarningInfo>> GetWarningInfo()
        {
            return dfm.GetWarningInfo();
        }

        //预报，前推两小时
        [WebMethod]
        public List<LWSTripsInfo> showLWS(DateTime dt)
        {
            return dfm.showLWS(dt);
        }

        //预报，后推两小时
        [WebMethod]
        public List<LWSTripsInfo> showForecastTrips(DateTime dt)
        {
            return dfm.showForecastTrips(dt);
        }

        //当前预警信号
        [WebMethod]
        public WarningDate GetNewWarning()
        {
            return dfm.GetNewWarning();
        }

        //取台风预发布信息
        [WebMethod]
        public string GetWindWarming()
        {
            return dfm.GetLWSPreWord();
        }

        //欧洲中心
        [WebMethod]
        public List<ForecastInfo> showEcmwf(DateTime dt)
        {
            return dfm.showEcmwf(dt);
        }

        [WebMethod]
        public DateTime GetEctime()
        {
            return dfm.GetEcmwfTime();
        }

        [WebMethod]
        public DateTime GetLjybTime()
        {
            return dfm.GetPondsTime();
        }

        [WebMethod(Description = "获取NCAR产品时间标签")]
        public void GetNCARNewTime(string ncarType)
        {
            string NCARPath = ConfigurationManager.ConnectionStrings["NCARPath"].ConnectionString;
            string timeFile = NCARPath + ncarType + "\\time.txt";
            DateTime LastTime = NCARWeatherPictureDAL.ReadLastTimeFromFile(timeFile);
            Context.Response.Write(LastTime.ToString("yyyy-MM-dd HH:mm:ss"));
            Context.Response.End();
        }



        public string tableInfo { get; set; }

        public string tableInfoRecord { get; set; }



        [WebMethod]
        public string getDataHistory(string obtid, DateTime start, DateTime current, TimeMode timeMode, OBTField[] dataField, OBTField keyField)
        {
            string result = AWSOffset.GetHistory(obtid, current, keyField);
            if (result == null)
                result = AWSItems.GetHistory(obtid, start, current, timeMode, dataField, keyField);
            return result;
        }
        /// <summary>
        /// 获取自动站要素
        /// </summary>
        [WebMethod]
        public ClientReport GetAWSDataInfomation(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, AWSAdmin awsAdmin, string[] citys, OBTField dataField, double minLng, double minLat, double maxLng, double maxLat, int canvasWidth, int canvasHeight, int minSpace, int accuracy, bool isPlaying, bool orderbyDesc)
        {
            return ClientWindow.GetAWSDataInfomation(type, date, area, timeMode, awsAdmin, citys, dataField, accuracy, minLng, minLat, maxLng, maxLat, canvasWidth, canvasHeight, minSpace, isPlaying, orderbyDesc);
        }
        /// <summary>
        /// 获取全局排序
        /// </summary>
        [WebMethod]
        public List<AWSFieldValue> GetFullViewSort(AWDType type, DateTime? date, OBTArea area, TimeMode timeMode, AWSAdmin awsAdmin, string[] citys, OBTField dataField, bool orderByDescending, int maxCount, int accuracy, bool orderbyDesc)
        {
            return ClientWindow.GetFullViewSort(type, date, area, timeMode, awsAdmin, citys, dataField, orderByDescending, maxCount, accuracy, orderbyDesc);
        }

        #region 决策专报报文处理
        DecisionForcastBLL dforcast = new DecisionForcastBLL();
        [WebMethod(Description = "决策快报入库")]
        public bool insertDecisionSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = dforcast.InsertDecisionForcast(realseDate, decisionList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "天气情况")]
        public void getDecisionTideHigh(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetDecisionForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }
        [WebMethod(Description = "获取决策预报数据")]
        public DecisionForecastInfo GetDecisionForecastInfo(DateTime strdt)
        {
            DecisionForecastInfo infoList = dforcast.GetDecisionforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                decisionList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "保存决策数据到数据模型")]
        public void SaveDecisionDate(string decisionData)
        {
            string[] decisionDataNew = JsonHelper.Deserialize<string[]>(decisionData);
            if (decisionList != null)
            {
                //预报员名字
                decisionList.Forecastname = decisionDataNew[0];
                //报文期号
                if (decisionDataNew[1] != null && decisionDataNew[1] != "")
                {
                    decisionList.Numid = Convert.ToInt32(decisionDataNew[1]);
                }
                else
                {
                    decisionList.Numid = 1;
                }
                //摘要
                decisionList.Abstractcontent = decisionDataNew[2];
                //二级标题
                decisionList.Subhead= decisionDataNew[3];
                //一、台风动态 第一段 标题
                decisionList.Typhoontitle1 = decisionDataNew[4];
                //一、台风动态 第一段 内容
                decisionList.Typhooncontent1 = decisionDataNew[5];
                //一、台风动态 第二段 标题
                decisionList.Typhoontitle2 = decisionDataNew[6];
                //一、台风动态 第二段 内容
                decisionList.Typhooncontent2 = decisionDataNew[7];
                //二、天气实况 第一段 标题
                decisionList.Weathertitle1 = decisionDataNew[8];
                //二、天气实况 第一段 内容
                decisionList.Weathercontent1 = decisionDataNew[9];
                //二、天气实况 第二段 标题
                decisionList.Weathertitle2 = decisionDataNew[10];
                //二、天气实况 第二段 内容
                decisionList.Weathercontent2 = decisionDataNew[11];
                //三、天气预报
                decisionList.Weatherforcast = decisionDataNew[12];
                //三、天气预报 - 海洋预报
                decisionList.Oceanforecast = decisionDataNew[13];
                //三、天气预报 - 陆地预报
                decisionList.Landforecast = decisionDataNew[14];
                //防御建议
                decisionList.Defenceadvice = decisionDataNew[15];
                //台风路径图片名称
                decisionList.Pictyphoontrack = decisionDataNew[16];
                //过程雨量图1名称
                decisionList.Weaherpic1 = decisionDataNew[17];
                //过程雨量图2名称
                decisionList.Weaherpic2 = decisionDataNew[18];
                //台风路径图片说明
                decisionList.Pictyphoonexplain= decisionDataNew[19];
                //过程雨量图1说明
                decisionList.Weatherpicexplain1 = decisionDataNew[20];
                //过程雨量图2说明
                decisionList.Weatherpicexplain2 = decisionDataNew[21];
                //报文发布时间
                decisionList.Forecastdate = decisionDataNew[22];
            }
        }
        #endregion
        #region 春运报文制作
        SpringForecastBLL sforcast = new SpringForecastBLL();
        [WebMethod(Description = "春运专报天气情况")]
        public void getSpringTideHigh(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetSpringForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }
        [WebMethod(Description = "获取春运专报数据")]
        public SpringForecastModel GetSpringForecastInfo(DateTime strdt)
        {
            SpringForecastModel infoList = sforcast.GetSpringForecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                springList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "春运专报入库")]
        public bool insertSpringSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = sforcast.InsertSpringForcast(realseDate, springinfoList, springList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }
        [WebMethod(Description = "获取三天欧洲中心预报")]
        public void GetSpringForecastDaysECInfo(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(sforcast.GetThreedayforecastinfo(dateTime)));
            Context.Response.End();
        }
        [WebMethod(Description = "三天")]
        public void GetSpringForecastDaysInfo(string dateTime)
        {
            try
            {
                List<SpringForecastModel> infoList = sforcast.GetThreeforecastinfoten(dateTime);
                List<springweather> dic = new List<springweather>();
                springweather wlist = new springweather();
                if (infoList != null && infoList.Count > 0)
                {
                    for (int i = 0; i < infoList.Count; i++)
                    {
                        wlist.date = infoList[i].ForcastTime.ToString("MM月dd日") + "@" + infoList[i].ForcastTime.DayOfWeek.ToString();
                        wlist.tianqi = infoList[i].WeatherIcon + "@" + infoList[i].Weather;
                        wlist.temp = infoList[i].MinTemp + "@" + infoList[i].MaxTemp;
                        wlist.wind = infoList[i].LandWindDirect + "@" + infoList[i].LandMinWind + "@" + infoList[i].LandMaxWind;
                        wlist.seawind = infoList[i].SeaWindDirect + "@" + infoList[i].SeaMinWind + "@" + infoList[i].SeaMaxWind;
                        wlist.gustwind = infoList[i].GustWind;
                        dic.Add(wlist);
                        wlist = new springweather();
                    }
                    Sdic = dic;

                    html = "<table style='border-collapse: collapse;'><tr><th style='border: 1px solid #4F4E4E'>时间</th><th style='border: 1px solid #4F4E4E'>天空状况</th><th style='border: 1px solid #4F4E4E'>温度</th><th style='border: 1px solid #4F4E4E'>陆地风向风速</th><th style='border: 1px solid #4F4E4E'>近海海面风向风速</th></tr>";
                    for (int t = 0; t < dic.Count; t++)
                    {
                        html += "<tr>";
                        html += "<th style='border: 1px solid #4F4E4E'>" + dic[t].date.ToString().Split('@')[0] + GetWeek(dic[t].date.ToString().Split('@')[1]) + "</th>";
                        html += "<th style='border: 1px solid #4F4E4E'><img id=imag_0" + t + " src=../../Images/tq/" + dic[t].tianqi.ToString().Split('@')[0] + "/><p id=weather_0" + t + ">" + dic[t].tianqi.ToString().Split('@')[1] + "</p></th>";
                        html += "<th id=temp_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].temp.ToString().Split('@')[0] + "~" + dic[t].temp.ToString().Split('@')[1] + "℃</th>";
                        html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].wind.ToString().Split('@')[0] + "风</br>" + dic[t].wind.ToString().Split('@')[1] + "-" + dic[t].wind.ToString().Split('@')[2] + "级</th>";
                        html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].seawind.ToString().Split('@')[0] + "风" + dic[t].seawind.ToString().Split('@')[1] + "-" + dic[t].seawind.ToString().Split('@')[2] + "级</br>阵风" + dic[t].gustwind + "级</th>";
                        html += "</tr>";
                    }
                    //for (int row = 0; row < 5; row++)
                    //{
                    //    if (row == 0)
                    //    {
                    //        html += "<tr><th style='border: 1px solid #4F4E4E'>时间</th>";
                    //    }
                    //    if (row == 1)
                    //    {
                    //        html += "<tr><th style='border: 1px solid #4F4E4E'>天空状况</th>";
                    //    }
                    //    if (row == 2)
                    //    {
                    //        html += "<tr><th style='border: 1px solid #4F4E4E'>温度</th>";
                    //    }
                    //    if (row == 3)
                    //    {
                    //        html += "<tr><th style='border: 1px solid #4F4E4E'>陆地风向风速</th>";
                    //    }
                    //    if (row == 4)
                    //    {
                    //        html += "<tr><th style='border: 1px solid #4F4E4E'>近海海面风向风速</th>";
                    //    }
                    //    for (int t = 0; t < dic.Count; t++)
                    //    {
                    //        switch (row)
                    //        {
                    //            case 0:
                    //                html += "<th style='border: 1px solid #4F4E4E'>" + dic[t].date.ToString().Split('@')[0] + GetWeek(dic[t].date.ToString().Split('@')[1]) + "</th>";
                    //                break;
                    //            case 1:
                    //                html += "<th style='border: 1px solid #4F4E4E'><img id=imag_0" + t + " src=../../Images/tq/" + dic[t].tianqi.ToString().Split('@')[0] + "/><p id=weather_0" + t + ">" + dic[t].tianqi.ToString().Split('@')[1] + "</p></th>";
                    //                break;
                    //            case 2:
                    //                html += "<th id=temp_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].temp.ToString().Split('@')[0] + "~" + dic[t].temp.ToString().Split('@')[1] + "℃</th>";
                    //                break;
                    //            case 3:
                    //                html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].wind.ToString().Split('@')[0] + "风</br>" + dic[t].wind.ToString().Split('@')[1] + "-" + dic[t].wind.ToString().Split('@')[2] + "级</th>";
                    //                break;
                    //            case 4:
                    //                html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].seawind.ToString().Split('@')[0] + "风</br>" + dic[t].seawind.ToString().Split('@')[1] + "-" + dic[t].seawind.ToString().Split('@')[2] + "级</th>";
                    //                break;
                    //        }
                    //    }
                    //    html += "</tr>";
                    //}
                    html += "</table>";
                    springinfoList = infoList;
                    Context.Response.Write(JsonHelper.Serialize(infoList));
                    Context.Response.End();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        [WebMethod(Description = "保存春运报文数据")]
        public void SaveSpringDate(string springData, string AimageUrl, string AChEnEdit, string ATempEdit, string AWindEdit, string ASeaWindEdit, string AGustWindEdit)
        {
            try
            {
                springData = springData.Replace("请选择...", "");
                string[] todayDataNew = JsonHelper.Deserialize<string[]>(springData);
                string[] AimageUrlNew = JsonHelper.Deserialize<string[]>(AimageUrl);
                string[] AChEnEditNew = JsonHelper.Deserialize<string[]>(AChEnEdit);
                string[] ATempEditNew = JsonHelper.Deserialize<string[]>(ATempEdit);
                string[] AWindEditNew = JsonHelper.Deserialize<string[]>(AWindEdit);
                string[] ASeaWindEditNew = JsonHelper.Deserialize<string[]>(ASeaWindEdit);
                string[] AGustWindEditNew = JsonHelper.Deserialize<string[]>(AGustWindEdit);
                if (springinfoList != null)
                {
                    for (int i = 0; i < springinfoList.Count; i++)
                    {
                        springinfoList[i].Weather = AChEnEditNew[i].Split(':')[1];
                        springinfoList[i].WeatherIcon = AimageUrlNew[i].Split('|')[0];
                        springinfoList[i].MinTemp = ATempEditNew[i].Split('|')[0];
                        springinfoList[i].MaxTemp = ATempEditNew[i].Split('|')[1];
                        springinfoList[i].LandWindDirect = AWindEditNew[i].Split('|')[0];
                        springinfoList[i].LandMinWind = AWindEditNew[i].Split('|')[1];
                        springinfoList[i].LandMaxWind = AWindEditNew[i].Split('|')[2];
                        springinfoList[i].SeaWindDirect = AWindEditNew[i].Split('|')[0];
                        springinfoList[i].SeaMinWind = AWindEditNew[i].Split('|')[1];
                        springinfoList[i].SeaMaxWind = AWindEditNew[i].Split('|')[2];
                        springinfoList[i].GustWind = AGustWindEditNew[i];
                    }
                }
                if (springList != null)
                {
                    //预报员名字
                    springList.ForecastName = todayDataNew[0];
                    //报文期号
                    if (todayDataNew[1] != null && todayDataNew[1] != "")
                    {
                        springList.Numid = Convert.ToInt32(todayDataNew[1]);
                    }
                    else
                    {
                        springList.Numid = 1;
                    }
                    springList.TotalTrendTitle = todayDataNew[2];//春运天气总趋势预测标题
                    springList.TotalTrendForecast = todayDataNew[3];//春运天气总趋势预测内容
                    springList.ThreeDayForecastTitle = todayDataNew[4];//未来3天天气预报 一级标题
                    springList.ThreeDayForecast = todayDataNew[5];//未来3天天气预报 第一段 标题
                    springList.ThreeDayContent = todayDataNew[6]; //未来3天天气预报 第一段 内
                    springList.ThreeDayTrafficForecast = todayDataNew[7];//未来三天交通气象预报 第二段 标题
                    springList.MainTrafficRoad = todayDataNew[8];// 未来三天交通气象预报 1、主要交通路段 内容
                    springList.QiozhouStrait = todayDataNew[9];// 二、未来三天交通气象预报 2、琼州海峡 内容
                    springList.ProvinceForcastTitle = todayDataNew[10];//三、未来4～7天全省天气趋势预报
                    springList.FutureProvinceForcast = todayDataNew[11];//三、未来4～7天全省天气趋势预报 内容
                    springList.ForecastDate = todayDataNew[12];//报文发布时间

                }
            }
            catch (Exception ex)
            {

            }
        }
        #endregion
        #region 交通报文制作
        TrafficForecastBLL tForecast = new TrafficForecastBLL();
        [WebMethod(Description = "交通专报天气情况")]
        public void getTrafficTideHigh(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetTrafficForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }
        [WebMethod(Description = "获取交通专报数据")]
        public TrafficForecastModel GetTrafficForecastInfo(DateTime strdt)
        {
            TrafficForecastModel infoList = tForecast.GetTrafficForecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                trafficList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "交通专报入库")]
        public bool insertTrafficSaveData(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = tForecast.InsertTrafficForcast(realseDate, trafficinfoList, trafficList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }
        [WebMethod(Description = "七天")]
        public void GetTrafficForecastDaysInfo(string dateTime)
        {
            try
            {
                List<TrafficForecastModel> infoList = tForecast.GetSevenforecastinfoten(dateTime);
                List<trafficweather> dic = new List<trafficweather>();
                trafficweather wlist = new trafficweather();
                if (infoList != null && infoList.Count > 0)
                {
                    for (int i = 0; i < infoList.Count; i++)
                    {
                        wlist.date = infoList[i].ForcastTime.ToString("MM月dd日") + "@" + infoList[i].ForcastTime.DayOfWeek.ToString();
                        wlist.tianqi = infoList[i].WeatherIcon + "@" + infoList[i].Weather1;
                        wlist.temp = infoList[i].MinTemp + "@" + infoList[i].MaxTemp;
                        wlist.wind = infoList[i].WindDirect + "@" + infoList[i].MinWind + "@" + infoList[i].MaxWind;
                        dic.Add(wlist);
                        wlist = new trafficweather();
                    }
                    Tdic = dic;

                    html = "<table style='border-collapse: collapse;'><tr><th style='border: 1px solid #4F4E4E'>时间</th><th style='border: 1px solid #4F4E4E'>天空状况</th><th style='border: 1px solid #4F4E4E'>温度</th><th style='border: 1px solid #4F4E4E'>陆地风向风速</th><th style='border: 1px solid #4F4E4E'>近海海面风向风速</th></tr>";
                    for (int t = 0; t < dic.Count; t++)
                    {
                        html += "<tr>";
                        html += "<th style='border: 1px solid #4F4E4E'>" + dic[t].date.ToString().Split('@')[0] + GetWeek(dic[t].date.ToString().Split('@')[1]) + "</th>";
                        html += "<th style='border: 1px solid #4F4E4E'><img id=imag_0" + t + " src=../../Images/tq/" + dic[t].tianqi.ToString().Split('@')[0] + "/><p id=weather_0" + t + ">" + dic[t].tianqi.ToString().Split('@')[1] + "</p></th>";
                        html += "<th id=temp_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].temp.ToString().Split('@')[0] + "~" + dic[t].temp.ToString().Split('@')[1] + "℃</th>";
                        html += "<th id=wind_0" + t + " style='border: 1px solid #4F4E4E'>" + dic[t].wind.ToString().Split('@')[0] + "风</br>" + dic[t].wind.ToString().Split('@')[1] + "-" + dic[t].wind.ToString().Split('@')[2] + "级</th>";
                        html += "</tr>";
                    }
                    html += "</table>";
                    trafficinfoList = infoList;
                    Context.Response.Write(JsonHelper.Serialize(infoList));
                    Context.Response.End();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
        [WebMethod(Description = "获取七天欧洲中心预报")]
        public void GetTrafficForecastDaysECInfo(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(tForecast.GetSevendayforecastinfo(dateTime)));
            Context.Response.End();
        }
        [WebMethod(Description = "处理要入库交通专报数据")]
        public void SaveTrafficData(string trafficData, string AimageUrl, string AChEnEdit, string ATempEdit, string AWindEdit)
        {
            try
            {
                trafficData = trafficData.Replace("请选择...", "");
                string[] todayDataNew = JsonHelper.Deserialize<string[]>(trafficData);
                string[] AimageUrlNew = JsonHelper.Deserialize<string[]>(AimageUrl);
                string[] AChEnEditNew = JsonHelper.Deserialize<string[]>(AChEnEdit);
                string[] ATempEditNew = JsonHelper.Deserialize<string[]>(ATempEdit);
                string[] AWindEditNew = JsonHelper.Deserialize<string[]>(AWindEdit);
                if (trafficinfoList != null)
                {
                    for (int i = 0; i < trafficinfoList.Count; i++)
                    {
                        trafficinfoList[i].Weather1 = AChEnEditNew[i].Split(':')[1];
                        trafficinfoList[i].WeatherIcon = AimageUrlNew[i].Split('|')[0];
                        trafficinfoList[i].MinTemp = ATempEditNew[i].Split('|')[0];
                        trafficinfoList[i].MaxTemp = ATempEditNew[i].Split('|')[1];
                        trafficinfoList[i].WindDirect = AWindEditNew[i].Split('|')[0];
                        trafficinfoList[i].MinWind = AWindEditNew[i].Split('|')[1];
                        trafficinfoList[i].MaxWind = AWindEditNew[i].Split('|')[2];
                    }
                }
                if (trafficList != null)
                {
                    //预报员名字
                    trafficList.ForecastName = todayDataNew[0];
                    //报文期号
                    if (todayDataNew[1] != null && todayDataNew[1] != "")
                    {
                        trafficList.Numid = Convert.ToInt32(todayDataNew[1]);
                    }
                    else
                    {
                        trafficList.Numid = 1;
                    }
                    trafficList.TrafficTrendForecast = todayDataNew[2];//春运天气总趋势预测标题
                    trafficList.ForecastDate = todayDataNew[3];//报文发布时间
                }
            }
            catch (Exception ex)
            {

            }
        }
        #endregion
        [WebMethod(Description = "保存图片")]
        public bool SavePicToFile(string imgUrl,string picName)
        {
            return CommonSavePic.Base64StringToImage(imgUrl, picName);         
        }
        
        #region 风雨实况专报报文处理
        [WebMethod(Description = "保存风雨实况数据到数据模型")]
        public void SaveLiveForecastData(string LiveData, string LiveTbData)
        {
            string[] LiveDataNew = JsonHelper.Deserialize<string[]>(LiveData);
            string[] LiveTBDataNew = JsonHelper.Deserialize<string[]>(LiveTbData);
            if (LiveDataNew != null)
            {
                //发布时间
                LiveList.Ddatetime = LiveDataNew[0];
                //预报员
                LiveList.Forecaster = LiveDataNew[1];
                //摘要
                LiveList.Summary = LiveDataNew[2];
                //降雨实况
                LiveList.Rainval = LiveDataNew[3];
                //降雨实况图名称
                LiveList.Raindpic = LiveDataNew[4];
                //降雨实况图描述
                LiveList.Rainpicdes = LiveDataNew[5];
                //风力实况
                LiveList.Windval = LiveDataNew[6];
                //风力实况图名称
                LiveList.Windpic = LiveDataNew[7];
                //风力实况图描述
                LiveList.Windpicdes = LiveDataNew[8];
                //未来三小时预报
                LiveList.Threehour_reportval = LiveDataNew[9];
                //未来三天预报
                LiveList.Threeday_reportval = LiveDataNew[10];
            }

            if (LiveTBDataNew != null)
            {
                LiveTBList.Reporttime = LiveTBDataNew[0];
                LiveTBList.Name = LiveTBDataNew[1];
                LiveTBList.Middleposition = LiveTBDataNew[2];
                LiveTBList.Strength = LiveTBDataNew[3];
                LiveTBList.Windspeed = LiveTBDataNew[4];
                LiveTBList.Middlepressure = LiveTBDataNew[5];
                LiveTBList.Referposition = LiveTBDataNew[6];
                LiveTBList.Report = LiveTBDataNew[7];
                LiveTBList.Ddatetime = LiveTBDataNew[8];
            }
        }

        LiveForecastBLL lforecast = new LiveForecastBLL();
        [WebMethod(Description = "风雨实况预报入库")]
        public bool insertLiveSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = lforecast.InsertLiveForcast(realseDate, LiveList,LiveTBList,realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取风雨实况预报数据")]
        public void getLiveDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetLiveForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+"+JsonHelper.Serialize(GetLiveForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }
        [WebMethod(Description = "获取风雨实况预报数据")]
        public Common.LiveForecastModel.LiveForecastInfo GetLiveForecastInfo(DateTime strdt)
        {
            Common.LiveForecastModel.LiveForecastInfo infoList = lforecast.GetLiveforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                LiveList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取风雨实况预报表格数据")]
        public Common.LiveForecastModel.LiveForecastTBInfo GetLiveForecastTBInfo(DateTime strdt)
        {
            Common.LiveForecastModel.LiveForecastTBInfo infoList = lforecast.GetLiveTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                LiveTBList = infoList;
            }
            return infoList;
        }

        #endregion


        #region 国庆专报报文处理
        [WebMethod(Description = "保存国庆专报数据到数据模型")]
        public void SaveNationalForecastData(string NationalInfo, string forecasttime, string weatherdes, string weatherpic, string temperature,string wind)
        {
            string[] NationalDataNew = JsonHelper.Deserialize<string[]>(NationalInfo);

            if (NationalDataNew != null)
            {
                NationalList.Ddatetime = NationalDataNew[0];
                NationalList.Forecaster = NationalDataNew[1];
                NationalList.Summary = NationalDataNew[2];
                NationalList.Weather_trend = NationalDataNew[3];
                NationalList.Weather_details = NationalDataNew[4];
            }

            NationalTBlist.Ddatetime = NationalDataNew[0];
            NationalTBlist.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            NationalTBlist.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            NationalTBlist.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            NationalTBlist.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            NationalTBlist.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        HolidayForecastBLL hforecast = new HolidayForecastBLL();
        [WebMethod(Description = "国庆专报入库")]
        public bool insertNationalSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = hforecast.InsertNationalForcast(realseDate, NationalList, NationalTBlist, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取国庆专报报数据")]
        public void getNationalDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetNationalForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(GetNationalForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取国庆专报数据")]
        public Common.NationalForecastModel.NationalForecastInfo GetNationalForecastInfo(DateTime strdt)
        {
            Common.NationalForecastModel.NationalForecastInfo infoList = hforecast.GetNationalforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                NationalList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取国庆专报表格数据")]
        public Common.NationalForecastModel.NationalForecastTBInfo GetNationalForecastTBInfo(DateTime strdt)
        {
            Common.NationalForecastModel.NationalForecastTBInfo infoList = hforecast.GetNationalTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                NationalTBlist = infoList;
            }
            return infoList;
        }
        #endregion

        #region 高考专报报文处理
        [WebMethod(Description = "保存高考专报数据到数据模型")]
        public void SaveGaokaoForecastData(string GaokaoInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] GaokaoDataNew = JsonHelper.Deserialize<string[]>(GaokaoInfo);

            if (GaokaoDataNew != null)
            {
                GaokaoList.Ddatetime = GaokaoDataNew[0];
                GaokaoList.Forecaster = GaokaoDataNew[1];
                GaokaoList.Weather_trend = GaokaoDataNew[2];
                GaokaoList.Suggest = GaokaoDataNew[3];
                GaokaoList.Subhead = GaokaoDataNew[4];
            }

            GaokaoTBlist.Ddatetime = GaokaoDataNew[0];
            GaokaoTBlist.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            GaokaoTBlist.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            GaokaoTBlist.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            GaokaoTBlist.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            GaokaoTBlist.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        [WebMethod(Description = "高考专报入库")]
        public bool insertGaokaoSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = hforecast.InsertGaokaoForcast(realseDate, GaokaoList, GaokaoTBlist, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取高考专报报数据")]
        public void getGaokaoDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetGaokaoForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(GetGaokaoForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取高考专报数据")]
        public Common.GaokaoForecastModel.GaokaoForecastInfo GetGaokaoForecastInfo(DateTime strdt)
        {
            Common.GaokaoForecastModel.GaokaoForecastInfo infoList = hforecast.GetGaokaoforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                GaokaoList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取高考专报表格数据")]
        public Common.GaokaoForecastModel.GaokaoForecastTBInfo GetGaokaoForecastTBInfo(DateTime strdt)
        {
            Common.GaokaoForecastModel.GaokaoForecastTBInfo infoList = hforecast.GetGaokaoTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                GaokaoTBlist = infoList;
            }
            return infoList;
        }

        #endregion


        #region 中考专报报文处理
        [WebMethod(Description = "保存中考专报数据到数据模型")]
        public void SaveZhongkaoForecastData(string ZhongkaoInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] ZhongkaoDataNew = JsonHelper.Deserialize<string[]>(ZhongkaoInfo);

            if (ZhongkaoDataNew != null)
            {
                ZhongkaoList.Ddatetime = ZhongkaoDataNew[0];
                ZhongkaoList.Forecaster = ZhongkaoDataNew[1];
                ZhongkaoList.Weather_trend = ZhongkaoDataNew[2];
                ZhongkaoList.Suggest = ZhongkaoDataNew[3];
            }

            ZhongkaoTBlist.Ddatetime = ZhongkaoDataNew[0];
            ZhongkaoTBlist.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            ZhongkaoTBlist.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            ZhongkaoTBlist.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            ZhongkaoTBlist.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            ZhongkaoTBlist.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        [WebMethod(Description = "中考专报入库")]
        public bool insertZhongkaoSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = hforecast.InsertZhongkaoForcast(realseDate, ZhongkaoList, ZhongkaoTBlist, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取中考专报报数据")]
        public void getZhongkaoDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetZhongkaoForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(GetZhongkaoForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取中考专报数据")]
        public Common.ZhongkaoForecastModel.ZhongkaoForecastInfo GetZhongkaoForecastInfo(DateTime strdt)
        {
            Common.ZhongkaoForecastModel.ZhongkaoForecastInfo infoList = hforecast.GetZhongkaoforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                ZhongkaoList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取中考专报表格数据")]
        public Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo GetZhongkaoForecastTBInfo(DateTime strdt)
        {
            Common.ZhongkaoForecastModel.ZhongkaoForecastTBInfo infoList = hforecast.GetZhongkaoTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                ZhongkaoTBlist = infoList;
            }
            return infoList;
        }

        #endregion

        #region 春节专报报文处理
        [WebMethod(Description = "保存春节专报数据到数据模型")]
        public void SaveSpringForecastData(string SpringInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] SpringDataNew = JsonHelper.Deserialize<string[]>(SpringInfo);

            if (SpringDataNew != null)
            {
                SpringList.Ddatetime = SpringDataNew[0];
                SpringList.Forecaster = SpringDataNew[1];
                SpringList.Weather_trend = SpringDataNew[2];
                SpringList.Weather_details = SpringDataNew[3];
            }

            SpringTBList.Ddatetime = SpringDataNew[0];
            SpringTBList.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            SpringTBList.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            SpringTBList.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            SpringTBList.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            SpringTBList.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        [WebMethod(Description = "春节专报入库")]
        public bool insertSpringSTFSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = hforecast.InsertSpringForcast(realseDate, SpringList, SpringTBList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取春节专报报数据")]
        public void getSpringFSTDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(getSpringFSTInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(getSpringFSTTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取春节专报数据")]
        public Common.SpringFestivalModel.SpringFestivalInfo getSpringFSTInfo(DateTime strdt)
        {
            Common.SpringFestivalModel.SpringFestivalInfo infoList = hforecast.GetSpringforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                SpringList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取春节专报表格数据")]
        public Common.SpringFestivalModel.SpringFestivalTBInfo getSpringFSTTBInfo(DateTime strdt)
        {
            Common.SpringFestivalModel.SpringFestivalTBInfo infoList = hforecast.GetSpringTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                SpringTBList = infoList;
            }
            return infoList;
        }

        #endregion


        #region 端午专报报文处理
        [WebMethod(Description = "保存端午专报数据到数据模型")]
        public void SaveDuanwuForecastData(string DuanwuInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] DuanwuDataNew = JsonHelper.Deserialize<string[]>(DuanwuInfo);

            if (DuanwuDataNew != null)
            {
                DuanwuList.Ddatetime = DuanwuDataNew[0];
                DuanwuList.Forecaster = DuanwuDataNew[1];
                DuanwuList.Weather_trend = DuanwuDataNew[2];
                DuanwuList.Weather_details = DuanwuDataNew[3];
                DuanwuList.Pic = DuanwuDataNew[4];
                DuanwuList.PicDes = DuanwuDataNew[5];
                DuanwuList.Subhead = DuanwuDataNew[6];
            }

            DuanwuTBList.Ddatetime = DuanwuDataNew[0];
            DuanwuTBList.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            DuanwuTBList.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            DuanwuTBList.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            DuanwuTBList.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            DuanwuTBList.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        [WebMethod(Description = "端午专报入库")]
        public bool insertDuanwuSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = hforecast.InsertDuanwuForcast(realseDate, DuanwuList, DuanwuTBList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取端午专报报数据")]
        public void getDuanwuDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(getDuanwuInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(getDuanwuTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取端午专报数据")]
        public Common.DuanwuForecastModel.DuanwuForecastInfo getDuanwuInfo(DateTime strdt)
        {
            Common.DuanwuForecastModel.DuanwuForecastInfo infoList = hforecast.GetDuanwuforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                DuanwuList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取端午专报表格数据")]
        public Common.DuanwuForecastModel.DuanwuForecastTBInfo getDuanwuTBInfo(DateTime strdt)
        {
            Common.DuanwuForecastModel.DuanwuForecastTBInfo infoList = hforecast.GetDuanwuTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                DuanwuTBList = infoList;
            }
            return infoList;
        }

        #endregion


        #region 政府专报报文处理
        [WebMethod(Description = "保存政府专报数据到数据模型")]
        public void SaveGovtForecastData(string GovtInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] GovtDataNew = JsonHelper.Deserialize<string[]>(GovtInfo);

            if (GovtDataNew != null)
            {
                GovtList.Ddatetime = GovtDataNew[0];
                GovtList.Forecaster = GovtDataNew[1];
                GovtList.Early_weather = GovtDataNew[2];
                GovtList.Haikou_weather = GovtDataNew[3];
                GovtList.SuggestVal = GovtDataNew[4];
                GovtList.FarmpartVal = GovtDataNew[5];
                GovtList.TrafficpartVal = GovtDataNew[6];
            }

            GovtTBList.Ddatetime = GovtDataNew[0];
            GovtTBList.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            GovtTBList.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            GovtTBList.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            GovtTBList.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            GovtTBList.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        GovtForecastBLL gforecast = new GovtForecastBLL();
        [WebMethod(Description = "政府专报入库")]
        public bool insertGovtSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = gforecast.InsertGovtForcast(realseDate, GovtList, GovtTBList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取政府专报报数据")]
        public void getGovtDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetGovtForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("+" + JsonHelper.Serialize(GetGovtForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取政府专报数据")]
        public Common.GovtForecastModel.GovtForecastInfo GetGovtForecastInfo(DateTime strdt)
        {
            Common.GovtForecastModel.GovtForecastInfo infoList = gforecast.GetGovtforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                GovtList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取政府专报表格数据")]
        public Common.GovtForecastModel.GovtForecastTBInfo GetGovtForecastTBInfo(DateTime strdt)
        {
            Common.GovtForecastModel.GovtForecastTBInfo infoList = gforecast.GetGovtTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                GovtTBList = infoList;
            }
            return infoList;
        }
        #endregion


        #region 农业专报报文处理
        [WebMethod(Description = "保存农业专报数据到数据模型")]
        public void SaveFarmForecastData(string FarmInfo, string forecasttime, string weatherdes, string weatherpic, string temperature, string wind)
        {
            string[] FarmDataNew = JsonHelper.Deserialize<string[]>(FarmInfo);

            if (FarmDataNew != null)
            {
                FarmList.Ddatetime = FarmDataNew[0];
                FarmList.Forecaster = FarmDataNew[1];
                FarmList.Early_weather = FarmDataNew[2];
                FarmList.Haikou_weather = FarmDataNew[3];
                FarmList.LizhiVal = FarmDataNew[4];
                FarmList.VegetablesVal = FarmDataNew[5];
                FarmList.ShuidaoVal = FarmDataNew[6];
            }

            FarmTBList.Ddatetime = FarmDataNew[0];
            FarmTBList.Forecasttime = JsonHelper.Deserialize<string[]>(forecasttime);
            FarmTBList.Weatherpic = JsonHelper.Deserialize<string[]>(weatherpic);
            FarmTBList.Weatherdes = JsonHelper.Deserialize<string[]>(weatherdes);
            FarmTBList.Temperature = JsonHelper.Deserialize<string[]>(temperature);
            FarmTBList.Wind = JsonHelper.Deserialize<string[]>(wind);
        }

        FarmForecastBLL farmorecast = new FarmForecastBLL();
        [WebMethod(Description = "农业专报入库")]
        public bool insertFarmSaveDate(string realseTime, string realseUser)
        {
            bool cont = true;
            try
            {
                DateTime realseDate = DateTime.Parse(realseTime);
                cont = farmorecast.InsertFarmForcast(realseDate, FarmList, FarmTBList, realseUser);
            }
            catch (Exception ex)
            {
                cont = false;
            }
            return cont;
        }

        [WebMethod(Description = "获取农业专报报数据")]
        public void getFarmDatas(string dateTime)
        {
            Context.Response.Write(JsonHelper.Serialize(GetFarmForecastInfo(Convert.ToDateTime(dateTime))));
            Context.Response.Write("#" + JsonHelper.Serialize(GetFarmForecastTBInfo(Convert.ToDateTime(dateTime))));
            Context.Response.End();
        }

        [WebMethod(Description = "获取农业专报数据")]
        public Common.FarmForecastModel.FarmForecastInfo GetFarmForecastInfo(DateTime strdt)
        {
            Common.FarmForecastModel.FarmForecastInfo infoList = farmorecast.GetFarmforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                FarmList = infoList;
            }
            return infoList;
        }
        [WebMethod(Description = "获取农业专报表格数据")]
        public Common.FarmForecastModel.FarmForecastTBInfo GetFarmForecastTBInfo(DateTime strdt)
        {
            Common.FarmForecastModel.FarmForecastTBInfo infoList = farmorecast.GetFarmTBforecast(Convert.ToDateTime(strdt));
            if (infoList != null)
            {
                FarmTBList = infoList;
            }
            return infoList;
        }
        
        #endregion
    }
}
