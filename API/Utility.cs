using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using System.Runtime.Serialization.Json;

namespace API
{
    public class Utility
    {
        public const string csTimeStr = @"\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}\.000Z";
        /// <summary>
        /// 获取web客户端ip
        /// </summary>
        /// <returns></returns>
        public string GetWebClientIp()
        {
            if (System.Web.HttpContext.Current == null || System.Web.HttpContext.Current.Request == null || System.Web.HttpContext.Current.Request.ServerVariables == null)
                return null;
            string CustomerIP = "";
            CustomerIP = System.Web.HttpContext.Current.Request.Headers["Cdn-Src-Ip"];
            if (!string.IsNullOrEmpty(CustomerIP))
                return CustomerIP;
            CustomerIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (!String.IsNullOrEmpty(CustomerIP))
                return CustomerIP;
            if (System.Web.HttpContext.Current.Request.ServerVariables["HTTP_VIA"] != null)
            {
                CustomerIP = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                if (CustomerIP == null)
                    CustomerIP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            else
                CustomerIP = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            if (string.Compare(CustomerIP, "unknown", true) == 0)
                return System.Web.HttpContext.Current.Request.UserHostAddress;
            return CustomerIP;
        }
        /// <summary>    
        /// 将时间字符串转为Json时间   
        /// </summary>   
        public string ConvertDateStringToJsonDate(Match m)
        {
            string result = string.Empty;
            DateTime dt = DateTime.Parse(m.Groups[0].Value);
            return DateTimeToJson(dt);
        }
        public static string DateTimeToJson(DateTime dt)
        {
            TimeSpan ts = dt - new DateTime(1970, 1, 1);
            return string.Format("/Date({0})/", ts.TotalMilliseconds - 8 * 3600000);
        }
        /// <summary>   
        /// 反序列化集合对象  
        /// </summary>   
        public T[] JsonDeserializeByArrayData<T>(string jsonString)
        {
            MatchEvaluator matchEvaluator = new MatchEvaluator(ConvertDateStringToJsonDate);
            Regex reg = new Regex(csTimeStr);
            jsonString = reg.Replace(jsonString, matchEvaluator);
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T[]));
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            T[] arrayObj = (T[])ser.ReadObject(ms);
            return arrayObj;
        }
    }
}
