

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
		let last = cc.vv.gameMgr.last;

		if (!last)
			return;
		
		let dices = last.dices;
		let result = last.result;
		let show = !node.active && dices && result;
		
		node.active = show;
		if (!show)
			return;

		cc.vv.audioMgr.playSFX('panelShow.mp3');

		if (dices && result) {
			node.getChildByName('resultDice0').getComponent('SpriteMgr').setIndex(dices[0] - 1);
			node.getChildByName('resultDice1').getComponent('SpriteMgr').setIndex(dices[1] - 1);
			node.getChildByName('resultDice2').getComponent('SpriteMgr').setIndex(dices[2] - 1);
			node.getChildByName('txtResult0').getComponent(cc.Label).string = '' + dices[0];
			node.getChildByName('txtResult1').getComponent(cc.Label).string = '' + dices[1];
			node.getChildByName('txtResult2').getComponent(cc.Label).string = '' + dices[2];

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

			let banker = last.banker;
			let stat = last.stat;

			node.getChildByName('txtBankerName').getComponent(cc.Label).string = banker.nickname;
			node.getChildByName('txtBankerMoney').getComponent(cc.Label).string = '' + banker.banker_amount;
			node.getChildByName('txtTotalBig').getComponent(cc.Label).string = stat.big_bet_total;
			node.getChildByName('txtTotalSmall').getComponent(cc.Label).string = stat.small_bet_total;
			node.getChildByName('txtWinMoney').getComponent(cc.Label).string = Math.abs(last.profit - last.amount);
			node.getChildByName('txtTips').getComponent(cc.Label).string = last.profit >= last.amount ? '赢了' : '输了';
		}
	}
});


