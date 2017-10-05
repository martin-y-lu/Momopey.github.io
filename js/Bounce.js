var mouse={x:0,y:0}
var mousePress=false;
window.addEventListener("mousedown",function(event){mousePress=true;},false);
window.addEventListener("mouseup",function(event){mousePress=false;},false);

window.addEventListener("mousemove",function(event){
  mouse.x=event.x;
  mouse.y=event.y;
})
function mouseDoc(doc){
  return new vect(mouse.x-doc.getBoundingClientRect().left,
                  mouse.y-doc.getBoundingClientRect().top)
}
function drawLine(X1,Y1,X2,Y2,con){
  con.beginPath();
  con.moveTo(X1,Y1);
  //con.strokeStyle='rgba(255,255,255,1)';
  con.lineTo(X2,Y2);
  con.stroke();
}
function lineBall(X,Y,R,con){
    con.beginPath();
    con.arc(X,Y,   
    R,0,Math.PI*2,false);
    //con.strokeStyle='rgba(255,255,255,1)';
    con.stroke();
}
function fillBall(X,Y,R,con){
    con.beginPath();
    con.arc(X,Y,   
    R,0,Math.PI*2,false);
    con.strokeStyle='rgba(255,255,255,1)';
    con.stroke();
    con.fill();
}
function vect(X,Y){
  this.x=X;
  this.y=Y;
  this.set=function(V){
    this.x=V.x;
    this.y=V.y;
  }
  this.Copy=function(){
    return new vect(this.x,this.y);
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
function tween(T,B,M){
  return ((M<=T)&&(M>=B))||((M>=T)&&(M<=B));
}

var ca=document.getElementById("Bounce");
var ctx=ca.getContext("2d");
ca.height=500;

function ball(Pos,Vel,Acc){
  this.Pos=Pos;
  this.Vel=Vel;
  this.Acc=Acc;
  this.Grav=Acc.Copy();
  this.CopyBall=function(){
    return new ball(this.Pos.Copy(),this.Vel.Copy(),this.Acc.Copy());
  }
  this.Update=function(){
    this.Pos=this.NextPos();
    this.Vel.set(Vadd(this.Vel,this.Acc));
    this.Acc.set(this.Grav);
  }
  this.NextPos=function(){
      return Vadd(this.Pos,Vadd(this.Vel,Vmult(this.Acc,0.5)));
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
function animateBounce(){
  requestAnimationFrame(animateBounce);
  ca.width=innerWidth;
  T++;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.fillStyle = "white";
  ctx.fillText(T,10,50);
  ctx.fillText(BList.length,10,60);
  if(Creating===false){
    if(mousePress){
      WList.push(new wall(mouseDoc(ca),new vect(0,0),0.8,0.8));
      Creating=true;
    }
  }else{
    if(mousePress){
      WList[WList.length-1].Base.set(Vadd(mouseDoc(ca),Vmult(WList[WList.length-1].Corner,-1)));
    }else{
      Creating=false;
    }
  }
  BList.push(new ball(new vect(Math.random()*ca.width,5),new vect(Math.random()*6-3,Math.random()*2-1),new vect(0,0.1)));
  //BList.push(new ball(new vect(10,10),new vect(3,0),new vect(0,1)));
  ctx.strokeStyle='rgba(255,255,255,1)';
  for(var w=0;w<WList.length;w++){
    var W=WList[w];
    ctx.lineWidth=10;
    drawLine(W.Corner.x,W.Corner.y,W.Corner.x+W.Base.x,W.Corner.y+W.Base.y,ctx);
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
    ctx.lineWidth=1;
    fillBall(Balll.Pos.x,Balll.Pos.y,4,ctx);
    fillBall(Balll.NextPos().x,Balll.NextPos().y,4,ctx);
    ctx.lineWidth=10;
    drawLine(Balll.Pos.x,Balll.Pos.y,Balll.NextPos().x,Balll.NextPos().y,ctx);
    if(Balll.Pos.y>ca.height){
      BList.splice(BList.length-i-1,1);
    }
     Balll.Update();
  }
}
animateBounce();
var MBall=new ball(new vect(2,3),new vect(1.5,-2),new vect(0,1));
var Clicks=false;

var ca1=document.getElementById("Fig1");
var F1=ca1.getContext("2d");
ca1.height=250;
function animateF1(){
  ca1.width=innerWidth-80;
  requestAnimationFrame(animateF1);
  if(Clicks===false){
    if(tween((MBall.Pos.x*40)+10,(MBall.Pos.x*40)-10,mouseDoc(ca1).x)&&
        tween((MBall.Pos.y*40)+10,(MBall.Pos.y*40)-10,mouseDoc(ca1).y)){
      if(mousePress){
        Clicks=true;
      }
    }
  }else{
    if(mousePress){
      MBall.Pos.set(Vmult(mouseDoc(ca1),1/40));
    }else{
      Clicks=false;
    }
  }
  F1.clearRect(0, 0, innerWidth, innerHeight);
  F1.lineWidth=2;
  F1.font="15px Mukta"
  F1.strokeStyle='rgba(255,255,255,1)';
  for(var linesY=0;linesY<MBall.Pos.y-.25;linesY++){
    drawLine(MBall.Pos.x*40-5,linesY*40,MBall.Pos.x*40+5,linesY*40,F1);
  }
  for(var linesX=0;linesX<MBall.Pos.x-.25;linesX++){
    drawLine(linesX*40,MBall.Pos.y*40-5,linesX*40,MBall.Pos.y*40+5,F1);
  }
  drawLine(MBall.Pos.x*40,0,MBall.Pos.x*40,MBall.Pos.y*40-10,F1);
  drawLine(0,MBall.Pos.y*40,MBall.Pos.x*40-10,MBall.Pos.y*40,F1);
  lineBall(MBall.Pos.x*40,MBall.Pos.y*40,10,F1);
  F1.fillStyle = "white";
  F1.fillText("("+Math.round(MBall.Pos.x*10)/10+","+Math.round(MBall.Pos.y*10)/10+")"
              ,MBall.Pos.x*40+12,MBall.Pos.y*40+3);
  F1.fillText("Drag the ball to change position",10,240);
}
animateF1()

var ca2=document.getElementById("Fig2");
var F2=ca2.getContext("2d");
var Clicks2=false;
var VelClick=false;
var AccClick=false;
var CopyMBall=MBall.CopyBall();
ca2.height=250;
function animateF2(){
  requestAnimationFrame(animateF2);
  ca2.width=innerWidth-80;
  if(Clicks2===false){
    if(tween((MBall.Pos.x*40)+20,(MBall.Pos.x*40)-20,mouseDoc(ca2).x)&&
        tween((MBall.Pos.y*40)+20,(MBall.Pos.y*40)-20,mouseDoc(ca2).y)){
      if(mousePress&&((VelClick||AccClick)===false)){
        Clicks2=true;
      }
    }
  }else{
    if(mousePress){
      MBall.Pos.set(Vmult(mouseDoc(ca2),1/40));
    }else{
      Clicks2=false;
    }
  }
  if(VelClick===false){
    if(tween((MBall.Pos.x+MBall.Vel.x)*40+20,(MBall.Pos.x+MBall.Vel.x)*40-20,mouseDoc(ca2).x)&&
        tween((MBall.Pos.y+MBall.Vel.y)*40+20,(MBall.Pos.y+MBall.Vel.y)*40-20,mouseDoc(ca2).y)){
      if(mousePress&&((Clicks2||AccClick)===false)){
        VelClick=true;
      }
    }
  }else{
    if(mousePress){
      MBall.Vel.set(Vmult(Vadd(mouseDoc(ca2),Vmult(MBall.Pos,-40)),1/40));
    }else{
      VelClick=false;
    }
  }
  if(AccClick===false){
    if(tween((MBall.Pos.x+MBall.Acc.x)*40+20,(MBall.Pos.x+MBall.Acc.x)*40-20,mouseDoc(ca2).x)&&
        tween((MBall.Pos.y+MBall.Acc.y)*40+20,(MBall.Pos.y+MBall.Acc.y)*40-20,mouseDoc(ca2).y)){
      if(mousePress&&((VelClick||Clicks2)===false)){
        AccClick=true;
      }
    }
  }else{
    if(mousePress){
      MBall.Acc.set(Vmult(Vadd(mouseDoc(ca2),Vmult(MBall.Pos,-40)),1/40));
    }else{
      AccClick=false;
    }
  }
  F2.clearRect(0, 0, innerWidth, innerHeight);
  F2.lineWidth=2;
  F2.strokeStyle='rgba(255,255,255,1)';
  
  CopyMBall=MBall.CopyBall();
  for(var Loopdraw=0;Loopdraw<15;Loopdraw++){
    F2.strokeStyle='rgba(150,150,150,1)';
    drawLine(CopyMBall.Pos.x*40,CopyMBall.Pos.y*40,CopyMBall.NextPos().x*40,CopyMBall.NextPos().y*40,F2);
    CopyMBall.Update();
    F2.strokeStyle='rgba('+255*(15-Loopdraw)/15+","+255*(15-Loopdraw)/15+","+255*(15-Loopdraw)/15+',1)';
    lineBall(CopyMBall.Pos.x*40,CopyMBall.Pos.y*40,10,F2);
  }
  F2.strokeStyle='rgba(255,255,255,1)';
  for(var linesY=0;linesY<MBall.Pos.y-0.25;linesY++){
    drawLine(MBall.Pos.x*40-5,linesY*40,MBall.Pos.x*40+5,linesY*40,F2);
  }
  for(var linesX=0;linesX<MBall.Pos.x-0.25;linesX++){
    drawLine(linesX*40,MBall.Pos.y*40-5,linesX*40,MBall.Pos.y*40+5,F2);
  }
  
  drawLine(MBall.Pos.x*40,0,MBall.Pos.x*40,MBall.Pos.y*40-10,F2);
  drawLine(0,MBall.Pos.y*40,MBall.Pos.x*40-10,MBall.Pos.y*40,F2);
  lineBall(MBall.Pos.x*40,MBall.Pos.y*40,10,F2);
  F2.lineWidth=3;
  F2.fillStyle = "white";
  drawLine(MBall.Pos.x*40,MBall.Pos.y*40,MBall.Pos.x*40+MBall.Vel.x*40,MBall.Pos.y*40+MBall.Vel.y*40,F2);
  drawLine(MBall.Pos.x*40,MBall.Pos.y*40,MBall.Pos.x*40+MBall.Acc.x*40,MBall.Pos.y*40+MBall.Acc.y*40,F2);
  fillBall(MBall.Pos.x*40+MBall.Vel.x*40,MBall.Pos.y*40+MBall.Vel.y*40,2,F2);
  fillBall(MBall.Pos.x*40+MBall.Acc.x*40,MBall.Pos.y*40+MBall.Acc.y*40,2,F2);
  F2.font="15px Mukta"
  F2.fillText("Drag everything!",10,240);
  F2.fillText("Velocity",MBall.Pos.x*40+MBall.Vel.x*40+10,MBall.Pos.y*40+MBall.Vel.y*40+5);
  F2.fillText("Acceleration",MBall.Pos.x*40+MBall.Acc.x*40+10,MBall.Pos.y*40+MBall.Acc.y*40+5);
}
animateF2();
