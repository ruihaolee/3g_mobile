<?php
	$fileName = '/update/hia.rar';
	header('Content-Type:application/octet-stream');
	header('Content-Disposition:attachment; filename="'.$fileName.'"');
	header('Content-Length:'.filesize($fileName));
	readfile($fileName);  
?>