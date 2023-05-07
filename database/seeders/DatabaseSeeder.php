<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            ['name' => 'view-role', 'label' => 'Lihat Role'],
            ['name' => 'update-role', 'label' => 'Edit Role'],
            ['name' => 'create-role', 'label' => 'Buat Role'],
            ['name' => 'delete-role', 'label' => 'Hapus Role'],
            ['name' => 'view-user', 'label' => 'Lihat User'],
            ['name' => 'update-user', 'label' => 'Edit User'],
            ['name' => 'create-user', 'label' => 'Buat User'],
            ['name' => 'delete-user', 'label' => 'Hapus User'],
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission['name'],
                'label' => $permission['label'],
            ]);
        }

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'root@admin.com',
            'password' => bcrypt('password'),
        ]);

        // role
        $role = Role::create(['name' => 'admin']);

        $permissions = Permission::all()->map(function ($item) use ($role) {
            return [
                'role_id' => $role->id,
                'permission_id' => $item->id,
            ];
        })->toArray();
        RolePermission::insert($permissions);

        User::create([
            'name' => 'User Administrator',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id,
        ]);
    }
}
