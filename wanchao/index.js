$(function() {
	var intervalId = null, intervalId2 = null;
	var myRects = [];
	var ctx = null, canvasW = 0, canvasH = 0;
	var content = [], tempContent = [];
	var imgNum = 100;// 初始100个img
	var maxDisToEdge = 50;// 距离边界的最大值
	var imgSize = [ 100, 200 ];// 图片的大小范围
	var standerImgSize = 10;// 图片显示的标准宽高
	var imgs = [];// 存储所有的图片元素
	init();
	// 数据初始化
	function init() {
		var canvas = document.getElementById("canvas");
		canvasW = canvas.width = $(document).width(), canvasH = canvas.height = $(window).height();
		ctx = canvas.getContext("2d");
		content.push([ 'ＤＯＴＡ', '尚能战否？' ]);// 全角类型，能保持字符间距统一
		content.push([ '二零一六', '零五一四' ]);
		content.push([ '万超大喜', '一起来战' ]);
		content.push([ '战战战战' ]);
		content.push([ '囍囍囍囍' ]);
		for (var i = 0; i < content.length; i++)
			tempContent.push(content[i]);
		var isChrome = window.google || window.chrome;
		if (!isChrome) {
			alert('在电脑上使用chrome浏览器效果更赞哦');
		}
		appendLoadingImg();
		showLoadingImg();
		appendImg();
		myFillText();
	}
	function appendImg(len) {
		var start, end;
		if (len) {
			start = imgNum + 1;
			end = imgNum + len;
			imgNum += len;
		} else {
			start = 1;
			end = imgNum;
		}
		for (var i = start; i <= end; i++) {
			$("body").append("<img id='" + i + "' src='" + randomImgSrc() + "'>");
			imgs.push($("#" + i));
		}
	}
	function drawMyRect() {
		var len = myRects.length;
		for (var i = 0; i < Math.min(len, 5); i++) {
			if (myRects.posNow < myRects.length) {
				var pos = myRects.posNow++;
				myRects[pos].draw(0);
			}
		}
		if (myRects.posNow == myRects.length) {
			myRects.posNow = 0;
			clearInterval(intervalId);
			setTimeout(removeAllImg, content.length == 0 ? 10000 : 5000);
		}
	}
	// 矩形类
	function myRect(x, y, size, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.size = size;
		this.draw = function(dir) {
			var styleDest = {
				'left' : this.x + 'px',
				'top' : this.y + 'px',
				'width' : this.size + "px",
				'height' : this.size + 'px'
			};
			var temp = randomLeftTop(3 - content.length % 5, 1);
			var styleStart = {
				'left' : temp[0],
				'top' : temp[1],
				'width' : temp[2],
				'height' : temp[3]
			};
			imgs[this.id - 1].css(styleStart).show().animate(styleDest, 3000);
		};
		// 判断两个矩形是否相交
		this.isIntersect = function(rect2) {
			var disX = Math.abs(this.x + this.size / 2 - rect2.x - rect2.size / 2);
			var disY = Math.abs(this.y + this.size / 2 - rect2.y - rect2.size / 2);
			var sumWidth = this.size / 2 + rect2.size / 2;
			var sumHeight = this.size / 2 + rect2.size / 2;
			if (disX < sumWidth && disY < sumHeight)
				return true;
			return false;
		}
	}
	// 获取随机颜色字符串
	function randomColor() {
		var r = randomInt(50, 100).toString(16);
		var g = randomInt(50, 100).toString(16);
		var b = randomInt(50, 100).toString(16);
		return "#ff0000";
		return "#" + r + "" + g + "" + b;
	}
	// 获取一个随机的图片地址
	function randomImgSrc() {
		return files[randomInt(files.length)];
	}
	// 随机生成一个整数，max值取不到
	function randomInt(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return parseInt(Math.random() * (max - min) + min);
	}

	// 移除单个img，如果没有img需要移除，则进行下一轮的画图操作
	function removeImg() {
		if (myRects.posNow == myRects.length) {
			clearInterval(intervalId2);
			if (content.length == 0) {
				for (var i = 0; i < tempContent.length; i++)
					content.push(tempContent[i]);
			}
			showLoadingImg();
			setTimeout(myFillText, 1000);
		} else {
			for (var i = 0; i < 5; i++) {
				var temp = randomLeftTop(content.length % 5);
				if (myRects.posNow < myRects.length) {
					imgs[myRects.posNow].animate({
						left : temp[0],
						top : temp[1]
					}, function() {
						$(this).hide();
					});
					myRects.posNow++;
				}
			}
		}
	}
	// 随机获取消失的路径，type==1，表示还要获取随机的高度，展示的时候要用
	function randomLeftTop(defaultDir, type) {
		var temp = (defaultDir == null || defaultDir > 3 || defaultDir < 0) ? randomInt(4) : defaultDir;
		var left, top, width = 0, height = 0;
		if (type == 1) {
			height = width = randomInt(imgSize[0], imgSize[1]);
		}
		if (temp == 0) {
			left = randomInt(0, canvasW - width);
			top = randomInt(maxDisToEdge);
		} else if (temp == 1) {
			left = canvasW - randomInt(maxDisToEdge) - width;
			top = randomInt(0, canvasH - height);
		} else if (temp == 3) {
			left = randomInt(0, canvasW - width);
			top = canvasH - randomInt(maxDisToEdge) - height;
		} else if (temp == 2) {
			left = randomInt(maxDisToEdge);
			top = randomInt(0, canvasH - height);
		}
		if (type == 1)
			return [ left + "px", top + "px", width + "px", height + "px" ];
		else
			return [ left + "px", top + "px" ];
	}
	// 移除所有的img
	function removeAllImg() {
		intervalId2 = setInterval(removeImg, 1);
	}
	// 主函数
	function myFillText() {
		showLoadingImg();
		var contentNow = content.shift();
		if (!contentNow || contentNow.length == 0)
			return;
		var minFontSize = canvasH / (contentNow.length);
		var maxLen = contentNow[0].length;
		for (var i = 0; i < contentNow.length; i++) {
			if (canvasW / getStrLen(contentNow[i]) < minFontSize) {
				minFontSize = canvasW / getStrLen(contentNow[i]);
			}
			if (contentNow[i].length > maxLen)
				maxLen = contentNow[i].length;
		}
		myRects = [];
		ctx.fillStyle = "#00ff00";
		ctx.fillRect(0, 0, canvasW, canvasH);
		ctx.font = minFontSize + "px 楷体";
		ctx.fillStyle = "#ff0000";
		var top = (canvasH - contentNow.length * minFontSize) / 3;// 居中显示
		top = top < 0 ? 20 : (top > 20 ? top : 20);
		for (var i = 0; i < contentNow.length; i++) {
			var left = (canvasW - getStrLen(contentNow[i]) * minFontSize) / 3;// 居中显示
			left = left > 0 ? left : 0;
			ctx.fillText(contentNow[i], left, minFontSize * (i + 0.75) + top);
		}
		$imgData = ctx.getImageData(0, 0, canvasW, canvasH).data;
		var len = $imgData.length / 4;
		var pos, addRes;
		for (var row = 0; row < canvasH; row++) {
			for (var col = 0; col < canvasW; col++) {
				pos = row * canvasW * 4 + col * 4;
				if ($imgData[pos] == 255) {
					for (var count = 0; count < 1; count++) {// 尝试3个尺寸进行添加
						addRes = addRect(new myRect(col, row, standerImgSize - count*2, myRects.length + 1), myRects);
						if (addRes) {
							col += standerImgSize - count*2 - 1;// 跳过图片宽度的点的判断
							break;
						}
					}
				}
			}
		}
		hideLoadingImg();
		myRects.posNow = 0;
		intervalId = setInterval(drawMyRect, 1);
	}
	// 判断一个点是否可以添加入队列
	function addRect(rectNow, myRects) {
		var len = myRects.length;
		for (var i = len - 1; i >= 0; i--) {
			if (rectNow.isIntersect(myRects[i])) {
				return false;
			}
		}
		myRects.push(rectNow);
		if (imgs.length < rectNow.id) {
			appendImg(50);
		}
		return true;
	}
	// 判断一个字符是否汉字
	function isChinese(str) {
		if (/^[\u4e00-\u9fa5]+$/.test(str)) {
			return true;
		}
		return false;
	}
	// 获取字符串宽度，如果是汉字，算一个长度，否则算半个长度(逻辑已改)
	function getStrLen(str) {
		return str.length;
		var res = 0;
		for (var i = 0; i < str.length; i++) {
			res += isChinese(str.substr(i, 1)) ? 1 : 0.4;
		}
		return res;
	}
	function preImage(url, callback) {
		var img = new Image(); // 创建一个Image对象，实现图片的预下载
		img.src = url;
		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
			callback.call(img);
			return; // 直接返回，不用再处理onload事件
		}
		img.onload = function() { // 图片下载完毕时异步调用callback函数。
			callback.call(img);// 将回调函数的this替换为Image对象
		};
	}
	function myDrawImage() {
		$imgData = ctx.getImageData(0, 0, 300, 240).data;
		var len = $imgData.length / 4;
		for (var row = 0; row < 240; row++) {
			for (var col = 0; col < 300; col++) {
				var pos = row * 300 * 4 + col * 4;
				var w = 1;
				myRects.push(new myRect(col, row, "#" + $imgData[pos].toString(16) + $imgData[pos + 1].toString(16) + $imgData[pos + 2].toString(16)));
			}
		}
		intervalId = setInterval('drawMyRect()', 1);
	}
	function appendLoadingImg() {
		$("body").append(
				"<img id='loadingImg' src='../resources/img/loading.gif' width='100px' height='100px' style='display:none;position:absolute;left:" + (canvasW / 2 - 50) + "px;top:" + (canvasH / 3)
						+ "px;'/>");
	}
	function showLoadingImg() {
		$("#loadingImg").show();
	}
	function hideLoadingImg() {
		$("#loadingImg").hide();
	}
})