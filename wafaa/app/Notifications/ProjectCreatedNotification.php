<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ProjectCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $project;

    public function __construct($project)
    {
        $this->project = $project;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nouveau projet créé')
            ->greeting('Bonjour !')
            ->line('Un nouveau projet a été créé : ' . $this->project->name)
            ->action('Voir le projet', url('/projects/' . $this->project->id))
            ->line('Merci d’utiliser SecureBoard !');
    }
}
