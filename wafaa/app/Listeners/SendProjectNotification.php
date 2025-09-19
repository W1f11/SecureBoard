<?php

namespace App\Listeners;


use App\Events\ProjectCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ProjectCreatedNotification;

class SendProjectNotification implements ShouldQueue
{
    /**
     * Handle the event.
     */
    public function handle(ProjectCreated $event): void
    {
        // Notifier tous les users, managers et admins par email
        $users = \App\Models\User::whereHas('roles', function($q) {
            $q->whereIn('name', ['admin', 'manager', 'user']);
        })->get();
        Notification::send($users, new ProjectCreatedNotification($event->project));
    }
}
