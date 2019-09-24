import AppActivity from '../component/AppActivity.js'

/**
 * 组件路由管理
 * by eland.Tong
 */
export default class Routing {
    static activityStack = []

    static interceptHandel = null // finish 拦截器

    static currentZIndex = 100

    static isMainActMount = false // 主 act 是否已经挂载

    static pushActivity(activity) {
        if (activity == null || !(activity instanceof AppActivity)) {
            return
        }

        // 暂停
        let last = this.activityStack[this.activityStack.length - 1]

        if (last instanceof AppActivity) {
            last.onPause()
        }

        // 推送入栈
        this.activityStack.push(activity)

        // 创建
        activity.onCreate()

        // 恢复
        activity.onResume()
    }

    static finish(activity) {
        if (this.interceptHandel) {
            this.interceptHandel()

            return
        }

        if (activity == null || !(activity instanceof AppActivity) || this.activityStack.length <= 1) {
            return
        }

        if (activity === this.activityStack[this.activityStack.length - 1]) {
            // 暂停
            activity.onPause()

            // 销毁
            activity.onDestroy()

            // 出栈
            this.activityStack.splice(this.activityStack.length - 1, 1)

            // 恢复
            let last = this.activityStack[this.activityStack.length - 1]

            if (last instanceof AppActivity) {
                last.onResume()
            }
        } else {
            console.error('finish for activity stack last handel inconsistent')
        }
    }

    static nativeComeBack() {
        this.finish(this.activityStack[this.activityStack.length - 1])
    }

    static setInterceptHandel(handle) { // FINISH 拦截器 使用后需要及时清理(设置为null)
        this.interceptHandel = handle
    }

    static changedZIndex() {
        return ++this.currentZIndex
    }
}
