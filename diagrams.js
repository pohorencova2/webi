
var methodCall = {             //CHECK
    NAME : "methodCall",
    END  : [")"],
    JUMPFUNCTION1: "methodName()",
    CHECK1: ["("],
    TRYJUMP1: "",   //values
    CHECK2: [")"],
    RESULT  : []
};

var parentMethodCall = {        //CHECK
    NAME : "parentMethodCall",
    END  : [methodCall],   
    CHECK1: ["parent"],   
    CHECK2: ["."],
    JUMP1: [methodCall],
    RESULT: []
};

var instanceMethodCall = {      //CHECK
    NAME : "instanceMethodCall",
    END  : [methodCall],   
    JUMP1: [],  //expression 
    CHECK2: ["."],
    JUMP1: [methodCall],
    RESULT  : []
};

var instanceProperty = {       //CHECK
    NAME: "instanceProperty",
    END: ["varName()"], 
    JUMP1: [],  //expression 
    CHECK2: ["."],
    JUMPFUNCTION1: "varName()",    
    RESULT: []    
}

var parentVarName = {        //CHECK
    NAME: "parentVarName",
    END: ["varName()"], 
    CHECK1: ["parent"],
    CHECK2: ["."],
    JUMPFUNCTION1: "varName()",    
    RESULT: []
};

var inside = {            //CHECK
    NAME: "inside",
    END: [],     //stringExpression,numberExpression
    JUMP1: [],   //stringExpression,numberExpression
    RESULT: []
}; 

var secondPart = {        //CHECK
    NAME : "secondPart",
    END  : ["]"],   
    CHECK1: ["["],
    JUMP1: [inside],
    CHECK2: ["]"],
    CYCLE1: ["[",inside,"]"],
    RESULT  : []
};

var firstPart = {        //CHECK
    NAME : "firstPart",
    END  : ["name()"],    
    CHECK1: ["."],
    JUMPFUNCTION1: "name()",    
    CYCLE1: [".","name()"],
    RESULT  : []
};

var getValueJson = {        //CHECK
    NAME : "getValueJson",
    END  : [firstPart,secondPart],    
    JUMP1: [firstPart],
    JUMP2: [secondPart],    
    CYCLE1: [firstPart,secondPart],
    RESULT  : []
};


var getValueListDict = {        //CHECK
    NAME : "getValueListDict",
    END  : ["]"],
    JUMPFUNCTION1: "varName()",
    CHECK1: ["["],
    JUMP1: [inside],
    CHECK2: ["]"],
    CYCLE1: ["[",inside,"]"],
    RESULT  : []
};

var leftValue = {               //CHECK
    NAME: "leftValue",
    END:[getValueListDict,getValueJson,"varName()",parentVarName,instanceProperty],
    JUMP1:[getValueListDict,getValueJson,"varName()",parentVarName,instanceProperty],
    RESULT: []
}

var expr = {    
    NAME:"expr",
    END: [instanceMethodCall,methodCall,parentMethodCall,leftValue],     
    JUMP1: [instanceMethodCall,methodCall,parentMethodCall,leftValue],    
    RESULT:[]
};

/////////////////EXPRESSIONS/////////////////////////

var expression = {   //CHECK
    NAME:"expression",
    END: "",  //booleanExpression,stringExpression,numberExpression,listExpression,dictionaryExpression,jsonExpression,imageExpression
    JUMP1: "", 
    RESULT:[]
}

instanceProperty.JUMP1.push(expression);
instanceMethodCall.JUMP1.push(expression);
inside.END.push(stringExpression,numberExpression);
inside.JUMP1.push(stringExpression,numberExpression);


 

var sign = {       //CHECK
    NAME:"sign",
    END: ["+","-"],     
    CHECK1: ["+","-"],    
    RESULT:[]
};

var arithmeticOp = {      //CHECK
    NAME:"arithmeticOp",
    END: ["+","-","*","/","%"],
    CHECK1: ["+","-","*","/","%"],    
    RESULT:[]
}; 

