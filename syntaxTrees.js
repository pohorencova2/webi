

var internalClasses = new Set(["Number", "Boolean", "String","List","Dictionary","Json","Playground"]);
var prg;
var context = [];

var clients={};
var newClientId = 0;


function newclient(socket){
    newClientId++;
    //console.log("new client", newClientId);
    clients[newClientId] = socket;
}

function getClientSocket(node){
    //console.log("getting socket of client", node);
    //console.log("is", clients[node]);
    return clients[node];
}
class Referenced{
    
    constructor(){
        this.refCount = 1;
    }
    
    incrementRefCount(){
        this.refCount++;
    }
    decrementRefCount(){
        this.refCount--;
        if (this.refCount == 0){
            releaseAllReferences();
        }
    }
}

class PlaygroundValue extends Referenced{
    constructor(argum){
        super();
        var x = argum[0];
        var y = argum[1];
        var width = argum[2];
        var height = argum[3];
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.c = document.getElementById("canvas");
        this.ctx = this.c.getContext("2d");
        var t = document.getElementById("output");
        this.c.width = width;
        this.c.height = height;
        this.c.style.left = x+"px";
        this.c.style.top = y+"px";
        this.c.style.position = "absolute";
        t.width = width+2;        
        t.style.left = x+"px";
        t.style.top = y+height+15+"px";
        t.style.position = "absolute"; 
        this.borderColor = "black";
        this.borderWidth = "1px";
    }
    
    releaseAllReferences(){
        
    }
    
    getClassType(){
        return "Playground";
        
    }
    
    
    clearAll () {
        this.ctx.clearRect(0,0,this.c.width,this.c.height);        
    }
    
    bgColor(COLOR){
        this.c.style.backgroundColor = COLOR[0].getValue().join("");      
    } 
   
    brColor(COLOR ){
        this.borderColor = COLOR[0].getValue().join("");
         this.c.style.border =  this.borderWidth + " solid " +  this.borderColor;         
    }
    
    brWidth(WIDTH){
         this.borderWidth = WIDTH[0]+"px";
        this.c.style.border =  this.borderWidth + " solid " +  this.borderColor;   
        
    }
    width () 
    {
        return this.c.width;
    }
    height () 
    {
        return this.c.height;
    }
    
    drawRect (argum )
    {
        var X = argum[0];
        var Y = argum[1];
        var WIDTH = argum[2];
        var HEIGHT = argum[3];
        var COLOR = argum[4].getValue().join("");
        var BRCOLOR = argum[5].getValue().join("");   
        
        this.ctx.fillStyle = COLOR;
        this.ctx.fillRect(X,Y,WIDTH,HEIGHT);
        this.ctx.beginPath();
        this.ctx.strokeStyle = BRCOLOR;
        this.ctx.rect(X,Y,WIDTH,HEIGHT);
        this.ctx.stroke();
    }
     drawCircle(argum)
    {
        var centerX = argum[0];
        var centerY = argum[1];
        var R = argum[2];        
        var COLOR = argum[3].getValue().join("");
        var BRCOLOR = argum[4].getValue().join("");
        
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, R, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = COLOR;
      this.ctx.fill();
      this.ctx.strokeStyle = BRCOLOR;
      this.ctx.stroke();
    }

    drawArc (argum)
    {
        this.ctx.beginPath();
        var centerX = argum[0];
        var centerY = argum[1];
        var R = argum[2];        
        var S = argum[3];
        var E = argum[4]; 
        this.ctx.arc(centerX,centerY,R,S,E);
        this.ctx.stroke();
    }
    
    drawLine (argum)

    {
        var X1 = argum[0];
        var Y1 = argum[1];
        var X2 = argum[2];        
        var Y2 = argum[3];
        var COLOR = argum[4].getValue().join("");
        var WIDTH = argum[5];
        this.ctx.beginPath();
        this.ctx.moveTo(X1,Y1);
        this.ctx.lineTo(X2,Y2);
        this.ctx.lineWidth = WIDTH;
         this.ctx.strokeStyle = COLOR;
        this.ctx.stroke();
        
    }
   
     drawText (argum)
    {
        var X = argum[0];
        var Y = argum[1];
        var TEXT = argum[2].getValue().join("");
        this.ctx.font = "30px Arial";
        this.ctx.fillText(TEXT,X,Y);
    }
    
    drawImage (argum)
    {
        var X = argum[0];
        var Y = argum[1];
        var IMG = argum[2].getValue().join("");
        var imageObj = new Image();
        var conte = this.ctx;
        imageObj.onload = function(){
            conte.drawImage(imageObj,X,Y);
            
        }
        imageObj.src = IMG;
        
    }

    
    eval(){
        return this;
    }    
    
}

class FigureValue extends Referenced{
    constructor(argum){
        super();
        var IMG = argum[0];
        var X = argum[1];
        var Y = argum[2];
        
        this.img = IMG
        this.x = X;
        this.y = Y;
        this.c = document.getElementById("canvas");
        this.ctx = this.c.getContext("2d"); 
        
        this.f = document.createElement('canvas');
        this.ctx = this.f.getContext("2d");
        this.f.style.left = this.x+"px";
        this.f.style.top = this.y+"px";
        this.f.style.position = "absolute";
        /*this.f.width = this.x;
        this.f.height = this.y;*/
        
        
        var conte = this.ctx;        
        imageObj.onload = function(){
            conte.drawImage(IMG,0,0);            
        }
        imageObj.src = IMG;
        /*imageObj.style.height = 'px';
        imageObj.style.width = 'px';*/
        
        
    }
    releaseAllReferences(){
        
    }
    
