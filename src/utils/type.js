/**
 * 数据类型检测
 * Created by zhaobao on 7/2/16.
 */
module.exports = {

    FUNCTION: 'function',
    STRING: 'string',
    OBJECT: 'object',
    NULL: 'null',
    UNDEFINED: 'undefined',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    ARRAY: 'array',

    getType: function(value) {
        return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    }
};