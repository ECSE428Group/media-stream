Media-Stream
============

Setup:
  Run the install.sh script in devscripts

Run:
  Go in to the media-site directory and type meteor

Dependencies:
  For transcoding you will need FFMpeg. 
    -For Windows you will need to manually download the exe and install it.
    -For Mac OsX, if you have a package manager like Homebrew, life will be much easier. Just brew install ffmpeg.
    -For Linux, use apt-get install ffmpeg
  For node.js
     If you cd into the media-stream directory and (sudo) npm install fluent-ffmpeg as well as threads_a_gogo, you should be good for dependencies fo transcoding. If you have problems with threads_a_gogo, it may be because you are running on a 64 bit Mac. In this case, check out these threads: https://github.com/joyent/node/issues/3633 and https://github.com/xk/node-threads-a-gogo/issues/32 . You have to change the settings BEFORE you npm install, this is a bug in node.js that they haven't fixed yet.
     
Tests:
  To run QUnit tests just open the related HTML file in the tests directory
