<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionsSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            ['name' => 'manage-users', 'display_name' => 'Manage Users'],
            ['name' => 'manage-projects', 'display_name' => 'Manage Projects'],
            ['name' => 'read-profile', 'display_name' => 'Read Profile'],
            ['name' => 'update-profile', 'display_name' => 'Update Profile'],
            ['name' => 'update-own-project', 'display_name' => 'Update Own Project'],
            ['name' => 'delete-own-project', 'display_name' => 'Delete Own Project'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(
                ['name' => $perm['name']],
                ['display_name' => $perm['display_name']]
            );
        }
    }
}
