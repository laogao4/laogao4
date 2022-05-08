$.ajaxSetup({
    error : function(jqXHR, textStatus, errorThrown) {
    	if(jqXHR.status == 500){
    		alert('网络异常，请稍后再试');
    		return;
    	}
        if(jqXHR.responseText.indexOf("<script") == 0){
        	$("body").append(jqXHR.responseText);
        }
    }
});
$$ = {
	ajax2:function(config){
		config.url = "/api/"+config.url;
		$.ajax(config);
	},
	ajax:function(config){
		config.url = "/api/"+config.url;
		config.dataType = config.dataType?config.dataType:'json';
		config.type = config.type?config.type:'POST';
		var beforeSend = config.beforeSend;
		if(config.dialogOption || beforeSend){
			config.beforeSend = function(){
				config.dialogOption && config.dialogOption.beforeSendFun();
				beforeSend && beforeSend();
			}
		}
		var errorFun = config.dialogOption?config.dialogOption.errorFun:alert;//异常弹框函数
		var success = config.success;
		config.success = function(res){
			try{
				if(res.code == 0 || res.code == -1){
					errorFun(res.msg);
				}else if(res.code == -2){
					var defaultOptions = {
						title:dialogLanguage['Tip'],
						type:'alert',
						tips:'<font color="red">'+res.msg+'</font>',
						tipsIcon:'',
						callbackFunc:function(){
							window.top.location.href = "/index.html";
						},
						successWaitTime:'',
					};
					dialogShow(defaultOptions);
				}else{
					config.dialogOption && config.dialogOption.successFun(res.msg?res.msg:'操作成功');
					try{
						success && success(res);
					}catch(e){
						console.log(e);
					}
				}
			}catch(e){
				errorFun('网络异常，请稍后再试');
				console.log(e);
			}
		}
		var error = config.error;
		config.error = function(res){
			try{
				errorFun(JSON.parse(res.responseText).msg);
			}catch(e){
				errorFun('网络异常，请稍后再试');
				console.log(e);
			}
		}
		$.ajax(config);
	},
	submit:function(option){
		if(!window._config.submitUrl){
			window._config.submitUrl = window._config.dataUrl+(app.model.id?"/update.html":"/save.html");
		}
		$$.ajax({
			url : window._config.submitUrl,
			type : 'POST',
			data : new FormData($("form")[0]),
			async : true,
			cache : false,
			contentType : false,
			processData : false,
			dialogOption:option,
			success : function(data) {
				window.opener.queryList();
			}
		});
	}
}
$.loadAllResource = function(){
	//不支持本地存储，则直接返回
	if(!window.localStorage){
		return;
	}
	var lastCacheTime = window.localStorage.getItem('cacheResourceTime');
	if(!lastCacheTime || lastCacheTime*1<new Date().getTime()-60*60*1000){
		var last_updatation_date = window.localStorage.getItem('last_updatation_date');
		if(!last_updatation_date){
			last_updatation_date = 0;
		}
		$$.ajax({
			url:'commonData/getData.html?key=getResource&parameter={"last_updatation_date":'+last_updatation_date+'}',
			dataType:'json',
			async:true,
			timeout:3000,
			success:function(res){
				var allResource = window.localStorage.getItem('allResource');
				if(!allResource){
					allResource = {};
				}
				for(var i=0;i<res.data.length;i++){
					var path = res.data[i].path,dt = res.data[i].dt;
					allResource[path] = dt;
					if(last_updatation_date<dt){
						last_updatation_date = dt;
					}
				}
				window.localStorage.setItem('allResource',JSON.stringify(allResource));
				window.localStorage.setItem('cacheResourceTime',new Date().getTime());
				window.localStorage.setItem('last_updatation_date',last_updatation_date);
			}
		});
	}
}
//加载资源文件
$.loadResource = function(name){
	if(!$.isArray(name)){
		name = name.split(',');
	}else{
		name = name.join(',').split(',');
	}
	//如果有缓存，则直接从缓存中获取
	if(window.localStorage){
		var allResource = window.localStorage.getItem('allResource');
		if(allResource){
			allResource = JSON.parse(allResource);
			append(allResource);
			return;
		}
	}
	var appendFlag = false;
	$$.ajax({
		url:'commonData/getData.html?key=getResource&parameter='+JSON.stringify({name:name}),
		dataType:'json',
		async:true,
		timeout:3000,
		success:function(res){
			if(appendFlag){
				return;
			}
			var map = {};
			for(var i=0;i<res.data.length;i++){
				var path = res.data[i].path,dt = res.data[i].dt;
				map[path] = dt;
			}
			append(map);
		},
		error:function(req, textStatus, errorThrown){
			req.abort();
			appendFlag = true;
			append({});
		}
	});
	function append(map){
		var ele = $("body").length>0?$("body"):$("head");
		for(var i=0;i<name.length;i++){
			var now = name[i],jsFlag = now.match(/js$/);
			if(map[now]){
				now = now+"?_t"+map[now];
			}
			try{
				if(jsFlag){
					//$.getscript(now);
					ele.append("<script type='text/javascript' src='/"+now+"'></script>");
				}else{
					ele.append("<link rel='stylesheet' href='/"+now+"'/>");
				}
			}catch(e){
				console.log(e);
			}
		}
	}
}
//加载页面
$.loadPage = function(callback){
	$.get(window._config.params._url+'?_t='+new Date().getTime(),function(res){
		var temp = '';
		if(res.match(/<template>([\s\S]+)<\/template>/g)){
			temp = RegExp.$1;
		}
		var scriptStr = '';
		if(res.match(/(<script>[\s\S]+<\/script>)/g)){
			scriptStr = RegExp.$1
		}
		setTimeout(function(){
			if(temp){
				$("#app").append(temp);
			}
			if(scriptStr){
				$("#app").after(scriptStr);
			}
			//加载用户自定义的资源文件和组件
			var toBeLoadResource = [];
			if(window._config.resources){
				if($.isArray(window._config.resources)){
					window._config.resources = window._config.resources.join(',');
				}
				toBeLoadResource.push(window._config.resources);
			}
			if(window._config.components){
				if(!$.isArray(window._config.components)){
					window._config.components = window._config.components.split(',');
				}
				var tmp = window._config.components;
				for(var i=0;i<tmp.length;i++){
					toBeLoadResource.push('components/'+tmp[i]+'.js');
				}
			}
			if(toBeLoadResource.length>0){
				$.loadResource(toBeLoadResource);
			}
			commonJS.initDict();
			callback && callback();
		},1);
	});
}

