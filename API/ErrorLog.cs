using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace API
{
    public class ErrorLog
    {
        public static void Write(Exception ex)
        {
            string binPath = AppDomain.CurrentDomain.BaseDirectory;
            string errorFile = binPath + "/error.txt";
            FileInfo errf = new FileInfo(errorFile);
            StreamWriter sw;
            if (!errf.Exists)
                sw = new StreamWriter(errf.Create());
            else
                sw = errf.AppendText();
            try
            {
                sw.WriteLine(DateTime.Now.ToString("yyyy/MM/dd HH:mm"));
                sw.WriteLine(ex.Message);
                sw.WriteLine(ex.StackTrace);
                sw.Flush();
            }
            finally
            {
                sw.Close();
            }
        }
        public static void Write(string message)
        {
            string binPath = AppDomain.CurrentDomain.BaseDirectory;
            string errorFile = binPath + "/error.txt";
            FileInfo errf = new FileInfo(errorFile);
            StreamWriter sw;
            if (!errf.Exists)
                sw = new StreamWriter(errf.Create());
            else
                sw = errf.AppendText();
            try
            {
                sw.WriteLine(DateTime.Now.ToString("yyyy/MM/dd HH:mm"));
                sw.WriteLine(message);
                sw.Flush();
            }
            finally
            {
                sw.Close();
            }
        }
    }
}
