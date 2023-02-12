<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizParticipant extends Model
{
    use HasFactory, SoftDeletes;

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

    public function answers()
    {
        return $this->hasMany(QuizParticipantAnswer::class);
    }
}
