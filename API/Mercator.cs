using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace API
{
    public class Mercator
    {
        double mercator_minLng, mercator_maxLng;
        double mercator_minLat, mercator_maxLat;
        double scaleX, scaleY;

        public Mercator(double minLat, double maxLat, int screenHeight, double minLon, double maxLon, int screenWidth)
        {
            mercator_minLng = Longitude2Mercator(minLon);
            mercator_maxLng = Longitude2Mercator(maxLon);
            scaleX = (mercator_maxLng - mercator_minLng) / screenWidth;

            mercator_maxLat = Latitude2Mercator(maxLat);
            mercator_minLat = Latitude2Mercator(minLat);
            scaleY = (mercator_maxLat - mercator_minLat) / screenHeight;
        }


        #region 墨卡托坐标
        /// <summary>
        /// 经纬度转墨卡托坐标XY
        /// </summary>
        /// <param name="lonLat"></param>
        /// <returns></returns>
        public double[] lonLat2Mercator(double[] lonLat)
        {
            return new double[]{
             Longitude2Mercator(lonLat[0]),
             Latitude2Mercator(lonLat[1])
          };
        }
        /// <summary>
        /// 经度转墨卡托X
        /// </summary>
        /// <param name="longitude"></param>
        /// <returns></returns>
        double Longitude2Mercator(double longitude)
        {
            return longitude * 20037508.34 / 180;
        }
        /// <summary>
        /// 纬度转墨卡托Y
        /// </summary>
        /// <param name="latitude"></param>
        /// <returns></returns>
        double Latitude2Mercator(double latitude)
        {
            double y = Math.Log(Math.Tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
            return y * 20037508.34 / 180;
        }
        /// <summary>
        /// 经度转容器坐标X
        /// </summary>
        /// <param name="lon"></param>
        /// <param name="minLon"></param>
        /// <param name="maxLon"></param>
        /// <param name="screenWidth"></param>
        /// <returns></returns>
        public int Longitude2screentX(double longitude)
        {
            longitude = Longitude2Mercator(longitude);
            return (int)((longitude - mercator_minLng) / scaleX);
        }
        /// <summary>
        /// 纬度转容器坐标Y
        /// </summary>
        /// <param name="lat"></param>
        /// <param name="minLat"></param>
        /// <param name="maxLat"></param>
        /// <param name="screenHeight"></param>
        /// <returns></returns>
        public int Latitude2screentY(double latitude)
        {
            latitude = Latitude2Mercator(latitude);
            return (int)((mercator_maxLat - latitude) / scaleY);
        }
        #endregion
    }
}
