<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use ShiftOneLabs\LaravelCascadeDeletes\CascadesDeletes;

class Role extends Model
{
    use HasFactory, CascadesDeletes;

    protected $fillable = [
        'name',
    ];

    protected $cascadeDeletes = ['users'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function permissions()
    {
        return $this->hasManyThrough(
            Permission::class,
            RolePermission::class,
            'role_id',
            'id',
            'id',
            'permission_id',
        );
    }

    public function rolePermissions()
    {
        return $this->hasMany(RolePermission::class);
    }
}
