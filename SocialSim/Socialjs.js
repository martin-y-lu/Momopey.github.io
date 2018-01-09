// JS setup functions
/////-----------
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
function MouseInElement(El){
  return tween(0,El.width,mouseDoc(El).x)&&tween(0,El.height,mouseDoc(El).y);
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
  var Ret;
  if(doc.style.cssText !=null){
    Ret=new vect(mouse.x-doc.offsetLeft,
                    mouse.y-doc.offsetTop)
  }else{
    Ret=new vect(mouse.x-ElementCornerOffset(doc).x,
                    mouse.y-ElementCornerOffset(doc).y);
  }
  return Ret
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
function Vdiff(A,B){// Difference tween A and B
  return new vect(A.x-B.x,A.y-B.y);
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
  this.Surrounds=function(Cams,doc){//Takes a camscene and Canvas/Display element, checks
    return tween(this.Shift.x,this.Shift.x+doc.width*this.Scale,Cams.Shift.x)&&
           tween(this.Shift.y,this.Shift.y+doc.height*this.Scale,Cams.Shift.y)&&
           tween(this.Shift.x,this.Shift.x+doc.width*this.Scale,Cams.Shift.x+doc.width*Cams.Scale)&&
           tween(this.Shift.y,this.Shift.y+doc.height*this.Scale,Cams.Shift.y+doc.height*Cams.Scale);
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
  this.MouseInteract=function(Mouse,TargetRespect){// Changes the connects when mouse is nearby
    var MousePos=this.Cam.ComPos(Mouse);
    for(var C=0;C<this.CList.length;C++){
      var Conn=this.CList[C];
      var Dist=Vlength(Vadd(Conn.PerA.Pos,Vscale(Conn.PerB.Pos,-1)));
      var DistA=Vlength(Vadd(Conn.PerA.Pos,Vscale(MousePos,-1)));
      var DistB=Vlength(Vadd(Conn.PerB.Pos,Vscale(MousePos,-1)));
      if(DistA+DistB<Dist+10){
        Conn.Respect=lerp(TargetRespect,Conn.Respect,.5);
        Conn.NextRespect=lerp(TargetRespect,Conn.NextRespect,.5);
      }
    }
  }
  this.MouseOnPersons=function(Mouse){
    var MousePos=this.Cam.ComPos(Mouse);
    var PersonNumber=null;
    for(var P=0;P<this.PList.length;P++){
      //console.log(Vlength(Vdiff(MousePos,this.PList[P].Pos)));
      if(Vlength(Vdiff(MousePos,this.PList[P].Pos))<20){
        if(PersonNumber==null){
          PersonNumber=P;
        }
      }
    }
    return PersonNumber;
  }
  this.ConnectToRandom=function(A,T){//Add T new random connections going from A
    for(var I=0;I<T;I++){
      var Conn=new Connect(randInt(0,D.PList.length-1),A,(Math.random()-.5)*0.01,D);
      if(D.ConnectLegal(Conn)&&D.ConnectNew(Conn)){
        D.CList.push(Conn);
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
  this.HList=[];//List of all Transitions used between text elements( form [A,B, Holder])
  // Functions on transitions of form [index on HList, Actual function]
  this.StartFuncts=[];//Functs at the start of each transition( one frame)
  this.TransFuncts=[];//Functs during Transitions
  this.EndFuncts=[];//Functs at end of transition (one frame)
  this.StateFuncs=[];//Functs running in a specific state, eg text el highlited/Textelnum
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
  this.GetTrans=function(A,B){// Returns the tran with transition A to B, No check
    var GTran=0;
    for(var i=0;i<this.HList.length;i++){
      var Transl=this.HList[i];
      if((Transl[1]===A&&Transl[2]===B)){
        GTran=Transl;
      }
    }
    return GTran[0];
  }
  this.GetTransNum=function(A,B){// Returns the index of transition A B, No check
      var Tnum=null;
      for(var i=0;i<this.HList.length;i++){
        var Transl=this.HList[i];
        if((Transl[1]===A&&Transl[2]===B)){
          Tnum=Transl;
        }
      }
      if(Tnum===null){
        this.HList.push([new Hold(),A,B])
        Tnum=this.HList.length-1;
      }
      return Tnum;
    }
  this.CallForTrans=function(A,B){// Get tran but makes the transition if it doesn't exist
    if(this.NewTrans(A,B)){
      this.HList.push([new Hold(),A,B])
    }
    var GTran=this.GetTrans(A,B);
    return GTran;
  }
  this.UpdateTrans=function(A,B){//Updates the specific Hold Tran A to B with a countup of 70 frames
    var CutOff=this.CurrPos!=B;
    var End = ((this.CallForTrans(A,B).HLength==70)||CutOff)&&this.CallForTrans(A,B).H;
    this.CallForTrans(A,B).Calc(this.Trans(A,B),End);
  }
  this.StoreTrans=function(A,B){//Stores the new vars of Tran from A to B
    this.CallForTrans(A,B).Store();
  }
  this.AddStartFuncts=function(A,B,F){//Adds a new funct to StartFuncts given A and B
    this.StartFuncts.push([A,B,F]);
  }
  this.AddTransFuncts=function(A,B,F){// Adds to Trans//Adds to during trans functs
    this.TransFuncts.push([A,B,F]);
  }
  this.AddEndFuncts=function(A,B,F){//Adds to end functs
    this.EndFuncts.push([A,B,F]);
  }
  this.AddStateFuncts=function(N,F){//Code that runs during a state given the number
    this.StateFuncs.push([N,F]);
  }
  this.UpdateHList=function(){//Updates all Holds
    for(var I=0;I<this.HList.length;I++){
      this.UpdateTrans(this.HList[I][1],this.HList[I][2]);
      this.HList[I][0].Store();
    }
  }
  this.RunStartFuncts=function(){//Check and run all start functions
    var arr=this.StartFuncts;
    for(var Ia=0;Ia<(arr.length);Ia++){
      var Item=arr[Ia]
      if(this.CallForTrans(Item[0],Item[1]).HLength===1){
        Item[2]();
      }
    }
  }
  this.RunTransFuncts=function(){//Check and run all Transitions
    var arr=this.TransFuncts;
    for(var Ib=0;Ib<arr.length;Ib++){
      var Item=arr[Ib]
      if(this.CallForTrans(Item[0],Item[1]).HLength>0){
        Item[2]();
      }
    }
  }
  this.RunEndFuncts=function(){//Check and run all  Ends
    for(var Ic=0;Ic<this.EndFuncts.length;Ic++){
      var Item=this.EndFuncts[Ic]
      if(this.CallForTrans(Item[0],Item[1]).ELength===1){
        Item[2]();
      }
    }
  }
  this.RunStateFuncts=function(){//Run all states
    var arr =this.StateFuncs;
    for(var Id=0;Id<this.StateFuncs.length;Id++){
      var Item=arr[Id]
      if(this.CurrPos===Item[0]){
        Item[1]();
      }
    }
  }
  this.UpdateSystem=function(){//Update/ run all
    if(ElementAllOffScreen(CanvasEl)===false){
      this.UpdateHList();

      this.RunStateFuncts();
      this.RunEndFuncts();
      this.RunTransFuncts();
      this.RunStartFuncts();
    }
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
