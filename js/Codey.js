var ca=document.getElementById("myCanvas");
ca.width=window.innerWidth;
var ar=document.getElementById("title");
var ctx=ca.getContext("2d");
var mouse={
	x:0,
  y:0
}
window.addEventListener("mousemove",function(event){mouse.x=event.x;mouse.y=event.y;})
var NumPoi=10;
var shift=3;
var N=0;
function animate(){
  requestAnimationFrame(animate);
  ca.width=window.innerWidth;
  ca.height=document.getElementById("title").offsetHeight;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  NumPoi=Math.floor(1+mouse.y/10)
  shift=Math.floor(1+mouse.x/100);
  N=shift;
  while((N==0)==false){
  	ctx.beginPath();
    ctx.moveTo(ca.width/2+Math.cos(N/NumPoi*2*Math.PI)*(ca.height/2-5),
    ca.height/2+Math.sin(N/NumPoi*2*Math.PI)*(ca.height/2-5));
    ctx.strokeStyle='rgba(0,0,0,1)';
    ctx.lineTo(ca.width/2+Math.cos((N+shift)/NumPoi*2*Math.PI)*(ca.height/2-5),
    ca.height/2+Math.sin((N+shift)/NumPoi*2*Math.PI)*(ca.height/2-5))
    ctx.stroke();
    N=(N+shift)%NumPoi;
  }
  for(var I=0;I<NumPoi;I++){
  	ctx.beginPath();
    ctx.arc(ca.width/2+Math.cos(I/NumPoi*2*Math.PI)*(ca.height/2-5),
    ca.height/2+Math.sin(I/NumPoi*2*Math.PI)*(ca.height/2-5),   
    3,0,Math.PI*2,false);
    ctx.strokeStyle='rgba(0,0,255,1)';
    ctx.stroke();
   
  }
  ctx.strokeStyle='rgba(0,0,255,1)'
  ctx.fillText(mouse.x,10,10);
  ctx.stroke();
}
animate();

