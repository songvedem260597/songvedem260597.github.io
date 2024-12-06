/*--Slide --*/
var counter = 1;
setInterval(function(){
    document.getElementById('item-' + counter).checked = true ;
    counter ++;
    if(counter > 3){
        counter = 1;
    }
},4000);
