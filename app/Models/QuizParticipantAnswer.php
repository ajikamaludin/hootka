<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizParticipantAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_participant_id',
        'question_id',
        'answer_id',
        'score',
        'is_correct',
    ];
}
