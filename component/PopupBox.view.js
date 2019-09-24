import Routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';
import BaseComponent from '../base/Component.js';

export default class PopupBox extends BaseComponent {
    _opts = {
        rootId: 'popupBox',
        align: 'center',
        isfadeIn: true,
        isfadeOut: true,
        opacity: 0
    }

    _showopts = {
        name: null,
        getContent: null,
        setStyle: null,
        bindHandle: null,
        closeHandle: null
    }

    constructor(opts) {
        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'background': 'rgba(0,0,0,' + this._opts.opacity + ')',
            'z-index': -1
        })

        if (this._opts.align == null) {
            this._opts.align = 'center'
        }

        this._setAlign()

        $('#' + this._opts.rootId).click(() => {
            this.close()
        })

        $('#' + this._opts.rootId + '_content').on('click', function (event) {
            event.stopPropagation()
        })
    }

    show(opts) {
        this._showopts = AppTool.structureAssignment(this._showopts, opts, true)

        this._clearStyle()

        this._load()
    }

    close() {
        if (this._opts.isfadeOut) {
            $('#' + this._opts.rootId).fadeOut(500, () => {
                this._clearStyle()
            })
        } else {
            $('#' + this._opts.rootId).css({
                'display': 'none'
            })

            this._clearStyle()
        }

        if (this._showopts.closeHandle != null) {
            this._showopts.closeHandle()
        }
    }

    _bindOK() {
        $('#' + this._opts.rootId).css({
            'z-index': Routing.changedZIndex()
        })

        if (this._opts.isfadeIn) {
            $('#' + this._opts.rootId).fadeIn(500)
        } else {
            $('#' + this._opts.rootId).css({
                'display': 'block'
            })
        }

        if (this._showopts.bindHandle != null) {
            this._showopts.bindHandle()
        }
    }

    _clearStyle() {
        $('#' + this._opts.rootId + '_content').html('')

        $('#' + this._opts.rootId + '_content').css({
            'width': '',
            'height': '',
            'display': '',
            'justify-content': '',
            'align-items': '',
            'background': ''
        })

        this._setAlign()
    }

    _setAlign() {
        let box = $('#' + this._opts.rootId + '_content')

        box.css({
            'position': 'fixed'
        })

        switch (this._opts.align) {
            case 'center': {
                box.css({
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
            case 'bottom': {
                box.css({
                    'left': '50%',
                    'top': '100%',
                    'transform': 'translate(-50%,-100%)'
                })

                break
            }
            case 'top': {
                box.css({
                    'left': "50%",
                    'top': "0",
                    'transform': 'translate(-50%,0)'
                })

                break
            }
            case 'none': {
                box.css({
                    'left': '0',
                    'top': '0',
                    'transform': ''
                })

                break
            }
            default: {
                box.css({
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
        }
    }

    _load() { // 加载视图内容
        let _con = $('#' + this._opts.rootId + '_content')

        _con.css({
            'width': 'auto',
            'height': 'auto'
        })

        let url = this._showopts.name

        if (url != null && url.trim() != '') { // 异步操作
            AppTool.getRequest(url, (data) => {
                _con.html(data)

                this._bindOK()
            })
        } else if (this._showopts.getContent != null) {
            _con.html(this._showopts.getContent())

            if (this._showopts.setStyle != null) {
                this._showopts.setStyle()
            }

            this._bindOK()
        } else {
            this.close()

            console.log('popupbox no content handel')
        }
    }
}
