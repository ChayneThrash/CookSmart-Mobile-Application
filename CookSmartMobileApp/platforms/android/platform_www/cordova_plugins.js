cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    },
    {
        "file": "plugins/cordova-zeroconf-plugin/www/ZeroConf.js",
        "id": "cordova-zeroconf-plugin.zeroconf",
        "pluginId": "cordova-zeroconf-plugin",
        "clobbers": [
            "ZeroConf"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2-dev",
    "cordova-zeroconf-plugin": "1.2.0"
}
// BOTTOM OF METADATA
});