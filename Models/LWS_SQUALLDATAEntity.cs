using System;
namespace Models
{
	/// <summary>
	/// 飑线预警自动站实况数据
	/// </summary>
	[Serializable]
	public partial class LWS_SQUALLDATAEntity
    {
		public LWS_SQUALLDATAEntity()
		{}
		#region Model
		private decimal _recid;
		private DateTime _ddatetime;
		private string _obtid;
		private string _obtname;
		private decimal? _longitude;
		private decimal? _latitude;
		private string _city;
		private decimal? _wind;
		private decimal? _rain;
		private decimal? _dbz;
		private DateTime? _crittime;
		/// <summary>
		/// 序列号
		/// </summary>
		public decimal RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 数据时间
		/// </summary>
		public DateTime DDATETIME
		{
			set{ _ddatetime=value;}
			get{return _ddatetime;}
		}
		/// <summary>
		/// 站号
		/// </summary>
		public string OBTID
		{
			set{ _obtid=value;}
			get{return _obtid;}
		}
		/// <summary>
		/// 站名
		/// </summary>
		public string OBTNAME
		{
			set{ _obtname=value;}
			get{return _obtname;}
		}
		/// <summary>
		/// 经度
		/// </summary>
		public decimal? LONGITUDE
		{
			set{ _longitude=value;}
			get{return _longitude;}
		}
		/// <summary>
		/// 纬度
		/// </summary>
		public decimal? LATITUDE
		{
			set{ _latitude=value;}
			get{return _latitude;}
		}
		/// <summary>
		/// 所属地级市
		/// </summary>
		public string CITY
		{
			set{ _city=value;}
			get{return _city;}
		}
		/// <summary>
		/// 风速，单位：1m/s
		/// </summary>
		public decimal? WIND
		{
			set{ _wind=value;}
			get{return _wind;}
		}
		/// <summary>
		/// 雨量，单位：1mm/h
		/// </summary>
		public decimal? RAIN
		{
			set{ _rain=value;}
			get{return _rain;}
		}
		/// <summary>
		/// 雷达回波，单位1dBZ
		/// </summary>
		public decimal? DBZ
		{
			set{ _dbz=value;}
			get{return _dbz;}
		}
		/// <summary>
		/// 数据入库时间
		/// </summary>
		public DateTime? CRITTIME
		{
			set{ _crittime=value;}
			get{return _crittime;}
		}
		#endregion Model

	}
}

