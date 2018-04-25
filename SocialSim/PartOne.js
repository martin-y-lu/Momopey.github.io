var pa=document.getElementById("Part1");//Canvas element for Scroll one
var Fa=pa.getContext("2d");//Canvas 2d element
var ScrollA= new Scroller(document.getElementById("P1"),//Top element
                        [document.getElementById("P1E1"),//Text El list
                        document.getElementById("P1E2"),
                        document.getElementById("P1E3"),
                        document.getElementById("P1E4")],
                        pa);//Canvas El
var D=new Community();//New Community for Scroll one
//Set starting Cameras and Scales
D.Cam.Scale=1.3;
D.LikeDist=pa.height*D.Cam.Scale*0.7;
D.HateDist=D.LikeDist*2;
D.PrevCam.Scale=1.3;
D.NextCam.Scale=1.4;

// <editor-fold> Buttons
var KillConnect= new Button(1,function(){
  KillConnect.G.length+=2;
},function(){
  var Trigger1=KillConnect.G[0];
  var End=KillConnect.G[0]||KillConnect.G[1];
  KillConnect.B[0].Calc(Trigger1,End);
  KillConnect.B[0].Store();
  if(KillConnect.B[0].HLength===1){
    AddConnect.G[1]=true;
  }
  if(KillConnect.B[0].H){
    if(MousePress.HLength===1){
      if(D.MouseOnConnect(mouseDoc(pa)).length>0){
        D.CList.splice(D.MouseOnConnect(mouseDoc(pa))[0],1)
      }
    }
  }
  KillConnect.G[0]=false;
  KillConnect.G[1]=false;
},function(){
  if(KillConnect.B[0].H){
    document.getElementById('ButtonB').innerText = 'Click again to deselect'
    if(D.MouseOnConnect(mouseDoc(pa)).length>0){
      var Connect=D.CList[D.MouseOnConnect(mouseDoc(pa))];
      if(Connect!=null){
        Fa.beginPath();
        Fa.moveTo(Connect.Com.Cam.ScreenPos(Connect.PerA.Pos).x,Connect.Com.Cam.ScreenPos(Connect.PerA.Pos).y);
        Fa.lineCap = "round";
        Fa.strokeStyle='rgba(0,0,0,0.35)';
        Fa.lineWidth=Math.abs(10*Connect.Respect)*Connect.Com.Cam.Scale;
        Fa.lineTo(Connect.Com.Cam.ScreenPos(Connect.PerB.Pos).x,Connect.Com.Cam.ScreenPos(Connect.PerB.Pos).y);
        Fa.stroke();
      }
    }
  }else{
    document.getElementById('ButtonB').innerText = 'Click here to kill connections'
  }
});

