<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Dashboard', [
            'count_active' => 0,
            'count_update' => 0
        ]);
    }
}
