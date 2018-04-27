var tangle = new Tangle (document.getElementById("Matrix"), {
    initialize: function () {
        this.height = 3;
        this.width=5;
    },
    update: function () {
      var S="http://latex.codecogs.com/gif.latex?\\large \\begin{bmatrix}"
      var I=["x","y","z","w","v"];
      var O=["a","b","c","d","e"];
      for(var i=0; i<this.width; i++){
        for(var j=0; j<this.height-1; j++){
          S+=O[i]+"_{"+(j+1)+"}&"
        }
        S+=" "+O[i]+"_{"+this.height+"}\\\\ "
      }
      S+=" \\end{bmatrix}"
      S+="\\times"
      S+="\\begin{bmatrix}"
      for(var i=0; i<this.height-1; i++){
        S+=" "
        S+=I[i]
        S+="\\\\"
      }
      S+=I[this.height-1]+"\\end{bmatrix}"
      S+="="
      S+="\\begin{bmatrix}"
      for(var i=0; i<this.width; i++){
        for(var j=0; j<this.height; j++){
          S+=I[j]+O[i]+"_{"+(j+1)+"}"
          if(j!=this.height-1){
            S+=" +"
          }
        }
        S+="\\\\"
      }
      S+=" \\end{bmatrix}"
      document.getElementById("MatrixEx").src= S;
    }
});
var tangle2 = new Tangle (document.getElementById("rotMat"), {
    initialize: function () {
        this.angle = 360-45;
    },
    update: function () {
      var S="http://latex.codecogs.com/gif.latex?\\Large"
      S+=LatexMat(
        [["\\cos("+this.angle+"^\\circ)","-\\sin("+this.angle+"^\\circ)"],
        ["\\sin("+this.angle+"^\\circ)","\\cos("+this.angle+"^\\circ)"]])
      S+="="
      S+=LatexMat(
        [[Math.cos(toRad(this.angle)).toFixed(2),Math.sin(toRad(-this.angle)).toFixed(2)],
        [Math.sin(toRad(this.angle)).toFixed(2),Math.cos(toRad(this.angle)).toFixed(2)]]
      )
      document.getElementById("AngleMatrixEx").src=S;
    }
});
function toRad(inp){
  return inp*Math.PI/180;
}
