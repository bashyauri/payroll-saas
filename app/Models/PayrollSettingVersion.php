<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class PayrollSettingVersion extends Model
{
    use HasUlids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'profile',
        'effective_from',
        'snapshot',
        'updated_by_user_id',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'snapshot' => 'array',
    ];
}
