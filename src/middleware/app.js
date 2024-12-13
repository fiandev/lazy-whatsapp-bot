const middleware = new Map();

middleware.set('antilink.js', require('./antilink.js'))
middleware.set('activity-record.js', require('./activity-record.js'))
middleware.set('timeout-expired.js', require('./timeout-expired.js'))
middleware.set('timeout.js', require('./timeout.js'))
middleware.set('register.js', require('./register.js'))
middleware.set('ai.js', require('./ai.js'))
middleware.set('antinfsw-media.js', require('./antinfsw-media.js'))

module.exports = middleware