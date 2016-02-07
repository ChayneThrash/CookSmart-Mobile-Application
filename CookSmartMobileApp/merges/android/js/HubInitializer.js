
var HubInitializer = function(onInitialization) {
	this.onInitialization = onInitialization;
};

HubInitializer.prototype.InitializeHub = function(error) { 
    var self = this;
	ZeroConf.list("_workstation._tcp.local.", 1000,
		function(json) {
			self.onMDnsDiscovery(json);
		},
		function(e) {
			self.InitializeHub(e);
	});
};

HubInitializer.prototype.onMDnsDiscovery = function(workstationsFound) {
    var serverFound = false;
	var serverIp = null;
	$.each(workstationsFound.service, function(i, item) {
		serverFound = item.server === 'cthrash.local.';
        if (serverFound) {
			serverIp = item.addresses[0];
		}
		return serverFound;
    });
    if (!serverFound) {
        this.InitializeHub("");
    } else {
    	if (this.onInitialization !== null) {
			this.onInitialization(serverIp);
    	}
    }
};
