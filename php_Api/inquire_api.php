
<?php
	  require('safe.php');
	  class Get_sche
	  {
	  	public $number;
	  	function __construct($number)
	  	{
	  		$this->number = trim($number);
	  	}
	  	//检测数据，防止攻击
	  	public function check_num(){
	  		$num = trim($_POST['number']);
	  		if (empty($num)) {
	  			$this->response('学号不能为空哦!');
	  			exit;
	  		}
	  		$check= preg_match('/select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile|[a-zA-Z]| /', $num);
	  		if ($check) {
	  			$this->response('查询字符非法哦！');
	  			exit;
	  		}
	  	}
	  	//响应函数，根据参数数目来进行不同的响应
	  	private function response(){
	  		$arguments = func_get_args();
	  		$count = sizeof($arguments);
	  		$type = 'application/json';
	  		header("Content-Type: $type");
	  		if ($count == 1) {
	  			$output['result'] = 0;
	  			$output['reason'] = $arguments[0];
	  		}
	  		else{
	  			$output['result'] = 1;
	  			$output['name'] = $arguments[1];
	  			$output['schedule'] = $arguments[2];
	  			$output['direction'] = $arguments[3];
	  			$output['time'] = $arguments[4];
	  		}
	  		$output = json_encode($output);
	  		echo $output;
	  	}
	  	public function get_data(){
	  		require('../../../connect.php');
	  		$query = "select name,schedule,direction,time from students where numberId=?";
	  		$stmt = $db->prepare($query);
	  		$stmt->bind_param("s",$this->number);
	  		$stmt->execute();
	  		$stmt->bind_result($name,$schedule,$direction,$time);
	  		$stmt->fetch();
	  		$this->response('ok',$name,$schedule,$direction,$time);
	  		$stmt->close();
	  		$db->close();
	  	}
	  }
	  $getData = new Get_sche($_POST['number']);
	  $getData->check_num();
	  $getData->get_data();
?>