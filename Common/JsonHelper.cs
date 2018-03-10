using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Common
{
    public class JsonHelper
    {
        /// <summary>
        /// json实体反序列化
        /// </summary>
        /// <typeparam name="T">实体类型</typeparam>
        /// <param name="json">json</param>  
        /// <returns>实体</returns>
        public static T Deserialize<T>(string json)
        {
            T t = default(T);
            if (!string.IsNullOrWhiteSpace(json))
            {
                t = (T)JsonConvert.DeserializeObject(json, typeof(T));
            }
            return t;
        }

        /// <summary>
        /// 实体序列化json
        /// </summary>
        /// <typeparam name="T">实体类型</typeparam>
        /// <param name="t">实体</param>
        /// <returns>json</returns>
        public static string Serialize<T>(T t)
        {
            string json = string.Empty;
            if (t != null)
            {
                json = JsonConvert.SerializeObject(t);
            }
            return json;
        }
    }
}
