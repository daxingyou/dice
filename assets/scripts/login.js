
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
		let dialog = this.node.getChildByName('DialogRegister');

		dialog.active = false;

		let account = cc.sys.localStorage.getItem('account');

		if (account && account.length > 0) {
			let dg = this.node.getChildByName('DialogLogin');
			let edtName = dg.getChildByName('edtName').getComponent(cc.EditBox);
			
			edtName.string = account;
		}

		cc.vv.userMgr.autoLogin();
    },

    onBtnLogin() {
		cc.vv.audioMgr.playBtnClicked();
	
	    let dialog = this.node.getChildByName('DialogLogin');
		let edtName = dialog.getChildByName('edtName').getComponent(cc.EditBox);
		let edtPass = dialog.getChildByName('edtPass').getComponent(cc.EditBox);

		let account = edtName.string;
		let pass = edtPass.string;

		let utils = cc.vv.utils;
		let msg = null;

		if (account.length == 0)
			msg = '账号不能为空';
		else if (pass.length == 0)
			msg = '密码不能为空';

		if (msg) {
			utils.showTips(msg);
			return;
		}

		let passwd_md5 = cc.vv.utils.MD5(pass);

		cc.vv.userMgr.login(account, passwd_md5, ret => {
			if (!ret) {
				edtPass.string = '';
			}
		});
    },

	showRegister() {
		let dialog = this.node.getChildByName('DialogRegister');

		cc.vv.utils.showDialog(dialog, 'body', true);
	},

	onBtnRegister() {
		let http = cc.vv.http;
		let self = this;

		cc.vv.audioMgr.playBtnClicked();

		http.post('/login/random', {}, ret => {
			if (ret && ret.code == 0) {
				cc.vv.random = ret.data;
				self.showRegister();
			}
		});
	},

	setAccount(account) {
		let dialog = this.node.getChildByName('DialogRegister');
		let edtName = dialog.getChildByName('edtName').getComponent(cc.EditBox);
		let edtPass = dialog.getChildByName('edtPass').getComponent(cc.EditBox);

		edtName.string = account;
		edtPass.string = '';
	}
});


