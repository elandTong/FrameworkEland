import BaseComponent from '../base/Component.js';
import routing from '../base/Routing.js';
import AppTool from '../tool/Tool.js';
import Activity from './Activity.view.js';

export default class TipsBox extends BaseComponent {
    _opts = {
        rootId: 'tipsBox',
        maskId: null,
        contentId: null,
        isTouchCancel: true,
        maskOpacity: 0,
        topBackground: '#4169E1',
        contentBackground: 'white',
        colorText: 'black',
        cancelHandel: null // handle
    }

    _showopts = {
        title: 'TipsBox',
        name: null,
        getContent: null, // handle
        setStyle: null, // handle
    }

    _showopts_keep = {
        title: 'TipsBox',
        name: null,
        getContent: null, // handle
        setStyle: null, // handle
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

    win_width = $(window).width()

    win_height = $(window).height()

    con_height = 200

    top_height = 45

    isshow = false

    activity = null

    constructor(opts) {
        super()

        this._opts = AppTool.structureAssignment(this._opts, opts, true)

        this.win_width = $(window).width()

        this.win_height = $(window).height()

        this.con_height = this.win_height / 3.8

        this.top_height = 45

        this._opts.maskId = this._opts.rootId + '_mask'

        this._opts.contentId = this._opts.rootId + '_content'

        let top = '<div class="pages-tipsbox-content-top" id="' + this._opts.contentId + '_top">[con]</div>'

        let view = '<div class="pages-tipsbox-content-view" id="' + this._opts.contentId + '_view"></div>'

        $('#' + this._opts.contentId).html(top + view)

        $('#' + this._opts.rootId).css({
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': this.win_width,
            'height': this.win_height,
            'display': 'none',
            'z-index': -1,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.maskId).css({
            'position': 'relative',
            'width': '100%',
            'height': '100%',
            'background': 'rgba(0,0,0,' + this._opts.maskOpacity + ')',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId).css({
            'position': 'absolute',
            'bottom': -(this.con_height + this.top_height),
            'left': 0,
            'z-index': 10,
            'width': '100%',
            'height': 'fit-content',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId + '_top').css({
            'width': '100%',
            'height': this.top_height,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'background': this._opts.topBackground,
            'font-size': '16px',
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.contentId + '_view').css({
            'width': '100%',
            'height': this.con_height,
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'background': this._opts.contentBackground,
            'font-size': '16px',
            'color': this._opts.colorText,
            'box-sizing': 'border-box'
        })

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

    show(act, showopts) {
        if (this.isshow || act == null || !(act instanceof Activity) || act.isresume == false) {
            return
        }

        this.activity = act

        this._showopts = AppTool.structureAssignment(Object.assign({}, this._showopts_keep), showopts, true)

        if (this.activity && this.activity.pushComponentHandle) {
            this.activity.pushComponentHandle(this.componentHandleOpts)
        }

        this.isshow = true

        $('#' + this._opts.rootId).css('z-index', routing.changedZIndex())

        $('#' + this._opts.rootId).fadeIn(100, () => {
            $('#' + this._opts.contentId).transition({
                bottom: 0
            }, 'fast')
        })

        $('#' + this._opts.contentId + '_top').html(this._showopts.title)

        if (this._showopts.name) {
            AppTool.LoadHTML({
                link: this._showopts.name,
                conId: this._opts.contentId + '_view',
                succHandle: () => {
                },
                errHandle: () => {
                    $('#' + this._opts.contentId + '_view').html('LOAD HTML ERROR!')
                },
                renum: 3,
                color: this._opts.topBackground
            })
        } else {
            if (this._showopts.getContent) {
                $('#' + this._opts.contentId + '_view').html(this._showopts.getContent())
            }

            if (this._showopts.setStyle) {
                this._showopts.setStyle()
            }
        }
    }

    close() {
        if (this.activity && this.activity.removeComponentHandle) {
            this.activity.removeComponentHandle(this.componentHandleOpts)
        }

        this.activity = null

        $('#' + this._opts.contentId).transition({
            bottom: -(this.con_height + this.top_height)
        }, 'slow', () => {
            $('#' + this._opts.rootId).fadeOut(100, () => {
                this.isshow = false

                if (this._opts.cancelHandel) {
                    this._opts.cancelHandel()
                }
            })
        })
    }
}
