<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.  GET api/clients
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $clients = Client::forUser(auth()->id())
                ->withCount('invoices')
                ->orderBy('name')
                ->get();

            return response()->json([
                'message' => 'Clients retrieved successfully',
                'clients' => $clients,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve clients',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage. POST api/clients
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'    => ['required', 'string', 'max:255'],
                'email'   => ['required', 'email', 'max:255'],
                'phone'   => ['nullable', 'string', 'max:20'],
                'address' => ['nullable', 'string'],
            ]);

            $exists = Client::forUser(auth()->id())
                ->where('email', $validated['email'])
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'A client with this email already exists',
                ], 422);
            }

            $client = Client::create([
                ...$validated,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'message' => 'Client created successfully',
                'client'  => $client,
            ], 201);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to create client',
            ], 500);
        }
    }

    /**
     * Display the specified resource. GET api/clients/{client}
     */
    public function show(Client $client): JsonResponse
    {
        try {
            $this->authorizeClient($client);

            $client->load(['invoices' => fn($q) => $q->latest()->take(10)]);

            if (!$client) {
                Log("client not found");
                return response()->json([
                    "message" => "data not found"
                ]);
            }
            return response()->json([
                'message' => 'Client retrieved successfully',
                'client'  => $client,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve client',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage. PUT api/clients/{client}
     */
    public function update(Request $request, Client $client): JsonResponse
    {
        try {
            $this->authorizeClient($client);

            $validated = $request->validate([
                'name'    => ['sometimes', 'string', 'max:255'],
                'email'   => ['sometimes', 'email', 'max:255'],
                'phone'   => ['sometimes', 'nullable', 'string', 'max:20'],
                'address' => ['sometimes', 'nullable', 'string'],
            ]);

            if (isset($validated['email']) && $validated['email'] !== $client->email) {
                $exists = Client::forUser(auth()->id())
                    ->where('email', $validated['email'])
                    ->where('id', '!=', $client->id)
                    ->exists();

                if ($exists) {
                    return response()->json([
                        'message' => 'A client with this email already exists',
                    ], 422);
                }
            }

            $client->update($validated);

            return response()->json([
                'message' => 'Client updated successfully',
                'client'  => $client,
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to update client',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage. DELETE api/clients/{client}
     */
    public function destroy(Client $client): JsonResponse
    {
        try {
            $this->authorizeClient($client);

            if ($client->invoices()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete a client with existing invoices',
                ], 422);
            }

            $client->delete();

            return response()->json([
                'message' => 'Client deleted successfully',
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Failed to delete client',
            ], 500);
        }
    }

    // ─── Private Helpers ──────────────────────────────────────────

    private function authorizeClient(Client $client): void
    {
        if ($client->user_id !== auth()->id()) {
            abort(403, 'Unauthorized');
        }
    }
}
