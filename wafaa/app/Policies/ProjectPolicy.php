<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Déterminer si l'utilisateur peut voir la liste des projets.
     */
    public function viewAny(User $user): bool

    {
        return true; // tout utilisateur connecté peut voir les projets
    }

    /**
     * Déterminer si l'utilisateur peut voir un projet spécifique.
     */
    public function view(User $user, Project $project): bool

    {
        return true; // tout utilisateur connecté peut voir un projet
    }

    /**
     * Déterminer si l'utilisateur peut créer un projet.
     */
    public function create(User $user): bool

    {
        return true;
    }

    /**
     * Déterminer si l'utilisateur peut mettre à jour un projet.
     */
    public function update(User $user, Project $project): bool

    {
        return $user->id === $project->user_id || $user->hasRole('admin');
    }

    /**
     * Déterminer si l'utilisateur peut supprimer un projet.
     */
    public function delete(User $user, Project $project): bool
    
    {
        return $user->id === $project->user_id || $user->hasRole('admin');
    }
}
