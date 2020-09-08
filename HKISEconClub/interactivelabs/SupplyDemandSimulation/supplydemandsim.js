// const { createGzip } = require("zlib");

console.log("HEllO economy");
var c = document.getElementById("testingCanvas");
console.log(c);
var ctx = c.getContext("2d");

function mouseRelative(c){
    return new Vector2(mouse.x-c.getBoundingClientRect().x,mouse.y-c.getBoundingClientRect().y);
}
function XOR(a,b) {
    return ( a || b ) && !( a && b );
}
function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
function lerp(a,b,amt){
    return a*(1-amt)+b*amt;
}
function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    if(width<0){
        x+=width;
        width=-width;
    }
    if(height<0){
        y+=height;
        height=-height;
    }
    if (typeof stroke === 'undefined') {
      stroke = false;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
  }
class Vector2{
    constructor(x,y) {
        this.x=x;
        this.y=y;
    }
    add(vect){
        return new Vector2(this.x+vect.x,this.y+vect.y);
    }
    lerpto(vect,amt){
        return new Vector2(this.x*(1-amt)+vect.x*amt,this.y*(1-amt)+vect.y*amt);
    }
}

var mouse=new Vector2(0,0);
let handleMousemove = (event) => {
    mouse=new Vector2(event.x,event.y);
};
document.addEventListener('mousemove', handleMousemove);
class Color{
    constructor(red,green,blue,alpha) {
        this.r=red;
        this.g=green;
        this.b=blue;
        this.a=1;
        if(alpha!=null){
            this.a=alpha;
        }
    }
    changeBrightness(amount){
        if(amount>0){
            return new Color(lerp(this.r,255,amount),lerp(this.g,255,amount),lerp(this.b,255,amount),this.a);
        }else{
            return new Color(lerp(this.r,0,-amount),lerp(this.g,0,-amount),lerp(this.b,0,-amount),this.a);
        }
        
    }
    getString(){
        return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")"
    }

}
class Item{
    constructor(holdingBlob){
        this.index= holdingBlob.holding.length;
        this.holdingBlob= holdingBlob;
        this.holdingBlob.holding.push(this);
        this.targetPos= holdingBlob.getHoldingPos(this.index);
        this.pos=this.targetPos;
        this.targetAngle= holdingBlob.getHoldingAngle(this.index);
        this.angle=this.targetAngle;
        this.eatAmount=1;// 1 = not eaten, 0 fully eaten
    }
    update(){
        this.index=this.holdingBlob.holding.indexOf(this);
        if(this.index!=null){
            this.targetPos=this.holdingBlob.getHoldingPos(this.index);
            this.pos=this.pos.lerpto(this.targetPos,0.1);
            this.targetAngle= this.holdingBlob.getHoldingAngle(this.index);
            this.angle=lerp(this.angle,this.targetAngle,0.03);
        }
    }
    draw(ctx){
        if(this.index==null){
            return;
        }
        ctx.save();
        ctx.lineWidth=3;
        if(this.eatAmount>0) {
            ctx.translate(this.pos.x, this.pos.y);
            ctx.rotate(this.angle);

            ctx.beginPath();
            ctx.fillStyle = "rgb(255,175,129)"
            ctx.strokeStyle = "rgb(146,100,73)"
            {
                let scaley = 1;
                if (this.eatAmount < 0.5) {
                    scaley = this.eatAmount * 2;
                }
                ctx.rect(-1.5, 20 * (1 - scaley), 4, 29 * scaley);
            }

            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.fillStyle = "rgb(243,57,57)";
            ctx.strokeStyle = "rgb(248,86,86)";
            if (this.eatAmount > 0.5) {
                var scalex = (this.eatAmount - 0.5) * 2;
                ctx.ellipse(0, 0, 9 * scalex, 9, 0, 0, Math.PI * 2, true);
                ctx.ellipse(0, 0, 10 * scalex, 3, 0, 0, Math.PI * 2, true);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        }
        // print("HELLO THERE");
    }
}
const facing= {
    LEFT: "left",
    RIGHT: "right"
}
function BlobCharacter(posx,posy,fill,stroke){
    this.pos= new Vector2(posx,posy);
    this.targetPos= new Vector2(posx,posy);
    this.targetBlob;
    this.fillcolor= fill;
    this.strokecolor= stroke;
    this.headtilt=0;
    this.blink=1;
    this.blinktimer=0;
    this.blinkspeed=1;
    this.holding=[];
    this.facing= facing.LEFT;
    this.eating=false;
    this.eatTimer=0;
    this.tradeSchedule=[];
}
BlobCharacter.prototype.update= function(){
    this.pos= this.pos.lerpto(this.targetPos,0.1);
    this.blinktimer+=this.blinkspeed*0.02;
    if(this.blinktimer>1){
        this.blinktimer=0;
        this.blinkspeed=(Math.random()+0.1)/(1+0.1);
    }
    var blinkflux= clamp((1-this.blinktimer)*12,0,1);
    if(blinkflux>1){
        this.blink=1;
    }else{
        this.blink=1-Math.sin(blinkflux*Math.PI);
    }
    if(this.eating){
        if(this.holding.length>0){
            this.holding[0].eatAmount-=0.035;
        }
        this.eatTimer+=0.5;
    }
    if(this.holding.length==0){
        this.eating=false;
    }

    this.holding.forEach(element=>element.update());
    this.holding=this.holding.filter(item=>(item.eatAmount>0));
    // if(blinkflux>1){
    //     this.blink=1;
    // }else if(blinkflux>0.5){
    //     this.blink= (blinkflux-0.5)*2
    // }else{
    //     this.blink= (0.5-blinkflux)*2;
    // }
}
Object.defineProperty(BlobCharacter.prototype,"numItems",{
    get: function(){
        return this.holding.length;
    },
})
BlobCharacter.prototype.drawBlob= function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth=4;
    // var fillcolor=new Color(71, 123, 209);//"rgb(71, 123, 209)"
    // var strokecolor= new Color(188,211,255)//"rgb(188,211,255)"
    // var fillcolor=new Color(250, 152, 70);//"rgb(250,154,70)"
    // var strokecolor= new Color(241,205,171);//"rgb(241,205,171)"
    ctx.fillStyle=this.fillcolor.getString();
    ctx.strokeStyle=this.strokecolor.getString();
    ctx.translate(this.pos.x,this.pos.y-63-28);

