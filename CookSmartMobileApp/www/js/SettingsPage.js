var SettingsPage = {
    
    onPageLoad: function() {
        $("#connectToDevice").off('click');
        $("#connectToDevice").on('click', SettingsPage.connectToDevice);
        $("#logout").off('click');
        $("#logout").on('click', SettingsPage.logout);
        $("#wifiSave").off('click');
        $("#wifiSave").on('click', SettingsPage.changeDeviceWifiCredentials);
    },
    
    connectToDevice: function() {
        if ($("#deviceIdTextBox").val() != null && $("#deviceIdTextBox").val().length > 0) {
            $.ajax({
                url: Settings.server + '/ConnectToDevice',
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ deviceId: $("#deviceIdTextBox").val() }),
                success: function(response) {
                    if(response.status === "ok") {
                        app.connectToDevice();
                        alert("connected device to account");
                    } else {
                        app.deviceConnected = false;
                        $('#ConnectingToHub').show();
                        $('#ConnectedToHub').hide();
                        $("#device-status-text").text("Device status: unknown");
                        alert(response.msg);
                    }
                    $(".device-modal").hide();
                }
            });
        } else {
            alert("device id field cannot be blank");
        }
    },
    
    logout: function() {
        $.ajax({
            url: Settings.server + '/Logout',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({}),
            success: function(response) {
                if (response.status === "ok") {
                    localStorage.removeItem('user');
                    localStorage.removeItem('recipes');
                    window.location.href = 'login.html'
                } else {
                    alert("Error logging out. Server might be unavailable.");
                }
            }
        });
    },
    
    changeDeviceWifiCredentials: function() {
        if (($("#SSIDTextBox").val() != null) && ($("#SSIDTextBox").val().length > 0) && ($("#WifiPasswordTextBox").val() != null) && ($("#WifiPasswordTextBox").val().length > 0)) {
            Util.setWifiCredentials($("#SSIDTextBox").val(), $("#WifiPasswordTextBox").val(), function(response) {
                if(response.status === "ok") {
                    alert("successfully set credentials");
                } else {
                    alert("error: " + response.msg);
                }
                $(".wifi-modal").hide();
            });
        } else {
            alert("Ssid and passwords fields can't be blank");
        }
    }
    
};