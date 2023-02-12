<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizParticipantAnswer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'quiz_participant_id',
        'question_id',
        'answer_id',
        'score',
        'is_correct',
    ];
}
