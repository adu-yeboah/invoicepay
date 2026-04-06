<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a user.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'          => ['required', 'string', 'max:255'],
                'email'         => ['required', 'email', 'unique:users'],
                'password'      => ['required', Password::min(8)],
                'business_name' => ['nullable', 'string', 'max:255'],
                'phone'         => ['nullable', 'string', 'max:255'],
            ]);

            $user  = User::create($validated);
            $token = $user->createToken('auth_token')->plainTextToken;
            Mail::to($user->email)->queue(new WelcomeMail($user));

            return response()->json([
                'message' => 'Account created successfully',
                'user'    => $user,
                'token'   => $token,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Register Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Something went wrong during registration',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Validate and login a user.
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email'    => ['required', 'email'],
                'password' => ['required'],
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'message' => 'Invalid credentials.',
                ], 401);
            }

            $user  = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Welcome back, ' . $user->name,
                'user'    => $user,
                'token'   => $token,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'Something went wrong during login',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Logs out user.
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'message' => 'You have been logged out successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Logout Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Something went wrong during logout',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Returns user data.
     */
    public function me(Request $request)
    {
        try {
            return response()->json([
                'message' => 'User retrieved successfully',
                'user'    => $request->user(),
            ]);
        } catch (\Exception $e) {
            Log::error('Me Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve user data',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update the user resource in storage.
     */
    public function updateProfile(Request $request, User $user)
    {
        try {
            $validated = $request->validate([
                'name'                => ['sometimes', 'string', 'max:255'],
                'business_name'       => ['sometimes', 'nullable', 'string', 'max:255'],
                'phone'               => ['sometimes', 'nullable', 'string', 'max:20'],
                'address'             => ['sometimes', 'nullable', 'string'],
                'paystack_secret_key' => ['sometimes', 'nullable', 'string'],
            ]);

            $request->user()->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'user'    => $request->user()->refresh(),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Update Profile Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update profile',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Add user business logo to storage.
     */
    public function uploadLogo(Request $request)
    {
        try {
            $request->validate([
                'logo' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            ]);

            $path = $request->file('logo')->store('logos', 'public');
            $request->user()->update(['business_logo' => $path]);

            return response()->json([
                'message' => 'Logo uploaded successfully',
                'path'    => asset('storage/' . $path),
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Upload Logo Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to upload logo',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
