<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Jobs\SendEmailJob;

class ProjectController extends Controller
{
    // Lister les projets
    public function index()
    {
        $this->authorize('viewAny', Project::class);

        // 🔹 Admin : tous les projets
        if (Auth::user()->hasRole('admin')) {
            $projects = Project::with('user')->get();
        } else {
            // 🔹 Manager / User : uniquement leurs projets
            $projects = Auth::user()->projects()->with('user')->get();
        }

        return response()->json($projects);
    }

    // Créer un projet
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_ids' => 'required|array', // 🔹 les utilisateurs assignés
        ]);

        // Créer le projet
        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);


        // Récupérer les utilisateurs assignés et les attacher
        $users = collect();
        if ($request->has('user_ids')) {
            $project->users()->attach($request->user_ids);
            $users = User::whereIn('id', $request->user_ids)->get();
        }

        // 🔹 Envoi d'un email via la queue à chaque user
        foreach ($users as $user) {
            $details = [
                'email' => $user->email,
                'name'  => $user->name,
                'project' => $project->title,
            ];

            SendEmailJob::dispatch($details);
        }

    // Dispatch event ProjectCreated pour notifications/broadcast
    event(new \App\Events\ProjectCreated($project));

    // Recharge le projet (attributs + relations) pour avoir toutes les données à jour
    $project = $project->refresh()->load('users');
    return response()->json($project, 201);
    }

    // Afficher un projet
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        return response()->json($project->load('user'));
    }

    // Mettre à jour un projet
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($request->only(['title', 'description']));

        return response()->json($project);
    }

    // Supprimer un projet
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message' => 'Projet supprimé']);
    }
}
