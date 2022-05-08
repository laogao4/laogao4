<%@ page contentType="text/html; charset=utf8"%>
<%@ page import="java.io.File"%>
<%
	String [] dirStr = new String[]{"DOTA_ICO/DOTA-HERO/","DOTA_ICO/DOTA-ITEM/","DOTA_ICO/DOTA-SPELL/"};
	StringBuffer sb = new StringBuffer();
	for(String dir:dirStr){
		File[] files = new File(request.getRealPath("/")+"wanchao/"+dir).listFiles();
		for(File now:files){
			if(now.getName().endsWith(".gif") || now.getName().endsWith(".jpg")){
				sb.append(dir+now.getName()+",");
			}
		}
	}	
	sb.deleteCharAt(sb.length()-1);
    String files = sb.toString();
%>
<!DOCTYPE html>
<html>
<head>
<title>万超结婚，一起来战</title>
<link rel="shortcut icon" type="image/ico"
	href="../resources/img/xi.jpg">
<meta http-equiv="content-type" content="text/html;charset=utf-8">
<script type="text/javascript"
	src="../resources/js/jquery-1.11.1.min.js"></script>
<script type="text/javascript">
	var files = "<%= files %>".split(',');
</script>
<script type="text/javascript" src="index.js"></script>
<style type="text/css">
body {
	padding: 0px;
	border: 0px;
	margin: 0px;
	overflow: hidden;
	border: 0px;
}

img {
	border: 0px solid black;
	position: absolute;
	opacity: 0.8;
	left: 0px;
	top: 0px;
	display: none;
}

#canvas {
	display: none;
}
</style>
</head>
<body>
	<audio src="We Are Electric.mp3" autoplay loop></audio>
	<canvas id='canvas'></canvas>
</body>
</html>