var muldivOp = {       //CHECK
    NAME:"muldivOp",
    END: ["*","/","%"],     
    CHECK1: ["*","/","%"],    
    RESULT:[]
};

var addsubOp = {       //CHECK
    NAME:"addsubOp",
    END: ["+","-"],     
    CHECK1: ["+","-"],    
    RESULT:[]
};

var number = {
    NAME:"number",
    END: ["digits()"],     
    TRYJUMP1: addsubOp, 
    JUMPFUNCTION1: "digits()", 
    RESULT:[]
    
}

var NEbrackets = {    //CHECK
    NAME:"NEbrackets",
    END: [")"],
    TRYJUMP1: addsubOp,
    CHECK1: ["("],  
    JUMP1: [],             //numberExpression
    CHECK2: [")"],
    RESULT:[]
};

var numberOrBrackets = {      //CHECK
    NAME:"numberOrBrackets",
    END: [number,NEbrackets],
    JUMP1: [number,NEbrackets],   
    RESULT:[]  
};

var NEmuldiv = {      //CHECK
    NAME:"NEmuldiv",
    END: [numberOrBrackets],
    JUMP1: [numberOrBrackets], 
    CYCLE1: [muldivOp,numberOrBrackets],
    RESULT:[]  
};


/*var NEflipOrder = {
    
}

var numberExpressionFlipped = {      //CHECK
    NAME:"numberExpression",
    END: [NEmuldiv],
    JUMP1: [NEmuldiv], 
    CYCLE1: [addsubOp,NEmuldiv],
    RESULT:[]  
};

//NEbrackets.JUMP1.push(numberExpressionFlipped); 

var numberExpression= {      //CHECK
    NAME:"",
    END: [numberExpressionFlipped],
    FLIP1: "ON",
    JUMP1: [NEflipOrder],
    FLIP2: "OFF",
    JUMP2: [numberExpressionFlipped],  
    RESULT:[]  
};*/

var numberExpression = {      //CHECK
    NAME:"numberExpression",
    END: [NEmuldiv],
    JUMP1: [NEmuldiv], 
    CYCLE1: [addsubOp,NEmuldiv],
    RESULT:[]  
};
NEbrackets.JUMP1.push(numberExpression); 




/////////////////NUNBER EXPRESSION/////////////////////////


/////////////////STRING EXPRESSION/////////////////////////

var characters2 = {       //CHECK
    NAME:"characters2",
    END: "characters2()",      
    JUMPFUNCTION1: "characters2()",    
    RESULT:[]
};

var stringType2 = {          //CHECK
    NAME:"stringType2",
    END: ['"'],
    CHECK1: ['"'],  
    TRYJUMPREPEAT1: characters2,
    CHECK2: ['"'],
    RESULT:[]
};

var characters = {         //CHECK
    NAME:"characters",
    END: "characters()",      
    JUMPFUNCTION1: "characters()",    
    RESULT:[]
};

var stringType = {       //CHECK
    NAME:"stringType",
    END: ["'"],
    CHECK1: ["'"],  
    TRYJUMPREPEAT1: characters,
    CHECK2: ["'"],
    RESULT:[]
};

var SEbrackets = {        //CHECK
    NAME:"SEbrackets",
    END: [")"],
    CHECK1: ["("],  
    JUMP1: [],       //stringExpression
    CHECK2: [")"],
    RESULT:[]
};

var SEoperant = {      //CHECK
    NAME:"SEoperant",
    END: [SEbrackets,stringType,stringType2,numberExpression,expr],    
    JUMP1: [SEbrackets,stringType,stringType2,numberExpression,expr],    
    RESULT:[]
}; 

var stringExpression = {      //CHECK
    NAME:"stringExpression",
    END: [SEoperant],
    JUMP1: [SEoperant], 
    CYCLE1:["+",SEoperant], 
    RESULT:[]
}; 

