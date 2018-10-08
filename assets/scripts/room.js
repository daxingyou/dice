
cc.Class({
    extends: cc.Component,

    properties: {
		chipPrefab : cc.Prefab,
	
		myPlayer : cc.Node,
		bankerPlayer : cc.Node,
		txtleftTime : cc.Label,
		robBankNode : cc.Node,
		btnNumNode : cc.Node,
		myBetBigNode : cc.Node,
		myBetSmallNode : cc.Node,
		chipNodeContainer : cc.Node,
		betchips : cc.Node,

		bigOrSmall : null,
		choosedChip : null,
		bigEffect : null,
		smallEffect : null,

		_left : 0
    },

    onLoad () {
		this.addComponent('ResultNode');
		this.addComponent('BankerPlayer');
		this.addComponent('RecordNode');
		this.addComponent('dicepreroundinfo');

		this.initView()
		this.initEventHandlers();
    },

    start () {
		this.initView();

		this.sync();

		cc.vv.audioMgr.playBGM('dicebg.mp3');
    },

	initView () {
		let node = this.node;
	
		this.bigEffect = node.getChildByName('bigEffect').getComponent('SpriteMgr');
		this.smallEffect = node.getChildByName('smallEffect').getComponent('SpriteMgr');
	},

	initEventHandlers() {
		cc.vv.gameMgr.dataEventHandler = this.node;
		
		let self = this;
		let node = this.node;

		node.on('game_sync', data => {
			self.sync();
		});

		node.on('game_records_udpate', data => {
			
		});

		node.on('game_banker_update', data => {
			self.updateStatus();
		});

		node.on('game_self_update', () => {
			let up = self.myPlayer.getComponent('UserPanel');

			up.setMoney(cc.vv.userMgr.balance);
		});

		node.on('game_stage_update', () => {
			self.enterStage();
		});

		node.on('player_bet_push', data => {
			let detail = data.detail;
			let bet = detail.bet;
			let uid = bet.uid;

			let myself = uid == cc.vv.userMgr.uid;

			if (detail.valid) {
				if (myself) {
					self.updateBetNum();
					self.doMyBet(bet);
				} else {
					self.doOthersBet(bet);
				}

				self.updateStatus();
			} else {
				if (myself)
					cc.vv.utils.showTips(detail.tips);
			}
		});
	},

	sync () {
		let up = this.myPlayer.getComponent('UserPanel');

		up.refresh();

		let stage = cc.vv.gameMgr.getStage();

		this.showBanker(stage != 'rob');
		this.showRobots(stage == 'bet');
		this.showRob(stage == 'rob');
		this.showNumNode(stage != 'rob');

		this.updateBetNum();
		this.updateStatus();
	},

	showRobots (enable) {
		let node = this.node;
		let max = 6;
		let robots = cc.vv.gameMgr.room.robots;

		for (let i = 0; i < max && i < robots.length; i++) {
			let item = node.getChildByName('playerNode' + i);
			let robot = robots[i];

			item.active = enable;
			if (!enable) continue;

			item.getChildByName('txtName').getComponent(cc.Label).string = robot.nickname;
			item.getChildByName('txtMoney').getComponent(cc.Label).string = '' + robot.balance;
			cc.find('HeadNode/mask/spHead', item).getComponent('SpriteMgr').setIndex(robot.avatar);
		}

		for (let i = robots.length ; i < max; i++) {
			let item = node.getChildByName('playerNode' + i);

			item.active = false;
		}
	},

	showBanker(enable) {
		this.bankerPlayer.active = enable;
	},

	showRob(enable) {
		this.robBankNode.active = enable;
	},

	showBetTip(start, cb) {
		let name = start ? 'startBetting' : 'stopBetting';
		let img = this.node.getChildByName(name);
		let oldx = img.x;
		let oldy = img.y;

		let finish = cc.callFunc(() => {
			if (cb) cb();
		});
		
		let seq = cc.sequence(cc.moveTo(0.2, 0, 0),
							  cc.delayTime(0.3),
							  cc.hide(),
							  cc.moveTo(0.1, cc.p(oldx, oldy)),
							  cc.show(),
							  finish);

		img.runAction(seq);
	},

	showNumNode(enable) {
		this.btnNumNode.active = enable;
	},

	updateResultNode() {
		let rn = this.node.getComponent('ResultNode');

		rn.refresh();
	},

	updateBetNum () {
		let gm = cc.vv.gameMgr;

		let big = gm.bigBet > 0;
		this.myBetBigNode.active = big;
		if (big) {
			let txt = this.myBetBigNode.getChildByName('txtMyValue').getComponent(cc.Label);
			txt.string = '' + gm.bigBet;
		}

		let small = gm.smallBet > 0;
		this.myBetSmallNode.active = small;
		if (small) {
			let txt = this.myBetSmallNode.getChildByName('txtMyValue').getComponent(cc.Label);
			txt.string = '' + gm.smallBet;
		}
	},

	updateStatus() {
		let gm = cc.vv.gameMgr;
		let status = gm.room.status;

		let txtTotalBigBetNum = this.btnNumNode.getChildByName('txtTotalBigBetNum').getComponent(cc.Label);
		txtTotalBigBetNum.string = '' + status.big_total;

		let txtLimitBig = this.btnNumNode.getChildByName('txtLimitBig').getComponent(cc.Label);
		txtLimitBig.string = '上限: ' + status.big_limit;

		let txtTotalSmallBetNum = this.btnNumNode.getChildByName('txtTotalSmallBetNum').getComponent(cc.Label);
		txtTotalSmallBetNum.string = '' + status.small_total;

		let txtLimitSmall = this.btnNumNode.getChildByName('txtLimitSmall').getComponent(cc.Label);
		txtLimitSmall.string = '下限: ' + status.small_limit;
	},

	getChipAmount(amount) {
		if (amount >= 10000)
			return parseInt(amount / 10000) + '-';
		else
			return '' + amount;
	},

	splitBet(amount) {
		let val = [ 1000, 5000, 10000, 50000, 100000, 200000 ];
		let ids = [];
		let cnt = val.length;
		
		do {
			for (let i = cnt - 1; i >= 0; i--) {
				if (amount < val[i])
					continue;

				ids.push(i);
				amount -= val[i];
				break;
			}
		} while (amount > 0);

		return ids;
	},

	doOthersBet (bet) {
		let robots = cc.vv.gameMgr.room.robots;
		let seat_id = -1;
		let self = this;

		for (let i = 0; i < robots.length; i++) {
			let rb = robots[i];

			if (rb.id == bet.uid) {
				seat_id = i;
				break;
			}
		}

		if (seat_id < 0)
			seat_id = Math.ceil(Math.random() * 1000) % 6;

		let ids = this.splitBet(bet.amount);
		ids.forEach(x => {
			self.doBetChip(bet.bet, x, seat_id);
		});
	},

	doMyBet(bet) {
		let ids = this.splitBet(bet.amount);
		let self = this;

		ids.forEach(x => {
			self.doBetChip(bet.bet, x);
		});
	},

	doBetChip(bet, id, seat_id) {
		let val = [ 1000, 5000, 10000, 50000, 100000, 200000 ];
		let amount = val[id];
		let chip = cc.instantiate(this.chipPrefab);

		chip.getChildByName('txtNum').getComponent(cc.Label).string = this.getChipAmount(amount);

		let container = this.chipNodeContainer;

		container.addChild(chip);

		chip.scale = 0.5;
		chip.getComponent('SpriteMgr').setIndex(id);

		let spos = null;

		if (seat_id == null) {
			let src = this.betchips.children[id];
			let pos = this.betchips.convertToWorldSpaceAR(src.position);

			spos = container.convertToNodeSpaceAR(pos);
		} else {
			let poss = [ cc.p(-1094, 326), cc.p(-1092, 0), cc.p(-1094, -326), cc.p(1094, 326), cc.p(1092, 0), cc.p(1094, -326) ];
			spos = poss[seat_id];
		}

		let btn = this.btnNumNode;
		let kuang = bet == 'big' ? 'kuangBig' : 'kuangSmall';
		kuang = btn.getChildByName(kuang);

		let x = Math.floor((kuang.width - 80) * Math.random()) - (kuang.width - 80) / 2;
		let y = Math.floor((kuang.height - 80) * Math.random()) - (kuang.height - 80) / 2;

		let wpos = kuang.convertToWorldSpaceAR(cc.p(x, y));
		let dpos = container.convertToNodeSpaceAR(wpos);

		chip.position = spos;

		let action = cc.moveTo(0.2, dpos);
		chip.runAction(action);

		cc.vv.audioMgr.playSFX('dice_effect.mp3');
	},

	clearChips() {
		let container = this.chipNodeContainer;
		container.removeAllChildren();
	},

	playCup() {
		let room = cc.vv.gameMgr.room;
		let dices = room.dices;
		let result = room.result;

		let node = this.btnNumNode;
		let down = node.getChildByName('resultDiceNode');
		let up = node.getChildByName('yaoDiceNode');
		let self = this;

		for (let i = 0; i < 3; i++) {
			let dice = down.getChildByName('resultDice' + i);
			let sm = dice.getComponent('SpriteMgr');
			let id = dices[i];

			sm.setIndex(id - 1);
		}

		let rep = cc.repeat(cc.sequence(
										cc.rotateTo(0.05, 30),
										cc.rotateTo(0.1, -30),
										cc.rotateTo(0.05, 0)), 8);

		let open = cc.callFunc(() => {
			down.opacity = 255;
		});

		let voice = cc.callFunc(() => {
			cc.vv.audioMgr.playSFX('openDice.mp3');

			if (result[0] == 'B')
				self.bigEffect.setIndex(1);
			else if (result[0] == 'S')
				self.smallEffect.setIndex(1);

			self.showProfit();
		});

		let close = cc.callFunc(() => {
			up.x = 0;
			up.opacity = 0;
			down.opacity = 0;
			self.updateResultNode();
			self.playResult();
		});

		let seq = cc.sequence(rep, open, cc.moveBy(0.2, cc.p(384, 0)), voice, cc.delayTime(2), close);

		up.opacity = 255;
		up.runAction(seq);

		cc.vv.audioMgr.playSFX('rock_dice.mp3');
	},

	playResult() {
		let profit = cc.vv.userMgr.profit;
		let result = cc.vv.gameMgr.room.result;

		let file = null;
		
		if (result[0] == 'L')
			file = 'win_all.mp3';
		else if (profit > 0)
			file = 'gameWin.mp3';
		else if (profit < 0)
			file = 'gameLose.mp3';

		if (file != null)
			cc.vv.audioMgr.playSFX(file);
	},

	enterRob() {
		this.showBanker(false);
		this.showRob(true);
		this.showNumNode(false);

		this.checkAutoRob();
	},

	enterBet() {
		this.bigOrSmall = null;
		this.bigEffect.setIndex(-1);
		this.smallEffect.setIndex(-1);
		
		this.showBanker(true);
		this.showRobots(true);
		this.showRob(false);

		this.showBetTip(true);
		this.showNumNode(true);

		this.updateBetNum();

		this.choosedChip = null;
		this.highlightChip(-1);

		cc.vv.audioMgr.playSFX('start_xiazu.mp3');
	},

	enterOpen() {
		cc.vv.audioMgr.playSFX('stop_xiazu.mp3');
	
		let self = this;

		this.clearChips();

		this.bigOrSmall = null;
		this.bigEffect.setIndex(-1);
		this.smallEffect.setIndex(-1);

		this.showBetTip(false, () => self.playCup());
		this.showRobots(false);
	},

	enterStage () {
		let stage = cc.vv.gameMgr.getStage();
		if (stage == 'rob') {
			this.enterRob();
		} else if (stage == 'bet') {
			this.enterBet();
		} else if (stage == 'open') {
			this.enterOpen();
		}
	},

	checkAutoRob () {
		let auto = cc.sys.localStorage.getItem('banker_setting_auto');
		console.log('auto2=' + auto);
		if (auto != '1')
			return;

		this.onBtnRob();
	},

	update(dt) {
		let expire = cc.vv.gameMgr.room.expire;
		let now = Math.floor(Date.now() / 1000);

		let left = expire - now;
		if (left < 0)
			left = 0;

		if (this._left == left)
			return;

		let gm = cc.vv.gameMgr;
		let stage = gm.getStage();

		if ((stage == 'bet' || stage == 'rob') && left <= 5)
			cc.vv.audioMgr.playSFX('time.mp3');
		
		this.txtleftTime.string = left + '秒';

		let rob = this.robBankNode;
		if (rob.active) {
			let txt = rob.getChildByName('txtRingTime').getComponent(cc.Label);
			txt.string = left + '秒';
		}

		this._left = left;
	},

	bet (bs, chip) {
		let val = [ 1000, 5000, 10000, 50000, 100000, 200000 ];
		let net = cc.vv.net;
		let um = cc.vv.userMgr;

		let param = {
			uid : um.uid,
			bet : bs,
			amount : val[chip]
		};

		net.send('player_bet', { bet : param });
	},

	onBtnBig() {
		let gm = cc.vv.gameMgr;
		let stage = gm.getStage();
		if (stage != 'bet')
			return;

		if (gm.myBanker()) {
			cc.vv.utils.showTips('庄家不能下注');
			return;
		}
		
		this.bigOrSmall = 'big';
		this.bigEffect.setIndex(0);
		this.smallEffect.setIndex(-1);

		let id = this.choosedChip;
		if (id != null)
			this.bet('big', id);
	},

	onBtnSmall() {
		let gm = cc.vv.gameMgr;
		let stage = gm.getStage();
		if (stage != 'bet')
			return;

		if (gm.myBanker()) {
			cc.vv.utils.showTips('庄家不能下注');
			return;
		}

		this.bigOrSmall = 'small';
		this.bigEffect.setIndex(-1);
		this.smallEffect.setIndex(0);

		let id = this.choosedChip;
		if (id != null)
			this.bet('small', id);
	},

	highlightChip(id) {	
		for (let i = 0; i < this.betchips.childrenCount; i++) {
			let xz = this.betchips.children[i].getChildByName('xuanzhong');
			xz.active = (id == i);
		}
	},

	onBtnChip(event, customEventData) {
		let id = parseInt(customEventData);

		let gm = cc.vv.gameMgr;

		let stage = gm.getStage();
		if (stage != 'bet')
			return;
/*
		if (gm.myBanker()) {
			cc.vv.utils.showTips('庄家不能下注');
			return;
		}
*/
		this.choosedChip = id;
		this.highlightChip(id);

		//if (this.bigOrSmall != null)
		//	this.bet(this.bigOrSmall, id);
	},

	onBtnRob() {
		let net = cc.vv.net;
		let um = cc.vv.userMgr;

		let amount = cc.sys.localStorage.getItem('banker_setting_amount');
		if (amount != null)
			amount = parseInt(amount);
		else
			amount = 200000;

		if (um.balance < amount) {
			cc.vv.utils.showTips('您的账户余额不够抢庄');
			return;
		}

		let param = {
			uid : um.uid,
			amount : amount
		};

		net.send('player_rob', { rob : param });

		this.showRob(false);
	},

	onBtnQuick () {
		let amount = cc.sys.localStorage.getItem('quick_setting_amount');
		if (amount == null) {
			cc.vv.utils.showTips('您尚未设置快押金额');
			return;
		}

		amount = parseInt(amount);

		let gm = cc.vv.gameMgr;
		let utils = cc.vv.utils;
		let net = cc.vv.net;
		let um = cc.vv.userMgr;
		
		let stage = gm.getStage();
		if (stage != 'bet')
			return;

		if (gm.myBanker()) {
			utils.showTips('庄家不能下注');
			return;
		}

		if (this.bigOrSmall == null) {
			utils.showTips('请先选择大小');
			return;
		}
		
		let param = {
			uid : um.uid,
			bet : this.bigOrSmall,
			amount : amount,
			quick : true
		};

		net.send('player_bet', { bet : param });
	},

    onBtnRobSet() {
		cc.vv.audioMgr.playBtnClicked();

        let dialog = this.node.getChildByName('dicebankersetting');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnQuickSet() {
    	cc.vv.audioMgr.playBtnClicked();
		
        let dialog = this.node.getChildByName('dicequicksetting');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnShang() {
	    cc.vv.audioMgr.playBtnClicked();
		
        let dialog = this.node.getChildByName('dicebusinessman');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchangeRecord() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('DialogExchangeRecord');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchange() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('DialogExchange');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnTop() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('dicetop');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnSetup() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('DialogSetup');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnResult() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('diceresult');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

	showProfit() {
		let up = this.myPlayer.getComponent('UserPanel');
		let um = cc.vv.userMgr;
		let profit = um.profit - um.amount;

		up.setMoney(um.balance);

		if (profit == 0)
			return;

		let tips = 'prefabs/' + (profit > 0 ? 'winTips' : 'loseTips');
		let content = (profit > 0 ? '+' : '') + profit;

		cc.loader.loadRes(tips, (err, prefab) => {
    		let node = cc.instantiate(prefab);
			let root = cc.find('Canvas');

    		root.addChild(node);
			node.getComponent(cc.Label).string = content;

			let finish = cc.callFunc(() => {
				root.removeChild(node);
			});

			let action = cc.sequence(cc.delayTime(1),
									 cc.spawn(cc.moveBy(0.5, cc.p(0, 100)), cc.fadeOut(0.5)),
									 finish);

			node.runAction(action);
		});
	},
});



