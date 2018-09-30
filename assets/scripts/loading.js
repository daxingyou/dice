

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    start () {
		let icon = this.node.getChildByName('icon');
		let action = cc.repeatForever(cc.rotateBy(1.0, 360));
		icon.runAction(action);
    }
});