SEbrackets.JUMP1.push(stringExpression);


/////////////////BOOLEAN Expression/////////////////////////
var equalsOp = {    //CHECK
    NAME:"equalsOp",
    END:["==","!="],         
    CHECK1:["==","!="],    
    RESULT:[]
};

var equalsOperantEnd = {   //CHECK
    NAME:"equalsOperantEnd",
    END:[expression],         
    JUMP1:[expression],    
    RESULT:[]    
}

var equals = {      //CHECK
    NAME:"equals",
    END: [equalsOperantEnd],
    JUMP1: [expression],  
    JUMP2: [equalsOp],
    JUMP3: [equalsOperantEnd],
    CYCLE1: [equalsOp,equalsOperantEnd],
    RESULT:[]
}; 


var comparisonOp = {   //CHECK 
    NAME:"comparisonOp",
    END: ["<",">","<=",">="],         
    CHECK1:["<",">","<=",">="],    
    RESULT:[]
};


var numberComparisonEnd = {   //CHECK   
    NAME:"numberComparisonEnd",
    END: [numberExpression],
    JUMP1: [numberExpression],     
    RESULT:[]
}; 

var numberComparison = {    //CHECK 
    NAME:"numberComparison",
    END: [numberComparisonEnd],
    JUMP1: [numberExpression],  
    JUMP2: [comparisonOp],
    JUMP3: [numberComparisonEnd],
    CYCLE1: [comparisonOp,numberComparisonEnd],
    RESULT:[]
}; 

var stringComparisonEnd = {     //CHECK  
    NAME:"stringComparisonEnd",
    END: [stringExpression],
    JUMP1: [stringExpression],     
    RESULT:[]
}; 

var stringComparison = {  //CHECK  
    NAME:"stringComparison",
    END: [stringComparisonEnd],
    JUMP1: [stringExpression],  
    JUMP2: [comparisonOp],
    JUMP3: [stringComparisonEnd],
    CYCLE1: [comparisonOp,stringComparisonEnd],
    RESULT:[]
}; 

var booleanType = {    //CHECK
    NAME:"booleanType",
    END: ["true","false"],
    CHECK1: ["true","false"],   
    RESULT:[]
}; 

var BEbrackets = {    //CHECK
    NAME:"BEbrackets",
    END: [")"],
    CHECK1: ["("],
    JUMP1: [],
    CHECK2: [")"],
    RESULT:[]
}; 

var logicalOp = {    //CHECK
    NAME:"logicalOp",
    END: ["&&","||"],         
    CHECK1:  ["&&","||"],    
    RESULT:[]
};

var BEoperant= {             //CHECK 
    NAME:"BEoperant",
    END: [BEbrackets,equals,booleanType,numberComparison,stringComparison,expr], 
    TRYCHECK1: "!",
    JUMP1: [BEbrackets,equals,booleanType,numberComparison,stringComparison,expr],     
    RESULT:[]
};


var booleanExpression = {     //CHECK
    NAME:"booleanExpression",
    END: [BEoperant],
    JUMP1: [BEoperant], 
    CYCLE1: [logicalOp,BEoperant],
    RESULT:[]
};
BEbrackets.JUMP1.push(booleanExpression);

/////////////////DICTIONARY EXPRESSION/////////////////////////

var stringPair = {     //CHECK
    NAME:"stringPair",
    END: [expression],    
    JUMP1: [stringType,stringType2],
    CHECK1: [":"], 
    JUMP2: [expression],
    RESULT:[]
}; 

var numberPair = {    //CHECK
    NAME:"numberPair",
    END: [expression],   
    TRYJUMP1: sign,
    JUMP1: ["digit()"],
    CHECK1: [":"], 
    JUMP2: [expression],
    RESULT:[]
}; 

var stringPairs = {    //CHECK
    NAME:"stringPairs",
    END: [stringPair],    
    JUMP1: [stringPair],
    CYCLE1: [",",stringPair],
    RESULT:[]
}; 