    getClassType(){
        return "Figure";
        
    }
    
    
    
}

class ExecutionContext{
    constructor(currentInstance,localVariables){
        this.currentInstance= currentInstance;
        this.localVariables = {};
    }
    
    setVar(variable,value){
        var oldValue = this.localVariables[variable];
        if (oldValue instanceof Reference){
            oldValue.decrementRefCount();
            
        }
        
        this.localVariables[variable] = value;  
        if (value instanceof Reference){
            value.incrementRefCount();
            
        }
        
    }
    
    
    getVar(variable,value){
        return this.localVariables[variable];            
    }
    
    
    
    
} 

class Reference{
    constructor(remote,reference){
        this.remote = remote;
        this.reference = reference;
        this.incrementRefCount();
    }
    
    getClassType(){
        if (this.remote){
            return "*";
        }
        else{
            

            
            
            return this.reference.getClassType();
        }
        
    
    }
    
    eval(){
        if (this.remote){
            //TODO remote references
        }
        else{
            var val = this.reference.eval();
            if (val==this.reference){
                return this;
            }
            else{
                return new Reference(false,val);
            }
        }
        
    }
    decrementRefCount(){
        if (this.remote){
            //TODO remote references
        }
        else{
            this.reference.decrementRefCount();
        }
        
    }
    
    incrementRefCount(){
        if (this.remote){
            //TODO remote references
        }
        else{
            this.reference.incrementRefCount();
        }
        
    }
    
    setVar(variable,value){
        if (this.remote){
            //TODO remote references
        }
        else{
            this.reference.setVar(variable,value);
        }    
    }
    
    getVar(variable){
        if (this.remote){
            //TODO remote references
        }
        else{
            this.reference.getVar(variable);
        }
    }
    
    getValue(){
        if (this.remote){
            //TODO remote references
        }
        else{
            //console.log("referenceee",this.reference);
            //console.log("referenceee",this.reference.value);
            return this.reference.value;
        }
    }
    methodCall(method,evaluatedValues,evaluatedTypes){
        if (this.remote){
            prg.rm.methodCall(this.reference,method,evaluatedValues,evaluatedTypes);
        }
        else{
            
            callMethod(this.reference,method,evaluatedValues,evaluatedTypes)
        }
        
    }
    
}


class ObjectInstance extends Referenced{
    constructor(classType){ 
        super();
        
        this.classType = classType;
        this.objectVar = {};
    }
    
    getClassType(){
        return this.classType;
    }
    
    setVar(variable,value){
        this.objectVar[variable] = value;     
    }
    
    getVar(variable){
        return this.objectVar[variable];
    }
    
    releaseAllReferences(){
            for (var key in this.objectVar){
                this.objectVar[key].decrementRefCount();
                this.objectVar[key] = undefined;                
            }
        
    }
    
}



class methodHeaderDecl{
    constructor(name,parameters,returnType){       
        this.name = name;  //string
        this.parameters = parameters;  //slovnik - name,type
        this.returnType = returnType; //string             
    }
    
}

/*class NumberConstant{
    constructor(value){
        this.value = value;
    }
    
    eval(){
        return this;
    }
}*/

class numberExpressionFormula{
    constructor(sign,arg1,arg2,operator){
        this.sign = sign,            
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
    }
    
    static build(tree){  //numberExpression   
        //console.log("som v number exression",tree);
        //NEmuldiv         
        var a1 = numberExpressionFormula.build2(tree[0].RESULT); //numberOrBrackets          
        if (tree.length == 1){ //without addsubOp
            return a1;
        }        
        var op = tree[1].RESULT[0]; //addsubOp         
        if (tree.slice(2,tree.length).length > 1){
            var a2 = numberExpressionFormula.build(tree.slice(2,tree.length)); //numberOrBrackets            
        }
        else{
            var a2 = numberExpressionFormula.build2(tree[2].RESULT); //numberOrBrackets
        }        
        return new numberExpressionFormula(1,a1,a2,op);
           
    }    
    
    static build2(tree){ 
        //numberOrBrackets
        //number  
           
       //console.log("numberOrBrackets",tree);
        if (tree[0].RESULT[0].NAME == "number"){          
            if (tree[0].RESULT[0].RESULT[0].NAME == "addsubOp"){   //sign before number
                if (tree[0].RESULT[0].RESULT[0].RESULT[0] == "-"){
                    var a1 = parseFloat(tree[0].RESULT[0].RESULT[1] * (-1));  // NumberConstant(parseFloat(tree[0].RESULT[0].RESULT[1] * (-1)));                     
                }
                else{
                    var a1 =  parseFloat(tree[0].RESULT[0].RESULT[1]); //new NumberConstant(parseFloat(tree[0].RESULT[0].RESULT[1])); 
                }                    
            }
            else{    //no sign before number           
                var a1 =  parseFloat(tree[0].RESULT[0].RESULT[0]);  //new NumberConstant(parseFloat(tree[0].RESULT[0].RESULT[0]));                  
            }
        }                      
        
        else{
            //brackets
            if (tree[0].RESULT[0].RESULT[0].NAME == "addsubOp"){   //sign before bracket
                 if (tree[0].RESULT[0].RESULT[0].RESULT[0] == "-"){  
                    ////console.log("za - je",tree[0].RESULT[0].RESULT[2].RESULT);
                    var pom = numberExpressionFormula.build(tree[0].RESULT[0].RESULT[2].RESULT);    //sign - before bracket                      
                    var a1 =  new numberExpressionFormula(1,pom,new NumberConstant(0),"-");                                        
                }
                else{
                    ////console.log("za + je",tree[0].RESULT[0].RESULT[2].RESULT);
                    var a1 = numberExpressionFormula.build(tree[0].RESULT[0].RESULT[2].RESULT);  // sign + before bracket
                }           
            }
            else{  //not sign before brackets               
                var a1 =  numberExpressionFormula.build(tree[0].RESULT[0].RESULT[1].RESULT);  //numberExpression
            }     
        }
        
        
        if (tree.length == 1){ //without muldivOp
            return a1;
        }
      
        var op = tree[1].RESULT[0]; //muldivOp 
       
        if (tree.slice(2,tree.length).length > 1){   
            
            var a2 = numberExpressionFormula.build2(tree.slice(2,tree.length)); //numberOrBrackets            
        }
        else{           
           
            var a2 = numberExpressionFormula.build2([tree[2]]); //numberOrBrackets
        }                  
        return new numberExpressionFormula(1,a1,a2,op);
    }
    
       
    eval(){
	    var a2v = this.arg2;
		var a1v = this.arg1;
        if (!isNumber(this.arg2)) a2v = this.arg2.eval();
        if (!isNumber(this.arg1)) a1v = this.arg1.eval();
        console.log("a2", a2v);
		console.log("a1", a1v);
		console.log("op", this.operator);
		
		switch(this.operator){
                case "+":         
                    return a2v + a1v; //new NumberConstant(this.arg2.eval().value + this.arg1.eval().value);
                case "-":
                    return a2v - a1v;
                case "/":
                    return a2v / a1v;
                case "*":                    
                    return a2v * a1v;
                case "%":
                    return a2v % a1v;
        }        
    }
}


