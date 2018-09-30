

cc.Class({
    extends: cc.Component,

    properties: {
		dealerPrefab : cc.Prefab
    },

    start () {
		this.refresh();
    },

    onBtnClose () {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	refresh () {
		let utils = cc.vv.utils;
	
		cc.vv.http.post('/dealer/list_dealers', {}, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}

			let code = ret.code;
			if (code != 0) {
				utils.showTips('通讯失败: ' + ret.msg);
				return;
			}

			this.showDealers(ret.data);
		});
	},

	showDealers (dealers) {
		let content = cc.find('body/scrollView/view/content', this.node);
		let account = cc.vv.userMgr.account;
		
		for (let i = 0; i < dealers.length; i++) {
			let item = this.getItem(content, i);
			let dealer = dealers[i];

			item.getChildByName('txtPhone').getComponent(cc.Label).string = dealer.wechat;
			item.getChildByName('txtNickName').getComponent(cc.Label).string = dealer.nickname;

			let btnCopy = item.getChildByName('btnCopy');
			cc.vv.utils.addClickEvent(btnCopy, this.node, 'dicebusinessman', 'onBtnCopy', dealer.wechat);
		}

		this.shrink(content, dealers.length);
	},

	onBtnCopy(wechat) {
		// TODO
		cc.vv.audioMgr.playBtnClicked();
	},

	getItem (content, id) {
        if (content.childrenCount > id)
            return content.children[id];

        let node = cc.instantiate(this.dealerPrefab);
        content.addChild(node);
        return node;
    },

	shrink (content, num) {
		while (content.childrenCount > num) {
            let lastOne = content.children[content.childrenCount -1];
            content.removeChild(lastOne, true);
        }
	}
});



