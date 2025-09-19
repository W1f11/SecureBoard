@component('mail::message')
# Bienvenue {{ $user->name }} !

Merci de vous être inscrit sur SecureBoard.

@component('mail::button', ['url' => config('app.url')])
Accéder à la plateforme
@endcomponent

Cordialement,
L'équipe SecureBoard
@endcomponent
