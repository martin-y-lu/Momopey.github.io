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
