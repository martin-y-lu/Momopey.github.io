var mouse=new vect(0,0);// mouse position on screen
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
function circle(V,R,C,Lq){
  C.beginPath();
  C.arc(V.x,V.y,R,0,2*Math.PI);

  if(Lq!=null){
    Lq(C);
  }else{
    C.strokeStyle="rgb(255,0,0)";
  }

  C.stroke();
}
function line(A,B,C,Lq){
  C.beginPath();
  C.moveTo(A.x,A.y);
  C.lineTo(B.x,B.y);
  if(Lq!=null){
    Lq(C);
  }else{
    C.strokeStyle="rgb(255,0,0)";
  }
  C.stroke();
}
function lineArr(Array,C,Lq){
  for(var I=1;I<Array.length;I++){
    line(Array[I-1],Array[I],C,Lq)
  }
}


var gray=function(CON){
  CON.lineWidth=4;
  CON.lineCap="round";
  CON.strokeStyle="rgb(200,100,100)";
}
var white=function(CON){
  CON.lineWidth=6;
  CON.lineCap="round";
  CON.strokeStyle="rgb(255,255,255)";
}
var texts=function(CON){
  CON.fillStyle="rgb(255,255,255)";
}
var Htexts=function(CON){
  CON.fillStyle="rgb(255,200,200)";
}
function Scene(){
  self=this;
  this.Lines=[];//List of lines, pair of points
  this.Cam=new CamScene();
  this.LineForm=function(I){
    Form=function(CON){
      CON.strokeStyle="rgb(255,255,255)";
      CON.lineCap="round";
      CON.lineWidth=self.Lines[I][2];
    }
    return Form;
  }
  this.Draw=function(Ctx){
    for(var I=0;I<this.Lines.length;I++){
      line(this.Cam.ScreenPos(this.Lines[I][0]),this.Cam.ScreenPos(this.Lines[I][1]),Ctx,this.LineForm(I));
    }
  }
  this.MouseDraw=function(Ctx){
    var Pos=this.Cam.ComPos(mouseDoc(Ctx));
    if(mousePress){
      this.Lines.push([Pos,Pos,10]);
      if(MousePress.HLength>1){
        this.Lines[this.Lines.length-2][1]=Pos;
      }
    }
  }
  this.InvertPos=function(Pos){
    return Vscale(Pos,1/Vlength(Pos)/Vlength(Pos));
  }
  this.InsureQual=function(){
      for(var I=0;I<this.Lines.length;I++){
        var Line=this.Lines[I];
        var Dist=Vlength(Vadd(Line[0],Vscale(Line[1],-1)));
        if(Dist>5/100){
          var middle=new vect(lerp(Line[0].x,Line[1].x,.5),lerp(Line[0].y,Line[1].y,.5));
          this.Lines.push([middle.Copy(),Line[1].Copy(),Line[2]]);
          Line[1]=middle.Copy();
        }
      }
  }
  this.InvertAll=function(){
    for(var I=0;I<this.Lines.length;I++){
      this.Lines[I][0]=this.InvertPos(this.Lines[I][0]);
      this.Lines[I][1]=this.InvertPos(this.Lines[I][1]);
      this.Lines[I][2]=this.Lines[I][2]*Vlength(this.Lines[I][0]);
    }
  }
}
var ca=document.getElementById("InversCanv");
var F=ca.getContext("2d");
ca.width=window.innerWidth;
ca.height=window.innerHeight-200;

var S=new Scene();
S.Cam.Scale=150;
var MousePress=new Hold();
function animate(){
  MousePress.Calc(mousePress&&MousePress.H===false,mousePress===false);
  MousePress.Store();
  requestAnimationFrame(animate);
  ca.width=window.innerWidth;
  circle(S.Cam.ScreenPos(new vect(0,0)),1*S.Cam.Scale,F,gray);
  circle(S.Cam.ScreenPos(new vect(0,0)),1,F,gray);
  S.Cam.Shift=new vect(ca.width/S.Cam.Scale/2,ca.height/S.Cam.Scale/2);
  if((tween(0,100,mouseDoc(ca).x))&&(tween(ca.height-10,ca.height-50,mouseDoc(ca).y))){
    if(MousePress.HLength===1){
      S.InsureQual();
      S.InvertAll();
    }
    F.font = "30px Mukta";
    Htexts(F);
  }else{

    texts(F);
  }
  F.font = "30px Mukta";
  F.fillText("Invert",15,ca.height-20);
  if((tween(ca.width-10,ca.width-100,mouseDoc(ca).x))&&(tween(ca.height-10,ca.height-50,mouseDoc(ca).y))){
    Htexts(F);
    if(MousePress.HLength===1){
      S.Lines=[];
    }
  }else {
    texts(F);
  }
  F.fillText("Clear",ca.width-100,ca.height-20);
  if(((tween(0,100,mouseDoc(ca).x))&&(tween(ca.height-10,ca.height-50,mouseDoc(ca).y)))||
    ((tween(ca.width-10,ca.width-100,mouseDoc(ca).x))&&(tween(ca.height-10,ca.height-50,mouseDoc(ca).y)))
  ){}else{
     S.MouseDraw(ca);
  }

  S.Draw(F);
}
animate();
