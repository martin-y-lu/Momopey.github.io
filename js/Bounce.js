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
function mouseInCanvas(doc){
  return tween(0,doc.width,mouseDoc(doc).x)&&tween(0,doc.height,mouseDoc(doc).y);
}
function ElementOffScreen(doc){
  var rect = doc.getBoundingClientRect();
  return (rect.left + rect.width) < 0 || (rect.top + rect.height) < 0|| (rect.left >innerWidth || rect.top > innerHeight);
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
function wall(Corner,Base,bounce,slide){
  this.Corner=Corner;
  this.Base=Base;
  this.bounce=bounce;
  this.slide=slide;
  this.CopyWall=function(){
    return new wall(this.Corner.Copy(),this.Base.Copy(),this.bounce,this.slide);
  }
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
    Rvel.y*=-this.bounce;
    Rvel.x*=this.slide;
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
function Hold(){
  this.Holding=false;
  this.Starts=false;
  this.Ended=false;
  this.Started=function(Bool){
    this.Ended=false;
    this.Starts=false;
    if(this.Holding===false){
      this.Holding=Bool;
      this.Starts=Bool;
    }
    
  }
  this.Continuing=function(Bool){
    if(this.Holding===true){
      this.Holding=Bool;
      this.Ended=true;
    }
  }
}
var ca=document.getElementById("Bounce");
var ctx=ca.getContext("2d");
ca.height=500;
var BList=[];
var WList=[];
var T=0;
var Creating=new Hold();
function animateBounce(){
  requestAnimationFrame(animateBounce);
  if(ElementOffScreen(ca)===false){
    ca.width=innerWidth;
    T++;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "white";
    ctx.fillText(T,10,50);
    ctx.fillText(BList.length,10,60);
    Creating.Started(mousePress);
    Creating.Continuing(mousePress&&mouseInCanvas(ca));
    if(Creating.Starts){
      WList.push(new wall(mouseDoc(ca),new vect(0,0),0.8,0.8));
    }
    if(Creating.Holding){
      WList[WList.length-1].Base.set(Vadd(mouseDoc(ca),Vmult(WList[WList.length-1].Corner,-1)));
    }
    if((T%2)===0){
      BList.push(new ball(new vect(Math.random()*ca.width,5),new vect(Math.random()*6-3,Math.random()*2-1),new vect(0,0.1)));
    }
    //BList.push(new ball(new vect(10,10),new vect(3,0),new vect(0,0.1)));
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
}
animateBounce();
var MBall=new ball(new vect(2,3),new vect(1.5,-2),new vect(0,1));
var Clicks=new Hold();

var ca1=document.getElementById("Fig1");
var F1=ca1.getContext("2d");
ca1.height=250;
function animateF1(){
  ca1.width=innerWidth*60/100;
  requestAnimationFrame(animateF1);
  if(ElementOffScreen(ca1)===false){
  Clicks.Started((tween((MBall.Pos.x*40)+10,(MBall.Pos.x*40)-10,mouseDoc(ca1).x)&&
        tween((MBall.Pos.y*40)+10,(MBall.Pos.y*40)-10,mouseDoc(ca1).y))&&mousePress);
  Clicks.Continuing(mousePress&&mouseInCanvas(ca1));
  if(Clicks.Holding){
    MBall.Pos.set(Vmult(mouseDoc(ca1),1/40));
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
}
animateF1()

var ca2=document.getElementById("Fig2");
var F2=ca2.getContext("2d");
var Clicks2=new Hold();
var VelClick=new Hold();
var AccClick=new Hold();
var CopyMBall=MBall.CopyBall();
ca2.height=250;
function animateF2(){
  requestAnimationFrame(animateF2);
  ca2.width=innerWidth*60/100;
  if(ElementOffScreen(ca2)===false){
    VelClick.Started((tween((MBall.Pos.x+MBall.Vel.x)*40+20,(MBall.Pos.x+MBall.Vel.x)*40-20,mouseDoc(ca2).x)&&
          tween((MBall.Pos.y+MBall.Vel.y)*40+20,(MBall.Pos.y+MBall.Vel.y)*40-20,mouseDoc(ca2).y))&&mousePress&&((Clicks2.Holding||AccClick.Holding)===false));
    VelClick.Continuing(mousePress&&mouseInCanvas(ca2));
    if(VelClick.Holding){
       MBall.Vel.set(Vmult(Vadd(mouseDoc(ca2),Vmult(MBall.Pos,-40)),1/40));
    }
    AccClick.Started((tween((MBall.Pos.x+MBall.Acc.x)*40+20,(MBall.Pos.x+MBall.Acc.x)*40-20,mouseDoc(ca2).x)&&
          tween((MBall.Pos.y+MBall.Acc.y)*40+20,(MBall.Pos.y+MBall.Acc.y)*40-20,mouseDoc(ca2).y))&&mousePress&&((Clicks2.Holding||VelClick.Holding)===false));
    AccClick.Continuing(mousePress&&mouseInCanvas(ca2));
    if(AccClick.Holding){
      MBall.Acc.set(Vmult(Vadd(mouseDoc(ca2),Vmult(MBall.Pos,-40)),1/40));
    }
    Clicks2.Started((tween((MBall.Pos.x*40)+10,(MBall.Pos.x*40)-10,mouseDoc(ca2).x)&&
          tween((MBall.Pos.y*40)+10,(MBall.Pos.y*40)-10,mouseDoc(ca2).y))&&mousePress&&((VelClick.Holding||AccClick.Holding)===false));
    Clicks2.Continuing(mousePress&&mouseInCanvas(ca2));
    if(Clicks2.Holding){
      MBall.Pos.set(Vmult(mouseDoc(ca2),1/40));
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
}
animateF2();

var ca3=document.getElementById("Fig3");
var F3=ca3.getContext("2d");
var Clicks3=new Hold();
var VelClick2=new Hold();
var AccClick2=new Hold();
var BounceClick=new Hold();
var SlideClick=new Hold();
var MWall=new wall(new vect(1,10.5),new vect(27,0),.5,1);
var FlatWall=new wall(new vect(1,10.5),new vect(27,0),.8,1);
var WallBalls=MBall.CopyBall();
var WallCornClick=new Hold();
var WallEndClick=new Hold();
ca3.height=250;
function animateF3(){
  ca3.width=innerWidth*60/100;
  requestAnimationFrame(animateF3);
  if(ElementOffScreen(ca3)===false){
    VelClick2.Started((tween((MBall.Pos.x+MBall.Vel.x)*20+10,(MBall.Pos.x+MBall.Vel.x)*20-10,mouseDoc(ca3).x)&&
          tween((MBall.Pos.y+MBall.Vel.y)*20+10,(MBall.Pos.y+MBall.Vel.y)*20-10,mouseDoc(ca3).y))&&mousePress&&((Clicks3.Holding||AccClick2.Holding)===false));
    VelClick2.Continuing(mousePress&&mouseInCanvas(ca3));
    if(VelClick2.Holding){
       MBall.Vel.set(Vmult(Vadd(mouseDoc(ca3),Vmult(MBall.Pos,-20)),1/20));
    }
    AccClick2.Started((tween((MBall.Pos.x+MBall.Acc.x)*20+10,(MBall.Pos.x+MBall.Acc.x)*20-10,mouseDoc(ca3).x)&&
          tween((MBall.Pos.y+MBall.Acc.y)*20+10,(MBall.Pos.y+MBall.Acc.y)*20-10,mouseDoc(ca3).y))&&mousePress&&((Clicks3.Holding||VelClick2.Holding)===false));
    AccClick2.Continuing(mousePress&&mouseInCanvas(ca3));
    if(AccClick2.Holding){
      MBall.Acc.set(Vmult(Vadd(mouseDoc(ca3),Vmult(MBall.Pos,-20)),1/20));
    }
    Clicks3.Started((tween((MBall.Pos.x*20)+10,(MBall.Pos.x*20)-10,mouseDoc(ca3).x)&&
          tween((MBall.Pos.y*20)+10,(MBall.Pos.y*20)-10,mouseDoc(ca3).y))&&mousePress&&((VelClick2.Holding||AccClick2.Holding)===false));
    Clicks3.Continuing(mousePress&&mouseInCanvas(ca3));
    if(Clicks3.Holding){
      MBall.Pos.set(Vmult(mouseDoc(ca3),1/20));
    }
    BounceClick.Started(tween(ca3.width-106-10,ca3.width-106+10,mouseDoc(ca3).x)&&tween(40,40+100,mouseDoc(ca3).y)&&mousePress);
    BounceClick.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca3).y-40)/100)));
    if(BounceClick.Holding){
      MWall.bounce=(mouseDoc(ca3).y-40)/100;
    }
    SlideClick.Started(tween(ca3.width-45-10,ca3.width-45+10,mouseDoc(ca3).x)&&tween(40,40+100,mouseDoc(ca3).y)&&mousePress);
    SlideClick.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca3).y-40)/100)));
    if(SlideClick.Holding){
      MWall.slide=(mouseDoc(ca3).y-40)/100;
    }
    WallCornClick.Started(tween(MWall.Corner.x*20-10,MWall.Corner.x*20+10,mouseDoc(ca3).x)&&tween(MWall.Corner.y*20-10,MWall.Corner.y*20+10,mouseDoc(ca3).y)&&mousePress);
    WallCornClick.Continuing(mousePress);
    if(WallCornClick.Holding){
      MWall.Corner.set(Vmult(mouseDoc(ca3),1/20));
    }
    WallEndClick.Started(tween(FlatWall.Corner.x*20+FlatWall.Base.x*20-10,FlatWall.Corner.x*20+FlatWall.Base.x*20+10,mouseDoc(ca3).x)&&tween(FlatWall.Corner.y*20+FlatWall.Base.y*20-10,FlatWall.Corner.y*20+FlatWall.Base.y*20+10,mouseDoc(ca3).y)&&mousePress);
    WallEndClick.Continuing(mousePress);
    if(WallEndClick.Holding){
      MWall.Base.x=mouseDoc(ca3).x/20-MWall.Corner.x
    }
    F3.clearRect(0, 0, innerWidth, innerHeight);
    F3.lineWidth=2;
    WallBalls=MBall.CopyBall();
    FlatWall=MWall.CopyWall();
    FlatWall.Base.y=0;
      for(var Loopdraw=0;Loopdraw<30;Loopdraw++){
      F3.strokeStyle='rgba(150,150,150,1)';
      if(FlatWall.Collides(WallBalls)){
        drawLine(WallBalls.Pos.x*20,WallBalls.Pos.y*20,WallBalls.NextPos().x*20,WallBalls.NextPos().y*20,F3);
        FlatWall.Bounce(WallBalls);
      }
      F3.strokeStyle='rgba('+255*(30-Loopdraw)/30+","+255*(30-Loopdraw)/30+","+255*(30-Loopdraw)/30+',1)';
      drawLine(WallBalls.Pos.x*20,WallBalls.Pos.y*20,WallBalls.NextPos().x*20,WallBalls.NextPos().y*20,F3);
      WallBalls.Update();
     
      lineBall(WallBalls.Pos.x*20,WallBalls.Pos.y*20,10,F3);
    }
  
    F3.strokeStyle='rgba(100,100,100,1)'
    for(var linesY=0;linesY<MBall.Pos.y-0.5;linesY++){
      drawLine(MBall.Pos.x*20-5,linesY*20,MBall.Pos.x*20+5,linesY*20,F3);
    }
    for(var linesX=0;linesX<MBall.Pos.x-0.5;linesX++){
      drawLine(linesX*20,MBall.Pos.y*20-5,linesX*20,MBall.Pos.y*20+5,F3);
    }
    drawLine(MBall.Pos.x*20,0,MBall.Pos.x*20,MBall.Pos.y*20-10,F3);
    drawLine(0,MBall.Pos.y*20,MBall.Pos.x*20-10,MBall.Pos.y*20,F3);
  
    F3.strokeStyle='rgba(255,255,255,1)';
    lineBall(MBall.Pos.x*20,MBall.Pos.y*20,10,F3);
    F3.lineWidth=3;
    F3.fillStyle = "white";
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,F3);
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,F3);
    fillBall(MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,2,F3);
    fillBall(MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,2,F3);
    drawLine(FlatWall.Corner.x*20,FlatWall.Corner.y*20,FlatWall.Corner.x*20+FlatWall.Base.x*20,FlatWall.Corner.y*20+FlatWall.Base.y*20,F3);
    fillBall(FlatWall.Corner.x*20,FlatWall.Corner.y*20,3,F3);
    fillBall(FlatWall.Corner.x*20+FlatWall.Base.x*20,FlatWall.Corner.y*20+FlatWall.Base.y*20,3,F3);
    F3.font="15px Mukta"
    F3.fillText("Move the sliders to change the qualities of the barrier",10,240);
    F3.fillText("Vel",MBall.Pos.x*20+MBall.Vel.x*20+10,MBall.Pos.y*20+MBall.Vel.y*20+5);
    F3.fillText("Acc",MBall.Pos.x*20+MBall.Acc.x*20+10,MBall.Pos.y*20+MBall.Acc.y*20+5);
    F3.fillText("Bounce",ca3.width-130,20);
    F3.fillText("Slide",ca3.width-60,20);
    drawLine(ca3.width-106,40,ca3.width-106,140,F3);
    drawLine(ca3.width-45,40,ca3.width-45,140,F3);
    fillBall(ca3.width-106,40+100*FlatWall.bounce,6,F3);
    F3.fillText(Math.round(FlatWall.bounce*100)/100,ca3.width-130+40,40+100*FlatWall.bounce+6);
    fillBall(ca3.width-45,40+100*FlatWall.slide,6,F3);
    F3.fillText(Math.round(FlatWall.slide*100)/100,ca3.width-45+10,40+100*FlatWall.slide+6);

  }
}
animateF3()

