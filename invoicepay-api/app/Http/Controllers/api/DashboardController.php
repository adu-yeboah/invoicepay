<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // GET /api/dashboard
    public function index()
    {
        $userId = auth()->id();

        $stats = Invoice::forUser($userId)
            ->selectRaw("
                COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0)     AS total_earned,
                COALESCE(SUM(CASE WHEN status = 'sent' THEN total ELSE 0 END), 0)     AS outstanding,
                COUNT(CASE WHEN status = 'overdue' THEN 1 END)                         AS overdue_count,
                COUNT(CASE WHEN status = 'paid' THEN 1 END)                            AS paid_count,
                COUNT(*)                                                                AS total_invoices
            ")
            ->first();

        $recentInvoices = Invoice::forUser($userId)
            ->with('client')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats'           => $stats,
            'recent_invoices' => $recentInvoices,
        ]);
    }
}
