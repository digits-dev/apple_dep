<?php

namespace App\Http\Middleware;
use App\Helpers\CommonHelpers;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'sessions' => $request->session()->all(),
                'access' => [
                    'isView' => CommonHelpers::isView(),
                    'isCreate' => CommonHelpers::isCreate(),
                    'isRead' => CommonHelpers::isRead(),
                    'isUpdate' => CommonHelpers::isUpdate(),
                    'isDelete' => CommonHelpers::isDelete(),
                    'isVoid' => CommonHelpers::isVoid(),
                    'isOverride' => CommonHelpers::isOverride()
                ]
            ],
            'errors' => function () use ($request) {
                return $request->session()->get('errors')
                    ? $request->session()->get('errors')->getBag('default')->getMessages()
                    : (object) [];
            },
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
          
        ]);
    }
}
