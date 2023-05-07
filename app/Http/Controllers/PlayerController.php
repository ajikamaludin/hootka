<?php

namespace App\Http\Controllers;

use App\Events\GameEvent;
use App\Models\Answer;
use App\Models\QuizParticipant;
use App\Models\QuizParticipantAnswer;
use App\Models\QuizSession;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        $session = null;
        $quiz = null;
        $guest = null;
        $score = 0;

        if (session()->has('session_id')) {
            $session = QuizSession::find(session('session_id'));
            if ($session == null) {
                return $this->end();
            }
            $quiz = $session->quiz->load(['questions.answers']);
        }

        if (session()->has('guest')) {
            $guest = session('guest');
            $guest = QuizParticipant::find($guest->id);
            if ($guest == null) {
                return $this->end();
            }
            $score = $guest->score;
        }

        return inertia('Player/Index', [
            'session' => $session,
            'quiz' => $quiz,
            'guest' => $guest,
            '_score' => $score,
        ]);
    }

    public function code(Request $request)
    {
        if (session('session_id') != null) {
            return;
        }

        $request->validate([
            'code' => 'required|string',
        ]);

        $session = QuizSession::active()->where('code', $request->code)->first();

        if ($session == null) {
            return redirect('/')
                ->with('message', ['type' => 'error', 'message' => 'Quiz not started yet']);
        }

        session([
            'session_id' => $session->id,
            'session_code' => $session->code,
        ]);
    }

    public function join(Request $request)
    {
        if (session('guest') != null) {
            return;
        }

        $request->validate([
            'name' => 'required|string',
            'color' => 'required|string',
        ]);

        $session = QuizSession::find(session('session_id'));
        $participant = $session->participants()->create([
            'name' => $request->name,
            'color' => $request->color,
            'score' => 0,
        ]);

        session(['guest' => $participant]);

        GameEvent::dispatch($session->code, GameEvent::PLAYER_JOIN, $session->participants()->get());
    }

    public function answer(Request $request)
    {
        $request->validate([
            'answer' => 'required',
        ]);

        $session = QuizSession::find(session('session_id'));
        $participant = session('guest');

        $participants = $session->participants()->pluck('id');
        $answered = $participant->answers()->where('question_id', $session->question_present)->first();
        if ($answered == null) {
            $score = 0;
            $answerKey = Answer::where([
                ['question_id', '=', $session->question_present],
                ['id', '=', $request->answer],
            ])->first();

            $answerCorrected = QuizParticipantAnswer::whereIn('quiz_participant_id', $participants->toArray())
                ->where('question_id', $session->question_present)
                ->where('is_correct', 1)->count();

            if ($answerKey->is_correct === 1) {
                $scoring = (1 - ($answerCorrected / $participants->count()));
                if ($scoring <= 0.5) {
                    $scoring += rand(0.3, 0.5);
                }
                $score = ($scoring * 1500) + rand(1, 99);
                $participant->update(['score' => $participant->score + $score]);
            } else {
                if ($participant->score >= -1000) { // min 5 q = 200 / 5
                    $participant->update(['score' => $participant->score - 200]);
                }
            }

            $participant->answers()->create([
                'question_id' => $session->question_present,
                'answer_id' => $request->answer,
                'score' => $score,
                'is_correct' => $answerKey->is_correct,
            ]);
        }

        $answer = QuizParticipantAnswer::whereIn('quiz_participant_id', $participants->toArray())
            ->where('question_id', $session->question_present)->count();

        GameEvent::dispatch($session->code, GameEvent::PLAYER_ANSWER, $answer);
    }

    public function end()
    {
        session()->remove('guest');
        session()->remove('session_id');
        session()->remove('session_code');

        return redirect('/');
    }
}
