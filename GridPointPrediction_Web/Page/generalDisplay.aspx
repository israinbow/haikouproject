<%@ Page Language="C#"  MasterPageFile="MainForm.Master"  AutoEventWireup="true" CodeBehind="generalDisplay.aspx.cs" Inherits="GridPointPrediction_Web.Page.generalDisplay" %>

<asp:content id="Content1" contentplaceholderid="head" runat="server">
    <title>综合信息</title>
</asp:content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div style="position: relative;">
        <iframe id="rightContent" name="rightContent" style="width: 100%; border: none; height: 800px;" src="../AWStation/wind.html"></iframe>
    </div>
</asp:Content>
