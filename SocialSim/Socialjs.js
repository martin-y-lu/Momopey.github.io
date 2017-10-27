//       ----- Weird Init stuff
// Useful stoofs and page qualities
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


//Functions for CSS managment
function ElementAllOffScreen(El){//Checks if an element is off of the screen completley 
  var rect = El.getBoundingClientRect();
  return (rect.left + rect.width) < 0 || (rect.top + rect.height) < 0|| (rect.left >innerWidth || rect.top > innerHeight);
}
function ElementAllOnScreen(El){
  var rect = El.getBoundingClientRect().top;
  return tween(0,innerHeight,ElementCornerOffset(El).y)&&
    tween(0,innerHeight,ElementBottomOffset(El).y)&&
    tween(0,innerWidth,ElementCornerOffset(El).x)&&
    tween(0,innerWidth,ElementBottomOffset(El).x);
}
function PxToInt(String){// Removes "px", turns to int
  return parseFloat(String.substring(0, String.length - 2));
}
function ElementCornerOffset(El){//ForFixed object, returns position in document of top left corner ie top left
  return new vect(El.offsetLeft-scroll.x,El.offsetTop-scroll.y);
}
function ElementBottomOffset(El){// returns position for botom right corner
  return new vect(El.offsetLeft+El.offsetWidth-scroll.x,El.offsetTop+El.offsetHeight-scroll.y);
}
function mouseDoc(doc){// Gives mouse position in the canvas or element
  return new vect(mouse.x-ElementCornerOffset(doc).x,
                  mouse.y-ElementCornerOffset(doc).y)
}
function mouseFixedDoc(doc){// For fixed elements
  return new vect(mouse.x-doc.offsetLeft,
                  mouse.y-doc.offsetTop)
}

function Hold(){
  this.H=false;
  this.I=false;
  this.Li=false;
  this.S=function(Bool){
    I=Bool;
    H=((I===Li)===false);
    Li=Bool;
  }
//   this.C=function(Bool){
//     if(this.Start===false){
//       this.H=Bool;
//     }
//   }
}

