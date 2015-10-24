var vf = {
  plotPoints: 60,
  fps: 30,
  antialiasing: true
};

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(vf, 'plotPoints', 4, 300).step(1);
  gui.add(vf, 'fps', 20, 60).step(1);
};


var whiteMaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff
} );

var blueMaterial = new THREE.MeshBasicMaterial( {
	color: 0x2980b9
} );

var redMaterial = new THREE.MeshBasicMaterial({
	color: 0xE74C3C
} );

var blackMaterial = new THREE.MeshBasicMaterial({
	color: 0x000000
} );

var xcomp, ycomp, scale, max
var dt
var $canvas = $('#canvas');
var camera
var scene
var geometry, region

setup()

function setup(){
	stop=false
	scene = new THREE.Scene();

	ratio = window.innerWidth/(window.innerHeight-50);
	width = 10*ratio
	height = 10
	console.log("ratio = " + ratio)

	if (window.WebGLRenderingContext)
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialiasing: vf.antialiasing
		});
	else
		renderer = new THREE.CanvasRenderer();

	renderer.setSize( window.innerWidth, window.innerHeight-74);
	//renderer.setClearColorHex( 0xF2F0EF, 1 );
	$canvas.append( renderer.domElement );;

	THREEx.WindowResize(renderer, camera);

	geometry = new THREE.BoxGeometry();
	region = new THREE.Mesh(geometry, redMaterial);

  windowResize = THREEx.WindowResize(renderer, camera)

	refresh2D()
}

$("#i").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#go").click();
	    }
	});
$("#j").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#go").click();
	    }
	});


function refresh2D(){
	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera(-width, width, -height, height, 1, 1000);
	camera.position.set(0,0, 30)
	scene.add(camera);

	var xAxisGeometry = new THREE.Geometry();
	xAxisGeometry.vertices.push(new THREE.Vector3(-width, 0, 0));
	xAxisGeometry.vertices.push(new THREE.Vector3(width, 0, 0));

	var yAxisGeometry = new THREE.Geometry();
	yAxisGeometry.vertices.push(new THREE.Vector3(0, -height, 0));
	yAxisGeometry.vertices.push(new THREE.Vector3(0, height, 0));

	var xaxis = new THREE.Line(xAxisGeometry, whiteMaterial);
	var yaxis = new THREE.Line(yAxisGeometry, whiteMaterial);
	scene.add(xaxis);
	scene.add(yaxis);

	console.log("start")
	xcomp= $('#i').val();
	ycomp= $('#j').val();
	console.log(xcomp,ycomp);
	geometry = new THREE.BoxGeometry();
	region = new THREE.Mesh(geometry, redMaterial);


	//figure out good scale for vector ticks
	scale = .1;
	max =0;
	for(var x=-10; x<10; x++){
		for(var y=-10; y<10; y++){
			mag = Math.pow(getFieldX(x,y), 2) + Math.pow(getFieldY(x,y),2);
			if(max<mag){
				max=mag
			}
		}
	}

	max = Math.pow(max, .5);
	console.log("max " + max)
	scale=1/max;
	dt=scale*.175
	if(dt>.1){
		dt=dt*.5
	}
	console.log("dt=" + dt)
	var arrowHelper;


	//representing vector field
	for(var x=-width; x<width; x++){
		for(var y=-height; y<=height; y++){
			if (x!=0 && y!=0){
				dx= getFieldX(x,y)*scale;
				dy= getFieldY(x,y)*scale;
				mag=Math.sqrt(Math.pow(dx, 2) + Math.pow(dy,2));
				var dir = new THREE.Vector3( dx/mag, dy/mag, 0 );
				var origin = new THREE.Vector3( x, y, 0 );
				var length = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
				var hex =  0x2980b9;
				if(length>.5)
					arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex, .2,.15 );
				else if(length>.35)
					arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex, .1,.15 );
				else
					arrowHelper = new THREE.ArrowHelper( dir, origin, .2, hex, .05,.1 );
				scene.add( arrowHelper );
			}
		}
	}

}

function getFieldX(x,y){
	return eval(xcomp)
}

function getFieldY(x,y){
	return -eval(ycomp)
}

function setMousePosition(e) {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) { //Moz
        mouse.x = ev.pageX + window.pageXOffset;
        mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) { //IE
        mouse.x = ev.clientX + document.body.scrollLeft;
        mouse.y = ev.clientY + document.body.scrollTop;
    }
};

var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
};
var element = null;

canvas.onmousemove = function (e) {
    setMousePosition(e);
    if (element !== null) {
        element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
        element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
        element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
        element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
    }
}

canvas.onclick = function (e) {
    if (element !== null) {
        w=element.style.width
        w=w.substring(0,w.length-2)
        w=PixToX(w)

        h=element.style.height
        h=h.substring(0,h.length-2)
        h=PixToX(h)

        x=element.style.left;
        x=(x.substring(0,x.length-2))-window.innerWidth/2;
        x=PixToX(x)+w/2

        y=element.style.top;
        y=y.substring(0,y.length-2)-(window.innerHeight)/2-11;
        y=PixToX(y)+h/2

		scene.remove(region)
    geometry = new THREE.BoxGeometry(w, h, 0, vf.plotPoints, vf.plotPoints, 0);
    console.log(vf.plotPoints);
		region = new THREE.Mesh(geometry, redMaterial);
		region.position.x += x;
		region.position.y += y;
		scene.add(region);

		element.parentNode.removeChild(element);
		element = null;
    } else {
        mouse.startX = mouse.x;
        mouse.startY = mouse.y;
        element = document.createElement('div');
        element.className = 'rectangle'
        element.style.left = mouse.x + 'px';
        element.style.top = mouse.y + 'px';
        $canvas.append(element);
    }
}

function updateFrame(dt){
	for (var i in region.geometry.vertices){
		var vertex = region.geometry.vertices[i];
		var coord = scene.localToWorld(vertex.clone()).add(region.position);
		var vx = getFieldX(coord.x, coord.y);
		var vy = getFieldY(coord.x, coord.y);
		var v = new THREE.Vector3(vx,vy,0);
		var ds = v.multiplyScalar(dt);
		vertex.add(ds);
	}
	region.geometry.verticesNeedUpdate=true;
}

function PixToX(x){
	return (2*width/window.innerWidth)*x
}

function render() {
	if(!stop){
		setTimeout( function() {
			requestAnimationFrame( render );
		}, 1000/vf.fps);
		updateFrame(dt);
		renderer.render( scene, camera );
	}
}
render();

function stop2D(){
	stop=true
}
