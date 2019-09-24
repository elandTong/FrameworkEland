/**
 * 基础组件
 * 定义栏组件生命周期回调
 * 所以生命周期处理器统一由路由管理
 * by eland.Tong
 * create date : 2019/09/24
 */
export default class BaseComponent {
    constructor() {
        console.log('BaseComponent on constructor')
    }

    onCreate() {
        console.log('BaseComponent on create')
    }

    onResume() {
        console.log('BaseComponent on resume')
    }

    onPause() {
        console.log('BaseComponent on pause')
    }

    onDestroy() {
        console.log('BaseComponent on destroy')
    }

    onUpdate() {
        console.log('BaseComponent on update')
    }
}
