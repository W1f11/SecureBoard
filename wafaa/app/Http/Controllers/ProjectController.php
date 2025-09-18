<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Lister les projets
    public function index()
    {
        // Autorise la vue (tout utilisateur connecté peut voir)
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
        ]);

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => Auth::id(),
        ]);

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
