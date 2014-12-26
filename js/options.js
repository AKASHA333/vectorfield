$("#options").toggleClass("hide");
var txt = $("#options").hasClass('hide') ? '<' : '>';
$(".tab").text(txt);

function updatePText(val){
	$("#plotpointsval").html(val);
	plotPoints=parseInt(val)
}

function updateFText(val){
	$("#fpsval").html(val)
	fps=parseInt(val)
}

function updateDText(val){
	$("#dtval").html(val)
	dt=parseInt(val)
}

$(document).ready(function(){
	$(".tab").on("click", function(){
		$("#options").toggleClass("hide");
		var txt = $("#options").hasClass('hide') ? '<' : '>';
		$(".tab").text(txt);
	});

});