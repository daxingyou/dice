
const MIN = 1000;
const MAX = 2000000;

cc.Class({
    extends: cc.Component,

    properties: {

    },

	start() {
		let body = this.node.getChildByName('body');
		let tips = body.getChildByName('txtTips').getComponent(cc.Label);
		let edtCount = body.getChildByName('edtCount').getComponent(cc.EditBox);
		let txt = '快压设置为' + MIN + '-' + MAX + '之间';

		tips.getComponent(cc.Label).string = txt;
		edtCount.placeholder = txt;
	},

	onEnable () {
		this.refresh();
    },

	refresh() {
		let edtCount = cc.find('body/edtCount', this.node).getComponent(cc.EditBox);
		let count = cc.sys.localStorage.getItem('quick_setting_amount');
		if (count == null)
			count = '';

		edtCount.string = count;
	},

    onBtnClose() {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onBtnSubmit() {
		cc.vv.audioMgr.playBtnClicked();
	
		let utils = cc.vv.utils;
		let edtCount = cc.find('body/edtCount', this.node).getComponent(cc.EditBox);

		if (edtCount.string == '') {
			utils.showTips('金额不能为空');
			return;
		}
		
		let count = parseInt(edtCount.string);
		if (count < MIN || count > MAX) {
			utils.showTips('金额超出范围');
			return;
		}

		cc.sys.localStorage.setItem('quick_setting_amount', '' + count);
		this.onBtnClose();
	}
});


