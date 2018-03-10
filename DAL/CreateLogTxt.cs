using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace FWS
{
    public class CreateLogTxt
    {
        /// <summary>
        /// 写入错误日志
        /// </summary>
        /// <param name="e">错误对象</param>
        static public void ErrWriter(Exception e)
        {
            try
            {
                string AppPath = AppDomain.CurrentDomain.BaseDirectory + "logs/ErrLog";
                if (!Directory.Exists(AppPath))
                {
                    Directory.CreateDirectory(AppPath);
                }
                string fileName = DateTime.Now.ToString("yyyyMMdd");
                FileStream fs = new FileStream(AppPath + "/" + fileName + ".log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                StreamWriter sw = new StreamWriter(fs);
                string str = string.Empty;
                str = string.Format("时间:{0}Message:{1}\r\n Source:{2}\r\n StackTrace:{3}\r\n TargetSite{4}", DateTime.Now.ToString(), e.Message, e.Source, e.StackTrace, e.TargetSite);
                sw.WriteLine(str);
                sw.Flush();
                sw.Close();
            }
            catch { }
        }
        static public void ErrWriter(string Err)
        {
            try
            {
                string appPath = AppDomain.CurrentDomain.BaseDirectory + "logs/ErrLog";
                if (!Directory.Exists(appPath))
                {
                    Directory.CreateDirectory(appPath);
                }
                string fileName = DateTime.Now.ToString("yyyyMMdd");
                FileStream fs = new FileStream(appPath + "/" + fileName + ".log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                StreamWriter sw = new StreamWriter(fs);
                string str = string.Empty;
                str = string.Format("时间：{0} Message:{1}", DateTime.Now.ToString(), Err);
                sw.WriteLine(str);
                sw.Flush();
                sw.Close();
            }
            catch
            {

            }
        }
        /// <summary>
        /// 写入日志文件
        /// </summary>
        /// <param name="logMsg"></param>
        static public void WriteLog(string logMsg)
        {
            try
            {
                string dirPath = AppDomain.CurrentDomain.BaseDirectory + "logs/log";
                if (!Directory.Exists(dirPath))
                {
                    Directory.CreateDirectory(dirPath);
                }
                string fileName = DateTime.Now.ToString("yyyyMMdd");
                FileStream fs = new FileStream(dirPath + "/" + fileName + ".log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                StreamWriter sw = new StreamWriter(fs);
                string str = string.Format("时间：{0} 消息：{1}", DateTime.Now.ToString(), logMsg);
                sw.WriteLine(str);
                sw.Flush();
                sw.Close();
            }
            catch
            {


            }
        }
    }
}