//    ---------Mathy functs
function vect(X,Y){// Vector class
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
function Vadd(A,B){// Sums up two vectors
  return new vect(A.x+B.x,A.y+B.y);
}
function Vscale(V,F){//Scales vector by float
  return new vect(V.x*F,V.y*F);
}
function Vmult(A,B){// Multiplies two vectors
  return new vect(A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x);
}
function Vdiv(P,C){ // Divides vector P by C
  return new vect((C.x*P.x+C.y*P.y)/((C.x*C.x)+(C.y*C.y)),
  (C.x*P.y-C.y*P.x)/((C.x*C.x)+(C.y*C.y)));
}
function Vlength(P){// Length/ distance of vector
  return Math.sqrt(P.x*P.x+P.y*P.y);
}
function tween(T,B,M){// Checks if num is between two others
  return ((M<=T)&&(M>=B))||((M>=T)&&(M<=B));
}
function lerp(S,E,R){// Linear interpolates from S to E by R
  return E*R+S-S*R;
}
function randInt(B,T){// Returns two random ints between B and T
  var RandomNum=Math.random()*(T-B+1);
  if(RandomNum===T-B+1){
    RandomNum=T-B
  }else{
    RandomNum=Math.floor(RandomNum);
  }
  return RandomNum;
}
//   -------System
function Community(){
  this.PList=[];
  this.CList=[];
  
  this.Shift=new vect(0,0);
  this.Scale=1;
  
  this.Speed=0.01;
  this.LikeDist=100;
  this.HateDist=200;
  
  this.UpdateAll=function(){
    var CurrSize=this.CList.length;
    for(var i=0;i<CurrSize;i++){
     var ConA=this.CList[i];
      for(var j=i+1;j<CurrSize;j++){
        var ConB=this.CList[j];
        if(ConA.NumA===ConB.NumA||ConA.NumA===ConB.NumB||ConA.NumB===ConB.NumA||ConA.NumB===ConB.NumB){
          var SharedPoint=-1;
          if(ConA.NumA===ConB.NumA||ConA.NumA===ConB.NumB){
            SharedPoint=ConA.NumA;
          }else{
            SharedPoint=ConA.NumB;
          }
          var PointA=0;
          if(ConA.NumA===SharedPoint){
            PointA=ConA.NumB;
          }if(ConA.NumB===SharedPoint){
            PointA=ConA.NumA;
          }
          var PointB=0;
           if(ConB.NumA===SharedPoint){
            PointB=ConB.NumB;
          }if(ConB.NumB===SharedPoint){
            PointB=ConB.NumA;
          }
          var AnyTriangle=false;
          for(var k=0;k<CurrSize;k++){
             var ConC=this.CList[k];
             if(((ConC.NumA==PointA&&ConC.NumB==PointB)||(ConC.NumA==PointB&&ConC.NumB==PointA))){
              AnyTriangle=true;
              if(k>=j+1){
                 ConA.React(ConB,ConC);
                 ConB.React(ConA,ConC);
                 ConC.React(ConB,ConA);
              }
            }
          }
          if(AnyTriangle){}else{
            this.CList.push(new Connect(PointA,PointB,0,this));
          }
        }

      }
    }
    for(var C=0;C<this.CList.length;C++){
      this.CList[C].Respect=this.CList[C].NextRespect;
    }
  }
  this.UpdatePos=function(){
    for(var C=0;C<this.CList.length;C++){
      var R=.01;
      var Conn=this.CList[C];
      var CurrPosA=Conn.PerA.Pos.Copy();
      var CurrPosB=Conn.PerB.Pos.Copy();
      var CurrDist=Vlength(Vadd(CurrPosA,Vscale(CurrPosB,-1)));
      if(CurrDist===0){
        CurrDist=0.00001;
      }
      var Scale=lerp(CurrDist,lerp(this.HateDist,this.LikeDist,Conn.Respect/2+1/2),R*Math.pow(Conn.Respect,2))/CurrDist;
      Conn.PerA.Pos=Vadd(CurrPosB,Vscale(Vadd(CurrPosA,Vscale(CurrPosB,-1)),Scale));
      Conn.PerB.Pos=Vadd(CurrPosA,Vscale(Vadd(CurrPosB,Vscale(CurrPosA,-1)),Scale));          
    }
  }
  this.MouseInteract=function(Mouse){
    var MousePos=Vadd(Vscale(Mouse,1/this.Scale),Vscale(this.Shift,-1));
    for(var C=0;C<this.CList.length;C++){
      var Conn=this.CList[C];
      var Dist=Vlength(Vadd(Conn.PerA.Pos,Vscale(Conn.PerB.Pos,-1)));
      var DistA=Vlength(Vadd(Conn.PerA.Pos,Vscale(MousePos,-1)));
      var DistB=Vlength(Vadd(Conn.PerB.Pos,Vscale(MousePos,-1)));
      if(DistA+DistB<Dist+10){
        Conn.Respect=lerp(-1,Conn.Respect,.5);
        Conn.NextRespect=lerp(-1,Conn.NextRespect,.5);
      }
    }
  }
  this.ScreenPos=function(V){
    return Vscale(Vadd(V,this.Shift),this.Scale);
  }
  this.Draw=function(Con){
    for(var C=0;C<this.CList.length;C++){
      this.CList[C].Draw(Con);
    }
    for(var P=0;P<this.PList.length;P++){
      this.PList[P].Draw(Con);
    }
  }
}
function Person(Pos,Com){
  this.Com=Com;
  this.Pos=Pos;
  this.NextPos=this.Pos;
  this.Draw=function(Con){
    Con.beginPath();
    Con.arc(this.Com.ScreenPos(this.Pos).x,this.Com.ScreenPos(this.Pos).y,   
    10*this.Com.Scale,0,Math.PI*2,false);
    Con.lineWidth=3;
    Con.strokeStyle='rgba(255,255,255,1)';
    Con.fillStyle='rgba(255,0,0,1)';
    Con.stroke();
    Con.fill();
  }
}
function Connect(NumA,NumB,Respect,Com){
  this.Com=Com;
  this.NumA=NumA;
  this.NumB=NumB;
  this.PerA=this.Com.PList[NumA];
  this.PerB=this.Com.PList[NumB];
  this.Respect=Respect;
  this.NextRespect=this.Respect;
  this.React=function(AC,BC){
    this.NextRespect+=Com.Speed*(AC.Respect*BC.Respect-Math.abs(AC.Respect*BC.Respect)*this.Respect);
  }
  this.Draw=function(Con){
    if(this.Respect===0){}else{
      Con.beginPath();
      Con.moveTo(this.Com.ScreenPos(this.PerA.Pos).x,this.Com.ScreenPos(this.PerA.Pos).y);
      if(this.Respect>0){
        Con.strokeStyle='rgba(0,255,0,'+Math.abs(this.Respect)*.9+')';
      }else{
        Con.strokeStyle='rgba(255,0,0,'+Math.abs(this.Respect)*.9+')';
      }
      Con.lineWidth=Math.abs(10*this.Respect)*this.Com.Scale;
      Con.lineTo(this.Com.ScreenPos(this.PerB.Pos).x,this.Com.ScreenPos(this.PerB.Pos).y);
      Con.stroke();
    }
  }
}
var C=new Community();
var ca=document.getElementById("System");
var F=ca.getContext("2d");
ca.height=500;
for(var N=0;N<9;N++){
  C.PList.push(new Person(new vect(Math.cos(N/9*2*Math.PI)*ca.height/2,Math.sin(N/9*2*Math.PI)*ca.height/2),C));
  if(N>0){
    C.CList.push(new Connect(N-1,N,1,C));
  }
}
C.CList.push(new Connect(0,9-1,1,C));
C.LikeDist=ca.height*.35;
C.HateDist=C.LikeDist*2;

function animateSystem(){
  ca.width=innerWidth;
  C.Shift=new vect(ca.width/2,ca.height/2);
  F.clearRect(0, 0, innerWidth, innerHeight);
  requestAnimationFrame(animateSystem);
  
  C.MouseInteract(mouseDoc(ca));
  C.UpdatePos();
  C.UpdateAll()
  
  C.Draw(F);
  
    F.beginPath();
    F.arc(mouseDoc(ca).x,mouseDoc(ca).y,   
    10,0,Math.PI*2,false);
    F.lineWidth=3;
    F.strokeStyle='rgba(255,255,255,1)';
    F.fillStyle='rgba(255,0,0,1)';
    F.fillText(C.CList[0].Respect,10,10);
    F.stroke();
    F.fill();

}
animateSystem();
var pa=document.getElementById("Part1");
var Fa=pa.getContext("2d");
function setPos(Left,Upper,Lower){
  pa.style.left=Left+"px";
  pa.width=innerWidth-PxToInt(pa.style.left);
  
  pa.style.top=0;
  pa.height=innerHeight;
  if(Upper>0){
    pa.style.top=Upper+"px";
  }else if(Lower<innerHeight){
    pa.style.top=Lower-innerHeight+"px";
  }
}
setPos(ElementBottomOffset(document.getElementById("P1")).x,ElementCornerOffset(document.getElementById("P1")).y,ElementBottomOffset(document.getElementById("P1")).y);
var D=new Community();
function animatePa(){
  requestAnimationFrame(animatePa);
  setPos(ElementBottomOffset(document.getElementById("P1")).x,ElementCornerOffset(document.getElementById("P1")).y,ElementBottomOffset(document.getElementById("P1")).y);
  var CurrP=0;
  var CurrDist=innerHeight*2;
  
  for(var P=0;P<7;P++){
     var E=document.getElementById("P1E"+(P+1));
     if((Math.abs(ElementCornerOffset(E).y-innerHeight*.3)<CurrDist)&&(ElementAllOnScreen(E))){
       CurrDist=Math.abs(ElementCornerOffset(E).y-innerHeight*.3);
       CurrP=P;
     }
      E.style.color='rgba(200,200,200,1)';
   }
  document.getElementById("P1E"+(CurrP+1)).style.color='rgba(0,0,0,1)';
  if(CurrP===0){
    if(tween(-10,pa.width+10,mouseFixedDoc(pa).x)&&tween(-10,pa.height+10,mouseFixedDoc(pa).y))
      if(mousePress){
        Fa.beginPath();
        Fa.arc(mouseFixedDoc(pa).x,mouseFixedDoc(pa).y,
        10,0,Math.PI*2,false);
        Fa.lineWidth=3;
        Fa.strokeStyle='rgba(255,255,255,1)';
        Fa.fillStyle='rgba(255,0,0,1)';
        Fa.stroke();
        Fa.fill();
        D.PList.push(new Person(new vect(mouseFixedDoc(pa).x,mouseFixedDoc(pa).y),D));
     }
  }
  D.Draw(Fa);
}
animatePa();
