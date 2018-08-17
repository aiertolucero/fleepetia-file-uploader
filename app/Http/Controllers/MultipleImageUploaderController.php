<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\ImageManagerStatic as Image;
use App\Photos;

class MultipleImageUploaderController extends Controller
{

    public function index(){
        $photos = Photos::all();
        return view('welcome', ['photos' => $photos]);
    }

    public function uploadPhoto(Request $request)
	{
        $mainImage = $request->file('mainImage');
        $blurImageName = $request->input('blurImage');
        $mainImageName = $mainImage->hashName();

        $destinationPath = public_path('photos/');

        $mainImage = Image::make($mainImage);

        Photos::create([
		            'mainImageName' => $mainImageName,
		            'blurImageName' => $blurImageName
        ]);

        $mainImage->save($destinationPath.$mainImageName);

        return response()->json([
            'msg' => 'Upload Successfully!',
            'imgFileName' => $mainImageName,
            'status' => true
        ]);
	}

	public function uploadBlurPhoto(Request $request)
	{
        $destinationBlurPath = public_path('photos/blur/');
        $blurImage = $request->file('blurImage');
        $blurImageName = $blurImage->hashName();
        $blurImage = Image::make($blurImage);
		$blurImage->save($destinationBlurPath.$blurImageName);

        return response()->json([
            'msg' => 'Upload Successfully!',
            'imgFileName' => $blurImageName,
            'status' => true
        ]);
	}
}
