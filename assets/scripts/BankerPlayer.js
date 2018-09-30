

cc.Class({
    extends: cc.Component,

    properties: {
   		txtName : null,
		txtMoney : null,
		head : null
    },

	start() {
		let node = this.node.getChildByName('bankerPlayer');
	
		this.txtName = node.getChildByName('txtName');
		this.txtMoney = node.getChildByName('txtMoney');
		this.head = cc.find('HeadNode/mask/spHead', node);

		this.refresh();

		let self = this;
		this.node.on('game_banker_update', () => {
			self.refresh();
		});
	},

	setName(name) {
		if (this.txtName) {
			let txt = this.txtName.getComponent(cc.Label);
			txt.string = name;
		}
	},

	setMoney(money) {
		if (this.txtMoney) {
			let txt = this.txtMoney.getComponent(cc.Label);
			txt.string = money;
		}
	},

	setAvatar(id) {
		if (this.head) {
			let sm = this.head.getComponent('SpriteMgr');
			sm.setIndex(id);
		}
	},

	refresh() {
		let gm = cc.vv.gameMgr;
		let banker = gm.room.banker;

		this.setName(banker.nickname);
		this.setMoney(banker.banker_amount);
		this.setAvatar(banker.avatar);
	},
});



