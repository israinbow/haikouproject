using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class NCARWeatherPictureDAL
    {
        //根据时间文件得到最新产品时间
        public static DateTime ReadLastTimeFromFile(string timefilepath)
        {
            try
            {
                StreamReader sr = new StreamReader(timefilepath);
                string time = sr.ReadToEnd();
                sr.Dispose();
                sr.Close();
                return DateTime.Parse(time);
            }
            catch
            {

            }
            //如果时间文件不存在或者内容有误，则返回缺省时间
            return DateTime.Now.AddDays(-2).Date.AddHours(8);
        }
    }
}