$.getUrlParams = function(url) {
	var params = {};
	if (!url) {
		url = location.search;
	}
	var searchs = url.substring(url.indexOf("?") + 1).split("&");
	for (var i = 0; i < searchs.length; i++) {
		var arr = searchs[i].split("=");
		params[arr[0]] = decodeURI(arr[1]);
	}
	return params;
}
;(function(){
	//将_config对象格式化
	if(!window._config){
		window._config = {};
	}
	window._config.params = $.getUrlParams();
	var _url = window._config.params._url,_pageType = window._config.params._pageType;
	if(_url){
		if(_url[0] != '/'){
			_url = '/'+_url;
		}
	}else{
		_url='';
	}
	window._config.params._url = _url;
	if(!window._config.data){
		window._config.data = {};
	}
	if(!window._config.methods){
		window._config.methods = {};
	}
	if(!window._config.dataUrl && _url){
		window._config.dataUrl = _url.substring(6,_url.lastIndexOf('/'));
	}
	//加载页面的资源文件
	if(_url.indexOf("/list.html")>0 || _pageType == 'list'){
		$.get('/ek_common/common_list_resource.html',function(res){
			$("head").append(res);
		});
	}
	if(_url.indexOf("/add.html")>0 || _pageType == 'add' || _url.indexOf("/edit.html")>0 || _pageType == 'edit'){
		$.get('/ek_common/common_add_edit_resource.html',function(res){
			$("head").append(res);
		});
	}
	if(_url.indexOf("/view.html")>0 || _pageType == 'view'){
		$.get('/ek_common/common_view_init.html',function(res){
			$("head").append(res);
		});
	}
	if(_url.indexOf("/select.html")>0 || _pageType == 'select'){
		$.get('/ek_common/common_select_resource.html',function(res){
			$("head").append(res);
		});
	}
})();