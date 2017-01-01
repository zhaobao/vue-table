<template>
<div class="dropdown" v-bind:class="open ? 'open' : ''">
    <button class="btn btn-default" v-on:click="toggleDropdown">
        <span class="glyphicon glyphicon-filter"></span>
    </button>
    <ul class="dropdown-menu">
        <li v-for="(item, index) in columns">
            <a href="#" class="cool-drop-item" v-on:click.prevent="toggleCheck(index)">
                <span class="cool-check" v-bind:class="item.checked ? 'checked' : ''"></span>
                <span>{{ item.name }}</span>
            </a>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <div class="cool-down-operate clearfix">
                <span class="btn-link pull-left" v-on:click="selectAll">All</span>
                <span class="btn-link pull-left" v-on:click="clearAll">Clear</span>
                <span class="btn-link pull-right" v-on:click="okFilter">OK</span>
            </div>
        </li>
    </ul>
</div>
</template>
<style lang="sass" scoped>
.cool-drop-item {
    padding: 3px 8px;
}
.cool-check {
    margin: 3px 12px 3px 6px;
    border: 1px solid #aaaaaa;
    width: 14px;
    height: 14px;
    display: inline-block;
    float: left;
    &.checked {
        background-color: #449d44;
        border-color: #4cae4c;
    }
}
.cool-down-operate {
    padding: 3px 12px;
    span {
        padding: 0 6px;
        cursor: pointer;
    }
}
</style>
<script>
const R = require('ramda');
export default {
    name: 'cool-drop-filter',
    props: {
        columns: {
            type: Array,
            default: []
        },
        doFilter: {
            type: Function,
            default: function() {}
        }
    },
    data(){
        return{
            msg:'hello vue',
            open: false,
            checked: [],
            items: this.columns
        }
    },
    created() {
        let vm = this;
        R.forEach((item) => {
            vm.$set(item, 'checked', false);
        }, this.items);
    },
    methods: {
        toggleCheck: function(index) {
            if (this.items[index].checked) {
                this.items[index].checked = false;
                this.checked = R.filter((item) => {
                    return index != item;
                }, this.checked);
            } else {
                this.items[index].checked = true;
                this.checked.push(index);
            }
        },
        toggleDropdown: function() {
            this.open = !this.open;
        },
        selectAll: function() {
            let vm = this;
            let i = 0;
            vm.checked = [];
            R.forEach((item) => {
                vm.$set(item, 'checked', true);
                vm.checked.push(i++);
            }, this.items);
        },
        clearAll: function() {
            let vm = this;
            R.forEach((item) => {
                vm.$set(item, 'checked', false);
            }, this.items);
            vm.checked = [];
        },
        okFilter: function() {
            this.open = false;
                this.$emit('doFilter', this.checked);
        },
        getUniqueColumns: function() {
            let keys = [];
            return R.filter((column) => {
                if (keys.indexOf(column.field) === -1) {
                    keys.push(column.field);
                    return true;
                } else {
                    return false;
                }
            }, this.columns);
        }
    }
}
</script>