var numberPairs = {    //CHECK
    NAME:"numberPairs",
    END: [numberPair],    
    JUMP1: [numberPair],
    CYCLE1: [",",numberPair],
    RESULT:[]
}; 


var dictionaryNumberKey = {   //CHECK 
    NAME:"dictionaryNumberKey",
    END: [")"],
    CHECK1:  ["("], 
    TRYJUMP1: numberPairs,
    CHECK2: [")"],
    RESULT:[]
}; 

var dictionaryStringKey = {    //CHECK
    NAME:"dictionaryStringKey",
    END: [")"],
    CHECK1:  ["("], 
    TRYJUMP1: stringPairs,
    CHECK2: [")"],
    RESULT:[]
}; 


var dictionaryExpression = {    //CHECK
    NAME:"dictionaryExpression",
    END: [dictionaryStringKey, dictionaryNumberKey],
    JUMP1: [dictionaryStringKey, dictionaryNumberKey],    
    RESULT:[]
}; 

 
/////////////////LIST EXPRESSIONS/////////////////////////

var slice = {    
    NAME:"slice",
    END: ["]"],
    JUMPFUNCTION1: "varName()",
    CHECK1: ["["],
    TRYJUMP1: numberExpression,
    CHECK2: [":"],
    TRYJUMP2: numberExpression,
    CHECK3: ["]"],
    RESULT:[]
}; 

var listType = {    
    NAME:"listType",
    END: ["]"],
    CHECK1: ["["],
    TRYJUMP1: "",  //values
    CHECK2: ["]"],
    RESULT:[]
}; 


var listExpression = {    
    NAME:"listExpression",
    END: [listType,slice,expr],
    JUMP1: [listType,slice,expr],     
    RESULT:[]
}; 



/////////////////JSON EXPRESSIONS/////////////////////////

var jsonValue = {      //CHECK
    NAME:"jsonValue",
    END: [booleanExpression,stringExpression,numberExpression,listExpression],     //jsonExpression
    JUMP1: [booleanExpression,stringExpression,numberExpression,listExpression],   //jsonExpression 
    RESULT:[]
}; 

var jsonPair = {       //CHECK
    NAME:"jsonPair",
    END: [jsonValue],    
    JUMPFUNCTION1: "name()",
    CHECK1: [":"], 
    JUMP2: [jsonValue],
    RESULT:[]
}; 

var jsonPairs = {     //CHECK   
    NAME:"jsonPairs",
    END: [jsonPair],    
    JUMP1: [jsonPair],
    CYCLE1: [",",jsonPair],
    RESULT:[]
}; 


var jsonExpression = {        //CHECK
    NAME:"jsonExpression",
    END: ["}"],
    CHECK1:  ["{"], 
    TRYJUMP1: jsonPairs,
    CHECK2: ["}"],    
    RESULT:[]
}; 

jsonValue.END.push(jsonExpression);   //CHECK
jsonValue.JUMP1.push(jsonExpression);   //CHECK




/////////////////IMAGE EXPRESSIONS/////////////////////////

var imageExpression  = {    
    NAME:"imageExpression",
    END: [")"],    
    CHECK1: ["Image"],
    CHECK2: ["("],
    JUMP1: [stringExpression,listExpression],
    CHECK3: [")"],   
    RESULT:[]
};


expression.END = [booleanExpression,stringExpression,numberExpression,listExpression,dictionaryExpression,jsonExpression,imageExpression]
expression.JUMP1 =  [booleanExpression,stringExpression,numberExpression,listExpression,dictionaryExpression,jsonExpression,imageExpression]

/////////////////STATEMENTS/////////////////////////
var values = {      //CHECK
    NAME:"values",
    END: [expression],
    JUMP1: [expression],
    CYCLE1: [",",expression],   
    RESULT:[]
}; 
listType.TRYJUMP1 = values;
methodCall.TRYJUMP1 = values;

