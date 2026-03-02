<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Sale;
use App\Models\Product;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        // 1. KPIs
        $todaySales = Sale::whereDate('created_at', $today)->sum('total_amount');
        $todayOrders = Sale::whereDate('created_at', $today)->count();
        $monthlySales = Sale::where('created_at', '>=', $startOfMonth)->sum('total_amount');
        
        // Average Order Value
        $avgOrderValue = $todayOrders > 0 ? $todaySales / $todayOrders : 0;

        // 2. Sales Chart Data (Last 7 Days)
        $salesChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $salesChart[] = [
                'date' => $date->format('D'),
                'total' => (float) Sale::whereDate('created_at', $date)->sum('total_amount'),
            ];
        }

        // 3. Best Selling Products
        $bestSellers = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select('products.name', DB::raw('SUM(sale_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // 4. Category Distribution
        $categoryData = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(sale_items.subtotal) as value'))
            ->groupBy('categories.id', 'categories.name')
            ->get();

        return inertia('dashboard', [
            'stats' => [
                'today_sales' => (float) $todaySales,
                'today_orders' => $todayOrders,
                'monthly_sales' => (float) $monthlySales,
                'avg_order_value' => (float) $avgOrderValue,
            ],
            'charts' => [
                'sales_trend' => $salesChart,
                'category_dist' => $categoryData,
            ],
            'best_sellers' => $bestSellers,
        ]);
    }
}
