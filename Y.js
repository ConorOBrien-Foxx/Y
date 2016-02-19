function Y(code){
	this.origCode = code;
	this.links = [];
	this.implicitPrint = false;
	var curSection = "", linkIDs = "CDFJMPQX", stringMode = false;
	// parse links
	for(var i=0;i<code.length;i++){
		curSection += code[i];
		if(code[i] == "\\") i++;
		else {
			if(code[i] == "\"") stringMode = !stringMode;
			if(linkIDs.indexOf(code[i])>=0 && !stringMode){
				this.links.push(curSection);
				curSection = "";
			}
		}
	}
	this.links.push(curSection);
	this.curLink = 0;
	this.index = 0;
	this.stack = [];
	this.done = false;
	this.commands = {
		"C": function(y){
			y.curLink++;
			y.index = -1;
		},
		"D": function(y){
			var t = y.stack.pop();
			if(t) y.curLink++
			y.index = -1;
			//y.stack.push(t);
		},
		"F": function(y){
			var t = y.stack.pop();
			if(!t) y.curLink++;
			y.index = -1;
		},
		"M": function(y){
			var t = y.stack.pop();
			y.curLink += t;
			y.index = -1;
		},
		"X": function(y){
			y.index = -1;
		},
		"\"": function(y){
			var chr, s = "";
			do {
				chr = y.links[y.curLink][++y.index];
				if(chr==="`") chr = y.links[y.curLink][++y.index];
				if(!chr){
					y.index = 0;
					chr = y.links[y.curLink][y.index];
				}
				s += chr;
			} while(chr!=="\"");
			y.stack.push(s.slice(0,-1));
		},
		"_": function(y){
			var x = y.stack.pop();
			y.stack.push(typeof x==="number"?-x:x.split?x.split("").reverse():x.reverse());
		},
		"z": function(y){
			y.implicitPrint = true;
		},
		"0": function(y){
			y.stack.push(0);
		},
		"1": function(y){
			y.stack.push(1);
		},
		"2": function(y){
			y.stack.push(2);
		},
		"3": function(y){
			y.stack.push(3);
		},
		"4": function(y){
			y.stack.push(4);
		},
		"5": function(y){
			y.stack.push(5);
		},
		"6": function(y){
			y.stack.push(6);
		},
		"7": function(y){
			y.stack.push(7);
		},
		"8": function(y){
			y.stack.push(8);
		},
		"9": function(y){
			y.stack.push(9);
		},
		"a": function(y){
			y.stack.push(10);
		},
		"b": function(y){
			y.stack.push(11);
		},
		"c": function(y){
			y.stack.push(12);
		},
		"d": function(y){
			y.stack.push(13);
		},
		"e": function(y){
			y.stack.push(14);
		},
		"f": function(y){
			y.stack.push(15);
		},
		"U": function(y){
			var chr;
			var b = "U";
			y.index++;
			do {
				chr = y.links[y.curLink][y.index];
				b += chr || "";
				if(chr=="!"){
					b += y.links[y.curLink][++y.index] || "";
				}
				if(y.index>=y.links[y.curLink].length){
					y.curLink++; y.index = 0;
					if(y.curLink>=y.links.length){
						y.curLink = 0;
						y.index = 0;
					}
					chr = y.links[y.curLink][y.index];
					b += chr || "";
				}
				y.index++;
			} while(chr!="U"&&chr);
			y.stack.push(b.slice(0,-1));
			y.index--;
		},
		";": function(y){
			y.stack = y.stack.concat(y.stack);
		},
		"r": function(y){
			y.stack.reverse();
		},
		"n": function(y){
			y.stack.push(y.links.length);
		},
		"p": function(y){
			var s = "";
			while(y.stack.length){
				s += y.stack.pop();
			}
			y.out(s);
		},
		"x": function(y){
			y.done = true;
		},
		"!": function(y){
			y.index++;
			//y.bound(Y.WRAP);
		},
		"*": function(y){
			var i = y.getTop(2);
			if(typeof i[0]=="string"&&typeof i[1]=="number"){
				y.stack.push(i[0].repeat(i[1]));
			} else if(typeof i[0]==typeof i[1]&&typeof i[1]=="number"){
				y.stack.push(i[0]*i[1]);
			}
		},
		"+": function(y){
			var i = y.getTop(2);
			if(typeof i[0]==="string"&&typeof i[1]==="string"||typeof i[0]==="number"&&typeof i[1]==="number"){
				y.stack.push(i[0]+i[1])
			} else if(typeof i[0]==="string"&&typeof i[1]==="number"){
				while(i[1] --> 0)
					y.stack.push(i[0]);
			}
		},
		"-": function(y){
			var i = y.getTop(2);if(typeof i[0]=="string"||typeof i[1]=="string"){
				y.stack.push(i[0].replace?i[0].replace(RegExp(i[1],"g")):i[1].replace(RegExp(i[0],"g")));
			} else if(typeof i[0]==typeof i[1]&&typeof i[1]=="number"){
				y.stack.push(i[0]-i[1]);
			}
		},
		"'": function(y){
			y.stack.push(y.links[y.curLink][++y.index]);
		},
		"@": function(y){
			y.stack.push(y.stack.pop().charCodeAt());
		},
		"#": function(y){
			y.stack.push(String.fromCharCode(y.stack.pop()))
		},
		"~": function(y){
			var t = y.stack.pop(), u = y.stack.pop();
			y.stack.push(t,u);
		},
		"$": function(y){
			y.stack.pop();
		},
		":": function(y){
			var r = y.stack.pop();
			y.stack.push(r,r);
		},
		"h": function(y){
			var i = y.stack.pop();
			if(typeof i==="string") y.stack.push(i.slice(1));
			y.stack.push(i+1);
		},
		"t": function(y){
			var i = y.stack.pop();
			if(typeof i==="string") y.stack.push(i.slice(0,-1));
			y.stack.push(i-1);
		},
		"s": function(y){
			y.stack.push(y.stack.pop()+"");
		},
		"i": function(y){
			y.stack.push(y.in("string input: "));
		},
		"j": function(y){
			y.stack.push(+y.in("number input: "));
		},
		"k": function(y){
			y.stack.push(parseInt(y.stack.pop(),y.stack.pop()));
		},
		"g": function(y){
			y.out(y.stack.pop())
		},
		"?": function(y){
			var t = y.stack.pop();
			if(!t) y.index++;
		},
		".": function(y){
			var t = y.stack.pop();
			if(!t) y.index++;
			y.stack.push(t);
		},
		"|": function(y){
			var op = y.commands[y.links[y.curLink][++y.index]];
			while(y.stack.length>1){
				op(y);
			}
		},
	}
}

Y.WRAP = function(y){
	y.curLink = 0;
	y.index = 0;
}

Y.prototype.out = function(s){
	console.log(s);
}

Y.prototype.in = function(s){
	return prompt(s||"Enter input: ");
}

Y.prototype.getTop = function(N){
	var s = [];
	while(N --> 0){
		s.push(this.stack.pop());
	}
	return s.reverse();
}

Y.prototype.bound = function(callback){
	callback = callback || (function(){});
	if(this.index>=this.links[this.curLink].length){
		this.curLink++; y.index = 0;
		if(this.curLink>=this.links.length) callback(this);
	}
}

Y.prototype.step = function(){
	if(typeof this.links[this.curLink]!=="undefined"?this.index>=this.links[this.curLink].length:true){
		this.curLink++; this.index = 0;
		if(this.curLink>=this.links.length){
			if(this.implicitPrint) this.out(this.stack.pop());
			return !(this.done = true);
		}
	}
	var chr = (this.links[this.curLink]||"")[this.index];
	if(this.commands[chr]) this.commands[chr](this);
	this.index++;
	return this;
}

Y.prototype.run = function(){
	while(!this.done) this.step();
}
