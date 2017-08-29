var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.rect(80,40,150,window.event.clientY);
ctx.stroke();
