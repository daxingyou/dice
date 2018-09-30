

cc.Class({
    extends: cc.Component,

    properties: {
        on : cc.Node,
		off : cc.Node,
		_value : false,

		clickEvents: {
            default: [],
            type: cc.Component.EventHandler
		}
    },

    start () {
		this.refresh();
    },

	onBtnClick (event) {
		this.setValue(!this._value);

		cc.Component.EventHandler.emitEvents(this.clickEvents, event);
	},

	getValue() {
		return this._value;
	},

	setValue (val) {
		this._value = val;
		this.refresh();
	},

	refresh () {
		if (this.on)
			this.on.active = this._value;

		if (this.off)
			this.off.active = !this._value;
	}
});


