<?php
	 require("smtp.php");
	 function email_toStu($address,$text){
	 	$smtpserver = "smtp.163.com";
	 	$smtpserver_port = 25;
	 	$smtpusermail = "15667023326@163.com";
	 	$smtpemail_to = $address;
	 	$smtp_user = '15667023326';
	 	$smtp_password = 'liruihao1019';
	 	$mail_title = "西安邮电大学移动应用开发实验室";
	 	$mail_content = $text;
	 	$mail_type = 'TXT';
	 	$smtp = new smtp($smtpserver,$smtpserver_port,true,$smtp_user,$smtp_password);
	 	$smtp->debug = false;
	 	$smtp->sendmail($smtpemail_to, $smtpusermail, $mail_title, $mail_content, $mail_type);
	 }
?>