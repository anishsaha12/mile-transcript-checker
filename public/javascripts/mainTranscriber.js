function loadTxt(edit_flag, file_num){
  var file_url = '/transcripts/'+ (edit_flag ? 'editted_text/':'unchecked_text/') + file_num + '.txt';
  $.ajax({
    url: file_url,
    success: function (data){
      console.log(data);
      //data.split('\n') ;
      document.getElementById("transText").value = data;
    }
  });
}

function loadFile(audio_transcript_id,wav_file, edit_flag) {
    // document.getElementById("transText").value = trans_text;
    document.getElementById("transEditted").innerHTML = edit_flag ? "Editted":"Unchecked";
    document.getElementById("audio_transcript_id").value = audio_transcript_id;
    var audio = document.getElementById("audio");
    document.getElementById("audioSource").src = "/transcripts/audio/"+wav_file;
    audio.load();
    loadTxt(edit_flag,wav_file.split('.')[0]);
}

function saveTranscript() {
    var trans_text = document.getElementById("transText").value;
    
    $.post("/transcript-correction/save",
        {
            audio_transcript_id: document.getElementById("audio_transcript_id").value,
            trans_text: trans_text
        },
        function(data){
            if(data) {
                // console.log(data);
                // alert(data);
                alert("Saved the text successfully");
                location.reload();
            }
        }
    ).fail(function(data, textStatus, xhr) {
        console.log("error", data.status);
        console.log("STATUS: "+xhr);
        location.href = "/";
      }
    );
}