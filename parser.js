var state = true;
var repeat=true;
var start;

var end=false;
var error;
var last;
var scanCheck=false;
var syntax = [];
var diag;


var diagrams = [];

function characters(){
    //console.log("characters",token);
    return token != "'" ;     
}

function characters2(){
    //console.log("characters2",token);
    return token != '"';  
}

function digits(check=""){  
    //console.log("digits");
    if (check == ""){
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
    //console.log("name",token);
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
    //console.log("methodname",token);
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
    //console.log("varname",token);
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
             if (!digit(token[j])){                   
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
            console.log(res.RESULT[i].NAME);
            printWebiTree(res.RESULT[i]);
        }
        else{
            console.log(res.RESULT[i]);
        }
    }
    
    
    
}


function parse() {
    console.log("parser start");        
    index=0;
    next();
    scan();      
    var result = Syntaxdiagram(diag);
    var first = diag.NAME;
    console.log("PARSER ENDS",result);
    if (result==true){
        console.log(first);
       
        printWebiTree(diagrams[0]);
        //console.log(diagrams);
    }
    else{
        console.log("error: ",error);
    }   
    

    console.log("zvysilo sa od",token);
   
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
    //console.log(scanCheck);
}



var pos;
var diagram;

function Syntaxdiagram(diagram){  
    
    diagrams.push(Object.assign({}, diagram)); //copy of object  
    diagram = diagrams[diagrams.length-1];     
    diagram.RESULT = [];
    diagram.START = -1;
    
    
    
    for (var key in diagram) {          
        switch (key.substring(0, key.length-1)){  
            case "TRYCHECK": 
                //console.log("TRYCHECK s", token);                 
                 if (token == diagram[key]){
                     //console.log("TRYCHECK true",token);
                     diagram.RESULT.push(token);  //generate code                   
                     diagram.LAST = token; //for end
                     scan();
                     scanCheck = true;                     
                 }
                 else{
                     //console.log("TRYCHECK false", token);
                 }  
                break;
            
            case "CHECK":
                // console.log("CHECK S",token);
                //console.log(diagram[key]);
                 if (diagram[key].indexOf(token) != -1){ 
                    // console.log("CHECK true"); 
                     diagram.RESULT.push(token);  //generate code                    
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
                //console.log("JUMPFUNSCION s",token);                 
                 if (eval(diagram[key]) == true){
                     //console.log("JUMPFUNSCION true");
                     diagram.RESULT.push(token);  //generate code                    
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
                    
                   //  console.log("TRYJUMPREPEAT s",token); 
                     if (token == ""){ break;}                
                     
                     if (Syntaxdiagram(diagram[key]) == false){                        
                         //console.log("TRYJUMPREPEAT IS FALSE");                        
                         index = diagram.START;   
                         next()
                         scan();
                         state = true;
                         repeat = false;
                         scanCheck = true;    
                     }
                     else{
                       // console.log("TRYJUMPREPEAT IS TRUE"); 
                        diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code 
                        diagrams.pop();
                        diagram.START = position; 
                        diagram.LAST = diagram[key]; //for end;
                        canScan();
                        repeat = true;
                         
                    }     
                      
                 }     
                  break; 
            
            case "TRYJUMP":
               //  console.log("TRYJUMP s",token);
                 diagram.START = position;                            
                 if (Syntaxdiagram(diagram[key]) == false){                    
                        // console.log("TRYJUMP IS FALSE");                         
                         state = true;
                         index = diagram.START;   
                         next()
                         scan();
                         
                 }
                 else{ 
                     //console.log("TRYJUMP IS TRUE"); 
                     diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code 
                     diagrams.pop();
                     diagram.LAST = diagram[key]; //for end;  
                     //console.log(scanCheck)
                             
                 }                  
                 break;
                
            case "JUMP": 
                 
                 diagram.START = position;                
                 for (var j = 0; j < diagram[key].length; j++){   
                    // console.log("JUMP s ",token);
                     //diagram.RESULT.push(token);  //generate code
                    // syntax.push(diagram[i].value[j][0].key);  //generate code
                    // diagram[diagram.length-1].value.push(syntax.length-1);  //generate code
                     if (typeof diagram[key][j] == "string"){   //jumpfunction
                        
                         if (eval(diagram[key][j]) == false){
                           // console.log("JUMPFUNCION v jump false s",token);
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
                             //console.log("JUMPFUNCION v jump true s",token);
                             diagram.RESULT.push(token);  //generate code                                                   
                             diagram.LAST = diagram[key][j]; //for end;
                             scan();
                             scanCheck = true;                              
                             break;
                        }
                     }                     
                     else{
                          //console.log("JUMP v jump s",token,"do",diagram[key][j]);
                         if (Syntaxdiagram(diagram[key][j]) == false){ 
                            // console.log("jeden hlavnyyyyyyyyyyyyy");
                             //console.log("JUMP v jump false s",token);  
                             state = true;
                             //syntax.pop() //generate code
                             if (j == diagram[key].length-1){                                 
                                 state = false;
                             } 
                             index = diagram.START;   
                             next();
                             scan();
                         }
                         else {
                           //  console.log("JUMP v jump true s",token);
                            // console.log("diagram",diagram[key][j]);
                             state = true;
                             diagram.LAST = diagram[key][j]; //for end;         
                             diagram.RESULT.push(diagrams[diagrams.length-1]);  //generate code 
                             diagrams.pop();                             
                            /* canScan();   */                        
                             break;
                        }
                     }
                 }                 
                 break;  
            case "CYCLE":  
                 
              //   console.log("CYCLE s", token);                
                 repeat = true;                 
                 diagram.START = position;           
                 while(repeat){ 
                     var saveResult = [];
                     for (var j = 0; j < diagram[key].length; j++){                    
                         if (token == "" ){ 
                            // console.log("prazdny");
                             if (end == false){                              
                                 index = diagram.START;   
                                 next();
                                 scan();                       
                             }
                             repeat = false;
                             break;
                         }                          
                        
                         if (typeof diagram[key][j] == "string"){                           
                             if (diagram[key][j].indexOf("(") > -1){   //JUMPFUNCTION
                                 //console.log("JUMPFUncTIOn v Cycle s", token);
                                
                                 if (eval(diagram[key][j]) == false){
                                    // console.log("JUMPFUNSCION v cycle false s",token);
                                     repeat = false;
                                     state = true;
                                     index = diagram.START;   
                                     next()
                                     scan();                                                                    
                                     break;
                                 }
                                 else {                                     
                                     //console.log("JUMPFUNSCION v cycle true s",token); 
                                    // diagram.LAST = diagram[key][j]; //for end;
                                     //diagram.RESULT.push(token);  //generate code
                                     saveResult.push(token);
                                     scan();
                                     scanCheck = true;                                     
                                     if (diagram.END.indexOf(diagram[key][j]) > -1 ){    //if it is end
                                         var len = saveResult.length; 
                                         for (var k=0;k<len;k++){                                          
                                          diagram.RESULT.push(saveResult.shift());  //generate code                                                     
                                        } 
                                         
                                         diagram.LAST = diagram[key][j]; //for end;
                                        diagram.START = position; 
                                        repeat = true;    
                                        end = true;
                                     }  
                                     else{end = false;}
                                 }   
                             }
                             else{                                
                                 if (token != diagram[key][j]){ //CHECK
                                    //console.log("CHECK v Cycle false s",token);                                    
                                    repeat = false;
                                    state = true;
                                    index = diagram.START;   
                                    next()
                                    scan();
                                 //   scanCheck = true; //
                                    break;                  
                                 }
                                 else{                                                        
                                     //console.log("CHECK v Cycle true s",token);
                                    // diagram.LAST = diagram[key][j]; //for end;
                                     //diagram.RESULT.push(token);  //generate code
                                     saveResult.push(token);
                                     scan();
                                     scanCheck = true;                                     
                                     if (diagram.END.indexOf(diagram[key][j]) > -1){    //if it is end
                                         var len = saveResult.length; 
                                         for (var k=0;k<len;k++){                                          
                                          diagram.RESULT.push(saveResult.shift());  //generate code                                                     
                                        } 
                                         
                                        diagram.LAST = diagram[key][j]; //for end;
                                        diagram.START = position; 
                                        repeat = true;
                                        end = true;
                                     }
                                     else{end = false;}
                                     
                                 } }  }                         
                         else{  
                            // console.log("JUMP v cycle",token);
                            // syntax.push(diagram[i].value[j][0].key);  //generate code
                            
                             if (Syntaxdiagram(diagram[key][j]) == false){
                                 //console.log("JUMP v Cycle false");
                                 //console.log("jump back", diagram.START);                                
                                 repeat = false;
                                 state = true;
                                 index = diagram.START;   
                                 next()
                                 scan();                                  
                                 break;                                
                             }
                             else{
                               //  console.log("JUMP v Cycle true");                 
                                 //diagram.LAST= diagram[key][j]; //for end;
                                 saveResult.push(diagrams[diagrams.length-1]);
                                 diagrams.pop(); 
                                
                                  
                                 if (diagram.END.indexOf(diagram[key][j]) > -1){    //if it is end                                     
                                      var len = saveResult.length;                                     
                                      for (var k=0;k<len;k++){                                            
                                          diagram.RESULT.push(saveResult.shift());  //generate code 
                                          //diagrams.pop(); 
                                          console.log("poooooooooooooooooooooooop",diagrams);
                                      }                             
                                      diagram.LAST = diagram[key][j]; //for end;
                                      diagram.START = position;                                     
                                      repeat = true;
                                      end = true;
                                 }
                                 else{end = false;}
                                                                
                                }  }  }   }             
             break; 
                
            default:                 
                 break;      
        }
        if (token == "" ){   
             //console.log("bol prazdny,bol break");
             break;                         
         }         
        
         if (!state){            
             state = false;
             break;
         }
    }
   
    if (state == true){           //check if ends in end 
        //console.log("check end",diagram);
        //console.log("laast",diagram.LAST);
        //console.log("diagram.END",diagram.END);
        if (typeof diagram.LAST== "object"){ 
            // console.log("dg",diagram);
            for (var j = 0; j < diagram.END.length; j++){                 
                if (typeof diagram.END[j] == "object"){
                    if (diagram.END[j].NAME == diagram.LAST.NAME){
                        //console.log("true",diagram.LAST,token);
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
            
            console.log("ZLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ENDDDDDDDDDDDDDDDDDDDDDDd"); 
            state = false;
        }
        else{ 
          
            if (diagram.END.indexOf(diagram.LAST) == -1){                 
                index = diagram.START;
                if (index != -1){
                    next();            
                    scan(); 
                    //state = false;
                }  
                
                console.log("ZLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY ENDDDDDDDDDDDDDDDDDDDDDDd");            
                state = false;          
            } } 
         
    }
    if (state == false){
        error = diagram.NAME;
        diagrams.pop();
    }
    
    return state;
}

























