var cb=document.getElementById("MatrixBasis");
var ctx1=ca.getContext("2d");
var BasisScene=new Scene([[1,1],
                       [-1,1]]
        ,[{x:0,y:0},{x:2,y:2},{x:-2,y:2},{x:0,y:-2},{x:1,y:-1.75},{x:-1,y:-1.75},{x:-2,y:-1.25},{x:2,y:-1.25}]
        ,cb);
BasisScene.Init();
function animateTransB(){
  window.requestAnimationFrame(animateTransB);
  ctx1.clearRect(0, 0, cb.width, cb.height);
  BasisScene.Display();
  BasisScene.Interact();
  BasisScene.UpdateText(document.getElementById("BasisMatrixText"));
}
//animateTransB()
