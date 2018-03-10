using System;
namespace Models
{
	/// <summary>
	/// 预警信号预发布信息
	/// </summary>
	[Serializable]
	public partial class LWS_WARNPREEntity
    {
		public LWS_WARNPREEntity()
		{}
		#region Model
		private int? _recid;
		private DateTime? _ddatetime;
		private string _tvmessage5;
		private string _title;
		private string _forecast;
		private string _underwrite;
		private string _cntime;
		private string _wordshowtimes;
		private int? _istvfax=0;
		private int? _issms=0;
		private int? _isweb=0;
		private DateTime? _writetime= Convert.ToDateTime(DateTime.Now);
		private int? _flagindex;
		private string _signtype;
		private string _signlevel;
		private string _smsmessage;
		private string _msgsms;
		private string _msgblog;
		private string _msgtraffic;
		private int? _filesms=0;
		private int? _fileblog=0;
		private int? _filetraffic=0;
		private int? _filetv=0;
		private int? _filedepart=0;
		private int? _faxtv=0;
		private int? _faxblog=0;
		private int? _faxsms=0;
		private int? _faxtraffic=0;
		private int? _faxled=0;
		private int? _faxdepart=0;
		private int? _faxradio=0;
		private string _tvsignword;
		private string _tvsignpic;
		private string _radiowordtimes;
		private string _msgcar;
		private int? _faxcar=0;
		private int? _filecar=0;
		private int? _fileradio=0;
		private string _msgdepart;
		private string _userip;
		private string _tvmessageen;
		private string _tvmessage;
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
		/// 内容电视台
		/// </summary>
		public string TVMESSAGE5
		{
			set{ _tvmessage5=value;}
			get{return _tvmessage5;}
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
		/// <summary>
		/// 中文日期
		/// </summary>
		public string CNTIME
		{
			set{ _cntime=value;}
			get{return _cntime;}
		}
		/// <summary>
		/// 字幕刊播频率
		/// </summary>
		public string WORDSHOWTIMES
		{
			set{ _wordshowtimes=value;}
			get{return _wordshowtimes;}
		}
		/// <summary>
		/// 是否发传真 0：否1：是
		/// </summary>
		public int? ISTVFAX
		{
			set{ _istvfax=value;}
			get{return _istvfax;}
		}
		/// <summary>
		/// 是否发短信0：否1：是
		/// </summary>
		public int? ISSMS
		{
			set{ _issms=value;}
			get{return _issms;}
		}
		/// <summary>
		/// 是否显示在网站0：否1：是
		/// </summary>
		public int? ISWEB
		{
			set{ _isweb=value;}
			get{return _isweb;}
		}
		/// <summary>
		/// 写入时间
		/// </summary>
		public DateTime? WRITETIME
		{
			set{ _writetime=value;}
			get{return _writetime;}
		}
		/// <summary>
		/// 预警信号代码
		/// </summary>
		public int? FLAGINDEX
		{
			set{ _flagindex=value;}
			get{return _flagindex;}
		}
		/// <summary>
		/// 预警信号类别
		/// </summary>
		public string SIGNTYPE
		{
			set{ _signtype=value;}
			get{return _signtype;}
		}
		/// <summary>
		/// 预警信号级别
		/// </summary>
		public string SIGNLEVEL
		{
			set{ _signlevel=value;}
			get{return _signlevel;}
		}
		/// <summary>
		/// 内容
		/// </summary>
		public string SMSMESSAGE
		{
			set{ _smsmessage=value;}
			get{return _smsmessage;}
		}
		/// <summary>
		/// 全网短信内容
		/// </summary>
		public string MSGSMS
		{
			set{ _msgsms=value;}
			get{return _msgsms;}
		}
		/// <summary>
		/// 微博内容
		/// </summary>
		public string MSGBLOG
		{
			set{ _msgblog=value;}
			get{return _msgblog;}
		}
		/// <summary>
		/// 交通屏内容
		/// </summary>
		public string MSGTRAFFIC
		{
			set{ _msgtraffic=value;}
			get{return _msgtraffic;}
		}
		/// <summary>
		/// 全网短信文件生成 0：否1：是
		/// </summary>
		public int? FILESMS
		{
			set{ _filesms=value;}
			get{return _filesms;}
		}
		/// <summary>
		/// 微博内容文件生成 0：否1：是
		/// </summary>
		public int? FILEBLOG
		{
			set{ _fileblog=value;}
			get{return _fileblog;}
		}
		/// <summary>
		/// 交通屏内容文件生成 0：否1：是
		/// </summary>
		public int? FILETRAFFIC
		{
			set{ _filetraffic=value;}
			get{return _filetraffic;}
		}
		/// <summary>
		/// 电视文件生成 0：否1：是
		/// </summary>
		public int? FILETV
		{
			set{ _filetv=value;}
			get{return _filetv;}
		}
		/// <summary>
		/// 部门文件生成 0：否1：是
		/// </summary>
		public int? FILEDEPART
		{
			set{ _filedepart=value;}
			get{return _filedepart;}
		}
		/// <summary>
		/// 电视台传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXTV
		{
			set{ _faxtv=value;}
			get{return _faxtv;}
		}
		/// <summary>
		/// 微博传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXBLOG
		{
			set{ _faxblog=value;}
			get{return _faxblog;}
		}
		/// <summary>
		/// 短信传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXSMS
		{
			set{ _faxsms=value;}
			get{return _faxsms;}
		}
		/// <summary>
		/// 交通传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXTRAFFIC
		{
			set{ _faxtraffic=value;}
			get{return _faxtraffic;}
		}
		/// <summary>
		/// LED传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXLED
		{
			set{ _faxled=value;}
			get{return _faxled;}
		}
		/// <summary>
		/// 部门传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXDEPART
		{
			set{ _faxdepart=value;}
			get{return _faxdepart;}
		}
		/// <summary>
		/// 电台传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXRADIO
		{
			set{ _faxradio=value;}
			get{return _faxradio;}
		}
		/// <summary>
		/// 电视台信号内容
		/// </summary>
		public string TVSIGNWORD
		{
			set{ _tvsignword=value;}
			get{return _tvsignword;}
		}
		/// <summary>
		/// 电视台信号图片
		/// </summary>
		public string TVSIGNPIC
		{
			set{ _tvsignpic=value;}
			get{return _tvsignpic;}
		}
		/// <summary>
		/// 电台刊播频率
		/// </summary>
		public string RADIOWORDTIMES
		{
			set{ _radiowordtimes=value;}
			get{return _radiowordtimes;}
		}
		/// <summary>
		/// 车载显示屏内容
		/// </summary>
		public string MSGCAR
		{
			set{ _msgcar=value;}
			get{return _msgcar;}
		}
		/// <summary>
		/// 车载信息传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXCAR
		{
			set{ _faxcar=value;}
			get{return _faxcar;}
		}
		/// <summary>
		/// 车载信息文件生成 0：否1：是
		/// </summary>
		public int? FILECAR
		{
			set{ _filecar=value;}
			get{return _filecar;}
		}
		/// <summary>
		/// 电台文件生成 0：否1：是
		/// </summary>
		public int? FILERADIO
		{
			set{ _fileradio=value;}
			get{return _fileradio;}
		}
		/// <summary>
		/// 部门传真内容
		/// </summary>
		public string MSGDEPART
		{
			set{ _msgdepart=value;}
			get{return _msgdepart;}
		}
		/// <summary>
		/// 用户IP
		/// </summary>
		public string USERIP
		{
			set{ _userip=value;}
			get{return _userip;}
		}
		/// <summary>
		/// 电视内容英文
		/// </summary>
		public string TVMESSAGEEN
		{
			set{ _tvmessageen=value;}
			get{return _tvmessageen;}
		}
		/// <summary>
		/// 内容电视台
		/// </summary>
		public string TVMESSAGE
		{
			set{ _tvmessage=value;}
			get{return _tvmessage;}
		}
        /// <summary>
        /// 日期字符
        /// </summary>
        public string Str_DDATETIME
        {
            set;get;
        }
        #endregion Model

    }
}

