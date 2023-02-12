<?php

namespace App\Http\Controllers;

use App\Events\GameEvent;
use App\Models\Quiz;
use App\Models\QuizSession;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index() 
    {
        $session = null;
        $quiz = null;
        $guest = null;

        if(session()->has('session')) {
            $id = session('session')->id;
            $session = QuizSession::find($id);
            session(['session' => $session]);
            $quiz = $session->quiz->load(['questions.answers']);
        }

        if(session()->has('guest')) {
            $guest = session('guest');
        }

        return inertia('Player/Index', [
            'session' => $session,
            'quiz' => $quiz,
            'guest' => $guest,
        ]);
    }


    public function code(Request $request) 
    {
        if(session('session') != null) {
            return;
        }

        $request->validate([
            'code' => 'required|string',
        ]);

        $session = QuizSession::active()->where('code', $request->code)->first();

        if($session == null) {
            return redirect('/')
                ->with('message', ['type' => 'error', 'message' => 'Quiz not started yet']);
        }

        session(['session' => $session]);
    }

    public function answer(Request $request)
    {
        $request->validate([
            'answer' => 'required'
        ]);

        $id = session('session')->id;
        $session = QuizSession::find($id);
        session(['session' => $session]);

        $participant = session('guest');
        $participant->answers()->firstOrCreate([
            'question_id' => $session->question_present
        ],
        [
            'answer_id' => $request->answer
        ]);
    }

    public function join(Request $request)
    {
        if(session('guest') != null) {
            return;
        }

        $request->validate([
            'name' => 'required|string',
            'color' => 'required|string'
        ]);

        $session = session('session');
        $participant = $session->participants()->create([
            'name' => $request->name,
            'color' => $request->color
        ]);

        session(['guest' => $participant]);

        GameEvent::dispatch($session->code, GameEvent::PLAYER_JOIN, $session->participants()->get());
    }

    public function end()
    {
        session()->remove('guest');
        session()->remove('session');
        return redirect('/');
    }
}
