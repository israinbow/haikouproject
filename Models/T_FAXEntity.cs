using System;
namespace Models
{
	/// <summary>
	/// T_FAX:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class T_FAXEntity
    {
		public T_FAXEntity()
		{}
		#region Model
		private int _recid;
		private DateTime? _datetime;
		private string _streetinfo;
		private string _message;
		private string _forecast;
		private string _underwrite;
		private int? _tvfaxstatues;
		private int? _depfaxstatues;
		private int? _tvcaptionstatues;
		private int? _timeconsuming;
		private int? _groupcode;
		private int? _faxtraceflag=0;
		private int? _faxtracecount=0;
		private int? _mobinfotraceflag=0;
		private int? _mobinfocount=0;
		private int? _emailtraceflag=0;
		private int? _emailtracecount=0;
		/// <summary>
		/// 记录ID
		/// </summary>
		public int RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 日期
		/// </summary>
		public DateTime? DATETIME
		{
			set{ _datetime=value;}
			get{return _datetime;}
		}
		/// <summary>
		/// 街道信息
		/// </summary>
		public string STREETINFO
		{
			set{ _streetinfo=value;}
			get{return _streetinfo;}
		}
		/// <summary>
		/// 短信内容
		/// </summary>
		public string MESSAGE
		{
			set{ _message=value;}
			get{return _message;}
		}
		/// <summary>
		/// 预报员
		/// </summary>
		public string FORECAST
		{
			set{ _forecast=value;}
			get{return _forecast;}
		}
		/// <summary>
		/// 签发人
		/// </summary>
		public string UNDERWRITE
		{
			set{ _underwrite=value;}
			get{return _underwrite;}
		}
		/// <summary>
		/// 电视台传真状态
		/// </summary>
		public int? TVFAXSTATUES
		{
			set{ _tvfaxstatues=value;}
			get{return _tvfaxstatues;}
		}
		/// <summary>
		/// 部门传真说明
		/// </summary>
		public int? DEPFAXSTATUES
		{
			set{ _depfaxstatues=value;}
			get{return _depfaxstatues;}
		}
		/// <summary>
		/// 电视台字幕状态
		/// </summary>
		public int? TVCAPTIONSTATUES
		{
			set{ _tvcaptionstatues=value;}
			get{return _tvcaptionstatues;}
		}
		/// <summary>
		/// 耗时
		/// </summary>
		public int? TIMECONSUMING
		{
			set{ _timeconsuming=value;}
			get{return _timeconsuming;}
		}
		/// <summary>
		/// 批次
		/// </summary>
		public int? GROUPCODE
		{
			set{ _groupcode=value;}
			get{return _groupcode;}
		}
		/// <summary>
		/// 传真追踪标志
		/// </summary>
		public int? FAXTRACEFLAG
		{
			set{ _faxtraceflag=value;}
			get{return _faxtraceflag;}
		}
		/// <summary>
		/// 传真追踪次数
		/// </summary>
		public int? FAXTRACECOUNT
		{
			set{ _faxtracecount=value;}
			get{return _faxtracecount;}
		}
		/// <summary>
		/// 短信追踪标志
		/// </summary>
		public int? MOBINFOTRACEFLAG
		{
			set{ _mobinfotraceflag=value;}
			get{return _mobinfotraceflag;}
		}
		/// <summary>
		/// 短信追踪数量
		/// </summary>
		public int? MOBINFOCOUNT
		{
			set{ _mobinfocount=value;}
			get{return _mobinfocount;}
		}
		/// <summary>
		/// 邮件追踪标志
		/// </summary>
		public int? EMAILTRACEFLAG
		{
			set{ _emailtraceflag=value;}
			get{return _emailtraceflag;}
		}
		/// <summary>
		/// 邮件追踪数量
		/// </summary>
		public int? EMAILTRACECOUNT
		{
			set{ _emailtracecount=value;}
			get{return _emailtracecount;}
		}
		#endregion Model

	}
}

