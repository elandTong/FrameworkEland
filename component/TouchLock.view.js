import BaseComponent from "../base/Component.js"
import Tool from "../tool/Tool.js"

export default class TouchLock extends BaseComponent {
    _opts = {
        rootId: '',
        rootDom: null,
        canvasDom: null,
        canvasContext: null,
        canvasWidth: $(window).width(),
        canvasHeight: 350,
        canvasOffsetX: 50,
        canvasOffsetY: 30,
        type: 'setPwd', // setPwd verify
        point: {
            outerRadius: 25,
            innerRadius: 25 / 2,
            colorOuter: '#4169E1',
            colorInner: '#FFFFFF',
            colorTouch: '#4169E1',
        },
        line: {
            color: '#4169E1',
            hide: false
        },
        font: {
            color: '#4169E1',
            size: 16
        },
        setPassHandle: function (pass) {
        },
        verifyHandle: function (pass) {
        }
    }

    pointsLocation = []

    tempLinePoint = [] // 记录首次绘制的密码

    isTwiceInput = false // 是否第二次输入

    tipsType = ['设置手势密码', '验证手势密码']

    tipsIn = ['您需要连接至少5个点', '请重复一次输入的手势密码', '重复手势密码错误,请重新输入!', '手势密码太短,至少需要5个点', '密码设置成功', '手势密码正确!', '手势密码错误!']

    constructor(opts) {
        super()

        if (opts.rootId == null) {
            return
        }

        this._opts = Tool.structureAssignment(Object.assign({}, this._opts), opts)

        this._opts.rootDom = $('#' + this._opts.rootId)

        let view_root = '<div id="' + this._opts.rootId + '_view_root">[content]</div>'

        let top_tip = '<div class="' + this._opts.rootId + '_tip_cas" id="' + this._opts.rootId + '_top_tip"></div>'

        let canvas = '<canvas id="' + this._opts.rootId + '_canvas"></canvas>'

        let bot_tip = '<div class="' + this._opts.rootId + '_tip_cas" id="' + this._opts.rootId + '_bot_tip"></div>'

        this._opts.rootDom.html(view_root.replace('[content]', top_tip + canvas + bot_tip))

        $('#' + this._opts.rootId + '_top_tip').html(this._opts.type == 'setPwd' ? this.tipsType[0] : this.tipsType[1])

        this.setStyle()

        this._opts.canvasDom = Tool.o(this._opts.rootId + '_canvas')

        this._opts.canvasDom.width = this._opts.canvasWidth

        this._opts.canvasDom.height = this._opts.canvasHeight

        this._opts.canvasContext = this._opts.canvasDom.getContext('2d')

        let X = (this._opts.canvasWidth - 2 * this._opts.canvasOffsetX - this._opts.point.outerRadius * 2 * 3) / 2

        let Y = (this._opts.canvasHeight - 2 * this._opts.canvasOffsetY - this._opts.point.outerRadius * 2 * 3) / 2

        this.pointsLocation = this.caculateNineCenterLocation(X, Y)

        this.draw(this.pointsLocation, [], null)

        this.initTouchEvent()
    }

    updateOpts(opts) {
        if (opts == null || opts.type == null) {
            return
        }

        this._opts.type = opts.type == 'verify' ? 'verify' : 'setPwd'

        this.reset()

        $('#' + this._opts.rootId + '_bot_tip').html('')

        $('#' + this._opts.rootId + '_top_tip').html(this._opts.type == 'setPwd' ? this.tipsType[0] : this.tipsType[1])
    }