var AddConnect= new Button(2,function(){
  // Layout-
  //Add Connect F- contains the pos numbers
  //Add Connect G- contains the text button press, and the off switch
  //Add Connect B- The two states
  AddConnect.F["posA"];
  AddConnect.D.length+=2;
},function(){
  var NewConnect;
  var ConnectWorks=false;
  if((AddConnect.F[0]!=null)&&(AddConnect.F[1]!=null)){
    NewConnect=new Connect(AddConnect.F[0],AddConnect.F[1],-1,D);
    ConnectWorks=D.ConnectNew(NewConnect)&&D.ConnectLegal(NewConnect);
  }else{
    ConnectWorks=false;
  }
  var Trigger1=AddConnect.G[0];
  var Trigger2=MousePress.HLength===1;
  var Trigger3=MousePress.HLength===1;
  var End=AddConnect.G[0]||AddConnect.G[1];

   AddConnect.B[0].Calc((Trigger1&&(AddConnect.B[1].HLength===0)
   ||(Trigger3&&(AddConnect.B[1].HLength>0))),(Trigger2)||End);
   AddConnect.B[1].Calc((AddConnect.B[0].HLength>0)&&Trigger2,Trigger3||End)
   AddConnect.B[0].Store();
   AddConnect.B[1].Store();

   if(AddConnect.B[0].HLength===2){
     KillConnect.G[1]=true;
   }

   if(AddConnect.B[1].E&&(AddConnect.B[1].HLength===0)
   &&(AddConnect.B[0].HLength>0)&&ConnectWorks){
     D.CList.push(NewConnect);
   }
   if(AddConnect.B[0].H){
     AddConnect.F[0]=D.MouseClosestPerson(mouseDoc(pa));
   }else if(AddConnect.B[1].H){
     AddConnect.F[1]=D.MouseClosestPerson(mouseDoc(pa));
   }else{
     AddConnect.F[0]=null;
     AddConnect.F[1]=null;
   }
   AddConnect.G[0]=false;
   AddConnect.G[1]=false;
   //console.log(AddConnect.B[0].H+" "+AddConnect.B[1].H+"   -"+AddConnect.F[0]+" "+AddConnect.F[1]);
},function(){
  if(AddConnect.B[0].H){
    document.getElementById('ButtonA').innerText = 'Click again to deselect'
  }else if(AddConnect.B[1].H){
    document.getElementById('ButtonA').innerText = 'Click again to deselect'
  }else{
    document.getElementById('ButtonA').innerText = 'Click here to add some connections.'
  }
  if(AddConnect.B[0].H){
    if(AddConnect.F[0]!=null){
      Fa.beginPath();
      Fa.strokeStyle='rgba(255,0,0,0.3)';
      Fa.moveTo(D.Cam.ScreenPos(D.PList[AddConnect.F[0]].Pos).x,D.Cam.ScreenPos(D.PList[AddConnect.F[0]].Pos).y);
      Fa.lineWidth=10;
      Fa.lineTo(mouseDoc(pa).x,mouseDoc(pa).y);
      Fa.stroke();
    }
  }if(AddConnect.B[1].H){
    if((AddConnect.F[0]!=null)&&(AddConnect.F[1]!=null)){
    Fa.beginPath();
    Fa.strokeStyle='rgba(255,0,0,0.3)';
    Fa.moveTo(D.Cam.ScreenPos(D.PList[AddConnect.F[0]].Pos).x,D.Cam.ScreenPos(D.PList[AddConnect.F[0]].Pos).y);
    Fa.lineWidth=10;
    Fa.lineTo(D.Cam.ScreenPos(D.PList[AddConnect.F[1]].Pos).x,D.Cam.ScreenPos(D.PList[AddConnect.F[1]].Pos).y);
    Fa.stroke();
  }
  }
});
// After all this I have a newfound respect for UI designers.
//</editor-fold>
KillConnect.I();
AddConnect.I();
var Buttons=[];
Buttons.push(KillConnect);
Buttons.push(AddConnect);

// <editor-fold> More interaction functions
var NoButtonIngaged= function(){
  var AnyStateOn=false;
  for(var i=0;i<Buttons.length;i++){
    for(var j=0;j<Buttons[i].B.length;j++){
      if(Buttons[i].B[j].H===true){
        AnyStateOn=true;
      }
    }
  }
  return !AnyStateOn;
}
var BallHoldNum;
var BallClickCheck= function(){// Moves people if they are clicked
  if(MousePress.H&&MouseInElement(pa)){
    if((MousePress.HLength===1)){
      BallHoldNum=D.MouseOnPersons(mouseDoc(pa))
    }else{
      if(BallHoldNum!=null){
        D.PList[BallHoldNum].Pos=D.Cam.ComPos(mouseDoc(pa));
      }
    }
  }
}
 var ConnectHoverCheck= function(RespectA, RespectB){// Does the mouse interaction
  if((D.MouseOnPersons(mouseDoc(pa))===null)&&NoButtonIngaged()){//No person click
    if(MousePress.H){// Do Interaction
      D.MouseInteract(mouseDoc(pa),RespectA)
    }else{
      D.MouseInteract(mouseDoc(pa),RespectB)
    }
  }
 }
var BallClickAdd= function(){
  if(MousePress.HLength===1&&MouseInElement(pa)){//If just tapped
    if((D.MouseOnPersons(mouseDoc(pa))===null)&&NoButtonIngaged()){// If not clicking on ball, or button
      Fa.beginPath();//Draw A ball at mouse Pos;
      Fa.arc(mouseDoc(pa).x,mouseDoc(pa).y,
      10,0,Math.PI*2,false);
      Fa.lineWidth=3;
      Fa.strokeStyle='rgba(255,255,255,1)';
      Fa.fillStyle='rgba(255,0,0,1)';
      Fa.stroke();
      Fa.fill();
      D.PList.push(new Person(D.Cam.ComPos(mouseDoc(pa)),D));//Add New Person at that position
    }
  }
}
//</editor-fold>

