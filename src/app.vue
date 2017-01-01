<template>
<div id="app">
    <cool-table
            v-on:clickTr="clickTr"
            v-bind:refresh="refresh"
            v-bind:pageSize="pageSize"
            v-bind:columns="columns"
            v-bind:api="api">
    </cool-table>
    <cool-dialog
            v-bind:show="showDialog"
            v-bind:action="action"
            v-on:clickClose="toggleDialog"
            v-on:clickOk="dialogOk"
            v-on:clickCancel="toggleDialog">
        <input type="hidden" v-model="current"/>
        <span slot="header">{{title}}</span>
        <span>{{ content }}</span>
    </cool-dialog>
</div>
</template>

<style lang="sass">
#app {
    margin: 2em;
}
.btn-edit, btn-delete {
    margin-right: .5em;
}
</style>

<script>
import Dialog from './dialog/dialog.vue';
import Table from './table/table.vue';
import Toast from './toast/toast.js';
export default {
    name: 'app',
    data: function() {
        return {
            name: 'actions',
            showDialog: false,
            api: "http://127.0.0.1:8089/actions",
            pageSize: 5,
            columns: [
                { field: 'id', name: 'ID', sortable: true, width: '20%' },
                { field: 'action_key', name: 'KEY', sortable: false, searchable: true, render: function(value, row) {
                    return '<code>custom column content: </code>' + value;
                }},
                { field: 'id', name: 'OPERATE', width: '20%', sortable: true, render: function(value, row) {
                    let operates = [];
                    operates.push('<button class="btn btn-sm btn-default btn-edit">edit</button>');
                    operates.push('<button class="btn btn-sm btn-default btn-delete">delete</button>');
                    return operates.join('');
                }},
            ],
            content: '',
            title: '',
            action: '',
            refresh: false,
            current: null
        }
    },
    methods: {
        dialogOk: function(data) {
            this.toggleDialog();
            if (data === 'delete') {
                window.setTimeout(function() {
                    this.refresh = !this.refresh;
                }.bind(this), 400);
            }
        },
        toggleDialog: function() {
            this.showDialog = !this.showDialog;
        },
        clickTr: function(e, data) {
            this.current = data['id'];
            if (e.target.classList.contains('btn-edit')) {
                this.content = JSON.stringify(data);;
                this.title = 'Edit';
                this.action = 'edit';
                this.toggleDialog();
            } else if (e.target.classList.contains('btn-delete')) {
                this.content = 'delete ' + JSON.stringify(data);;
                this.title = 'Delete';
                this.action = 'delete';
                this.toggleDialog();
            } else {
                Toast.create({ message: 'You click TR', duration: 2000, style: 'success'});
            }
        }
    },
    components: {
        'cool-dialog': Dialog,
        'cool-table': Table
    }
}
</script>