    ctx.ellipse(0,63,31,28,0,0,Math.PI*2,true);
    ctx.translate(0,50);
    ctx.rotate(this.headtilt*0.3);
    ctx.ellipse(0,0,26,40,0,0,Math.PI*2,true);
    ctx.closePath()
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle="rgb(0, 0, 0)";

    ctx.ellipse(-10,-16,4,4*this.blink,0,0,Math.PI*2,true);
    ctx.ellipse(10,-16,4,4*this.blink,0,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
    if(this.eating){
        ctx.beginPath();
        ctx.ellipse(0,-3,10,5*(Math.sin(this.eatTimer)+1)/2,0,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }


    ctx.restore();
    this.holding.forEach(element=>element.draw(ctx));
    // for(var i=0;i<this.holding.length;i++){
    //     this.holding[i].draw(ctx);
    // }
}

BlobCharacter.prototype.getHoldingPos= function (index){
    var distx=40;
    var disty=34-63-28;
    if(this.eating){
        distx=2;
        disty=46-63-28;
    }
    if(this.facing==facing.RIGHT) {
        return this.pos.add(new Vector2(distx + index * 15 + Math.random() * 4, disty + (!this.eating ? (this.headtilt * 12 * (1 + index * 0.1) + Math.random() * 4):0)));
    }else{
        return this.pos.add(new Vector2(-distx - index * 15 + Math.random() * 4, disty - (!this.eating ? (this.headtilt * 12 * (1 + index * 0.1) + Math.random() * 4):0)));
    }
}
BlobCharacter.prototype.getHoldingAngle= function(index){
    var faceRight=this.facing==facing.RIGHT;
    if(XOR(faceRight,this.eating)) {
        return 0.3 + index * 0.03 + this.headtilt * 0.04 + Math.random() * 0.01;
    } else {
        return -0.3 - index * 0.03 + this.headtilt * 0.04 - Math.random() * 0.01;
    }
}
BlobCharacter.prototype.makeItems= function(number){
    for(var i=0; i<number;i++){
        new Item(this);
    }
}
BlobCharacter.prototype.giveItemTo= function(blob,amt){
    count =1;
    if(amt!=null){
        count= amt;
    }
    for(var i=0;i<count;i++){
        if(this.holding.length>0){
            var item = this.holding.pop();
            item.holdingBlob=blob;
            item.index=blob.holding.length;
            blob.holding.push(item);
        }
    }
}
BlobCharacter.prototype.moveTo= function(blob){
    var displacement= new Vector2(-400,0);
    if(this.facing= facing.LEFT){
        displacement= new Vector2(-displacement.x,displacement.y);
    }
    this.targetPos=blob.pos.add(displacement);
}

function SellerBlobCharacter(posx,posy,numItems){
    BlobCharacter.call(this,posx,posy,new Color(71, 123, 209), new Color(188,211,255));
    this.numItems=numItems;
    this.initialNumItems=numItems;
    this.facing=facing.RIGHT;
    this.makeItems(numItems);
    this.supplySchedule= [{price:10,quantity:1},{price:20,quantity:2},{price:30,quantity:3}]
    this.maxQuantity=3;
    this._sellingPrice=35;
    this.netSupplyingQuantity= this.calculateQuantity();
}
SellerBlobCharacter.prototype=Object.create(BlobCharacter.prototype);
Object.defineProperty(SellerBlobCharacter.prototype,"sellingPrice",{
    get: function(){
        return this._sellingPrice;
    },
    set: function sellingPrice(price){
        this._sellingPrice=price;
        this.netSupplyingQuantity= this.calculateQuantity();
    }
})
Object.defineProperty(SellerBlobCharacter.prototype,"numItemsSold",{
    get: function(){
        return this.initialNumItems-this.numItems;
    },
})
Object.defineProperty(SellerBlobCharacter.prototype,"supplyingQuantity",{
    get: function(){
        return this.netSupplyingQuantity-this.numItemsSold;
    },
})
SellerBlobCharacter.prototype.drawBlob= function(ctx){
    this.drawSchedule(ctx);
    BlobCharacter.prototype.drawBlob.call(this,ctx);
    roundedRect(ctx,10,200,100,-100,{tl:20});
}
SellerBlobCharacter.prototype.drawSchedule= function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth=2;
    var bufferrad=12;
    var bottomSpace=20;
    var barSpacingWidth=25;
    var barWidth=22;

    var position= this.pos.add(new Vector2(110,0));
    ctx.translate(position.x,position.y);
    ctx.strokeStyle=this.strokecolor.getString();
    ctx.fillStyle=this.fillcolor.changeBrightness(0.8).getString();
    var topSpace=80
    roundedRect(ctx,-bufferrad,bufferrad+bottomSpace,barSpacingWidth*this.maxQuantity+2*bufferrad,-2*bufferrad-topSpace-bottomSpace,bufferrad);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle=this.fillcolor.changeBrightness(-0.1).getString();
    ctx.moveTo(-bufferrad,0);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad,0);
    ctx.closePath();
    ctx.stroke();
    
