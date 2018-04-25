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
function vect(X,Y){
  this.x=X;
  this.y=Y;
  this.set=function(V){
    this.x=V.x;
    this.y=V.y;
  }
  this.neg=function(){
    return {x:-this.x,y:-this.y};
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
function Vlength(P){// Length/ distance of vector
  return Math.sqrt(P.x*P.x+P.y*P.y);
}
function tween(T,B,M){
  return ((M<=T)&&(M>=B))||((M>=T)&&(M<=B));
}
function drawLinePos(Pos1,Pos2,con){
  con.beginPath();
  con.moveTo(Pos1.x,Pos1.y);
  con.lineTo(Pos2.x,Pos2.y);
  con.stroke();
}
function LatexMat(Mat){
  var S="\\begin{bmatrix}"
  for(var i=0; i<Mat.length; i++){
    for(var j=0; j<Mat[i].length; j++){
      S+=Mat[i][j]
      if(j!=Mat[i].length-1){
        S+="&"
      }
    }
    S+="\\\\"
  }S+="\\end{bmatrix}"
  return S;
}
function ApplyFunct(Matrix,Funct){
  var Matt=[];
  for(var i=0; i<Matrix.length; i++){
    var Arr=[];
    for(var j=0; j<Matrix[i].length; j++){
       Arr.push(Funct(i,j));
    }
    Matt.push(Arr);
  }
  return Matt;
}
function Scene(Matrix,PointsList,Elem){
  this.Mat=Matrix;
  this.Points=PointsList;
  this.HoldNum=null;
  this.ca=Elem;
  this.ctx=this.ca.getContext("2d");
  this.Init=function(){
    this.ca.height=300;
    this.ca.width=800;
    this.ca.width = this.ca.clientWidth;
    this.ca.height = this.ca.clientHeight;
  }
  this.Display=function(){
    DrawGraph1(this.ctx);
  }
  this.DrawPoints=function(){
    DrawPointsGraph1(this.Points,this.ctx);// Draw Points
    DrawPointsGraph2(this.Points,this.Mat,this.ctx)
  }
  this.Interact=function(){
    this.HoldNum=UpdateHold(this.Points,this.HoldNum,this.ca);
    if(this.HoldNum!=null){
      DrawSelection(this.Points[this.HoldNum],this.Mat,this.ctx)
    }
  }
  this.UpdateText=function(textIMG){
    textIMG.src= UpdateString(this.Mat,this.Points,this.HoldNum);
  }
  this.DrawBasisGraph=function(){
    DrawBasisGraph(this.Mat,this.ctx);
  }
  this.DrawBasisVectors=function(){
    DrawBasisVectors(this.Mat,this.ctx);
  }
  this.DrawBasisSelection=function(){
    if(this.HoldNum!=null){
      DrawBasisSelection(this.Points[this.HoldNum],this.Mat,ctx1)
    }
  }
}
function drawLine(X1,Y1,X2,Y2,con){
  con.beginPath();
  con.moveTo(X1,Y1);
  //con.strokeStyle='rgba(255,255,255,1)';
  con.lineTo(X2,Y2);
  con.stroke();
}
function drawCircle(X,Y,R,ctx){
  ctx.beginPath();
  ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fill();
}
function MouseNear(Pos,El){
  return Vlength(Vadd(PtoGraph1(Pos),mouseDoc(El).neg()))<8;
}
function MatMult(mat, vec){
  return{x: vec.x*mat[0][0]+vec.y*mat[0][1],y: vec.x*mat[1][0]+vec.y*mat[1][1]}
}
function PtoGraph1(Pos){
  return {x:(400-20)/2+Pos.x*30, y:150-Pos.y*30};
}
function Graph1toP(Pos){
  return {x:(Pos.x-(400-20)/2)/30,y:(150-Pos.y)/30};
}
function PtoGraph2(Pos){
  return {x:(800+400+20)/2+Pos.x*30, y:150-Pos.y*30};
}
function PinGraph(Pos){
  return tween(((400-20)/2)/30,-((400-20)/2)/30,Pos.x)&&tween(150/30,-150/30,Pos.y);
}
function MouseOnPoint(PList,El){
  var Hold=null;
  for(var i=0;i<PList.length;i++){
    if(MouseNear(PList[i],El)){
      if(PinGraph(PList[i])){
        Hold=i;
      }
    }
  }
  return Hold;
}
function UpdateHold(Poi,lastHold,El){
  var NextHold=lastHold;
  if(MouseOnPoint(Poi,El)!=null){
    NextHold=MouseOnPoint(Poi,El);
  }else if(!mousePress){
    NextHold=null;
  }
  if(NextHold!=null){
    if(mousePress&&PinGraph(Graph1toP(mouseDoc(El)))){
      Poi[NextHold]=Graph1toP(mouseDoc(El));
    }
  }
  return NextHold;
}
function UpdateString(Mat,Points,HoldNum){
  var S="http://latex.codecogs.com/gif.latex? \\large"
  S+=LatexMat(Mat);
  S+="\\times"
  if(HoldNum==null){
    var InVect=["x","y"];
  }else{
    var InVect=[Points[HoldNum].x.toFixed(2),Points[HoldNum].y.toFixed(2)];
  }
  S+=LatexMat([[InVect[0]],[InVect[1]]]);
  S+="="
  var GeneralOut=[[InVect[0]+"("+Mat[0][0]+")"+((InVect[1]>=0||HoldNum==null) ? "+" : "")+InVect[1]+"("+Mat[0][1]+")"],
                  [InVect[0]+"("+Mat[1][0]+")"+((InVect[1]>=0||HoldNum==null) ? "+" : "")+InVect[1]+"("+Mat[1][1]+")"]]
  S+=LatexMat(GeneralOut);
  if(HoldNum!=null){
    S+="=";
    var OutVect=[[MatMult(Mat,Points[HoldNum]).x.toFixed(2)],[MatMult(Mat,Points[HoldNum]).y.toFixed(2)]]
    S+=LatexMat(OutVect);
  }
  return S;
}
function DrawGraph1(ctx){
  //ctx.beginPath();
  ctx.strokeStyle="rgb(100,100,100)";
  ctx.lineWidth=1;
  drawLine(0,150,400-20,150,ctx);// Horisontal lines
  drawLine((400-20)/2,0,(400-20)/2,300,ctx);// Vertical lines

  //Graph
  for(var i=0;i<= (150/30);i++){//Y dashes
    var P={x:0,y:i};
    drawLinePos(Vadd(PtoGraph1(P),{x:-5,y:0}),Vadd(PtoGraph1(P),{x:5,y:0}),ctx);
  }
  for(var i=0;i<= (150/30);i++){
    var P={x:0,y:-i};
    drawLinePos(Vadd(PtoGraph1(P),{x:-5,y:0}),Vadd(PtoGraph1(P),{x:5,y:0}),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){//X dashes
    var P={x:i,y:0};
    drawLinePos(Vadd(PtoGraph1(P),{x:0,y:-5}),Vadd(PtoGraph1(P),{x:0,y:5}),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){
    var P={x:-i,y:0};
    drawLinePos(Vadd(PtoGraph1(P),{x:0,y:-5}),Vadd(PtoGraph1(P),{x:0,y:5}),ctx);
  }
}
function DrawGraph2(color,ctx){
  ctx.strokeStyle=color;
  ctx.lineWidth=1;
  drawLine(400+20,150,800,150,ctx);
  drawLine((800+400+20)/2,0,(800+400+20)/2,300,ctx);
  for(var i=0;i<= (150/30);i++){//Y dashes
    var P={x:0,y:i};
    drawLinePos(PtoGraph2(Vadd(P,{x:-5/30,y:0})),PtoGraph2(Vadd(P,{x:5/30,y:0})),ctx);
  }
  for(var i=0;i<= (150/30);i++){
    var P={x:0,y:-i};
    drawLinePos(PtoGraph2(Vadd(P,{x:-5/30,y:0})),PtoGraph2(Vadd(P,{x:5/30,y:0})),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){//X dashes
    var P={x:i,y:0};
    drawLinePos(PtoGraph2(Vadd(P,{x:0,y:-5/30})),PtoGraph2(Vadd(P,{x:0,y:5/30})),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){
    var P={x:-i,y:0};
    drawLinePos(PtoGraph2(Vadd(P,{x:0,y:-5/30})),PtoGraph2(Vadd(P,{x:0,y:5/30})),ctx);
  }
}
function DrawBasisGraph(Mat,ctx){
  ctx.strokeStyle="rgb(100,100,100)";
  ctx.lineWidth=1;
  drawLinePos(PtoGraph2(MatMult(Mat,{x:0,y:-((400-20)/2)/30})),PtoGraph2(MatMult(Mat,{x:0,y:((400-20)/2)/30})),ctx);
  drawLinePos(PtoGraph2(MatMult(Mat,{x:-150/30,y:0})),PtoGraph2(MatMult(Mat,{x:150/30,y:0})),ctx);
  for(var i=0;i<= (150/30);i++){//Y dashes
    var P={x:0,y:i};
    drawLinePos(PtoGraph2(MatMult(Mat,Vadd(P,{x:-5/30,y:0}))),PtoGraph2(MatMult(Mat,Vadd(P,{x:5/30,y:0}))),ctx);
  }
  for(var i=0;i<= (150/30);i++){
    var P={x:0,y:-i};
    drawLinePos(PtoGraph2(MatMult(Mat,Vadd(P,{x:-5/30,y:0}))),PtoGraph2(MatMult(Mat,Vadd(P,{x:5/30,y:0}))),ctx);
    //drawLinePos(PtoGraph2(Vadd(P,{x:-5/30,y:0})),PtoGraph2(Vadd(P,{x:5/30,y:0})),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){//X dashes
    var P={x:i,y:0};
    //drawLinePos(PtoGraph2(Vadd(P,{x:0,y:-5/30})),PtoGraph2(Vadd(P,{x:0,y:5/30})),ctx);
    drawLinePos(PtoGraph2(MatMult(Mat,Vadd(P,{x:0,y:-5/30}))),PtoGraph2(MatMult(Mat,Vadd(P,{x:0,y:5/30}))),ctx);
  }
  for(var i=0;i<=(((400-20)/2)/30);i++){
    var P={x:-i,y:0};
    //drawLinePos(PtoGraph2(Vadd(P,{x:0,y:-5/30})),PtoGraph2(Vadd(P,{x:0,y:5/30})),ctx);
    drawLinePos(PtoGraph2(MatMult(Mat,Vadd(P,{x:0,y:-5/30}))),PtoGraph2(MatMult(Mat,Vadd(P,{x:0,y:5/30}))),ctx);
  }
}
function DrawBasisVectors(Mat,ctx){
  ctx.lineWidth=2;
  ctx.strokeStyle="rgb(255,100,100)";
  drawLinePos(PtoGraph1({x:0,y:1}),PtoGraph1({x:0,y:0}),ctx);
  drawLinePos(PtoGraph1({x:0,y:1}),PtoGraph1({x:0.2,y:1-0.4}),ctx);
  drawLinePos(PtoGraph1({x:0,y:1}),PtoGraph1({x:-0.2,y:1-0.4}),ctx);
  ctx.strokeStyle="rgb(100,255,100)";
  drawLinePos(PtoGraph1({x:1,y:0}),PtoGraph1({x:0,y:0}),ctx);
  drawLinePos(PtoGraph1({x:1,y:0}),PtoGraph1({x:1-0.4,y:0.2}),ctx);
  drawLinePos(PtoGraph1({x:1,y:0}),PtoGraph1({x:1-0.4,y:-0.2}),ctx);
  ctx.strokeStyle="rgb(255,100,100)";
  drawLinePos(PtoGraph2(MatMult(Mat,{x:0,y:1})),PtoGraph2(MatMult(Mat,{x:0,y:0})),ctx);
  drawLinePos(PtoGraph2(MatMult(Mat,{x:0,y:1})),PtoGraph2(MatMult(Mat,{x:0.2,y:1-0.4})),ctx);
  drawLinePos(PtoGraph2(MatMult(Mat,{x:0,y:1})),PtoGraph2(MatMult(Mat,{x:-0.2,y:1-0.4})),ctx);
  ctx.strokeStyle="rgb(100,255,100)";
  drawLinePos(PtoGraph2(MatMult(Mat,{x:1,y:0})),PtoGraph2(MatMult(Mat,{x:0,y:0})),ctx);
  drawLinePos(PtoGraph2(MatMult(Mat,{x:1,y:0})),PtoGraph2(MatMult(Mat,{x:1-0.4,y:0.2})),ctx);
  drawLinePos(PtoGraph2(MatMult(Mat,{x:1,y:0})),PtoGraph2(MatMult(Mat,{x:1-0.4,y:-0.2})),ctx);
}
function DrawPointsGraph1(PList,ctx){
  for(var i=0;i<PList.length;i++){
    drawCircle(PtoGraph1(PList[i]).x, PtoGraph1(PList[i]).y, 5,ctx);
  }
}
function DrawPointsGraph2(PList,Mat,ctx){
  for(var i=0;i<PList.length;i++){
    var New=MatMult(Mat,PList[i]);
    if(PinGraph(New)){
      drawCircle(PtoGraph2(New).x, PtoGraph2(New).y, 5,ctx);
    }
  }
}
function DrawSelection(Poi,Mat,ctx){
  ctx.lineWidth=1;
  ctx.strokeStyle="rgb(10,140,10)";
  drawLinePos(PtoGraph1(Poi),PtoGraph1({x:0,y:Poi.y}),ctx);
  ctx.strokeStyle="rgb(140,10,10)";
  drawLinePos(PtoGraph1(Poi),PtoGraph1({x:Poi.x,y:0}),ctx);
  drawCircle(PtoGraph1(Poi).x, PtoGraph1(Poi).y, 10,ctx)
  if(PinGraph(MatMult(Mat,Poi))){
    //DrawBasisSelection(Poi,Mat,ctx);
    drawCircle(PtoGraph2(MatMult(Mat,Poi)).x, PtoGraph2(MatMult(Mat,Poi)).y, 10,ctx)
  }
}
function DrawBasisSelection(Poi,Mat,ctx){
  ctx.lineWidth=1;
  ctx.strokeStyle="rgb(10,140,10)";
  drawLinePos(PtoGraph2(MatMult(Mat,Poi)),PtoGraph2(MatMult(Mat,{x:0,y:Poi.y})),ctx);
  ctx.strokeStyle="rgb(140,10,10)";
  drawLinePos(PtoGraph2(MatMult(Mat,Poi)),PtoGraph2(MatMult(Mat,{x:Poi.x,y:0})),ctx);
  if(PinGraph(MatMult(Mat,Poi))){
    //DrawBasisSelection(Poi,Mat,ctx);
    drawCircle(PtoGraph2(MatMult(Mat,Poi)).x, PtoGraph2(MatMult(Mat,Poi)).y, 10,ctx)
  }
  //drawCircle(PtoGraph1(MatMult(Mat,Poi)).x, PtoGraph1(MatMult(Mat,Poi)).y, 10,ctx);
  // if(PinGraph(MatMult(Mat,Poi))){
  //   drawCircle(PtoGraph2(MatMult(Mat,Poi)).x, PtoGraph2(MatMult(Mat,Poi)).y, 10,ctx)
 }
