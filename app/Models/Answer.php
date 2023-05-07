<?php

namespace App\Models;

use Faker\Factory as Faker;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'question_id',
        'is_correct',
        'text',
        'shape',
        'color',
    ];

    public function participantAnswers()
    {
        return $this->hasMany(QuizParticipantAnswer::class);
    }

    public static function generateColor($key)
    {
        return match ($key) {
            0 => '#e21b3c',
            1 => '#1368ce',
            2 => '#d89e02',
            3 => '#27890d',
            default => Faker::create()->safeHexColor(),
        };
    }
}
