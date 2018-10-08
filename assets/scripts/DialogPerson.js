
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

	onEnable () {
		let sm = cc.find('body/HeadNode/mask/spHead', this.node).getComponent('SpriteMgr');
		let edtName = cc.find('body/edtName', this.node).getComponent(cc.EditBox);
		let um = cc.vv.userMgr;

		sm.setIndex(um.avatar);
		edtName.string = um.nickname;
	},

	onBtnIcon(event, customEventData) {
		let id = parseInt(customEventData);
		let sm = cc.find('body/HeadNode/mask/spHead', this.node).getComponent('SpriteMgr');

		sm.setIndex(id);
	},

	onBtnClose() {
		cc.vv.utils.showDialog(this.node, 'body', false);
	},

	onBtnSubmit() {
		let sm = cc.find('body/HeadNode/mask/spHead', this.node).getComponent('SpriteMgr');
		let edtName = cc.find('body/edtName', this.node).getComponent(cc.EditBox);
		let avatar = sm.index;
		let nickname = edtName.string;
		let utils = cc.vv.utils;

		if (nickname == '') {
			utils.showTips('昵称不能为空');
			return;
		}

		let um = cc.vv.userMgr;
		let param = {
			uid : um.uid,
			nickname : nickname,
			avatar : avatar
		};

		let self = this;

		cc.vv.http.post('/login/setup', param, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}

			let code = ret.code;
			if (code != 0) {
				utils.showTips('设置失败: ' + ret.msg);
				return;
			}

			cc.vv.gameMgr.refreshUser();
			self.onBtnClose();
		});
	}
});
	
