


class methodHeaderDecl{
    constructor(name,parameters,returnType){       
        this.name = name;  //string
        this.parameters = parameters;  //slovnik - name,type
        this.returnType = returnType; //string             
    }
    
}

class numberConstant{
    constructor(value){
        this.value = value;
    }
    
    eval(){
        return this;
    }
}

class numberExpressionFormula{
    constructor(sign,arg1,arg2,operator){
        this.sign = sign,            
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.operator = operator;
    }
    
    static build(tree){  //numberExpression      
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
           
       
        if (tree[0].RESULT[0].NAME == "number"){          
            if (tree[0].RESULT[0].RESULT[0].NAME == "addsubOp"){   //sign before number
                if (tree[0].RESULT[0].RESULT[0].RESULT[0] == "-"){
                    var a1 = new numberConstant(parseFloat(tree[0].RESULT[0].RESULT[1] * (-1)));                    
                }
                else{
                    var a1 =  new numberConstant(parseFloat(tree[0].RESULT[0].RESULT[1])); 
                }                    
            }
            else{    //no sign before number           
                var a1 =  new numberConstant(parseFloat(tree[0].RESULT[0].RESULT[0]));                  
            }
        }                      
        
        else{
            //brackets
            if (tree[0].RESULT[0].RESULT[0].NAME == "addsubOp"){   //sign before bracket
                 if (tree[0].RESULT[0].RESULT[0].RESULT[0] == "-"){  
                    //console.log("za - je",tree[0].RESULT[0].RESULT[2].RESULT);
                    var pom = numberExpressionFormula.build(tree[0].RESULT[0].RESULT[2].RESULT);    //sign - before bracket                      
                    var a1 =  new numberExpressionFormula(1,new numberConstant(0),pom,"-");                                        
                }
                else{
                    //console.log("za + je",tree[0].RESULT[0].RESULT[2].RESULT);
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
        switch(this.operator){
                case "+":
                    return new numberConstant(this.arg1.eval().value + this.arg2.eval().value);
                case "-":
                    return new numberConstant(this.arg1.eval().value - this.arg2.eval().value);
                case "/":
                    return new numberConstant(this.arg1.eval().value / this.arg2.eval().value);
                case "*":
                    return new numberConstant(this.arg1.eval().value * this.arg2.eval().value);
                case "%":
                    return new numberConstant(this.arg1.eval().value % this.arg2.eval().value);
        }        
    }
}



class expressionFormula{
    static build(tree){
        var which = tree.NAME;
       
        switch(which){
            case "numberExpression":
                return numberExpressionFormula.build(tree.RESULT);
        }
    }
    
}

class printCall{
    constructor(expr){
        this.expr=expr;
    }
    
    static build(tree){
         
         return new printCall(expressionFormula.build(tree));
         
    }
    run(){
        console.log(this.expr.eval());
    }
}

class statementCall{
    static build(tree){
        var n = tree.NAME;
       
        if (n == "print"){
            return printCall.build(tree.RESULT[1]);
        }
        
    }
    
}

class methodDecl{
    constructor(name,parameters,returnType,statements){       
        this.name = name;  //string
        this.parameters = {};  //slovnik - name,type
        this.returnType = returnType; //string
        this.statements = [];   //array       
    }
    
    static build(tree){
       
        var m = new methodDecl();
        
        m.name = tree.RESULT[0].RESULT[1];
        if (tree.RESULT[0].NAME == "methodHeaderVoid"){
            m.returnType = "Void";            
        }
        else{
            m.returnType = tree.RESULT[0].RESULT[0];
        }
        if (typeof tree.RESULT[0].RESULT[3] == "object"){
            
            var params  = tree.RESULT[0].RESULT[3].RESULT;
            for (var i=0;i<params.lenght;i+=3){
                m.parameters[params[i]] =  params[i+1];    
                
                
            }
            //parametre
        }
         for (var i=0;i<tree.RESULT[1].RESULT.length;i++){
                             
                  m.statements.push(statementCall.build(tree.RESULT[1].RESULT[i]));                  
            
            //statements      
             
         }
        
        return m;   
        
    }
    
}

class constructorDecl{
      constructor(parameters,superClassConstructor,statements){       
        
        this.parameters = parameters;  //slovnik - name,type
        //this.superClassConstructor = superClassConstructor; //object
        this.statements = [];   //array       
    }
    
     static build(tree){
        
        var m = new constructorDecl();
        
       
        
        if (typeof tree.RESULT[0].RESULT[2] == "object"){
            
            var params  = tree.RESULT[0].RESULT[2].RESULT;
            for (var i=0;i<params.lenght;i+=3){
                m.parameters[params[i]] =  params[i+1];    
                
                
            }
            //parametre
        }
         //TO DO PARENT CONSTRUCTOR CALL
         for (var i=0;i<tree.RESULT[1].RESULT.length;i++){                             
                  m.statements.push(statementCall.build(tree.RESULT[1].RESULT[i]));                  
                //statements      
             
         }
        
        return m;  
        
        
    } 
    run(){
         for (var s in this.statements) { 
             //console.log(this.statements[s]);
             this.statements[s].run();
         }
    }
} 


class classDecl{
    constructor(name,superClass,implementedInterfaces,classVarDecl,classVarDeclInit,varDeclInit,varDecl,methods,constructors){       
        this.name = name;  //string
        this.superClass = superClass;  //string
        this.implementedInterfaces = implementedInterfaces;  //array
        this.classVarDecl = classVarDecl;   //array
        this.classVarDeclInit = classVarDeclInit;   //array
        this.varDeclInit = varDeclInit;   //array
        this.varDecl = varDecl;   //array      
        this.methods = {};     //dict
        this.constructors = [];   //array 
    }
    
    static build(tree){         
         
         var c = new classDecl(); 
         var methodSave;
         c.name = tree.RESULT[1];
        
         for (var i=2;i<tree.RESULT.length;i++){
             if (tree.RESULT[i].NAME == "methodOrConstructor"){
                 
                     if (tree.RESULT[i].RESULT[0].NAME == "method"){
                        methodSave = methodDecl.build(tree.RESULT[i].RESULT[0]);
                         c.methods[methodSave.name] = methodSave;
                     }
                    else{
                        methodSave = constructorDecl.build(tree.RESULT[i].RESULT[0]);
                         c.constructors.push(methodSave);
                        
                        
                    }
                                       
                                
             }      
         }   
        
        return c;
    
}
    
}


class interfaceDecl{
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
        this.classStartup = classStartup;
        this.classUser = classUser;
        this.classes = {}; //dict
        this.interfaces = {};
        
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
            
       return p;       
        
     }
     run(where){
        if (where=="client"){
            this.classUser.constructors[0].run();
           
           
        }
        
        
    }
}





function startBuild(){    
    
    var prg = Program.build(diagrams[0]);
    console.log("result of build WebiTree",prg);
    prg.run("client");
    
    
}

