import BaseComponent from '../base/Component.js';
import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';
import Activity from './Activity.view.js';

export default class Popupwindow extends BaseComponent {
    _opts = {
        rootId: 'popupBox',
        maskId: null,
        contentId: null,
        align: 'center', // top bottom center none(position)
        position: {
            x: 0,
            y: 0
        },
        isTouchCancel: false,
        opacity: 0,
        openHandle: null,
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

    componentHandleOpts = {
        onCreate: () => {
        },
        onResume: () => {
        },
        onPause: () => {
            this.close()
        },
        onUpdate: () => {
        },
        onDestroy: () => {
        }
    }

    activity = null

    isshow = false

    constructor(opts) {
        super()

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': $(window).width(),
            'height': $(window).height(),
            'display': 'none',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,' + this._opts.opacity + ')',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'z-index': 10,
            'width': 'fit-content',
            'height': 'fit-content',
            'box-sizing': 'border-box'
        })

        this._opts.align = this._opts.align ? this._opts.align : 'center'

        this.clear()

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

    show(act, opts) {
        if (this.isshow || act == null || !(act instanceof Activity) || act.isresume == false) {
            return
        }

        this.activity = act

        this._showopts = AppTool.structureAssignment(Object.assign({}, this._showopts_keep), opts, true)

        this.clear()

        this.load()
    }

    open() {
        if (this.activity && this.activity.pushComponentHandle) {
            this.activity.pushComponentHandle(this.componentHandleOpts)
        }

        this.isshow = true

        $('#' + this._opts.rootId).css('z-index', routing.changedZIndex())

        $('#' + this._opts.rootId).fadeIn(300, () => {
            if (this._opts.openHandle) {
                this._opts.openHandle()
            }
        })
    }

    close() {
        if (this.activity && this.activity.removeComponentHandle) {
            this.activity.removeComponentHandle(this.componentHandleOpts)
        }

        this.activity = null

        $('#' + this._opts.rootId).fadeOut(300, () => {
            this.isshow = false

            this.clear()

            if (this._opts.closeHandle) {
                this._opts.closeHandle()
            }
        })
    }

    clear() {
        $('#' + this._opts.contentId).html('')

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'width': 'fit-content',
            'height': 'fit-content',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'display': '',
            'justify-content': '',
            'align-items': '',
            'background': ''
        })

        this.align()
    }

    align() {
        let dom = $('#' + this._opts.contentId)

        switch (this._opts.align) {
            case 'center': {
                dom.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
            case 'bottom': {
                dom.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '100%',
                    'transform': 'translate(-50%,-100%)'
                })

                break
            }
            case 'top': {
                dom.css({
                    'position': 'absolute',
                    'left': "50%",
                    'top': "0",
                    'transform': 'translate(-50%,0)'
                })

                break
            }
            case 'none': {
                dom.css({
                    'position': 'absolute',
                    'left': this._opts.position.x,
                    'top': this._opts.position.y,
                    'transform': ''
                })

                break
            }
            default: {
                dom.css({
                    'position': 'absolute',
                    'left': '50%',
                    'top': '50%',
                    'transform': 'translate(-50%,-50%)'
                })

                break
            }
        }
    }

    load() { // 加载视图内容
        if (this._showopts.name) { // 异步操作
            AppTool.getRequest(this._showopts.name, (data) => {
                $('#' + this._opts.contentId).html(data)

                this.open()
            })

            console.log('popupbox routing content handel')
        } else if (this._showopts.getContent) {
            $('#' + this._opts.contentId).html(this._showopts.getContent())

            if (this._showopts.setStyle) {
                this._showopts.setStyle()
            }

            this.open()

            console.log('popupbox get content handel')
        } else {
            this.close()

            console.log('popupbox not content handel')
        }
    }
}
