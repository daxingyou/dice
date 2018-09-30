
let MIN = 200000;
let MAX = 400000;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
		this.refresh();
    },
		
	refresh() {
		let body = this.node.getChildByName('body');
		let storage = cc.sys.localStorage;

		let edtCount = body.getChildByName('edtCount').getComponent(cc.EditBox);
		let tgAuto = body.getChildByName('auto').getComponent(cc.Toggle);
		
		let count = cc.sys.localStorage.getItem('banker_setting_amount');
		if (count == null)
			count = '';

		edtCount.string = count;

		let auto = cc.sys.localStorage.getItem('banker_setting_auto');
		if (auto == null)
			auto = '0';

		console.log('auto=' + auto)
		
		tgAuto.isChecked = auto != '0';
	},

    onBtnClose() {
	    cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onBtnSubmit () {
		cc.vv.audioMgr.playBtnClicked();
	
		let body = this.node.getChildByName('body');
		let edtCount = body.getChildByName('edtCount').getComponent(cc.EditBox);
		let tgAuto = body.getChildByName('auto').getComponent(cc.Toggle);
		let storage = cc.sys.localStorage;

		let utils = cc.vv.utils;

		if (edtCount.string == '') {
			utils.showTips('抢庄金额不能为空');
			return;
		}

		let count = parseInt(edtCount.string);
		if (count < MIN || count > MAX) {
			utils.showTips('抢庄金额超出范围');
			return;
		}
		
		let auto = tgAuto.isChecked ? '1' : '0';

		storage.setItem('banker_setting_amount', '' + count);
		storage.setItem('banker_setting_auto', auto);

		this.onBtnClose();
	},
});



