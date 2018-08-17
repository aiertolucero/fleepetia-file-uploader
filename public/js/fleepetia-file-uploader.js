$(function () {
    $.fn.masonryImagesReveal = function( $items ) {
      var msnry = this.data('masonry');
      var itemSelector = msnry.options.itemSelector;
      $items.hide();
      this.append( $items );

      $items.imagesLoaded().progress( function( imgLoad, image ) {
        var $item = $( image.img ).parents( itemSelector );
        $item.show();
        msnry.appended( $item );
      });

      return this;
    };

    $.fn.masonryNewPhoto = function( $items ) {
      var msnry = this.data('masonry');
      var itemSelector = msnry.options.itemSelector;
      $items.imagesLoaded().progress( function( imgLoad, image ) {
        var $item = $( image.img ).parents( itemSelector );
        $(image.img).removeClass('vis-hidden');
        $(image.img).parent('a').removeClass('h-200');
        container.masonry();
      });
      return this;
    };

    var uploadPath = appUrl;
    var totalPhotos = 0;
    var totalPhotosUploaded = 0;
    var carouselLinks = [];
    var container = $('#grid').masonry({
          itemSelector: '.grid-item',
          gutter: 2,
          fitWidth: true,
          horizontalOrder: true
        });
        container.masonryImagesReveal(container.find('.item'));
        container.imagesLoaded()
          .done( function( instance ) {
            container.masonry({
              itemSelector: '.grid-item',
              gutter: 2,
              fitWidth: true,
              horizontalOrder: true
            });
            container.masonry();
          }); 

    function toggleIcons(){
        $('.uploading-icon').toggleClass('hide');
        $('.upload-icon').toggleClass('hide');
    }

    function resizeMainImage(canvas,image){
      max_blur_height = 608,
      max_blur_width = 1080,
      width = image.width,
      height = image.height;

      if (width > height) {
        if (width > max_blur_width) {
          height *= max_blur_width / width;
          width = max_blur_width;
        }
      } else {
        if (height > max_blur_height) {
          width *= max_blur_height / height;
          height = max_blur_height;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      return canvas;
    }


    function resizeBlurImage(canvas,image){
      max_blur_height = 20,
      max_blur_width = 35,
      width = image.width,
      height = image.height;

      if (width > height) {
        if (width > max_blur_width) {
          height *= max_blur_width / width;
          width = max_blur_width;
        }
      } else {
        if (height > max_blur_height) {
          width *= max_blur_height / height;
          height = max_blur_height;
        }
      }

      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      return canvas;
    }

    $('#fileupload').fileupload({
        dataType: 'json',
        add: function (e, data) {
            if(data.files && data.files[0]){
                if(totalPhotos === 0){
                    toggleIcons();
                }

                data.gallery = $('<a class="grid-item item-gallery"></i><div class="circle-photo-loader"></div></a>');
                totalPhotos += 1;

                container.masonry()
                  .append( data.gallery )
                  .masonry( 'appended', data.gallery )
                container.imagesLoaded(function(){
                  container.masonry('reloadItems');
                  container.masonry();
                });

                $(data.gallery).children('div').circleProgress({
                    value: 0.0,
                    size: 80,
                    fill: "#39cf97" 
                });

                var reader = new FileReader();
                var formData = new FormData();

                formData.append("_token", $('#uploadToken').val());

                reader.onload = function (readerEvent) {
                    var image = new Image();
                    image.onload = function (imageEvent) {

                          // Resize the image
                          var canvasMainImage = document.createElement('canvas');
                          var canvasBlurImage = document.createElement('canvas');
                          canvasMainImage = resizeMainImage(canvasMainImage,image);
                          canvasBlurImage = resizeBlurImage(canvasBlurImage,image);

                            canvasMainImage.toBlob(
                                function (blobMain) {
                                  data.files[0] = blobMain // set the main image to the resized blob
                                  canvasBlurImage.toBlob(
                                  function (blobBlur) {

                                    formData.append("blurImage", blobBlur, data.files[0].name); // appending the blur photo to the Form

                                    $.ajax({
                                        url : '/uploadBlur',
                                        type :  'POST',
                                        data : formData,
                                        enctype: 'multipart/form-data',
                                        contentType: false,
                                        processData: false,
                                        success: function(res){
                                            $(data.gallery).css('background-image','url('+uploadPath+'/blur/'+encodeURIComponent(res.imgFileName.trim())+')'); // making the blur image as the background before submitting the main image
                                            $('#blurImage').val(res.imgFileName); // adding the blurimage name to the hidden input before submitting it
                                            data.submit();
                                        }
                                    });
                                  },
                                  'image/jpeg'
                                );
                                },
                                'image/jpeg'
                            );
                    }
                    image.src = readerEvent.target.result;
                }
                reader.readAsDataURL(data.files[0]);
            }
        },
        progress: function(e, data){
            var currentValue = parseInt(data.loaded / data.total * 100, 10) * 0.01;
            $(data.gallery).children('div').circleProgress('value', currentValue); 
        },
        done: function (e, data) {
          totalPhotosUploaded += 1;

          if(totalPhotos === totalPhotosUploaded){
              $('.btn-progress-all').animate({ width: '0%' }, 1);

              toggleIcons();

              carouselLinks.push({
                  href: uploadPath+'/'+data.result.imgFileName,
              });
              
              totalPhotos = 0;
              totalPhotosUploaded = 0; 

              $('.btn-delete-photos').attr("disabled", false);
              $('.btn-select-primary').attr("disabled", false);

          }
          else{
              totalPercentage = parseInt(totalPhotosUploaded / totalPhotos * 100, 10);
              $('.btn-progress-all').animate({ width: totalPercentage+'%' }, 500);

              carouselLinks.push({
                  href: uploadPath+'/'+data.result.imgFileName,
              });
          }

          container.masonryNewPhoto($(data.gallery).addClass('h-200').html($('<i class="hide fa fa-times-circle-o fa-remove-photo" aria-hidden="true"></i><img src="'+uploadPath+'/'+data.result.imgFileName+'">')));
          container.imagesLoaded()
            .done( function( instance ) {
              container.masonry({
                itemSelector: '.grid-item',
                gutter: 2,
                fitWidth: true,
                horizontalOrder: true
              });
              container.masonry();
            });
          $(data.gallery).prop('href', uploadPath+'/'+data.result.imgFileName);
          $(data.gallery).attr('data-gallery', '');
          $(data.gallery).attr('data-id', data.result.id);

          if(data.result.isprimary){
            $defaultItem = $('.item-default');
            container.masonry( 'remove', $defaultItem );
            container.masonry({
              itemSelector: '.grid-item',
              gutter: 2,
              fitWidth: true,
              horizontalOrder: true
            });
            $(data.gallery[0]).addClass('item-primary');
            $(data.gallery[0]).append('<i class="fa fa-star fa-primary-photo" aria-hidden="true"></i>');
          }

        }
    });

  
  $(document).off('click','.item-gallery').on('click','.item-gallery', function(event){
      event = event || window.event;
      var target = event.target || event.srcElement,
          link = target.src ? target.parentNode : target,
          options = {
              index: link,
              event: event
          },
          links = $('.grid-item');
      blueimp.Gallery(links, options);
  });

});