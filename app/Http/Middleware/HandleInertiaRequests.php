<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array
     */
    public function share(Request $request)
    {
        if (auth()->check()) {
            $user = User::find(auth()->user()->id)->load('role.permissions');
        } else {
            $user = null;
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
            ],
            'app' => [
                'name' => env('APP_NAME', 'Sample'),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
            ],
            'notify' => [
                'notifications' => [],
                'notification_has_unread' => 0,
            ],
        ]);
    }
}