    caculateNineCenterLocation(diffX, diffY) {
        let pos = []

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                pos.push({
                    X: (this._opts.canvasOffsetX + col * diffX + (col * 2 + 1) * this._opts.point.outerRadius),
                    Y: (this._opts.canvasOffsetY + row * diffY + (row * 2 + 1) * this._opts.point.outerRadius)
                })
            }
        }

        return pos
    }

    initTouchEvent() {
        let touch_point = [] // 绘制的密码

        let touchmove_pause = false

        this._opts.canvasDom.addEventListener('touchstart', (e) => {
            requestAnimationFrame(() => {
                this.isPointTouched(e.touches[0], touch_point)
            })
        }, false)

        this._opts.canvasDom.addEventListener('touchmove', (e) => {
            if (touchmove_pause) {
                return
            }

            touchmove_pause = true

            e.preventDefault()

            requestAnimationFrame(() => {
                let touches = e.touches[0]

                this.isPointTouched(touches, touch_point)

                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                this.draw(this.pointsLocation, touch_point, {
                    X: touches.pageX,
                    Y: touches.pageY
                })

                touchmove_pause = false
            })
        }, false)

        this._opts.canvasDom.addEventListener('touchend', (e) => {
            requestAnimationFrame(() => {
                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                this.draw(this.pointsLocation, touch_point, null)

                if (touch_point.length < 5) {
                    $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[3])
                } else {
                    if (this._opts.type == 'setPwd') {
                        this.setPassword(touch_point)
                    } else {
                        this.verifyPassword(touch_point)
                    }
                }

                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                this.draw(this.pointsLocation, [], null)

                touch_point = []
            })
        }, false)
    }

    isPointTouched(touches, touch_point) {
        for (let i = 0; i < this.pointsLocation.length; i++) {
            if (touch_point.indexOf(i) >= 0) {
                continue
            }

            let current_point = this.pointsLocation[i]

            let xdiff = Math.abs(current_point.X - touches.pageX)

            let ydiff = Math.abs(current_point.Y - (touches.pageY - $(this._opts.canvasDom).offset().top))

            let dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5)

            if (dir <= this._opts.point.outerRadius) {
                if (touch_point.length > 0) {
                    let last_point = touch_point[touch_point.length - 1] + 1

                    let index = i + 1

                    let push_point

                    if ((last_point + index) % 2 == 0) {
                        if ((last_point % 2) == 0 && (index % 2) == 0) {
                            if ((last_point + index) / 2 == 5) {
                                push_point = 4

                                if (touch_point.indexOf(push_point) < 0) {
                                    touch_point.push(push_point)
                                }
                            }
                        } else {
                            if (last_point != 5 && index != 5) {
                                push_point = (last_point + index) / 2 - 1

                                if (touch_point.indexOf(push_point) < 0) {
                                    touch_point.push(push_point)
                                }
                            }
                        }
                    }
                }

                touch_point.push(i)

                break
            }
        }
    }

    draw(_points_location, _line_points, _touch_point) {
        if (_line_points.length > 0) {
            this._opts.canvasContext.beginPath()

            if (!this._opts.line.hide) {
                for (let i = 0; i < _line_points.length; i++) {
                    let point_index = _line_points[i]

                    this._opts.canvasContext.lineTo(_points_location[point_index].X, _points_location[point_index].Y);
                }
            }

            this._opts.canvasContext.lineWidth = 2

            this._opts.canvasContext.strokeStyle = this._opts.line.color

            this._opts.canvasContext.stroke()

            this._opts.canvasContext.closePath()

            if (_touch_point != null && !this._opts.line.hide) {
                let _last_point = _points_location[_line_points[_line_points.length - 1]]

                this._opts.canvasContext.beginPath()

                this._opts.canvasContext.moveTo(_last_point.X, _last_point.Y)

                this._opts.canvasContext.lineTo(_touch_point.X, Math.abs(_touch_point.Y - $(this._opts.canvasDom).offset().top))

                this._opts.canvasContext.stroke()

                this._opts.canvasContext.closePath()
            }
        }

        for (let i = 0; i < _points_location.length; i++) {
            let _point = _points_location[i]

            this._opts.canvasContext.fillStyle = this._opts.point.colorOuter

            this._opts.canvasContext.beginPath()

            this._opts.canvasContext.arc(_point.X, _point.Y, this._opts.point.outerRadius, 0, Math.PI * 2, true)

            this._opts.canvasContext.closePath()

            this._opts.canvasContext.fill()

            this._opts.canvasContext.fillStyle = this._opts.point.colorInner

            this._opts.canvasContext.beginPath()

            this._opts.canvasContext.arc(_point.X, _point.Y, this._opts.point.innerRadius, 0, Math.PI * 2, true)

            this._opts.canvasContext.closePath()

            this._opts.canvasContext.fill()

            if (_line_points.indexOf(i) >= 0) {
                this._opts.canvasContext.fillStyle = this._opts.point.colorTouch

                this._opts.canvasContext.beginPath()

                this._opts.canvasContext.arc(_point.X, _point.Y, this._opts.point.outerRadius, 0, Math.PI * 2, true)

                this._opts.canvasContext.closePath()

                this._opts.canvasContext.fill()
            }
        }
    }

    reset() {
        this.isTwiceInput = false

        this.tempLinePoint = []
    }

    setPassword(_touch_point) {
        if (this.isTwiceInput == false) { //首次绘制
            this.tempLinePoint = _touch_point

            this.isTwiceInput = true

            $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[1])
        } else { //再次绘制
            if (this.tempLinePoint.join('') == _touch_point.join('')) {
                this.reset()

                if (this._opts.setPassHandle) {
                    this._opts.setPassHandle(_touch_point.join(''))
                }

                $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[4])
            } else { // 重复绘制错误
                $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[2])
            }
        }
    }

    verifyPassword(_touch_point) {
        if (this._opts.verifyHandle) {
            this._opts.verifyHandle(_touch_point.join(''), (data) => {
                if (data.success) {
                    this.reset()

                    $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[5])
                } else {
                    $('#' + this._opts.rootId + '_bot_tip').html(this.tipsIn[6])
                }
            })
        }
    }

    setStyle() {
        $('#' + this._opts.rootId + '_view_root').css({
            'width': '100%',
            'height': 'fit-content',
            'display': 'flex',
            'flex-direction': 'column',
            'justify-content': 'flex-start',
            'align-items': 'center',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_canvas').css({
            'width': this._opts.canvasWidth,
            'height': this._opts.canvasHeight,
            'box-sizing': 'border-box'
        })

        $('.' + this._opts.rootId + '_tip_cas').css({
            'width': 'fit-content',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'font-size': this._opts.font.size,
            'color': this._opts.font.color,
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_top_tip').css({
            'margin-bottom': '15px',
        })

        $('#' + this._opts.rootId + '_bot_tip').css({
            'margin-top': '15px'
        })
    }
}
