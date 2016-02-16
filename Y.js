function Y(code){
	this.origCode = code;
	this.links = [];
	var curSection = "", linkIDs = "CDJMPQX"
	// parse links
	for(var i=0;i<code.length;i++){
		curSection += code[i];
		if(linkIDs.indexOf(code[i])>=0){
			this.links.push(curSection);
			curSection = "";
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
			y.index = 0;
		},
		"\"": function(y){
			
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
					y.commands.C(y);
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
			y.bound(Y.WRAP);
		},
		"*": function(y){
			var i = y.getTop(2);
			if(typeof i[0]=="string"&&typeof i[1]=="number"){
				y.stack.push(i[0].repeat(i[1]));
			} else if(typeof i[0]==typeof i[1]&&typeof i[1]=="number"){
				y.stack.push(i[0]*i[1]);
			}
		}
	}
}

Y.WRAP = function(y){
	y.curLink = 0;
	y.index = 0;
}

Y.prototype.out = function(s){
	console.log(s);
}

Y.prototype.getTop = function(N){
	var s = [];
	while(N --> 0){
		s.push(this.stack.pop());
	}
	return s.reverse();
}

Y.prototype.bound = function(callback){
	callback = calback || (function(){});
	if(this.index>=this.links[this.curLink].length){
		this.commands.C(this);
		if(this.curLink>=this.links.length) callback(this);
	}
}

Y.prototype.step = function(){
	if(this.index>=this.links[this.curLink].length){
		this.commands.C(this);
		if(this.curLink>=this.links.length) return !(this.done = true);
	}
	var chr = this.links[this.curLink][this.index];
	if(this.commands[chr]) this.commands[chr](this);
	this.index++;
	return this;
}

Y.prototype.run = function(){
	while(!this.done) this.step();
}