    ctx.lineWidth=0;
    this.supplySchedule.forEach((bar)=>{
        roundedRect(ctx,(bar.quantity-1)*barSpacingWidth,0,barWidth,-bar.price*2,{tl:4,tr:4},true);
    })
    ctx.strokeStyle=ctx.fillStyle=this.fillcolor.changeBrightness(-0.8).getString();
    ctx.beginPath();
    ctx.moveTo(-bufferrad,-this.sellingPrice*2+4);
    ctx.lineTo(-bufferrad+8,-this.sellingPrice*2);
    ctx.lineTo(-bufferrad,-this.sellingPrice*2-4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(barSpacingWidth*this.maxQuantity+bufferrad,-this.sellingPrice*2+4);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad-8,-this.sellingPrice*2);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad,-this.sellingPrice*2-4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-bufferrad+3,-this.sellingPrice*2);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad-3,-this.sellingPrice*2);
    ctx.closePath();
    ctx.stroke();
    ctx.font = "18px Montserrat";
    ctx.fillText(this.sellingPrice+"$",-bufferrad+8,-this.sellingPrice*2-3);

    if(this.netSupplyingQuantity>0){
        ctx.beginPath();
        ctx.moveTo((this.netSupplyingQuantity-1)*barSpacingWidth+barWidth/2,0);
        ctx.lineTo((this.netSupplyingQuantity-1)*barSpacingWidth+barWidth/2+7,7);
        ctx.lineTo((this.netSupplyingQuantity-1)*barSpacingWidth+barWidth/2-7,7);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillText("Selling "+this.supplyingQuantity,-bufferrad+8,+bottomSpace+bufferrad-7);
    // ctx.fill();
    ctx.restore();
}
SellerBlobCharacter.prototype.calculateQuantity= function(){
    for(var q=this.maxQuantity;q>=0;q--){
        if(q==0){
            return 0;
        }else{
            if(this.supplySchedule.length>=q){
                if(this.supplySchedule[q-1].price<=this.sellingPrice){
                    return q;
                }
            }
        }
       
    }
}
SellerBlobCharacter.prototype.updatePrice= function(){
    var numberOfPriceIncreasingTrades=0;
    var numberOfPriceDecreasingTrades=0;
    this.tradeSchedule.forEach(trade => {
        if(!trade.traded){
            numberOfPriceDecreasingTrades++;
        }else{
            // f(trade.sellingQuantity>trade.buyingQuantity){
            //     // numberOfPriceDecreasingTrades++;
            // }else 
            if(trade.sellingQuantity<=trade.buyingQuantity){
                numberOfPriceIncreasingTrades++;
            }
        }
    })
    if(numberOfPriceIncreasingTrades>numberOfPriceDecreasingTrades){
        this.sellingPrice++;
    }else if(numberOfPriceIncreasingTrades<numberOfPriceDecreasingTrades){
        this.sellingPrice--;
    }
}
SellerBlobCharacter.prototype.reset= function(){
    this.holding=[];
    this.tradeSchedule=[];
    this.makeItems(this.initialNumItems);
}
function BuyerBlobCharacter(posx,posy){
    BlobCharacter.call(this,posx,posy,new Color(250, 152, 70), new Color(241,205,171))
    this.facing=facing.LEFT;
    this.demandSchedule= [{price:35,quantity:1},{price:25,quantity:2},{price:5,quantity:3}]
    this.maxQuantity=3;
    this._buyingPrice=35;
    this.netBuyingQuantity= this.calculateQuantity();
}
BuyerBlobCharacter.prototype=Object.create(BlobCharacter.prototype);
Object.defineProperty(BuyerBlobCharacter.prototype,"buyingPrice",{
    get: function(){
        return this._buyingPrice;
    },
    set: function(price){
        this._buyingPrice=price;
        this.netBuyingQuantity= this.calculateQuantity();
    }
})
Object.defineProperty(BuyerBlobCharacter.prototype,"buyingQuantity",{
    get: function(){
        return this.netBuyingQuantity-this.numItems;
    },
})

