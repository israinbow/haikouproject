#region << 版 本 注 释 >>
/*----------------------------------------------------------------
// Copyright (C) 2017 雅码科技
// 版权所有。 
//
// 文件名：DecisionForcastModel
// 文件功能描述：
//
// 
// 创建者：名字 (yamatech)
// 时间：2017/12/12 18:06:18
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public class DecisionForcastModel
    {

    }
    public class DecisionForecastInfo
    {
        private DateTime ddatetime;//预报时间

        public DateTime Ddatetime
        {
            get { return ddatetime; }
            set { ddatetime = value; }
        }

        private int numid;//报文期数

        public int Numid
        {
            get { return numid; }
            set { numid = value; }
        }


        private string subhead;//副标题

        public string Subhead
        {
            get { return subhead; }
            set { subhead = value; }
        }


        private string abstractcontent;//摘要

        public string Abstractcontent
        {
            get { return abstractcontent; }
            set { abstractcontent = value; }
        }


        private string typhoontitle1;//一、台风动态 第一段 标题

        public string Typhoontitle1
        {
            get { return typhoontitle1; }
            set { typhoontitle1 = value; }
        }


        private string typhooncontent1;//一、台风动态 第一段 内容

        public string Typhooncontent1
        {
            get { return typhooncontent1; }
            set { typhooncontent1 = value; }
        }


        private string typhoontitle2;//一、台风动态 第二段 标题

        public string Typhoontitle2
        {
            get { return typhoontitle2; }
            set { typhoontitle2 = value; }
        }


        private string typhooncontent2;// 一、台风动态 第二段 内容

        public string Typhooncontent2
        {
            get { return typhooncontent2; }
            set { typhooncontent2 = value; }
        }


        private string pictyphoontrack;//台风路径图片名称

        public string Pictyphoontrack
        {
            get { return pictyphoontrack; }
            set { pictyphoontrack = value; }
        }


        private string pictyphoonexplain;//台风路径图片说明

        public string Pictyphoonexplain
        {
            get { return pictyphoonexplain; }
            set { pictyphoonexplain = value; }
        }


        private string weathertitle1;//二、天气实况 第一段 标题

        public string Weathertitle1
        {
            get { return weathertitle1; }
            set { weathertitle1 = value; }
        }


        private string weathercontent1;//二、天气实况 第一段 内容

        public string Weathercontent1
        {
            get { return weathercontent1; }
            set { weathercontent1 = value; }
        }


        private string weathertitle2;//二、天气实况 第二段 标题

        public string Weathertitle2
        {
            get { return weathertitle2; }
            set { weathertitle2 = value; }
        }


        private string weathercontent2;//二、天气实况 第二段 内容

        public string Weathercontent2
        {
            get { return weathercontent2; }
            set { weathercontent2 = value; }
        }

        private string weaherpic1;//过程雨量产品图片1名称

        public string Weaherpic1
        {
            get { return weaherpic1; }
            set { weaherpic1 = value; }
        }


        private string weatherpicexplain1;//过程雨量产品图片说明1

        public string Weatherpicexplain1
        {
            get { return weatherpicexplain1; }
            set { weatherpicexplain1 = value; }
        }


        private string weaherpic2;//过程雨量产品图片2名称

        public string Weaherpic2
        {
            get { return weaherpic2; }
            set { weaherpic2 = value; }
        }


        private string weatherpicexplain2;//过程雨量产品图片说明2

        public string Weatherpicexplain2
        {
            get { return weatherpicexplain2; }
            set { weatherpicexplain2 = value; }
        }


        private string rainstaexplain;//过程雨量统计表说明

        public string Rainstaexplain
        {
            get { return rainstaexplain; }
            set { rainstaexplain = value; }
        }


        private string rainstatablepic;//过程雨量统计表

        public string Rainstatablepic
        {
            get { return rainstatablepic; }
            set { rainstatablepic = value; }
        }

        private string weatherforcast;//天气预报

        public string Weatherforcast
        {
            get { return weatherforcast; }
            set { weatherforcast = value; }
        }


        private string defenceadvice;//防御建议

        public string Defenceadvice
        {
            get { return defenceadvice; }
            set { defenceadvice = value; }
        }


        private string createword;//是否生成word

        public string Createword
        {
            get { return createword; }
            set { createword = value; }
        }


        private string oceanforecast;//海洋预报

        public string Oceanforecast
        {
            get { return oceanforecast; }
            set { oceanforecast = value; }
        }

        private string landforecast;//陆地预报

        public string Landforecast
        {
            get { return landforecast; }
            set { landforecast = value; }
        }

        //预报员名字
        private string forecastname;

        public string Forecastname
        {
            get { return forecastname; }
            set { forecastname = value; }
        }
        
        //报文发布时间
        private string forecastdate;
        public string Forecastdate
        {
            get { return forecastdate; }
            set { forecastdate = value; }
        }


    }
}