class StringValue extends Referenced{
    constructor(value){
        super();
        this.value = value;
        this.constant = true;
    }
    
    releaseAllReferences(){
        
    }
    
    getClassType(){
        return "String";
        
    }
    
    length(){      
        //console.log(this.value.length);
        return this.value.length;
    }
    
    
    
    setInternal(pos,change){       
        this.value[pos] = change;        
    }
    
    set(argum){         
        var a = argum[1].getValue().join("");
        this.setInternal(argum[0],a);               
    }
    
   /* get(argum){         
        this.setInternal(argum[0],argum[1].value);                
    }*/
    
    
    eval(){        
        return this;
    }
    
}


class StringConstant{
    constructor(value){
        //console.log("valueVStringu",this.value);
        this.value = value.split("");
    }
    
    eval(){        
        return new Reference(false,new StringValue(this.value)); 
        //return this;
    }
}

class stringExpressionFormula{
    constructor(arg1,arg2){                   
        this.arg1 = arg1;
        this.arg2 = arg2;       
    }
    
    static build(tree){  //stringExpression result
        //console.log("stringExpr",tree);
        if (tree[0].NAME == "stringFirst"){              //stringFirst
            
            var a1 = stringExpressionFormula.build([tree[0].RESULT[0]]);  //stringOperant           
            var solve = tree[0].RESULT.slice(2,tree[0].RESULT.length);       
            while (true){                     
                a1 = new stringExpressionFormula(a1, stringExpressionFormula.build2([solve[0]]));
                if (solve.length == 1){
                    return a1;
                }                
            solve = solve.slice(2,solve.length);               
            }            
        }
        
        else if (tree[0].NAME == "stringOperant"){        //stringOperant
            //console.log("stringOperant");
            if (typeof tree[0].RESULT[0] == "object"){     //SEbrackets
                return stringExpressionFormula.build(tree[0].RESULT[0].RESULT[1].RESULT);   //stringExpression result                
            }
            else{                                         //stringValue
                var str = tree[0].RESULT[0];                
                return new StringConstant(str.substring(1,str.length-1));                
            }
            
        }
        else{                                         //numberFirst    
            //console.log("tree v numberExpression v String",tree);            
            var a1 =  numberExpressionFormula.build(tree[0].RESULT[0].RESULT[1].RESULT);  //numberExpression  //jump noflipped flipped              
            var a2 = stringExpressionFormula.build(tree[0].RESULT[2].RESULT);         //stringExpression result            
        }        
        return new stringExpressionFormula(a1,a2);    
    
    }
    
    static build2(tree){   //numberOrString
        //console.log("numberOrString",tree);        
        if (tree[0].RESULT[0].NAME == "NEmuldivForString"){        //NEmuldivForString         
            return numberExpressionFormula.build([tree[0].RESULT[0].RESULT[1]]);      
        }
        else{             //stringOperant           
            return stringExpressionFormula.build([tree[0].RESULT[0]]);                
        }    
    }   
    
    eval(){    
        
        var a1 = this.arg1;
        var a2 = this.arg2;       
        if (isNumber(a1) == false){
            
            a1 = a1.eval().getValue().join("");            
        }
        if (isNumber(a2) == false){
            a2 = a2.eval().getValue().join("");            
        }
        //console.log(a1);
        //console.log(a2);
        //console.log("a1+a2",a1+a2);
        return new Reference (false,new StringValue(a1 + a2)); //new StringConstant(this.arg1.eval().value + this.arg2.eval().value);             
    }  
}



class BooleanConstant{
    constructor(value,not=false){
        this.value = value;
        this.not = not;    
    }
    
    eval(){
        if (this.not){             
            if (this.value == "true"){              
                return false;
            }            
            return true;
                      
        }
        if (this.value == "true"){                
            return true;
        }
        return false;
            
        
    }
}

class booleanExpressionFormula{
    constructor(arg1,arg2,operator){
        //this.sign = sign,            
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
    }
    
