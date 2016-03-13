	/**
	  * By ruihao.lee  2016.2.18
	  * 特此鸣谢 李婧媛学姐的图。。。
	  */
(function(){
	var data = {};
	var ifSuccess = false;
	var ifFinish = true;
	var winWidth;
	if_okLogin();
	window.onload = function(){
		if(window.innerHTML){
			winWidth = window.innerHTML;
		}
		else if((document.body) && (document.body.clientWidth)){
			winWidth = document.body.clientWidth;
		}
		$('#container').fullpage({
			sectionsColor : ['#121653', '#121653'],
			anchors:['self', 'form', 'success'],
			onLeave: function(index, nextIndex, direction){
				if (index == 2 && nextIndex == 3) {
					if (ifSuccess == false) {
						//console.log(11);
						$.fn.fullpage.moveTo('self', 1);
					}
				}
			}
		});
		$('.home').on('click',backToMainpage);
		$('#back').on('click',backToMainpage);
		$('#outLogin').on('click',outLogin);
		//$('#submit').on('click',rocketFly);
		$('#submit').on('click',submit);
		bulid_cube();
		pointJump();
		//getSche();
		positonFormTitle();
	}
	//验证是否是匿名用户进入个人页面
	function if_okLogin(){
		var userData = {
			password : null,
			username : null
		};

		for(var name in userData){
			userData[name] = returnParamData(name);
		}
		if (userData['password'] == null || userData['username'] == null) {
			alert('同学你的登陆过期了哦，请重新登陆~');
			window.location.href = 'lee.html';
		}
		console.log(data);
		data = {
			username : userData['username'],
			password : userData['password']
		};
		//SSconsole.log(data);
		base().Ajax('http://139.129.118.127/mobile_update/php_Api/transferLogin.php',data,'json',function (Result){
			if (Result.result == false) {
				alert('同学你的登陆过期了哦，请重新登陆~');
				window.location.href = 'lee.html';
			}
			else{
				data['name'] = Result.data['name'];
				$('#form_number').val(Result.data['number']);
				$('#form_name').val(Result.data['name']);
				//等待异步请求成功得到信息之后在执行填写函数
				getSche();
			}
		});
	}
	//从url分解参数
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

	function backToMainpage(){
		window.location.href = 'lee.html?username=' + data['username'] + '&password=' + data['password']; 
	}

	//---------立方体部分
	var renderer = null,
		scene = null,
		camare = null,
		cube = null;
	function bulid_cube(){
		var mobile_cube = document.getElementById('mobile_cube');
		//创建渲染器，也就是canvas
		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(mobile_cube.offsetWidth, mobile_cube.offsetHeight);
		console.log(mobile_cube);
		mobile_cube.appendChild(renderer.domElement);
		scene = new THREE.Scene();
		//创建相机
		camare = new THREE.PerspectiveCamera(35,
			mobile_cube.offsetWidth/mobile_cube.offsetHeight, 1, 4000);
		camare.position.set(0,0,3);
		scene.add(camare);
		//创建平行光源
		var light = new THREE.DirectionalLight(0xffffff,1.5);
		light.position.set(0,0,1);
		scene.add(light);
		//创建纹理
		var myUrl = 'img/3g-800.png';
		var myMap = THREE.ImageUtils.loadTexture(myUrl);
		//将纹理传入材质使他们相关联
		var material = new THREE.MeshPhongMaterial({map:myMap});
		//创建立方体
		var geometry = new THREE.CubeGeometry(1,1,1);
		//将几何体和材质放入网格中
		cube = new THREE.Mesh(geometry, material);
		cube.rotation.x = Math.PI / 10;
		cube.rotation.y = Math.PI /  10;
		scene.add(cube);
		//跑起来吧哈哈
		run();
	}

	function run(){
		renderer.render(scene, camare);
		cube.rotation.y -= 0.01;
		window.requestAnimationFrame(run);
	}

	//跳动的小箭头
	function pointJump(){
		setInterval(function(){
			$('#rightPoint').css('marginRight','10px');
			$('#leftPoint').css('marginLeft','10px');
			setTimeout(function(){
				$('#rightPoint').css('marginRight','0');
				$('#leftPoint').css('marginLeft','0');				
			},1000)
		},2000);
	}
	//填充进度信息
	function getSche(){
		var search = {
			number : data['username']
		};
		base().Ajax('http://139.129.118.127/mobile_update/php_Api/inquire_api.php',search,'json',function (result){
			if (result.result == 1) {
				var textBox = document.getElementById('scheMain');
				//console.log(data);
				if (result.name === null && result.direction === null && result.time === null) {
					textBox.innerHTML = '<p>'+ data['name'] + '你好:</p>'+ 
										'<p id="scheBody">你还没有投递简历呢，往下滑快去投递简历吧~<p>'+
										'<p id="mobileText">移动应用开发实验室</p>';
				}
				else{
					ifSuccess = true;
					switch(result.schedule){
						case -1:
								textBox.innerHTML = '<p>' + result.name + '你好:</p>' +
								'<p id="scheBody">非常遗憾的告诉你，你没有通过面试，下次继续努力吧，我们等着你~<p>' +
								'<p id="mobileText">移动应用开发实验室</p>';
								break;
						case 0: 
								textBox.innerHTML = '<p>' + result.name + '你好:</p>' +
								'<p id="scheBody">恭喜你，投递简历成功啦，请在 '+ result.time + ' 去 ' + result.direction + ' 组参加第 一 轮面试吧~Fighting!!</p>'+
								'<p id="mobileText">移动应用开发实验室</p>';
								break;
						case 1: 
								textBox.innerHTML = '<p>' + result.name + '你好:</p>' +
								'<p id="scheBody">恭喜你，通过了第 一 轮面试，请在 '+ result.time + ' 去 ' + result.direction + ' 组参加第 二 轮面试吧~Fighting!!</p>'+
								'<p id="mobileText">移动应用开发实验室</p>';
								break;
						case 2:
								textBox.innerHTML = '<p>' + result.name + '你好:</p>' +
								'<p id="scheBody">恭喜你，通过了第 二 轮面试，请在 '+ result.time + ' 去 ' + result.direction + ' 组参加第 三 轮面试吧~Fighting!!</p>'+
								'<p id="mobileText">移动应用开发实验室</p>';
								break;
						case 3: 
								textBox.innerHTML = '<p>' + result.name + '你好:</p>' +
								'<p id="scheBody">恭喜你，通过了第 三 轮面试，欢迎你加入 ' + result.direction + '组的大家庭！' +'请在 '+ result.time + ' 去参加第一次会议。</p>'+
								'<p id="mobileText">移动应用开发实验室</p>';
								break;
					}
				}
			}
		});
	}
	//定位表单元素
	function positonFormTitle(){
		if(winWidth < 960){
			positonFormTitle_fun(13,6.5);		
		}
		else{
			positonFormTitle_fun(20,8);
			// if(winWidth)				
		}
	}
	function positonFormTitle_fun(sta, step){
			var start = sta;
			var titles = document.getElementsByClassName('formTitle');
			for(var i = 0;i < 6; i++){
				var now = start + (i * step);
				titles[i].style.top = now + '%';
			}
			var inputs = document.getElementsByClassName('formInput');
			for(var i = 0;i < 6; i++){
				var now = start + (i * step);
				inputs[i].style.top = now + '%';
			}
	}

	//火箭飞起
	function rocketFly(){
		$('#first').css('display','none');
		$('#plane').css('bottom','100%');
		setTimeout(function(){
			$('#plane').css('display','none');
		},1600)
		setTimeout(function(){
			$('#cloud').css('opacity','1');
		},500);
		ifSuccess = true;
		setTimeout(function(){
			$.fn.fullpage.moveTo('success',1);
			if(winWidth < 960){
				$('#plane').css({
					display : 'block',
					bottom : '2%'
				});				
			}
			else{
				$('#plane').css({
					display : 'block',
					bottom : '-8%'
				});					
			}
			$('#cloud').css('opacity','0');
			$('#first').css('display','block');
		},1600);
	}

	function trim (str){
		return str.replace(/[ ]/g,"");
	}
	//提交表单
	function submit(){
		if (ifFinish) {
			var formData = {
				number : trim($('#form_number').val()),
				name : trim($('#form_name').val()),
				email : trim($('#form_class').val()),
				direction : trim($('#form_direction').val()),
				textself : trim($('#form_self').val()),
				phone : trim($('#form_phone').val()),
				password : data['password']
			};
			for(var n in formData){
				if(!formData[n]){
					alert('Hey,表单不允许空白哦!');
					return;
				}
				else{
					var r = formData[n].search(/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile| /);
					if(r != -1){
						alert('Hey,你输入非法字符了呢~');
						return;
					}
				}
			}
			var url = /(\w+)@[\w]+.com/;
			var re = formData['email'].search(url);
			if(re == -1){
				alert('Hey,你输入的邮箱格式不对呢~');
				return;
			}

			ifFinish = false;
			base().Ajax('http://139.129.118.127/mobile_update/php_Api/get_items.php',formData,'json',function (result){
				if (result.result == 0) {
					ifFinish = true;
					alert(result.reason);
					return;
				}
				else if(result.result == 1){
					ifFinish = true;
					getSche();
					//alert('Hey,你投递简历成功了！');
					rocketFly();
				}
				else{
					alert(result.reason);
					window.location.href = 'lee.html';
				}
			});			
		}
		else{
			alert('同学你的小爪子点击的太快了！');
		}
	}
	//退出登录
	function outLogin(){
		alert('你已经退出登录了哦，即将跳转到介绍页面~');
		window.location.href = 'lee.html';
	}
})();