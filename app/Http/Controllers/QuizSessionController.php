<?php

namespace App\Http\Controllers;

use App\Events\GameEvent;
use App\Models\Quiz;
use App\Models\QuizParticipantAnswer;
use Illuminate\Http\Request;

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

        $participantIds = $session->participants()->pluck('id')->toArray();
        $answer = QuizParticipantAnswer::whereIn('quiz_participant_id', $participantIds)
            ->where('question_id', $session->question_present)->count();

        $questions = $session->quiz->questions;
        $participants = $session->participants()->orderBy('score', 'desc')->get();
        $currentResult = collect();

        $topP = 4;
        if ($participants->count() <= 5) {
            $topP = 40;
        }
        foreach ($participants as $i => $p) {
            $top = (($i + 1) * $topP);
            $right = (1 - (($p->score) / ($questions->count() * 1600))) * 89;
            if ($right < 10) {
                $right = 10;
            }

            if ($right > 90) {
                $right = 89;
            }

            if (in_array($i, [0, 1, 2]) && $questions->last()->id == $session->question_present) {
                $right = [0, 5, 7][$i];
                $top = [50, 55, 45][$i];

                if ($i == 0) {
                    GameEvent::dispatch($session->code, GameEvent::WINNER, $p->id);
                }
            }

            $currentResult->add([
                'id' => $p->id,
                'name' => $p->name,
                'score' => $p->score,
                'color' => $p->color,
                'right' => $right.'%',
                'top' => $top.'%',
            ]);
        }

        return inertia('Session/Index', [
            'session' => $session->load(['participants']),
            'quiz' => $quiz->load(['questions.answers']),
            '_answer' => $answer,
            '_result' => $currentResult,
        ]);
    }

    public function result(Quiz $quiz)
    {
        $session = $quiz->sessions()->active()->first();
        GameEvent::dispatch($session->code, GameEvent::WAITING, []);
    }

    public function next(Request $request, Quiz $quiz)
    {
        $request->validate([
            'question_id' => 'required|exists:questions,id',
        ]);

        $session = $quiz->sessions()->active()->first();
        $session->update([
            'question_present' => $request->question_id,
        ]);

        GameEvent::dispatch($session->code, GameEvent::NEXT, [
            'question_id' => $request->question_id,
        ]);
    }

    public function end(Quiz $quiz)
    {
        $session = $quiz->sessions()->active()->first();
        GameEvent::dispatch($session->code, GameEvent::GAME_OVER, []);

        $quiz->sessions()->active()->update([
            'is_live' => 0,
            'end_time' => now(),
        ]);

        return redirect()->route('quizzes.index')
            ->with('message', ['type' => 'success', 'message' => 'Quiz has been ended']);
    }
}
