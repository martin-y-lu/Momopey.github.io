// JS setup functions
/////-----------

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

function Hold(){// Simple class for button presses/ other stuff like that
  this.S=false;// Started
  this.H=false;// Holding
  this.E=false;//Ended
  this.nextS=false;//NextframeStuff
  this.nextH=false;
  this.nextE=false;
  this.SLength=0;//Length of Starting,Holding and Ending
  this.HLength=0;
  this.ELength=0;
  this.Calc=function(Start,End){//Gives a start end , calculates next frames
   this.nextS=Start;
   this.nextE=End;
   if(Start&&this.H===false){
     this.nextH=true;
   }
   if(End&&this.H){
     this.nextH=false;
   }
  }

  this.Store=function(){//Stores the nextframes
    this.S=this.nextS;
    this.H=this.nextH;
    this.E=this.nextE;
    if(this.S){this.SLength++;}else{this.SLength=0;}
    if(this.H){this.HLength++;}else{this.HLength=0;}
    if(this.E){this.ELength++;}else{this.ELength=0;}
  }
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
function CamScene(){//Transform class for a cam space
  this.Shift=new vect(0,0);
  this.Scale=1;
  this.ScreenPos=function(V){//Gives a screen position given space pos
    return Vscale(Vadd(V,this.Shift),this.Scale);
  }
  this.ComPos=function(V){//Finds spacepos given screen space,Good for mouse stuff
    return Vadd(Vscale(V,1/this.Scale),Vscale(this.Shift,-1))
  }
}
function Community(){// Class for system of people
  this.PList=[];//list of people
  this.CList=[];//list of connections

  this.Cam=new CamScene();//Current Camscene
  this.PrevCam=new CamScene();//Previous cam
  this.NextCam=new CamScene();//Next cam
  this.Interp=0;//The interpolation ratio between last and next;

  this.Speed=0.01;//Speed at witch people interact
  this.LikeDist=100;//The distance people at 1 freindlyness want to be (closer)
  this.HateDist=200;//The distance people at -1 hate want to be (farther)

  this.UpdateAll=function(){ //Updates all connects
    var CurrSize=this.CList.length;// Save current CList size for looping, it changes
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
          var AnyTriangle=false;// If there is any triangle between these 3 points
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
          if(AnyTriangle){}else{// if no triangle, complete it(this is why we need Currsize)
            this.CList.push(new Connect(PointA,PointB,0,this));
          }
        }

      }
    }
    for(var C=0;C<this.CList.length;C++){
      this.CList[C].Respect=this.CList[C].NextRespect;//Update respeects
    }
  }
  this.ConnectLegal=function(NewCon){//Checks if a Connect is not gonna cause problems
    var Legal=true;
    if(NewCon.NumA>=this.PList.length){
      Legal=false;
    }
    if(NewCon.NumB>=this.PList.length){
      Legal=false;
    }
    if(NewCon.NumA===NewCon.NumB){
      Legal=false;
    }
    return Legal;
  }
  this.ConnectNew=function(NewCon){// Checks if connect is completeley new
    var New=true;
    for(var i=0;i<this.CList.length;i++){
      var Con=this.CList[i];
      if((Con.NumA===NewCon.NumA&&Con.NumB===NewCon.NumB)||(Con.NumB===NewCon.NumA&&Con.NumA===NewCon.NumB)){
        New=false;
      }
    }
    return New;
  }
  this.UpdatePos=function(){//Updates all the positions for part using Connect stuff
    for(var C=0;C<this.CList.length;C++){
      var R=.01;
      var Conn=this.CList[C];
      var CurrPosA=Conn.PerA.Pos.Copy();
      var CurrPosB=Conn.PerB.Pos.Copy();
      var CurrDistance=Vlength(Vadd(CurrPosA,Vscale(CurrPosB,-1)));
      if(CurrDistance===0){
        CurrDistance=0.00001;
      }
      var Scaler=lerp(CurrDistance,lerp(this.HateDist,this.LikeDist,Conn.Respect/2+1/2),R*Math.pow(Conn.Respect,2))/CurrDistance;
      Conn.PerA.Pos=Vadd(CurrPosB,Vscale(Vadd(CurrPosA,Vscale(CurrPosB,-1)),Scaler));
      Conn.PerB.Pos=Vadd(CurrPosA,Vscale(Vadd(CurrPosB,Vscale(CurrPosA,-1)),Scaler));
    }
  }
  this.MouseInteract=function(Mouse){// Changes the connects when mouse is nearby
    var MousePos=this.Cam.ComPos(Mouse);
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
  this.SetScreenInterp=function(){// Sets the interp for Cam.
    this.Cam.Shift.x=lerp(this.PrevCam.Shift.x,this.NextCam.Shift.x,this.Interp);
    this.Cam.Shift.y=lerp(this.PrevCam.Shift.y,this.NextCam.Shift.y,this.Interp);
    this.Cam.Scale=lerp(this.PrevCam.Scale,this.NextCam.Scale,this.Interp)
  }
  this.Draw=function(Con){// Draws everything
    for(var C=0;C<this.CList.length;C++){
      this.CList[C].Draw(Con);
    }
    for(var P=0;P<this.PList.length;P++){
      this.PList[P].Draw(Con);
    }
  }
}
function Person(Pos,Com){// Class for the peeps
  this.Com=Com;// Given comunity;
  this.Pos=Pos;//Position in space
  this.NextPos=this.Pos;//Next position
  this.Draw=function(Con){//Function that draws the particle
    Con.beginPath();
    Con.arc(this.Com.Cam.ScreenPos(this.Pos).x,this.Com.Cam.ScreenPos(this.Pos).y,
    10*this.Com.Cam.Scale,0,Math.PI*2,false);
    Con.lineWidth=3;
    Con.strokeStyle='rgba(255,255,255,1)';
    Con.fillStyle='rgba(255,0,0,1)';
    Con.stroke();
    Con.fill();
  }
}
function Connect(NumA,NumB,Respect,Com){//Connect class
  this.Com=Com;// Given community
  this.NumA=NumA; //PNumber for Person A
  this.NumB=NumB;// PNumber for Person B
  this.PerA=this.Com.PList[NumA];//Person A
  this.PerB=this.Com.PList[NumB];//Person B
  this.Respect=Respect;//Current respect number (between 1 and -1)
  this.NextRespect=this.Respect;// Next respect
  this.React=function(AC,BC){//Updates the respect Given two other connects, that form a triangle with it
    this.NextRespect+=Com.Speed*(AC.Respect*BC.Respect-Math.abs(AC.Respect*BC.Respect)*this.Respect);
  }
  this.Draw=function(Con){// Draws Connect
    if(this.Respect===0){}else{
      Con.beginPath();
      Con.moveTo(this.Com.Cam.ScreenPos(this.PerA.Pos).x,this.Com.Cam.ScreenPos(this.PerA.Pos).y);
      if(this.Respect>0){
        Con.strokeStyle='rgba(0,255,0,'+Math.abs(this.Respect)*.9+')';
      }else{
        Con.strokeStyle='rgba(255,0,0,'+Math.abs(this.Respect)*.9+')';
      }
      Con.lineWidth=Math.abs(10*this.Respect)*this.Com.Cam.Scale;
      Con.lineTo(this.Com.Cam.ScreenPos(this.PerB.Pos).x,this.Com.Cam.ScreenPos(this.PerB.Pos).y);
      Con.stroke();
    }
  }
}
function Scroller(ScrollEl,TextEls,CanvasEl){// Class for scrolly elements
  this.ScrollEl=ScrollEl;//The element above the scroller, gives top pos
  this.TextEls=TextEls;// Array of all text elements next to scroller
  this.CanvasEl=CanvasEl;// Element of the canvas
  this.CurrPos=0;//Current Textel number next to the canvas
  this.LastPos=0;// Last textel number
  this.HList=[];//List of all Transitions used between textelements
  this.TextEl=function(num){// Returns textel asked for
    return TextEls[num];
  }
  this.Trans=function(A,B){// Returns if there is a transition happening between textel A and B, One frame
    var Result=false;
    if(B>A){
      Result= (this.LastPos<=A)&&(this.CurrPos>=B);
    }else{
      Result= (this.LastPos>=A)&&(this.CurrPos<=B);
    }
    return Result;
  }
  this.NewTrans=function(A,B){//Returns true if a specific transition in HList is made or not
    var New=true;
    for(var i=0;i<this.HList.length;i++){
      var Transl=this.HList[i];
      if((Transl[1]===A&&Transl[2]===B)){
        New=false;
      }
    }
    return New;
  }
  this.GetTran=function(A,B){// Returns the tran with transition A to B, No check
    var GTran=0;
    for(var i=0;i<this.HList.length;i++){
      var Transl=this.HList[i];
      if((Transl[1]===A&&Transl[2]===B)){
        GTran=Transl;
      }
    }
    return GTran[0];
  }
  this.CallforTrans=function(A,B){// Get tran but makes the transition if it doesn't exist
    if(this.NewTrans(A,B)){
      this.HList.push([new Hold(),A,B])
    }
    var GTran=this.GetTran(A,B);
    return GTran;
  }
  this.UpdateTrans=function(A,B){//Updates the specific Hold Tran A to B with a countup of 70 frames;
    this.CallforTrans(A,B).Calc(this.Trans(A,B),this.GetTran(A,B).HLength===70);
  }
  this.StoreTrans=function(A,B){//Stores the new vars of Tran from A to B
    this.CallforTrans(A,B).Store();
  }
  this.CalcPos=function(){//Calculates the Currpos, the textel next to canvas
    this.LastPos=this.CurrPos;
    var CurrDist=1000;
      for(var P=0;P<this.TextEls.length;P++){
     var E=this.TextEl(P);
     if((Math.abs(ElementCornerOffset(E).y-innerHeight*.3)<CurrDist)&&(ElementAllOnScreen(E))){
       CurrDist=Math.abs(ElementCornerOffset(E).y-innerHeight*.3);
       this.CurrPos=P;
     }
      E.style.color='rgba(200,200,200,1)';
   }
  }
  this.setPos=function(){// Calculates Position of the Canvas given the scrolls;
     var Left=ElementBottomOffset(this.ScrollEl).x;
     var Upper=ElementCornerOffset(this.ScrollEl).y;
     var Lower=ElementBottomOffset(this.ScrollEl).y;
    this.CanvasEl.style.left=Left+"px";
    this.CanvasEl.width=innerWidth-PxToInt(pa.style.left);

    this.CanvasEl.style.top=0;
    this.CanvasEl.height=innerHeight;
    if(Upper>0){
      this.CanvasEl.style.top=Upper+"px";
    }else if(Lower<innerHeight){
      this.CanvasEl.style.top=Lower-innerHeight+"px";
    }
  }
}
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

  C.MouseInteract(mouseDoc(ca));//Mouse Interaction
  C.UpdatePos();
  C.UpdateAll()

  C.Draw(F);
}
