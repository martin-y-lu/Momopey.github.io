var mouse={x:0,y:0}
var mousePress=false;
window.addEventListener("mousedown",function(event){mousePress=true;},false);
window.addEventListener("mouseup",function(event){mousePress=false;},false);

window.addEventListener("mousemove",function(event){
  mouse.x=event.x;
  mouse.y=event.y;
})
function mouseInCanvas(doc){
  return tween(0,doc.width,mouseDoc(doc).x)&&tween(0,doc.height,mouseDoc(doc).y);
}
function ElementOffScreen(doc){
  var rect = doc.getBoundingClientRect();
  return (rect.left + rect.width) < 0 || (rect.top + rect.height) < 0|| (rect.left >innerWidth || rect.top > innerHeight);
}
function mouseDoc(doc){
  return new vect(mouse.x-doc.getBoundingClientRect().left,
                  mouse.y-doc.getBoundingClientRect().top)
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
function Vscale(V,F){
  return new vect(V.x*F,V.y*F);
}
function Vmult(A,B){
  return new vect(A.x*B.x-A.y*B.y,A.x*B.y+A.y*B.x);
}
function Vdiv(P,C){
  return new vect((C.x*P.x+C.y*P.y)/((C.x*C.x)+(C.y*C.y)),
  (C.x*P.y-C.y*P.x)/((C.x*C.x)+(C.y*C.y)));
}
function Vlength(P){
  return Math.sqrt(P.x*P.x+P.y*P.y);
}
function tween(T,B,M){
  return ((M<=T)&&(M>=B))||((M>=T)&&(M<=B));
}
function lerp(S,E,R){
  return E*R+S-S*R;
}
function randInt(B,T){
  var RandomNum=Math.random()*(T-B+1);
  if(RandomNum===T-B+1){
    RandomNum=T-B
  }else{
    RandomNum=Math.floor(RandomNum);
  }
  return RandomNum;
}
function Community(){
  this.PList=[];
  this.CList=[];
  this.Speed=0.01;
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
      var Scale=lerp(CurrDist,lerp(200,100,Conn.Respect/2+1/2),R*Math.pow(Conn.Respect,2))/CurrDist;
      Conn.PerA.Pos=Vadd(CurrPosB,Vscale(Vadd(CurrPosA,Vscale(CurrPosB,-1)),Scale));
      Conn.PerB.Pos=Vadd(CurrPosA,Vscale(Vadd(CurrPosB,Vscale(CurrPosA,-1)),Scale));          
    }
  }
  this.MouseInteract=function(Mouse){
    for(var C=0;C<this.CList.length;C++){
      var Conn=this.CList[C];
      var Dist=Vlength(Vadd(Conn.PerA.Pos,Vscale(Conn.PerB.Pos,-1)));
      var DistA=Vlength(Vadd(Conn.PerA.Pos,Vscale(Mouse,-1)));
      var DistB=Vlength(Vadd(Conn.PerB.Pos,Vscale(Mouse,-1)));
      if(DistA+DistB<Dist+10){
        Conn.Respect=lerp(-1,Conn.Respect,.5);
        Conn.NextRespect=lerp(-1,Conn.NextRespect,.5);
      }
    }
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
function Person(Pos){
  this.Pos=Pos;
  this.NextPos=this.Pos;
  this.Draw=function(Con){
    Con.beginPath();
    Con.arc(this.Pos.x,this.Pos.y,   
    10,0,Math.PI*2,false);
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
      Con.moveTo(this.PerA.Pos.x,this.PerA.Pos.y);
      if(this.Respect>0){
        Con.strokeStyle='rgba(0,255,0,'+Math.abs(this.Respect)*.9+')';
      }else{
        Con.strokeStyle='rgba(255,0,0,'+Math.abs(this.Respect)*.9+')';
      }
      Con.lineWidth=Math.abs(10*this.Respect);
      Con.lineTo(this.PerB.Pos.x,this.PerB.Pos.y);
      Con.stroke();
    }
  }
}
var C=new Community();

C.PList.push(new Person(new vect(200,30)));
C.PList.push(new Person(new vect(100,30)));
C.PList.push(new Person(new vect(150,130)));
 C.PList.push(new Person(new vect(250,130)));
C.PList.push(new Person(new vect(350,230))); 
C.PList.push(new Person(new vect(350,90)));
C.PList.push(new Person(new vect(350,200)));
C.PList.push(new Person(new vect(350,210)));
C.PList.push(new Person(new vect(360,200)));
C.CList.push(new Connect(0,1,.1,C));
C.CList.push(new Connect(0,2,.8,C));
 C.CList.push(new Connect(1,2,.1,C));
 C.CList.push(new Connect(1,3,.2,C));
C.CList.push(new Connect(1,4,.2,C));
C.CList.push(new Connect(1,5,.2,C));
C.CList.push(new Connect(1,6,.2,C));
C.CList.push(new Connect(1,7,.2,C));
C.CList.push(new Connect(3,8,.2,C));

var ca=document.getElementById("System");
var F=ca.getContext("2d");
ca.height=300;
for(var X=0;X<9;X++){
   //C.PList.push(new Person(new vect(Math.random()*innerWidth,Math.random()*ca.height)));
//    if(X>=1){
//    C.CList.push(new Connect(X,X-1,-0.8,C));
//    }else{
//      C.CList.push(new Connect(X,9-1,-.8,C));
//    }
}
function animateSystem(){
  ca.width=innerWidth;
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