    static build(tree){  //booleanExpression 
        //console.log("booleanExpression",tree);           
       
        var a1 = booleanExpressionFormula.build2(tree[0].RESULT); //BEoperant          
        if (tree.length == 1){             //without logicalOp
            return a1;
        } 
        //with logicalOp
        
        
        
        var op = tree[1].RESULT[0]; //addsubOp  
        //console.log(op);
        
        if (tree.slice(2,tree.length).length > 1){
            var a2 = booleanExpressionFormula.build(tree.slice(2,tree.length)); //BEoperant            
        }
        else{
            var a2 = booleanExpressionFormula.build2(tree[2].RESULT); //BEoperant
        } 
        //console.log(a1,a2);
        return new booleanExpressionFormula(a1,a2,op);
        
        
        
        
    }
    
    static build2(tree){
        //BEoperant
        var not = false;
        //console.log("BEoperant",tree); 
        if (tree.length > 1){    //if operator not
            
            if (tree[1].NAME == "booleanValue"){         ///booleanValue                
                return new BooleanConstant(tree[1].RESULT[0],true);
            }          
        }
        
        else{
            if (tree[0].NAME == "booleanValue"){         ///booleanValue
                return new BooleanConstant(tree[0].RESULT[0],false);
            } 
            
        }
        
        
           
        
    }
    
    
    eval(){
        switch(this.operator){
                case "&&":
                    return new BooleanConstant(this.arg1.eval() && this.arg2.eval()).value;
                case "||":             
                    //console.log("first",this.arg1.eval());
                    //console.log("second",this.arg2.eval());
                
                    return new BooleanConstant(this.arg1.eval() || this.arg2.eval()).value;
                /*case "/":
                    return new numberConstant(this.arg2.eval().value / this.arg1.eval().value);
                case "*":
                    return new numberConstant(this.arg2.eval().value * this.arg1.eval().value);
                case "%":
                    return new numberConstant(this.arg2.eval().value % this.arg1.eval().value);*/
        }        
    }           

}



class Variable{
    constructor(variable){                   
        this.variable = variable;       
    }
    
    static build(tree){ 
        return new Variable(tree.RESULT[0]);
    }
    
    eval(){  
        //console.log("som v eval of variable")
        if (this.variable in context[context.length-1].localVariables){
            return context[context.length-1].getVar(this.variable);            
        }
        else if (this.variable in context[context.length-1].currentInstance.objectVar) {
            
            return context[context.length-1].currentInstance.getVar(this.variable);              
        }
        else{
            //console.log(context[context.length-1].currentInstance.objectVar);
            //console.log("chyba");
        }
        
              
    }
    
}


class expressionFormula{
    static build(tree){
        var which;
        //console.log("expresionFormula",tree);
        
        if (tree.NAME == "expr"){ 
            if (typeof tree.RESULT[0] == "object"){
                which = tree.RESULT[0].NAME;
                tree = tree.RESULT[0];                 
            }
            else{
                which = "varName";                
            }                      
        }
        else{
            which = tree.NAME;            
        }               
        
        switch(which){
            
            case "numberExpression":  
                //console.log("numberexpression",tree);
                return numberExpressionFormula.build(tree.RESULT[1].RESULT);   //jump numberExpressionNoFlipped, numberExpressionFlipped
                
            case "stringExpression":
                return stringExpressionFormula.build(tree.RESULT);
                
            case "booleanExpression":
                return booleanExpressionFormula.build(tree.RESULT);
            
            case "createInstance":                
                return constructorCall.build(tree);
            
            case "varName":   
                return Variable.build(tree);    
            
            case "methodCall": 
                return methodsCall(tree);
                
            case "instanceMethodCall": 
                return methodsCall(tree);
                
                
            //TODO constructorCall
        }
    }
    
}


class declarationCall{
    constructor(type,variable,value){ 
        this.type = type;
        this.variable = variable;
        this.value = value;        
    }
    
    static build(tree){
        //console.log("declarationCall",tree);
        var type;
        var variab;
        var val;
        if (typeof tree[0] == "object"){
            type = tree[0].RESULT[0];
            variab = tree[0].RESULT[1];
            val = expressionFormula.build(tree[2].RESULT[0]);
            
        }
        else{
            type = tree[0];
            variab = tree[1];
            val = undefined;
        }        
        
        return new declarationCall(type,variab,val);
    }
    
    run(){
        if (this.value == undefined){   //varDecl
            context[context.length-1].setVar(this.variable,this.value);
        }
        else{   //varDeclInit            
            context[context.length-1].setVar(this.variable,this.value);            
            new assignCall(this.variable,"=",this.value).run();
            
        }
    }
    
}



class constructorCall{    
    
    constructor(name,values){         
        this.values = values;          
        
        if (internalClasses.has(name)){
            this.internal = true; 
            this.name = name+"Value";
        }
        else{
            this.internal = false; 
            this.name = name;
        }
       
    }
    
    static build(tree){
        //console.log("constructorCall",tree);      
        var name = tree.RESULT[0];         //name
        var values = [];
        
        if (typeof tree.RESULT[2] == "object"){   //values
            for (var i=0;i<tree.RESULT[2].RESULT.length;i+=2){                
                values.push(expressionFormula.build(tree.RESULT[2].RESULT[i].RESULT[0]));                
            }            
        }
        var c = new constructorCall(name,values);
        //console.log("con",c);
        return c;     
    }    
    
    
    eval(){
        var evaluatedValues=[];
        var evaluatedTypes=[];
        var itsClass;
        var val;
        for (var index in this.values){
            
            var v = this.values[index];
            if (isNumber(v)){
                val = v;  
                itsClass = "Number";
            }
            else{
                ////console.log("vaaaaaaal",this.values[v]);
               val =v.eval();                
               itsClass = val.getClassType();             
            }                   
            evaluatedValues.push(val);                  
            evaluatedTypes.push(itsClass); 
        }        
        
        if (this.internal){
            return new Reference(false,eval("new "+ this.name+"(evaluatedValues)"));
        }  
        //console.log("naaaaaaaaaame",this.name);
        var obj = new ObjectInstance(prg.classes[this.name]);     
        context.push(new ExecutionContext(obj));
        if (this.name == "User" || this.name == "Startup"){
          prg.rm = new RemoteManager(obj);  
        }
        
        obj.getClassType().findConstructor(evaluatedTypes).run(obj,evaluatedValues); //ulozit param do execut a object variable
        context.pop();       
        return new Reference(false,obj);   
    } 
}


