<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_session_id',
        'name',
        'score',
        'color',
    ];

    public function quizSession()
    {
        return $this->belongsTo(QuizSession::class);
    }
}
