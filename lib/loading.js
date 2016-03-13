	/**
	  * By ruihao.lee  2016.2.15
	  * 特此鸣谢 李婧媛学姐的图。。。
	  */
function loadingBar(){
	var imgs = [];
	var sum;
	var length = 0;
	var winWidth;
	if(window.innerHTML){
		winWidth = window.innerHTML;
	}
	else if((document.body) && (document.body.clientWidth)){
		winWidth = document.body.clientWidth;
	}
	function imgOk(){
		length++;
		if (winWidth < 960) {
			$('#loadingBar').css('width', (10 * length) + '%');			
		}
		if(length == sum){
			$('#loading').css('display','none');
			$('#signing').css('display','none');
		}
	}

	if(document.images){
		if (winWidth < 960) {
			for(var i = 0;i < 10; i++){
				imgs[i] = new Image();
			}
			imgs[0].src = 'img/3g-800.png';
			imgs[1].src = 'img/bg1.png';
			imgs[2].src = 'img/bg_2.png';
			imgs[3].src = 'img/bg2.png';
			imgs[4].src = 'img/bg4.png';
			imgs[5].src = 'img/bg5.png';
			imgs[6].src = 'img/cloud.png';
			imgs[7].src = 'img/logo1.png';
			imgs[8].src = 'img/logo2.png';
			imgs[9].src = 'img/offer.png';
			//console.log(imgs);		
		}
		else{
			for(var i = 0;i < 12; i++){
				imgs[i] = new Image();
			}	
			imgs[0].src = 'img/b1_pc.png';
			imgs[1].src = 'img/b2_pc.png';
			imgs[2].src = 'img/b3_pc.png';
			imgs[3].src = 'img/b4_pc.png';
			imgs[4].src = 'img/b5_pc.png';
			imgs[5].src = 'img/b6_pc.png';
			imgs[6].src = 'img/b7_pc.png';
			imgs[7].src = 'img/b8_pc.png';
			imgs[8].src = 'img/android_pc.png';
			imgs[9].src = 'img/ios_pc.png';
			imgs[10].src = 'img/web_pc';
			imgs[11].src = 'img/windows_pc';				
		}
		sum = imgs.length;
		for(var i = 0;i < sum; i++){
			imgs[i].onload = imgOk;
			imgs[i].onerror = imgOk;
		}		
	}
}
jQuery(document).ready(loadingBar);