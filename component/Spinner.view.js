import BaseComponent from '../base/Component.js'
import Tool from '../tool/Tool.js'

export default class Spinner extends BaseComponent {
    dom = null

    _opts = {
        color: '#FFFFFF', // 花瓣颜色
        petalRadius: 6, // 花瓣半径
        internalRadius: 16, // 内径
        petalSum: 10, // 花瓣数量
    }

    constructor(opts) {
        this._opts = Tool.structureAssignment(this._opts, opts, true)

        console.log('spin constructor', this._opts)
    }

    spin(target) {
        this.stop()

        if (target == null) {
            return
        }

        let id = $(target).attr('id')

        let root = '<div id="' + id + '_spin_root">[con]</div>'

        let run = '<div class="lds-spinner" id="' + id + '_lds_spin">[con]</div>'

        let view_petal = ''

        for (let i = 0; i < this._opts.petalSum; i++) {
            view_petal += '<div class="' + id + '_petal"></div>'
        }

        $(target).html(root.replace('[con]', run.replace('[con]', view_petal)))

        // 设置样式
        this.dom = $('#' + id + '_spin_root') // 根视图对象

        this.dom.css({
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'width': '100%',
            'height': 'auto',
            'box-sizing': 'border-box'
        })

        let spin_w = (this._opts.petalRadius * 2 + this._opts.internalRadius) * 2

        let spin_h = (this._opts.petalRadius * 2 + this._opts.internalRadius) * 2

        let petal_w = this._opts.petalRadius * 2

        let petal_h = this._opts.petalRadius * 2

        let petal_top = (spin_h - petal_h) / 2

        let offset_x = (spin_w / 2)

        let offset_y = (spin_h / 2) - petal_top

        let origin_tran = offset_x + 'px ' + offset_y + 'px'

        $('#' + id + '_lds_spin').css({
            'position': 'relative',
            'width': spin_w + 'px',
            'height': spin_h + 'px'
        })

        $('.' + id + '_petal').css({
            'left': '0px',
            'top': petal_top + 'px',
            'position': 'absolute',
            'width': petal_w + 'px',
            'height': petal_h + 'px',
            'border-radius': '50%',
            'transform-origin': origin_tran,
            '-webkit-transform-origin': origin_tran,
            'background': this._opts.color
        })

        let rotate_increment = 360 / this._opts.petalSum

        let times_increment = 1 / this._opts.petalSum

        for (let i = 0; i < this._opts.petalSum; i++) {
            let index = i + 1

            let deg = (rotate_increment * index) - rotate_increment

            let times = ((times_increment * index) - 1).toFixed(2)

            $('.lds-spinner div:nth-child(' + index + ')').css({
                'transform': 'rotate(' + deg + 'deg)',
                '-webkit-transform': 'rotate(' + deg + 'deg)',
                'animation': 'lds-spinner linear 1s infinite',
                '-webkit-animation': 'lds-spinner linear 1s infinite',
                'animation-delay': times + 's',
                '-webkit-animation-delay': times + 's'
            })
        }
    }

    stop() {
        if (this.dom != null) {
            this.dom.remove()

            this.dom = null

            console.log('spin for stop')
        }
    }
}
