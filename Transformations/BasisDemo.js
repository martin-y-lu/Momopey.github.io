var cb=document.getElementById("MatrixBasis");
var ctx1=cb.getContext("2d");
var BasisScene=new Scene([[1,1],
                       [-1,1]]
        ,[{x:0,y:0},{x:2,y:2},{x:-2,y:2},{x:0,y:-2},{x:1,y:-1.75},{x:-1,y:-1.75},{x:-2,y:-1.25},{x:2,y:-1.25}]
        ,cb);
BasisScene.Init();
function animateTransB(){
  window.requestAnimationFrame(animateTransB);
  BasisScene.Interact();
  BasisScene.BasisInteract();
  ctx1.clearRect(0, 0, cb.width, cb.height);
  BasisScene.DrawBasisGraph();
  ctx1.clearRect(0, 0, cb.width/2, cb.height);
  BasisScene.Display();
  DrawGraph2("rgb(200,200,200)",ctx1);
  BasisScene.DrawSelection();
  BasisScene.DrawBasisVectors();
  BasisScene.DrawBasisSelectors();
  BasisScene.DrawBasisSelection();
  BasisScene.DrawPoints();
  BasisScene.UpdateText(document.getElementById("BasisMatrixText"));
}
animateTransB()
