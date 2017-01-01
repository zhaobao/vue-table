<template>
<div class="dropdown" v-bind:class="open ? 'open' : ''">
    <button class="btn btn-md btn-default" type="button" v-on:click="toggleDropDown">
        <span>{{getSelected}}</span>
        <span v-if="cart == '1'" class="caret"></span>
    </button>
    <ul class="dropdown-menu">
        <li
                v-for="column in getUniqueColumns()"
                v-on:click.prevent="selectItem(column.hasOwnProperty('field') ? column.field : column)">
            <a href="#">{{ column.hasOwnProperty('name') ? column.name : column }}</a>
        </li>
    </ul>
</div>
</template>
<style lang="sass">
</style>
<script>
const R = require('ramda');
export default{
    name: 'cool-drop-down',
    props: {
        columns: {
            type: Array
        },
        chosen: {
            type: String,
            default: ''
        },
        default: {
            type: String,
            default: ''
        },
        cart: {
            type: String,
            default: '0'
        },
        doSelect: {
            type: Function,
            default: function() {
                console.log(arguments)
            }
        }
    },
    data(){
        return {
            open: false,
            selected: this.chosen
        }
    },
    methods: {
        toggleDropDown: function() {
            this.open = !this.open;
        },
        selectItem: function(field) {
            this.selected = field;
            this.toggleDropDown();
            this.$emit('doSelect', field);
        },
        getUniqueColumns: function() {
            let keys = [];
            let result =  R.filter((column) => {
                let item = column.hasOwnProperty('field') ? column.field : column;
                if (keys.indexOf(item) === -1) {
                    keys.push(item);
                    return true;
                } else {
                    return false;
                }
            }, this.columns);
            return result;
        }
    },
    computed: {
        getSelected: function() {
            if (this.selected === '') {
                return this.default;
            } else {
                let find = this.selected;
                if (typeof(this.columns[0]) != 'string' && this.columns[0].hasOwnProperty('field')) {
                    return R.find(R.propEq('field', this.selected))(this.columns).name;
                }
                return find;
            }
        }
    }
}
</script>
