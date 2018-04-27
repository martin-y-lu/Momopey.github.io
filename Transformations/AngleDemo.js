var cc=document.getElementById("MatrixAngle");
var ctx2=cc.getContext("2d");
var AngleScene=new Scene([[1,1],
                       [-1,1]]
        ,[{x:0,y:0},{x:2,y:2},{x:-2,y:2},{x:0,y:-2},{x:1,y:-1.75},{x:-1,y:-1.75},{x:-2,y:-1.25},{x:2,y:-1.25}]
        ,cc);
AngleScene.Init();
function animateTransC(){
  window.requestAnimationFrame(animateTransC);
  AngleScene.Mat=
  [[Math.cos(toRad(tangle2.getValue("angle"))),Math.sin(toRad(-tangle2.getValue("angle")))],
  [Math.sin(toRad(tangle2.getValue("angle"))),Math.cos(toRad(tangle2.getValue("angle")))]];

  AngleScene.Interact();
  ctx2.clearRect(0, 0, cb.width, cb.height);
  AngleScene.DrawBasisGraph();
  ctx2.clearRect(0, 0, cb.width/2, cb.height);
  AngleScene.Display();
  DrawGraph2("rgb(200,200,200)",ctx2);
  AngleScene.DrawSelection();
  AngleScene.DrawBasisVectors();
  AngleScene.DrawBasisSelection();
  AngleScene.DrawPoints();
  AngleScene.UpdateText(document.getElementById("AngleMatrixText"));
}
animateTransC()
