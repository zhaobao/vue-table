<template>
<div v-if="show" class="modal fade" tabindex="-1" role="dialog" ref="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" v-on:click="clickClose"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title"><slot name="header">Header Slot</slot></h4>
            </div>
            <div class="modal-body">
                <slot>Body Slot</slot>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" v-on:click="clickCancel">Close</button>
                <button type="button" class="btn btn-primary" v-on:click="clickOK">Save</button>
            </div>
        </div>
    </div>
</div>
</template>
<style lang="sass" scoped>
</style>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true
        },
        action: {
            type: String
        }
    },
    methods: {
        clickClose: function() {
            this.dismissDialog();
            $(this.$refs.dialog).on('hidden.bs.modal', function() {
                this.$emit('clickClose');
            }.bind(this))
        },
        clickOK: function() {
            this.dismissDialog();
            $(this.$refs.dialog).on('hidden.bs.modal', function() {
                this.$emit('clickOk', this.action);
            }.bind(this))
        },
        clickCancel: function() {
            this.dismissDialog();
            $(this.$refs.dialog).on('hidden.bs.modal', function() {
                this.$emit('clickCancel');
            }.bind(this))
        },
        dismissDialog: function() {
            $(this.$refs.dialog).modal('hide');
        }
    },
    updated() {
        if (this.show) {
            $(this.$refs.dialog).modal({backdrop: 'static', show: true});
        }
    }
}
</script>
