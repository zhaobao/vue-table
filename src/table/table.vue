<template>
<transition name="fade">
<div class="table-container">
    <div v-if="showLoading" class="table-loading"><img v-bind:src="loadingImg"/></div>
    <div v-if="showError">error.....</div>
    <transition name="fade">
        <div v-if="show">
            <div class="table-header">
                <div class="table-header-left pull-left">
                    <cool-drop-down
                            class="pull-left size"
                            v-bind:columns="sizes"
                            default="size"
                            v-on:doSelect="changePageSize"/>
                    <cool-drop-down
                            class="pull-left"
                            v-bind:columns="columns"
                            default="column"
                            v-on:doSelect="selectConditionField"/>
                    <cool-drop-down
                            class="pull-left operate"
                            v-bind:columns="operateColumns"
                            default="="
                            chosen="="
                            cart="0"
                            v-on:doSelect="selectConditionOperate" />
                    <div class="input-group pull-left table-condition">
                        <input type="text" class="form-control" v-model="condition" v-on:keyup.enter="doCondition" />
                        <span class="input-group-addon" v-on:click="clearFilter">╳</span>
                    </div>
                </div>
                <div class="table-header-right pull-right">
                    <cool-drop-filter
                            v-bind:columns="columns"
                            v-on:doFilter="doFilter"
                            class="pull-right" />
                    <div class="input-group pull-right table-search" v-if="hasSearch">
                        <input type="text" class="form-control" v-model="search" v-on:keyup.enter="doSearch" v-bind:placeholder="getPlaceholder" />
                        <span class="input-group-addon" v-on:click="clearSearch">╳</span>
                    </div>
                </div>
            </div>
            <div class="table-body">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th v-for="(column, index) in copyColumns"
                                v-if="column.filter"
                                v-bind:style="getWidth(column.width)"
                                v-on:click="_toggleSort(index)">
                                <span>{{ column.name }}</span>
                                <span
                                        v-if="_sortable(index)"
                                        v-bind:class="_getSortCssClass(index)"
                                        class="pull-right glyphicon">
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, i) in items" v-on:click="clickRow(i, $event)" v-bind:class="'tr-' + i">
                            <td
                                    v-for="(column, index) in columns"
                                    v-if="column.filter"
                                    v-bind:data-row="i"
                                    v-bind:data-col="index"
                                    v-bind:class="'td-' + column.field"
                                    v-html="_getTdContent(column.field, row, index)">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table-footer clearfix">
                <table-pagination class="pagination pull-right"
                        v-bind:start="config.start"
                        v-bind:end="config.end"
                        v-bind:selected = "config.page + 1"
                        v-on:change="changePage">
                </table-pagination>
            </div>
        </div>
    </transition>
</div>
</transition>
</template>
<style lang="sass" scoped>
.table-header {
    min-height: 3em;
    margin-bottom: 0.5em;
    .operate {
        margin: 0 .5em;
    }
    .size {
        margin: 0 .5em 0 0;
    }
    .table-header-left, .table-header-right {
        height: 36px;
        width: 30%;
    }
}
.table-search {
    margin-right: 1em;
    width: 50%;
}
.table-condition {
    width: 50%;
}
.table-container {
    position: relative;
}
.table {
    margin-bottom: 0;
    .dim {
        opacity: 0.4;
    }
}
.table-loading {
    position: absolute;
    left: 0;
    right: 0;
    top: 6em;
    padding: 1em;
    text-align: center;
    z-index: 8;
    img {
        padding: 0.5em;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .5);
    }
}
.input-group-addon {
    cursor: pointer;
    background-color: white;
    &:hover {
        color: red;
    }
}
.pagination {
    margin: 1em 0;
}
</style>
<script>
import Pagination from './pagination.vue';
import Methods from '../mixin/methods.js';
import DropFilter from '../dropdown/dropfilter.vue';
import DropDown from '../dropdown/dropdown.vue';
const TypesUtil = require('../utils/type.js');
const loadingImg = require('./loading.svg');
const R = require('ramda');

const operateColumns = [{field: '=', name: '='}, {field: '>', name: '>'}, {field: '<', name: '<'}];

