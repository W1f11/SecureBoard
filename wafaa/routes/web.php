<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


use App\Jobs\TestJob;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/test-job', function () {
    TestJob::dispatch();
    return 'TestJob dispatché !';
});

require __DIR__.'/auth.php';
