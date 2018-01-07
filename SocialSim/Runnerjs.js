// JS setup functions
/////-----------
var mouse={x:0,y:0}  ;// mouse position on screen
var mousePress=false;// Mouse held down
var scroll=new vect(0,0);//scroll X,Y
//Event listsneys
window.addEventListener("mousedown",function(event){mousePress=true;},false);
window.addEventListener("mouseup",function(event){mousePress=false;},false);
window.addEventListener("mousemove",function(event){
  mouse.x=event.x;
  mouse.y=event.y;
})
window.addEventListener("scroll",function (e) {
    scroll.x=window.scrollX;
    scroll.y=window.scrollY;
});

var C=new Community();//Makes Community for Top Displat
var ca=document.getElementById("System");//Canvas Element
var F=ca.getContext("2d");//2d context element
ca.height=500;//Set canvas height
for(var N=0;N<9;N++){//Add nine Particles with rad 1 (shift pos later with cam)
  C.PList.push(new Person(new vect(Math.cos(N/9*2*Math.PI)*ca.height/2,Math.sin(N/9*2*Math.PI)*ca.height/2),C));
  if(N>0){
    C.CList.push(new Connect(N-1,N,1,C));//Add connects in loop
  }
}
C.CList.push(new Connect(0,9-1,1,C));//Add last conneect
C.Speed=0.008;//Set Community speed

C.LikeDist=ca.height*.35;//Set Like dist
C.HateDist=C.LikeDist*2;//Set Hate Dist
function animateSystem(){//Animator
ca.width=innerWidth;//Set innerwidth
C.Cam.Shift=new vect(ca.width/2,ca.height/2);//Set Camshift halfway
F.clearRect(0, 0, innerWidth, innerHeight);//Scale

C.MouseInteract(mouseDoc(ca),-1);//Mouse Interaction
C.UpdatePos();
C.UpdateAll()

C.Draw(F);
}

var MousePress=new Hold();
var MouseClick=new Hold();
function animateCore(){
    MousePress.Calc(mousePress&&MousePress.H===false,mousePress===false);
    MouseClick.Calc(mousePress&&MousePress.H===false,MousePress.H);
    MousePress.Store();
    MouseClick.Store();

    requestAnimationFrame(animateCore);
    animateSystem();
    animatePa();
}
animateCore();
