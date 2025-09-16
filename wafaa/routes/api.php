<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Models\Project;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('projects', ProjectController::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->get('/projects', function() {
    return App\Models\Project::with('user')->get();
});

Route::middleware('auth:sanctum')->get('/projects', function (Request $request) {
    $userId = $request->user()->id;

    // 1. Projets de l’utilisateur
    $userProjects = Project::where('user_id', $userId)->get();

    // 2. Projets aléatoires (différents de ceux de l’utilisateur)
    $randomProjects = Project::where('user_id', '!=', $userId)
        ->inRandomOrder()
        ->take(5) // par exemple 5 projets aléatoires
        ->get();

    // Combiner
    return $userProjects->merge($randomProjects);
});