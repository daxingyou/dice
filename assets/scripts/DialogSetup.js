

cc.Class({
    extends: cc.Component,

    properties: {
		music : cc.Node,
		sound : cc.Node
    },

	start () {
		let am = cc.vv.audioMgr;
		let mscBox = this.music.getComponent('CheckBox');
		let sfxBox = this.sound.getComponent('CheckBox');

		mscBox.setValue(am.bgmVolume > 0);
		sfxBox.setValue(am.sfxVolume > 0);
	},

    onBtnClose() {
    	cc.vv.audioMgr.playBtnClicked();
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

	onBtnExit() {
		cc.vv.audioMgr.playBtnClicked();
		cc.vv.userMgr.logout();
	},

	onMusicClick () {
		let box = this.music.getComponent('CheckBox');
		let val = box.getValue();

		cc.vv.audioMgr.playBtnClicked();

		cc.vv.audioMgr.setBGMVolume(val ? 1 : 0);
	},

	onSoundClick () {
		let box = this.sound.getComponent('CheckBox');
		let val = box.getValue();

		cc.vv.audioMgr.playBtnClicked();

		cc.vv.audioMgr.setSFXVolume(val ? 1 : 0);
	},
});