var ca4=document.getElementById("Fig4");
var F4=ca4.getContext("2d");
var Clicks4=new Hold();
var VelClick3=new Hold();
var AccClick3=new Hold();
var BounceClick2=new Hold();
var SlideClick2=new Hold();
var WallBalls2=MBall.CopyBall();
var WallCornClick2=new Hold();
var WallEndClick2=new Hold();
ca4.height=250;
function animateF4(){
  ca4.width=innerWidth*60/100;
  requestAnimationFrame(animateF4);
  if(ElementOffScreen(ca4)===false){
    VelClick3.Started((tween((MBall.Pos.x+MBall.Vel.x)*20+10,(MBall.Pos.x+MBall.Vel.x)*20-10,mouseDoc(ca4).x)&&
          tween((MBall.Pos.y+MBall.Vel.y)*20+10,(MBall.Pos.y+MBall.Vel.y)*20-10,mouseDoc(ca4).y))&&mousePress&&((Clicks4.Holding||AccClick3.Holding)===false));
    VelClick3.Continuing(mousePress&&mouseInCanvas(ca4));
    if(VelClick3.Holding){
       MBall.Vel.set(Vmult(Vadd(mouseDoc(ca4),Vmult(MBall.Pos,-20)),1/20));
    }
    AccClick3.Started((tween((MBall.Pos.x+MBall.Acc.x)*20+10,(MBall.Pos.x+MBall.Acc.x)*20-10,mouseDoc(ca4).x)&&
          tween((MBall.Pos.y+MBall.Acc.y)*20+10,(MBall.Pos.y+MBall.Acc.y)*20-10,mouseDoc(ca4).y))&&mousePress&&((Clicks4.Holding||VelClick3.Holding)===false));
    AccClick3.Continuing(mousePress&&mouseInCanvas(ca4));
    if(AccClick3.Holding){
      MBall.Acc.set(Vmult(Vadd(mouseDoc(ca4),Vmult(MBall.Pos,-20)),1/20));
    }
    Clicks4.Started((tween((MBall.Pos.x*20)+10,(MBall.Pos.x*20)-10,mouseDoc(ca4).x)&&
          tween((MBall.Pos.y*20)+10,(MBall.Pos.y*20)-10,mouseDoc(ca4).y))&&mousePress&&((VelClick3.Holding||AccClick3.Holding)===false));
    Clicks4.Continuing(mousePress&&mouseInCanvas(ca4));
    if(Clicks4.Holding){
      MBall.Pos.set(Vmult(mouseDoc(ca4),1/20));
    }
    BounceClick2.Started(tween(ca4.width-106-10,ca4.width-106+10,mouseDoc(ca4).x)&&tween(40,40+100,mouseDoc(ca4).y)&&mousePress);
    BounceClick2.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca4).y-40)/100)));
    if(BounceClick2.Holding){
      MWall.bounce=(mouseDoc(ca4).y-40)/100;
    }
    SlideClick2.Started(tween(ca4.width-45-10,ca4.width-45+10,mouseDoc(ca4).x)&&tween(40,40+100,mouseDoc(ca4).y)&&mousePress);
    SlideClick2.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca4).y-40)/100)));
    if(SlideClick2.Holding){
      MWall.slide=(mouseDoc(ca4).y-40)/100;
    }
    WallCornClick2.Started(tween(MWall.Corner.x*20-10,MWall.Corner.x*20+10,mouseDoc(ca4).x)&&tween(MWall.Corner.y*20-10,MWall.Corner.y*20+10,mouseDoc(ca4).y)&&mousePress);
    WallCornClick2.Continuing(mousePress);
    if(WallCornClick2.Holding){
      MWall.Corner.set(Vmult(mouseDoc(ca4),1/20));
    }
    WallEndClick2.Started(tween(FlatWall.Corner.x*20+FlatWall.Base.x*20-10,FlatWall.Corner.x*20+FlatWall.Base.x*20+10,mouseDoc(ca4).x)&&tween(FlatWall.Corner.y*20+FlatWall.Base.y*20-10,FlatWall.Corner.y*20+FlatWall.Base.y*20+10,mouseDoc(ca4).y)&&mousePress);
    WallEndClick2.Continuing(mousePress);
    if(WallEndClick2.Holding){
      MWall.Base.x=mouseDoc(ca4).x/20-MWall.Corner.x
    }
    F4.clearRect(0, 0, innerWidth, innerHeight);
    F4.lineWidth=2;
    WallBalls2=MBall.CopyBall();
    FlatWall=MWall.CopyWall();
    FlatWall.Base.y=0;
    for(var Loopdraw=0;Loopdraw<40;Loopdraw++){
      F4.strokeStyle='rgba('+255*(40-Loopdraw)/40+","+255*(40-Loopdraw)/40+","+255*(40-Loopdraw)/40+',1)';
      if(FlatWall.Collides(WallBalls2)){
        drawLine(WallBalls2.Pos.x*20,WallBalls2.Pos.y*20,WallBalls2.NextPos().x*20,WallBalls2.NextPos().y*20,F4);
        FlatWall.Bounce(WallBalls2);
        if(FlatWall.Collides(WallBalls2)){
          FlatWall.Stablise(WallBalls2);
          F4.strokeStyle='rgba('+255*(40-Loopdraw)/40+',0,0,1)';
        }
      }
      drawLine(WallBalls2.Pos.x*20,WallBalls2.Pos.y*20,WallBalls2.NextPos().x*20,WallBalls2.NextPos().y*20,F4);
      WallBalls2.Update();
      
      lineBall(WallBalls2.Pos.x*20,WallBalls2.Pos.y*20,10,F4);
    }
  
    F4.strokeStyle='rgba(100,100,100,1)'
    for(var linesY=0;linesY<MBall.Pos.y-0.5;linesY++){
      drawLine(MBall.Pos.x*20-5,linesY*20,MBall.Pos.x*20+5,linesY*20,F4);
    }
    for(var linesX=0;linesX<MBall.Pos.x-0.5;linesX++){
      drawLine(linesX*20,MBall.Pos.y*20-5,linesX*20,MBall.Pos.y*20+5,F4);
    }
    drawLine(MBall.Pos.x*20,0,MBall.Pos.x*20,MBall.Pos.y*20-10,F4);
    drawLine(0,MBall.Pos.y*20,MBall.Pos.x*20-10,MBall.Pos.y*20,F4);
  
    F4.strokeStyle='rgba(255,255,255,1)';
    lineBall(MBall.Pos.x*20,MBall.Pos.y*20,10,F4);
    F4.lineWidth=3;
    F4.fillStyle = "white";
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,F4);
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,F4);
    fillBall(MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,2,F4);
    fillBall(MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,2,F4);
    drawLine(FlatWall.Corner.x*20,FlatWall.Corner.y*20,FlatWall.Corner.x*20+FlatWall.Base.x*20,FlatWall.Corner.y*20+FlatWall.Base.y*20,F4);
    fillBall(FlatWall.Corner.x*20,FlatWall.Corner.y*20,3,F4);
    fillBall(FlatWall.Corner.x*20+FlatWall.Base.x*20,FlatWall.Corner.y*20+FlatWall.Base.y*20,3,F4);
    F4.font="15px Mukta"
    F4.fillText("Move the sliders to change the qualities of the barrier",10,240);
    F4.fillText("Vel",MBall.Pos.x*20+MBall.Vel.x*20+10,MBall.Pos.y*20+MBall.Vel.y*20+5);
    F4.fillText("Acc",MBall.Pos.x*20+MBall.Acc.x*20+10,MBall.Pos.y*20+MBall.Acc.y*20+5);
    F4.fillText("Bounce",ca4.width-130,20);
    F4.fillText("Slide",ca4.width-60,20);
    drawLine(ca4.width-106,40,ca4.width-106,140,F4);
    drawLine(ca4.width-45,40,ca4.width-45,140,F4);
    fillBall(ca4.width-106,40+100*FlatWall.bounce,6,F4);
    F4.fillText(Math.round(FlatWall.bounce*100)/100,ca4.width-130+40,40+100*FlatWall.bounce+6);
    fillBall(ca4.width-45,40+100*FlatWall.slide,6,F4);
    F4.fillText(Math.round(FlatWall.slide*100)/100,ca4.width-45+10,40+100*FlatWall.slide+6);

  }
}
animateF4()
var ca5=document.getElementById("Fig5");
var F5=ca5.getContext("2d");
var vectA= new vect(1,1);
var vectB= new vect(.5,1.5);
var AClick= new Hold();
var BClick= new Hold();
ca5.height=250;
function animateF5(){
  ca5.width=innerWidth*60/100;
  requestAnimationFrame(animateF5);
  if(ElementOffScreen(ca5)===false){
    AClick.Started(tween(ca5.width/4+vectA.x*50-10,ca5.width/4+vectA.x*50+10,mouseDoc(ca5).x)&&
                  tween(ca5.height/2-vectA.y*50-10,ca5.height/2-vectA.y*50+10,mouseDoc(ca5).y)&&mousePress);
    AClick.Continuing(mousePress&&(BClick.Holding===false)&&mouseInCanvas(ca5));
    if(AClick.Holding){
      vectA=new vect((mouseDoc(ca5).x-ca5.width/4)/50,(-mouseDoc(ca5).y+ca5.height/2)/50);
    }
    BClick.Started(tween(ca5.width/4+vectB.x*50-10,ca5.width/4+vectB.x*50+10,mouseDoc(ca5).x)&&
                  tween(ca5.height/2-vectB.y*50-10,ca5.height/2-vectB.y*50+10,mouseDoc(ca5).y)&&mousePress);
    BClick.Continuing(mousePress&&(AClick.Holding===false)&&mouseInCanvas(ca5));
    if(BClick.Holding){
      vectB=new vect((mouseDoc(ca5).x-ca5.width/4)/50,(-mouseDoc(ca5).y+ca5.height/2)/50);
    }
    F5.clearRect(0, 0, innerWidth, innerHeight);
    F5.lineWidth=2;
    F5.strokeStyle='rgba(120,120,120,1)';
  
    drawLine(ca5.width/4,0,ca4.width/4,250,F5);
    drawLine(ca5.width*3/4,0,ca5.width*3/4,250,F5);
    drawLine(0,ca5.height/2,ca5.width/2-10,ca5.height/2,F5);
    drawLine(ca5.width/2+10,ca5.height/2,ca5.width,ca5.height/2,F5);
    F5.strokeStyle='rgba(255,255,255,1)';
    lineBall(ca5.width/4+vectA.x*50,ca5.height/2-vectA.y*50,10,F5);
  
    drawLine(ca5.width/4,ca5.height/2+2,ca5.width/4+vectA.x*50,ca5.height/2+2,F5);
    drawLine(ca5.width/4+vectA.x*50,ca5.height/2+2,ca5.width/4+vectA.x*50,ca5.height/2-vectA.y*50+2,F5);
    for(var lineshorison=0;lineshorison<Math.abs(vectA.x);lineshorison++){
      F5.strokeStyle='rgba(255,255,255,1)';
      drawLine(lineshorison*50*vectA.x/Math.abs(vectA.x)+ca5.width/4,ca5.height/2-5+2,lineshorison*50*vectA.x/Math.abs(vectA.x)+ca5.width/4,ca5.height/2+5+2,F5);
      F5.strokeStyle='rgba(150,150,150,1)';
      drawLine(lineshorison*50*vectA.x/Math.abs(vectA.x)+ca5.width*3/4,ca5.height/2-5+2,lineshorison*50*vectA.x/Math.abs(vectA.x)+ca5.width*3/4,ca5.height/2+5+2,F5);
    }
    for(var linesvert=0;linesvert<Math.abs(vectA.y)-.20;linesvert++){
     F5.strokeStyle='rgba(255,255,255,1)';
     drawLine(ca5.width/4+vectA.x*50+5,-linesvert*50*vectA.y/Math.abs(vectA.y)+ca5.height/2+2,ca5.width/4+vectA.x*50-5,-linesvert*50*vectA.y/Math.abs(vectA.y)+ca5.height/2+2,F5);
     F5.strokeStyle='rgba(90,90,90,1)';
     drawLine(ca5.width*3/4+vectA.x*50+5,-linesvert*50*vectA.y/Math.abs(vectA.y)+ca5.height/2+2,ca5.width*3/4+vectA.x*50-5,-linesvert*50*vectA.y/Math.abs(vectA.y)+ca5.height/2+2,F5);
    }
    F5.strokeStyle='rgba(255,0,0,1)';
    lineBall(ca5.width/4+vectB.x*50,ca5.height/2-vectB.y*50,10,F5);
    drawLine(ca5.width/4,ca5.height/2,ca5.width/4+vectB.x*50,ca5.height/2,F5);
    drawLine(ca5.width/4+vectB.x*50,ca5.height/2,ca5.width/4+vectB.x*50,ca5.height/2-vectB.y*50,F5);
  
    lineBall(ca5.width*3/4+Vx(vectA,vectB).x*50,ca5.height/2-Vx(vectA,vectB).y*50,10,F5);
    for(var lineshorison=0;lineshorison<Math.abs(vectB.x);lineshorison++){
      drawLine(lineshorison*50*vectB.x/Math.abs(vectB.x)+ca5.width/4,ca5.height/2-5,lineshorison*50*vectB.x/Math.abs(vectB.x)+ca5.width/4,ca5.height/2+5,F5);
    }
    for(var linesvert=0;linesvert<Math.abs(vectB.y)-0.20;linesvert++){
     drawLine(ca5.width/4+vectB.x*50+5,-linesvert*50*vectB.y/Math.abs(vectB.y)+ca5.height/2+2,ca5.width/4+vectB.x*50-5,-linesvert*50*vectB.y/Math.abs(vectB.y)+ca5.height/2+2,F5);
    }
    F5.strokeStyle='rgba(100,10,10,1)';
    drawLine(ca5.width*3/4,ca5.height/2,ca5.width*3/4+Vx(vectA,new vect(vectB.x,0)).x*50,ca5.height/2-Vx(vectA,new vect(vectB.x,0)).y*50,F5);
    drawLine(ca5.width*3/4+Vx(vectA,vectB).x*50,ca5.height/2-Vx(vectA,vectB).y*50,ca5.width*3/4+Vx(vectA,new vect(vectB.x,0)).x*50,ca5.height/2-Vx(vectA,new vect(vectB.x,0)).y*50,F5);
    F5.strokeStyle='rgba(150,150,150,1)';
    lineBall(ca5.width*3/4+vectA.x*50,ca5.height/2-vectA.y*50,10,F5);
    drawLine(ca5.width*3/4,ca5.height/2+2,ca5.width*3/4+vectA.x*50,ca5.height/2+2,F5);
    drawLine(ca5.width*3/4+vectA.x*50,ca5.height/2+2,ca5.width*3/4+vectA.x*50,ca5.height/2-vectA.y*50+2,F5);
  }
}
animateF5();
var ca6=document.getElementById("Fig6");
var F6=ca6.getContext("2d");
var vectA2= new vect(1,1);
var vectB2= new vect(.5,1.5);
var AClick2= new Hold();
var BClick2= new Hold();
ca6.height=250;
function animateF6(){
  ca6.width=innerWidth*60/100;
  requestAnimationFrame(animateF6);
    if(ElementOffScreen(ca6)===false){
    AClick2.Started(tween(ca6.width/4+vectA2.x*50-10,ca6.width/4+vectA2.x*50+10,mouseDoc(ca6).x)&&
                  tween(ca6.height/2-vectA2.y*50-10,ca6.height/2-vectA2.y*50+10,mouseDoc(ca6).y)&&mousePress);
    AClick2.Continuing(mousePress&&(BClick2.Holding===false)&&mouseInCanvas(ca6));
    if(AClick2.Holding){
      vectA2=new vect((mouseDoc(ca6).x-ca6.width/4)/50,(-mouseDoc(ca6).y+ca6.height/2)/50);
    }
    BClick2.Started(tween(ca6.width/4+vectB2.x*50-10,ca6.width/4+vectB2.x*50+10,mouseDoc(ca6).x)&&
                  tween(ca6.height/2-vectB2.y*50-10,ca6.height/2-vectB2.y*50+10,mouseDoc(ca6).y)&&mousePress);
    BClick2.Continuing(mousePress&&(AClick2.Holding===false)&&mouseInCanvas(ca6));
    if(BClick2.Holding){
      vectB2=new vect((mouseDoc(ca6).x-ca6.width/4)/50,(-mouseDoc(ca6).y+ca6.height/2)/50);
    }
    F6.clearRect(0, 0, innerWidth, innerHeight);
    F6.lineWidth=2;
    F6.strokeStyle='rgba(120,120,120,1)';
    
    drawLine(ca6.width/4,0,ca6.width/4,250,F6);
    drawLine(ca6.width*3/4,0,ca6.width*3/4,250,F6);
    drawLine(0,ca6.height/2,ca6.width/2-10,ca6.height/2,F6);
    drawLine(ca6.width/2+10,ca6.height/2,ca6.width,ca6.height/2,F6);
    F6.strokeStyle='rgba(255,255,255,1)';
    lineBall(ca6.width/4+vectA2.x*50,ca6.height/2-vectA2.y*50,10,F6);
  
    drawLine(ca6.width/4,ca6.height/2+2,ca6.width/4+vectA2.x*50,ca6.height/2+2,F6);
    drawLine(ca6.width/4+vectA2.x*50,ca6.height/2+2,ca6.width/4+vectA2.x*50,ca6.height/2-vectA2.y*50+2,F6);
    for(var lineshorison=0;lineshorison<Math.abs(vectA2.x);lineshorison++){
     drawLine(lineshorison*50*vectA2.x/Math.abs(vectA2.x)+ca6.width/4,ca6.height/2-5+2,lineshorison*50*vectA2.x/Math.abs(vectA2.x)+ca6.width/4,ca6.height/2+5+2,F6);
    }
    for(var linesvert=0;linesvert<Math.abs(vectA2.y)-.20;linesvert++){
     drawLine(ca6.width/4+vectA2.x*50+5,-linesvert*50*vectA2.y/Math.abs(vectA2.y)+ca6.height/2+2,ca6.width/4+vectA2.x*50-5,-linesvert*50*vectA2.y/Math.abs(vectA2.y)+ca6.height/2+2,F6);
    }
  
    lineBall(ca6.width*3/4+50,ca6.height/2,5,F6);
    drawLine(ca6.width*3/4,ca6.height/2+2,ca6.width*3/4+Vdiv(new vect(vectA2.x,0),vectA2).x*50,ca6.height/2-Vdiv(new vect(vectA2.x,0),vectA2).y*50+2,F6);
    drawLine(ca6.width*3/4+50,ca6.height/2,ca6.width*3/4+Vdiv(new vect(vectA2.x,0),vectA2).x*50,ca6.height/2-Vdiv(new vect(vectA2.x,0),vectA2).y*50,F6);
    F6.strokeStyle='rgba(255,0,0,1)';
    lineBall(ca6.width*3/4+Vdiv(vectB2,vectA2).x*50,ca6.height/2-Vdiv(vectB2,vectA2).y*50,10,F6);
    F6.strokeStyle='rgba(200,10,10,1)';
    drawLine(ca6.width*3/4,ca6.height/2-2,ca6.width*3/4+Vdiv(new vect(vectB2.x,0),vectA2).x*50,ca6.height/2-Vdiv(new vect(vectB2.x,0),vectA2).y*50-2,F6);
    drawLine(ca6.width*3/4+Vdiv(new vect(vectB2.x,0),vectA2).x*50,ca6.height/2-Vdiv(new vect(vectB2.x,0),vectA2).y*50,ca6.width*3/4+Vdiv(vectB2,vectA2).x*50,ca6.height/2-Vdiv(vectB2,vectA2).y*50,F6);
    F6.strokeStyle='rgba(255,0,0,1)';
    lineBall(ca6.width/4+vectB2.x*50,ca6.height/2-vectB2.y*50,10,F6);
    drawLine(ca6.width/4,ca6.height/2,ca6.width/4+vectB2.x*50,ca6.height/2,F6);
    drawLine(ca6.width/4+vectB2.x*50,ca6.height/2+2,ca6.width/4+vectB2.x*50,ca6.height/2-vectB2.y*50+2,F6);
    for(var lineshorison=0;lineshorison<Math.abs(vectB2.x);lineshorison++){
      drawLine(lineshorison*50*vectB2.x/Math.abs(vectB2.x)+ca6.width/4,ca6.height/2-5,lineshorison*50*vectB2.x/Math.abs(vectB2.x)+ca6.width/4,ca6.height/2+5,F6);
    }
    for(var linesvert=0;linesvert<Math.abs(vectB2.y)-0.20;linesvert++){
     drawLine(ca6.width/4+vectB2.x*50+5,-linesvert*50*vectB2.y/Math.abs(vectB2.y)+ca6.height/2+2,ca6.width/4+vectB2.x*50-5,-linesvert*50*vectB2.y/Math.abs(vectB2.y)+ca6.height/2+2,F6);
    }
    F6.fillStyle = "white";
    F6.font="15px Mukta";
    F6.fillText("Drag the vectors",10,240);
  }
}
animateF6();

