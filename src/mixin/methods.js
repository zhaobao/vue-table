import Ajax from '../utils/ajax.js';
export default {
    methods: {
        i18n: function(key) {
            return this.$strings(key);
        },
        ajaxGet: function(param, ok, error) {
            Ajax.get(param).then(ok).catch(error);
        },
        ajaxPost: function(param, ok, error) {
            Ajax.post(param).then(ok).catch(error);
        }
    }
}