<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_super_admin',
        'role_id', // Global/System Role
        'profile_photo_path',
        'doc_type',
        'doc_number',
        'phone',
        'address',
        'country',
        'state',
        'city',
    ];

    /**
     * Get the global role for the user (System/SuperAdmin context).
     */
    public function globalRole()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Check if user has global permission.
     */
    public function hasGlobalPermission($permissionName)
    {
        if ($this->is_super_admin) {
            return true; // Optional: SuperAdmin bypass
            // If you want granular control even for super admins, remove this.
        }

        // Check assigned global role
        if ($this->globalRole && $this->globalRole->permissions->contains('name', $permissionName)) {
            return true;
        }

        return false;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function tenants(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_user')
            ->withPivot(['role', 'role_id', 'profile_photo_path', 'location_id'])
            ->withTimestamps();
    }

    public function hasRole($tenantId, $role): bool
    {
        $tenant = $this->tenants->find($tenantId);
        return $tenant && $tenant->pivot->role === $role;
    }

    public function getProfilePhotoUrlAttribute()
    {
        $path = $this->profile_photo_path;

        // Check if we are in a tenant context
        if (app()->bound('currentTenant') && $tenant = app('currentTenant')) {
            // Try to find the pivot record
            // We can't access ->pivot directly on $this because the relation might not be loaded or might be loaded for all tenants
            // A safer way is to query the relation or check loaded relations
            $pivot = $this->tenants->find($tenant->id)?->pivot;
            if ($pivot && !empty($pivot->profile_photo_path)) {
                $path = $pivot->profile_photo_path;
            }
        }

        if ($path) {
            if (filter_var($path, FILTER_VALIDATE_URL)) {
                return $path;
            }
            return \Illuminate\Support\Facades\Storage::disk('s3')->url($path);
        }

        return null;
    }
}