class RemoteManager{
    constructor(mainInstance){
        this.remoteReferences = {};
        this.newId1 = 0;
        this.remotelyReferenced = {};
        this.newId2 = 1;
        if (!prg.isServer){
            this.remoteReferences[0] = {"node":0,"remoteId":0,"refCount":1};
            this.newId1++;
        }
        else
        {
            this.remoteReferences[0] = {"node":1,"remoteId":0,"refCount":1};
            this.newId1++;
        }
        this.remotelyReferenced[0] = {"localRef":mainInstance,"refCount":0};
    }
    
    methodCall(reference,method,evaluatedValues,evaluatedTypes){
        var node = this.remoteReferences[reference].node;
        var remoteId = this.remoteReferences[reference].remoteId;
        var values = [];
        for (var i=0;i<evaluatedValues.length;i++){
            if (isNumber(evaluatedValues[i])){
                values.push(evaluatedValues[i]);
            }
            else{
                if (evaluatedValues[i].remote){
                    var rid= evaluatedValues[i].reference;
                    values.push([this.remoteReferences[rid].node,this.remoteReferences[rid].remoteId]);
                }
                else{
                     var found = false;
                     for (var i=0;i<this.remotelyReferenced.length;i++){
                        if (this.remotelyReferenced[i].localRef == evaluatedValues[i].reference){
                            values.push([prg.nodeId,i]);
                            found = true;
                        }
                         
                     }
                    if (!found){
                      this.remotelyReferenced[newId2] = {"localRef":evaluatedValues[i].reference,"refCount":0};                        
                      
                      values.push([prg.nodeId,this.newId2]);
                        this.newId2++;
                    }
                    
                }
            }
        }
        if (!prg.isServer){
            //console.log("sending method call");
            var socket = getServerSocket();
           socket.emit('message',{"cmd":"method-call","refId":remoteId,"method":method,"argTypes":evaluatedTypes,"argValues":values});
        }
        else{
             //console.log("sending method call client", node);           
            var socket = getClientSocket(node);
            socket.emit('message',{"cmd":"method-call","refId":remoteId,"method":method,"argTypes":evaluatedTypes,"argValues":values}); 
        }
    }
    localMethodCall(refId,method,evaluatedTypes,values){
        var ref = this.remotelyReferenced[refId].localRef;
        var processValues = [];
        for (var i=0;i<values.length;i++){
            if (isNumber(values[i])){
                processValues.push(values[i]);
                
            }
            else{
                if (values[i][0]== prg.nodeId){
                    
                    processValues.push(new Reference(false,remotelyReferenced[values[i][1]].localRef));
                }
                else{
                    var found = false;
                    var index = 0;
                    for (var j = 0; j < this.remoteReferences.length; j++){
                        if ((this.remoteReferences[j].node == values[i][0]) &&
                            (this.remoteReferences[j].remoteId == values[i][1])) {
                            found = true;
                            index = j;
                            ref = new Reference(true, j);
                        }
                    }
                    if (!found) {
                        remoteReferences[newId1] = {"node": values[i][0], "remoteId": values[i][1]};
                        index = newId1;
                        newId1++;
                    }
                        
                    processValues.push(new Reference(true,index)); 
                }
            }
        }
        callMethod(ref, method, processValues, evaluatedTypes);
    }
}


class methodsCall{    

    constructor(name,values,leftExpr){  
        this.name = name;
        this.values = values;    
        this.leftExpr = leftExpr;        
        /*if (this.leftExpr != undefined){            
            if (this.leftExpr instanceof ObjectInstance){
                //console.log("som tu2");
                this.internal = false;                
            }
            else{
                this.internal = true;                
            }        
        }
        else{
            this.internal = false;        //OPYTAT SA
        }    */
    }
    
    static build(tree){
        //console.log("build v method",tree);
        var leftExpr;
        var name;
        var values = [];  
        var v = false;
        
        if (typeof tree[0] == "object"){  //with leftExpr
            leftExpr = expressionFormula.build(tree[0].RESULT[0]);
            name = tree[2].RESULT[0];             
            if (typeof tree[2].RESULT[2] == "object"){   //values
                tree = tree[2].RESULT[2]; 
                v = true;
            }    
        }
        else{            
            name = tree[0];   //without leftExpr
            if (typeof tree[2] == "object"){   //values
                tree = tree[2];    
                v = true;
            }                     
        }
        
        if (v){
            for (var i=0;i<tree.RESULT.length;i+=2){    //values            
                values.push(expressionFormula.build(tree.RESULT[i].RESULT[0]));                
            }
        }
       
        var m = new methodsCall(name,values,leftExpr); 
        //console.log("method",m);
        return m;
    }
    
    eval(){
        //console.log('evaaaaaaaaaaaaaaaal');
    }
           
