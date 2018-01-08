var pa=document.getElementById("Part1");//Canvas element for Scroll one
var Fa=pa.getContext("2d");//Canvas 2d element
var ScrollA= new Scroller(document.getElementById("P1"),//Top element
                        [document.getElementById("P1E1"),//Text El list
                        document.getElementById("P1E2"),
                        document.getElementById("P1E3"),
                        document.getElementById("P1E4")],
                        pa);//Canvas El
var MouseClick=new Hold();//Mouse Down Hold
var D=new Community();//New Community for Scroll one
//Set starting Cameras and Scales
D.Cam.Scale=1.3;
D.LikeDist=pa.height*D.Cam.Scale*0.7;
D.HateDist=D.LikeDist*2;
D.PrevCam.Scale=1.3;
D.NextCam.Scale=1.4;

var BallHoldNum;
var BallClickCheck= function(){// Moves people if they are clicked
  if(MousePress.H){
    if(MousePress.HLength===1){
      BallHoldNum=D.MouseOnPersons(mouseFixedDoc(pa))
    }else{
      if(BallHoldNum!=null){
        console.log("mouse on toppa "+D.MouseOnPersons(mouseFixedDoc(pa)))
        D.PList[BallHoldNum].Pos=D.Cam.ComPos(mouseFixedDoc(pa));
      }
    }
  }
}
ScrollA.AddStateFuncts(0,function(){// On the first state
  BallClickCheck();// People click
  if(MousePress.HLength===1){//If just tapped
    if(D.MouseOnPersons(mouseFixedDoc(pa))===null){// If not clicking on ball
      Fa.beginPath();//Draw A ball at mouse Pos;
      Fa.arc(mouseFixedDoc(pa).x,mouseFixedDoc(pa).y,
      10,0,Math.PI*2,false);
      Fa.lineWidth=3;
      Fa.strokeStyle='rgba(255,255,255,1)';
      Fa.fillStyle='rgba(255,0,0,1)';
      Fa.stroke();
      Fa.fill();
      D.PList.push(new Person(D.Cam.ComPos(mouseFixedDoc(pa)),D));//Add New Person at that position
    }
  }
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
  for(var C=0;C<D.CList.length;C++){//Set them all to one or negitave one
    var Conne=D.CList[C];
    if(Conne.Respect>0){
      Conne.Respect=1;
    }
    if(Conne.Respect<0){
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
})
ScrollA.AddStateFuncts(1,function(){//At one
    BallClickCheck();//Check for people click
    if(D.MouseOnPersons(mouseFixedDoc(pa))===null){//No person click
      if(MousePress.H){// Do Interaction
        D.MouseInteract(mouseFixedDoc(pa),-1)
      }else{
        D.MouseInteract(mouseFixedDoc(pa),1)
      }
    }
})
ScrollA.AddStartFuncts(1,2,function(){//At start 1 to 2
  D.Speed=0;//Speed set 0
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
    if(D.MouseOnPersons(mouseFixedDoc(pa))===null){//More interact
      if(MousePress.H){
        D.MouseInteract(mouseFixedDoc(pa),-1)
      }else{
        D.MouseInteract(mouseFixedDoc(pa),1)
      }
    }
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
    if(D.MouseOnPersons(mouseFixedDoc(pa))===null){
      if(MousePress.H){
        D.MouseInteract(mouseFixedDoc(pa),-1)
      }else{
        D.MouseInteract(mouseFixedDoc(pa),1)
      }
    }
})
ScrollA.AddStartFuncts(2,3,function(){//Transition from 2 to 3 start
  for(var N=0;N<12;N++){//Add nine Particles with rad 1 (shift pos later with cam)
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
      Conne.Respect=lerp(Conne.Respect,1,0.005);
    }
    if(Conne.Respect<0){
      Conne.Respect=lerp(Conne.Respect,-1,0.005);
    }
  }
})
function animatePa(){//Animator
  ScrollA.setPos();//Sets the Canvas Position
  ScrollA.CalcPos();//Calc the text El next to canvas
  ScrollA.TextEl(ScrollA.CurrPos).style.color='rgba(0,0,0,1)';//Set the tect el next to canvas Black
  ScrollA.UpdateSystem();
  D.Draw(Fa);
}
