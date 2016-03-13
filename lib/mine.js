	/**
	  * By ruihao.lee  2016.2.15
	  * 特此鸣谢 李婧媛学姐的图。。。
	  */
(function(){
	var isFinish = true;
	var userData = {
		username : null,
		password : null
	};
	var winWidth;
	window.onload = function() {
		if(window.innerWidth){
			winWidth = window.innerWidth;
		}
		else if((document.body) && (document.body.clientWidth)){
			winWidth = document.body.clientWidth;
		}
		//console.log(winWidth);
		$('#container').fullpage({
			anchors: ['_fir','_sec','_third','_fourth','_android','_web','_ios','_windows'],
			onLeave : function(index, nextIndex, direction){
				if(index == 1 && nextIndex == 2){
					if(winWidth > 960){
						pc_Animate_text($('.text')[0],$('.pc_text')[0]);
					}
				}
				else if(index == 2 && nextIndex == 3){
					if(winWidth > 960){
						pc_Animate_text($('.text')[1],$('.pc_text')[1]);
					}
				}
			}
		});

		setVideo();
		ifRemeber();	
		event_handle();
		joinJump();
	}

	function event_handle(){
		$('.groupBox').on('click','img',function (event){
			//console.log(111111111111111);
			switch(event.target.id){
				case 'web':
						$.fn.fullpage.moveTo('_web',1);
						break;
				case 'ios':
						$.fn.fullpage.moveTo('_ios',1);
						break;
				case 'windows':
						$.fn.fullpage.moveTo('_windows',1);
						break;
				case 'android':
						$.fn.fullpage.moveTo('_android',1);
						break;
			}
		});
		$('.back').on('click',function(){
			$.fn.fullpage.moveTo('_fourth',1);
		});
		$('.home').on('click',homeHandle);
		$('.group_button').on('click',homeHandle);
		$('#cancel').on('click',function(){
			$('#shadowDiv').css('display','none');
			$('#myAlert').css({
				height :'0',
				paddingTop: '0'
			}).find('img').css('display','none').end().find('input').css('display','none');
			$('#checkbox').css('display','none');
			$('#cancel').css('display','none');
			$('#Button').css('display','none');
		});
		$('#Button').on('click',login_go);
	}

	function homeHandle(){
			for(var name in userData){
				userData[name] = returnParamData(name);
			}
			console.log(userData);
			if (userData['username'] == null || userData['password'] == null) {
				showAlert();
				return;
			}
			base().Ajax('http://139.129.118.127/mobile_update/php_Api/transferLogin.php',userData,'json',function (Result){
				//console.log(result);
				if (Result.result) {
					// var session = result.Detail;
					window.location.href = 'login.html?username=' + userData['username'] + '&password=' + userData['password'];
				}
				else{	
					showAlert();				
				}
			});
		}

	function showAlert(){
		$('#shadowDiv').css('display','block');
		if(winWidth < 960){
			$('#myAlert').css({
					height :'370px',
					paddingTop: '137px'
				}).find('img').css('display','block').end().find('input').css('display','block');
			$('#checkbox').css('display','block');
			$('#cancel').css('display','block');
			$('#Button').css('display','block');			
		}
		else{
			$('#myAlert').css({
					height :'70%',
					paddingTop: '14%'
				}).find('img').css('display','block').end().find('input').css('display','block');
			$('#checkbox').css('display','block');
			$('#cancel').css('display','block');
			$('#Button').css('display','block');	
		}
	}

	function returnParamData(name){
		var paramStr = window.location.search;
		var reg = new RegExp(name + '=[^&]*');
		var result = reg.exec(paramStr);
		if (!result) {
			return null;
		}
		else{
			var length = name.length;
			var r = result[0].substr(length + 1);
			return r;
			console.log(r);			
		}
	}
	//用户登录
	function login_go(){
		var data = {};
		if ($('#password').val().trim() != '' && $('#username').val().trim() != '') {
			data['username'] = $('#username').val().trim();
			data['password'] = $('#password').val().trim();
			if (isFinish) {
				isFinish = false;
				base().Ajax('http://139.129.118.127/mobile_update/php_Api/transferLogin.php',data,'json',function (Result){
					if (Result.result) {
						// var session = result.Detail;
						isFinish = true;
						save_user(data);
						alert('恭喜你，登陆成功！将跳转至个人页面');
						window.location.href = 'login.html?username=' + data['username'] + '&password=' + data['password'];
 					}
					else{
						isFinish = true;
						alert('亲，账户或者密码错了哦！');
					}
				});
			}
			else{
				alert('同学你的小爪子点击的太快了！');
			}
		}
		else{
			alert('亲，用户名密码不能为空哦~');
		}
	}
	//保存用户名和密码，存于cookie
	function save_user(userData){
		if ($('#loginkeep').is(':checked')) {
			$.cookie("rmbUser", "true", { expires: 1 });
			for(var name in userData){
				$.cookie(name,userData[name],{ expires: 1 });
			}
		}
		else{
			$.cookie('rmbUser','true', {expires: -1});
			for(var name in userData){
				$.cookie(name,'',{expires: -1});
			}
		}
	}
	//是否记住密码
	function ifRemeber(){
		var remeber = $.cookie('rmbUser');
		if (remeber == 'true') {
			$("#loginkeep").attr("checked", true);
			$('#password').val($.cookie('password'));
			$('#username').val($.cookie('username')); 
		}
	}


	function joinJump(){
		var join = document.getElementById('join');
		setInterval(function(){
			join.style.marginTop = '15px';
			setTimeout(function(){
				join.style.marginTop = '0';
			},1000);
		},2000);
	}

	function pc_Animate_text (topText,bottomText){
		console.log($(topText).children()[0]);
		var i = 0;
		var pArr = $(topText).children();
		function animateFun(){
			$(pArr[i]).animate({opacity:'1'},{duration:500});
			i++;
			if(i == 6){
				setTimeout(function(){
					$(bottomText).animate({left : '21.6%'},{duration : 1000});
				},500);
				clearInterval(doInter);
			}
		}
		var doInter = setInterval(animateFun,800);
	}

	function setVideo () {
		var box = document.getElementById('vedio');
		var video = document.getElementsByClassName('mp4');
		for(var i = 0;i < video.length; i++){
			video[i].width = box.offsetWidth;
			video[i].height = box.offsetHeight;
		}
		//console.log(box.offsetWidth,box.offsetHeight);
	}
})();
