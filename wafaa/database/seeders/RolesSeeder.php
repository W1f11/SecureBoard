<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesSeeder extends Seeder
{
    public function run()
    {
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Administrator']
        );

        $manager = Role::firstOrCreate(
            ['name' => 'manager'],
            ['display_name' => 'Manager']
        );

        $user = Role::firstOrCreate(
            ['name' => 'user'],
            ['display_name' => 'User']
        );

        // Récupération des permissions existantes
        $permissions = Permission::whereIn('name', [
            'manage-users',
            'manage-projects',
            'read-profile',
            'update-profile',
            'update-own-project',
            'delete-own-project',
        ])->pluck('id', 'name');

        // Helper pour éviter d’envoyer des nulls
        $filter = fn ($array) => array_filter($array);

        // Attribution des permissions
        $admin->syncPermissions($filter([
            $permissions['manage-users'] ?? null,
            $permissions['read-profile'] ?? null,
            $permissions['update-profile'] ?? null,
        ]));

        $manager->syncPermissions($filter([
            $permissions['manage-projects'] ?? null,
            $permissions['read-profile'] ?? null,
            $permissions['update-profile'] ?? null,
        ]));

        $user->syncPermissions($filter([
            $permissions['read-profile'] ?? null,
            $permissions['update-profile'] ?? null,
            $permissions['update-own-project'] ?? null,
            $permissions['delete-own-project'] ?? null,
        ]));
    }
}