// <editor-fold> Scroller setup
ScrollA.AddStateFuncts(0,function(){// On the first state
  BallClickCheck();// People click
  BallClickAdd();
})
ScrollA.AddStartFuncts(0,1,function(){// Just when we move from state 0 to 1
  if(D.PList.length>0){//If there are people
   var RandA=0;
   var RandB=0;
   for(var N=0;N<10;N++){//Loop to add 10 peeople
     RandA=randInt(0,D.PList.length-1);
     RandB=randInt(0,D.PList.length-1);
     var Connec=new Connect(RandA,RandB,(Math.random()-.5)*0.01,D)// Random Connect
     if(D.ConnectNew(Connec)&&D.ConnectLegal(Connec)){
       D.CList.push(Connec);//Push P
     }
   }
  }
})
ScrollA.AddTransFuncts(0,1,function(){// During 0 1 transition
  for(var C=0;C<D.CList.length;C++){//Loop through all Connects
    var Conne=D.CList[C];
    if(Conne.Respect>0){// If pos lerp twoards 1
      Conne.Respect=lerp(Conne.Respect,1,0.05);
    }
    if(Conne.Respect<0){// else lerp twoards -1
      Conne.Respect=lerp(Conne.Respect,-1,0.05);
    }
  }
})
ScrollA.AddEndFuncts(0,1,function(){//At end of trans
  for(var C=0;C<D.CList.length;C++){//Loop through all Connects
    var Conne=D.CList[C];
    if(Conne.Respect>0){// If pos lerp twoards 1
      Conne.Respect=1;
    }
    if(Conne.Respect<0){// else lerp twoards -1
      Conne.Respect=-1;
    }
  }
})
ScrollA.AddTransFuncts(1,0,function(){//when Going back from 1 to 0
  for(var C=0;C<D.CList.length;C++){
    var Conne=D.CList[C];
    Conne.Respect=lerp(Conne.Respect,0,0.05);// lero twoards 0
  }
})
ScrollA.AddEndFuncts(1,0,function(){
  D.CList=[];//When back up, clear CList
  AddConnect.G[1]=true;
  AddConnect.U();
  KillConnect.U();
})
ScrollA.AddStateFuncts(1,function(){//At one
  BallClickCheck();//Check for people click
  ConnectHoverCheck(-1,1);
  AddConnect.U();
  KillConnect.U();
})
ScrollA.AddStartFuncts(1,2,function(){//At start 1 to 2
  D.Speed=0;//Speed set 0
  AddConnect.G[1]=true;
  AddConnect.U();
  KillConnect.U();
  KillConnect.U();

})
ScrollA.AddTransFuncts(1,2,function(){
  D.Speed=tween(D.Speed,0.02,0.05);//Lerp twoards 0.02
})
ScrollA.AddEndFuncts(1,2,function(){
  D.Speed=0.02;// Set as 0.02
})
ScrollA.AddStateFuncts(2,function(){
    BallClickCheck();//People check
    D.UpdatePos();// This time things update spacewise
    ConnectHoverCheck(-1,1);
})
ScrollA.AddTransFuncts(2,1,function(){// The reverse part
  D.Speed=tween(D.Speed,0,0.05);
})
ScrollA.AddEndFuncts(2,1,function(){
  D.Speed=0;
})
ScrollA.AddStateFuncts(3,function(){// At state 3
    BallClickCheck();// The same as 2
    D.UpdatePos();
    ConnectHoverCheck(-1,1);
})
ScrollA.AddStartFuncts(2,3,function(){//Transition from 2 to 3 start
  for(var N=0;N<8;N++){//Add nine Particles with rad 1 (shift pos later with cam)
    var Position=new vect(Math.cos(N/9*2*Math.PI)*ca.height/2,Math.sin(N/9*2*Math.PI)*ca.height/2);
    Position=Vscale(Position,D.Cam.Scale*2);
    Position=Vadd(Position,D.Cam.ComPos(new vect(pa.width/2,pa.height/2)));
    D.PList.push(new Person(Position,D));
    D.ConnectToRandom(D.PList.length-1,3);//Add new random connects
  }
})
ScrollA.AddTransFuncts(2,3,function(){// During trans
  for(var C=0;C<D.CList.length;C++){// Move to 1 or -1
    var Conne=D.CList[C];
    if(Conne.Respect>0){
      Conne.Respect=lerp(Conne.Respect,1,0.03);
    }
    if(Conne.Respect<0){
      Conne.Respect=lerp(Conne.Respect,-1,0.03);
    }
  }
})
//</editor-fold>
function animatePa(){//Animator
  ScrollA.setPos();//Sets the Canvas Position
  ScrollA.CalcPos();//Calc the text El next to canvas
  ScrollA.TextEl(ScrollA.CurrPos).style.color='rgba(0,0,0,1)';//Set the tect el next to canvas Black
  ScrollA.UpdateSystem();
  D.Draw(Fa);


  AddConnect.D();
  KillConnect.D();

}
