<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('projects'); // canal public simple
    }

    public function broadcastAs(): string
    {
        return 'project.created'; // nom de l’événement
    }
}
