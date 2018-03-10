using System.Configuration;
using System.Text;
using System.IO;
using System;
using System.Data;
using Oracle.DataAccess.Client;

namespace DAL
{
    /// <summary>  
    /// Oracle数据库操作类  
    /// </summary>  
    public class OracleHelper
    {
        private string connstr = "";
        public OracleHelper()
        {
            try
            {

                connstr = ConfigurationManager.ConnectionStrings["EJETDB247ID"].ConnectionString;
                //Conn = new OracleConnection(connEJETDB247LFS); //连接数据库
            }
            catch (Exception e)
            {
                ErrWriter(e);
            }
        }


        public OracleHelper(string connName)
        {
            try
            {
                connstr = ConfigurationManager.ConnectionStrings[connName].ConnectionString;
                //Conn = new OracleConnection(strConn); //连接数据库
            }
            catch (Exception e)
            {
                ErrWriter(e);
            }
        }
        //数据库连接字符串  
        //private readonly static string connstr = ConfigurationManager.ConnectionStrings["EJETDB247IDCTY"].ConnectionString;

        /// <summary>  
        /// 执行数据库查询操作,返回受影响的行数  
        /// </summary>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作影响的数据行数</returns>  
        internal int ExecuteNonQuery(string cmdText, params OracleParameter[] commandParameters)
        {
            using (OracleCommand command = new OracleCommand())
            {
                using (OracleConnection connection = new OracleConnection(connstr))
                {
                    int result = 0;

                    try
                    {
                        PrepareCommand(command, connection, null, CommandType.Text, cmdText, commandParameters);
                        result = command.ExecuteNonQuery();
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return result;
                }
            }
        }

        /// <summary>  
        /// 执行数据库事务查询操作,返回受影响的行数  
        /// </summary>  
        /// <param name="transaction">数据库事务对象</param>  
        /// <param name="cmdType">Command类型</param>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前事务查询操作影响的数据行数</returns>  
        internal int ExecuteNonQuery(OracleTransaction transaction, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            using (transaction)
            {
                using (OracleCommand command = new OracleCommand())
                {
                    using (OracleConnection connection = transaction.Connection)
                    {
                        int result = 0;

                        try
                        {
                            PrepareCommand(command, connection, transaction, cmdType, cmdText, commandParameters);
                            result = command.ExecuteNonQuery();
                            command.Parameters.Clear();
                        }
                        catch
                        {
                            throw;
                        }
                        finally
                        {
                            //transaction.Dispose();
                            //command.Dispose();
                            connection.Close();
                            //connection.Dispose();
                        }

                        return result;
                    }
                }
            }
        }

        /// <summary>  
        /// 执行数据库查询操作,返回受影响的行数  
        /// </summary>  
        /// <param name="connection">Oracle数据库连接对象</param>  
        /// <param name="cmdType">Command类型</param>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作影响的数据行数</returns>  
        internal int ExecuteNonQuery(OracleConnection connection, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            using (connection)
            {
                if (connection == null) throw new ArgumentNullException("当前数据库连接不存在");
                using (OracleCommand command = new OracleCommand())
                {
                    int result = 0;

                    try
                    {
                        PrepareCommand(command, connection, null, cmdType, cmdText, commandParameters);
                        result = command.ExecuteNonQuery();
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return result;
                }
            }
        }

        /// <summary>  
        /// 执行数据库查询操作,返回OracleDataReader类型的内存结果集  
        /// </summary>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作返回的OracleDataReader类型的内存结果集</returns>  
        internal OracleDataReader ExecuteReader(string cmdText, params OracleParameter[] commandParameters)
        {
            using (OracleCommand command = new OracleCommand())
            {
                using (OracleConnection connection = new OracleConnection(connstr))
                {
                    OracleDataReader reader = null;

                    try
                    {
                        PrepareCommand(command, connection, null, CommandType.Text, cmdText, commandParameters);
                        reader = command.ExecuteReader(CommandBehavior.CloseConnection);
                        command.Parameters.Clear();
                        return reader;
                    }
                    catch
                    {
                        //command.Dispose();
                        connection.Close();
                        throw;
                    }
                }
            }
        }

        /// <summary>  
        /// 执行数据库查询操作,返回DataSet类型的结果集  
        /// </summary>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作返回的DataSet类型的结果集</returns>  
        internal DataSet ExecuteDataSet(string cmdText, params OracleParameter[] commandParameters)
        {
            using (OracleCommand command = new OracleCommand())
            {


                using (OracleConnection connection = new OracleConnection(connstr))
                {
                    DataSet dataset = null;

                    try
                    {
                        PrepareCommand(command, connection, null, CommandType.Text, cmdText, commandParameters);
                        OracleDataAdapter adapter = new OracleDataAdapter();
                        adapter.SelectCommand = command;
                        dataset = new DataSet();
                        adapter.Fill(dataset);
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return dataset;
                }
            }
        }

        /// <summary>  
        /// 执行数据库查询操作,返回DataTable类型的结果集  
        /// </summary>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作返回的DataTable类型的结果集</returns>  
        internal DataTable ExecuteDataTable(string cmdText, params OracleParameter[] commandParameters)
        {
            using (OracleCommand command = new OracleCommand())
            {
                using (OracleConnection connection = new OracleConnection(connstr))
                {
                    DataTable table = null;

                    try
                    {
                        PrepareCommand(command, connection, null, CommandType.Text, cmdText, commandParameters);
                        OracleDataAdapter adapter = new OracleDataAdapter();
                        adapter.SelectCommand = command;
                        table = new DataTable();
                        adapter.Fill(table);
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return table;
                }
            }
        }

        //查询数据
        public string db_GreateQuery(string strSQL)
        {
            string dtReturn = "";
            OracleConnection OraConnect = new OracleConnection(connstr);
            try
            {
                OraConnect.Open();
                OracleCommand OraCommand = new OracleCommand(strSQL, OraConnect);
                object obj = OraCommand.ExecuteScalar();
                if (obj != null)
                {
                    dtReturn = obj.ToString();
                }
                OraConnect.Close();
                OraConnect = null;
            }
            catch (Exception e)
            {
                ErrWriter(e);
                OraConnect.Close();
                OraConnect = null;
            }

            return dtReturn;
        }

        public int db_ExecuteNonQuery( string strSQL)
        {
            int dtReturn = 0;
            OracleConnection OraConnect = new OracleConnection(connstr);
            try
            {

                OraConnect.Open();
                OracleCommand OraCommand = new OracleCommand(strSQL, OraConnect);
                dtReturn = OraCommand.ExecuteNonQuery();
                OraConnect.Close();
                OraConnect = null;
            }
            catch (Exception e)
            {
                ErrWriter(e);
                OraConnect.Close();
                OraConnect = null;
            }

            return dtReturn;
        }




        /// <summary>  
        /// 执行数据库查询操作,返回结果集中位于第一行第一列的Object类型的值  
        /// </summary>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作返回的结果集中位于第一行第一列的Object类型的值</returns>  
        internal object ExecuteScalar(string cmdText, params OracleParameter[] commandParameters)
        {
            using (OracleCommand command = new OracleCommand())
            {
                using (OracleConnection connection = new OracleConnection(connstr))
                {
                    object result = null;

                    try
                    {
                        PrepareCommand(command, connection, null, CommandType.Text, cmdText, commandParameters);
                        result = command.ExecuteScalar();
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return result;
                }
            }
        }
        ///    <summary>  
        ///    执行数据库事务查询操作,返回结果集中位于第一行第一列的Object类型的值  
        ///    </summary>  
        ///    <param name="transaction">一个已存在的数据库事务对象</param>  
        ///    <param name="commandType">命令类型</param>  
        ///    <param name="commandText">Oracle存储过程名称或PL/SQL命令</param>  
        ///    <param name="commandParameters">命令参数集合</param>  
        ///    <returns>当前事务查询操作返回的结果集中位于第一行第一列的Object类型的值</returns>  
        internal object ExecuteScalar(OracleTransaction transaction, CommandType commandType, string commandText, params OracleParameter[] commandParameters)
        {
            using (transaction)
            {
                if (transaction == null) throw new ArgumentNullException("当前数据库事务不存在");
                using (OracleConnection connection = transaction.Connection)
                {
                    if (connection == null) throw new ArgumentException("当前事务所在的数据库连接不存在");

                    using (OracleCommand command = new OracleCommand())
                    {
                        object result = null;

                        try
                        {
                            PrepareCommand(command, connection, transaction, commandType, commandText, commandParameters);
                            result = command.ExecuteScalar();
                            command.Parameters.Clear();
                        }
                        catch
                        {
                            throw;
                        }
                        finally
                        {
                            //transaction.Dispose();
                            //command.Dispose();
                            connection.Close();
                            //connection.Dispose();
                        }

                        return result;
                    }
                }
            }
        }

        /// <summary>  
        /// 执行数据库查询操作,返回结果集中位于第一行第一列的Object类型的值  
        /// </summary>  
        /// <param name="connection">数据库连接对象</param>  
        /// <param name="cmdType">Command类型</param>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        /// <returns>当前查询操作返回的结果集中位于第一行第一列的Object类型的值</returns>  
        internal object ExecuteScalar(OracleConnection connection, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            using (connection)
            {
                if (connection == null) throw new ArgumentException("当前数据库连接不存在");
                using (OracleCommand command = new OracleCommand())
                {
                    object result = null;

                    try
                    {
                        PrepareCommand(command, connection, null, cmdType, cmdText, commandParameters);
                        result = command.ExecuteScalar();
                        command.Parameters.Clear();
                    }
                    catch
                    {
                        throw;
                    }
                    finally
                    {
                        //command.Dispose();
                        connection.Close();
                        //connection.Dispose();
                    }

                    return result;
                }
            }
        }
        /// <summary>  
        /// 执行数据库命令前的准备工作  
        /// </summary>  
        /// <param name="command">Command对象</param>  
        /// <param name="connection">数据库连接对象</param>  
        /// <param name="trans">事务对象</param>  
        /// <param name="cmdType">Command类型</param>  
        /// <param name="cmdText">Oracle存储过程名称或PL/SQL命令</param>  
        /// <param name="commandParameters">命令参数集合</param>  
        private void PrepareCommand(OracleCommand command, OracleConnection connection, OracleTransaction trans, CommandType cmdType, string cmdText, OracleParameter[] commandParameters)
        {
            if (connection.State != ConnectionState.Open) connection.Open();

            command.Connection = connection;
            command.CommandText = cmdText;
            command.CommandType = cmdType;

            //if (trans != null) command.Transaction = trans;

            if (commandParameters != null)
            {
                foreach (OracleParameter parm in commandParameters)
                    command.Parameters.Add(parm);
            }
        }

        /// <summary>  
        /// 将.NET日期时间类型转化为Oracle兼容的日期时间格式字符串  
        /// </summary>  
        /// <param name="date">.NET日期时间类型对象</param>  
        /// <returns>Oracle兼容的日期时间格式字符串（如该字符串：TO_DATE('2007-12-1','YYYY-MM-DD')）</returns>  
        internal string GetOracleDateFormat(DateTime date)
        {
            return "TO_DATE('" + date.ToString("yyyy-MM-dd HH:mm:ss") + "','YYYY-MM-DD hh24:mi:ss')";
        }

        /// <summary>  
        /// 将.NET日期时间类型转化为Oracle兼容的日期格式字符串  
        /// </summary>  
        /// <param name="date">.NET日期时间类型对象</param>  
        /// <param name="format">Oracle日期时间类型格式化限定符</param>  
        /// <returns>Oracle兼容的日期时间格式字符串（如该字符串：TO_DATE('2007-12-1','YYYY-MM-DD')）</returns>  
        internal string GetOracleDateFormat(DateTime date, string format)
        {
            if (format == null || format.Trim() == "") format = "YYYY-MM-DD";
            return "TO_DATE('" + date.ToString("yyyy-M-dd") + "','" + format + "')";
        }
        //'yyyy-mm-dd hh24:mi:ss'
        /// <summary>
        /// 将时间字符串类型转化为Oracle兼容的日期格式字符串  
        /// </summary>
        /// <param name="date">（dt.ToString();//2016-11-11 13:21:25 ）</param>
        /// <returns></returns>
        internal string GetOracleDateFormat(string date)
        {
            return "TO_DATE('" + date + "','yyyy-mm-dd hh24:mi:ss')";
        }
        /// <summary>  
        /// 将指定的关键字处理为模糊查询时的合法参数值  
        /// </summary>  
        /// <param name="source">待处理的查询关键字</param>  
        /// <returns>过滤后的查询关键字</returns>  
        internal string HandleLikeKey(string source)
        {
            if (source == null || source.Trim() == "") return null;

            source = source.Replace("[", "[]]");
            source = source.Replace("_", "[_]");
            source = source.Replace("%", "[%]");

            return ("%" + source + "%");
        }

        /// <summary>  
        /// 将文本内容写入到数据库的CLOB字段中（不可用：报连接被关闭的异常）  
        /// </summary>  
        /// <param name="connectionString">数据库连接字符串</param>  
        /// <param name="table">数据库表名称</param>  
        /// <param name="where">指定的WHERE条件语句</param>  
        /// <param name="clobField">CLOB字段的名称</param>  
        /// <param name="content">要写入的文本内容</param>  
        internal void WriteCLOB(string table, string where, string clobField, string content)
        {
            if (String.IsNullOrEmpty(connstr) || String.IsNullOrEmpty(table) || String.IsNullOrEmpty(clobField)) return;

            using (OracleConnection connection = new OracleConnection(connstr))
            {
                OracleCommand command = null;

                try
                {
                    //connection.Open();
                    //command = connection.CreateCommand();
                    //command.CommandText = "SELECT " + clobField + " FROM " + table + " WHERE " + where + " FOR UPDATE";
                    //OracleDataReader reader = command.ExecuteReader();

                    //if (reader != null && reader.HasRows)
                    //{
                    //    reader.Read();
                    //    command.Transaction = command.Connection.BeginTransaction();

                    //    OracleLob lob = reader.GetOracleLob(0);
                    //    byte[] buffer = Encoding.Unicode.GetBytes(content);
                    //    if (lob != OracleLob.Null) lob.Erase();
                    //    lob.Write(buffer, 0, ((buffer.Length % 2 == 0) ? buffer.Length : (buffer.Length - 1)));

                    //    command.Transaction.Commit();
                    //    reader.Close();
                    //}
                }
                catch
                {
                    command.Transaction.Rollback();
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>  
        /// 从数据库中读取CLOB字段的内容并进行输出  
        /// </summary>  
        /// <param name="connectionString">数据库连接字符串</param>  
        /// <param name="table">数据库表名称</param>  
        /// <param name="where">指定的WHERE条件语句</param>  
        /// <param name="clobField">CLOB字段的名称</param>  
        /// <param name="output">保存内容输出的字符串变量</param>  
        internal void ReadCLOB(string connectionString, string table, string where, string clobField, ref string output)
        {
            if (String.IsNullOrEmpty(connectionString) || String.IsNullOrEmpty(table) || String.IsNullOrEmpty(clobField)) return;

            using (OracleConnection connection = new OracleConnection(connectionString))
            {
                OracleCommand command = null;
                StreamReader stream = null;

                try
                {
                    //connection.Open();
                    //command = connection.CreateCommand();
                    //command.CommandText = "SELECT " + clobField + " FROM " + table + " WHERE " + where;
                    //OracleDataReader reader = command.ExecuteReader();

                    //if (reader != null && reader.HasRows)
                    //{
                    //    reader.Read();
                    //    command.Transaction = command.Connection.BeginTransaction();

                    //    OracleLob lob = reader.GetOracleLob(0);
                    //    if (lob != OracleLob.Null)
                    //    {
                    //        stream = new StreamReader(lob, Encoding.Unicode);
                    //        output = stream.ReadToEnd().Trim();
                    //        command.Transaction.Commit();
                    //        reader.Close();
                    //    }
                    //}
                }
                catch
                {
                    command.Transaction.Rollback();
                    throw;
                }
                finally
                {
                    stream.Close();
                    command.Dispose();
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// /错误日志
        /// </summary>
        /// <param name="ex"></param>
        public static void ErrWriter(Exception ex)
        {
            try
            {
                string AppPath = AppDomain.CurrentDomain.BaseDirectory + @"logs";
                if (!File.Exists(AppPath)) Directory.CreateDirectory(AppPath);
                string FileName = DateTime.Now.ToString("yyyyMMdd");
                StreamWriter StrW = new StreamWriter(AppPath + @"/" + FileName + ".log", true);
                string str = string.Empty;
                str = string.Format("时间：{0} Message:{1} \r\n Source:{2} \r\n StackTrace:{3}  \r\n TargetSite{4}", DateTime.Now.ToString(), ex.Message, ex.Source, ex.StackTrace, ex.TargetSite);
                StrW.WriteLine(str);
                StrW.Flush();
                StrW.Close();
            }
            catch { }
        }






    }
}
