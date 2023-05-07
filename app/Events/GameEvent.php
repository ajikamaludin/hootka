<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameEvent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    const PLAYER_JOIN = 'player-join';

    const NEXT = 'next';

    const GAME_OVER = 'end';

    const PLAYER_ANSWER = 'player-answer';

    const WAITING = 'waiting';

    const WINNER = 'winner';

    protected $code;

    public $event;

    public $data;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($code, $event, $data)
    {
        $this->code = $code;
        $this->event = $event;
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('hootka-'.$this->code);
    }
}
