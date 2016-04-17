var SettingsPage = {
    
    onPageLoad: function() {
        $("#connectToDevice").off('click');
        $("#connectToDevice").on('click', SettingsPage.connectToDevice);
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
                    } else {
                        app.deviceConnected = false;
                        $('#ConnectingToHub').show();
                        $('#ConnectedToHub').hide();
                        $("#device-status-text").text("Device status: unknown");
                    }
                    $(".device-modal").hide();
                }
            });
        } else {
            alert("device id can't be empty.");    
        }
    }
    
    
};