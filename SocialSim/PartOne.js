var pa=document.getElementById("Part1");//Canvas element for Scroll one
var Fa=pa.getContext("2d");//Canvas 2d element
var Scroll= new Scroller(document.getElementById("P1"),//Top element
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
var BallClickCheck= function(){
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
Scroll.AddStateFuncts(0,function(){
  BallClickCheck();
  if(MousePress.H){
    if(D.MouseOnPersons(mouseFixedDoc(pa))===null){
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
Scroll.AddStartFuncs(0,1,function(){
  if(D.PList.length>=2){
    D.CList.push(new Connect(0,1,(Math.random()-.5)*0.01,D));
  }
  if(D.PList.length>0){
   var RandA=0;
   var RandB=0;
   for(var N=0;N<10;N++){
     RandA=randInt(0,D.PList.length-1);
     RandB=randInt(0,D.PList.length-1);
     var Connec=new Connect(RandA,RandB,(Math.random()-.5)*0.01,D)
     if(D.ConnectNew(Connec)&&D.ConnectLegal(Connec)){
       D.CList.push(Connec);
     }
   }
  }
})
Scroll.AddTransFuncts(0,1,function(){
  for(var C=0;C<D.CList.length;C++){
    var Conne=D.CList[C];
    if(Conne.Respect>0){
      Conne.Respect=lerp(Conne.Respect,1,0.05);
    }
    if(Conne.Respect<0){
      Conne.Respect=lerp(Conne.Respect,-1,0.05);
    }
  }
})
Scroll.AddEndFuncts(0,1,function(){
  for(var C=0;C<D.CList.length;C++){
    var Conne=D.CList[C];
    if(Conne.Respect>0){
      Conne.Respect=1;
    }
    if(Conne.Respect<0){
      Conne.Respect=-1;
    }
  }
})
Scroll.AddTransFuncts(1,0,function(){
  for(var C=0;C<D.CList.length;C++){
    var Conne=D.CList[C];
    if(Conne.Respect>0){
      Conne.Respect=lerp(Conne.Respect,0,0.05);
    }
    if(Conne.Respect<0){
      Conne.Respect=lerp(Conne.Respect,0,0.05);
    }
  }
})
Scroll.AddEndFuncts(1,0,function(){
  D.CList=[];
})
Scroll.AddStateFuncts(1,function(){
    BallClickCheck();
    if(MousePress.H){
      D.MouseInteract(mouseFixedDoc(pa),-1)
    }else{
      D.MouseInteract(mouseFixedDoc(pa),1)
    }
})
Scroll.AddStateFuncts(2,function(){
    BallClickCheck();
    D.UpdatePos();
    if(MousePress.H){
      D.MouseInteract(mouseFixedDoc(pa),-1)
    }else{
      D.MouseInteract(mouseFixedDoc(pa),1)
    }
})

function animatePa(){//Animator
  Scroll.setPos();//Sets the Canvas Position
  Scroll.CalcPos();//Calc the text El next to canvas
  Scroll.TextEl(Scroll.CurrPos).style.color='rgba(0,0,0,1)';//Set the tect el next to canvas Black
  Scroll.UpdateSystem();
  // if(Scroll.CurrPos===0) {//if CurrPos is 0
  //   if(tween(-10,pa.width+10,mouseFixedDoc(pa).x)&&tween(-10,pa.height+10,mouseFixedDoc(pa).y)){//if dot on mouse is on canvas
      // if(MouseClick.H){//If Mouse is clicked
      //   Fa.beginPath();//Draw A ball at mouse Pos;
      //   Fa.arc(mouseFixedDoc(pa).x,mouseFixedDoc(pa).y,
      //   10,0,Math.PI*2,false);
      //   Fa.lineWidth=3;
      //   Fa.strokeStyle='rgba(255,255,255,1)';
      //   Fa.fillStyle='rgba(255,0,0,1)';
      //   Fa.stroke();
      //   Fa.fill();
      //   D.PList.push(new Person(D.Cam.ComPos(mouseFixedDoc(pa)),D));//Add New Person at that position
      // }
  //    }
  // }
  //   Scroll.UpdateTrans(0,1);
  //   Scroll.StoreTrans(0,1);
  //   if(Scroll.GetTrans(0,1).HLength>0){
  //     if(Scroll.GetTrans(0,1).HLength===1){
  //       if(D.PList.length>0){
  //         var RandA=0;
  //         var RandB=0;
  //         for(var N=0;N<10;N++){
  //           RandA=randInt(0,D.PList.length-1);
  //           RandB=randInt(0,D.PList.length-1);
  //           var Connec=new Connect(RandA,RandB,(Math.random()-.5)*0.01,D)
  //           if(D.ConnectNew(Connec)&&D.ConnectLegal(Connec)){
  //             D.CList.push(Connec);
  //           }
  //         }
  //       }
  //     }
  //     for(var C=0;C<D.CList.length;C++){
  //       var Conne=D.CList[C];
  //       if(Conne.Respect>0){
  //         Conne.Respect=Scroll.GetTrans(0,1).HLength/70;
  //       }
  //       if(Conne.Respect<0){
  //         Conne.Respect=-Scroll.GetTrans(0,1).HLength/70;
  //       }
  //     }
  //   }
  //
  //   Scroll.UpdateTrans(1,0);
  //   Scroll.StoreTrans(1,0);
  //   if(Scroll.GetTrans(1,0).H){
  //     if(Scroll.GetTrans(1,0).HLength===70){
  //       D.CList=[];
  //     }
  //     for(var Ca=0;Ca<D.CList.length;Ca++){
  //       var Conn=D.CList[Ca];
  //       if(Conn.Respect>0){
  //         Conn.Respect=1-Scroll.GetTrans(1,0).HLength/70;
  //       }
  //       if(Conn.Respect<0){
  //         Conn.Respect=-1+Scroll.GetTrans(1,0).HLength/70;
  //       }
  //     }
  //   }
  //   if(Scroll.CurrPos>=2){
  //      D.UpdatePos();
  //   }
  //   Scroll.UpdateTrans(2,3);
  //   Scroll.StoreTrans(2,3);
  //   if(Scroll.GetTrans(2,3).H){
  //     if(Scroll.GetTrans(2,3).HLength===1){
  //       D.NextCam.Scale=10;
  //     }
  //     D.Interp=Scroll.GetTrans(2,3).HLength/70;
  //     D.SetScreenInterp();
  //   }
  //   Scroll.UpdateTrans(3,2);
  //   Scroll.GetTrans(3,2).E=Scroll.GetTrans(2,3).H;
  //   Scroll.StoreTrans(3,2);
  //   if(Scroll.GetTrans(3,2).H){
  //     D.Interp=1-Scroll.GetTrans(3,2).HLength/70;
  //     D.SetScreenInterp();
  //   }

    D.Draw(Fa);
}
