using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    class Interpolation
    {
        public void demo()
        {
            DataTable dt = null;//数据源
            double RATE = 0.002;
            double xmin = 113.675, xmax = 114.675, ymin = 22.275, ymax = 22.875;
            int xNum = 0, yNum = 0;
            double[] gridValues = AutoStationRainToGrid(dt, xmin, ymin, xmax, ymax, out xNum, out yNum, RATE);
        }
        //将实况信息格点化
        public static double[] AutoStationRainToGrid(DataTable ds, double xmin, double ymin, double xmax, double ymax, out int xNum, out int yNum, double RATE)
        {
            double[] gridValues = null; xNum = 0; yNum = 0;
            try
            {
                if (ds.Rows.Count > 7)
                {
                    //RATE = 0.005;
                    xNum = (int)(Math.Abs(xmax - xmin) / RATE);
                    yNum = (int)(Math.Abs(ymax - ymin) / RATE);
                    gridValues = new double[xNum * yNum];
                    IDWGrid[] list = new IDWGrid[ds.Rows.Count];
                    for (int i = 0; i < list.Length; i++)
                    {
                        list[i] = new IDWGrid();
                        list[i].x = double.Parse(ds.Rows[i]["x"].ToString());
                        list[i].y = double.Parse(ds.Rows[i]["y"].ToString());
                        list[i].z = double.Parse(ds.Rows[i]["z"].ToString()) * 0.1;
                    }

                    double gridx, gridy, gridz;
                    for (int j = 0; j < yNum; j++)
                    {
                        for (int i = 0; i < xNum; i++)
                        {
                            gridx = RATE * i + xmin;
                            gridy = RATE * j + ymin;
                            gridz = DotsToGrid(list, gridx, gridy);

                            gridValues[j * xNum + i] = 0;
                            if (gridz >= 0)
                            {
                                gridValues[j * xNum + i] = gridz;
                            }

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.Writetxtlog(ex.ToString());
            }
            return gridValues;
        }
        private static double DotsToGrid(IDWGrid[] list, double gridx, double gridy)
        {
            try
            {
                for (int i = 0; i < list.Length; i++)
                {
                    list[i].m_Distance = (gridx - list[i].x) * (gridx - list[i].x) + (gridy - list[i].y) * (gridy - list[i].y);
                }
                IComparer IDWComparerGrid = new IDWComparer();
                Array.Sort(list, IDWComparerGrid);
                int numb = 5;
                double edist = 0, value = 0;

                for (int j = 0; j < numb; j++)
                {
                    double dist = list[j].m_Distance;
                    if (dist <= 0.00001)
                    {
                        return (double)list[j].z;
                    }
                    else
                    {
                        dist = ((double)1.00000) / dist;
                        edist += dist;
                        value += list[j].z * dist;
                    }
                }
                if (edist > 0.000000000001)
                    return (value / edist);
                else
                    return 0.0;
            }
            catch (Exception ex)
            {
                //Common.Writetxtlog(ex.ToString());
            }
            return -1;
        }
        class IDWComparer : IComparer
        {
            public int Compare(object info1, object info2)
            {
                IDWGrid fileInfo1 = info1 as IDWGrid;
                IDWGrid fileInfo2 = info2 as IDWGrid;
                if (fileInfo1.m_Distance < fileInfo2.m_Distance) return -1;
                if (fileInfo1.m_Distance > fileInfo2.m_Distance) return 1;
                return 0;
            }
        }
        public class IDWGrid
        {
            public double x, y, z;
            public double m_Distance = 0;
            public IDWGrid()
            {
            }
        }
    }
}
