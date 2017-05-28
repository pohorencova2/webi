var state = true;
var repeat=true;
var start;

var end=false;
var error;
var last;
var scanCheck=false;
var syntax = [];
var diag;
var flipSavePos;
var flipOrder = [];
var flipON;
var flipPos;
var on_off = 0;




var diagrams = [];



function stringValue(){
    //console.log("function stringValue");
    if (token[0] == "'"){
        if (token[token.length-1] == "'"){
            return true;
        }
        return false;
    }
    else if (token[0] == '"'){
        if (token[token.length-1] == '"'){
            return true;
        }
         return false;
    }
    else{
         return false;
    }
}

function digits(check){  
    //console.log("digits");
    if (check == undefined){
       return !isNaN(token);  
    }
    else{
        return !isNaN(check); 
    }   
    
}

function isLetter(check) {
         if (check.match(regex)){
             return true;    
         } 
         else{
             return false;
         }  
    }

function lowerChar(char){
    return (/[a-z]/.test(char));
    
}
function upperChar(char){
    return (/[A-Z]/.test(char));    
}

function name(){
    ////console.log("name",token);
     var result = true;
    if (!upperChar(token[0])){ //does not start with lower-case
        return false;
    }
   
    for (var i=0;i<token.length;i++){
        if (!isLetter(token[i])){
            break;
        }
    }
    for (var j=i;j<token.length;j++){
        if (!digit(token[j])){                   
            result=false;
            break;
        }        
    }     
    return result;
    
}



function methodName(){ 
    ////console.log("methodname",token);
    var result = true;
    if (!lowerChar(token[0])){ //does not start with upper-case
        return false;
    }
   
    for (var i=0;i<token.length;i++){
        if (!isLetter(token[i])){
            break;
        }
    }
    
    for (var j=i;j<token.length;j++){
        if (!digit(token[j])){                   
            result=false;
            break;
        }        
    }     
    return result;   
}
    
function varName(){   //all upper-case letters, digits can be as sufix
    ////console.log("varname",token);
    var result = true;
    for (var i=0;i<token.length;i++){
        if (!upperChar(token[i])){            
            break;
        }
    }    
    if (i==0){       //does not start with upper-case
        result = false;
    }
    else{              
        for (var j=i;j<token.length;j++){
             if (!digits(token[j])){                   
                result=false;                 
                break;
            }        
        }
    }
   
    return result; 
}



function printWebiTree(res){
    
    for (var i=0;i<res.RESULT.length;i++){
        if (typeof res.RESULT[i] == "object"){
            //console.log(res.RESULT[i].NAME);
            printWebiTree(res.RESULT[i]);
        }
        else{
            //console.log(res.RESULT[i]);
        }
    }
    
    
    
}
var input;            
var regex=/^[a-zA-Z]+$/;  //used in isLetter
var character="";
var index;
var token = "";
var position; 
     

function initParse(source){          
       var getInput = source.replace(/\n/g, " ").replace(/\r/g, " "); //remove all new lines         
       input = getInput.replace(/\t/g, " ");    //remove tabs
       ////console.log(getInput);
       diag = documentCode;
       /*index=0;
       next();
       scan();*/
        
    }

function parse() {
    
    ////console.log("parser start"); 
    diagrams = [];
    index=0;
    next();
    scan();      
    var result = Syntaxdiagram(diag);
    var first = diag.NAME;
   // //console.log("PARSER ENDS",result);
    if (result==true){
        ////console.log(first);
       
        printWebiTree(diagrams[0]);
        ////console.log(diagrams);
    }
    else{
       // //console.log("error: ",error);
    }   
    

   // //console.log("zvysilo sa od",token);
  //  //console.log("flipOrder",flipOrder);
   }
       
    
function back(){
    index = start;   
    next()
    scan();   
     
}

function canScan(){
    if (scanCheck==false){
       
        scan();
        scanCheck = true;
     }
    else{
        scanCheck = false;
    }    
    ////console.log(scanCheck);
}



var pos;
var diagram;
var curpos;
var curdir;
var output="";




 







