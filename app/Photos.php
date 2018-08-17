<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Photos extends Model
{
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
	    'mainImageName','blurImageName'
	];

    protected $table = 'photos';
}
