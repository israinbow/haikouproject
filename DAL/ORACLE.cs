using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.OracleClient;
using System.Data;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Caching;

namespace DAL
{
    public abstract class dbAccess
    {
        public string TableName;
        public Dictionary<string, PropertyInfo> PropertyInfoDict = new Dictionary<string, PropertyInfo>();
        public abstract DataTable getDataTable(string sqlWhere = null, OracleParameter[] dbParams = null, string colList = "*", string orderBy = null, uint skip = 0, uint take = 0, string tableName = null);
    }
    #region 数据表映射实体读写类
    /// <summary>
    /// 这是读写基础类，每一个数据库表映射类，都应该有一个此类型的静态字段，负责该表的所有读写工作
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Access<T> : dbAccess where T : class, new()
    {
        public string[] PrimaryKey;
        public string Identity;
        string sequenceName;
        public string connString;
        string selectColumns = "";

        public Access(string _Connection, string _TableName = null, string[] _PrimaryKey = null, string _Identity = null, string _Sequence = null)
        {
            TableName = _TableName ?? typeof(T).Name;
            PrimaryKey = _PrimaryKey;
            Identity = _Identity;
            sequenceName = _Sequence;
            connString = _Connection;
            foreach (PropertyInfo pinfo in new classProperties().Get(typeof(T)))
            {
                string colName;
                var attr = Attribute.GetCustomAttribute(pinfo, typeof(DbColumnAttribute), true) as DbColumnAttribute;
                if (attr != null && attr.Ignore)
                    continue;
                if (attr != null && attr.ColumnName != null)
                    colName = attr.ColumnName.ToUpper();
                else
                    colName = pinfo.Name.ToUpper();
                PropertyInfoDict[colName] = pinfo;
                if (selectColumns.Length > 0)
                    selectColumns += ",";
                selectColumns += colName;
            }
        }

        #region getScalar
        public object getScalar(string sqlWhere = null, OracleParameter[] dbParams = null, string colList = "*", string orderBy = null, uint skip = 0, uint take = 0)
        {
            string strSql = buildSelectSql(sqlWhere: sqlWhere, colList: colList, orderBy: orderBy, skip: skip, take: take);
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleCommand command = OracleHelp.buidOracleCommand(conn, strSql, dbParams);
                conn.Open();
                return command.ExecuteScalar();
            }
        }
        #endregion

