function clickBtn1(id){
  console.log(id)
  document.getElementById(id).setAttribute("disabled", true);
  document.getElementById(id).style.color = "White";
  if (id.includes('1')){
    var id = id.replace('1', '2')
    post_api(id.split('-')[0],1)
  }else{
    var id = id.replace('2', '1')
    post_api(id.split('-')[0],0)
  }
  console.log(id)
	document.getElementById(id).removeAttribute("disabled");
  document.getElementById(id).style.color = "black";
/* 	if (document.getElementById("b1").disabled === true){
		// disabled属性を削除
		document.getElementById("b1").removeAttribute("disabled");
		document.getElementById("b1").style.color = "black";
	}else{
		// disabled属性を設定
		document.getElementById("b1").setAttribute("disabled", true);
		document.getElementById("b1").style.color = "White";
	} */
  
}

function post_api(name,status){
  fetch(`http://127.0.0.1:5000/btn?name=${name}&status=${status}`)
  .then(response => console.log(response))
  .then(data => console.log(data));
  
}