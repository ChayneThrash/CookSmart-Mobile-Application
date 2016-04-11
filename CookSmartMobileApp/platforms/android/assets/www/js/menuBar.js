menubar = {
    changDisplay: function(){
        $(document).ready(function(){
        $("#menuRecipe").click(function(){
            $("#Home").toggle();
            $("#Recipe").toggle();})
        });
        $("#menuHome").click(function(){
            $("#Home").toggle();
            $("#Recipe").display(none);
        });
        $("#menuSettings").click(function(){
            $("#Home").toggle();
            $("#Settings").toggle();
        });
    },
}