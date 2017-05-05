

function scan(){    //finds one token      
        while (character == " "  ){        //skip space             
            next()
        }
        token = "";
        position = index-1;
        if (isNumber(character)){              
            while (isNumber(character)){
                
                token += character;               
                next();                
                if (character == "." ){  //check if it can be float
                    token += character;             
                    next();                    
                }
            }
        }          
        else if (isLetter(character)){            
            while (isLetter(character) ){               
                token += character;                
                next();                                 
            }   
            
        } 
        else if (character != "/0"  ){
            
            if (["*","/","%","!","=",">","<","!"].indexOf(character) != -1 ){
                token += character;
                next();
                if (character == "="){
                    token += character;
                    next();                    
                }             
            }
            else if (character == "|"){                 
                token += character;
                next();
                if (character == "|"){
                    token += character;
                    next();             
                }  
               
            }
            else if (character == "&"){
                token += character;
                next();
                if (character == "&"){
                    token += character;
                    next();             
                }                 
            }
            else if (character == "#"){  //skip comments
                next();
                while (character != "#"){   //co ak nenajde
                    next();                                    
                }
                next();
                scan();
            }
         
        
            
            else{
            if (character == "+"){   
                token += character;
                next();
                if (character == "+" || character == "=" ){   //+=, ++
                    token += character;
                    next();                       
                }
            }
            else if (character == "-" || character == "="){    //--, -=
                token += character;
                next();
                if (character == "-"){
                    token += character;
                    next();                       
                }
            }
            else{
                token = character;
                next();                
            } }               
        }        
}
        
function next(){  //finds ona character
    if (index >= input.length){
        character = "/0"
    }
    else{
        character = input[index];            
        index++;
    } 
}
        
function isLetter(check) {   //check is character is letter
    /*if (check == "\n"){
        console.log("bol som tu");
    }*/
  
    if (check.match(regex)){
        return true;    
    } 
    else{
        return false;
    }  
}

function isNumber(check){  //check is character is digit     
    return !isNaN(check) && (check != " ");   //isNaN(check) returns true if the variable does NOT contain a valid number
}