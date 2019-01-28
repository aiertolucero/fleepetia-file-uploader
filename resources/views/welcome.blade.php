<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Fleepetia Image Uploader</title>

        <link rel="stylesheet" type="text/css" href="{{ URL::asset('vendor/blueimp/blueimp-gallery-indicator.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('vendor/blueimp/blueimp-gallery.min.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('vendor/bootstrap/bootstrap.min.css') }}">
        <link rel="stylesheet" type="text/css" href="{{ URL::asset('vendor/font-awesome-4.7.0/css/font-awesome.min.css') }}">

        <link rel="stylesheet" type="text/css" href="{{ URL::asset('css/fleepetia-fileuploader.min.css') }}">

    </head>
    <body>
        <div class="container">

            <div class="row text-center">
                <div class="title m-b-md">
                    Fleepetia Image Uploader
                </div>
                <form>
                    <!-- For POST csrf token -->
                    <input type="hidden" name="_token" id="uploadToken" value="{{ csrf_token() }}">

                    <div class="upload-btn-wrapper">
                      <div class="btn-progress-all"></div>  

                      <button class="btn btn-fileupload">Upload images 
                        <!-- Add this icons form uploading spinners-->
                        <i class="fa fa-upload upload-icon" aria-hidden="true"></i> 
                        <i class="fa fa-circle-o-notch fa-spin uploading-icon hide" aria-hidden="true"></i>
                      </button>
                      <input type="hidden" name="blurImage" id="blurImage" value="" >
                      <input type="file" name="mainImage" id="fileupload"  data-url="/upload" multiple />
                    </div>
                </form>

                <div class="row mrg-b-t">
                    <div class="col-xs-12 text-center">
                        <div class="grid" id="grid">
                            <div class="grid-sizer"></div>
                            @forelse($photos as $photo)
                              <a href="../photos/{{$photo->mainImageName}}" class="grid-item item-gallery" data-id="{{$photo->id}}" data-gallery>
                                <i class="hide fa fa-times-circle-o fa-remove-photo" aria-hidden="true"></i>
                                <img src="../photos/{{$photo->mainImageName}}" />
                              </a>
                            @empty
                              <p>No photos uploaded...</p>
                            @endforelse
                        </div>
                    </div>
                </div>
                <hr>

                <!-- Gallery Controls -->
               <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls" data-start-slideshow="true" data-filter=":even">
                    <div class="slides"></div>
                    <h3 class="title"></h3>
                    <a class="prev">‹</a>
                    <a class="next">›</a>
                    <a class="close">×</a>
                    <a class="play-pause"></a>
                    <ol class="indicator"></ol>
                </div>
            </div>
        </div>

        <script src="{{ URL::asset('vendor/jquery/jquery.min.js') }}"></script>
        <script src="{{ URL::asset('vendor/jquery/jquery-fileupload-ui.js') }}"></script>
        <script src="{{ URL::asset('vendor/jquery/jquery-fileupload.js') }}"></script>
        <script src="{{ URL::asset('vendor/jquery/circle-progress.min.js')}}"></script>
        <script src="{{ URL::asset('vendor/jquery/jquery-blueimp-gallery.min.js')}}"></script>
        <script src="{{ URL::asset('vendor/masonry/masonry.pkgd.min.js') }}"></script>
        <script src="{{ URL::asset('vendor/masonry/imageLoaded.js') }}"></script>

        <script src="{{ URL::asset('js/fleepetia-file-uploader.js') }}"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                var fpOptions = {
                                    uploadPath : "{{ App::make('url')->to('/photos') }}",
                                    uploadBlurPath : '/blur/',
                                    csrfToken : $('#uploadToken').val(),
                                    gridId : '#grid',
                                    gridItemClass : '.grid-item',
                                    fileUploaderId : '#fileupload'
                                }
                initUploader(fpOptions);
            });
        </script>
    </body>
</html>
