<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizParticipant;
use App\Models\QuizSession;
use App\Models\User;
use Illuminate\Http\Request;

class GeneralController extends Controller
{
    public function index(Request $request)
    {
        return inertia('Dashboard', [
            'count_user' => User::count(),
            'count_quiz' => Quiz::count(),
            'count_session' => QuizSession::count(),
            'count_participant' => QuizParticipant::count(),

        ]);
    }
}