    run(){   //void
        //console.log("methodCAAAL");
        var evaluatedValues=[];
        var evaluatedTypes=[];
        var itsClass;
        var val;     
        for (var index in this.values){
            var v = this.values[index];
            if (isNumber(v)){
                val = v;  
                itsClass = "Number";
            }
            else{
                ////console.log("vaaaaaaal",this.values[v]);
               val =v.eval();                
               itsClass = val.getClassType();                
               
            }
                   
            evaluatedValues.push(val);
                  
            evaluatedTypes.push(itsClass);            
        }
        
       
        var evalval;
        if (this.leftExpr != undefined){ 
            evalval = this.leftExpr.eval();
            //console.log("what is?", evalval);
            evalval.methodCall(this.name,evaluatedValues,evaluatedTypes);        
        }
        else{
            this.internal = false;        //OPYTAT SA
            evalval = context[context.length-1].currentInstance;
            callMethod(evalval,this.name,evaluatedValues,evaluatedTypes);
        }    
        
        
        
    }     
}

function callMethod(instance,method,evaluatedValues,evaluatedTypes){
    var internal = true;
    if (instance instanceof ObjectInstance){
                //console.log("som tu2");
                internal = false;                
    }
           
    if (internal){           
        eval("instance"+"." + method+"(evaluatedValues)");     
    } 
    else{
        var met;
        context.push(new ExecutionContext(instance));
        met = instance.getClassType().findMethod(method,evaluatedTypes);                

        met.run(evaluatedValues);   //add into current context attributes
        context.pop();
    }
}

class printCall{
    constructor(expr){
        this.expr=expr;
    }
    
    static build(tree){    
        //console.log("printCall",tree);
        return new printCall(expressionFormula.build(tree.RESULT[0]));
         
    }
    run(){        
        var wasNumber = true;
		var evaluated = this.expr;
		console.log(this.expr);
		
        if (isNumber(evaluated) == false){      //CHECK FOR INTERNAL OR NOT
            evaluated = this.expr.eval();
			console.log(evaluated);
            if (isNumber(evaluated) == false) {
				console.log(evaluated);
                console.log(typeof evaluated);
                this.printOut(evaluated.getValue().join("")  + "\n");
                wasNumber = false;                   
			}
        }
		if (wasNumber) {
            this.printOut(evaluated + "\n");           
        }
        
    }
    
    printOut(msg){
        if (prg.isServer){
            console.log("SERVER OUTPUT:",msg);
        }
        else{
             document.getElementById("output").value += msg;
        }
        
    }
}

class forStatementCall{
    constructor(variable,start,end,step,statements){
        this.variable =  variable;
        this.start =  start;
        this.end =  end;
        this.step =  step;
        this.statements =  [];
    }
    
    static build(tree){       
        var forStat = new forStatementCall();
        forStat.variable = tree[1];
        
        var steps = tree.slice(4,tree.indexOf("]"));
        
        
        if (steps.length == 1 ){
            forStat.end = expressionFormula.build(tree[4]).eval().value; 
        }
        else if (steps.length == 2 ){
            forStat.start = expressionFormula.build(tree[4]).eval().value; 
            forStat.end = expressionFormula.build(tree[5].RESULT[1]).eval().value;              
        }
        else {
            forStat.start = expressionFormula.build(tree[4]).eval().value;             
            forStat.end = expressionFormula.build(tree[5].RESULT[1]).eval().value; 
            forStat.step = expressionFormula.build(tree[6].RESULT[1]).eval().value;             
        }  
        //console.log(forStat.start,forStat.end,forStat.step);
        var stats = tree.slice(tree.indexOf("]")+1,tree.length-1);
        for (var i = 0;i<stats.length;i++){                                                  
            forStat.statements.push(printCall.build(stats[i].RESULT[0].RESULT[1]));
        }
        //console.log("statements", forStat.statements);
        
        return forStat;
         
    }  
    
    
    run(){
        if (this.step != undefined){
            for (var i=this.start;i<this.end;i+=this.step){
                for (var s in this.statements){
                    this.statements[s].run();
                }                    
            }            
        }
        else{
            if (this.start != undefined){
                for (var i=this.start;i<this.end;i++){
                    for (var s in this.statements){
                        this.statements[s].run();
                    }                    
                }     
            } 
            else{
                for (var i=0;i<this.end;i++){
                    for (var s in this.statements){
                        this.statements[s].run();
                    }                    
                } 
            }
            
        }      
    }
}

class assignCall{
    
    constructor(variable,operator,value){
        this.variable =  variable;
        this.operator = operator;
        this.value = value;
    }
    
    static build(tree){        
        var variab = tree[0].RESULT[0];
        var oper = tree[1].RESULT[0];
        var val = expressionFormula.build(tree[2].RESULT[0]);       
        return new assignCall(variab,oper,val);
    }
    
