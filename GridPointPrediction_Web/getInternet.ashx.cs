using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace GridPointPrediction_Web.backService
{
    /// <summary>
    /// getInternet 的摘要说明
    /// </summary>
    public class getInternet : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string url = context.Request.QueryString["url"];
            if (string.IsNullOrEmpty(url) || url.IndexOf("http://") != 0)
                throw new Exception("请输入有效http地址");
            WebClient wc = new WebClient();
            wc.Encoding = Encoding.UTF8;
            string response = wc.DownloadString(url);
            context.Response.Write(response);
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}