var assignmentOp = {                //CHECK
    NAME:"assignmentOp",
    END: ["=","+=","-=","*=","/=","%="],
    CHECK1: ["=","+=","-=","*=","/=","%="],    
    RESULT:[]
}; 

var assign = {            //CHECK
    NAME:"assign",
    END: [expression],  
    JUMP1: [leftValue],   
    JUMP2: [assignmentOp],
    JUMP3: [expression],    
    RESULT:[]
};

/*var print = {          //CHECK
    NAME:"print",
    END: ["print",expression],
    CHECK1: ["print"],
    TRYJUMP1: expression,    
    RESULT:[]    
}*/
var print = {          //CHECK
    NAME:"print",
    END: ["print",numberExpression],
    CHECK1: ["print"],    
    JUMP1:[numberExpression],    
    RESULT:[]    
}

var returnStatement = {          //CHECK
    NAME:"returnStatement",
    END: ["return",expression],
    CHECK1: ["return"],
    TRYJUMP1: expression,          
    RESULT:[]    
}

var incrDecrStatement = {     //CHECK
    NAME: "incrDecrStatement",
    END: ["++","--"],
    JUMP1: [leftValue],
    CHECK1: ["++","--"],
    RESUT: []
}

var varDecl = {          //CHECK2
    NAME:"varDecl",
    END: ["varName()"],
    TRYCHECK1: "constant",
    JUMPFUNCTION1: "name()",
    JUMPFUNCTION2: "varName()",          
    RESULT:[]   
}

var varDeclInit = {       //CHECK2
    NAME:"varDeclInit",
    END: [expression], 
    JUMP1: [varDecl],
    CHECK1: ["="],
    JUMP2: [expression],          
    RESULT:[]   
}

var classVarDeclInit = {    //CHECK2
    NAME:"classVarDeclInit",
    END: [varDeclInit],
    CHECK1: ["shared"],
    JUMP1: [varDeclInit],          
    RESULT:[]   
}

var classVarDecl = {            //CHECK2
    NAME:"classVarDecl",
    END: [varDecl],
    CHECK1: ["shared"],
    JUMP1: [varDecl],          
    RESULT:[]   
}

var varDeclarations = {                  //CHECK2
    NAME:"varDeclarations",
    END: [classVarDeclInit,varDeclInit,classVarDecl,varDecl],    
    JUMP1: [classVarDeclInit,varDeclInit,classVarDecl,varDecl],  
    RESULT:[]    
}


var foreach = {                //CHECK
    NAME:"foreach",
    END: ["end"], 
    CHECK1: ["foreach"],
    JUMPFUNCTION1: "varName()",
    CHECK2: ["in"],
    JUMP1: [stringExpression,listExpression],
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,
    CHECK3: ["end"],
    RESULT: [],    
}

var whileStatement = {                 //CHECK
    NAME:"whileStatement",
    END: ["end"],    
    CHECK1: ["while"],
    JUMP1: [expression], 
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,        
    CHECK2: ["end"],
    RESULT:[]   
};

var step = {           //CHECK
    NAME:"step",
    END: [numberExpression],    
    CHECK1: [","],
    JUMP2: [numberExpression],   
    RESULT:[]     
}

var forStatement = {           //CHECK
    NAME:"forStatement",
    END: ["end"],  
    CHECK1: ["for"],
    JUMPFUNCTION1: "varName()",
    CHECK2: ["in"],
    CHECK3: ["["],
    JUMP1: [numberExpression],
    TRYJUMP1 : step,
    TRYJUMP2 : step,
    CHECK4: ["]"],
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,  
    CHECK5: ["end"],
    RESULT:[] 
}


var match = {        //CHECK
    NAME:"match",
    END: [statement],    
    CHECK1: ["on"],
    CHECK2: ["["],
    JUMP1: [expression], 
    CHECK3: ["]"],
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,
    RESULT:[]  
    
}

