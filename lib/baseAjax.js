(function(){
	Base = function(){
	};
	Base.prototype = {
		constructor : Base,
		Ajax : function(API, data, type, callBack){
			if (type == 'jsonp') {
				$.ajax({
					url : API,
					data : data,
					dataType : 'jsonp',
					type : 'GET',
					success: function(result,status,xhr){
						callBack(result);
					}
				});				
			}
			else{
				$.ajax({
					url : API,
					data : data,
					dataType : 'json',
					type : 'POST',
					success : function(result,status,xhr){
						callBack(result);
					}
				});
			}
		}
	}
})();
var base = function(){
	return new Base();
}