// JS setup functions
/////-----------

var MousePress=new Hold();
var MouseClick=new Hold();
function animateCore(){
    MousePress.Calc(mousePress&&MousePress.H===false,mousePress===false);
    MouseClick.Calc(mousePress&&MousePress.H===false,MousePress.H);
    MousePress.Store();
    MouseClick.Store();

    requestAnimationFrame(animateCore);
    animateSystem();
    animatePa();
}
animateCore();