BuyerBlobCharacter.prototype.calculateQuantity= function(){
    for(var q=0;q<this.maxQuantity;q++){
       if(this.demandSchedule[q].price<this.buyingPrice){
           return q;
       }
    }
    return this.maxQuantity;
}
BuyerBlobCharacter.prototype.drawBlob= function(ctx){
    this.drawSchedule(ctx);
    BlobCharacter.prototype.drawBlob.call(this,ctx);
    roundedRect(ctx,10,200,100,-100,{tl:20});
}
BuyerBlobCharacter.prototype.drawSchedule= function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth=2;
    var bufferrad=12;
    var bottomSpace=20;
    var barSpacingWidth=25;
    var barWidth=22;
    var totalWidth=2*bufferrad+barSpacingWidth*this.maxQuantity;
    
    var position= this.pos.add(new Vector2(-110-totalWidth+30,0));
    ctx.translate(position.x,position.y);
    ctx.strokeStyle=this.strokecolor.getString();
    ctx.fillStyle=this.fillcolor.changeBrightness(0.8).getString();
    var topSpace=80
    roundedRect(ctx,-bufferrad,bufferrad+bottomSpace,barSpacingWidth*this.maxQuantity+2*bufferrad,-2*bufferrad-topSpace-bottomSpace,bufferrad);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle=this.fillcolor.changeBrightness(-0.1).getString();
    ctx.moveTo(-bufferrad,0);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad,0);
    ctx.closePath();
    ctx.stroke();
    
    ctx.lineWidth=0;
    this.demandSchedule.forEach((bar)=>{
        roundedRect(ctx,(bar.quantity-1)*barSpacingWidth,0,barWidth,-bar.price*2,{tl:4,tr:4},true);
    })
    ctx.strokeStyle=ctx.fillStyle=this.fillcolor.changeBrightness(-0.8).getString();
    ctx.beginPath();
    ctx.moveTo(-bufferrad,-this.buyingPrice*2+4);
    ctx.lineTo(-bufferrad+8,-this.buyingPrice*2);
    ctx.lineTo(-bufferrad,-this.buyingPrice*2-4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(barSpacingWidth*this.maxQuantity+bufferrad,-this.buyingPrice*2+4);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad-8,-this.buyingPrice*2);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad,-this.buyingPrice*2-4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-bufferrad+3,-this.buyingPrice*2);
    ctx.lineTo(barSpacingWidth*this.maxQuantity+bufferrad-3,-this.buyingPrice*2);
    ctx.closePath();
    ctx.stroke();
    ctx.font = "18px Montserrat";
    ctx.fillText(this.buyingPrice+"$",-bufferrad+8,-this.buyingPrice*2-3);

    if(this.netBuyingQuantity>0){
        ctx.beginPath();
        ctx.moveTo((this.netBuyingQuantity-1)*barSpacingWidth+barWidth/2,0);
        ctx.lineTo((this.netBuyingQuantity-1)*barSpacingWidth+barWidth/2+7,7);
        ctx.lineTo((this.netBuyingQuantity-1)*barSpacingWidth+barWidth/2-7,7);
        ctx.closePath();
        ctx.fill();
    }
    ctx.fillText("Buying "+this.buyingQuantity,-bufferrad+8,+bottomSpace+bufferrad-7);
    // ctx.fill();
    ctx.restore();
}
BuyerBlobCharacter.prototype.attemptPurchace= function(sellerBlob){
    if(!sellerBlob instanceof SellerBlobCharacter){
        return;
    }
    var blobstraded= true;
    if(sellerBlob.sellingPrice>this.buyingPrice){blobstraded=false;}
    var numSold=Math.min(sellerBlob.supplyingQuantity,this.buyingQuantity);
    if(numSold==0){ blobstraded= false;}
    var tradehistory= {traded: blobstraded,priceDifference:this.buyingPrice-sellerBlob.sellingPrice,sellingQuantity:sellerBlob.supplyingQuantity,buyingQuantity:this.buyingQuantity};
    sellerBlob.tradeSchedule.push(tradehistory);
    this.tradeSchedule.push(tradehistory);
    if(!blobstraded){
        return tradehistory;
    }
    sellerBlob.giveItemTo(this,numSold);
    return tradehistory;
}

