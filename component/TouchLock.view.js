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
        canvasOffsetTop: 0,
        canvasOffsetX = 50,
        canvasOffsetY = 30,
        type = 'setPwd',
        r = 25,
        nR = r / 2,
        wColor = pageBgColor,
        nColor = "#ffffff",
        touchColor = "#7fffd4",
        lineColor = "#7fffd4",
        hiddenLine = false,
        backCallFun = null,
        verifyHandle: null
    }

    pointsLocation = []

    tempLinePoint = [] // 记录首次绘制的密码

    isTwiceInput = false // 是否第二次输入

    titleTopList = ['设置手势密码', '验证手势密码']

    titleBottomList = ["您需要连接至少5个点", "请重复一次输入的手势密码", "重复手势密码错误,请重新输入!", "手势密码太短,至少需要5个点", "密码设置成功"];

    constructor(opts) {
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

        this.setStyle()

        this._opts.canvasDom = document.getElementById(this._opts.rootId + '_canvas')

        this._opts.canvasDom.width = this._opts.canvasWidth

        this._opts.canvasDom.height = this._opts.canvasHeight

        this._opts.canvasContext = this.canvasDom.getContext('2d')

        let X = (this._opts.canvasWidth - 2 * this._opts.canvasOffsetX - this._opts.r * 2 * 3) / 2

        let Y = (this._opts.canvasHeight - 2 * this._opts.canvasOffsetY - this._opts.r * 2 * 3) / 2

        this.pointsLocation = this.caculateNineCenterLocation(X, Y)

        this.draw(this.pointsLocation, [], null)

        this.initTouchEvent()
    }

    caculateNineCenterLocation(diffX, diffY) {
        let pos = []

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                pos.push({
                    X: (this._opts.canvasOffsetX + col * diffX + (col * 2 + 1) * this._opts.r),
                    Y: (this._opts.canvasOffsetY + row * diffY + (row * 2 + 1) * this._opts.r)
                })
            }
        }

        return pos
    }

    initTouchEvent() {
        let linePoint = [] // 绘制的密码

        let touchmoveIsDraw = false

        this._opts.canvasDom.addEventListener('touchstart', (e) => {
            requestAnimationFrame(() => {
                this.isPointTouched(e.touches[0], linePoint)
            })
        }, false)


        this._opts.canvasDom.addEventListener('touchmove', (e) => {
            if (touchmoveIsDraw) {
                return
            }

            touchmoveIsDraw = true

            e.preventDefault()

            requestAnimationFrame(() => {
                let touches = e.touches[0]

                this.isPointTouched(touches, linePoint)

                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                this.draw(this.pointsLocation, linePoint, {
                    X: touches.pageX,
                    Y: touches.pageY
                })

                touchmoveIsDraw = false
            })
        }, false)

        this._opts.canvasDom.addEventListener('touchend', (e) => {
            requestAnimationFrame(() => {
                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                draw(this.pointsLocation, linePoint, null)

                if (linePoint.length < 5) {
                    $('#' + layoutId + '_bot_tip').html(this.titleBottomList[3])
                } else {
                    if (this._opts.type == 'setPwd') {
                        this.setPassword(linePoint)
                    } else {
                        this.verifyPassword(linePoint)
                    }
                }

                this._opts.canvasContext.clearRect(0, 0, this._opts.canvasWidth, this._opts.canvasHeight)

                draw(this.pointsLocation, [], null)

                linePoint = []
            })
        }, false)
    }

    isPointTouched(touches, linePoint) {
        if (this._opts.canvasOffsetTop == 0) {
            this._opts.canvasOffsetTop = this._opts.canvasDom.offsetTop
        }

        for (let i = 0; i < this.pointsLocation.length; i++) {
            if (linePoint.indexOf(i) >= 0) {
                continue
            }

            let currentPoint = this.pointsLocation[i]

            let xdiff = Math.abs(currentPoint.X - touches.pageX);

            let ydiff = Math.abs(currentPoint.Y - (touches.pageY - this._opts.canvasOffsetTop))

            let dir = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5)

            if (dir <= this._opts.r) {
                if (linePoint.length > 0) {
                    let indexLast = linePoint[linePoint.length - 1] + 1

                    let index = i + 1

                    let pushIndex

                    if ((indexLast + index) % 2 == 0) {
                        if ((indexLast % 2) == 0 && (index % 2) == 0) {
                            if ((indexLast + index) / 2 == 5) {
                                pushIndex = 4

                                if (linePoint.indexOf(pushIndex) < 0) {
                                    linePoint.push(pushIndex)
                                }
                            }
                        } else {
                            if (indexLast != 5 && index != 5) {
                                pushIndex = (indexLast + index) / 2 - 1

                                if (linePoint.indexOf(pushIndex) < 0) {
                                    linePoint.push(pushIndex)
                                }
                            }
                        }
                    }
                }

                linePoint.push(i)

                break
            }
        }
    }

    draw(_pointsLocation, _linePoints, _touchPoint) {
        if (_linePoints.length > 0) {
            this._opts.canvasContext.beginPath()

            if (!this._opts.hiddenLine) {
                for (let i = 0; i < _linePoints.length; i++) {
                    let pointIndex = _linePoints[i]

                    this._opts.canvasContext.lineTo(_pointsLocation[pointIndex].X, _pointsLocation[pointIndex].Y);
                }
            }

            this._opts.canvasContext.lineWidth = 2

            this._opts.canvasContext.strokeStyle = this._opts.lineColor

            this._opts.canvasContext.stroke()

            this._opts.canvasContext.closePath()

            if (_touchPoint != null && !this._opts.hiddenLine) {
                if (this._opts.canvasOffsetTop == 0) {
                    this._opts.canvasOffsetTop = this._opts.canvasDom.offsetTop
                }

                let lastPointIndex = _linePoints[_linePoints.length - 1]

                let lastPoint = _pointsLocation[lastPointIndex]

                this._opts.canvasContext.beginPath()

                this._opts.canvasContext.moveTo(lastPoint.X, lastPoint.Y)

                this._opts.canvasContext.lineTo(_touchPoint.X, Math.abs(_touchPoint.Y - this._opts.canvasOffsetTop))

                this._opts.canvasContext.stroke()

                this._opts.canvasContext.closePath()
            }
        }

        for (let i = 0; i < _pointsLocation.length; i++) {
            let Point = _pointsLocation[i]

            this._opts.canvasContext.fillStyle = this._opts.wColor

            this._opts.canvasContext.beginPath()

            this._opts.canvasContext.arc(Point.X, Point.Y, r, 0, Math.PI * 2, true)

            this._opts.canvasContext.closePath()

            this._opts.canvasContext.fill()

            this._opts.canvasContext.fillStyle = this._opts.nColor

            this._opts.canvasContext.beginPath()

            this._opts.canvasContext.arc(Point.X, Point.Y, nR, 0, Math.PI * 2, true)

            this._opts.canvasContext.closePath()

            this._opts.canvasContext.fill()

            if (_linePoints.indexOf(i) >= 0) {
                this._opts.canvasContext.fillStyle = this._opts.touchColor

                this._opts.canvasContext.beginPath()

                this._opts.canvasContext.arc(Point.X, Point.Y, this._opts.r, 0, Math.PI * 2, true)

                this._opts.canvasContext.closePath()

                this._opts.canvasContext.fill()
            }
        }
    }

    reset() {
        this.isTwiceInput = false

        this.tempLinePoint = []
    }

    setPassword(_LinePoint) {
        if (this.isTwiceInput == false) { //首次绘制
            this.tempLinePoint = _LinePoint

            this.isTwiceInput = true

            $('#' + this._opts.rootId + '_bot_tip').html(this.titleBottomList[1])
        } else { //再次绘制
            if (this.tempLinePoint.join('') === _LinePoint.join('')) {
                saveLocalStorage("touchLockPassword", _LinePoint.join(''))

                saveLocalStorage("touchLockSaveDate", new Date().getTime())

                $("#" + layoutId + "_bot_tip").html(titleBottomList[4])

                isTwiceInput = false

                tempLinePoint = []

                if (this._opts.backCallFun != null) {
                    this._opts.backCallFun(_LinePoint.join(''))
                }
            } else { // 重复绘制错误
                $('#' + this._opts.rootId + '_bot_tip').html(this.titleBottomList[2])
            }
        }
    }

    verifyPassword(_LinePoint) {
        if (this._opts.verifyHandle) {
            this._opts.verifyHandle(_LinePoint.join(''), (data) => {
                if (data.success) {
                    this.reset()

                    $('#' + this._opts.rootId + '_bot_tip').html('手势密码正确!')
                } else {
                    $('#' + this._opts.rootId + '_bot_tip').html('手势密码错误!')
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

        $('.' + this._opts.rootId + '_tip_cas').css({
            'width': 'fit-content',
            'height': 'fit-content',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'font-size': '16px',
            'color': 'white',
            'box-sizing': 'border-box'
        })

        $('#' + this._opts.rootId + '_canvas').css({
            'width': this._opts.canvasWidth,
            'height': this._opts.canvasHeight,
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
