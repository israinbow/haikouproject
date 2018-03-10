using System;
namespace Models
{
	/// <summary>
	/// LWS_SQULINEDATA:实体类(属性说明自动提取数据库字段的描述信息)
	/// </summary>
	[Serializable]
	public partial class LWS_SQULINEDATAEntity
    {
		public LWS_SQULINEDATAEntity()
		{}
		#region Model
		private decimal _recid;
		private DateTime _ddatetime;
		private decimal? _lenght;
		private decimal? _avgstrength;
		private decimal? _maxstrength;
		private decimal? _movespeed;
		/// <summary>
		/// 
		/// </summary>
		public decimal RECID
		{
			set{ _recid=value;}
			get{return _recid;}
		}
		/// <summary>
		/// 时间
		/// </summary>
		public DateTime DDATETIME
		{
			set{ _ddatetime=value;}
			get{return _ddatetime;}
		}
		/// <summary>
		/// 飑线长度
		/// </summary>
		public decimal? LENGHT
		{
			set{ _lenght=value;}
			get{return _lenght;}
		}
		/// <summary>
		/// 平均强度
		/// </summary>
		public decimal? AVGSTRENGTH
		{
			set{ _avgstrength=value;}
			get{return _avgstrength;}
		}
		/// <summary>
		/// 最大强度
		/// </summary>
		public decimal? MAXSTRENGTH
		{
			set{ _maxstrength=value;}
			get{return _maxstrength;}
		}
		/// <summary>
		/// 移动速度
		/// </summary>
		public decimal? MOVESPEED
		{
			set{ _movespeed=value;}
			get{return _movespeed;}
		}
		#endregion Model

	}
}

