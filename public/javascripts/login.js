$(document).ready(function(){
    var v_name,v_password,v_lang_id;
    $("#submit").click(function(){
        v_name=$("#v_name").val();
        v_password=$("#v_password").val();
        v_lang_id=$("#v_lang_id").val();
        
        $.post("/user/login",
            {
                v_name:v_name,
                v_password:v_password,
                v_lang_id:v_lang_id
            },
            function(data){
                if(data) {
                    console.log(data);
                    // alert(data);
                    location.href = "/transcript-correction/local";
                }
            }
        );
    });
});