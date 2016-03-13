
<?php
	/**
	  * By ruihao.lee  2016.2.2
	  */
	 require('safe.php');
	  class Item
	  {
	  	public $post_arr;
	  	public function session_ok(){
	  		if (!isset($_SESSION['name']) && !isset($_SESSION['number']) && !isset($_SESSION['password'])) {
	  			$this->response(-1, '你的登陆过期啦，请重新登陆');
	  			die();
	  		}
	  		elseif(($_SESSION['name'] !== $this->post_arr['name']) || ($_SESSION['number'] !== $this->post_arr['number']) || ($_SESSION['password'] !== $this->post_arr['password'])) {
		  			$this->response(0, '信息不匹配无法报名！');
		  			die();	  				
	  			}
	  	}

	  	public function check_data(){
	  		$res=$this->ifloginUser($this->post_arr['number'],$this->post_arr['password']);
	  		if(!$res){
	  			die('密码不正确和学号不匹配！');
	  		}
	  		if(sizeof($this->post_arr) != 7){
	  			$this->response(0, 'Hey,你的信息不全呢~');
	  			exit;
	  		}
	  		$lowerGroupname = strtolower($this->post_arr['direction']);
	  		if (($lowerGroupname != 'android') && ($lowerGroupname != 'web') && ($lowerGroupname != 'ios')) {
	  			$this->response(0, 'Hey,组名不正确哦');
	  			die();
	  		}
	  		array_walk($this->post_arr, function(&$value,$key){
	  			$value = trim($value);
	  			if($key == 'number'){
	  				if (preg_match('/[a-zA-Z]/', $value)) {
		 				$this->response(0, 'Hey,你输入非法字符了呢~');
		 				exit;	  					
	  				}
	  			}
	  			$check= preg_match('/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile| /', $value);
	 			if ($check || gettype($value) != 'string' || strlen($value) == 0) {
	 				$this->response(0, 'Hey,你输入非法字符了呢~');
	 				exit;
	 			}
	  		});

	  		$url = '/(\w+)@[\w]+.com/';
	  		if(!preg_match($url, $this->post_arr['email'])){
	  			$this->response(0, 'Hey,你输入的邮箱格式不对呢~');
	  			exit;
	  		}

	  		$numUrl = '/(\d){8}/';
	  		if(!preg_match($numUrl, $this->post_arr['number']) || (strlen($this->post_arr['number']) != 8)){
	  			$this->response(0, 'Hey,你需要输入八位学号~');
	  			exit;
	  		}
	  		$this->ifInDatabase();
	  	}

	  	private function ifloginUser ($username, $password){
	  		$paramStr = 'username='.$username.'&password='.$password;
	  		$url = 'https://api.xiyoumobile.com/XiyouScoreApi/Login';
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_FAILONERROR , 1);//发生错误直接停止运行
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curl, CURLOPT_TIMEOUT, 5);
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,FALSE);
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,FALSE);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $paramStr);
			$data = curl_exec($curl);
			curl_close($curl);
			$output = json_decode($data,true);
			// $this->response($output['Result'],'测试');
			// exit;
			if($output['Result'] == true){
				return true;
			}
			else{
				return false;
			}
	  	}

	  	private function ifInDatabase(){
	  		require('../../../connect.php');
	  		$query = 'select name from students where numberId=?';
	  		$stmt = $db->prepare($query);
	  		$stmt->bind_param('s',$this->post_arr['number']);
	  		$stmt->execute();
	  		$stmt->bind_result($name);
	  		$stmt->fetch();
	  		$stmt->close();
	  		$db->close();
	  		if($name){
	  			$this->response(0, '你已经投递简历了，请不要重复哦！');
	  			exit;
	  		}
	  		
	  	}

	  	public function response($num,$text){	
	  		$type = 'application/json';
	  		header("Content-Type: $type;charset=UTF-8");
	  		$data['result'] = $num;
	  		$data['reason'] = $text;
	  		$output = json_encode($data);
	  		echo $output;
	  	}

	  	public function insert_data(){
	  		if (!get_magic_quotes_gpc()) {
	  			array_walk($this->post_arr,function(&$value,$key){
	  				$value = addslashes($value);
	  			});
	  		}
	  		require('../../../connect.php');
	  		// array_walk($this->post_arr,function(&$value,$key){
	  		// 	$value = mysql_real_escape_string($value);
	  		// });
	  		$query = 'insert into students values(?,?,?,?,?,?,?,?,?)';
	  		$stmt = $db->prepare($query);
	  		$zero = 0;
	  		$fir_time = '2016.3.1';
	  		$gname = strtolower($this->post_arr['direction']);
	  		$stmt->bind_param("sssssdsss",$this->post_arr['number'],$this->post_arr['name'],$this->post_arr['email'],$gname,$this->post_arr['textself'],$zero,$fir_time,$_SESSION['class'],$this->post_arr['phone']);
	  		$stmt->execute();
	  		$this->response(1, '插入成功');
	  		$stmt->close();
	  		$db->close();
	  		require('email.php');
	  		$email_content = $this->post_arr['name']." 同学你好:\n恭喜你，投递简历成功啦，请在 $fir_time 去 ".$this->post_arr['direction']."组参加第 一 轮面试吧~Fighting!!";
	  		email_toStu($this->post_arr['email'], $email_content);
	  	}
	  	function __construct($POST)
	  	{
	  		$this->post_arr = $POST;
	  	}
	  }
	  session_start();
	  $new_item = new Item($_POST);
	  $new_item->session_ok();
	  $new_item->check_data();
	  $new_item->insert_data();
?>