export default {
    name: 'table',
    mixins: [Methods],
    props: {
        api: {
            type: String,
            required: true
        },
        columns: {
            required: true,
            validator: function(value) {
                return TypesUtil.ARRAY === TypesUtil.getType(value) && value.length > 0;
            }
        },
        clickTr: {
            type: Function,
            default: function() {
                console.log(arguments)
            }
        },
        pageSize: {
            type: Number,
            default: 5
        },
        options: {
            type: Object,
            default: function() {
                return {
                    sortIcon: 'glyphicon glyphicon-sort dim',
                    sortAscIcon: 'glyphicon-sort-by-alphabet',
                    sortDescIcon: 'glyphicon-sort-by-alphabet-alt'
                };
            }
        },
        refresh: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showLoading: true,
            showError: false,
            show: false,
            error: '',
            search: '',
            config: {
                start: 1,
                end: 1,
                page: 0
            },
            copyColumns: R.filter(()=>{ return true; }, this.columns),
            sortIndexes: [],
            sorts: [],
            searches: [],
            search: '',
            conditionField: '',
            conditionOperate: '=',
            condition: '',
            items: [],
            loadingImg: loadingImg,
            pageSizeCopy: this.pageSize,
            sizes: [5, 10, 20, 50, 100],
            operateColumns: operateColumns
        }
    },
    created() {
        let vm = this;
        for (let i = 0, l = this.copyColumns.length; i < l; i++) {
            let column = this.copyColumns[i];
            if (column.hasOwnProperty('sortable') && column['sortable']) {
                vm.sortIndexes.push(i);
                if (!column.hasOwnProperty('sort')) vm.$set(column, 'sort', '')
            }
            if (!column.hasOwnProperty('filter')) vm.$set(column, 'filter', true)
            if (column.hasOwnProperty('searchable') && column['searchable'] && column['filter']) vm.searches.push(column['field']);
        }
        this.ajaxData();
    },
    watch: {
        copyColumns: function() {
        },
        refresh: function() {
            this.showLoading = true;
            this.ajaxData();
        }
    },
    methods: {
        _toggleSort: function(index) {
            if (!this._sortable(index)) return;
            let vm = this;
            for (let i = 0, l = this.copyColumns.length; i < l; i++) {
                let column = this.copyColumns[i];
                if (i === index) {
                    if (column['sort'] === 'asc' || column['sort'] === '') {
                        column['sort'] = 'desc';
                    } else {
                        column['sort'] = 'asc'
                    }
                    vm.sorts = [];
                    vm.sorts.push(column['field'] + ' ' + column['sort']);
                    vm.showLoading = true;
                    vm.config.page = 0;
                    vm.ajaxData();
                } else {
                    column['sort'] = '';
                }
            }
        },
        _sortable: function(index) {
            return this.sortIndexes.indexOf(index) >= 0;
        },
        _getSortCssClass: function(index) {
            let find = this.copyColumns[index];
            let sort = find['sort'];
            if (sort === 'desc') {
                return this.options.sortDescIcon;
            } else if (sort === 'asc') {
                return this.options.sortAscIcon;
            } else {
                return this.options.sortIcon
            }
        },
        _getTdContent: function(field, column, index) {
            if (!column.hasOwnProperty(field)) {
                throw new Error('row has no ' + field + ' field');
            }
            let find = this.copyColumns[index];
            if (find && find.hasOwnProperty('render')) {
                return find['render'](column[field], column)
            }
            return column[field];
        },
        changePage: function(current) {
            this.config.page = current <= 0 ? 0 : current -1;
            this.showLoading = true;
            this.ajaxData();
        },
        _ajaxParam: function() {
            return {
                filter: this.condition === '' ? '' : this.conditionField + this.conditionOperate + "'" + this.condition + "'",
                search: this.search,
                searchFields: this.searches.join(','),
                page: this.config.page,
                size: this.pageSizeCopy,
                sort: this.sorts.join(',')}
        },
        ajaxData: function() {
            let vm = this;
            this.ajaxGet({ url: this.api, data: this._ajaxParam() }, function(json) {
                json = JSON.parse(json);
                if (json.code === 200) {
                    window.setTimeout(function() {
                        vm.config.end = Math.ceil(json['total'] / vm.pageSizeCopy);
                        vm.items = json['actions']
                        vm.showLoading = false;
                        vm.showError = false;
                        vm.show = true;
                    }, 1000);
                }
            }, function(e) {
                json = JSON.parse(json);
                vm.showError = true;
                vm.show = false;
            });
        },
        doFilter: function(fields) {
            let vm = this;
            if (fields.length > 0) {
                vm.searches = [];
                for (let i = 0, l = this.copyColumns.length; i < l; i++) {
                    let column = this.copyColumns[i];
                    vm.$set(column, 'filter', fields.indexOf(i) >= 0);
                    if (fields.indexOf(i) >= 0 && column.hasOwnProperty('searchable') && column.searchable && column['filter']) {
                        vm.searches.push(this.copyColumns[i]['field']);
                    }
                }
                console.log(vm.searches);
            }
        },
        doSearch: function() {
            this.config.page = 0;
            this.showLoading = true;
            this.ajaxData();
        },
        clearSearch: function() {
            this.search = '';
            this.showLoading = true;
            this.ajaxData();
        },
        clearFilter: function() {
            this.condition = '';
            this.showLoading = true;
            this.ajaxData();
        },
        hasColumn: function(field) {
            return R.find(R.propEq('field', field))(this.copyColumns) !== undefined;
        },
        getWidth: function(style) {
            return { width: style };
        },
        clickRow: function(index, e) {
            this.$emit('clickTr', e, this.items[index]);
        },
        doCondition: function() {
            this.config.page = 0;
            this.showLoading = true;
            this.ajaxData();
        },
        selectConditionField: function(field) {
            this.conditionField = field;
        },
        selectConditionOperate: function(field) {
            this.conditionOperate = field;
        },
        changePageSize: function(size) {
            this.pageSizeCopy = size;
            this.showLoading = true;
            this.ajaxData();
        }
    },
    computed: {
        hasSearch: function() {
            return this.searches.length > 0;
        },
        getPageSize: function(size=0) {
            if (size > 0) return size;
            return this.pageSize;
        },
        getPlaceholder: function() {
            let placeholders = [];
            let keys = [];
            R.forEach((column) => {
                if (keys.indexOf(column.field) < 0 && column.hasOwnProperty('searchable') && column.searchable && column.filter) {
                    placeholders.push(column.name);
                    keys.push(column.field);
                }
            }, this.copyColumns);
            return placeholders.join(',');
        }
    },
    components: {
        'table-pagination': Pagination,
        'cool-drop-filter': DropFilter,
        'cool-drop-down': DropDown,
    }
}
</script>
