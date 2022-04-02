# <center>MyVerse</center>  <hr style="border:1px solid gray"> </hr>
## Share and watch your medias
### Features:  🎥 Movies, 🎵 Music

Mudeo is a web application that allow you to upload up to 5 files. Mudeo is made also for streaming.

Accepted formats for medias:

-***mp3, waw, webm, mp4***

Accepted formats for cover image:

-***jpeg, jpg, png***

![Screenshot](md-files/home.png)

## Getting Started
Copy the project in your folder and run npm install

## Prerequisites
-NodeJS

-Npm


## Upload Media
The file that manage the uploading is under app/controllers/medias/add. When a cover image is add the file is resized to the correct Ratio.
Video size must be < 1gb. When the video is uploaded the FFMMPEG libraries first compress and resize the video to 1920x1080 px format. Video is renamed with a unique id and place into public/entities/videos and the link is added to bdd.entities.full_media.
You can change the output format size with FFMPEG for further information please reade the complete documentation on FFMPEG <a href="https://ffmpeg.org/documentation.html">Documentation</a>
```
$cmd="$ff -i $file_temp  -s 1920:1080  $final_directory";
```
When an Audio file is uploaded FFMPEG automatically create a mp4 video with audio wave. You can change the output format size, the wave color and format with FFMPEG for further information please read the complete documentation on FFMPEG <a href="https://ffmpeg.org/documentation.html">Documentation</a>
```
$filter="[0:a]showwaves=colors=blueviolet:s=1280x720:mode=cline,format=yuv420p[v]";
 $map="[v]";
 $cmd="$ff  -i $file_temp -filter_complex $filter -map $map -map 0:a -c:v libx264 -c:a copy $final_directory";
```
![Screenshot](md-files/upload.png)

## License
This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details

## Disclaimer
All pictures copyright to their respective owner(s). This project does not claim ownership of any of the pictures displayed on this site unless stated otherwise. This project does not knowingly intend or attempt to offend or violate any copyright or intellectual property rights of any entity. Some images used on this project are taken from the web and believed to be in the public domain. In addition, to the best of this project's knowledge, all content, images, photos, etc., if any, are being used in compliance with the Fair Use Doctrine (Copyright Act of 1976, 17 U.S.C. § 107.) The pictures are provided for comment/criticism/news reporting/educational purposes only.

Where every care has been taken to ensure the accuracy of the contents of this project, we do not warrant its completeness, quality and accuracy, nor can we guarantee that it is up-to-date. We will not be liable for any consequences arising from the use of, or reliance on, the contents of this project. The respective owners are exclusively responsible for external websites. This project accepts no liability of the content of external links.

Our project follows the safe harbor provisions of 17 U.S.C. §512, otherwise known as Digital Millennium Copyright Act (“DMCA”).

If any images posted here are in violation of copyright law, please contact us and we will gladly remove the offending images immediately upon receipt of valid proof of copyright infringement.

General Copyright Statement
Most of the sourced material is posted according to the “fair use” doctrine of copyright law for non-commercial news reporting, education and discussion purposes. We comply with all takedown requests.

You may not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).

