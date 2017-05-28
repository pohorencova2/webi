var http = require('http');
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
const vm = require('vm');



vm.runInThisContext(fs.readFileSync('./diagrams.js','utf-8').toString(),'./diagrams.js');
vm.runInThisContext(fs.readFileSync('./parser.js','utf-8').toString(),'./parser.js');
vm.runInThisContext(fs.readFileSync('./scanner.js','utf-8').toString(),'./scanner.js');
vm.runInThisContext(fs.readFileSync('./syntaxTrees.js','utf-8').toString(),'./syntaxTrees.js');





var server = http.createServer(function (req, res) {
  var path = url.parse(req.url).pathname;

  switch(path){
	case '/': 
  		res.writeHead(200, {'Content-Type': 'text/plain'});
  		res.write('Hello World\nI am node.js');
		res.end();
		break;
	default:
   
		fs.readFile(__dirname + path, function(error, data) {
			if (error)
			{
				res.writeHead(404);
				res.end('the file is missing - 404');
			}
			else
			{
				res.writeHead(200, {'Content-type': 'text-html'});
				res.write(data, 'utf8');
				res.end();
			}
		});
		break;
	
  }
});


server.listen(8022, '127.0.0.1');
var listener = io.listen(server);
var programSource="#write code here#";
var programNuber = 0;
var serverRunning = false;


listener.sockets.on('connection', function(socket) {
    

	socket.on('disconnect',function(){
        //console.log("window closed") ;     
              });
	
    socket.on('error',function(){
        //console.log("IO error") ;     
              });
    
    socket.on('end',function(){
        //console.log("IO end") ;     
              });
	socket.on('message', function(data) {
		var cmd = data.cmd;
        switch (cmd){
            case "get-source":
                if (programNumber == 0){
                    socket.emit('message',{"cmd":"source","source":programSource});                    
                }
                else {
                    fs.readFile(__dirname + "/demo"+programNumber, "utf8", function(error, data) {
                        if (error)
                        {
                            //console.log("aaa",error);
                            programNumber = 0;
                        }
                        else
                        {
                            //console.log("aaa",data);
                             socket.emit('message',{"cmd":"source","source":data});
                        }
                    });
                    
                }
                
		        break;
            case "send-source":
                programSource = data.source;
		        break;
            case "get-webiTree":
                socket.emit('message',{"cmd":"webiTree","webiTree":webiTree});
		        break;
            case "send-webiTree":
                webiTree = data.webiTree;
		        break;
            case "select-demo":
                programNumber = data.number;
		        break;
            case "run":
                if (!serverRunning){
                    startServer()                    
                }
                
                break;
            case "restart":
               startServer();
                break;
            case "method-call":
                //console.log("receive method call");
                prg.rm.localMethodCall(data.refId,data.method,data.argTypes,data.argValues);
                break;
            case "new-client":
                newclient(socket);
                socket.emit('message',{"cmd":"client-id","client-id":newClientId});
		        break;
        }
        });
	
});


	
	function startServer(){
        serverRunning = true;
        //console.log("vypissssssss",typeof ahoj);
        var webiTree = build(programSource);
        
        startBuild(webiTree,"server", 0);
        
    }