        #region getScalarModel
        public T getScalarModel(string sqlWhere = null, OracleParameter[] dbParams = null, string colList = "*", string orderBy = null, uint skip = 0, uint take = 0)
        {
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleDataReader reader = GetReader(conn, sqlWhere: sqlWhere, dbParams: dbParams, colList: colList, orderBy: orderBy, skip: skip, take: take);
                if (reader.Read())
                {
                    T model = BuildModel(reader);
                    return model;
                }
                return null;
            }
        }
        #endregion

        #region GetModel
        /// <summary>
        /// 用SQL存储过程获得一个Model
        /// </summary>
        ///   
        public T getModelByStorePro(string StoredProcedure, params  OracleParameter[] dbParams)
        {
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleCommand command = OracleHelp.buidOracleCommand(conn, StoredProcedure, dbParams);
                command.CommandType = CommandType.StoredProcedure;
                conn.Open();
                OracleDataReader reader = command.ExecuteReader();
                return BuildModel(reader);
            }
        }

        /// <summary>
        /// 用SQL文本命令获得一个Model
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Struct"></param>
        /// <param name="sqlWhere"></param>
        /// <param name="dbParams"></param>
        /// <returns></returns>
        public T getModel(string sqlWhere, params OracleParameter[] dbParams)
        {
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleDataReader reader = GetReader(conn, sqlWhere: sqlWhere, dbParams: dbParams);
                if (reader.Read())
                {
                    T cacheValue = BuildModel(reader);
                    return cacheValue;
                }
                else
                    return null;
            }
        }
        #endregion

        #region GetList
        public override DataTable getDataTable(string sqlWhere = null, OracleParameter[] dbParams = null, string colList = "*", string orderBy = null, uint skip = 0, uint take = 0, string tableName = null)
        {
            string strSql = buildSelectSql(sqlWhere: sqlWhere, colList: colList, orderBy: orderBy, take: take, skip: skip, tableName: tableName);
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleCommand command = OracleHelp.buidOracleCommand(conn, strSql, dbParams);
                DataSet ds = new DataSet();
                conn.Open();
                OracleDataAdapter da = new OracleDataAdapter(command);
                da.Fill(ds);
                return ds.Tables[0];
            }
        }
        public List<T> getList(string sqlWhere = null, string colList = "*", OracleParameter[] dbParams = null, string orderBy = null, uint skip = 0, uint take = 0, string tableName = null, bool queryByTable = false)
        {
            using (OracleConnection conn = new OracleConnection(connString))
            {
                List<T> list;
                if (queryByTable)
                {
                    list = new List<T>();
                    DataTable dt = getDataTable(sqlWhere, dbParams, colList, orderBy, skip, take, tableName);
                    foreach (DataRow row in dt.Rows)
                    {
                        list.Add(BuildModel(row));
                    }
                }
                else
                {
                    OracleDataReader reader = GetReader(conn, sqlWhere: sqlWhere, dbParams: dbParams, colList: colList, orderBy: orderBy, skip: skip, take: take, tableName: tableName);
                    list = GetList(reader);
                }
                return list;
            }
        }
        public List<T> getListBySQL(string sql, params OracleParameter[] dbParams)
        {
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleDataReader reader = GetReaderBySQL(conn, sql, dbParams);
                return GetList(reader);
            }
        }
        #endregion

        #region  GetReader
        /// <summary>
        /// 用文本命令获得dataReader，尽可能提供OracleCommand，并且显式关闭连接
        /// </summary>
        /// <param name="conn"></param>
        /// <param name="sqlWhere"></param>
        /// <param name="dbParams"></param>
        /// <param name="colList"></param>
        /// <param name="orderBy"></param>
        /// <param name="sort"></param>
        /// <param name="skip"></param>
        /// <param name="take"></param>
        /// <returns></returns>
        OracleDataReader GetReader(OracleConnection Connection, string sqlWhere = null, OracleParameter[] dbParams = null, string colList = "*", string orderBy = null, uint skip = 0, uint take = 0, string tableName = null)
        {
            string strSql = buildSelectSql(sqlWhere: sqlWhere, colList: colList, orderBy: orderBy, take: take, skip: skip, tableName: tableName);
            return GetReaderBySQL(Connection, strSql, dbParams);
        }
        OracleDataReader GetReaderBySQL(OracleConnection Connection, string strSql, params OracleParameter[] dbParams)
        {
            OracleCommand command = OracleHelp.buidOracleCommand(Connection, strSql, dbParams);
            if (Connection.State != ConnectionState.Open)
                Connection.Open();
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }
        #endregion

        #region 删除记录
        public int Delete(T model)
        {
            StringBuilder strSql = new StringBuilder("delete ");
            strSql.Append(this.TableName);
            strSql.Append(" where ");
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleCommand cmd = conn.CreateCommand();
                if (this.PrimaryKey == null)
                    return 0;
                for (int i = 0; i < this.PrimaryKey.Length; i++)
                {
                    if (i == 0)
                    {
                        strSql.Append(this.PrimaryKey[i]);
                        strSql.Append("=:");
                        strSql.Append(this.PrimaryKey[i]);
                    }
                    else
                    {
                        strSql.Append(" and ");
                        strSql.Append(this.PrimaryKey[i]);
                        strSql.Append("=:");
                        strSql.Append(this.PrimaryKey[i]);
                    }
                    cmd.Parameters.Add(new OracleParameter(":" + this.PrimaryKey[i], this.getPrimaryValue(model, i)));
                }
                cmd.CommandText = strSql.ToString();
                try
                {
                    conn.Open();
                    int count = cmd.ExecuteNonQuery();
                    return count;
                }
                finally
                {
                    cmd.Parameters.Clear();
                    conn.Close();
                }
            }
        }
        public int Delete(string sqlWhere, OracleTransaction transcope = null, params OracleParameter[] dbParams)
        {
            StringBuilder strSql = new StringBuilder("delete ");
            strSql.Append(this.TableName);
            strSql.Append(" where ");
            strSql.Append(sqlWhere);
            OracleConnection conn;
            OracleCommand cmd;
            if (transcope != null)
            {
                conn = transcope.Connection;
                cmd = conn.CreateCommand();
                cmd.Transaction = transcope;
            }
            else
            {
                conn = new OracleConnection(connString);
                cmd = conn.CreateCommand();
            }
            cmd.CommandText = strSql.ToString();
            if (dbParams != null)
            {
                MatchCollection arges = Regex.Matches(cmd.CommandText, @":[^)\s^,^%]+");
                for (int i = 0; i < arges.Count; i++)
                {
                    OracleParameter dbp = dbParams.FirstOrDefault(p => p.ParameterName == arges[i].Value);
                    if (dbp != null)
                        cmd.Parameters.Add(dbp);
                }
            }
            try
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                return cmd.ExecuteNonQuery();
            }
            finally
            {
                cmd.Parameters.Clear();
                if (transcope == null)
                    conn.Close();
            }
        }
        #endregion

        #region 添加记录
        /// <summary>
        /// 添加记录
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool Add(T model, OracleTransaction tranScope = null)
        {
            OracleConnection conn;
            OracleCommand comm;
            if (tranScope == null)
            {
                conn = new OracleConnection(connString);
                comm = conn.CreateCommand();
            }
            else
            {
                conn = tranScope.Connection;
                comm = conn.CreateCommand();
                comm.Transaction = tranScope;
            }
            StringBuilder strSql = new StringBuilder("INSERT INTO ");
            StringBuilder strParameter = new StringBuilder();
            strSql.Append(this.TableName);
            strSql.Append("(");
            bool douhao = false, _Identity = false;
            foreach (PropertyInfo pi in PropertyInfoDict.Values)
            {
                object value = pi.GetValue(model, null);
                if (value == null || (Equals(pi.PropertyType, typeof(DateTime)) && (DateTime)value == DateTime.MinValue) || (Equals(pi.PropertyType, typeof(Guid)) && (Guid)value == Guid.Empty))
                    continue;
                if (this.Identity != null && this.Identity.ToLower() == pi.Name.ToLower())
                {
                    _Identity = true;
                    continue;
                }
                if (douhao)
                {
                    strSql.Append(",");
                    strParameter.Append(",");
                }
                else
                    douhao = true;
                strParameter.Append(":");
                strParameter.Append(pi.Name);
                comm.Parameters.Add(new OracleParameter(":" + pi.Name, value));
                strSql.Append(pi.Name); //构造SQL语句前半部份 
            }
            if (_Identity && sequenceName != null)
            {
                strSql.Append(",");
                strSql.Append(this.Identity);
                strParameter.Append(",");
                strParameter.Append(this.sequenceName);
                strParameter.Append(".NextVal");
            }
            strSql.Append(")VALUES(");
            strSql.Append(strParameter);
            strSql.Append(")");
            comm.CommandText = strSql.ToString();
            try
            {
                if (conn.State == ConnectionState.Closed)
                    conn.Open();
                return comm.ExecuteNonQuery() > 0;
            }
            finally
            {
                if (tranScope == null)
                    conn.Close();
            }
        }
        #endregion

        #region 更新记录
        public bool Update(T model, string colList = null)
        {
            StringBuilder strSql = new StringBuilder("update  ");
            strSql.Append(this.TableName);
            strSql.Append(" set ");
            using (OracleConnection conn = new OracleConnection(connString))
            {
                OracleCommand cmd = conn.CreateCommand();
                if (string.IsNullOrEmpty(colList))
                {
                    foreach (PropertyInfo pi in PropertyInfoDict.Values)
                    {
                        object value = pi.GetValue(model, null);
                        if (value == null || (Equals(pi.PropertyType, typeof(DateTime)) && (DateTime)value == DateTime.MinValue) || (Equals(pi.PropertyType, typeof(Guid)) && (Guid)value == Guid.Empty))
                            continue;
                        cmd.Parameters.Add(new OracleParameter(":" + pi.Name, value));
                        if (pi.Name == this.Identity)
                            continue;
                        strSql.Append(pi.Name);
                        strSql.Append("=:");
                        strSql.Append(pi.Name);
                        strSql.Append(",");
                    }
                }
                else
                {
                    string[] strArr = colList.Split(',');
                    foreach (PropertyInfo pi in PropertyInfoDict.Values)
                    {
                        object value = pi.GetValue(model, null);
                        if (value == null || (Equals(pi.PropertyType, typeof(DateTime)) && (DateTime)value == DateTime.MinValue) || (Equals(pi.PropertyType, typeof(Guid)) && (Guid)value == Guid.Empty))
                            continue;
                        for (int i = 0; i < strArr.Length; i++)
                        {
                            if (pi.Name == strArr[i])
                            {
                                strSql.Append(pi.Name);
                                strSql.Append("=:");
                                strSql.Append(pi.Name);
                                strSql.Append(",");
                                cmd.Parameters.Add(new OracleParameter(":" + pi.Name, value));
                                break;
                            }
                        }
                        for (int i = 0; i < this.PrimaryKey.Length; i++)
                        {
                            if (pi.Name == this.PrimaryKey[i])
                            {
                                cmd.Parameters.Add(new OracleParameter(":" + pi.Name, value));
                                continue;
                            }
                        }
                    }
                }
                strSql = strSql.Replace(",", " ", strSql.Length - 1, 1);
                strSql.Append(" where ");
                for (int i = 0; i < this.PrimaryKey.Length; i++)
                {
                    if (i == 0)
                    {
                        strSql.Append(this.PrimaryKey[i]);
                        strSql.Append("=:");
                        strSql.Append(this.PrimaryKey[i]);
                    }
                    else
                    {
                        strSql.Append(" and ");
                        strSql.Append(this.PrimaryKey[i]);
                        strSql.Append("=:");
                        strSql.Append(this.PrimaryKey[i]);
                    }
                }
                cmd.CommandText = strSql.ToString();
                conn.Open();
                int count = cmd.ExecuteNonQuery();
                return count > 0;
            }
        }
        #endregion Update

        public object getPrimaryValue(T model, int index)
        {
            if (PrimaryKey[index] != null)
            {
                foreach (KeyValuePair<string, PropertyInfo> pro in PropertyInfoDict)
                {
                    if (PrimaryKey[index].ToUpper() == pro.Value.Name.ToUpper())
                    {
                        return pro.Value.GetValue(model, null);
                    }
                }
            }
            return null;
        }
        string buildSelectSql(string sqlWhere = "", string colList = "*", string orderBy = null, uint skip = 0, uint take = 0, string tableName = null)
        {
            colList = colList == "*" ? selectColumns : colList;
            StringBuilder strSql = new StringBuilder();
            strSql.Append("SELECT ");
            strSql.Append(colList);
            strSql.Append(" FROM ");
            strSql.Append(tableName ?? TableName);
            if (!string.IsNullOrEmpty(sqlWhere))
            {
                strSql.Append(" WHERE ");
                strSql.Append(sqlWhere);
            }
            if (!string.IsNullOrEmpty(orderBy))
            {
                strSql.Append(" ORDER BY ");
                strSql.Append(orderBy);
            }
            if (skip == 0)
            {
                if (take > 0)
                {
                    strSql.Insert(0, "SELECT * FROM (");
                    strSql.Append(")A WHERE ROWNUM <=");
                    strSql.Append(take);
                }
            }
            else
            {
                if (take == 0)
                {
                    strSql.Insert(0, "SELECT * FROM(select ROWNUM RN,A.* from(");
                    strSql.Append(")A )WHERE RN>");
                    strSql.Append(skip);
                }
                else
                {
                    strSql.Insert(0, "SELECT * FROM(select ROWNUM RN,A.* from(");
                    strSql.AppendFormat(")A WHERE ROWNUM<={0})WHERE RN>{1}", skip + take, skip);
                }

            }
            return strSql.ToString();
        }
        T BuildModel(OracleDataReader reader)
        {
            T model = new T();
            string pname;
            for (int i = 0; i < reader.FieldCount; i++)
            {
                pname = reader.GetName(i).ToUpper();
                if (PropertyInfoDict.ContainsKey(pname))
                    setValue(model, PropertyInfoDict[pname], reader[i]);
            }
            return model;
        }
        T BuildModel(DataRow row)
        {
            T model = new T();
            string pname;
            object[] items = row.ItemArray;
            for (int i = 0; i < items.Length; i++)
            {
                pname = row.Table.Columns[i].ColumnName.ToUpper();
                if (PropertyInfoDict.ContainsKey(pname))
                {
                    setValue(model, PropertyInfoDict[pname], items[i]);
                }
            }
            return model;
        }
        void setValue(T model, PropertyInfo property, object value)
        {
            if (value is Decimal)
            {
                if (property.PropertyType.FullName == "System.Double")
                    property.SetValue(model, (double)(Decimal)value, null);
                else if (property.PropertyType.FullName == "System.Int32")
                    property.SetValue(model, (Int32)(Decimal)value, null);
                else if (property.PropertyType.FullName == "System.Int64")
                    property.SetValue(model, (Int64)(Decimal)value, null);
            }
            else if (property.PropertyType.FullName == "System.Double")
            {
                double temp;
                double.TryParse(value as string, out temp);
                property.SetValue(model, temp, null);
            }
            else
                property.SetValue(model, value == DBNull.Value ? null : value, null);
        }
        List<T> GetList(OracleDataReader reader)
        {
            List<T> rusultList = new List<T>();
            try
            {
                while (reader.Read())
                {
                    T model = BuildModel(reader);
                    rusultList.Add(model);
                }
            }
            finally
            {
                reader.Close();
            }
            return rusultList;
        }
    }
    #endregion

    #region OracleHelp用于自由的数据库访问
    public class OracleHelp
    {
        internal static OracleParameter[] buidCommandParams<T>(string sql, T[] dbParams)
        {
            if (dbParams != null && dbParams.Length > 0)
            {
                OracleParameter[] value = dbParams as OracleParameter[];
                if (value != null)
                    return value;
                else
                {
                    OracleParameter[] result;
                    if (dbParams[0] is OracleParameter)
                    {
                        result = new OracleParameter[dbParams.Length];
                        for (int i = 0; i < dbParams.Length; i++)
                        {
                            result[i] = dbParams[i] as OracleParameter;
                        }
                    }
                    else
                    {
                        MatchCollection arges = Regex.Matches(sql, @":[^)\s^,^%]+");
                        result = new OracleParameter[arges.Count];
                        for (int i = 0; i < arges.Count; i++)
                        {
                            result[i] = new OracleParameter(arges[i].Value, dbParams[i]);
                        }
                    }
                    return result;
                }
            }
            return null;
        }
        internal static OracleCommand buidOracleCommand(OracleConnection Connection, string strSql, IEnumerable<OracleParameter> dbParams)
        {
            OracleCommand command = Connection.CreateCommand();
            if (dbParams != null)
            {
                foreach (OracleParameter p in dbParams)
                {
                    if (p.Value is DateTime)
                    {
                        string dt = "to_date('" + ((DateTime)p.Value).ToString("yyyy-MM-dd HH:mm:ss") + "','yyyy-mm-dd hh24:mi:ss')";
                        strSql = strSql.Replace(p.ParameterName, dt);
                    }
                    else
                        command.Parameters.Add(p);
                }
            }
            command.CommandText = strSql;
            return command;
        }
        /// <summary>
        /// 返回受影响的记录数
        /// </summary>
        public static int ExecuteNonQuery(string SQL, string connection, params object[] dbParams)
        {
            return ExecuteNonQuery(SQL, connection, CommandType.Text, OracleHelp.buidCommandParams(SQL, dbParams));
        }
        public static int ExecuteNonQuery(string SQL, string connection, CommandType CommType, params OracleParameter[] dbParams)
        {
            OracleConnection Connection = new OracleConnection(connection);
            OracleCommand command = buidOracleCommand(Connection, SQL, dbParams);
            command.CommandType = CommType;
            try
            {
                Connection.Open();
                return command.ExecuteNonQuery();
            }
            finally
            {
                command.Parameters.Clear();
                Connection.Close();
            }
        }
        /// <summary>
        /// 返回一个数据表
        /// </summary>
        public static DataTable ExecuteDataTable(string SQL, string connection, params object[] dbParams)
        {
            return ExecuteDataTable(SQL, connection, CommandType.Text, OracleHelp.buidCommandParams(SQL, dbParams));
        }
        public static DataTable ExecuteDataTable(string SQL, string connection, CommandType CommType, params OracleParameter[] dbParams)
        {
            OracleConnection Connection = new OracleConnection(connection);
            OracleCommand command = buidOracleCommand(Connection, SQL, dbParams);
            command.CommandType = CommType;
            try
            {
                DataSet ds = new DataSet();
                Connection.Open();
                OracleDataAdapter da = new OracleDataAdapter(command);
                da.Fill(ds);
                return ds.Tables[0];
            }
            finally
            {
                command.Parameters.Clear();
                Connection.Close();
            }
        }

        /// <summary>
        /// 返回一个SqlDataReader，记得调用方要关闭连接
        /// </summary>
        public static OracleDataReader ExecuteReader(string SQL, string connection, params OracleParameter[] dbParams)
        {
            return ExecuteReader(SQL, connection, CommandType.Text, OracleHelp.buidCommandParams(SQL, dbParams));
        }
        public static OracleDataReader ExecuteReader(string SQL, string connection, CommandType CommType, IEnumerable<OracleParameter> dbParams)
        {
            OracleConnection Connection = new OracleConnection(connection);
            OracleCommand command = buidOracleCommand(Connection, SQL, dbParams);
            command.CommandType = CommType;
            Connection.Open();
            return command.ExecuteReader(CommandBehavior.CloseConnection);
        }

        /// <summary>
        /// 执行查询，返回结果集的第一行第一列的值，忽略其他值
        /// </summary>
        public static object ExecuteScalar(string SQL, string connection, CommandType CommType = CommandType.Text, params OracleParameter[] dbParams)
        {
            using (OracleConnection Connection = new OracleConnection(connection))
            {
                OracleCommand command = buidOracleCommand(Connection, SQL, dbParams);
                command.CommandType = CommType;
                Connection.Open();
                return command.ExecuteScalar();
            }
        }

    }
    #endregion

    #region 数据表映射类辅助方法
    public class classProperties
    {
        internal PropertyInfo[] Get(Type T, bool requireSet = true)
        {
            List<PropertyInfo> protertyDit = new List<PropertyInfo>();
            foreach (PropertyInfo prop in T.GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                if (prop.GetIndexParameters().Length > 0)
                    continue;
                if (requireSet && prop.GetSetMethod(false) == null)
                    continue;
                var attr = Attribute.GetCustomAttribute(prop, typeof(DAL.DbColumnAttribute), true) as DAL.DbColumnAttribute;
                if (attr != null && attr.Ignore)
                    continue;
                protertyDit.Add(prop);
            }
            return protertyDit.ToArray();
        }
    }

    [AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
    public sealed class DbColumnAttribute : Attribute
    {
        public DbColumnAttribute() { }
        public string ColumnName { get; set; }
        public bool Ignore { get; set; }
    }
    #endregion


    #region 缓存管理
    public class MyCacheManager
    {        
        public static void Insert(string key, object value, DateTime absoluteExpiration,  CacheItemPriority priority= CacheItemPriority.Normal, CacheDependency dependencies = null, CacheItemRemovedCallback onRemoveCallback=null)
        {              
            if (value != null)
                 HttpRuntime.Cache.Insert(key, value, dependencies, absoluteExpiration, System.Web.Caching.Cache.NoSlidingExpiration, priority, onRemoveCallback);
        }
        public static void Insert(string key, object value, TimeSpan slidingExpiration, CacheItemPriority priority = CacheItemPriority.Normal, CacheDependency dependencies = null, CacheItemRemovedCallback onRemoveCallback = null)
        {
            if (value != null)
                HttpRuntime.Cache.Insert(key, value, dependencies, System.Web.Caching.Cache.NoAbsoluteExpiration, slidingExpiration, priority, onRemoveCallback);
        }
        public static object Get(string key)
        {
            return HttpRuntime.Cache.Get(key);
        }
        public static void Remove(string key)
        {
            HttpRuntime.Cache.Remove(key);
        }
        public static bool Contains(string key)
        {
            return HttpRuntime.Cache.Get(key)!=null;
        }
    }
    #endregion
}
