<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Quiz::with(['creator']);

        if ($request->q != null) {
            $query->where('name', 'like', '%'.$request->q.'%');
        }

        return inertia('Quiz/Index', [
            'quizzes' => $query->orderBy('created_at', 'desc')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return inertia('Quiz/Form');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.time' => 'required|numeric',
            'questions.*.answers' => 'required|array',
            'questions.*.answers.*.text' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|in:0,1',
            'answer_key_url' => 'nullable|url',
        ]);

        $quiz = Quiz::create([
            'name' => $request->name,
            'user_id' => $request->user()->id,
            'answer_key_url' => $request->answer_key_url,
        ]);

        foreach ($request->questions as $rquestion) {
            $question = $quiz->questions()->create([
                'text' => $rquestion['text'],
                'time' => $rquestion['time'],
            ]);

            foreach ($rquestion['answers'] as $key => $ranswer) {
                $question->answers()->create([
                    'is_correct' => $ranswer['is_correct'],
                    'text' => $ranswer['text'],
                    'color' => Answer::generateColor($key),
                ]);
            }
        }

        return redirect()->route('quizzes.index')
            ->with('message', ['type' => 'success', 'message' => 'The data has beed saved']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Quiz $quiz)
    {
        return inertia('Quiz/Form', [
            'quiz' => $quiz->load(['questions.answers']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Quiz $quiz)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.time' => 'required|numeric',
            'questions.*.answers' => 'required|array',
            'questions.*.answers.*.text' => 'required|string',
            'questions.*.answers.*.is_correct' => 'required|in:0,1',
            'answer_key_url' => 'nullable|url',
        ]);

        $quiz->questions()->delete();
        $quiz->update([
            'name' => $request->name,
            'user_id' => $request->user()->id,
            'answer_key_url' => $request->answer_key_url,
        ]);

        foreach ($request->questions as $rquestion) {
            $question = $quiz->questions()->create([
                'text' => $rquestion['text'],
                'time' => $rquestion['time'],
            ]);

            foreach ($rquestion['answers'] as $key => $ranswer) {
                $question->answers()->create([
                    'is_correct' => $ranswer['is_correct'],
                    'text' => $ranswer['text'],
                    'color' => Answer::generateColor($key),
                ]);
            }
        }

        return redirect()->route('quizzes.index')
            ->with('message', ['type' => 'success', 'message' => 'The data has beed updated']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
    }
}
