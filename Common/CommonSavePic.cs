#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：CommonSavePic
// 文件功能描述：用于保存上传的图片到指定目录
//
// 
// 创建者：名字 (yamatech)
// 时间：2018/1/2 10:19:16
//
// 修改人：
// 时间：
// 修改说明：
//
// 修改人：
// 时间：
// 修改说明：
//
// 版本：V1.0.0
//----------------------------------------------------------------*/
#endregion
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class CommonSavePic
    {
        //完整存储路径
        public static string completeUrl = @"\\10.155.95.201\haikougridweb\Images\upload\UploadAction\";

        public static bool SaveUploadPicture(string imgUrl)
        {
            try
            {
                byte[] myBlob = System.Text.Encoding.UTF8.GetBytes(imgUrl);
                string pic = Convert.ToBase64String(myBlob);
                byte[] imageBytes = Convert.FromBase64String(pic);
                //读入MemoryStream对象
                MemoryStream memoryStream = new MemoryStream(imageBytes, 0, imageBytes.Length);
                memoryStream.Write(imageBytes, 0, imageBytes.Length);
                //转成图片
                Image img = Image.FromStream(memoryStream);
                //添加一级目录
                string relativeOneUrl = DateTime.Now.Year.ToString();
                completeUrl += "\\" + relativeOneUrl;
                if (!Directory.Exists(completeUrl))
                {
                    Directory.CreateDirectory(completeUrl);
                }
                string imgfile = completeUrl + "\\" + img;
                if (File.Exists(imgfile))
                {
                    File.Delete(imgfile);
                }
                img.Save(completeUrl);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
            
        }
        /// <summary>
        /// 将图片上传到指定目录
        /// </summary>
        /// <param name="inputStr">基于base64的图片字符串数据</param>
        /// <param name="imgName">图片名称</param>
        /// <returns></returns>
        public static bool Base64StringToImage(string inputStr,string imgName)
        {
            //判断字符串是否为空
            if (string.IsNullOrWhiteSpace(inputStr))
            {
                return false;
            }               
            try
            {
                byte[] arr = Convert.FromBase64String(inputStr.Substring(inputStr.IndexOf("base64,") + 7).Trim('\0'));
                using (MemoryStream ms = new MemoryStream(arr))
                {
                    Bitmap bmp = new Bitmap(ms);
                    //新建第二个bitmap类型的bmp2变量。
                    Bitmap bmp2 = new Bitmap(bmp, bmp.Width, bmp.Height);
                    //将第一个bmp拷贝到bmp2中
                    Graphics draw = Graphics.FromImage(bmp2);
                    draw.DrawImage(bmp, 0, 0);
                    draw.Dispose();
                    //添加一级目录
                    string relativeOneUrl = DateTime.Now.Year.ToString();
                    string detailDir = DateTime.Now.ToString("yyyyMMdd");
                    completeUrl += "\\" + relativeOneUrl+"\\"+ detailDir;
                    if (!Directory.Exists(completeUrl))
                    {
                        Directory.CreateDirectory(completeUrl);
                    }
                    string imgfile = completeUrl + "\\" + imgName;
                    if (File.Exists(imgfile))
                    {
                        File.Delete(imgfile);
                    }
                    bmp2.Save(imgfile);
                    ms.Close();                   
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
