<?php
	class Transfer
	{
		private $loginData;
		function __construct($post_loginData)
		{
			$this->loginData['username'] = $post_loginData['username'];
			$this->loginData['password'] = $post_loginData['password'];
		}
		private function baseCurl($Api_name, $data){
			$parmes = '';
			foreach ($data as $key => $value) {
				$parmes .= ($key.'='.$value.'&');
			}
			$parmes = substr($parmes,0,-1);
			// echo $parmes;
			$curl = curl_init($Api_name);
			curl_setopt($curl, CURLOPT_FAILONERROR, 1);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($curl, CURLOPT_TIMEOUT, 5);
			curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER,FALSE);
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST,FALSE);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $parmes);
			$result = curl_exec($curl);
			$result = json_decode($result, true);
			curl_close($curl);
			return $result;		
		}
		public function studentLogin(){
			$result = $this->baseCurl('https://api.xiyoumobile.com/XiyouScoreApi/Login', $this->loginData);
			if ($result['Result'] == '1') {
				$loginData['username'] = 's'.$this->loginData['username'];
				$loginData['password'] = $this->loginData['password'];
				$getLibSession_id = $this->baseCurl('https://api.xiyoumobile.com/xiyoulibv2/user/login', $loginData);
				$session_id['session'] = $getLibSession_id['Detail']; 
				$getStudentData = $this->baseCurl('https://api.xiyoumobile.com/xiyoulibv2/user/info', $session_id);
				$_SESSION = array();
				if (!isset($_SESSION['name']) && !isset($_SESSION['number']) && !isset($_SESSION['password'])) {
					$_SESSION['name'] = $getStudentData['Detail']['Name'];
					$_SESSION['class'] = $getStudentData['Detail']['Department'];
					$_SESSION['number'] = $this->loginData['username'];
					$_SESSION['password'] = $this->loginData['password'];
				}
				//print_r($_SESSION);
				$this->response(true, $_SESSION);
				// print_r($getLibSession_id['Detail']);
			}
			else{
				$this->response(false, '密码错误');
			}
		}
		private function response(){
			$arguments = func_get_args();
			header('Content-Type: json/application');
			$output['result'] = $arguments[0];
			if ($output['result'] == true) {
				$output['data'] = $arguments[1];
			}
			else{
				$output['reason'] = $arguments[1];
			}
			$output = json_encode($output);
			echo $output;
		}
	}
	session_start();
	$login = new Transfer($_POST);
	$login->studentLogin();
?>