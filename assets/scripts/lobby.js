
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
		cc.vv.gameMgr.dataEventHandler = this.node;

		let user_panel = this.node.getChildByName('user_panel');

		this.node.on('game_self_update', () => {
			let up = user_panel.getComponent('UserPanel');
			up.setMoney(cc.vv.userMgr.balance);
		});
    },

    start () {
		cc.vv.audioMgr.playBGM('gameBg.mp3');
    },

    onBtnJoin() {
        //cc.director.loadScene('room');
		let gm = cc.vv.gameMgr;

		cc.vv.audioMgr.playBtnClicked();

		cc.vv.utils.showLoading(true);
		gm.connectGameServer();
    },

    onBtnExchangeRecord() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('DialogExchangeRecord');

		cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnSetting() {
		cc.vv.audioMgr.playBtnClicked();

		let dialog = this.node.getChildByName('DialogSetup');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    onBtnExchange() {
		cc.vv.audioMgr.playBtnClicked();
	
        let dialog = this.node.getChildByName('DialogExchange');

        cc.vv.utils.showDialog(dialog, 'body', true);
    },

    // update (dt) {},
});


