using System;
using System.ComponentModel;
using System.Collections.Generic;
using FWS;
using System.Collections;
using System.IO;
using Word = Microsoft.Office.Interop.Word;

namespace WordCodeLibrary
{
    /// <summary>
    /// Word文档模板操作类
    /// </summary>
    /// 
        
    public class CCWordApp
    {
        private Word.ApplicationClass oWordApplic;	// a reference to Word application
        private Word.Document oDoc;					// a reference to the document
        

        public CCWordApp()
        {
            try
            {
                oWordApplic = new Word.ApplicationClass();
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
        }

        // Open a file (the file must exists) and activate it
        public void Open(string strFileName)
        {
            try
            {
                object fileName = strFileName;
                object readOnly = false;
                object isVisible = true;
                object missing = System.Reflection.Missing.Value;

                oDoc = oWordApplic.Documents.Open(ref fileName, ref missing, ref readOnly,
                    ref missing, ref missing, ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref isVisible, ref missing, ref missing, ref missing);

                oDoc.Activate();
            }
            catch (Exception ex)
            {
                CreateLogTxt.ErrWriter(ex);
            }
        }
        public void ReplaceText(string oldstr, string newstr)
        {
            try
            {
                //if (newstr.Length > 255) {
                //   newstr= newstr.Substring(0, 250) + "...";
                //}
                if (newstr.Length > 255)
                {
                    int count = newstr.Length / 255 + ((newstr.Length % 255) == 0 ? 0 : 1);
                   List<string> origianlStringList = new List<string>();
                   List<string> destinationStringList = new List<string>();
                    for (int i = 0; i < count; i++)
                    {
                        origianlStringList.Add("$$$" + i.ToString() + "$");
                       int length;//每小段的长度  
                        if (i != count - 1)
                        {
                            length = 255;
                        }
                        else
                        {
                            length = newstr.Length % 255;
                        }
                        destinationStringList.Add(newstr.Substring(i * 255, length));
                    }
                    string origianlStringListTotalString = string.Empty;
                    for (int i = 0; i < count; i++)
                    {
                        origianlStringListTotalString += origianlStringList[i];
                    }
                    this.ReplaceText(oldstr, origianlStringListTotalString);
                    for (int i = 0; i < count; i++)
                    {
                        this.ReplaceText(origianlStringList[i], destinationStringList[i]);
                    }
                    return;
                }

                object replaceAll = Word.WdReplace.wdReplaceAll;

                oWordApplic.Selection.Find.ClearFormatting();
                oWordApplic.Selection.Find.Text = oldstr;

                oWordApplic.Selection.Find.Replacement.ClearFormatting();
                oWordApplic.Selection.Find.Replacement.Text = newstr;
                object missing = Type.Missing;
                oWordApplic.Selection.Find.Execute(
                    ref missing, ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref missing, ref missing,
                    ref replaceAll, ref missing, ref missing, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
                 Console.WriteLine(ex.ToString());
            }
        }
        //public void ReplacePic(string oldstr, string newstr, float newWidth, float newHeight)
        //{
        //    try
        //    {
        //        object bookmarks = oldstr;
        //        if (!oDoc.Bookmarks.Exists(oldstr))
        //            return;
        //        Word.Bookmark book = oDoc.Bookmarks.Item(ref bookmarks);
        //        if (book == null) return;
        //            book.Select();
        //        object missing = Type.Missing;
        //        Word.InlineShape shape = oWordApplic.Selection.InlineShapes.AddPicture(newstr, ref missing, ref missing, ref missing);
        //        shape.Width = newWidth;//图片宽度
        //        shape.Height = newHeight;//图片高度
            
        //    }
        //    catch (Exception ex)
        //    {
        //         CreateLogTxt.ErrWriter(ex);
        //         Console.WriteLine(ex.ToString());
        //    }

        //}
        //public void ReplaceTable(string oldstr, List<List<string>> alTable)
        //{
        //    try
        //    {
        //        object bookmarks = oldstr;
        //        oDoc.Bookmarks.Item(ref bookmarks).Select();
        //        object missing = Type.Missing;
        //        if (alTable != null && alTable.Count > 0)
        //        {
        //            int rows = alTable.Count-1;
        //            int columns = alTable[0].Count;
        //            Word.Table table1 = oWordApplic.Selection.Tables.Add(oWordApplic.Selection.Range, rows, columns, ref missing, ref missing);
        //            table1.Borders.Item(Word.WdBorderType.wdBorderTop).LineStyle = Word.WdLineStyle.wdLineStyleSingle;
        //            table1.Borders.Item(Word.WdBorderType.wdBorderLeft).LineStyle = Word.WdLineStyle.wdLineStyleSingle;
        //            table1.Borders.Item(Word.WdBorderType.wdBorderBottom).LineStyle = Word.WdLineStyle.wdLineStyleSingle;
        //            table1.Borders.Item(Word.WdBorderType.wdBorderRight).LineStyle = Word.WdLineStyle.wdLineStyleSingle;
        //            table1.Borders.Item(Word.WdBorderType.wdBorderHorizontal).LineStyle = Word.WdLineStyle.wdLineStyleSingle;
        //            table1.Borders.Item(Word.WdBorderType.wdBorderVertical).LineStyle = Word.WdLineStyle.wdLineStyleSingle;



        //            int iWidth = 0;
                     
        //            for (int i = 0; i < columns; i++) {
        //                iWidth = 0;
        //                int.TryParse(alTable[0][i], out iWidth);
        //                if (iWidth > 0)
        //                {
        //                    table1.Columns.Item(i + 1).PreferredWidthType = Word.WdPreferredWidthType.wdPreferredWidthPoints;
        //                    table1.Columns.Item(i + 1).PreferredWidth= iWidth;
        //                }
        //            }
        //            for (int i = 1; i <= rows; i++)
        //            {
        //                for (int j = 1; j <= columns; j++)
        //                {
        //                    table1.Cell(i, j).Range.Text = alTable[i][j-1];
        //                    table1.Cell(i, j).Range.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;
                             
        //                }
        //            }
        //            table1.Rows.Item(1).Range.Font.Bold = 1;
                    
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //         CreateLogTxt.ErrWriter(ex);
        //    }

        //}
        // Open a new document
        public void Open()
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                oDoc = oWordApplic.Documents.Add(ref missing, ref missing, ref missing, ref missing);

                oDoc.Activate();
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }




        public void Quit()
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                oWordApplic.Application.Quit(ref missing, ref missing, ref missing);
                System.GC.Collect();
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void Save()
        {
            try
            {
                oDoc.Save();
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void SaveAs(string strFileName)
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                object fileName = strFileName;

                oDoc.SaveAs(ref fileName, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        // Save the document in HTML format
        public void SaveAsHtml(string strFileName)
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                object fileName = strFileName;
                object Format = (int)Word.WdSaveFormat.wdFormatHTML;
                oDoc.SaveAs(ref fileName, ref Format, ref missing, ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }



        public void InsertText(string strText)
        {
            try
            {
                oWordApplic.Selection.TypeText(strText);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void InsertLineBreak()
        {
            try
            {
                oWordApplic.Selection.TypeParagraph();
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }
        public void InsertLineBreak(int nline)
        {
            try
            {
                for (int i = 0; i < nline; i++)
                    oWordApplic.Selection.TypeParagraph();
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        // Change the paragraph alignement
        public void SetAlignment(string strType)
        {
            try
            {
                switch (strType)
                {
                    case "Center":
                        oWordApplic.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;
                        break;
                    case "Left":
                        oWordApplic.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphLeft;
                        break;
                    case "Right":
                        oWordApplic.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphRight;
                        break;
                    case "Justify":
                        oWordApplic.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphJustify;
                        break;
                }
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }


        // if you use thif function to change the font you should call it again with 
        // no parameter in order to set the font without a particular format
        public void SetFont(string strType)
        {
            try
            {
                switch (strType)
                {
                    case "Bold":
                        oWordApplic.Selection.Font.Bold = 1;
                        break;
                    case "Italic":
                        oWordApplic.Selection.Font.Italic = 1;
                        break;
                    case "Underlined":
                        oWordApplic.Selection.Font.Subscript = 0;
                        break;
                }
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        // disable all the style 
        public void SetFont()
        {
            try
            {
                oWordApplic.Selection.Font.Bold = 0;
                oWordApplic.Selection.Font.Italic = 0;
                oWordApplic.Selection.Font.Subscript = 0;
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void SetFontName(string strType)
        {
            try
            {
                oWordApplic.Selection.Font.Name = strType;
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void SetFontSize(int nSize)
        {
            try
            {
                oWordApplic.Selection.Font.Size = nSize;
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void InsertPagebreak()
        {
            try
            {
                object pBreak = (int)Word.WdBreakType.wdPageBreak;
                oWordApplic.Selection.InsertBreak(ref pBreak);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        // Go to a predefined bookmark, if the bookmark doesn't exists the application will raise an error

        public void GotoBookMark(string strBookMarkName)
        {
            try
            {
                object missing = System.Reflection.Missing.Value;

                object Bookmark = (int)Word.WdGoToItem.wdGoToBookmark;
                object NameBookMark = strBookMarkName;
                oWordApplic.Selection.GoTo(ref Bookmark, ref missing, ref missing, ref NameBookMark);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void GoToTheEnd()
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                object unit;
                unit = Word.WdUnits.wdStory;
                oWordApplic.Selection.EndKey(ref unit, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }
        public void GoToTheBeginning()
        {
            try
            {
                object missing = System.Reflection.Missing.Value;
                object unit;
                unit = Word.WdUnits.wdStory;
                oWordApplic.Selection.HomeKey(ref unit, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void GoToTheTable(int ntable)
        {
            try
            {

                object missing = System.Reflection.Missing.Value;
                object what;
                what = Word.WdUnits.wdTable;
                object which;
                which = Word.WdGoToDirection.wdGoToFirst;
                object count;
                count = 1;
                oWordApplic.Selection.GoTo(ref what, ref which, ref count, ref missing);
                oWordApplic.Selection.Find.ClearFormatting();

                oWordApplic.Selection.Text = "";
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }

        }

        public void GoToRightCell()
        {
            try
            {

                object missing = System.Reflection.Missing.Value;
                object direction;
                direction = Word.WdUnits.wdCell;
                oWordApplic.Selection.MoveRight(ref direction, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }
     

        public void GoToLeftCell()
        {

            try
            {
                object missing = System.Reflection.Missing.Value;
                object direction;
                direction = Word.WdUnits.wdCell;
                oWordApplic.Selection.MoveLeft(ref direction, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void GoToDownCell()
        {
            try
            {

                object missing = System.Reflection.Missing.Value;
                object direction;
                direction = Word.WdUnits.wdLine;
                oWordApplic.Selection.MoveDown(ref direction, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }

        public void GoToUpCell()
        {
            try
            {

                object missing = System.Reflection.Missing.Value;
                object direction;
                direction = Word.WdUnits.wdLine;
                oWordApplic.Selection.MoveUp(ref direction, ref missing, ref missing);
            }
            catch (Exception ex)
            {
                 CreateLogTxt.ErrWriter(ex);
            }
        }


        // this function doesn't work
        //public void InsertPageNumber(string strType, bool bHeader)
        //{
        //    try
        //    {
        //        object missing = System.Reflection.Missing.Value;
        //        object alignment;
        //        object bFirstPage = false;
        //        object bF = true;

        //        switch (strType)
        //        {
        //            case "Center":
        //                alignment = Word.WdPageNumberAlignment.wdAlignPageNumberCenter;

        //                oWordApplic.Selection.HeaderFooter.PageNumbers.Item(1).Alignment = Word.WdPageNumberAlignment.wdAlignPageNumberCenter;
        //                break;
        //            case "Right":
        //                alignment = Word.WdPageNumberAlignment.wdAlignPageNumberRight;
        //                oWordApplic.Selection.HeaderFooter.PageNumbers.Item(1).Alignment = Word.WdPageNumberAlignment.wdAlignPageNumberRight;
        //                break;
        //            case "Left":
        //                alignment = Word.WdPageNumberAlignment.wdAlignPageNumberLeft;
        //                oWordApplic.Selection.HeaderFooter.PageNumbers.Add(ref alignment, ref bFirstPage);
        //                break;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //         CreateLogTxt.ErrWriter(ex);
        //    }
        //}
    }
}
