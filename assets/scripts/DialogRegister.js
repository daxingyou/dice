
cc.Class({
    extends: cc.Component,

    properties: {
		edtAccount : cc.EditBox,
		edtNickname : cc.EditBox,
		edtPassword : cc.EditBox,
		edtComfirm : cc.EditBox
    },

	onEnable() {
		let random = cc.vv.random;
		if (random) {
			this.setRandom(random);
		
			cc.vv.random = null;
		}
	},

	onDisable() {
		this.edtAccount.string = '';
		this.edtNickname.string = '';
		this.edtPassword.string = '';
		this.edtComfirm.string = '';
	},

	setRandom(data) {
		this.edtAccount.string = data.account;
		this.edtNickname.string = data.nickname;
	},

    onBtnSubmit() {
		cc.vv.audioMgr.playBtnClicked();
	
		let account = this.edtAccount.string;
		let nickname = this.edtNickname.string;
		let password = this.edtPassword.string;
		let comfirm = this.edtComfirm.string;
		let utils = cc.vv.utils;
	
    	let msg = null;
    	if (account.length == 0)
			msg = '账号不能为空';
		else if (nickname == 0)
			msg = '昵称不能为空';
		else if (password.length == 0)
			msg = '密码不能为空';
		else if (password != comfirm)
			msg = '二次密码输入不一致';

		if (msg) {
			utils.showTips(msg);
			return;
		}

		let http = cc.vv.http;
		let passwd = cc.vv.utils.MD5(password);
		
		let param = {
			account : account,
			nickname : nickname,
			password : passwd
		};

		let node = this.node;
		let login = cc.find('Canvas').getComponent('login');
		let storage = cc.sys.localStorage;

		http.post('/login/register', param, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}
		
			let code = ret.code;
			if (code == 0) {
				cc.vv.utils.showDialog(node, 'body', false);

				cc.vv.userMgr.login(account, passwd);
			} else {
				utils.showTips('通讯失败: ' + ret.msg);
			}
		});
    },

	onBtnClose() {
		cc.vv.utils.showDialog(this.node, 'body', false);
	},
});


