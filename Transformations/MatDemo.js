var ca=document.getElementById("Matrix2d");
var ctx=ca.getContext("2d");
var MatScene=new Scene([[1,1],
                       [-1,1]]
        ,[{x:0,y:0},{x:2,y:2},{x:-2,y:2},{x:0,y:-2},{x:1,y:-1.75},{x:-1,y:-1.75},{x:-2,y:-1.25},{x:2,y:-1.25}]
        ,ca);
MatScene.Init();
function animateTransA(){
  window.requestAnimationFrame(animateTransA);
  ctx.clearRect(0, 0, ca.width, ca.height);
  MatScene.Display();
  MatScene.Interact();
  MatScene.UpdateText(document.getElementById("2dMatrixText"));

}

animateTransA()
