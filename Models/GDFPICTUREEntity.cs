using System;
namespace Models
{
	/// <summary>
	/// GDFPICTURE:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class GDFPICTUREEntity
    {
		public GDFPICTUREEntity()
		{}
		#region Model
		private int _recid;
		private DateTime? _recdate;
		private byte[] _picture;
		private int? _status;
		private int? _ingnalnum;
		private string _signaltxt;
		private string _forecast;
		private string _underwrite;
		private string _canceltxt;
		/// <summary>
		/// 记录号
		/// </summary>
		public int RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 预警发布时间
		/// </summary>
		public DateTime? RECDATE
		{
			set{ _recdate=value;}
			get{return _recdate;}
		}
		/// <summary>
		/// 预警图形
		/// </summary>
		public byte[] PICTURE
		{
			set{ _picture=value;}
			get{return _picture;}
		}
		/// <summary>
		/// 发布状态
		/// </summary>
		public int? STATUS
		{
			set{ _status=value;}
			get{return _status;}
		}
		/// <summary>
		/// 信号掩码
		/// </summary>
		public int? INGNALNUM
		{
			set{ _ingnalnum=value;}
			get{return _ingnalnum;}
		}
		/// <summary>
		/// 信号文本
		/// </summary>
		public string SIGNALTXT
		{
			set{ _signaltxt=value;}
			get{return _signaltxt;}
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
		/// 取消信号文本
		/// </summary>
		public string CANCELTXT
		{
			set{ _canceltxt=value;}
			get{return _canceltxt;}
		}
		#endregion Model

	}
}

