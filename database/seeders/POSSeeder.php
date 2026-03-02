<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class POSSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure a default tenant exists
        $tenant = \App\Models\Tenant::firstOrCreate(
            ['domain' => 'main.localhost'],
            [
                'name' => 'Main Branch',
                'database' => 'pos_modern',
            ]
        );

        // Set the current tenant for the seeder
        $tenant->makeCurrent();

        // Assign first user to this tenant if needed
        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'tenant_id' => $tenant->id,
            ]
        );

        $cashier = \App\Models\User::updateOrCreate(
            ['email' => 'cashier@gmail.com'],
            [
                'name' => 'Cashier Branch 1',
                'password' => bcrypt('password'),
                'tenant_id' => $tenant->id,
            ]
        );

        // Create Suppliers
        \App\Models\Supplier::updateOrCreate(
            ['code' => 'SUP-001'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'PT Indofood CBP Success Makmur',
                'pic_name' => 'Budi Santoso',
                'phone' => '021-12345678',
                'email' => 'contact@indofood.com',
                'address' => 'Jl. Jend. Sudirman Kav. 76-78, Jakarta',
            ]
        );

        \App\Models\Supplier::updateOrCreate(
            ['code' => 'SUP-002'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Coca Cola Amatil Indonesia',
                'pic_name' => 'Siti Aminah',
                'phone' => '021-87654321',
                'email' => 'sales@cocacola.co.id',
                'address' => 'Jl. Pulo Kambing Raya No. 1, Jakarta',
            ]
        );

        // Create Customers
        \App\Models\Customer::updateOrCreate(
            ['phone' => '08123456789'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'points' => 500,
                'membership_level' => 'GOLD',
            ]
        );

        \App\Models\Customer::updateOrCreate(
            ['phone' => '08987654321'],
            [
                'tenant_id' => $tenant->id,
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'points' => 150,
                'membership_level' => 'SILVER',
            ]
        );

        // Create Categories
        $burgerCat = \App\Models\Category::firstOrCreate(['slug' => 'burgers'], ['name' => 'Burgers', 'is_active' => true]);
        $drinkCat = \App\Models\Category::firstOrCreate(['slug' => 'drinks'], ['name' => 'Drinks', 'is_active' => true]);
        $snackCat = \App\Models\Category::firstOrCreate(['slug' => 'snacks'], ['name' => 'Snacks', 'is_active' => true]);

        // Create Products
        \App\Models\Product::updateOrCreate(
            ['sku' => 'BEEF-001'],
            [
                'name' => 'Supreme Beef Burger',
                'category_id' => $burgerCat->id,
                'base_price' => 55000,
                'is_active' => true,
                'track_inventory' => true,
                'images' => ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80']
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['sku' => 'CHICK-001'],
            [
                'name' => 'Crispy Chicken Burger',
                'category_id' => $burgerCat->id,
                'base_price' => 45000,
                'is_active' => true,
                'track_inventory' => true,
                'images' => ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80']
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['sku' => 'TEA-001'],
            [
                'name' => 'Iced Lychee Tea',
                'category_id' => $drinkCat->id,
                'base_price' => 22000,
                'is_active' => true,
                'track_inventory' => true,
                'images' => ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80']
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['sku' => 'FRIES-001'],
            [
                'name' => 'Loaded Cheesy Fries',
                'category_id' => $snackCat->id,
                'base_price' => 28000,
                'is_active' => true,
                'track_inventory' => true,
                'images' => ['https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80']
            ]
        );
    }
}
