$("#options").toggleClass("hide");
var txt = $("#options").hasClass('hide') ? '<' : '>';
$(".tab").text(txt);


$(".tab").on("click", function(){
	$("#options").toggleClass("hide");
	var txt = $("#options").hasClass('hide') ? '<' : '>';
	$(".tab").text(txt);
});

/*$(document).ready(function() {
	$("#slider-range-min" ).slider({
	    	range: "min",
	    	value: 37,
	    	min: 1,
	    	max: 700,
	    	slide: function( event, ui ) {
	        	$( "#amount" ).val( "$" + ui.value );
	      	}
	    });
	    $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
	});*/