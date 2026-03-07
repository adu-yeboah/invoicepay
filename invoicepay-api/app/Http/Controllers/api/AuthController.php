<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    /**
     * Register a user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'business_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create($validated);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Validate and login a user 
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($request->only("email", 'password'))) {
            return response()->json([
                'error' => 'Invalid credentials.'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            "message" => "Login successfully"
        ], 201);
    }

    /**
     * Logs out user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "message" => "Logged out successfully"
        ]);
    }

    /**
     * Returns user data.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }


    /**
     * Update the user resource in storage.
     */
    public function updateProfile(Request $request, User $user)
    {
         $validated = $request->validate([
            'name'                => ['sometimes', 'string', 'max:255'],
            'business_name'       => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone'               => ['sometimes', 'nullable', 'string', 'max:20'],
            'address'             => ['sometimes', 'nullable', 'string'],
            'paystack_secret_key' => ['sometimes', 'nullable', 'string'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => "profile updated",
            'user' => $request->user()->refresh()
        ]);
    }

    /**
     * Add user business logo to storage.
     */
    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048']
        ]);

        $path = $request->file('logo')->store('logos', 'public');
        $request->user()->update(['business_logo' => $path]);

        return response()->json([
            'message' => 'Logo uploaded',
            'path' => asset('storage/' . $path)
        ]);
    }
}
