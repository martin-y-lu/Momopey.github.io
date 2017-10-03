var ca=document.getElementById("Canvas");
var ctx=ca.getContext("2d");
ca.height=600;
var mouse={
	x:0,
	y:0
}
var mousePress=false;
window.addEventListener("mousemove",function(event){mouse.x=event.x;mouse.y=event.y;})
window.addEventListener("mousedown",function(event){mousePress=true;},false);
window.addEventListener("mouseup",function(event){mousePress=false;},false);
function drawLine(X1,Y1,X2,Y2){
  ctx.beginPath();
  ctx.moveTo(X1,Y1);
  ctx.strokeStyle='rgba(255,255,255,1)';
  ctx.lineTo(X2,Y2);
  ctx.stroke();
}
function drawBall(X,Y,R){
     ctx.beginPath();
    ctx.arc(X,Y,   
    R,0,Math.PI*2,false);
    ctx.strokeStyle='rgba(255,255,255,1)';
    ctx.stroke();
    ctx.fill();
}
function vect(X,Y){
  this.x=X;
  this.y=Y;
  this.set=function(V){
    this.x=V.x;
    this.y=V.y;
  }
  this.Copy=function(){
    return new vect(x,y);
  }
}
function Vadd(A,B){
  return new vect(A.x+B.x,A.y+B.y);
}
function Vmult(V,F){
  return new vect(V.x*F,V.y*F);
}
function Vx(A,B){
  return new vect(A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x);
}
function Vdiv(P,C){
  return new vect((C.x*P.x+C.y*P.y)/((C.x*C.x)+(C.y*C.y)),
  (C.x*P.y-C.y*P.x)/((C.x*C.x)+(C.y*C.y)));
}
function ball(Pos,Vel,Acc){
  this.Pos=Pos;
  this.Vel=Vel;
  this.Acc=Acc;
  this.Copy=function(){
    var Cop=new Ball(Pos.Copy(),Vel.Copy(),Acc.Copy());
    Cop.Acc=Acc.Copy();
    return Cop;
  }
  this.Update=function(){
    this.Pos=this.NextPos();
    this.Vel.set(Vadd(this.Vel,this.Acc));
    this.Acc.set(new vect(0,0.15));
  }
  this.NextPos=function(){
      return Vadd(this.Pos,Vadd(this.Vel,Vmult(this.Acc,0.5)));
  }
  this.BBounce=function(){
    if(this.Pos.y>400-5){
      Vel.y*=-1;
      Pos.y=400-5;
    }
    if(this.Pos.x>ca.width-5){
      Vel.x*=-1;
      Pos.x=ca.width-5;
    }if(this.Pos.x<5){
      Vel.x*=-1;
      Pos.x=5;
    }
  }
}
function wall(Corner,Base,Bounce,Slide){
  this.Corner=Corner;
  this.Base=Base;
  this.Bounce=Bounce;
  this.Slide=Slide;
  this.Collides=function(Po){
    var Posr=Vdiv(Vadd(Po.Pos,Vmult(Corner,-1)),Base);
    var Nextr=Vdiv(Vadd(Po.NextPos(),Vmult(Corner,-1)),Base);
    var C1=((Posr.y>0)&&(Nextr.y<0));
    var C2=((Posr.y<0)&&(Nextr.y>0));
    var C3=((Posr.y===0)&&(Nextr.y>0));
    var C4=((Nextr.y===0)&&(Posr.y>0));
    var C5=((Posr.y===0)&&(Nextr.y===0));
    var Tween=((Posr.x>=0)&&(Posr.x<=1))||((Nextr.x>=0)&&(Nextr.x<=1));
    return (C1||C2||C3||C4||C5)&&Tween;
  }
  this.Bounce=function(Po){
    var Rvel=Vdiv(Po.Vel,Base);
    var RAcc=Vdiv(Po.Acc,Base);
    RAcc.x*=1+Slide*(Rvel.y+RAcc.y); 
    Rvel.y*=-Bounce;
    Rvel.x*=Slide;
    Po.Vel=Vx(Rvel,Base);
    Po.Acc=Vx(RAcc,Base);
  }
  this.Stablise=function(Po){
    var RVel=Vdiv(Po.Vel,Base);
    RVel.y=0;
    Po.Vel=Vx(RVel,Base); 
    
    var RACc=Vdiv(Po.Acc,Base);
    RACc.y=0;
    Po.Acc=Vx(RACc,Base); 
  }
}
function NumColliding(P){//number of particles colliding
  var coll=0;
  for(var oa=0;oa<WList.length;oa++){
    if(WList[oa].Collides(P)){
      coll+=1;
    }
  }
  return coll;
}
var BList=[];
var LastList=[];
var WList=[];
var T=0;
var Creating=false;
function animate(){
  requestAnimationFrame(animate);
  ca.width=innerWidth;
  T++;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = "white";
  ctx.fillText(T,10,50);
  ctx.fillText(BList.length,10,60);
  if(Creating===false){
    if(mousePress){
      WList.push(new wall(new vect(mouse.x,mouse.y),new vect(0,0),1,1));
      Creating=true;
    }
  }else{
    if(mousePress){
      WList[WList.length-1].Base.set(Vadd(new vect(mouse.x,mouse.y),Vmult(WList[WList.length-1].Corner,-1)));
    }else{
      Creating=false;
    }
  }
  BList.push(new ball(new vect(10,10),new vect(0,0),new vect(0,1)));
  for(var w=0;w<WList.length;w++){
    var W=WList[w];
    ctx.lineWidth=15;
    drawLine(W.Corner.x,W.Corner.y,W.Corner.x+W.Base.x,W.Corner.y+W.Base.y);
  }
  for(var i=0;i<BList.length;i++){
    var Balll=BList[BList.length-i-1];
      for(var num=0;(NumColliding(Balll)>0)&&(num<=NumColliding(Balll)+2);num++){
        if(num>NumColliding(Balll)+1){
           Balll.Acc=new vect(0,0);//STABLEISE
           Balll.Vel=new vect(0,0);
        }
        for(var l=0;l<WList.length;l++){
           var L=WList[l];
           if(L.Collides(Balll)){
             L.Bounce(Balll);
             if(L.Collides(Balll)){
                L.Stablise(Balll);
             }
           }
        }
      }
    Balll.Update();
    ctx.lineWidth=1;
    drawBall(Balll.Pos.x,Balll.Pos.y,6.5);
    drawBall(Balll.NextPos().x,Balll.NextPos().y,6.5);
    ctx.lineWidth=15;
    drawLine(Balll.Pos.x,Balll.Pos.y,Balll.NextPos().x,Balll.NextPos().y);
    if(Balll.Pos.y>600){
      BList.splice(BList.length-i-1,1);
    }
  }
  for(var c=0;c<BList.length;c++){
    LastList.push(BList[c].Copy());
  }
}
animate();
