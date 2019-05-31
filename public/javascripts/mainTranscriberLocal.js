$(document).ready(function(){
	var $audio = $('#audio');
	var i;
    var files;

    var volunteer_audio_files=[];
    var loaded_audio_files=[];
    var options = document.getElementById("search_file").options;
    for(var j=0;j<options.length; j++){
        volunteer_audio_files.push(options[j].value);
    }

	$('#audio_files').on('change', function(e) {
	  	files = document.getElementById("audio_files").files;
        i=-1;
        for(var j=0;j<files.length; j++){
            if(files[j].name.endsWith(".txt"))
                loaded_audio_files.push(files[j].name);
        }        
	});
	$('#next').click(function(){
	   	var reader = new FileReader();
        // alert("Next: "+i+","+volunteer_audio_files+","+volunteer_audio_files[i]);
		if (files && i<volunteer_audio_files.length && i>=-1) {
            if(i==volunteer_audio_files.length-1){
                alert("Reached Last File");
                return;
            }else{
                i+=1;
            }
            var reader = new FileReader();
		    reader.onload = function (e) {
                var info = volunteer_audio_files[i].split(',');
                loadFile(info[2],info[0],info[1]);
                $audio.attr('src', e.target.result);
                $audio.load();
            }
            var next_index = loaded_audio_files.indexOf(volunteer_audio_files[i].split(',')[0]);
            if(next_index==-1){
                alert("File "+volunteer_audio_files[i].split(',')[0]+" NOT found.\nMake sure it is selected.");
                location.reload();
            }else{
                reader.readAsDataURL(files[next_index]);
            }
		}else{
            if(!files){
                alert("Please Select all files in directory");
            }
        }
    });
    
    $('#previous').click(function(){
        var reader = new FileReader();
        // alert(i+","+volunteer_audio_files+","+volunteer_audio_files[i]);
        if (files && i<volunteer_audio_files.length && i>=-1) {
            if(i==-1){
                i=0;
            }else if(i==0){
                alert("Reached First File");
                return;
            }else{
                i-=1;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var info = volunteer_audio_files[i].split(',');
                loadFile(info[2],info[0],info[1]);
                $audio.attr('src', e.target.result);
                $audio.load();
            }
            var next_index = loaded_audio_files.indexOf(volunteer_audio_files[i].split(',')[0]);
            if(next_index==-1){
                alert("File "+volunteer_audio_files[i].split(',')[0]+" NOT found.\nMake sure it is selected.");
                location.reload();
            }else{
                reader.readAsDataURL(files[next_index]);
            }
        }else{
            if(!files){
                alert("Please Select all files in directory");
            }
            if(i==volunteer_audio_files.length){
                alert("Reached Last File");
            }
        }
    });

    $('#search_btn').click(function(){
        var reader = new FileReader();
        var info = document.getElementById("search_file").value.split(',');
        if (files) {
            var reader = new FileReader();
            reader.onload = function (e) {
                i = volunteer_audio_files.indexOf(info.join(','));
                loadFile(info[2],info[0],info[1]);
                $audio.attr('src', e.target.result);
                $audio.load();
            }
            var next_index = loaded_audio_files.indexOf(info[0]);
            if(next_index==-1){
                alert("File "+info[0]+" NOT found.\nMake sure it is selected.");
                location.reload();
            }else{
                reader.readAsDataURL(files[next_index]);
            }
        }else{
            if(!files){
                alert("Please Select all files in directory");
            }
        }
    });
    $('#wait').hide();
    $('#wait').bind("ajaxSend", function() {
        $(this).show();
    }).bind("ajaxComplete", function() {
        $(this).hide();
    });
});

function loadTxt(edit_flag, file_num){
    var file_url = '/transcripts/'+ (edit_flag=="1" ? 'editted_text/':'unchecked_text/') + file_num + '.txt';
    $.ajax({
      url: file_url,
      beforeSend: function() { $('#wait').show(); },
      complete: function() { $('#wait').hide(); },
      success: function (data){
        // console.log(data);
        // data.split('\n') ;
        document.getElementById("transText").value = data;
      }
    });
}

function loadFile(audio_transcript_id,wav_file, edit_flag) {
    // document.getElementById("transText").value = trans_text;
    document.getElementById("transEditted").innerHTML = edit_flag=="1" ? "Edited":"Unchecked";
    document.getElementById("audio_file_name").innerHTML = wav_file;
    document.getElementById("audio_transcript_id").value = audio_transcript_id;
    
    loadTxt(edit_flag,wav_file.split('.')[0]);
}

function saveTranscript() {
    var trans_text = document.getElementById("transText").value;
    
    $.ajax({
        type: 'POST',
        url: "/transcript-correction/save",
        data: {
            audio_transcript_id: document.getElementById("audio_transcript_id").value,
            trans_text: trans_text
        },
        beforeSend: function(xhr, opts) { 
            if(document.getElementById("audio_transcript_id").value==""){
                alert("Please Select Audio file and Transcript!!");
                xhr.abort();
            }
            else
                $('#wait').show(); 
        },
        success: function(data) {
            if(data) {
                // console.log(data);
                // alert(data);
                alert("Saved the text successfully");
                location.reload();
            }
        },
        error: function(xhr) { 
            console.log("STATUS: "+xhr);
            $('#wait').hide();
            location.href = "/";
        },
        complete: function() { $('#wait').hide(); }
    });
}