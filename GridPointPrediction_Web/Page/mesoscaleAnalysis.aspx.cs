using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GridPointPrediction_Web.Page
{
    public partial class mesoscaleAnalysis : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        /// <summary>
        /// 设置最新时间
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        public static string SetNewDate()
        {
            DateTime newtime = DateTime.Now;
            string strTimeFileName = @"http://10.155.95.202:8080/data/top/MrZhangEcImage/WaterVaporFlux925hpa.time";
            try
            {
                WebClient MyWebClient = new WebClient();
                MyWebClient.Credentials = CredentialCache.DefaultCredentials;     //获取或设置用于向Internet资源的请求进行身份验证的网络凭据
                Byte[] pageData = MyWebClient.DownloadData(strTimeFileName);           //从指定网站下载数据
                string pageHtml = Encoding.Default.GetString(pageData);
                newtime = DateTime.Parse(pageHtml);

                return newtime.ToString("yyyy-MM-dd HH:mm:ss");
            }
            catch (Exception e)
            {
                //     CreateLogTxt.ErrWriter(e);
            }
            newtime = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute * 10 / 10, 0);
            return newtime.ToString("yyyy-MM-dd HH:mm:ss");
        }   
    }
}