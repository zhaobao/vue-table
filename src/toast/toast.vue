<template>
<transition name="slide">
    <div v-if="show" class="toast-container">
        <div class="toast alert alert-dismissible" v-bind:class="getStyle">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close" v-on:click="close">
                <span aria-hidden="true">&times;</span>
            </button>
            <span v-html="message">&nbsp;</span>
        </div>
    </div>
</transition>
</template>

<style lang="sass" scoped>
.toast-container {
    position: fixed;
    top: 1em;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    .toast {
        display: inline-block;
        padding: 1em 3em 1em 1em;
    }
}
.slide-enter-active, .slide-leave-active {
    transition: transform .4s
}
.slide-enter, .slide-leave-active {
    transform: translateY(-111px);
}
</style>

<script>
export default {
    name: 'toast',
    props: {
        style: {
            type: String,
            default: 'success'
        },
        message: {
            type: String,
            default: ''
        },
        next: {
            type: Function,
            default: function() {}
        },
        duration: {
            type: Number,
            default: 2000
        }
    },
    data: function() {
        return {
            show: false,
        }
    },
    computed: {
        getStyle: function() {
            return 'alert-' + this.style;
        }
    },
    updated() {
        window.setTimeout(function() {
            this.show = false;
            this.next();
        }.bind(this), this.duration);
    },
    methods: {
        nextListener(next) {
            this.next = next;
        },
        close() {
            this.show = false;
            this.next();
        }
    }
}
</script>