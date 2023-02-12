<?php

namespace App\Http\Controllers;

use App\Events\GameEvent;
use App\Models\Quiz;
use App\Models\QuizSession;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizSessionController extends Controller
{
    public function index(Quiz $quiz)
    {
        $session = $quiz->sessions()->active()->first();
        if ($session == null) {
            $session = $quiz->sessions()->create([
                'start_time' => now(),
                'is_live' => '1',
                'total_question' => $quiz->questions()->count(),
                'question_present' => 0,
                'code' => rand(1000, 9999),
            ]);
        }

        return inertia('Session/Index', [
            'session' => $session->load(['participants']),
            'quiz' => $quiz->load(['questions.answers'])
        ]);
    }

    public function next(Request $request, Quiz $quiz) 
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id'
        ]);

        $session = $quiz->sessions()->active()->first();
        $session->update([
            'question_present' => $request->question_id
        ]);

        GameEvent::dispatch($session->code, GameEvent::NEXT, [
            'question_id' => $request->question_id
        ]);
    }

    public function destroy(Quiz $quiz)
    {
        $session = $quiz->sessions()->active()->first();
        GameEvent::dispatch($session->code, GameEvent::GAME_OVER, []);

        $quiz->sessions()->active()->update([
            'is_live' => 0,
            'end_time' => now()
        ]);

        return redirect()->route('quizzes.index')
                ->with('message', ['type' => 'success', 'message' => 'Quiz has been ended']);
    }
}