    run(){  
        var newVal = this.value;
        //console.log("newVal1",newVal);
        
        if (isNumber(newVal) == false){
            newVal = newVal.eval();
            /*if (isNumber(newVal) == false){
                newVal = newVal.value;
                //console.log('newVal',newVal);                
            } */           
        }
        if (this.variable in context[context.length-1].localVariables){
            switch(this.operator){                 
                case "=":
                    context[context.length-1].setVar(this.variable,newVal); 
                    break;                
                case "+=":   
                    var val = context[context.length-1].getVar(this.variable);
                    context[context.length-1].setVar(this.variable,val+newVal);                    
                    break;
                 case "-=":   
                    var val = context[context.length-1].getVar(this.variable);
                    context[context.length-1].setVar(this.variable,val-newVal);                    
                    break;
                 case "*=":   
                    var val = context[context.length-1].getVar(this.variable);
                    context[context.length-1].setVar(this.variable,val*newVal);                    
                    break;
                 case "/=":   
                    var val = context[context.length-1].getVar(this.variable);
                    context[context.length-1].setVar(this.variable,val/newVal);                    
                    break;
                 case "%=":   
                    var val = context[context.length-1].getVar(this.variable);
                    context[context.length-1].setVar(this.variable,val%newVal);                    
                    break;               
            }                      
        }
        else if (this.variable in context[context.length-1].currentInstance.objectVar) {
            switch(this.operator){                 
                case "=":
                    context[context.length-1].currentInstance.setVar(this.variable,newVal);
                    break;                
                case "+=":   
                    var val = context[context.length-1].currentInstance.getVar(this.variable);
                    context[context.length-1].currentInstance.setVar(this.variable,val+newVal);                    
                    break;
                 case "-=":   
                    var val = context[context.length-1].currentInstance.getVar(this.variable);
                    context[context.length-1].currentInstance.setVar(this.variable,val-newVal);                    
                    break;
                 case "*=":   
                    var val = context[context.length-1].currentInstance.getVar(this.variable);
                    context[context.length-1].currentInstance.setVar(this.variable,val*newVal);                    
                    break;
                 case "/=":   
                    var val = context[context.length-1].currentInstance.getVar(this.variable);
                    context[context.length-1].currentInstance.setVar(this.variable,val/newVal);                    
                    break;
                 case "%=":   
                    var val = context[context.length-1].currentInstance.getVar(this.variable);
                    context[context.length-1].currentInstance.setVar(this.variable,val%newVal);                    
                    break;                
            }          
                          
        }
        else{            
            //console.log("chyba");
        }
        
        
                 
    }
    
}



class statementCall{
    static build(tree){
        var stat = tree.NAME;
        switch(stat){
            case "print":                
                return printCall.build(tree.RESULT[1]);
                
            case "varDecl":
                //console.log("varDecl statement");
                return declarationCall.build(tree.RESULT);          
            case "varDeclInit":
                //console.log("varDeclInit statement");
                 return declarationCall.build(tree.RESULT);
            case "methodCall":
                //console.log("methodCall statement");
                return methodsCall.build(tree.RESULT); 
            case "instanceMethodCall":
                //console.log("instanceMethodCall statement");
                return methodsCall.build(tree.RESULT);                
            case "assign":                
                return assignCall.build(tree.RESULT);  
                break;
            case "forStatement":
                return forStatementCall.build(tree.RESULT);
        }
                
        
    }
    
}

class methodDecl{
    
    constructor(name,parameters,returnType,statements){       
        this.name = name;  //string    DONE
        this.parameters = [];  //slovnik - name,type  DONE
        this.returnType = returnType; //string       DONE
        this.statements = [];   //array        DONE
    }
    
    static build(tree){       
        var m = new methodDecl();
        //console.log("methodDecl",tree);
        
        m.name = tree.RESULT[0].RESULT[1];
        if (tree.RESULT[0].NAME == "methodHeaderVoid"){
            m.returnType = "Void";            
        }
        else{
            m.returnType = tree.RESULT[0].RESULT[0];
        }
        if (typeof tree.RESULT[0].RESULT[3] == "object"){    //parametre            
            var params  = tree.RESULT[0].RESULT[3].RESULT;
            for (var i=0;i<params.length;i+=3){
                 m.parameters.push([params[i],params[i+1]]); 
                
                //m.parameters[params[i]] =  params[i+1];               
            }           
        }
        if (tree.RESULT.length >= 3){    //statements              
            for (var i=1;i<tree.RESULT.length-1;i++){
                m.statements.push(statementCall.build(tree.RESULT[i].RESULT[0]));                
            }
        }        
        return m;           
    }   
    
    run(val){  
        for (var i=0;i<val.length; i++){
            context[context.length-1].setVar(this.parameters[i][1],val[i]);
        }
         for (var s in this.statements) {              
             this.statements[s].run();
         }
         
    }
    
}

class constructorDecl{
      constructor(name,parameters,superClassConstructor,statements){  
        this.name = name;
        this.parameters = [];  //slovnik - name,type     DONE 
        //this.superClassConstructor = superClassConstructor; //object  VYNECHANE   ?patri ku statements?
        this.statements = [];   //array  DONE     
    }
    
     static build(tree){     
         var m = new constructorDecl();         
         m.name = tree.RESULT[0].RESULT[0];
        
         if (typeof tree.RESULT[0].RESULT[2] == "object"){   //parameters            
             var params  = tree.RESULT[0].RESULT[2].RESULT;           
             for (var i=0;i<params.length;i+=3){                
                 m.parameters.push([params[i],params[i+1]]);                                
             }           
         }
        
         
         if (tree.RESULT.length >= 3){    //statements                 
             for (var i=1;i<tree.RESULT.length-1;i++){  
                 m.statements.push(statementCall.build(tree.RESULT[i].RESULT[0]));          
             }         
         }        
         return m;         
    } 
    
    run(classRef,params){ 
        var paramName;        
        for (var i=0;i<this.parameters.length;i++){
            paramName = this.parameters[i][1];
            context[context.length-1].setVar(paramName,params[i]);            
        }
        
        for (var key in prg.classes[this.name].objVar){            
            classRef.setVar(key,undefined);     
            
        }   
        ////console.log("setting application",classRef.getClassType());
        if (classRef.getClassType().name == "User"){
            //console.log("setting application");
            classRef.setVar("APPLICATION",new Reference(true,0));
            
        }
        if (classRef.getClassType().name == "Startup"){
           classRef.setVar("USERS",new Reference(true,0));
            
        }
         for (var s in this.statements) {              
             this.statements[s].run();
         }
         
    }
} 




