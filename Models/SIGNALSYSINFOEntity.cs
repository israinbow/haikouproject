using System;
namespace Models
{
	/// <summary>
	/// SIGNALSYSINFO:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class SIGNALSYSINFOEntity
    {
		public SIGNALSYSINFOEntity()
		{}
		#region Model
		private int _recid;
		private DateTime? _issuetime;
		private int? _tnumber;
		private string _signaltype;
		private string _signallevel;
		private string _issuecontent;
		private string _district;
		private string _underwriter;
		private string _issuestate;
		private int? _traceflag;
		private int? _tracount;
		private int? _autosentflag=0;
		private int? _autosentcount=0;
		/// <summary>
		/// 记录编号
		/// </summary>
		public int RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 发布时间
		/// </summary>
		public DateTime? ISSUETIME
		{
			set{ _issuetime=value;}
			get{return _issuetime;}
		}
		/// <summary>
		/// 信号编号(取消时需对应此发布序号)
		/// </summary>
		public int? TNUMBER
		{
			set{ _tnumber=value;}
			get{return _tnumber;}
		}
		/// <summary>
		/// 信号类型
		/// </summary>
		public string SIGNALTYPE
		{
			set{ _signaltype=value;}
			get{return _signaltype;}
		}
		/// <summary>
		/// 信号级别
		/// </summary>
		public string SIGNALLEVEL
		{
			set{ _signallevel=value;}
			get{return _signallevel;}
		}
		/// <summary>
		/// 发布内容(即短消息内容)
		/// </summary>
		public string ISSUECONTENT
		{
			set{ _issuecontent=value;}
			get{return _issuecontent;}
		}
		/// <summary>
		/// 信号影响区域
		/// </summary>
		public string DISTRICT
		{
			set{ _district=value;}
			get{return _district;}
		}
		/// <summary>
		/// 信号发布签发人
		/// </summary>
		public string UNDERWRITER
		{
			set{ _underwriter=value;}
			get{return _underwriter;}
		}
		/// <summary>
		/// 发布状态(发布/取消)
		/// </summary>
		public string ISSUESTATE
		{
			set{ _issuestate=value;}
			get{return _issuestate;}
		}
		/// <summary>
		/// 自动检测消息发布状态(写入记录时是为0)
		/// </summary>
		public int? TRACEFLAG
		{
			set{ _traceflag=value;}
			get{return _traceflag;}
		}
		/// <summary>
		/// 自动检测循环次数(写入记录时是为0)
		/// </summary>
		public int? TRACOUNT
		{
			set{ _tracount=value;}
			get{return _tracount;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? AUTOSENTFLAG
		{
			set{ _autosentflag=value;}
			get{return _autosentflag;}
		}
		/// <summary>
		/// 
		/// </summary>
		public int? AUTOSENTCOUNT
		{
			set{ _autosentcount=value;}
			get{return _autosentcount;}
		}
		#endregion Model

	}
}