var withDo = {       //CHECK
    NAME:"withDo",
    END: ["end"],    
    CHECK1: ["with"],
    JUMP1: [expression], 
    CHECK2: ["as"],
    JUMPFUNCTION1: "varName()",
    CHECK3: "do",
    JUMP2: [match],
    TRYJUMPREPEAT1: match, 
    CHECK4: ["end"],
    RESULT:[]    
}



var elseStatement = {    //CHECK
    NAME:"elseStatement",
    END: [statement],
    CHECK1: ["else"],
    JUMP1: [statement],
    TRYJUMPREPEAT1: statement,     
    RESULT:[]     
}

var elseIfStatement = {            //CHECK
    NAME:"elseIfStatement",
    END: [statement], 
    CHECK1: ["elseif"],
    JUMP1: [expression], 
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,    
    RESULT:[]     
}

var ifStatement = {           //CHECK
    NAME:"ifStatement",
    END: [statement], 
    CHECK1: ["if"],
    JUMP1: [expression],
    JUMP2: [statement],
    TRYJUMPREPEAT1: statement,    
    RESULT:[]     
}
var ifElse = {               //CHECK
    NAME:"ifElse",
    END: ["end"],    
    JUMP1: [ifStatement],
    TRYJUMP1: elseStatement, 
    CHECK1: ["end"],
    RESULT:[]    
}

var ifElifElse = {          //CHECK
    NAME:"ifElifElse",
    END: ["end"],    
    JUMP1: [ifStatement],
    JUMP2: [elseIfStatement],   
    TRYJUMPREPEAT1: elseIfStatement,
    TRYJUMP1: [elseStatement],  
    CHECK1: ["end"],
    RESULT:[]     
}

var conditionalStatement = {     //CHECK
    NAME:"conditionalStatement",
    END: [ifElifElse,ifElse],    
    JUMP1: [ifElifElse,ifElse],    
    RESULT:[]     
}

/*var statement = {                //CHECK                 
    NAME:"statement",
    END: [varDeclInit,varDecl,assign,print,returnStatement,,whileStatement,foreach,forStatement,withDo,conditionalStatement,incrDecrStatement,instanceMethodCall,parentMethodCall,methodCall],  
    JUMP1:[varDeclInit,varDecl,assign,print,returnStatement,,whileStatement,foreach,forStatement,withDo,conditionalStatement,incrDecrStatement,instanceMethodCall,parentMethodCall,methodCall],        
    RESULT:[] 
};*/

var statement = {
    NAME:"statement",
    END: [print],
    JUMP1: [print],
    RESULT: []
    
}


///////////////////////////CLASS DECLARATION////////////////////////////////////////
var parameters ={                                //CHECK
    NAME:"parameters",
    END: ["varName()"],    
    JUMPFUNCTION1: "name()",
    JUMPFUNCTION2: "varName()",
    CYCLE1: [",","name()","varName()"],    
    RESULT:[]
};

var createInstance = {        //  CHECK
    NAME : "createInstance",
    END  : [")"],
    JUMPFUNCTION1: "name()",
    CHECK1: ["("],
    TRYJUMP1: values,
    CHECK2: [")"],
    RESULT  : []
};

var headerConstructor ={                 //CHECK2
    NAME:"headerConstructor",
    END: [")",createInstance],      
    JUMPFUNCTION1: "name()",
    CHECK2: ["("],
    TRYJUMP1: parameters,     
    CHECK3: [")"],   
   // TRYJUMP2: createInstance,
    RESULT:[]
};

var methodHeaderVoid ={                 //CHECK2
    NAME:"methodHeaderVoid",
    END: [")"], 
    CHECK1: ["Void"], 
    JUMPFUNCTION1: "methodName()",
    CHECK2: ["("],
    TRYJUMP1: parameters,     
    CHECK3: [")"],    
    RESULT:[]
};

