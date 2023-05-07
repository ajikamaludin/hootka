<?php

use App\Http\Controllers\GeneralController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizDetailController;
use App\Http\Controllers\QuizSessionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
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
Route::get('/', [PlayerController::class, 'index'])->name('player.index');
Route::post('/answer', [PlayerController::class, 'answer'])->name('player.answer');
Route::post('/code', [PlayerController::class, 'code'])->name('player.code');
Route::post('/', [PlayerController::class, 'join'])->name('player.join');
Route::post('/end', [PlayerController::class, 'end'])->name('player.end');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [GeneralController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    Route::get('/quizzes/{quiz}/start', [QuizSessionController::class, 'index'])->name('quizzes.start');
    Route::post('/quizzes/{quiz}/next', [QuizSessionController::class, 'next'])->name('quizzes.next');
    Route::post('/quizzes/{quiz}/end', [QuizSessionController::class, 'end'])->name('quizzes.end');
    Route::post('/quizzes/{quiz}/result', [QuizSessionController::class, 'result'])->name('quizzes.result');

    Route::get('/quizzes', [QuizController::class, 'index'])->name('quizzes.index');
    Route::get('/quizzes/create', [QuizController::class, 'create'])->name('quizzes.create');
    Route::post('/quizzes', [QuizController::class, 'store'])->name('quizzes.store');
    Route::get('/quizzes/{quiz}', [QuizController::class, 'edit'])->name('quizzes.edit');
    Route::put('/quizzes/{quiz}', [QuizController::class, 'update'])->name('quizzes.update');
    Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy'])->name('quizzes.destroy');

    Route::get('/quizzes/{quiz}/{session}/participants', [QuizDetailController::class, 'participants'])->name('quizzes.participants');
    Route::get('/quizzes/{quiz}/detail', [QuizDetailController::class, 'index'])->name('quizzes.detail');

});

require __DIR__.'/auth.php';
