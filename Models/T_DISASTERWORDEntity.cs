using System;
using System.Collections.Generic;

namespace Maticsoft.Model
{
	/// <summary>
	/// 深圳市灾害性天气监测信息专报
	/// </summary>
	[Serializable]
	public partial class T_DISASTERWORDEntity
	{
		public T_DISASTERWORDEntity()
		{}
		#region Model
		private string _recid;
		private string _periods_1;
		private string _periods_2;
		private string _periods_3;
		private string _title_1;
		private DateTime? _ddatetime;
		private string _typhoon_1;
		private string _typhoon_2;
		private string _typhoon_3;
		private string _typhoon_4;
		private string _typhoon_5;
		private string _typhoon_6;
		private string _typhoon_7;
		private string _typhoon_8;
		private string _typhoon_9;
		private string _typhoon_10;
		private string _typhoon_11;
		private string _typhoon_12;
		private string _typhoon_13;
		private string _typhoon_14;
		private string _livewind_1;
		private string _livewind_2;
		private string _livewind_3;
		private string _livewind_4;
		private string _livewind_5;
		private string _livewind_6;
		private string _livewind_7;
		private string _livewind_8;
		private string _livewind_9;
		private string _livewind_10;
		private string _livewind_11;
		private string _liverain_1;
		private string _liverain_2;
		private string _liverain_3;
		private string _liverain_4;
		private string _liverain_5;
		private string _liverain_6;
		private string _liverain_7;
		private string _liverain_8;
		private string _liverain_9;
		private string _liverain_10;
		private string _liverain_11;
		private string _liverain_12;
		private string _liverain_13;
		private string _liverain_14;
		private string _liverain_15;
		private string _liverain_16;
		private string _warningcase_1;
		private string _warningcase_2;
		private string _warningcase_3;
		private string _warningcase_4;
		private string _newforecast_1;
		private string _newforecast_2;
		private string _newforecast_3;
		private string _newforecast_4;
		private string _served_1;
		private string _served_2;
		private string _served_3;
		private string _decisionsms_1;
		private string _decisionsms_2;
		private string _decisionsms_3;
		private string _decisionsms_4;
		private string _decisionsms_5;
		private string _warningsms_1;
		private string _warningsms_2;
		private string _warningsms_3;
		private string _weibosms_1;
		private string _weibosms_2;
		private string _weibosms_3;
		private string _weichatsms_1;
		private string _weichatsms_2;
		private DateTime? _areabegintime;
		private DateTime? _areaendtime;
		private string _szavgrain;
		private string _szmaxsumrain;
		private string _szmaxhrain;
		private string _szmaxwind;
		private string _szavgwind;
		private string _ytavgrain;
		private string _ytmaxsumrain;
		private string _ytmaxhrain;
		private string _ytmaxwind;
		private string _ytavgwind;
		private string _dpavgrain;
		private string _dpmaxsumrain;
		private string _dpmaxhrain;
		private string _dpmaxwind;
		private string _dpavgwind;
		private string _lhavgrain;
		private string _lhmaxsumrain;
		private string _lhmaxhrain;
		private string _lhmaxwind;
		private string _lhavgwind;
		private string _ftavgrain;
		private string _ftmaxsumrain;
		private string _ftmaxhrain;
		private string _ftmaxwind;
		private string _ftavgwind;
		private string _psavgrain;
		private string _psmaxsumrain;
		private string _psmaxhrain;
		private string _psmaxwind;
		private string _psavgwind;
		private string _lgavgrain;
		private string _lgmaxsumrain;
		private string _lgmaxhrain;
		private string _lgmaxwind;
		private string _lgavgwind;
		private string _nsavgrain;
		private string _nsmaxsumrain;
		private string _nsmaxhrain;
		private string _nsmaxwind;
		private string _nsavgwind;
		private string _loavgrain;
		private string _lomaxsumrain;
		private string _lomaxhrain;
		private string _lomaxwind;
		private string _loavgwind;
		private string _baavgrain;
		private string _bamaxsumrain;
		private string _bamaxhrain;
		private string _bamaxwind;
		private string _baavgwind;
		private string _gmavgrain;
		private string _gmmaxsumrain;
		private string _gmaxhrain;
		private string _gmmaxwind;
		private string _gmavgwind;
		private string _forecaster;
		private string _decisionsms_6;
		/// <summary>
		/// 记录号
		/// </summary>
		public string RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 期数1
		/// </summary>
		public string PERIODS_1
		{
			set{ _periods_1=value;}
			get{return _periods_1;}
		}
		/// <summary>
		/// 期数2
		/// </summary>
		public string PERIODS_2
		{
			set{ _periods_2=value;}
			get{return _periods_2;}
		}
		/// <summary>
		/// 期数3
		/// </summary>
		public string PERIODS_3
		{
			set{ _periods_3=value;}
			get{return _periods_3;}
		}
		/// <summary>
		/// 情况通报标题
		/// </summary>
		public string TITLE_1
		{
			set{ _title_1=value;}
			get{return _title_1;}
		}
		/// <summary>
		/// 时间
		/// </summary>
		public DateTime? DDATETIME
		{
			set{ _ddatetime=value;}
			get{return _ddatetime;}
		}
        public string DDATETIMEstr { get; set; }
        /// <summary>
        /// 台风信息1
        /// </summary>
        public string TYPHOON_1
		{
			set{ _typhoon_1=value;}
			get{return _typhoon_1;}
		}
		/// <summary>
		/// 台风信息2
		/// </summary>
		public string TYPHOON_2
		{
			set{ _typhoon_2=value;}
			get{return _typhoon_2;}
		}
		/// <summary>
		/// 台风信息3
		/// </summary>
		public string TYPHOON_3
		{
			set{ _typhoon_3=value;}
			get{return _typhoon_3;}
		}
		/// <summary>
		/// 台风信息4
		/// </summary>
		public string TYPHOON_4
		{
			set{ _typhoon_4=value;}
			get{return _typhoon_4;}
		}
		/// <summary>
		/// 台风信息5
		/// </summary>
		public string TYPHOON_5
		{
			set{ _typhoon_5=value;}
			get{return _typhoon_5;}
		}
		/// <summary>
		/// 台风信息6
		/// </summary>
		public string TYPHOON_6
		{
			set{ _typhoon_6=value;}
			get{return _typhoon_6;}
		}
		/// <summary>
		/// 台风信息7
		/// </summary>
		public string TYPHOON_7
		{
			set{ _typhoon_7=value;}
			get{return _typhoon_7;}
		}
		/// <summary>
		/// 台风信息8
		/// </summary>
		public string TYPHOON_8
		{
			set{ _typhoon_8=value;}
			get{return _typhoon_8;}
		}
		/// <summary>
		/// 台风信息9
		/// </summary>
		public string TYPHOON_9
		{
			set{ _typhoon_9=value;}
			get{return _typhoon_9;}
		}
		/// <summary>
		/// 台风信息10
		/// </summary>
		public string TYPHOON_10
		{
			set{ _typhoon_10=value;}
			get{return _typhoon_10;}
		}
		/// <summary>
		/// 台风信息11
		/// </summary>
		public string TYPHOON_11
		{
			set{ _typhoon_11=value;}
			get{return _typhoon_11;}
		}
		/// <summary>
		/// 台风信息12
		/// </summary>
		public string TYPHOON_12
		{
			set{ _typhoon_12=value;}
			get{return _typhoon_12;}
		}
		/// <summary>
		/// 台风信息13
		/// </summary>
		public string TYPHOON_13
		{
			set{ _typhoon_13=value;}
			get{return _typhoon_13;}
		}
		/// <summary>
		/// 台风信息14
		/// </summary>
		public string TYPHOON_14
		{
			set{ _typhoon_14=value;}
			get{return _typhoon_14;}
		}
		/// <summary>
		/// 大风实况1
		/// </summary>
		public string LIVEWIND_1
		{
			set{ _livewind_1=value;}
			get{return _livewind_1;}
		}
		/// <summary>
		/// 大风实况2
		/// </summary>
		public string LIVEWIND_2
		{
			set{ _livewind_2=value;}
			get{return _livewind_2;}
		}
		/// <summary>
		/// 大风实况3
		/// </summary>
		public string LIVEWIND_3
		{
			set{ _livewind_3=value;}
			get{return _livewind_3;}
		}
		/// <summary>
		/// 大风实况4
		/// </summary>
		public string LIVEWIND_4
		{
			set{ _livewind_4=value;}
			get{return _livewind_4;}
		}
		/// <summary>
		/// 大风实况5
		/// </summary>
		public string LIVEWIND_5
		{
			set{ _livewind_5=value;}
			get{return _livewind_5;}
		}
		/// <summary>
		/// 大风实况6
		/// </summary>
		public string LIVEWIND_6
		{
			set{ _livewind_6=value;}
			get{return _livewind_6;}
		}
		/// <summary>
		/// 大风实况7
		/// </summary>
		public string LIVEWIND_7
		{
			set{ _livewind_7=value;}
			get{return _livewind_7;}
		}
		/// <summary>
		/// 大风实况8
		/// </summary>
		public string LIVEWIND_8
		{
			set{ _livewind_8=value;}
			get{return _livewind_8;}
		}
		/// <summary>
		/// 大风实况9
		/// </summary>
		public string LIVEWIND_9
		{
			set{ _livewind_9=value;}
			get{return _livewind_9;}
		}
		/// <summary>
		/// 大风实况10
		/// </summary>
		public string LIVEWIND_10
		{
			set{ _livewind_10=value;}
			get{return _livewind_10;}
		}
		/// <summary>
		/// 大风实况11
		/// </summary>
		public string LIVEWIND_11
		{
			set{ _livewind_11=value;}
			get{return _livewind_11;}
		}
		/// <summary>
		/// 降雨实况1
		/// </summary>
		public string LIVERAIN_1
		{
			set{ _liverain_1=value;}
			get{return _liverain_1;}
		}
		/// <summary>
		/// 降雨实况2
		/// </summary>
		public string LIVERAIN_2
		{
			set{ _liverain_2=value;}
			get{return _liverain_2;}
		}
		/// <summary>
		/// 降雨实况3
		/// </summary>
		public string LIVERAIN_3
		{
			set{ _liverain_3=value;}
			get{return _liverain_3;}
		}
		/// <summary>
		/// 降雨实况4
		/// </summary>
		public string LIVERAIN_4
		{
			set{ _liverain_4=value;}
			get{return _liverain_4;}
		}
		/// <summary>
		/// 降雨实况5
		/// </summary>
		public string LIVERAIN_5
		{
			set{ _liverain_5=value;}
			get{return _liverain_5;}
		}
		/// <summary>
		/// 降雨实况6
		/// </summary>
		public string LIVERAIN_6
		{
			set{ _liverain_6=value;}
			get{return _liverain_6;}
		}
		/// <summary>
		/// 降雨实况7
		/// </summary>
		public string LIVERAIN_7
		{
			set{ _liverain_7=value;}
			get{return _liverain_7;}
		}
		/// <summary>
		/// 降雨实况8
		/// </summary>
		public string LIVERAIN_8
		{
			set{ _liverain_8=value;}
			get{return _liverain_8;}
		}
		/// <summary>
		/// 降雨实况9
		/// </summary>
		public string LIVERAIN_9
		{
			set{ _liverain_9=value;}
			get{return _liverain_9;}
		}
		/// <summary>
		/// 降雨实况10
		/// </summary>
		public string LIVERAIN_10
		{
			set{ _liverain_10=value;}
			get{return _liverain_10;}
		}
		/// <summary>
		/// 降雨实况11
		/// </summary>
		public string LIVERAIN_11
		{
			set{ _liverain_11=value;}
			get{return _liverain_11;}
		}
		/// <summary>
		/// 降雨实况12
		/// </summary>
		public string LIVERAIN_12
		{
			set{ _liverain_12=value;}
			get{return _liverain_12;}
		}
		/// <summary>
		/// 降雨实况13
		/// </summary>
		public string LIVERAIN_13
		{
			set{ _liverain_13=value;}
			get{return _liverain_13;}
		}
		/// <summary>
		/// 降雨实况14
		/// </summary>
		public string LIVERAIN_14
		{
			set{ _liverain_14=value;}
			get{return _liverain_14;}
		}
		/// <summary>
		/// 降雨实况15
		/// </summary>
		public string LIVERAIN_15
		{
			set{ _liverain_15=value;}
			get{return _liverain_15;}
		}
		/// <summary>
		/// 降雨实况16
		/// </summary>
		public string LIVERAIN_16
		{
			set{ _liverain_16=value;}
			get{return _liverain_16;}
		}
		/// <summary>
		/// 预警情况1
		/// </summary>
		public string WARNINGCASE_1
		{
			set{ _warningcase_1=value;}
			get{return _warningcase_1;}
		}
		/// <summary>
		/// 预警情况2
		/// </summary>
		public string WARNINGCASE_2
		{
			set{ _warningcase_2=value;}
			get{return _warningcase_2;}
		}
		/// <summary>
		/// 预警情况3
		/// </summary>
		public string WARNINGCASE_3
		{
			set{ _warningcase_3=value;}
			get{return _warningcase_3;}
		}
		/// <summary>
		/// 预警情况4
		/// </summary>
		public string WARNINGCASE_4
		{
			set{ _warningcase_4=value;}
			get{return _warningcase_4;}
		}
		/// <summary>
		/// 最新预报1
		/// </summary>
		public string NEWFORECAST_1
		{
			set{ _newforecast_1=value;}
			get{return _newforecast_1;}
		}
		/// <summary>
		/// 最新预报2
		/// </summary>
		public string NEWFORECAST_2
		{
			set{ _newforecast_2=value;}
			get{return _newforecast_2;}
		}
		/// <summary>
		/// 最新预报3
		/// </summary>
		public string NEWFORECAST_3
		{
			set{ _newforecast_3=value;}
			get{return _newforecast_3;}
		}
		/// <summary>
		/// 最新预报4
		/// </summary>
		public string NEWFORECAST_4
		{
			set{ _newforecast_4=value;}
			get{return _newforecast_4;}
		}
		/// <summary>
		/// 服务情况1
		/// </summary>
		public string SERVED_1
		{
			set{ _served_1=value;}
			get{return _served_1;}
		}
		/// <summary>
		/// 服务情况2
		/// </summary>
		public string SERVED_2
		{
			set{ _served_2=value;}
			get{return _served_2;}
		}
		/// <summary>
		/// 服务情况3
		/// </summary>
		public string SERVED_3
		{
			set{ _served_3=value;}
			get{return _served_3;}
		}
		/// <summary>
		/// 决策服务短信1
		/// </summary>
		public string DECISIONSMS_1
		{
			set{ _decisionsms_1=value;}
			get{return _decisionsms_1;}
		}
		/// <summary>
		/// 决策服务短信2
		/// </summary>
		public string DECISIONSMS_2
		{
			set{ _decisionsms_2=value;}
			get{return _decisionsms_2;}
		}
		/// <summary>
		/// 决策服务短信3
		/// </summary>
		public string DECISIONSMS_3
		{
			set{ _decisionsms_3=value;}
			get{return _decisionsms_3;}
		}
		/// <summary>
		/// 决策服务短信4
		/// </summary>
		public string DECISIONSMS_4
		{
			set{ _decisionsms_4=value;}
			get{return _decisionsms_4;}
		}
		/// <summary>
		/// 决策服务短信5
		/// </summary>
		public string DECISIONSMS_5
		{
			set{ _decisionsms_5=value;}
			get{return _decisionsms_5;}
		}
		/// <summary>
		/// 预警信号短信1
		/// </summary>
		public string WARNINGSMS_1
		{
			set{ _warningsms_1=value;}
			get{return _warningsms_1;}
		}
		/// <summary>
		/// 预警信号短信2
		/// </summary>
		public string WARNINGSMS_2
		{
			set{ _warningsms_2=value;}
			get{return _warningsms_2;}
		}
		/// <summary>
		/// 预警信号短信3
		/// </summary>
		public string WARNINGSMS_3
		{
			set{ _warningsms_3=value;}
			get{return _warningsms_3;}
		}
		/// <summary>
		/// 微博统计1
		/// </summary>
		public string WEIBOSMS_1
		{
			set{ _weibosms_1=value;}
			get{return _weibosms_1;}
		}
		/// <summary>
		/// 微博统计2
		/// </summary>
		public string WEIBOSMS_2
		{
			set{ _weibosms_2=value;}
			get{return _weibosms_2;}
		}
		/// <summary>
		/// 微博统计3
		/// </summary>
		public string WEIBOSMS_3
		{
			set{ _weibosms_3=value;}
			get{return _weibosms_3;}
		}
		/// <summary>
		/// 微信统计1
		/// </summary>
		public string WEICHATSMS_1
		{
			set{ _weichatsms_1=value;}
			get{return _weichatsms_1;}
		}
		/// <summary>
		/// 微信统计2
		/// </summary>
		public string WEICHATSMS_2
		{
			set{ _weichatsms_2=value;}
			get{return _weichatsms_2;}
		}
        public string AREABEGINTIMEStr { get; set; }
        /// <summary>
        /// 各区风雨分布情况开始时间
        /// </summary>
        public DateTime? AREABEGINTIME
		{
			set{ _areabegintime=value;}
			get{return _areabegintime;}
		}
        public string AREAENDTIMEStr { get; set; }
        /// <summary>
        /// 各区风雨分布情况结束时间
        /// </summary>
        public DateTime? AREAENDTIME
		{
			set{ _areaendtime=value;}
			get{return _areaendtime;}
		}
		/// <summary>
		/// 全市平均雨量
		/// </summary>
		public string SZAVGRAIN
		{
			set{ _szavgrain=value;}
			get{return _szavgrain;}
		}
        public double SZAVGRAINDouble { get; set; }
        public string SZAREANAE { get; set; }
        public List<T_DISASTERWORDEntity> list{get;set;}
        public List<T_DISASTERWORDEntity> List_typhoon { get; set; }
        /// <summary>
        /// 全市最大累积雨量
        /// </summary>
        public string SZMAXSUMRAIN
		{
			set{ _szmaxsumrain=value;}
			get{return _szmaxsumrain;}
		}
		/// <summary>
		/// 全市最大滑动雨量
		/// </summary>
		public string SZMAXHRAIN
		{
			set{ _szmaxhrain=value;}
			get{return _szmaxhrain;}
		}
		/// <summary>
		/// 全市最大阵风
		/// </summary>
		public string SZMAXWIND
		{
			set{ _szmaxwind=value;}
			get{return _szmaxwind;}
		}
		/// <summary>
		/// 全市最大平均风
		/// </summary>
		public string SZAVGWIND
		{
			set{ _szavgwind=value;}
			get{return _szavgwind;}
		}
		/// <summary>
		/// 盐田平均雨量
		/// </summary>
		public string YTAVGRAIN
		{
			set{ _ytavgrain=value;}
			get{return _ytavgrain;}
		}
		/// <summary>
		/// 盐田最大累积雨量
		/// </summary>
		public string YTMAXSUMRAIN
		{
			set{ _ytmaxsumrain=value;}
			get{return _ytmaxsumrain;}
		}
		/// <summary>
		/// 盐田最大滑动雨量
		/// </summary>
		public string YTMAXHRAIN
		{
			set{ _ytmaxhrain=value;}
			get{return _ytmaxhrain;}
		}
		/// <summary>
		/// 盐田最大阵风
		/// </summary>
		public string YTMAXWIND
		{
			set{ _ytmaxwind=value;}
			get{return _ytmaxwind;}
		}
		/// <summary>
		/// 盐田最大平均风
		/// </summary>
		public string YTAVGWIND
		{
			set{ _ytavgwind=value;}
			get{return _ytavgwind;}
		}
		/// <summary>
		/// 大鹏平均雨量
		/// </summary>
		public string DPAVGRAIN
		{
			set{ _dpavgrain=value;}
			get{return _dpavgrain;}
		}
		/// <summary>
		/// 大鹏最大累积雨量
		/// </summary>
		public string DPMAXSUMRAIN
		{
			set{ _dpmaxsumrain=value;}
			get{return _dpmaxsumrain;}
		}
		/// <summary>
		/// 大鹏最大滑动雨量
		/// </summary>
		public string DPMAXHRAIN
		{
			set{ _dpmaxhrain=value;}
			get{return _dpmaxhrain;}
		}
		/// <summary>
		/// 大鹏最大阵风
		/// </summary>
		public string DPMAXWIND
		{
			set{ _dpmaxwind=value;}
			get{return _dpmaxwind;}
		}
		/// <summary>
		/// 大鹏最大平均风
		/// </summary>
		public string DPAVGWIND
		{
			set{ _dpavgwind=value;}
			get{return _dpavgwind;}
		}
		/// <summary>
		/// 罗湖平均雨量
		/// </summary>
		public string LHAVGRAIN
		{
			set{ _lhavgrain=value;}
			get{return _lhavgrain;}
		}
		/// <summary>
		/// 罗湖最大累积雨量
		/// </summary>
		public string LHMAXSUMRAIN
		{
			set{ _lhmaxsumrain=value;}
			get{return _lhmaxsumrain;}
		}
		/// <summary>
		/// 罗湖最大滑动雨量
		/// </summary>
		public string LHMAXHRAIN
		{
			set{ _lhmaxhrain=value;}
			get{return _lhmaxhrain;}
		}
		/// <summary>
		/// 罗湖最大阵风
		/// </summary>
		public string LHMAXWIND
		{
			set{ _lhmaxwind=value;}
			get{return _lhmaxwind;}
		}
		/// <summary>
		/// 罗湖最大平均风
		/// </summary>
		public string LHAVGWIND
		{
			set{ _lhavgwind=value;}
			get{return _lhavgwind;}
		}
		/// <summary>
		/// 福田平均雨量
		/// </summary>
		public string FTAVGRAIN
		{
			set{ _ftavgrain=value;}
			get{return _ftavgrain;}
		}
		/// <summary>
		/// 福田最大累积雨量
		/// </summary>
		public string FTMAXSUMRAIN
		{
			set{ _ftmaxsumrain=value;}
			get{return _ftmaxsumrain;}
		}
		/// <summary>
		/// 福田最大滑动雨量
		/// </summary>
		public string FTMAXHRAIN
		{
			set{ _ftmaxhrain=value;}
			get{return _ftmaxhrain;}
		}
		/// <summary>
		/// 福田最大阵风
		/// </summary>
		public string FTMAXWIND
		{
			set{ _ftmaxwind=value;}
			get{return _ftmaxwind;}
		}
		/// <summary>
		/// 福田最大平均风
		/// </summary>
		public string FTAVGWIND
		{
			set{ _ftavgwind=value;}
			get{return _ftavgwind;}
		}
		/// <summary>
		/// 坪山平均雨量
		/// </summary>
		public string PSAVGRAIN
		{
			set{ _psavgrain=value;}
			get{return _psavgrain;}
		}
		/// <summary>
		/// 坪山最大累积雨量
		/// </summary>
		public string PSMAXSUMRAIN
		{
			set{ _psmaxsumrain=value;}
			get{return _psmaxsumrain;}
		}
		/// <summary>
		/// 坪山最大滑动雨量
		/// </summary>
		public string PSMAXHRAIN
		{
			set{ _psmaxhrain=value;}
			get{return _psmaxhrain;}
		}
		/// <summary>
		/// 坪山最大阵风
		/// </summary>
		public string PSMAXWIND
		{
			set{ _psmaxwind=value;}
			get{return _psmaxwind;}
		}
		/// <summary>
		/// 坪山最大平均风
		/// </summary>
		public string PSAVGWIND
		{
			set{ _psavgwind=value;}
			get{return _psavgwind;}
		}
		/// <summary>
		/// 龙岗平均雨量
		/// </summary>
		public string LGAVGRAIN
		{
			set{ _lgavgrain=value;}
			get{return _lgavgrain;}
		}
		/// <summary>
		/// 龙岗最大累积雨量
		/// </summary>
		public string LGMAXSUMRAIN
		{
			set{ _lgmaxsumrain=value;}
			get{return _lgmaxsumrain;}
		}
		/// <summary>
		/// 龙岗最大滑动雨量
		/// </summary>
		public string LGMAXHRAIN
		{
			set{ _lgmaxhrain=value;}
			get{return _lgmaxhrain;}
		}
		/// <summary>
		/// 龙岗最大阵风
		/// </summary>
		public string LGMAXWIND
		{
			set{ _lgmaxwind=value;}
			get{return _lgmaxwind;}
		}
		/// <summary>
		/// 龙岗最大平均风
		/// </summary>
		public string LGAVGWIND
		{
			set{ _lgavgwind=value;}
			get{return _lgavgwind;}
		}
		/// <summary>
		/// 南山平均雨量
		/// </summary>
		public string NSAVGRAIN
		{
			set{ _nsavgrain=value;}
			get{return _nsavgrain;}
		}
		/// <summary>
		/// 南山最大累积雨量
		/// </summary>
		public string NSMAXSUMRAIN
		{
			set{ _nsmaxsumrain=value;}
			get{return _nsmaxsumrain;}
		}
		/// <summary>
		/// 南山最大滑动雨量
		/// </summary>
		public string NSMAXHRAIN
		{
			set{ _nsmaxhrain=value;}
			get{return _nsmaxhrain;}
		}
		/// <summary>
		/// 南山最大阵风
		/// </summary>
		public string NSMAXWIND
		{
			set{ _nsmaxwind=value;}
			get{return _nsmaxwind;}
		}
		/// <summary>
		/// 南山最大平均风
		/// </summary>
		public string NSAVGWIND
		{
			set{ _nsavgwind=value;}
			get{return _nsavgwind;}
		}
		/// <summary>
		/// 龙华平均雨量
		/// </summary>
		public string LOAVGRAIN
		{
			set{ _loavgrain=value;}
			get{return _loavgrain;}
		}
		/// <summary>
		/// 龙华最大累积雨量
		/// </summary>
		public string LOMAXSUMRAIN
		{
			set{ _lomaxsumrain=value;}
			get{return _lomaxsumrain;}
		}
		/// <summary>
		/// 龙华最大滑动雨量
		/// </summary>
		public string LOMAXHRAIN
		{
			set{ _lomaxhrain=value;}
			get{return _lomaxhrain;}
		}
		/// <summary>
		/// 龙华最大阵风
		/// </summary>
		public string LOMAXWIND
		{
			set{ _lomaxwind=value;}
			get{return _lomaxwind;}
		}
		/// <summary>
		/// 龙华最大平均风
		/// </summary>
		public string LOAVGWIND
		{
			set{ _loavgwind=value;}
			get{return _loavgwind;}
		}
		/// <summary>
		/// 宝安平均雨量
		/// </summary>
		public string BAAVGRAIN
		{
			set{ _baavgrain=value;}
			get{return _baavgrain;}
		}
		/// <summary>
		/// 宝安最大累积雨量
		/// </summary>
		public string BAMAXSUMRAIN
		{
			set{ _bamaxsumrain=value;}
			get{return _bamaxsumrain;}
		}
		/// <summary>
		/// 宝安最大滑动雨量
		/// </summary>
		public string BAMAXHRAIN
		{
			set{ _bamaxhrain=value;}
			get{return _bamaxhrain;}
		}
		/// <summary>
		/// 宝安最大阵风
		/// </summary>
		public string BAMAXWIND
		{
			set{ _bamaxwind=value;}
			get{return _bamaxwind;}
		}
		/// <summary>
		/// 宝安最大平均风
		/// </summary>
		public string BAAVGWIND
		{
			set{ _baavgwind=value;}
			get{return _baavgwind;}
		}
		/// <summary>
		/// 光明平均雨量
		/// </summary>
		public string GMAVGRAIN
		{
			set{ _gmavgrain=value;}
			get{return _gmavgrain;}
		}
		/// <summary>
		/// 光明最大累积雨量
		/// </summary>
		public string GMMAXSUMRAIN
		{
			set{ _gmmaxsumrain=value;}
			get{return _gmmaxsumrain;}
		}
		/// <summary>
		/// 光明最大滑动雨量
		/// </summary>
		public string GMAXHRAIN
		{
			set{ _gmaxhrain=value;}
			get{return _gmaxhrain;}
		}
		/// <summary>
		/// 光明最大阵风
		/// </summary>
		public string GMMAXWIND
		{
			set{ _gmmaxwind=value;}
			get{return _gmmaxwind;}
		}
		/// <summary>
		/// 光明最大平均风
		/// </summary>
		public string GMAVGWIND
		{
			set{ _gmavgwind=value;}
			get{return _gmavgwind;}
		}
		/// <summary>
		/// 预报员
		/// </summary>
		public string FORECASTER
		{
			set{ _forecaster=value;}
			get{return _forecaster;}
		}
		/// <summary>
		/// 决策服务短信6
		/// </summary>
		public string DECISIONSMS_6
		{
			set{ _decisionsms_6=value;}
			get{return _decisionsms_6;}
		}
        public string LIVERAIN_17 { get; set; }
        public string LIVERAIN_18 { get; set; }
        public string LIVERAIN_19 { get; set; }
        public string LIVERAIN_20 { get; set; }
        #endregion Model

    }
}

