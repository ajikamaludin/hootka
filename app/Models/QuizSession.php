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

    public function participants()
    {
        return $this->hasMany(QuizParticipant::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function scopeActive($query)
    {
        return $query->where(['is_live' => 1]);
    }
}
