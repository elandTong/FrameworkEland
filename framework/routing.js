import AppTool from '../component/appTool.js'

export default class Routing {
    static PAGE_PUSH_THEME = 'PAGE_PUSH_THEME'

    static activityList = []

    static backClickInterceptHandel = null

    static currentZIndex = 100

    static isMainActMount = false // 主 act 是否已经挂载

    static pushActivity(actHandel) {
        this.activityList.push(actHandel)

        AppTool.emit({
            theme: this.PAGE_PUSH_THEME,
            TOP_LEVEL: actHandel
        })
    }

    static finish(handelId) {
        let len = this.activityList.length

        let handel = this.activityList[len - 1]

        if (handelId === handel) {
            try {
                handel()
            } catch (e) {
                console.log('finish for activityList last handel try', e)
            }

            if (len > 1) { // 移除最后一个处理器 main act 处理器不移除
                this.activityList.splice(len - 1, 1)

                AppTool.emit({
                    theme: this.PAGE_PUSH_THEME,
                    TOP_LEVEL: this.activityList[this.activityList.length - 1]
                })
            }
        } else {
            console.log('finish for activityList last handel inconsistent')
        }
    }

    static _finishForce() {
        this.finish(this.activityList[this.activityList.length - 1])
    }

    static nativeComeBack() {
        if (this.backClickInterceptHandel != null) {
            this.backClickInterceptHandel()

            return
        }

        this.finish()
    }
}