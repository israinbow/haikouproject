using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OracleClient;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace GridPointPrediction_Web.Page
{
    public partial class forecastTest : System.Web.UI.Page
    {
        public static string FileName = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button2_Click(object sender, EventArgs e)
        {
            try
            {
               // string name = Request.Form["ContentPlaceHolder1_filename"];
                string fileName = FileName;
                //客户端保存的文件名
                string filePath = Server.MapPath("~/" + FileName);

                FileInfo fileInfo = new FileInfo(filePath);
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.ClearHeaders();
                HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment;filename=" + fileName);
                HttpContext.Current.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                HttpContext.Current.Response.AddHeader("Content-Transfer-Encoding", "binary");
                HttpContext.Current.Response.ContentType = "application/octet-stream";
                HttpContext.Current.Response.WriteFile(fileInfo.FullName);
                HttpContext.Current.Response.Flush();
                // HttpContext.Current.Response.End();
                HttpContext.Current.ApplicationInstance.CompleteRequest();

                File.Delete(filePath);
            }

            catch (Exception ex)
            {
            }
        }

        [WebMethod]
        public static string ExporeData(string[] data, string dType)
        {
            try
            {
                List<string> list = data.ToList();
                string time = DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
                string path = AppDomain.CurrentDomain.BaseDirectory + time;//Server.MapPath(time);

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
                FileName = time;
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

    }
}