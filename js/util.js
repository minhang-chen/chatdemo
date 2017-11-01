var util = (function(){
	return {

		html2Node: function(template){
			var container = document.createElement('div');
			container.innerHTML = template;
			return container.children[0];
		},
	
		extend: function(o1, o2){
			for(var i in o2){
				if(o1[i] === undefined){
					o1[i] = o2[i];
				}
			}
		},

		throttle: function(method, time, context){
			clearTimeout(method.timer);
			method.timer = setTimeout(function(){
				method.apply(context);
			}, time);
		},

		animateClass: function(node, className, callback){
			function onAnimationend(){
				node.classList.remove(className);
				node.removeEventListener('animationend', onAnimationend);
				callback && callback();
			}
		
			node.addEventListener('animationend', onAnimationend);
		
			if(className && !node.classList.contains(className)){
				node.classList.add(className);
			}
		},
		/*判断是否为json*/
		JSONParse: function(content){
			try{
				return JSON.parse(content);
			} catch (err){
				return content;
			}
		},
        urlParse: function (url) {

			var obj = {};
			var reg = /[?&][^?&]+=[^?&]+/g;
			var arr = url.match(reg);
			// ['?id=12345','&a=b']
			if (arr) {
				$.each(arr, function (item) {
                    var tempArr = arr[item].substring(1).split('=');
					var key = decodeURIComponent(tempArr[0]);
					var val = decodeURIComponent(tempArr[1]);
					obj[key] = val;
                })
			}
			return obj
		},

		emitter: {
			on: function(event, fn){
				var handlers = this._handlers ||　(this._handlers = {}),
					calls = handlers[event] || (handlers[event] = []);
				calls.push(fn); 
				return this;
			},

			off: function(event, fn){
				if(!event || !this._handlers) this._handlers = {};
				var handlers = this._handlers,
					call;
				if(calls = handlers[event]){
					if(!fn){
						calls = [];
						return this;
					} else {
						for(var i = calls.length - 1; i > -1; i++){
							if(fn === calls[i]){
								calls.splice(i, 1);
								return this;
							}
						}
					}
				}
				return this;
			},

			emit: function(event){
				var data = [].slice.call(arguments, 1),
					handlers = this._handlers, 
					calls;

				if (!handlers || !(calls = handlers[event])) return this;
				calls.forEach(function(fn){
					fn.apply(this, data)
				})
				return this;
			}
		}					
	}
})();