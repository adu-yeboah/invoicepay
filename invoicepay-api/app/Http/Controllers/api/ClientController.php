<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $clients = Client::forUser(auth()->id())
            ->whithCountOrder("invoices")
            ->orderBy('name')
            ->get();

        return response()->json([
            "message" => "clients retrieved successfully",
            "clients" => $clients
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
        ]);

        $exists = Client::ForUser(auth()->id())
            ->where('email', $validated['email'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A client with this email already exists'
            ], 422);
        }

        $client = Client::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            "message" => "client created",
            "client" => $client
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $this->authorizeClient($client);

        $client->load(['invoices' => function($q) {
            $q->latest()->take(10);
        }]);

        return response()->json($client);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $this->authorizeClient($client);

        $validated = $request->validate([
            'name'    => ['sometimes', 'string', 'max:255'],
            'email'   => ['sometimes', 'email', 'max:255'],
            'phone'   => ['sometimes', 'nullable', 'string', 'max:20'],
            'address' => ['sometimes', 'nullable', 'string'],
        ]);

        if(isset($validated['email']) && $validated['email'] !== $client->email) {
            $exists = Client::forUser(auth()->id())
                ->where('email', $validated['email'])
                ->where('id', '!=', $client->id)
                ->exists();
            if($exists) {
                return response()->json([
                    "message" => "A client with this email already exists"
                ], 422);
            }
        }

        $client->update($validated);

        return response()->json($client);
      
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $this->authorizeClient($client);

        if($client->Invoices()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a Client with existing Invoices.'
            ], 422);
        }
    }

    // ─── Private Helpers ──────────────────────────────────────────
    private function authorizeClient(Client $client): void
    {
        if ($client->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
