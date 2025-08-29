<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'role',
        'photo',
        'gender',
        'date_of_birth',
        'city',
        'specialty',
        'years_of_experience',
        'bio',
        'phone',
    ];

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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
        ];
    }
    
    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) {
            return null;
        }
        
        return $this->date_of_birth->diffInYears(now());
    }

    public function getAppointmentsCountAttribute(): int
    {
        if ($this->role === 'provider') {
            return $this->providedAppointments()->count();
        }
        
        return $this->appointments()->count();
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function providedAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'provider_id');
    }

    public function doctorApplication(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(DoctorApplication::class);
    }

    public function reviewedApplications(): HasMany
    {
        return $this->hasMany(DoctorApplication::class, 'reviewed_by');
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'admin']);
    }

    public function isDoctorPending(): bool
    {
        return $this->role === 'doctor_pending';
    }
}
