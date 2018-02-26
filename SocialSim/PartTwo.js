function myFunction() {//For the text that is clickable
    var x = document.getElementById("small");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
var pb=document.getElementById("Part2");//Canvas element for Scroll one
var Fb=pb.getContext("2d");//Canvas 2d element
var ScrollB= new Scroller(document.getElementById("P2"),//Top element
                        [document.getElementById("P2E1"),//Text El list
                        document.getElementById("P2E2"),
                        document.getElementById("P2E3"),
                        document.getElementById("P2E4")],
                        pb);//Canvas El



var E=new Community();
//Set starting Cameras and Scales
E.Cam.Scale=1;
E.LikeDist=pa.height*D.Cam.Scale*0.7;
E.HateDist=E.LikeDist*2;


// for(var N=0;N<9;N++){
//   E.PList.push(new Person(new vect(pb.width*.5,pb.height*.5),E));
//   // console.log(pb.width+"    , "+pb.height)
// }

function animatePb(){//Animator
  ScrollB.setPos();//Sets the Canvas Position
  ScrollB.CalcPos();//Calc the text El next to canvas
  ScrollB.TextEl(ScrollB.CurrPos).style.color='rgba(0,0,0,1)';//Set the tect el next to canvas Black
  ScrollB.UpdateSystem();
  E.Draw(Fb);
}
