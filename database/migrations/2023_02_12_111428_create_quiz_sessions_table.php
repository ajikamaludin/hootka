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
        Schema::create('quiz_sessions', function (Blueprint $table) {
            $table->id();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->smallInteger('is_live')->default(0);
            $table->smallInteger('total_question')->default(0);
            $table->smallInteger('question_present')->default(0);
            $table->foreignId('quiz_id')->constrained();
            $table->string('code')->nullable();
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
        Schema::dropIfExists('quiz_sessions');
    }
};
