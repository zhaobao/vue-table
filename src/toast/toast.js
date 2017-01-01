/**
 * 模拟 Android 系统 Toast
 * 使用方法
 *
 * const Toast = require('./toast/toast.js').default;
 *  or
 * import Toast from './toast/toast.js';
 *
 * Toast.create({ message: 'abcdef', duration: 2000, style: 'success'});
 * style 有四种： success | danger | info | warning
 */

import Vue from 'vue';
import Toast from './toast.vue';

var ToastConstructor = Vue.extend(Toast);

class ToastQueue {

    constructor() {
        this.queue = [];
    }

    consume() {
        if (this.queue.length === 0) {
            return;
        }
        let that = this;
        let instance = ToastQueue.createInstance(this.queue[0]);
        if (instance) {
            Vue.nextTick(function() {
                instance.show = true;
                instance.nextListener(function() {
                    that.queue.splice(0, 1);
                    if (that.queue.length > 0) {
                        that.consume();
                    }
                });
            });
        }
    }

    static createInstance(config) {
        let instance = new ToastConstructor({
            el: document.createElement('div')
        });
        instance.message = config.message;
        instance.duration = config.duration;
        instance.style = config.style;
        document.body.appendChild(instance.$el);
        return instance;
    }

    create(config={message: 'message', duration: 2000, style: 'success'}) {
        this.queue.push(config);
        if (this.queue.length === 1) {
            this.consume();
        }
    }
}

export default new ToastQueue();