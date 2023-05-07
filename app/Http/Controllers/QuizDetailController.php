<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizSession;

class QuizDetailController extends Controller
{
    public function index(Quiz $quiz)
    {
        $query = $quiz->sessions()
            ->withCount('participants')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return inertia('QuizDetail/Index', [
            'quiz' => $quiz,
            'sessions' => $query,
        ]);
    }

    public function participants(Quiz $quiz, QuizSession $session)
    {
        $query = $session->participants()
            ->orderBy('score', 'desc')
            ->paginate(100);

        return inertia('QuizDetail/Detail', [
            'quiz' => $quiz,
            'session' => $session,
            'participants' => $query,
        ]);
    }
}
