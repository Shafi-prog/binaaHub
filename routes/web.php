<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController; // التأكد من استيراد المتحكم الخاص بتسجيل الدخول
use App\Http\Controllers\HomeController; // التأكد من استيراد المتحكم الخاص بالصفحة الرئيسية (إذا كان موجوداً)

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

Route::get('/', function () {
    return redirect('/login');
});

// ... existing routes ...

// تصحيح أو إضافة مسارات تسجيل الدخول
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

// إضافة مسار للصفحة الرئيسية بعد تسجيل الدخول (محمي بواسطة middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    // يمكنك إضافة مسارات أخرى هنا تتطلب تسجيل الدخول
});

// ... other existing routes ...