BuyerBlobCharacter.prototype.updatePrice= function(){
    var numberOfPriceIncreasingTrades=0;
    var numberOfPriceDecreasingTrades=0;
    this.tradeSchedule.forEach(trade => {
        if(!trade.traded){
            numberOfPriceIncreasingTrades++;
        }else{
            if(trade.sellingQuantity>=trade.buyingQuantity){
                numberOfPriceDecreasingTrades++;
            }
            // else if(trade.sellingQuantity<trade.buyingQuantity){
            //     // numberOfPriceIncreasingTrades++;
            // }
        }
        // numberOfPriceDecreasingTrades++;
        
    })
    if(numberOfPriceIncreasingTrades>numberOfPriceDecreasingTrades){
        this.buyingPrice++;
    }else if(numberOfPriceIncreasingTrades<numberOfPriceDecreasingTrades){
        this.buyingPrice--;
    }
}
BuyerBlobCharacter.prototype.reset= function(){
    this.holding=[];
    this.eating=false;
    this.tradeSchedule=[];
}

var blueBlob= new SellerBlobCharacter(100,100,3)
blueBlob.facing=facing.RIGHT;
// var newItem2= new Item(blueBlob);
// var newItem3= new Item(blueBlob);
var orangeBlob= new BuyerBlobCharacter(600,100);
orangeBlob.buyingPrice=3;
var purpleBlob= new BlobCharacter(700,100,new Color(137, 50, 219), new Color(209, 161, 255));

