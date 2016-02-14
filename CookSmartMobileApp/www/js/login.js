var login = {
    
    createAccountToggledOn: false,
    
    onPageLoad: function() {
        $(".create-account-field").hide();
        $("#login-submit-button").on('click', login.sendLoginRequest);
        $("#login-create-button").on('click', login.modifyPageForAccountCreation);
    },
    
    sendLoginRequest: function() {
        
    },
    
    modifyPageForAccountCreation() {
        login.swapButtonText();
        $(".create-account-field").toggle();
        $("#password-confirmation-field").val("");
        $("#display-name-field").val("");
        login.createAccountToggledOn = !login.createAccountToggledOn;
    },
    
    swapButtonText() {
        var loginButtonText = $("#login-submit-button").text();
        $("#login-submit-button").text($("#login-create-button").text()); 
        $("#login-create-button").text(loginButtonText);
    }
    
};

login.onPageLoad();