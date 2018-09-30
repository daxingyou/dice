
let wsurl = 'ws://ip9.queda88.com:8000/dicews/';

let Global = cc.Class({
    extends: cc.Component,
    statics: {
		handlers: {},
		ws : null,

		on (event, cb) {
			let handlers = this.handlers;

			if (handlers[event]) {
				console.log('event: ' + event + ' handler has been registered.');
				return;
			}

			let fn = function(data) {
				if (typeof(data) == 'string')
					data = JSON.parse(data);

				if (cb)
					cb(data);
			};

			handlers[event] = fn;
		},

		onMessage(data) {
			let msg = null;

			try {
				msg = JSON.parse(data);
			} catch (e) {}

			if (!msg)
				return;

			let fn = this.handlers[msg.type];

			if (fn) fn(msg.data);
		},

		connect(fnConnect, fnError) {
			let self =  this;

			let ws = this.ws = new WebSocket(wsurl);

			ws.onopen = function(event) {
				console.log('ws connected');
				fnConnect();
			};

			ws.onmessage = function(event) {
				self.onMessage(event.data);
			};

			ws.onerror = function(event) {
				console.log('ws error');
			};

			ws.onclose = function(event) {
				console.log('ws disconnected');
				self.onclose();
			};
		},

        send(event, data) {
			let msg = {
				type : event,
				data : data
			};

			let ws = this.ws;
			if (ws) {
				console.log('ws send: ' + JSON.stringify(msg));
				ws.send(JSON.stringify(msg));
			}
        },

        onclose() {
            console.log('ws closed');

			let fn = this.handlers['disconnect'];

			this.handlers = {};
			this.ws = null;
			
			if (fn) fn();
        },

		close() {
			let ws = this.ws;
			if (ws)
				ws.close(0);
		}
    },
});


