<template>
<ul class="pagination clearfix">
    <li
            v-on:click.prevent="toStart"
            class="p-start"
            v-bind:class="startActive ? 'active' : ''"><a href="#">{{start}}</a></li>
    <li v-if="showJump">
        <input
                type="number"
                class="form-control input-md input-page"
                v-model="current"
                v-on:keyup.enter="confirm($event)"
                v-on:focus="focus($event)" />
    </li>
    <li class="p-end"
        v-if="showEnd"
        v-on:click.prevent="toEnd"
        v-bind:class="endActive ? 'active' : ''"><a href="#">{{end}}</a></li>
</ul>
</template>

<style lang="sass" scoped>
.input-page {
    border-radius: 0;
    width: 3em;
    display: inline;
    text-align: center;
    padding-left: 2px;
    padding-right: 2px;
    margin-left: -1px;
    box-shadow: none;
    float: left;
    border-color: #dddddd;
}
</style>

<script>
// 分页组件，极简分页设计
export default {
    name: 'pagination',
    props: {
        start: {
            type: Number,
            default: 1
        },
        end: {
            type: Number,
            required: true
        },
        selected: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            startActive: true,
            endActive: false,
            showJump: true,
            showEnd: true,
            current: 1
        }
    },
    created() {
        this.initStatus();
    },
    updated() {
        this.initStatus();
    },
    computed: {

    },
    methods: {
        initStatus: function() {
            if (this.end - this.start < 2) {
                this.showJump = false;
            }
            if (this.end === this.start) {
                this.startActive = true;
                this.endActive = false;
                this.showEnd = false;
            } else {
                this.showEnd = true;
            }
            if (this.selected === this.start) {
                this.startActive = true;
            }
        },
        confirm: function(e) {
            e.target.select();
            this.startActive = false;
            this.endActive = false;
            if (this.current <= 0) {
                this.current = 1;
            } else if (this.current > this.end) {
                this.current = this.end;
            }
            this.$emit('change', this.current);
        },
        focus: function(e) {
            e.target.select();
        },
        toEnd: function() {
            this.startActive = false;
            this.endActive = true;
            this.current = this.end;
            this.$emit('change', this.end);
        },
        toStart: function() {
            this.startActive = true;
            this.endActive = false;
            this.current = this.start;
            this.$emit('change', this.start);
        }
    }
}
</script>