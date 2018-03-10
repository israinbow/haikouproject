using System;
namespace Models
{
	/// <summary>
	/// 分区预警电视台Word文件内容
	/// </summary>
	[Serializable]
	public partial class LWS_TVWORDEntity
    {
		public LWS_TVWORDEntity()
		{}
		#region Model
		private int? _recid;
		private DateTime? _ddatetime;
		private string _signmessage;
		private int? _issend=0;
		private string _title;
		private string _forecast;
		private string _underwrite;
		private string _iswordshow;
		private string _cntime;
		private string _wordshowtimes;
		private string _piclist;
		private string _radiotimes;
		private string _radiopic;
		private string _radiotitle;
		private string _radiomessage;
		private string _trafficmessage;
		private string _ledmessage;
		private string _smsmessage;
		private string _blogmessage;
		private int? _fileblog=0;
		private int? _filesms=0;
		private int? _fileradio=0;
		private int? _filetraffic=0;
		private int? _fileled=0;
		private DateTime? _writetime;
		private string _departmessage;
		private int? _filedepart=0;
		private string _lwstrafficmessage;
		private string _provincefilename;
		private string _provincefilemessage;
		private string _stormfilename;
		private string _stormfilemessage;
		private int? _filestorm=0;
		private int? _fileprovince=0;
		private int? _faxtv=0;
		private int? _faxblog=0;
		private int? _faxsms=0;
		private int? _faxradio=0;
		private int? _faxtraffic=0;
		private int? _faxled=0;
		private int? _faxdepart=0;
		private int? _faxcar=0;
		private int? _filecar=0;
		private string _carmessage;
		private int? _istotalsendsms=0;
		private string _messageen;
		private string _contact;
		private string _warningupgradepro;
		private int? _isfaxtvemail=0;
		private int? _isdepartemail=0;
		private string _tvemail;
		private string _departemail;
		private string _message;
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
		/// 信号内容
		/// </summary>
		public string SIGNMESSAGE
		{
			set{ _signmessage=value;}
			get{return _signmessage;}
		}
		/// <summary>
		/// 是否已发送，0：未制作，1：已制作
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
		/// <summary>
		/// 是否字幕刊播
		/// </summary>
		public string ISWORDSHOW
		{
			set{ _iswordshow=value;}
			get{return _iswordshow;}
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
		/// 图片列表
		/// </summary>
		public string PICLIST
		{
			set{ _piclist=value;}
			get{return _piclist;}
		}
		/// <summary>
		/// 电台播报频率
		/// </summary>
		public string RADIOTIMES
		{
			set{ _radiotimes=value;}
			get{return _radiotimes;}
		}
		/// <summary>
		/// 电台图片
		/// </summary>
		public string RADIOPIC
		{
			set{ _radiopic=value;}
			get{return _radiopic;}
		}
		/// <summary>
		/// 电台标题
		/// </summary>
		public string RADIOTITLE
		{
			set{ _radiotitle=value;}
			get{return _radiotitle;}
		}
		/// <summary>
		/// 电台内容
		/// </summary>
		public string RADIOMESSAGE
		{
			set{ _radiomessage=value;}
			get{return _radiomessage;}
		}
		/// <summary>
		/// 交通内容
		/// </summary>
		public string TRAFFICMESSAGE
		{
			set{ _trafficmessage=value;}
			get{return _trafficmessage;}
		}
		/// <summary>
		/// LED内容
		/// </summary>
		public string LEDMESSAGE
		{
			set{ _ledmessage=value;}
			get{return _ledmessage;}
		}
		/// <summary>
		/// 短信内容
		/// </summary>
		public string SMSMESSAGE
		{
			set{ _smsmessage=value;}
			get{return _smsmessage;}
		}
		/// <summary>
		/// 微博内容
		/// </summary>
		public string BLOGMESSAGE
		{
			set{ _blogmessage=value;}
			get{return _blogmessage;}
		}
		/// <summary>
		/// 微博文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILEBLOG
		{
			set{ _fileblog=value;}
			get{return _fileblog;}
		}
		/// <summary>
		/// 短信文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILESMS
		{
			set{ _filesms=value;}
			get{return _filesms;}
		}
		/// <summary>
		/// 电台文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILERADIO
		{
			set{ _fileradio=value;}
			get{return _fileradio;}
		}
		/// <summary>
		/// 交通文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILETRAFFIC
		{
			set{ _filetraffic=value;}
			get{return _filetraffic;}
		}
		/// <summary>
		/// LED文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILELED
		{
			set{ _fileled=value;}
			get{return _fileled;}
		}
		/// <summary>
		/// 入库时间
		/// </summary>
		public DateTime? WRITETIME
		{
			set{ _writetime=value;}
			get{return _writetime;}
		}
		/// <summary>
		/// 部门传真内容
		/// </summary>
		public string DEPARTMESSAGE
		{
			set{ _departmessage=value;}
			get{return _departmessage;}
		}
		/// <summary>
		/// 部门传真文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILEDEPART
		{
			set{ _filedepart=value;}
			get{return _filedepart;}
		}
		/// <summary>
		/// 交通短信内容
		/// </summary>
		public string LWSTRAFFICMESSAGE
		{
			set{ _lwstrafficmessage=value;}
			get{return _lwstrafficmessage;}
		}
		/// <summary>
		/// 省局文件名
		/// </summary>
		public string PROVINCEFILENAME
		{
			set{ _provincefilename=value;}
			get{return _provincefilename;}
		}
		/// <summary>
		/// 省局文件内容
		/// </summary>
		public string PROVINCEFILEMESSAGE
		{
			set{ _provincefilemessage=value;}
			get{return _provincefilemessage;}
		}
		/// <summary>
		/// 强对流文件名
		/// </summary>
		public string STORMFILENAME
		{
			set{ _stormfilename=value;}
			get{return _stormfilename;}
		}
		/// <summary>
		/// 强对流文件内容
		/// </summary>
		public string STORMFILEMESSAGE
		{
			set{ _stormfilemessage=value;}
			get{return _stormfilemessage;}
		}
		/// <summary>
		/// 强对流文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILESTORM
		{
			set{ _filestorm=value;}
			get{return _filestorm;}
		}
		/// <summary>
		/// 省局文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILEPROVINCE
		{
			set{ _fileprovince=value;}
			get{return _fileprovince;}
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
		/// 电台传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXRADIO
		{
			set{ _faxradio=value;}
			get{return _faxradio;}
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
		/// 车载电视传真文件是否已发，0：未发，1：已发，-1：不发
		/// </summary>
		public int? FAXCAR
		{
			set{ _faxcar=value;}
			get{return _faxcar;}
		}
		/// <summary>
		/// 车载电视文件是否已制作，0：未制作，1：已制作
		/// </summary>
		public int? FILECAR
		{
			set{ _filecar=value;}
			get{return _filecar;}
		}
		/// <summary>
		/// 车载电视内容
		/// </summary>
		public string CARMESSAGE
		{
			set{ _carmessage=value;}
			get{return _carmessage;}
		}
		/// <summary>
		/// 高级别预警(台风黄色/橙色/红色,暴雨红色) ,是否发全网短信,0:不发;1:发送
		/// </summary>
		public int? ISTOTALSENDSMS
		{
			set{ _istotalsendsms=value;}
			get{return _istotalsendsms;}
		}
		/// <summary>
		/// 字幕内容英文
		/// </summary>
		public string MESSAGEEN
		{
			set{ _messageen=value;}
			get{return _messageen;}
		}
		/// <summary>
		/// 联系方式
		/// </summary>
		public string CONTACT
		{
			set{ _contact=value;}
			get{return _contact;}
		}
		/// <summary>
		/// 预警信号升级概率
		/// </summary>
		public string WARNINGUPGRADEPRO
		{
			set{ _warningupgradepro=value;}
			get{return _warningupgradepro;}
		}
		/// <summary>
		/// 电视台发邮件状态
		/// </summary>
		public int? ISFAXTVEMAIL
		{
			set{ _isfaxtvemail=value;}
			get{return _isfaxtvemail;}
		}
		/// <summary>
		/// 部门发邮件状态
		/// </summary>
		public int? ISDEPARTEMAIL
		{
			set{ _isdepartemail=value;}
			get{return _isdepartemail;}
		}
		/// <summary>
		/// 电视台已发送邮件
		/// </summary>
		public string TVEMAIL
		{
			set{ _tvemail=value;}
			get{return _tvemail;}
		}
		/// <summary>
		/// 部门已发送邮件
		/// </summary>
		public string DEPARTEMAIL
		{
			set{ _departemail=value;}
			get{return _departemail;}
		}
		/// <summary>
		/// 字幕内容
		/// </summary>
		public string MESSAGE
		{
			set{ _message=value;}
			get{return _message;}
		}
		#endregion Model

	}
}

