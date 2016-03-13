<?php
	/**
	  * 更新纳新进度的API  by ruihao.lee 2016.2.4
	  */
	  require('safe.php');
	  class Update_schedule
	  {
	  	private $post_arr;
	  	public function check_params(){
	  		$length = sizeof($this->post_arr);
	  		@$this->post_arr['number'] = trim($this->post_arr['number']);
		  	@$this->post_arr['type'] = trim($this->post_arr['type']);
		  	@$this->post_arr['schedule'] = trim($this->post_arr['schedule']);
		  	@$this->post_arr['time'] = trim($this->post_arr['time']);
		  	if(!isset($this->post_arr['key']) || ($this->post_arr['key'] !== 'xymbzf155rhl')){
		  		$this->response('拒绝访问');
		  		exit;
		  	}
	  	 	settype($this->post_arr['schedule'], 'int');
	  		if(empty($this->post_arr['number']) || empty($this->post_arr['type']) || empty($this->post_arr['schedule'])){
	  			$this->response('参数要求不正确，请检查.');
	  			exit;
	  		}
	  		if($this->post_arr['schedule'] != -1 && empty($this->post_arr['time'])){
	  			$this->response('通过面试必须有下轮面试的时间~');
	  			exit;
	  		}
	  		// if ($this->post_arr['type'] != 'windows' && $this->post_arr['type'] != 'web' && $this->post_arr['type'] != 'ios' && $this->post_arr['type'] != 'android'){
	  		// 	$this->response('组名不符合要求');
	  		// 	exit;
	  		// }
	  		$check_type = preg_match('/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile| /', $this->post_arr['type']);
	  		$check_number = preg_match('/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile|[a-zA-Z]| /', $this->post_arr['number']);
	  		if ($check_type || $check_number) {
	  			$this->response('参数非法!!!');
	  			exit;
	  		}
	  	}
	  	private function response(){
	  		$arguments = func_get_args();
	  		$count = sizeof($arguments);
	  		$type = 'application/json';
	  		header("Content-Type: $type");
	  		if ($count == 1) {
	  			$output['result'] = false;
	  			$output['reason'] = $arguments[0];
	  		}
	  		else{
	  			$output['result'] = true;
	  			$output['data'] = $arguments[1];
	  		}
	  		$output = json_encode($output);
	  		echo $output;
	  	}
	  	public function get_data(){
	  		require('../../../connect.php');
	  		$query = "select * from students where numberId=?";
	  		$stmt = $db->prepare($query);
	  		$stmt->bind_param("s",$this->post_arr['number']);
	  		$stmt->execute();
	  		$stmt->bind_result($result['number'],$result['name'],$result['email'],$result['direction'],$result['textself'],$result['schedule'],$result['time']);
	  		$stmt->fetch();

	  		$email_address = $result['email'];
	  		$student_name = $result['name'];
	  		if ($result['number'] == null) {
	  			$this->response('该学生没有报名！');
	  			$stmt->close();
	  			$db->close();
	  			exit;		
	  		}
	  		if ($result['direction'] != $this->post_arr['type']) {
	  			$this->response('不能修改没有报名本组的学生的信息！');
	  			$stmt->close();
	  			$db->close();
	  			exit;
	  		}
	  		$stmt->close();
	  		if($this->post_arr['schedule'] == -1){
	  			$query = "update students set schedule=? where numberId=?";
	  		}
	  		else{
	  			$query = "update students set schedule=?,time=? where numberId=?";
	  		}
	  		$stmt = $db->prepare($query);
	  		if($this->post_arr['schedule'] == -1){
		  		$stmt->bind_param("ds",$this->post_arr['schedule'],$this->post_arr['number']);
		  		$stmt->execute();
		  		$result['schedule'] = $this->post_arr['schedule'];	  			
	  		}
	  		else{
		  		$stmt->bind_param("dss",$this->post_arr['schedule'],$this->post_arr['time'],$this->post_arr['number']);
		  		$stmt->execute();
		  		$result['schedule'] = $this->post_arr['schedule'];
		  		$result['time'] = $this->post_arr['time'];		  			
	  		}
	  		$this->response('ok',$result);
	  		$stmt->close();
	  		$db->close();
	  		require('email.php');
	  		switch ($this->post_arr['schedule']) {
	  			case -1:
	  				$email_content = $result['name']." 同学你好:\n非常遗憾的告诉你，你没有通过面试，下次继续努力吧，我们等着你~";
	  				email_toStu($email_address,$email_content);
	  				break;
	  			case 1:
	  				$email_content = $result['name']." 同学你好:\n恭喜你，通过了第 一 轮面试，请在 ".$result['time']."去 ".$result['direction']." 组参加第 二 轮面试吧~Fighting!!";
	  				email_toStu($email_address,$email_content);	  				
	  				break;
	  			case 2:
	  				$email_content = $result['name']." 同学你好:\n恭喜你，通过了第 二 轮面试，请在 ".$result['time']."去 ".$result['direction']." 组参加第 三 轮面试吧~Fighting!!";
	  				email_toStu($email_address,$email_content);	  				
	  				break;
	  			case 3:
	  				$email_content = $result['name']." 同学你好:\n恭喜你，通过了第 三 轮面试，请在 ".$result['time']."去 ".$result['direction']." 组参加第一次会议吧~欢迎加入3G的大家庭!!";
	  				email_toStu($email_address,$email_content);	  				
	  				break;
	  			default:
	  				break;	  				
	  		}
	  	}
	  	function __construct($post)
	  	{
	  		$this->post_arr = $post;
	  	}
	  }
	  $update_sche = new Update_schedule($_POST);
	  $update_sche->check_params();
	  $update_sche->get_data();
?>