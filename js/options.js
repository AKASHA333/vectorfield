$("#options").toggleClass("hide");
var txt = $("#options").hasClass('hide') ? '<' : '>';
$(".tab").text(txt);

function updatePText(val){
	$("#plotpointsval").html(val);
}

function updateFText(val){
	$("#fpsval").html(val)
}

function updateDText(val){
	$("#dtval").html(val)
}

$(document).ready(function(){
	$(".tab").on("click", function(){
		$("#options").toggleClass("hide");
		var txt = $("#options").hasClass('hide') ? '<' : '>';
		$(".tab").text(txt);
	});

});