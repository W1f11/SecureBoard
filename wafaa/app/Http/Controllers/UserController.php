<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Afficher tous les utilisateurs
    public function index()
    {
        return User::with('roles')->get();
    }

    // Créer un nouvel utilisateur (admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        // Attribution du rôle (Laratrust)
        $user->addRole($request->role); // ou $user->assignRole($request->role) pour Spatie
        return response()->json($user->load('roles'), 201);
    }

    // Mettre à jour un utilisateur
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'sometimes|string',
        ]);
        $user->update($request->only(['name', 'email']));
        if ($request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }
        if ($request->role) {
            $user->roles()->sync([]); // retire tous les rôles
            $user->addRole($request->role); // ou assignRole pour Spatie
        }
        return response()->json($user->load('roles'));
    }

    // Supprimer un utilisateur
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }
}
