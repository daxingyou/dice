
cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler : null,

		room : null,

		last : null,

		smallBet : 0,
		bigBet : 0
    },
    
    reset () {
        
    },
    
    clear () {

    },
    
    dispatchEvent (event, data) {
        if (this.dataEventHandler)
            this.dataEventHandler.emit(event, data);
    },

	myBanker () {
		return this.room && this.room.banker.id == cc.vv.userMgr.uid;
	},
    
    initHandlers: function() {
        let self = this;
		let net = cc.vv.net;
		
        net.on('enter_room_re', data => {
			self.room = data;
			let last = data.last;

			if (last) {			
				self.last = last;
				self.last.profit = 0;
				self.last.amount = 0;
			}
			
			cc.director.loadScene("room");
        });

		net.on('game_banker_push', data => {
			let banker = data.banker;
			self.room.banker = data.banker;
			self.room.status = data.status;

			let um = cc.vv.userMgr;
			if (banker.id == um.uid) {
				um.balance = banker.balance;
				self.dispatchEvent('game_self_update');
			}

			self.dispatchEvent('game_banker_update');
		});

		net.on('game_stage_push', data => {
			let room = self.room;
			let fs = [ 'stage', 'round', 'expire', 'dices', 'result', 'records', 'stat', 'robots' ];

			self.smallBet = 0;
			self.bigBet = 0;

			fs.forEach(x => {
				if (data[x] != null)
					room[x] = data[x];
			});

			let banker = data.banker;
			if (banker) {
				room.banker.balance = banker.balance;
				room.banker.profit = banker.profit;
			}

			let me = data.myself;
			if (me) {
				let um = cc.vv.userMgr;

				um.balance = me.balance;
				um.profit = me.profit;
				um.amount = me.amount;
			}

			self.dispatchEvent('game_stage_update');

			if (data.stage == 'open') {
				self.last = {
					banker : banker,
					stat : data.stat,
					status : data.status,
					result : data.result,
					records : data.records,
					dices : data.dices,
					profit : me.profit,
					amount : me.amount
				};
			}

			if (banker)
				self.dispatchEvent('game_banker_update', banker);

			//if (me)
			//	self.dispatchEvent('game_self_update', me);

			let records = data.records;
			if (records)
				self.dispatchEvent('game_records_udpate', records);
		});

		net.on('player_bet_push', data => {
			let bet = data.bet;
			let um = cc.vv.userMgr;
			
			if (data.valid) {
				if (bet.uid == um.uid) {
					if (bet.bet == 'small')
						self.smallBet += bet.amount;
					else if (bet.bet == 'big')
						self.bigBet += bet.amount;

					um.balance = data.balance;
					self.dispatchEvent('game_self_update');
				}
			}

			if (data.valid)
				self.room.status = data.status;

			self.dispatchEvent('player_bet_push', data);
		});

		net.on('disconnect', data => {
			console.log('GameMgr disconnected');

			cc.director.loadScene("lobby");
		});
    },
    
	getStage() {
		return this.room.stage;
	},

	connectGameServer() {
        let self = this;
		let net = cc.vv.net;
		let um = cc.vv.userMgr;
		let utils = cc.vv.utils;

        let onConnectOK = function() {
			self.initHandlers();

			net.send('enter_room', { token : um.token });
        };
        
        let onConnectFailed = function() {
            utils.showLoading(false);
			utils.showTips('连接服务器失败');
        };

        utils.showLoading(true);
		net.connect(onConnectOK, onConnectFailed);
    },

	refreshUser () {
		let http = cc.vv.http;
		let um = cc.vv.userMgr;
		let self = this;
		let param = {
			uid : um.uid
		};
		
		http.post('/dealer/get_user_info', param, ret => {
			if (!ret)
				return;

			let code = ret.code;
			if (code != 0) {
				console.log('获取玩家信息失败: ' + ret.msg);
				return;
			}
			
			let data = ret.data;

			um.avatar = data.avatar;
			um.balance = data.balance;
			um.nickname = data.nickname;
			self.dispatchEvent('game_self_update');
		});
	},
});

