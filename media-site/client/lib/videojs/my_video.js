window.onload=function(){
(function localFileVideoPlayerInit(win) {
    var URL = win.URL || win.webkitURL,
        displayMessage = (function displayMessageInit() {
            var node = document.querySelector('#message');

            return function displayMessage(message, isError) {
                node.innerHTML = message;
                node.className = isError ? 'error' : 'info';
            };
        }()),
        playSelectedFile = function playSelectedFileInit(event) {
            var file = this.files[0];
            var type = file.type;
            var videoNode = document.querySelector('video');
            var canPlay = videoNode.canPlayType(type);
            canPlay = (canPlay === '' ? 'no' : canPlay);
            var message = 'Can play type "' + type + '": ' + canPlay;
            var isError = canPlay === 'no';
            displayMessage(message, isError);
            if (isError) {
                return;
            }

            var fileURL = URL.createObjectURL(file);
            console.log(fileURL);
            videoNode.src = fileURL;
        },
        inputNode = document.querySelector('input');
    if (!URL) {
        displayMessage('Your browser is not ' + '<a href="http://caniuse.com/bloburls">supported</a>!', true);
        return;
    }
    $(".select").change(function () {
        console.log("change");
        $('#select-modal').addClass("show");
    });
    $(".video-modal .close").click(function(){
        $(this).closest(".video-modal").removeClass("show");
        $(this).next('video').get(0).pause();
    });
    inputNode.addEventListener('change', playSelectedFile, false);
}(window));
};




