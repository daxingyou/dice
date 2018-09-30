

cc.Class({
    extends: cc.Component,

    properties: {
   		txtName : null,
		txtId : null,
		txtMoney : null,
		head : null
    },

	start() {
		let node = this.node;
	
		this.txtName = node.getChildByName('txtName');
		this.txtId = node.getChildByName('txtId');
		this.txtMoney = node.getChildByName('txtMoney');
		this.head = cc.find('HeadNode/mask/spHead', node);

		this.refresh();
	},

	setName(name) {
		if (this.txtName) {
			let txt = this.txtName.getComponent(cc.Label);
			txt.string = name;
		}
	},

	setId(uid) {
		if (this.txtId) {
			let txt = this.txtId.getComponent(cc.Label);
			txt.string = 'ID: ' + uid;
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
		let um = cc.vv.userMgr;

		this.setId(um.account);
		this.setName(um.nickname);
		this.setMoney(um.balance);
		this.setAvatar(um.avatar);
	},
});