var ca7=document.getElementById("Fig7");
var F7=ca7.getContext("2d");
var Clicks5=new Hold();
var VelClick4=new Hold();
var AccClick4=new Hold();
var BounceClick3=new Hold();
var SlideClick3=new Hold();
var WallBalls3=MBall.CopyBall();
ca7.height=250;
function animateF7(){
  ca7.width=innerWidth*60/100;
  requestAnimationFrame(animateF7);
  if(ElementOffScreen(ca7)===false){
    VelClick4.Started((tween((MBall.Pos.x+MBall.Vel.x)*20+10,(MBall.Pos.x+MBall.Vel.x)*20-10,mouseDoc(ca7).x)&&
          tween((MBall.Pos.y+MBall.Vel.y)*20+10,(MBall.Pos.y+MBall.Vel.y)*20-10,mouseDoc(ca7).y))&&mousePress&&((Clicks5.Holding||AccClick4.Holding)===false));
    VelClick4.Continuing(mousePress&&mouseInCanvas(ca7));
    if(VelClick4.Holding){
       MBall.Vel.set(Vmult(Vadd(mouseDoc(ca7),Vmult(MBall.Pos,-20)),1/20));
    }
    AccClick4.Started((tween((MBall.Pos.x+MBall.Acc.x)*20+10,(MBall.Pos.x+MBall.Acc.x)*20-10,mouseDoc(ca7).x)&&
          tween((MBall.Pos.y+MBall.Acc.y)*20+10,(MBall.Pos.y+MBall.Acc.y)*20-10,mouseDoc(ca7).y))&&mousePress&&((Clicks5.Holding||VelClick4.Holding)===false));
    AccClick4.Continuing(mousePress&&mouseInCanvas(ca7));
    if(AccClick4.Holding){
      MBall.Acc.set(Vmult(Vadd(mouseDoc(ca7),Vmult(MBall.Pos,-20)),1/20));
    }
    Clicks5.Started((tween((MBall.Pos.x*20)+10,(MBall.Pos.x*20)-10,mouseDoc(ca7).x)&&
          tween((MBall.Pos.y*20)+10,(MBall.Pos.y*20)-10,mouseDoc(ca7).y))&&mousePress&&((VelClick4.Holding||AccClick4.Holding)===false));
    Clicks5.Continuing(mousePress&&mouseInCanvas(ca7));
    if(Clicks5.Holding){
      MBall.Pos.set(Vmult(mouseDoc(ca7),1/20));
    }
    BounceClick3.Started(tween(ca7.width-106-10,ca7.width-106+10,mouseDoc(ca7).x)&&tween(40,40+100,mouseDoc(ca7).y)&&mousePress);
    BounceClick3.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca7).y-40)/100)));
    if(BounceClick3.Holding){
      MWall.bounce=(mouseDoc(ca7).y-40)/100;
    }
    SlideClick3.Started(tween(ca7.width-45-10,ca7.width-45+10,mouseDoc(ca7).x)&&tween(40,40+100,mouseDoc(ca7).y)&&mousePress);
    SlideClick3.Continuing(mousePress&&(tween(0,1,(mouseDoc(ca7).y-40)/100)));
    if(SlideClick3.Holding){
      MWall.slide=(mouseDoc(ca7).y-40)/100;
    }
    WallCornClick2.Started(tween(MWall.Corner.x*20-10,MWall.Corner.x*20+10,mouseDoc(ca7).x)&&tween(MWall.Corner.y*20-10,MWall.Corner.y*20+10,mouseDoc(ca7).y)&&mousePress);
    WallCornClick2.Continuing(mousePress);
    if(WallCornClick2.Holding){
      MWall.Corner.set(Vmult(mouseDoc(ca7),1/20));
    }
    WallEndClick2.Started(tween(MWall.Corner.x*20+MWall.Base.x*20-10,MWall.Corner.x*20+MWall.Base.x*20+10,mouseDoc(ca7).x)&&tween(MWall.Corner.y*20+MWall.Base.y*20-10,MWall.Corner.y*20+MWall.Base.y*20+10,mouseDoc(ca7).y)&&mousePress);
    WallEndClick2.Continuing(mousePress);
    if(WallEndClick2.Holding){
      MWall.Base.set(Vadd(Vmult(mouseDoc(ca7),1/20),Vmult(MWall.Corner,-1)));
    }
    F7.clearRect(0, 0, innerWidth, innerHeight);
    F7.lineWidth=2;
    WallBalls3=MBall.CopyBall();
    for(var Loopdraw=0;Loopdraw<40;Loopdraw++){
      F7.strokeStyle='rgba('+255*(40-Loopdraw)/40+","+255*(40-Loopdraw)/40+","+255*(40-Loopdraw)/40+',1)';
      if(MWall.Collides(WallBalls3)){
        drawLine(WallBalls3.Pos.x*20,WallBalls3.Pos.y*20,WallBalls3.NextPos().x*20,WallBalls3.NextPos().y*20,F7);
        MWall.Bounce(WallBalls3);
        if(MWall.Collides(WallBalls3)){
          MWall.Stablise(WallBalls3);
           F7.strokeStyle='rgba('+255*(40-Loopdraw)/40+",0,0,1)";
        }
      }
      drawLine(WallBalls3.Pos.x*20,WallBalls3.Pos.y*20,WallBalls3.NextPos().x*20,WallBalls3.NextPos().y*20,F7);
      WallBalls3.Update();
      
      lineBall(WallBalls3.Pos.x*20,WallBalls3.Pos.y*20,10,F7);
    }
  
    F7.strokeStyle='rgba(100,100,100,1)'
    for(var linesY=0;linesY<MBall.Pos.y-0.5;linesY++){
      drawLine(MBall.Pos.x*20-5,linesY*20,MBall.Pos.x*20+5,linesY*20,F7);
    }
    for(var linesX=0;linesX<MBall.Pos.x-0.5;linesX++){
      drawLine(linesX*20,MBall.Pos.y*20-5,linesX*20,MBall.Pos.y*20+5,F7);
    }
    drawLine(MBall.Pos.x*20,0,MBall.Pos.x*20,MBall.Pos.y*20-10,F7);
    drawLine(0,MBall.Pos.y*20,MBall.Pos.x*20-10,MBall.Pos.y*20,F7);
  
    F7.strokeStyle='rgba(255,255,255,1)';
    lineBall(MBall.Pos.x*20,MBall.Pos.y*20,10,F7);
    F7.lineWidth=3;
    F7.fillStyle = "white";
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,F7);
    drawLine(MBall.Pos.x*20,MBall.Pos.y*20,MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,F7);
    fillBall(MBall.Pos.x*20+MBall.Vel.x*20,MBall.Pos.y*20+MBall.Vel.y*20,2,F7);
    fillBall(MBall.Pos.x*20+MBall.Acc.x*20,MBall.Pos.y*20+MBall.Acc.y*20,2,F7);
    drawLine(MWall.Corner.x*20,MWall.Corner.y*20,MWall.Corner.x*20+MWall.Base.x*20,MWall.Corner.y*20+MWall.Base.y*20,F7);
    fillBall(MWall.Corner.x*20,MWall.Corner.y*20,3,F7);
    fillBall(MWall.Corner.x*20+MWall.Base.x*20,MWall.Corner.y*20+MWall.Base.y*20,3,F7);
    F7.font="15px Mukta"
    F7.fillText("Drag both points on the barrier",10,240);
    F7.fillText("Vel",MBall.Pos.x*20+MBall.Vel.x*20+10,MBall.Pos.y*20+MBall.Vel.y*20+5);
    F7.fillText("Acc",MBall.Pos.x*20+MBall.Acc.x*20+10,MBall.Pos.y*20+MBall.Acc.y*20+5);
    F7.fillText("Bounce",ca7.width-130,20);
    F7.fillText("Slide",ca7.width-60,20);
    drawLine(ca7.width-106,40,ca7.width-106,140,F7);
    drawLine(ca7.width-45,40,ca7.width-45,140,F7);
    fillBall(ca7.width-106,40+100*MWall.bounce,6,F7);
    F7.fillText(Math.round(MWall.bounce*100)/100,ca7.width-130+40,40+100*MWall.bounce+6);
    fillBall(ca7.width-45,40+100*MWall.slide,6,F7);
    F7.fillText(Math.round(MWall.slide*100)/100,ca7.width-45+10,40+100*MWall.slide+6);
  }
}
animateF7();
