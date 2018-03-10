using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using WordCodeLibrary;
using System.Threading.Tasks;

namespace DAL
{
    public class createWordForecast
    {
        static string basePath = HttpContext.Current.Server.MapPath("/Word/");
        private static string WordName = string.Empty;
        //static void Main(string[] args)
        //{
        //    //while (true)
        //    //{
        //    Console.WriteLine(args[0]);
        //        Console.Title = "信息快报生成";
        //        Console.WriteLine("开始---");
        //        //DateTime dt = DateTime.Now;
        //        creatRainWord(args[0]);
        //        Console.WriteLine("等待一分钟--------" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
        //        //Thread.Sleep(1000 * 60);
        //        Console.ReadKey();
        //   // }
        //}
        public static string creatRainWord(string datas)
        {
            try
            {
                string[] strs = datas.Split('#');
                //取数据 
                ArrayList alDemo = new ArrayList();
                ArrayList alWord = new ArrayList();
                string strDemo = "";
                string strWord = "";


                //临时文件目录
                string strTempDir = basePath + @"File\";
                string strWordFileName = "决策快报" + DateTime.Now.ToString("yyyyMMddHHmm") + ".doc";
                string[] files = Directory.GetFiles(basePath + "File");

                if (!Directory.Exists(strTempDir))
                {
                    Directory.CreateDirectory(strTempDir); //创建临时文件目录
                }

                strDemo = "{{setPoint1Title1}}";
                strWord = strs[0];
                alDemo.Add(strDemo); alWord.Add(strWord);

                //setNumber,setName,setPoint,setLevel1Rain,setLevel2Rain,setLevel3Rain,setTimeStr
                strDemo = "{{setPoint1Cont1}}";
                strWord = strs[1];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint1Title2}}";
                strWord = strs[2];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint1Cont2}}";
                strWord = strs[3];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint2Title1}}";
                strWord = strs[4];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint2Cont1}}";
                strWord = strs[5];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint2Title2}}";
                strWord = strs[6];
                alDemo.Add(strDemo); alWord.Add(strWord);
                strDemo = "{{setPoint2Cont2}}";
                strWord = strs[7];
                alDemo.Add(strDemo); alWord.Add(strWord);

                string strDemoDir = basePath + @"WordDemo\";
                string strDemoFullPath = strDemoDir + "WordDemoDecision.doc";
                if (File.Exists(strDemoFullPath))
                {
                    //写文件
                    if (writeWord(alDemo, alWord, strDemoFullPath, strTempDir + strWordFileName))
                    {
                        if (File.Exists(strTempDir + strWordFileName))
                        {
                            //  File.Copy(strTempDir + strWordFileName, strTempWord, true);
                            //try
                            //{


                            //    for (int i = 0; i < files.Length; i++)
                            //    {
                            //        if (Path.GetExtension(files[i]) == ".tmp")
                            //        {
                            //            continue;
                            //        }
                            //        if (Path.GetFileName(files[i]) == strWordFileName)
                            //        {
                            //            continue;
                            //        }
                            //        else
                            //        {
                            //            File.Delete(files[i]);
                            //        }
                            //    }
                            //}
                            //catch (Exception)
                            //{

                            //    throw;
                            //}
                            return strWordFileName;

                        }
                        else
                        {
                            return "文件不存在！";
                        }
                    }
                    else
                    {
                        return "写入失败！";
                    }
                }
                return strWordFileName;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public static bool writeWord(ArrayList alItemName, ArrayList alItemText, string strDemoFile, string strTempFile)
        {
            bool flag = false;
            try
            {
                KillProcess("WINWORD");
                File.Copy(strDemoFile, strTempFile, true);
                CCWordApp cw = new CCWordApp();
                //System.Threading.Thread.Sleep(1000 * 5 );
                if (File.Exists(strTempFile))
                {
                    cw.Open(strTempFile);
                    for (int i = 0; i < alItemName.Count && i < alItemText.Count; i++)
                    {
                        cw.ReplaceText(alItemName[i].ToString(), alItemText[i].ToString());
                    }

                    //for (int i = 0; i < alPicName.Count && i < alPicFilePath.Count; i++)
                    //{
                    //    cw.ReplacePic(alPicName[i].ToString(), alPicFilePath[i].ToString(), alPicWidth[i], alPicHeight[i]);
                    //}
                    cw.Save();
                    cw.Quit();
                    cw = null;
                    if (File.Exists(strDemoFile))
                    {
                        flag = true;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                flag = false;
            }
            KillProcess("WINWORD");
            System.GC.Collect();
            return flag;
        }


        private static void KillProcess(string processName)
        {
            try
            {
                Process[] myproc = Process.GetProcesses();
                foreach (Process item in myproc)
                {
                    if (item.ProcessName == processName)
                    {
                        item.Kill();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
