

cc.Class({
    extends: cc.Component,

    properties: {
		edtId : cc.EditBox,
		edtId2 : cc.EditBox,
		edtAmount : cc.EditBox,
		edtPass : cc.EditBox
    },

    onEnable () {
		this.reset();
    },

	reset () {
		this.edtId.string = '';
		this.edtId2.string = '';
		this.edtAmount.string = '';
		this.edtPass.string = '';
	},

    onBtnClose() {
		cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onBtnSubmit () {
		cc.vv.audioMgr.playBtnClicked();
	
		let id = this.edtId.string;
		let id2 = this.edtId2.string;
		let amount = this.edtAmount.string;
		let pass = this.edtPass.string;
		let utils = cc.vv.utils;

		if (id == '') {
			utils.showTips('ID不能为空');
			return;
		} else if (id != id2) {
			utils.showTips('二次ID不一致');
			return;
		} else if (amount == '') {
			utils.showTips('金额不能为空');
			return;
		} else if (pass == '') {
			utils.showTips('密码不能为空');
			return;
		}

		amount = parseInt(amount);

		if (amount <= 0) {
			utils.showTips('金额必须大于0');
			return;
		}

		let self = this;
		let http = cc.vv.http;

		let noice = '$*()_*^f(*&';
		let md5 = cc.vv.utils.MD5;
		let sign = md5(md5(pass) + noice);
		
		let param = {
			token : cc.vv.userMgr.token,
			to : id,
			amount : amount,
			sign : sign,
			noice : noice
		};

		console.log('transfer submit');

		http.post('/dealer/transfer', param, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}

			let code = ret.code;
			if (code != 0) {
				utils.showTips('转账失败: ' + ret.msg);
				return;
			}

			utils.showTips('转账成功');
			cc.vv.gameMgr.refreshUser();
			self.onBtnClose();
		});
	}
});


