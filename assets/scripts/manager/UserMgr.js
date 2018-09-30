
cc.Class({
    extends: cc.Component,
    properties: {
    	uid : null,
		token : null,
        account : null,
		nickname : null,
		balance : 0,
		avatar : 0,
		profit : 0
    },

	reset () {
		this.uid = 0;
		this.token = '';
		this.account = '';
		this.nickname = '';
		this.balance = 0;
		this.avatar = 0;
		this.profit = 0;
	},

	login (account, passwd_md5, cb) {
		if (!account || account.length == 0 || !passwd_md5 || passwd_md5.length == 0) {
			if (cb) cb(false);
			return;
		}
		
		let noice = '$*()_*^f(*&';
		let sign = cc.vv.utils.MD5(passwd_md5 + noice);

		let http = cc.vv.http;
		let param = {
			account : account,
			noice : noice,
			sign : sign
		};

		let self = this;
		let utils = cc.vv.utils;
		let storage = cc.sys.localStorage;

		http.post('/login/login', param, ret => {
			let code = ret.code;
			if (code != 0) {
				if (cb) cb(false);

				utils.showTips('登陆失败: ' + ret.msg);
				return;
			}

			let data = ret.data;

			self.uid = data.id;
			self.token = data.token;
			self.account = data.account;
			self.nickname = data.nickname;
			self.balance = data.balance;
			self.avatar = data.avatar;

			storage.setItem('account', data.account);
			storage.setItem('passwd_md5', passwd_md5);

			cc.director.loadScene("lobby");
		});
	},

	autoLogin() {
		let storage = cc.sys.localStorage;
		let account = storage.getItem('account');
		let passwd_md5 = storage.getItem('passwd_md5');

		this.login(account, passwd_md5);
	},

	logout () {
		let storage = cc.sys.localStorage;
		let passwd_md5 = storage.getItem('passwd_md5');

		if (passwd_md5 != null)
			storage.removeItem('passwd_md5');

		this.reset();
		cc.director.loadScene("login");
	}
/*    
    guestAuth: function() {
        var account = cc.args["account"];
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }
        
        if(account == null){
            account = Date.now();
            cc.sys.localStorage.setItem("account",account);
        }
        
        cc.vv.http.sendRequest("/guest",{account:account},this.onAuth);
    },
    
    onAuth:function(ret){
        var self = cc.vv.userMgr;
        if(ret.errcode !== 0){
            console.log(ret.errmsg);
        }
        else{
            self.account = ret.account;
            self.sign = ret.sign;
            cc.vv.http.url = "http://" + cc.vv.SI.hall;
            self.login();
        }   
    },
    
    login: function() {
        var self = this;
        var onLogin = function(ret) {
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(!ret.userid){
                    //jump to register user info.
                    cc.director.loadScene("createrole");
                }
                else{
                    self.account = ret.account;
        			self.userId = ret.userid;
        			self.userName = ret.name;
        			self.lv = ret.lv;
        			self.exp = ret.exp;
        			self.coins = ret.coins;
        			self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
        			cc.director.loadScene("hall");
                }
            }
        };

        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/login",{account:this.account,sign:this.sign}, onLogin);
    },
    
    create:function(name){
        var self = this;
        var onCreate = function(ret) {
            cc.vv.wc.hide();
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                self.login();
            }
        };
        
        var data = {
            account:this.account,
            sign:this.sign,
            name:name
        };
        
        cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/create_user",data,onCreate);    
    },
    
    enterRoom:function(roomId,callback){
        var self = this;
        var onEnter = function(ret){
            if(ret.errcode !== 0){
                if(ret.errcode == -1){
                    setTimeout(function(){
                        self.enterRoom(roomId,callback);
                    },5000);
                }
                else{
                    cc.vv.wc.hide();
                    if(callback != null){
                        callback(ret);
                    }
                }
            }
            else {
                cc.vv.wc.hide();
                if(callback != null){
                    callback(ret);
                }
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            roomid:roomId
        };
        cc.vv.wc.show(2);
        cc.vv.http.sendRequest("/enter_private_room",data,onEnter);
    },

    getHistoryList:function(callback){
        var self = this;
        var onGet = function(ret) {
			cc.vv.wc.hide();

            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.history);
                if(callback != null){
                    callback(ret.history);
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };

		cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_history_list",data,onGet);
    },

    getGamesOfRoom:function(uuid,callback){
        var self = this;
        var onGet = function(ret){
			cc.vv.wc.hide();
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
        };

		cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_games_of_room",data,onGet);
    },
    
    getDetailOfGame: function(uuid, index, callback) {
        var self = this;
        var onGet = function(ret) {
			cc.vv.wc.hide();
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
            index:index,
        };

		cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
    },

	getGameGoods: function(callback) {
        var self = this;
        var onGet = function(ret) {
			cc.vv.wc.hide();
			if (ret != null) {
                callback(ret);
            }
        };

		cc.vv.wc.show(0);
        cc.vv.http.sendRequest("/get_game_goods", null, onGet, shopURL);
    },

	getGameExchange: function(callback) {
        var self = this;

		// TODO
		var ret = [];

		ret.push({ title: '10元充值卡', price: 100, unit: '奖券', imgid: 0 });
		ret.push({ title: '20元充值卡', price: 200, unit: '奖券', imgid: 1 });
		callback(ret);
    },

	getTicketsInfo: function(callback) {
		var self = this;

		// TODO
		var ret = { ticket: 2000, chip: 500 };

		callback(ret);
    },

	getTaskStatus: function(callback) {
		var self = this;

		// TODO
		var ret = { hasBindPhone: false };

		callback(ret);
    },

	getDailyStatus: function(callback) {
		var self = this;

		// TODO
		var ret = {
			dayActive: 15,
			weekActive: 100,
			tasks: [ { type: 0, content: 'wzmj zz5c', progress: '1/5', award: 20 } ],
			dayGot: [ 0, 0, 0, 0, 0 ],
			weekGot: [ 0, 0 ],
		};

		callback(ret);
    },

	getRouletteInfo: function(rname, callback) {
		var self = this;

		// TODO
		var ret = {};

		callback(ret);
    },

	runRoulette: function(rname, callback) {
		var self = this;

		// TODO
		var ret = { id: 3 };

		callback(ret);
    },

	getBindInfo: function(callback) {
		var self = this;

		var onGet = function(ret) {
			if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            } else {
                console.log(ret.data);
                callback(ret.data);
            }
		};

		var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
			uid: cc.vv.userMgr.userId,
        };

		cc.vv.http.sendRequest('/get_bind_info', data, onGet);
    },

	getAwards: function(callback) {
		var self = this;

		var onGet = function(ret) {
			if (ret.errcode !== 0) {
                console.log(ret.errmsg);
				callback(false);
            } else {
                callback(true);
            }
		};

		var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
			uid: cc.vv.userMgr.userId,
        };

		cc.vv.http.sendRequest('/get_awards', data, onGet);
    },

	bind: function(bid, callback) {
		var self = this;

		var onGet = function(ret) {
			if (ret.errcode !== 0) {
                console.log(ret.errmsg);
				callback(false);
            } else {
                callback(true);
            }
		};

		var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
			uid: cc.vv.userMgr.userId,
			bid: bid,
        };

		cc.vv.http.sendRequest('/bind', data, onGet);
    },

	bindDone: function(callback) {
		// TODO
    }
*/
});

