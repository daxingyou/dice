

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    onBtnClose() {
        cc.vv.utils.showDialog(this.node, 'body', false);
    },

    // update (dt) {},
});
