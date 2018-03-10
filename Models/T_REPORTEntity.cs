using System;
namespace Models
{
	/// <summary>
	/// T_REPORT:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class T_REPORTEntity
    {
		public T_REPORTEntity()
		{}
		#region Model
		private int _recid;
		private string _filename;
		private string _content;
		private DateTime? _datetime;
		private int? _issent;
		private int? _issuecess;
		private int? _timeconsuming;
		private int? _groupcode;
		private int? _tracecount=0;
		private string _streetfilename;
		private int? _streetissent=0;
		private string _streetcontent;
		private int? _streettracecount=0;
		/// <summary>
		/// 记录ID
		/// </summary>
		public int RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 报文文件名
		/// </summary>
		public string FILENAME
		{
			set{ _filename=value;}
			get{return _filename;}
		}
		/// <summary>
		/// 报文内容
		/// </summary>
		public string CONTENT
		{
			set{ _content=value;}
			get{return _content;}
		}
		/// <summary>
		/// 时间
		/// </summary>
		public DateTime? DATETIME
		{
			set{ _datetime=value;}
			get{return _datetime;}
		}
		/// <summary>
		/// 是否发送
		/// </summary>
		public int? ISSENT
		{
			set{ _issent=value;}
			get{return _issent;}
		}
		/// <summary>
		/// 发送是否成功
		/// </summary>
		public int? ISSUECESS
		{
			set{ _issuecess=value;}
			get{return _issuecess;}
		}
		/// <summary>
		/// 发送耗时
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
		/// 追踪次数
		/// </summary>
		public int? TRACECOUNT
		{
			set{ _tracecount=value;}
			get{return _tracecount;}
		}
		/// <summary>
		/// 街道办报文文件名
		/// </summary>
		public string STREETFILENAME
		{
			set{ _streetfilename=value;}
			get{return _streetfilename;}
		}
		/// <summary>
		/// 街道办是否发送
		/// </summary>
		public int? STREETISSENT
		{
			set{ _streetissent=value;}
			get{return _streetissent;}
		}
		/// <summary>
		/// 街道办报文内容
		/// </summary>
		public string STREETCONTENT
		{
			set{ _streetcontent=value;}
			get{return _streetcontent;}
		}
		/// <summary>
		/// 街道办报文追踪次数
		/// </summary>
		public int? STREETTRACECOUNT
		{
			set{ _streettracecount=value;}
			get{return _streettracecount;}
		}
		#endregion Model

	}
}