function resetBlobs(){
    blueBlob.reset();
    orangeBlob.reset();
}
function updatePrices(){
    blueBlob.updatePrice();
    orangeBlob.updatePrice();
}
var step = function(){
    orangeBlob.attemptPurchace(blueBlob);
    updatePrices();
    resetBlobs();
}

var frameCount=0;
var framestepamnt=30;
var state;
orangeBlob.moveTo(blueBlob);
function draw(){
    
    switch(frameCount%(framestepamnt*4)){
        case 0:
            orangeBlob.attemptPurchace(blueBlob);
            state= "Attempting purchase";
            break;
        case framestepamnt*1:
            updatePrices();
            state= "Updating prices";
            break;
        case framestepamnt*2:
            orangeBlob.eating=true;
            state= "Resetting market"
            break;
        case framestepamnt*3:
            resetBlobs();
            break;
    }
    frameCount++;


    window.requestAnimationFrame(draw);
    var mousePos=mouseRelative(c);
    // var angletwoards= Math.atan2(mousePos.y-blueBlob.pos.y,(mousePos.x-blueBlob.pos.x)/2);
    // blueBlob.headtilt=Math.sin(angletwoards*2);
    blueBlob.headtilt=clamp((mousePos.x-100)/100,-1,1);
    blueBlob.update();
    // blueBlob.blink=clamp (mousePos.y-300/200,0.1,1);
    orangeBlob.headtilt=clamp((mousePos.x-orangeBlob.pos.x)/200,-1,1);
    orangeBlob.update();

    purpleBlob.headtilt=clamp((mousePos.x-700)/200,-1,1);
    purpleBlob.update();
    // orangeBlob.blink=clamp (mousePos.y-300/200,0.1,1);

    ctx.resetTransform();
    ctx.clearRect(0, 0, c.width, c.height);
    blueBlob.drawBlob(ctx);
    // if(mousePos.x>blueBlob.pos.x){
    //     blueBlob.facing=facing.RIGHT;
    // }else{
    //     blueBlob.facing=facing.LEFT;
    // }

    orangeBlob.drawBlob(ctx)
    purpleBlob.drawBlob(ctx)
    ctx.font="18px Montserrat";
    ctx.textAlign = 'center';
    ctx.fillText(state,300,170);
    ctx.textAlign = 'left';
    // step();
    // newItem.draw(ctx);
    // ctx.save();
    // ctx.beginPath();
    // ctx.lineWidth=4;
    // // var fillcolor=new Color(71, 123, 209);//"rgb(71, 123, 209)"
    // // var strokecolor= new Color(188,211,255)//"rgb(188,211,255)"
    // var fillcolor=new Color(250, 152, 70);//"rgb(250,154,70)"
    // var strokecolor= new Color(241,205,171);//"rgb(241,205,171)"
    // ctx.fillStyle=fillcolor.getString();
    // ctx.strokeStyle=strokecolor.getString();
    // ctx.translate(100,100);
    //
    // var headtilt= clamp((mousePos.x-100)/100,-1,1);
    // ctx.ellipse(0,63,31,28,0,0,Math.PI*2,true);
    // ctx.translate(0,50);
    // ctx.rotate(headtilt*0.3);
    // ctx.ellipse(0,0,26,40,0,0,Math.PI*2,true);
    // ctx.closePath()
    // ctx.stroke();
    // ctx.fill();
    // ctx.beginPath();
    // ctx.fillStyle="rgb(0, 0, 0)";
    //
    // var blink= clamp (mousePos.y-300/200,0.1,1);
    // ctx.ellipse(-10,-16,4,4*blink,0,0,Math.PI*2,true);
    // ctx.ellipse(10,-16,4,4*blink,0,0,Math.PI*2,true);
    // ctx.closePath();
    // ctx.fill();

    ctx.restore();
}
draw();
