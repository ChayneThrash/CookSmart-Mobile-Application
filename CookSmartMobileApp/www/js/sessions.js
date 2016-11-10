var sessionId = localStorage.getItem('session');
 
//// if there was no localStorage for the session id 
//// the application is being run for the first time
//// the session id must be created
if (!sessionId) {
    sessionId = uuid.v4();
    localStorage.setItem('session', sessionId);
}
 
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
 
    // if there is data being sent
    // add the sessionId to it
    if (options.data) {
        var temp = JSON.parse(options.data);
        temp['sessionId'] = sessionId;
        options.data = JSON.stringify(temp);
    }
 
    // if there is no data being sent
    // create the data and add the sessionId
    else {
        options.data = JSON.stringify({ sessionId : sessionId });
    }
 
});