<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    // Colonnes que l'on peut remplir en mass assignment
    protected $fillable = ['title', 'description', 'user_id'];

    /**
     * Le créateur du projet (un seul utilisateur)
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Les utilisateurs assignés au projet (many-to-many)
     */
    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
