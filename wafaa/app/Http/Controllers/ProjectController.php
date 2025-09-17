<?php
namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    // Lister tous les projets de l'utilisateur
    public function index()
    {
        $projects = Auth::user()->projects()->with('user')->get();
        return response()->json($projects);
    }

    // Créer un projet
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = \Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'user_id' => $user->id,
        ]);

        return response()->json($project, 201);
    }

    // Afficher un projet
    public function show(Project $project)
    {
        return response()->json($project);
    }

    // Mettre à jour un projet
    public function update(Request $request, Project $project)
    {
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
        $project->delete();
        return response()->json(null, 204);
    }
}
