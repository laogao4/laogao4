<?php
function getFiles($dir){
	$files = scandir ( $dir );
	$filesStr = '';
	foreach ( $files as $filenow ) {
		if (preg_match ( '/.jpg|.gif$/i', $filenow )) {
			$filesStr .= $dir . '/' . $filenow . ',';
		}
	}
	return substr ( $filesStr, 0, strlen ( $filesStr ) - 1 );
}
$filesStr = getFiles('DOTA_ICO/DOTA-HERO').','.getFiles('DOTA_ICO/DOTA-ITEM').','.getFiles('DOTA_ICO/DOTA-SPELL');
?>
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
	var files = "<?php echo $filesStr;?>".split(',');
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