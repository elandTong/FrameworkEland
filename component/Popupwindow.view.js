import BaseComponent from '../base/Component.js';
import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';

export default class Popupwindow extends BaseComponent {
    _opts = {
        rootId: 'popupBox',
        maskId: null,
        contentId: null,
        align: 'center',
        position: {
            x: 0,
            y: 0
        },
        isTouchCancel: false,
        opacity: 0,
        bindHandle: null,
        closeHandle: null
    }

    _showopts = {
        name: null,
        getContent: null,
        setStyle: null
    }

    _showopts_keep = {
        name: null,
        getContent: null,
        setStyle: null
    }

    constructor(opts) {
        super()

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'background': 'rgba(0,0,0,' + this._opts.opacity + ')',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': 'fit-content',
            'height': 'fit-content',
            'box-sizing': 'border-box'
        })

        if (this._opts.align == null) {
            this._opts.align = 'center'
        }

        this._clearStyle()

        AppTool.o(this._opts.maskId).onclick = (e) => {
            e.stopPropagation()

            if (this._opts.isTouchCancel) {
                this.close()
            }
        }

        AppTool.o(this._opts.contentId).onclick = (e) => {
            e.stopPropagation()
        }
    }

    show(show_opts) {
        this._showopts = AppTool.structureAssignment(Object.assign({}, this._showopts_keep), show_opts, true)

        this._clearStyle()

        this._load()
    }

    close() {
        $('#' + this._opts.rootId).fadeOut(300, () => {
            this._clearStyle()

            if (this._opts.closeHandle) {
                this._opts.closeHandle()
            }
        })
    }

    _bindOK() {
        $('#' + this._opts.rootId).css('z-index', routing.changedZIndex())

        $('#' + this._opts.rootId).fadeIn(300, () => {
            if (this._opts.bindHandle) {
                this._opts.bindHandle()
            }
        })
    }

    _clearStyle() {
        $('#' + this._opts.contentId).html('')

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': 'fit-content',
            'height': 'fit-content',
            'display': '',
            'justify-content': '',
            'align-items': '',
            'background': '',
            'box-sizing': 'border-box'
        })

        this._setAlign()
    }

    _setAlign() {
        let box = $('#' + this._opts.contentId)

        switch (this._opts.align) {
            case 'center': {
                box.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
            case 'bottom': {
                box.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '100%',
                    'transform': 'translate(-50%,-100%)'
                })

                break
            }
            case 'top': {
                box.css({
                    'position': 'absolute',
                    'left': "50%",
                    'top': "0",
                    'transform': 'translate(-50%,0)'
                })

                break
            }
            case 'none': {
                box.css({
                    'position': 'absolute',
                    'left': this._opts.position.x,
                    'top': this._opts.position.y,
                    'transform': ''
                })

                break
            }
            default: {
                box.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
        }
    }

    _load() { // 加载视图内容
        let _con = $('#' + this._opts.contentId)

        _con.css({
            'width': 'fit-content',
            'height': 'fit-content'
        })

        if (this._showopts.name) { // 异步操作
            AppTool.getRequest(this._showopts.name, (data) => {
                _con.html(data)

                this._bindOK()
            })
        } else if (this._showopts.getContent) {
            _con.html(this._showopts.getContent())

            if (this._showopts.setStyle) {
                this._showopts.setStyle()
            }

            this._bindOK()
        } else {
            this.close()

            console.log('popupbox no content handel')
        }
    }
}
