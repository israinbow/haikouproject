using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public class CommonClass
{
    //取web.config的appSettings节点配置参数值
    public static string GetAppSetValue(string key)
    {
        try
        {
            return ConfigurationManager.AppSettings[key];
        }
        catch (ConfigurationErrorsException e)
        {

            ErrWriter(e.ToString());
        }
        return "";
    }
    //取web.config的connectionStrings节点配置参数值
    public static string GetconnectionStringsValue(string key)
    {
        try
        {
            return ConfigurationManager.ConnectionStrings[key].ConnectionString;
        }
        catch (ConfigurationErrorsException e)
        {
            ErrWriter(e.ToString());
        }
        return "";
    }
    //验证数字
    public static bool Isnum(string num)
    {

        string pattern = @"^(-?\d+)(\.\d+)?$";

        if (!Regex.IsMatch(num, pattern))
        {
            return false;
        }
        else
        {
            return true;
        }

    }
    //数字不足两位加0
    public static string GetFillupZero(string v)
    {
        if (v.Length < 2)
        {
            v = "0" + v;
        }
        return v;
    }
    //判断文件是否可以读取
    public static bool CanReadFiles(string ncName)
    {
        try
        {
            using (FileStream fs = new FileStream(ncName, FileMode.Open, FileAccess.Read))
            {
                using (BinaryReader r = new BinaryReader(fs))
                {
                    r.ReadByte();
                }
            }
        }
        catch (Exception ee)
        {

            Console.WriteLine(ee.ToString());
            CommonClass.ErrWriter(ee.ToString());
            return false;
        }
        return true;
    }

    //错误日志
    public static void ErrWriter(string strSQL)
    {
        try
        {
            System.Console.WriteLine(strSQL);
            string AppPath = AppDomain.CurrentDomain.BaseDirectory + @"Errlogs";
            if (!File.Exists(AppPath)) Directory.CreateDirectory(AppPath);
            string FileName = DateTime.Now.ToString("yyyyMMdd");
            if (File.Exists(AppPath + @"/" + FileName + ".log"))
            {
                FileInfo file = new FileInfo(AppPath + @"/" + FileName + ".log");
                if (file.Length / 1024 / 1024 > 5)
                {
                    return;
                }
            }
            using (FileStream fs = new FileStream(AppPath + @"/" + FileName + ".log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite))
            {
                using (StreamWriter StrW = new StreamWriter(fs, System.Text.Encoding.GetEncoding("GB2312")))
                {
                    StrW.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "：" + strSQL);
                }
            }
        }
        catch { }
    }
    //系统日常日志
    public static void LogWriter(string str)
    {
        try
        {
            System.Console.WriteLine(str);
            string AppPath = AppDomain.CurrentDomain.BaseDirectory + @"logs";
            if (!File.Exists(AppPath)) Directory.CreateDirectory(AppPath);
            string FileName = DateTime.Now.ToString("yyyyMMdd");
            if (File.Exists(AppPath + @"/" + FileName + ".log"))
            {
                FileInfo file = new FileInfo(AppPath + @"/" + FileName + ".log");
                if (file.Length / 1024 / 1024 > 1)
                {
                    return;
                }
            }
            using (FileStream fs = new FileStream(AppPath + @"/" + FileName + ".log", FileMode.Append, FileAccess.Write, FileShare.ReadWrite))
            {
                using (StreamWriter StrW = new StreamWriter(fs, System.Text.Encoding.GetEncoding("GB2312")))
                {
                    StrW.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "：" + str);
                }
            }
        }
        catch { }
    }

    //系统心跳日志
    public static void LogProgressWriter(string str)
    {
        try
        {
            System.Console.WriteLine(str);
            string AppPath = AppDomain.CurrentDomain.BaseDirectory + @"Progresslogs";
            if (!File.Exists(AppPath)) Directory.CreateDirectory(AppPath);

            using (FileStream fs = new FileStream(AppPath + @"/" + "Progresslogs.log", FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite))
            {
                using (StreamWriter StrW = new StreamWriter(fs, System.Text.Encoding.GetEncoding("GB2312")))
                {
                    StrW.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "：" + str);
                }
            }
        }
        catch { }
    }
    //写普通文件
    public static string TxtWriter(string fileName, string str)
    {
        try
        {

            string AppPath = AppDomain.CurrentDomain.BaseDirectory + @"Data";
            if (!File.Exists(AppPath)) Directory.CreateDirectory(AppPath);

            using (FileStream fs = new FileStream(AppPath + @"/" + fileName, FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite))
            {
                using (StreamWriter StrW = new StreamWriter(fs, System.Text.Encoding.ASCII))
                {
                    StrW.WriteLine(str);
                }
            }
            return AppPath + @"/" + fileName;
        }
        catch { }
        return "";
    }
    //datetime转换
    public static string GetDatetimeFormat(DateTime time)
    {
        return "to_date('" + time.ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss')";
    }
    public static DateTime GetLastDayOfMonth(int Year, int Month)
    {
        //这里的关键就是 DateTime.DaysInMonth 获得一个月中的天数
        int Days = DateTime.DaysInMonth(Year, Month);
        return Convert.ToDateTime(Year.ToString() + "-" + Month.ToString() + "-" + Days.ToString());

    }


    public static string PondsBasePath = ConfigurationManager.AppSettings["outputpath"];// @"D:\DataPic\";
    //如果日期目录不存在，则创建目录
    public static string CopyToWebWithCreateDir(DateTime dt, string fullsourcepath, string dirName, string fileName)
    {
        try
        {
            string dir = dt.ToString("yyyyMMdd");
            string fulldir = PondsBasePath + dirName + dir;
            if (System.IO.Directory.Exists(fulldir) == false)
            {
                System.IO.Directory.CreateDirectory(fulldir);
            }
            System.IO.File.Copy(fullsourcepath, fulldir + "\\" + fileName, true);
        }
        catch (Exception e)
        {
            return e.Message;
        }
        return "";
    }


    /// <summary>
    ///删除文件
    /// </summary>
    /// <param name="path">文件路径</param>
    /// <param name="prefix">文件名过滤</param>
    /// <param name="hour">删除几小时前的数据</param>
    public static void DeleteFile(string path, string prefix, int hour)
    {
        try
        {

            if (!Directory.Exists(path))
            {
                return;
            }
            DirectoryInfo di = new DirectoryInfo(path);
            FileSystemInfo[] dirs = di.GetFiles(prefix, SearchOption.AllDirectories);
            IComparer timeComparer = new TimeComparer();
            //排列文件夹(将文件按创建时间排列)
            Array.Sort(dirs, timeComparer);
            for (int j = 0; j < dirs.Length; j++)
            {
                DateTime dt = File.GetLastWriteTime(dirs[dirs.Length - j - 1].FullName);
                if (dt < DateTime.Now.AddHours(-hour))
                {
                    try
                    {
                        Console.WriteLine("Common+DeleteFile 正在删除" + dirs[dirs.Length - j - 1].FullName + "文件……" + DateTime.Now.ToString());
                        File.Delete(dirs[dirs.Length - j - 1].FullName);

                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }
            timeComparer = null;

            System.GC.Collect();


        }
        catch (Exception e)
        {
            Console.WriteLine("CommonClass+DeleteFile" + e.Message + e.Source + DateTime.Now.ToString());
            CommonClass.ErrWriter("Common+DeleteFile" + e.Message + e.Source + DateTime.Now.ToString());
        }
    }


    //删除文件夹里面带yyyyMmdd格式的
    public static void DeleteDirectory(string dirs, int days)
    {

        DateTime stTime = DateTime.Now;
        long sec = 0;
        long minutes = 0;
        long hour = 0;
        long min = 0;

        try
        {

            if (!Directory.Exists(dirs))
            {
                Console.WriteLine("未找到文件夹" + dirs);
                return;
            }
            DirectoryInfo dirFd = new DirectoryInfo(dirs);

            DirectoryInfo[] dirFds = dirFd.GetDirectories("2*", SearchOption.TopDirectoryOnly);

            IComparer timeComparer = new TimeComparerdir();
            //排列文件夹(将文件按创建时间排列)
            Array.Sort(dirFds, timeComparer);
            try
            {
                for (int n = 0; n < dirFds.Length; n++)
                {

                    DateTime dt = Directory.GetCreationTime(dirFds[dirFds.Length - n - 1].FullName);
                    DirectoryInfo di = new DirectoryInfo(dirFds[dirFds.Length - n - 1].FullName);
                    if (dt < DateTime.Now.AddDays(-days))
                    {

                        if (Directory.Exists(dirFds[dirFds.Length - n - 1].FullName))
                        {
                            FileInfo[] files = di.GetFiles("*");
                            if (files != null)
                            {
                                for (int k = 0; k < files.Length; k++)
                                {
                                    try
                                    {
                                        sec = (DateTime.Now.Ticks - stTime.Ticks) / (long)10000000;
                                        minutes = sec / 60;
                                        hour = minutes / 60;
                                        min = minutes - hour * 60;
                                        long second = sec - hour * 60 * 60 - min * 60;


                                        Console.WriteLine("本次清理已经耗时：" + hour.ToString() + "小时" + min.ToString() + "分钟" + second.ToString() + "秒……");

                                        Console.WriteLine("正在删除" + files[k].FullName + "文件……");
                                        System.IO.File.Delete(files[k].FullName);


                                    }
                                    catch (Exception e3)
                                    {
                                        Console.WriteLine("CommonClass+RunDeletee3" + e3.Message + e3.Source + e3.ToString() + DateTime.Now.ToString());
                                        CommonClass.ErrWriter("Common+DeleteFile" + e3.Message + e3.Source + DateTime.Now.ToString());
                                    }
                                }

                            }

                        }

                        Console.WriteLine("正在删除" + dirFds[dirFds.Length - n - 1].FullName + "文件夹……");
                        Directory.Delete(dirFds[dirFds.Length - n - 1].FullName, true);
                    }

                }

            }
            catch (Exception e1)
            {
                Console.WriteLine("CommonClass+RunDeletee1" + e1.Message + e1.Source + e1.ToString() + DateTime.Now.ToString());
                CommonClass.ErrWriter("CommonClass+DeleteFile" + e1.Message + e1.Source + DateTime.Now.ToString());
            }




        }
        catch (Exception e)
        {
            Console.WriteLine("CommonClass+RunDeletee" + e.Message + e.Source + e.ToString() + DateTime.Now.ToString());
            CommonClass.ErrWriter("CommonClass+DeleteFile" + e.Message + e.Source + DateTime.Now.ToString());
        }

        sec = (DateTime.Now.Ticks - stTime.Ticks) / (long)10000000;
        minutes = sec / 60;
        hour = minutes / 60;
        min = minutes - hour * 60;


        Console.WriteLine("本次清理共耗时：" + hour.ToString() + "小时," + min.ToString() + "分钟。");
    }

    //读http文件里面的time
    static public DateTime GetLastTimeWithDir(string Host)
    {

        WebResponse result = null;
        try
        {
            WebRequest req = WebRequest.Create(Host);
            result = req.GetResponse();
            Stream ReceiveStream = result.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("GB2312");
            StreamReader sr = new StreamReader(ReceiveStream, encode);
            string line = sr.ReadLine();
            sr.Close();
            return DateTime.Parse(line);

        }
        catch (Exception ex)
        {
            CommonClass.ErrWriter(ex.ToString());
        }
        finally
        {
            if (result != null)
            {
                result.Close();
            }
        }

        return DateTime.Now.Date.AddHours(DateTime.Now.Hour).AddMinutes(DateTime.Now.Minute / 6 * 6).AddMinutes(-12);
    }
    /// <summary>
    ///读http文件里面的time
    /// </summary>
    /// <param name="count"></param>
    /// <param name="Host"></param>
    /// <returns></returns>
    public static DateTime GetRaderTimeAndCount(out int count, string Host)
    {
        if (Host.IndexOf("http") == -1)
        {
            Host = AppDomain.CurrentDomain.BaseDirectory + Host;
        }
        WebResponse result = null;
        count = 0;
        DateTime time = DateTime.Now;
        try
        {
            WebRequest req = WebRequest.Create(Host);
            result = req.GetResponse();
            Stream ReceiveStream = result.GetResponseStream();
            Encoding encode = System.Text.Encoding.GetEncoding("GB2312");
            StreamReader sr = new StreamReader(ReceiveStream, encode);
            string line = sr.ReadLine();
            count = int.Parse(sr.ReadLine());
            IFormatProvider ifp = new CultureInfo("zh-CN", true);
            DateTime.TryParseExact(line, "yyyyMMddHHmm", ifp, DateTimeStyles.None, out time);
            return time;//new DateTime(int.Parse(line.Substring(0, 4)), int.Parse(line.Substring(4, 2)), int.Parse(line.Substring(6, 2)), int.Parse(line.Substring(8, 2)), int.Parse(line.Substring(10, 2)), 0);

        }
        catch (Exception ex)
        {
            ErrWriter(ex.ToString());
        }
        finally
        {
            if (result != null)
            {
                result.Close();
            }
        }
        return DateTime.Now.Date.AddHours(DateTime.Now.Hour).AddMinutes(DateTime.Now.Minute / 6 * 6).AddMinutes(-12);
    }
    /// <summary>
    ///四舍五入方法 参数，值，保留几位小数
    /// </summary>
    public static double ChinaRound(double value, int decimals)
    {
        if (value < 0)
        {
            return Math.Round(value + 5 / Math.Pow(10, decimals + 1), decimals, MidpointRounding.AwayFromZero);
        }
        else
        {
            return Math.Round(value, decimals, MidpointRounding.AwayFromZero);
        }
    }



    private const double EarthRadius = 6378.137;//地球半径（Km)
    //计算地球两个经纬度之间的距离（Km）
    public double GetSphericalDistance(double x1, double y1, double x2, double y2)
    {
        double lon1 = x1 / 180 * Math.PI;
        double lon2 = x2 / 180 * Math.PI;
        double lat1 = y1 / 180 * Math.PI;
        double lat2 = y2 / 180 * Math.PI;
        return 2 * Math.Asin(Math.Sqrt(Math.Pow((Math.Sin((lat1 - lat2) / 2)), 2) +
         Math.Cos(lat1) * Math.Cos(lat2) * Math.Pow(Math.Sin((lon1 - lon2) / 2), 2))) * EarthRadius;
    }


    //按经纬度取格点ID
    public static int GetZSGridID(double x, double y)
    {
        try
        {
            //得到范围格网数据中的GRIDID
            double xMin = 113.7333000000;
            double yMin = 22.4000000000;
            double xMax = 114.6470600000;
            double yMax = 22.8546100000;

            //格网宽度
            double GridLength = 0.01;
            //格网数量
            int xNum = (int)((xMax - xMin) / GridLength);//60
            int yNum = (int)((yMax - yMin) / GridLength);//60
            //int xNum = (int)Math.Ceiling((xMax - xMin) / GridLength);//61
            //int yNum = (int)Math.Ceiling((yMax - yMin) / GridLength);//61
            //得到客户所在位置的格网序号（yIndex*xNum+xIndex)
            int xIndex = (int)Math.Floor((x - xMin) / GridLength);
            int yIndex = (int)Math.Floor((y - yMin) / GridLength);
            //得到客户所在位置对应的格网ID
            return yIndex * xNum + xIndex;
        }
        catch { return 0; }
    }


    //判断远程文件是否存在
    public static bool RemoteFileExists(string uri)
    {
        HttpWebRequest req = null;
        HttpWebResponse res = null;
        try
        {

            req = (HttpWebRequest)WebRequest.Create(uri);
            req.Method = "HEAD";
            req.Timeout = 500;
            res = (HttpWebResponse)req.GetResponse();
            return (res.StatusCode == HttpStatusCode.OK);
        }
        catch
        {
            return false;
        }
        finally
        {
            if (res != null)
            {
                res.Close();
                res = null;
            }
            if (req != null)
            {
                req.Abort();
                req = null;
            }
        }
    }

    static public bool RemoteFileExists2(string fileUrl)
    {
        bool result = false;//下载结果
        WebResponse response = null;
        try
        {
            WebRequest req = WebRequest.Create(fileUrl);
            req.Timeout = 100;
            response = req.GetResponse();
            result = response == null ? false : true;
        }
        catch (Exception ex)
        {
            result = false;
        }
        finally
        {
            if (response != null)
            {
                response.Close();
            }
        }
        return result;
    }


    //风力级数
    public static int GetWindSpeedClass(double rain)  //----
    {
        if (rain > 0.0 && rain < 0.2) return 0;
        if (rain >= 0.3 && rain < 1.6) return 1;
        if (rain >= 1.6 && rain < 3.4) return 2;
        if (rain >= 3.4 && rain < 5.5) return 3;
        if (rain >= 5.5 && rain < 8.0) return 4;
        if (rain >= 8.0 && rain < 10.8) return 5;
        if (rain >= 10.8 && rain < 13.9) return 6;
        if (rain >= 13.9 && rain < 17.2) return 7;
        if (rain >= 17.2 && rain < 20.8) return 8;
        if (rain >= 20.8 && rain < 24.5) return 9;
        if (rain >= 24.5 && rain < 28.5) return 10;
        if (rain >= 28.5 && rain < 32.6) return 11;
        if (rain >= 32.6 && rain < 41.3) return 12;
        if (rain >= 41.4 && rain < 51.3) return 13;
        if (rain >= 51.3) return 14;
        return 0;
    }


    /// <summary>
    /// 返回Excel数据源
    /// </summary>
    /// <param name="filename">文件路径</param>
    /// <returns></returns>
    public static DataSet ExcelToDataSet(string filename)
    {
        DataSet ds = null;
        string strCon = "Provider=Microsoft.ACE.OLEDB.12.0;" +
                  "Extended Properties=Excel 12.0;" +
                  "data source=" + filename;
        OleDbConnection myConn = new OleDbConnection(strCon);
        try
        {


            myConn.Open();
            DataTable m_tableName = new DataTable();
            m_tableName = myConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);

            if (m_tableName != null && m_tableName.Rows.Count > 0)
            {
                m_tableName.TableName = m_tableName.Rows[0]["TABLE_NAME"].ToString();
            }
            string strCom = "SELECT *  FROM [" + m_tableName.TableName + "]";
            OleDbDataAdapter myCommand = new OleDbDataAdapter(strCom, myConn);
            ds = new DataSet();
            myCommand.Fill(ds);
            myConn.Close();
        }
        catch (Exception ex)
        {

            ErrWriter(ex.ToString());
        }
        finally
        {
            myConn.Close();

        }
        return ds;
    }

}
class TimeComparer : IComparer
{
    public int Compare(object info1, object info2)
    {
        FileInfo fileInfo1 = info1 as FileInfo;
        FileInfo fileInfo2 = info2 as FileInfo;
        DateTime fileTime1 = fileInfo1 == null ? new DateTime() : fileInfo1.LastWriteTime;
        DateTime fileTime2 = fileInfo2 == null ? new DateTime() : fileInfo2.LastWriteTime;
        if (fileTime1 < fileTime2) return -1;
        if (fileTime1 > fileTime2) return 1;
        return 0;
    }
}

class TimeComparerdir : IComparer
{
    public int Compare(object info1, object info2)
    {
        DirectoryInfo fileInfo1 = info1 as DirectoryInfo;
        DirectoryInfo fileInfo2 = info2 as DirectoryInfo;
        DateTime fileTime1 = fileInfo1 == null ? new DateTime() : fileInfo1.CreationTime;
        DateTime fileTime2 = fileInfo2 == null ? new DateTime() : fileInfo2.CreationTime;
        if (fileTime1 < fileTime2) return -1;
        if (fileTime1 > fileTime2) return 1;
        return 0;
    }
}
