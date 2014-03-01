module.exports = function(dust) {
    /*
     自定义timeFormat helper
     */
    dust.helpers.timeFormat = function(chunk, ctx, bodies, params) {
        var time = dust.helpers.tap(params.time, chunk, ctx);
        if (!time) {
            return chunk.write('');
        }
        var src = new Date(time);
        var now = new Date();
        var dm = now.getDate() - src.getDate();
        if (0 != dm) {
            return chunk.write(dm + '天前');
        } else {
            var hm = now.getHours() - src.getHours();
            if (0 != hm) {
                return chunk.write(dm + '小时前');
            } else {
                return chunk.write('刚刚');
            }
        }
    };
};