var methodHeaderReturn ={            //CHECK2
    NAME:"methodHeaderReturn",
    END: [")"], 
    JUMPFUNCTION1: "name()", 
    JUMPFUNCTION2: "methodName()",
    CHECK1: ["("], 
    TRYJUMP1: parameters, 
    CHECK2: [")"],   
    RESULT:[]
};

var methodHeader = {                         //CHECK2  
    NAME:"methodHeaders",
    END: [methodHeaderVoid,methodHeaderReturn],
    JUMP1: [methodHeaderVoid,methodHeaderReturn],   
    RESULT:[]
}; 

var method = {
    NAME:"method",
    END: ["end"],    
    JUMP1: [methodHeaderVoid,methodHeaderReturn],   
    TRYJUMPREPEAT1: statement,     
    CHECK1: ["end"],
    RESULT:[]     
}

var constructor = {
    NAME:"constructor",
    END: ["end"],    
    JUMP1: [headerConstructor],   
    TRYJUMPREPEAT1: statement,     
    CHECK1: ["end"],
    RESULT:[]     
}


var methodOrConstructor = {                        //CHECK2
    NAME:"methodOrConstructor",
    END: [method,constructor],    
    JUMP1: [method,constructor], 
    RESULT:[]    
}

var looksLike = {               //CHECK2
    NAME:"implementedInterfaces",
    END: ["name()"], 
    CHECK1: ["looks"],
    CHECK2: ["like"],
    CHECK3: ["a"],    
    JUMPFUNCTION1: "name()",
    CYCLE1: [",","name()"],
    RESULT:[]      
}

var kindOf = {               //CHECK2
    NAME:"superclass",
    END: ["name()"], 
    CHECK1: ["is"],
    CHECK2: ["a"],
    CHECK3: ["kind"], 
    CHECK4: ["of"],
    JUMPFUNCTION1: "name()",  
    RESULT:[]      
}

var classHeaderType1 = {             //CHECK2
    NAME:"classHeaderType1",
    END: [looksLike,kindOf], 
    JUMP1: [looksLike],
    TRYJUMP1: kindOf, 
    RESULT:[]    
}

var classHeaderType2 = {                 //CHECK2
    NAME:"classHeaderType2",
    END: [looksLike,kindOf], 
    JUMP1: [kindOf],
    TRYJUMP1: looksLike, 
    RESULT:[]    
}

var classHeader = {                      //CHECK2
    NAME:"classHeader",
    END: [classHeaderType1,classHeaderType2], 
    JUMP1: [classHeaderType1,classHeaderType2],       
    RESULT:[]    
}

var classDeclaration = {                     //CHECK2
    NAME:"classDeclaration",
    END: [methodOrConstructor], 
    CHECK1: ["class"],
    JUMPFUNCTION1: "name()",
    TRYJUMP1: classHeader,
    TRYJUMPREPEAT1: varDeclarations,
    JUMP1: [methodOrConstructor], 
    TRYJUMPREPEAT2: methodOrConstructor,   
    RESULT:[]     
}

/////////////////INTERFACE/////////////////////////
var interface ={                     //CHECK2
    NAME:"interfaceDeclaration",
    END: [methodHeader], 
    CHECK1: ["interface"], 
    JUMPFUNCTION1: "name()",    
    TRYJUMP1: looksLike,
    JUMP1: [methodHeader],
    TRYJUMPREPEAT1: methodHeader,    
    RESULT:[]
};

var classOrInterface = {             //CHECK
    NAME:"classOrInterface",
    END: [interface,classDeclaration],
    JUMP1: [interface,classDeclaration],
    RESULT:[]    
}


/////////////////DOCUMENT/////////////////////////
var documentCode = {                     //CHECK
    NAME:"documentCode",
    END: [classOrInterface],
    TRYJUMPREPEAT2: classOrInterface,    
    RESULT:[]   
}















 










    
    
    
  