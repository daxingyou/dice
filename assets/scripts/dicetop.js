

cc.Class({
    extends: cc.Component,

    properties: {
		prefab : null
    },

    onLoad () {
		let self = this;

		cc.loader.loadRes("prefabs/dicetopitem", (err, prefab) => {
			self.prefab = prefab;
		});
    },

	onEnable () {
		this.refresh();
	},

	refresh () {
		let utils = cc.vv.utils;
		let self = this;
	
		cc.vv.http.post('/dealer/list_top_players', {}, ret => {
			if (!ret) {
				utils.showTips('通讯失败');
				return;
			}

			let code = ret.code;
			if (code != 0) {
				utils.showTips('通讯失败: ' + ret.msg);
				return;
			}

			self.showTopPlayers(ret.data);
		});
	},

    onBtnClose() {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	showTopPlayers (players) {
		let content = cc.find('body/content', this.node);
		let utils = cc.vv.utils;
		
		for (let i = 0; i < players.length; i++) {
			let item = this.getItem(content, i);
			let player = players[i];

			item.getChildByName('txtTop').getComponent(cc.Label).string = '' + i;
			item.getChildByName('txtName').getComponent(cc.Label).string = player.nickname;
			//item.getChildByName('txtMoney').getComponent(cc.Label).string = player.balance;
			//item.getChildByName('txtGift').getComponent(cc.Label).string = player.gift;
			// TODO
			//item.getChildByName('btnGetGift').active = false;
		}

		this.shrink(content, players.length);
	},

	getItem (content, id) {
        if (content.childrenCount > id)
            return content.children[id];

        let node = cc.instantiate(this.prefab);
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


