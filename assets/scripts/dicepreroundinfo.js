

cc.Class({
    extends: cc.Component,

    properties: {
		_info : null
    },

	start () {
		this._info = this.node.getChildByName('dicepreroundinfo');

		let myPlayer = this.node.getChildByName('myPlayer');

		cc.vv.utils.addClickEvent(myPlayer, this.node, 'dicepreroundinfo', 'onBtnHead');
	},

	onBtnHead () {
		let node = this._info;
	
		let active = !node.active;
		node.active = active;
		if (active)
			cc.vv.audioMgr.playSFX('panelShow.mp3');
		else
			return;

		let room = cc.vv.gameMgr.room;
		let dices = room.dices;
		
		node.getChildByName('resultDice0').getComponent('SpriteMgr').setIndex(dices[0] - 1);
		node.getChildByName('resultDice1').getComponent('SpriteMgr').setIndex(dices[1] - 1);
		node.getChildByName('resultDice2').getComponent('SpriteMgr').setIndex(dices[2] - 1);
		node.getChildByName('txtResult0').getComponent(cc.Label).string = '' + (dices[0] - 1);
		node.getChildByName('txtResult1').getComponent(cc.Label).string = '' + (dices[1] - 1);
		node.getChildByName('txtResult2').getComponent(cc.Label).string = '' + (dices[2] - 1);

		let result = room.result;
		let ret = '';
		switch (result[0]) {
			case 'L':
				ret = '豹';
				break;
			case 'B':
				ret = '大';
				break;
			case 'S':
				ret = '小';
				break;
			default:
				break;
		};

		node.getChildByName('txtResultTips').getComponent(cc.Label).string = ret;

		let banker = room.banker;
		let status = room.status;

		let profit = cc.vv.userMgr.profit;

		node.getChildByName('txtBankerName').getComponent(cc.Label).string = banker.nickname;
		node.getChildByName('txtBankerMoney').getComponent(cc.Label).string = '' + banker.banker_amount;
		node.getChildByName('txtTotalBig').getComponent(cc.Label).string = status.big_total;
		node.getChildByName('txtTotalSmall').getComponent(cc.Label).string = status.small_total;
		node.getChildByName('txtWinMoney').getComponent(cc.Label).string = Math.abs(profit);
		node.getChildByName('txtTips').getComponent(cc.Label).string = profit >= 0 ? '赢了' : '输了';
	}
});


