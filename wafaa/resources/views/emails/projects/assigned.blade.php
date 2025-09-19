@component('mail::message')
# Nouveau projet : {{ $details['project'] }}

Bonjour {{ $details['name'] }},

Un nouveau projet vous a été assigné : **{{ $details['project'] }}**.

Merci de consulter la plateforme pour plus de détails.

@endcomponent
