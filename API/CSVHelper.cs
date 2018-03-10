using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Reflection;
using System.Collections;
using System.Web.Caching;
using System.Data;
using DAL;

namespace API
{
    public class CSVHelper
    {
        /// <summary>
        /// 将对象集合转为CSV字符串
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public string List2CSV(ICollection list)
        {
            IEnumerator tor = list.GetEnumerator();
            if (!tor.MoveNext())
                return null;
            StringBuilder sb = new System.Text.StringBuilder();
            PropertyInfo[] prop = Get(tor.Current.GetType());
            for (int i = 0; i < prop.Length; i++)
            {
                if (i > 0)
                    sb.Append(",");
                sb.Append(prop[i].Name);
            }
            sb.AppendLine();
            string str;
            foreach (var model in list)
            {
                for (int i = 0; i < prop.Length; i++)
                {
                    if (i > 0)
                        sb.Append(",");
                    object value = prop[i].GetValue(model, null);
                    if (value is String)
                    {
                        str = value.ToString();
                        str = str.Replace("\"", "\"\"");//替换英文冒号 英文冒号需要换成两个冒号
                        if (str.Contains(',') || str.Contains('\r') || str.Contains('\n')) //含逗号 冒号 换行符的需要放到引号中
                        {
                            sb.Append("\"");
                            sb.Append(str);
                            sb.Append("\"");
                        }
                        else
                            sb.Append(str);
                    }
                    else if (value is Enum)
                        sb.Append((int)value);
                    else if (value is ICollection)
                    {
                        string listStr = List2CSV(value as ICollection);
                        sb.Append("\"");
                        sb.Append(listStr);
                        sb.Append("\"");
                    }
                    else
                        sb.Append(value);
                }
                sb.AppendLine();
            }
            return sb.ToString();
        }

        public string  DataTable2CSV(DataTable table)
        {
            StringBuilder data = new StringBuilder();
            //写出列名称
            for (int i = 0; i < table.Columns.Count; i++)
            {
                data.Append(table.Columns[i].ColumnName.ToString());
                if (i < table.Columns.Count - 1)
                    data.Append(",");
            }
            data.AppendLine();
            //写出各行数据
            for (int i = 0; i < table.Rows.Count; i++)
            {
                for (int j = 0; j < table.Columns.Count; j++)
                {
                    data.Append(table.Rows[i][j].ToString());
                    if (j < table.Columns.Count - 1)
                        data.Append(",");
                }
                data.AppendLine();
            }
            return data.ToString();
        }

        PropertyInfo[] Get(Type T, bool requireSet = false)
        {
            string ckey = "propertyInfo" + T.Name;
            PropertyInfo[] protertyDit = HttpContext.Current.Cache[ckey] as PropertyInfo[];
            if (protertyDit == null)
            {
                List<PropertyInfo> _protertyDit = new List<PropertyInfo>();
                foreach (PropertyInfo prop in T.GetProperties(BindingFlags.Instance | BindingFlags.GetField | BindingFlags.DeclaredOnly | BindingFlags.Public))
                {
                    if (prop.GetIndexParameters().Length > 0)
                        continue;
                    if (requireSet && prop.GetSetMethod(false) == null)
                        continue;
                    var attr = Attribute.GetCustomAttribute(prop, typeof(DbColumnAttribute), true) as DbColumnAttribute;
                    if (attr != null && attr.Ignore)
                        continue;
                    _protertyDit.Add(prop);
                }
                if (_protertyDit.Count > 0)
                {
                    protertyDit = _protertyDit.ToArray();
                    HttpContext.Current.Cache.Add(ckey, protertyDit, null, Cache.NoAbsoluteExpiration, TimeSpan.FromHours(1), CacheItemPriority.Normal, null);
                }
            }
            return protertyDit;
        }
    }
}