/*function find_corresponding(pos,dir){
    
    
        
    if (flipOrder[pos] == "FLIPON" || flipOrder[pos] == "FLIPOFF"){
    
    if (flipOrder[pos] == "FLIPON"){
        on_off += 1;
        if (on_off == 0){
           
            return pos;
        } 
        
        
        else{
            pos += dir;
        while (flipOrder[pos] != "FLIPOFF" && flipOrder[pos] != "FLIPON"){           
            pos += dir;                      
        }       
       
        return find_corresponding(pos,dir);}
    }
    
    else if (flipOrder[pos] == "FLIPOFF"){
        on_off -= 1;
         if (on_off == 0){
             
            return pos;
        } 
       
       
        else{
             pos += dir;
        while (flipOrder[pos] != "FLIPOFF" && flipOrder[pos] != "FLIPON"){
            pos += dir;                      
        }       
       
        return find_corresponding(pos,dir);}
    }
    
    }
    
    else{
        if (flipOrder[pos] == "PROTECTON"){
        on_off += 1;
        if (on_off == 0){
            
            return pos;
        } 
        
        
        else{
            pos += dir;
        while (flipOrder[pos] != "PROTECTOFF" && flipOrder[pos] != "PROTECTON"){           
            pos += dir;                      
        }       
       
        return find_corresponding(pos,dir);}
    }
    
    else if (flipOrder[pos] == "PROTECTOFF"){
        on_off -= 1;
         if (on_off == 0){
            
            return pos;
        } 
       
       
        else{
             pos += dir;
        while (flipOrder[pos] != "PROTECTOFF" && flipOrder[pos] != "PROTECTON"){
            pos += dir;                      
        }       
       
        return find_corresponding(pos,dir);}
    }
        
    }
    
   
    
}*/



function find_corresponding(pos){
     if (flipOrder[pos] == "FLIPON"){
         dir = 1;
     }
    if (flipOrder[pos] == "PROTECTOFF"){
         dir = -1;
     }
    
    
    
    on_off == 0;
    do {
        if (flipOrder[pos] == "FLIPON" || flipOrder[pos] == "PROTECTON"){
            on_off+=1;
        }
        else if (flipOrder[pos] == "FLIPOFF" || flipOrder[pos] == "PROTECTOFF"){
            on_off-=1;
        }
        pos += dir; 
    } while ( on_off != 0)  
    
    pos -= dir;
    return pos;
}

var visited = [];

function flip(){
    ////console.log("flip zacinam",flipOrder);
    output = "";
    var top = flipOrder.length-1;
    
    var ok = false;
    curpos = 0;
    curdir = 1;
    while (curpos <= top ){      
       
        if (flipOrder[curpos] == "FLIPON" || flipOrder[curpos] == "FLIPOFF" || flipOrder[curpos] == "PROTECTON" || flipOrder[curpos] == "PROTECTOFF"){    
            
            curpos = find_corresponding(curpos);     
            curdir *= -1;           
            curpos += curdir; 
            
        }
        else{
            output += flipOrder[curpos];          
            curpos += curdir; 
            
        }
    }
    // //console.log("flip konci",output);
    return output; 
}

var flipped;
var on_off2=0;
var count = 0;

