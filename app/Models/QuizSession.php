<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuizSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'start_time',
        'end_time',
        'is_live',
        'total_question',
        'question_present',
        'quiz_id',
        'code',
    ];
}
