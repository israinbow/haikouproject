using System;
namespace Models
{
	/// <summary>
	/// 电视台信号及字幕邮件发送
	/// </summary>
	[Serializable]
	public partial class LWS_TVMAILEntity
    {
		public LWS_TVMAILEntity()
		{}
		#region Model
		private int? _recid;
		private DateTime? _ddatetime;
		private string _message;
		private string _toemail;
		private int? _issend;
		private string _title;
		private string _forecast;
		private string _underwrite;
		/// <summary>
		/// 记录ID
		/// </summary>
		public int? RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 日期
		/// </summary>
		public DateTime? DDATETIME
		{
			set{ _ddatetime=value;}
			get{return _ddatetime;}
		}
		/// <summary>
		/// 内容
		/// </summary>
		public string MESSAGE
		{
			set{ _message=value;}
			get{return _message;}
		}
		/// <summary>
		/// 接收邮箱
		/// </summary>
		public string TOEMAIL
		{
			set{ _toemail=value;}
			get{return _toemail;}
		}
		/// <summary>
		/// 是否已发送
		/// </summary>
		public int? ISSEND
		{
			set{ _issend=value;}
			get{return _issend;}
		}
		/// <summary>
		/// 标题
		/// </summary>
		public string TITLE
		{
			set{ _title=value;}
			get{return _title;}
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
		#endregion Model

	}
}