function Syntaxdiagram(diagram){  
    
    diagrams.push(Object.assign({}, diagram)); //copy of object  
    diagram = diagrams[diagrams.length-1];     
    diagram.RESULT = [];    
    diagram.START = -1;
    diagram.FLIP = 0;
    
    
    
    for (var key in diagram) {    
       
        switch (key.substring(0, key.length-1)){ 
            case "FLIP": 
                diagram.FLIP += 1;
                if (diagram[key] == "ON"){  
                    ////console.log("FLIPON");                    
                    flipOrder.push("FLIPON");
                    on_off2 += 1;                                     
                    flipON = true;             
                }
                else{                   
                    flipOrder.push("FLIPOFF");
                   // //console.log("FLIPOFF");
                    on_off2 -= 1;
                    
                    if (on_off2 == 0){   
                        ////console.log("count",count);
                        var newInput = input.slice(0,diagram.START);   //diagram.START where flip starts
                        ////console.log("prva cast",newInput);
                        var reversed = flip();
                       // //console.log("reversed",reversed);
                        newInput += reversed;
                        ////console.log("za reserved",input.slice( diagram.START + reversed.lenght + 1,input.length));
                        ////console.log(diagram.START + reversed.lenght + 1);
                        var sum = diagram.START + reversed.length;
                        var start = diagram.START;
                        var space = 0;
                       // var where = 0;
                       // //console.log("zacal",diagram.START);
                        
                       for (var w=diagram.START;w<input.length;w++){
                            if (input[w] != " "){
                                start++;
                            }
                            else{
                                space++;                                
                            }
                            if (start == sum){
                                break;
                            }                     
                        }
                       // //console.log("w",w);
                        newInput += input.slice(w+1,input.length);
                       
                        
                        
                        
                      /* //console.log("sum",diagram.START + reversed.length);
                        
                        
                        newInput += input.slice( diagram.START + reversed.length,input.length); */
                       
                        
                        
                        
                      
                        
                        
                        /*var pomoc = flip();
                        //console.log("pomoc",pomoc);
                        newInput += pomoc;
                        
                        
                        if (input[position-1] == " "){
                            newInput += " ";                              
                        }
                        
                       
                        //console.log("position",position);
                         //console.log("index",index);
                        if (position == input.length-1){
                             //console.log("tu ssom bol");
                            newInput += input.slice(position+1,input.length); 
                            
                        }
                        else{
                           //console.log("druhy position",input.slice(position,input.length));
                           newInput += input.slice(position,input.length);  //position+1 where is end of string that was flipped in input
                            
                        }*/
                        
                     
                        
                        input = newInput;
                        ////console.log("newwwwwwwwwwwwwwww input",input); 
                        flipON = false; 
                        index = diagram.START;                        
                        next()
                        scan();   
                        ////console.log("flipOrder",flipOrder);
                        flipOrder = [];
                    }                 
                }
                break;
                
            case "PROTECT":  
                ////console.log(diagram[key]);
                
                diagram.FLIP += 1;
                if (diagram[key] == "ON"){  
                    flipOrder.push("PROTECTON");                                
                }
                else{                   
                    flipOrder.push("PROTECTOFF");                   
                }
                break;           
                
                
            case "TRYCHECK": 
                ////console.log("TRYCHECK s", token);                 
                 if (token == diagram[key]){
                     ////console.log("TRYCHECK true",token);
                     if (flipON){
                         diagram.FLIP += 1;
                         flipOrder.push(token);
                     }
                     else{
                         diagram.RESULT.push(token);  //generate code 
                     }
                                       
                     diagram.LAST = token; //for end
                     scan();
                     scanCheck = true;                     
                 }
                 else{
                     ////console.log("TRYCHECK false", token);
                 }  
                break;
            
            case "CHECK":
                 ////console.log("CHECK S",token);
                 ////console.log(diagram[key]);
                 if (diagram[key].indexOf(token) != -1){ 
                    // //console.log("CHECK true"); 
                      if (flipON){                          
                          diagram.FLIP += 1;
                          flipOrder.push(token);
                     }
                     else{
                         diagram.RESULT.push(token);  //generate code 
                     }                   
                     diagram.LAST = token; //for end                     
                     scan();
                     scanCheck = true;                                    
                 }
                 else{
                     //console.log("CHECK false");
                     state = false;                      
                 }                 
                 break; 
            
            case "JUMPFUNCTION":  
                 ////console.log("JUMPFUNSCION s",token);                 
                 if (eval(diagram[key]) == true){
                     ////console.log("JUMPFUNSCION true");
                     if (flipON){
                         diagram.FLIP += 1;
                         flipOrder.push(token);
                     }
                     else{
                         diagram.RESULT.push(token);  //generate code 
                     }                 
                     diagram.LAST = diagram[key]; //for end;
                     scan();
                     scanCheck = true;                                          
                 }
                 else {
                     //console.log("JUMPFUNSCION false");
                     state = false;            
                 }
                break;
            
            case "TRYJUMPREPEAT":                                
                 diagram.START = position;                   
                 repeat = true;
                 while(repeat){
                    
                     ////console.log("TRYJUMPREPEAT s",token); 
                     if (token == ""){ break;}                
                     
                     if (Syntaxdiagram(diagram[key]) == false){                        
                        // //console.log("TRYJUMPREPEAT IS FALSE");                        
                         index = diagram.START;   
                         next()
                         scan();
                         state = true;
                         repeat = false;
                         scanCheck = true;    
                     }
                     else{
                        ////console.log("TRYJUMPREPEAT IS TRUE"); 
                        if (!flipON){
                            diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code                                                         
                        }
                         else{
                         diagram.FLIP += 1;
                     }
                        diagrams.pop();
                        diagram.START = position; 
                        diagram.LAST = diagram[key]; //for end;
                        canScan();
                        repeat = true;
                         
                    }     
                      
                 }     
                  break; 
            
            case "TRYJUMP":
               
                 ////console.log("TRYJUMP s",token);
                 diagram.START = position;                            
                 if (Syntaxdiagram(diagram[key]) == false){                    
                        // //console.log("TRYJUMP IS FALSE");                         
                         state = true;
                         index = diagram.START;   
                         next()
                         scan(); 
                         
                         //flipOrder.pop();   //DOKONCIT
                 }
                 else{ 
                    // //console.log("TRYJUMP IS TRUE"); 
                     if (!flipON){                         
                        diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code                      
                     }
                     else{
                         diagram.FLIP += 1;
                     }
                     diagrams.pop();
                     diagram.LAST = diagram[key]; //for end;                            
                 }                  
                 break;
                
            case "JUMP": 
                 
                 diagram.START = position;                
                 for (var j = 0; j < diagram[key].length; j++){   
                    ////console.log("JUMP s ",token);
                     
                     if (typeof diagram[key][j] == "string"){   //jumpfunction
                        
                         if (eval(diagram[key][j]) == false){
                          //  //console.log("JUMPFUNCION v jump false s",token);
                            state = true;
                            //syntax.pop() //generate code
                            if (j == diagram[key].length-1){ //aj ak nie je poslednz tak chod back                             
                                state = false;
                            }  
                            index = diagram.START;   
                            next()
                            scan();
                        } 
                         else {
                             state = true;
                             ////console.log("JUMPFUNCION v jump true s",token);
                             if (flipON){
                                 diagram.FLIP += 1;                                 
                                 flipOrder.push(token);
                             }
                             else{
                                 diagram.RESULT.push(token);  //generate code 
                             }                                                 
                             diagram.LAST = diagram[key][j]; //for end;
                             scan();
                             scanCheck = true;                              
                             break;
                        }
                     }                     
                     else{
                          ////console.log("JUMP v jump s",token,"do",diagram[key][j]);
                         if (Syntaxdiagram(diagram[key][j]) == false){                             
                             ////console.log("JUMP v jump false s",token);  
                             state = true;                             
                             if (j == diagram[key].length-1){                                 
                                 state = false;
                             } 
                             index = diagram.START;   
                             next();
                             scan();
                             ////console.log("mazem",flipOrder[flipOrder.length-1]);
                             //flipOrder.pop();    //FLIP ORDER back
                         }
                         else {
                             ////console.log("JUMP v jump true s",token);                            
                             state = true;
                             diagram.LAST = diagram[key][j]; //for end; 
                             if (!flipON){
                                 diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code                                                      
                             }
                             else{
                                diagram.FLIP += 1;
                             }
                               diagrams.pop();                           
                            /* canScan();   */                        
                             break;
                        }
                     }
                 }                 
                 break;  
            case "CYCLE":  
                 
              //  //console.log("CYCLE s", token,diagram);                
                 repeat = true;                 
                 diagram.START = position;           
                 while(repeat){ 
                     var saveResult = [];
                     
                     for (var j = 0; j < diagram[key].length; j++){                    
                         if (token == "" ){ 
                            // //console.log("prazdny");
                             if (end == false){                              
                                 index = diagram.START;   
                                 next();
                                 scan();  
                                 ////console.log("BOL FALSE END");
                                 ////console.log("SAVE  RESULT",saveResult);
                                 if (flipON){   
                                      var len = saveResult.length; 
                                      for (var k=0;k<len;k++){                                            
                                            var dg = saveResult.shift(); 
                                            for (var l=0;l<dg.FLIP;l++){ 
                                                flipOrder.pop();                                     
                                            }                               
                                      }                                      
                                }
                                
                             }
                             repeat = false;
                             break;
                         }                          
                        
                         if (typeof diagram[key][j] == "string"){                           
                             if (diagram[key][j].indexOf("(") > -1){   //JUMPFUNCTION
                                 ////console.log("JUMPFUncTIOn v Cycle s", token);
                                
                                 if (eval(diagram[key][j]) == false){
                                     ////console.log("JUMPFUNSCION v cycle false s",token);
                                     repeat = false;
                                     state = true;
                                     index = diagram.START;   
                                     next()
                                     scan();                                                                    
                                     break;
                                 }
                                 else {                                     
                                     ////console.log("JUMPFUNCION v cycle true s",token);                                    
                                     saveResult.push(token);
                                     scan();
                                     scanCheck = true;                                     
                                     if (diagram.END.indexOf(diagram[key][j]) > -1 ){    //if it is end
                                         var len = saveResult.length; 
                                         if (!flipON){
                                             for (var k=0;k<len;k++){                                          
                                              diagram.RESULT.push(saveResult.shift());  //generate code                                                  
                                            } 
                                         }
                                         else{
                                             diagram.FLIP += 1;
                                         }
                                         
                                         diagram.LAST = diagram[key][j]; //for end;
                                        diagram.START = position; 
                                        repeat = true;    
                                        end = true;
                                     }  
                                     else{end = false;
                                       /* if (flipON){   
                                      var len = saveResult.length; 
                                      for (var k=0;k<len;k++){                                            
                                            var dg = saveResult.shift(); 
                                            for (var l=0;l<dg.FLIP;l++){ 
                                                flipOrder.pop();                                     
                                            }                               
                                      }                                      
                                      } */
                                         
                                         
                                         }
                                 }   
                             }
                             else{                                
                                 if (token != diagram[key][j]){ //CHECK
                                    ////console.log("CHECK v Cycle false s",token);                                    
                                    repeat = false;
                                    state = true;
                                    index = diagram.START;   
                                    next()
                                    scan();
                                 //   scanCheck = true; //
                                    break;                  
                                 }
                                 else{                                                        
                                     ////console.log("CHECK v Cycle true s",token);
                                     
                                    // diagram.LAST = diagram[key][j]; //for end;
                                     //diagram.RESULT.push(token);  //generate code
                                     saveResult.push(token);
                                     scan();
                                     scanCheck = true;                                     
                                     if (diagram.END.indexOf(diagram[key][j]) > -1){    //if it is end
                                         var len = saveResult.length; 
                                         if (!flipON){
                                             for (var k=0;k<len;k++){                                          
                                              diagram.RESULT.push(saveResult.shift());  //generate code                                                     
                                            } 
                                         }
                                         else{
                                             diagram.FLIP += 1;
                                         }
                                        diagram.LAST = diagram[key][j]; //for end;
                                        diagram.START = position; 
                                        repeat = true;
                                        end = true;
                                     }
                                     else{end = false;
                                          ////console.log("END JE FALSE NESKOR");
                                          /*if (flipON){   
                                      var len = saveResult.length; 
                                      for (var k=0;k<len;k++){                                            
                                            var dg = saveResult.shift(); 
                                            for (var l=0;l<dg.FLIP;l++){ 
                                                flipOrder.pop();                                     
                                            }                               
                                      }                                      
                                      } */
                                         
                                         
                                    }
                                     
                                 } }  }                         
                         else{  
                            // //console.log("JUMP v cycle",token);                      
                            
                             if (Syntaxdiagram(diagram[key][j]) == false){
                                // //console.log("JUMP v Cycle false");                                                               
                                 repeat = false;
                                 state = true;
                                 index = diagram.START;   
                                 next()
                                 scan(); 
                                 
                                 break;                                
                             }
                             else{
                                
                                 ////console.log("flipOrder",flipOrder);
                                 //diagram.LAST= diagram[key][j]; //for end;
                                 saveResult.push(diagrams[diagrams.length-1]);
                                 diagrams.pop(); 
                                
                                  
                                 if (diagram.END.indexOf(diagram[key][j]) > -1){    //if it is end    
                                    
                                      var len = saveResult.length;  
                                     if (!flipON){
                                          for (var k=0;k<len;k++){                                            
                                              diagram.RESULT.push(saveResult.shift());  //generate code                                          
                                          }   
                                     }
                                     else{
                                         diagram.FLIP += 1;
                                     }
                                      diagram.LAST = diagram[key][j]; //for end;
                                      diagram.START = position;                                     
                                      repeat = true;
                                      end = true;
                                 }
                                 else{end = false;
                                       ////console.log("MAZEM");
                                      /*if (flipON){   
                                      var len = saveResult.length; 
                                      for (var k=0;k<len;k++){                                            
                                            var dg = saveResult.shift(); 
                                            for (var l=0;l<dg.FLIP;l++){ 
                                                flipOrder.pop();                                     
                                            }                               
                                      }                                      
                                      }   */                                  
                                }
                                                                
                                }  }  }
                              //  //console.log("posledny end",end);
                                if (end == false){
                                    if (flipON){   
                                      var len = saveResult.length; 
                                      for (var k=0;k<len;k++){                                            
                                            var dg = saveResult.shift(); 
                                            for (var l=0;l<dg.FLIP;l++){ 
                                                flipOrder.pop();                                     
                                            }                               
                                      }                                      
                                      }
                                    
                                }
                 
                 
                 }             
             break; 
                
            default:                 
                 break;      
        }
       
        if (token == ""){                  
           
            if (flipON != true){
              break;  
            }          
                                     
         }        
        
         if (!state){            
             state = false;
             break;
         }
    }
   
    if (state == true){           //check if ends in end 
        ////console.log("check end",diagram);
       // //console.log("laast",diagram.LAST);
        ////console.log("diagram.END",diagram.END);
        
        if (typeof diagram.LAST== "object"){ 
            // //console.log("dg",diagram);
            for (var j = 0; j < diagram.END.length; j++){                 
                if (typeof diagram.END[j] == "object"){
                    if (diagram.END[j].NAME == diagram.LAST.NAME){
                        ////console.log("true",diagram.LAST,token);
                         // //console.log("state is true ",diagram.NAME);
                        ////console.log("flipOrder",flipOrder);
                        return true;
                    }                    
                }   
            
            }
            index = diagram.START;
            if (index != -1){  //ak predtym nebolo nikde jump                
                next();            
                scan();   
               // state = false;
            } 
            
           // //console.log("ZLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ENDDDDDDDDDDDDDDDDDDDDDDd"); 
            state = false;
        }
        else{ 
          //  //console.log("zly end druhy",diagram.LAST);
            if (diagram.END.indexOf(diagram.LAST) == -1){                 
                index = diagram.START;
                if (index != -1){
                    next();            
                    scan(); 
                    //state = false;
                }  
                
                ////console.log("ZLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ENDDDDDDDDDDDDDDDDDDDDDDd");            
                state = false;          
            } } 
         
    }
    if (state == false){
        error = diagram.NAME;
        diagrams.pop();
    }
    
   // //console.log("state is ",state,diagram.NAME, diagram.FLIP);
    
    if (flipON == true && state == false){
        ////console.log("flipOrder",flipOrder);
////console.log("mazem z flip",diagram,diagram.FLIP);
        for (var i=0;i<diagram.FLIP;i++){
            ////console.log("tu som");
            flipOrder.pop();
        }       
        
    }
    if (flipOrder.length == 0){
        flipON = false;
         on_off2 = 0; 
    }
    
    ////console.log("tu som2");
    ////console.log("flipOrder",flipOrder,flipON);
    ////console.log(diagram.NAME,diagram.FLIP);
    return state;
}

























