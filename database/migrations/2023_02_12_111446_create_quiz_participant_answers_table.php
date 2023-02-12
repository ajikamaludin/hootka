<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quiz_participant_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_participant_id')->constrained();
            $table->foreignId('question_id')->constrained();
            $table->foreignId('answer_id')->constrained();
            $table->smallInteger('score')->default(0);
            $table->smallInteger('is_correct')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quiz_participant_answers');
    }
};