class classDecl{
    constructor(name,superClass,implementedInterfaces,classVarDecl,classVarDeclInit,varDeclInit,varDecl,methods,constructors){       
        this.name = name;  //string         DONE 
        this.superClass = superClass;  //string       VYNECHANE
        this.implementedInterfaces = implementedInterfaces;  //array     VYNECHANE
        /*this.classVarDecl = classVarDecl;   //array
        this.classVarDeclInit = classVarDeclInit;   //array
        this.varDeclInit = varDeclInit;   //array
        this.varDecl = varDecl;   //array */
        this.objVar = {};
        this.methods = {};     //dict       //DONE
        this.constructors = [];   //array   //DONE
    }
    
    findConstructor(paramTypes){        
        nextConstructor:
        for (var c in this.constructors){
            if (paramTypes.length == this.constructors[c].parameters.length){                
                for (var i=0;i<paramTypes.length;i++){                    
                    if (paramTypes[i] != this.constructors[c].parameters[i][0] ){                        
                        continue nextConstructor;
                    }
                }               
                return this.constructors[c];
            }            
        }       
    }
    
    findMethod(name,paramTypes){    
        //console.log("hladam metodu",this);
        nextMethod:
        for (var m in this.methods){           
            if (name == m){  
                //console.log(this.methods[m]);
                if (paramTypes.length == this.methods[m].parameters.length){ 
                    

                    for (var i=0;i<paramTypes.length;i++){                    
                        if ((paramTypes[i] != this.methods[m].parameters[i][0] ) &&
                            (paramTypes[i] != "*"))                        
                            continue nextMethod;
                        }
                    }               
                    return this.methods[m];
                }  
            }
        }       
    
    
    
    
    static build(tree){  
        //console.log("classDecl",tree);
         
        var c = new classDecl(); 
        var methodSave;
        var from;
        c.name = tree.RESULT[1];          
        
        
         for (var i=2;i<tree.RESULT.length;i++){            
             if (tree.RESULT[i].NAME == "methodOrConstructor"){
                 if (tree.RESULT[i].RESULT[0].NAME == "method"){
                    methodSave = methodDecl.build(tree.RESULT[i].RESULT[0]);
                    c.methods[methodSave.name] = methodSave;
                 }
                 else{    //constructor
                    methodSave = constructorDecl.build(tree.RESULT[i].RESULT[0]);
                    c.constructors.push(methodSave);
                 }                        
             }   
             else if (tree.RESULT[i].NAME == "classHeader"){
                //console.log("classHeader");
             }
             else{              //varDeclarations                
                 if (tree.RESULT[i].RESULT[0].NAME == "classVarDeclInit"){
                     //console.log("classVarDeclInit");                     
                 }
                 else if (tree.RESULT[i].RESULT[0].NAME == "varDeclInit"){
                     //console.log("varDeclInit");                     
                 }
                 else if (tree.RESULT[i].RESULT[0].NAME == "classVarDecl"){
                     //console.log("classVarDecl");                     
                 }
                 else{
                      c.objVar[tree.RESULT[i].RESULT[0].RESULT[1]] = undefined;                
                      //console.log("varDecl");                     
                 }
                 
             }
        
         }   
        
        return c;
    
}
    
}


class interfaceDecl{     //VYNECHANE
    constructor(name,implementedInterfaces,methodHeaders){       
        this.name = name;  //string
        this.implementedInterfaces = implementedInterfaces;  //array
        this.methodHeaders = methodHeaders;   //array       
    }
    
    static build(tree){
        
    }
}



class Program{
    
    constructor(classStartup,classUser,classes,interfaces){
        this.classStartup = classStartup;   //DONE
        this.classUser = classUser;   //DONE
        this.classes = {};             //DONE
        this.interfaces = {};          //VYNECHANE 
        
    }
    
    static build(tree){
        var classSave,interfaceSave;
        var p = new Program();
        
        for (var i=0;i<tree.RESULT.length;i++){
            if (tree.RESULT[i].RESULT[0].NAME == "classDeclaration"){
                classSave = classDecl.build(tree.RESULT[i].RESULT[0]);
                p.classes[classSave.name] = classSave;
                if (classSave.name=="User"){
                    p.classUser = classSave;
                }
                else if (classSave.name=="Startup"){
                    p.classStartup = classSave;
                }
                
            }
            else{
                interfaceSave = interfaceDecl.build(tree.RESULT[i].RESULT[0]);
                p.interfaces[interfaceSave.name] = interfaceSave;
            }           
                  
        }
       //console.log("program",p);     
       return p;       
        
     }
     run(where, nodeId){
         this.nodeId = nodeId;
        if (where=="client"){
            this.isServer = false;
            //create execution context   
            
            new constructorCall("User",undefined).eval();   //[5,10]
        
            //new constructorCall("User",undefined).run();
           // context.push(new ExecutionContext(new ObjectInstance(this.classUser)));  //aj premenne?//consturcotrcalll
            //this.classUser.constructors[0].run();
           
           
        }
        else{
             this.isServer = true;
            
             new constructorCall("Startup",undefined).eval();
            
        }
        
        
    }
}


 function build(source){        
       initParse(source);
       parse();  
       return diagrams[0];
       
       
    }


function startBuild(webiTree,who, nodeId, sock){    
    
    socket = sock;
    prg = Program.build(webiTree);
    //console.log("result of build WebiTree",prg);
    prg.run(who, nodeId);
    
    
}

//console.log("syntax trees loaded");

  
  