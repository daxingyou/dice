

cc.Class({
    extends: cc.Component,

    properties: {
		scroll : null,
		show : false,
		prefab : null
    },

	start () {
		let node = this.node.getChildByName('recordNode');
		let btn = node.getChildByName('btnRecord');
		let utils = cc.vv.utils;
		let self = this;

		utils.addClickEvent(btn, this.node, 'RecordNode', 'onBtnRecord');

		this.scroll = node.getChildByName('scrollView');

		cc.loader.loadRes("prefabs/recordnode", (err, prefab) => {
			self.prefab = prefab;
		});
		
		this.node.on('player_bet_push', data => {
			let detail = data.detail;
			let bet = detail.bet;

			if (!detail.valid)
				return;

			self.addRecord(bet);
		});
	},

	Hide() {
		let node = this.node.getChildByName('recordNode');
		let action = cc.moveBy(0.2, 708, 0);

		node.runAction(action);
		this.show = false;
	},

	Show() {
		let node = this.node.getChildByName('recordNode');
		let action = cc.moveBy(0.2, -708, 0);

		node.runAction(action);
		this.show = true;
	},

	onBtnRecord() {
		if (this.show)
			this.Hide();
		else
			this.Show();
	},

	addRecord(bet) {
		let content = cc.find('view/content', this.scroll);
		let max = 12;
   		let node = cc.instantiate(this.prefab);

		content.addChild(node);

		let txt = node.getChildByName('txtRecord').getComponent(cc.Label);
		let record = bet.nickname + '下注' + bet.amount + '押' + (bet.bet == 'small' ? '小' : '大');
		txt.string = record;

		while (content.childrenCount > max) {
           	let first = content.children[0];
           	content.removeChild(first, true);
       	}
	}
});


