module.exports = { name: "runtime-compat", version: "1.0.0" };

const os = require("node:os");

exports.getDeviceName = () => os.hostname();
