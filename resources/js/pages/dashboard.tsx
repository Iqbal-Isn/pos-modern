import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    ChevronRight,
    Truck,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export default function Dashboard({ stats, charts, best_sellers }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Today's Sales"
                        value={`Rp ${stats.today_sales.toLocaleString()}`}
                        icon={<DollarSign className="h-5 w-5" />}
                        trend="+12.5%"
                        isUp={true}
                        color="bg-purple-600"
                    />
                    <StatCard
                        title="Total Orders"
                        value={stats.today_orders}
                        icon={<ShoppingCart className="h-5 w-5" />}
                        trend="+5.2%"
                        isUp={true}
                        color="bg-blue-600"
                    />
                    <StatCard
                        title="Avg. Order Value"
                        value={`Rp ${stats.avg_order_value.toLocaleString()}`}
                        icon={<TrendingUp className="h-5 w-5" />}
                        trend="-2.1%"
                        isUp={false}
                        color="bg-emerald-600"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`Rp ${stats.monthly_sales.toLocaleString()}`}
                        icon={<Package className="h-5 w-5" />}
                        trend="+18.4%"
                        isUp={true}
                        color="bg-orange-600"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Sales Chart */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Sales Trend
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Weekly revenue performance
                                </p>
                            </div>
                            <select className="rounded-xl border-none bg-gray-50 px-4 py-2 text-sm font-bold outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.sales_trend}>
                                    <defs>
                                        <linearGradient
                                            id="colorTotal"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#7c3aed"
                                                stopOpacity={0.1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#7c3aed"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f3f4f6"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: '#9ca3af',
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <ReTooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow:
                                                '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        }}
                                        itemStyle={{
                                            fontWeight: 700,
                                            color: '#111827',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#7c3aed"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-1 text-lg font-bold text-gray-900">
                            Sales by Category
                        </h3>
                        <p className="mb-6 text-sm text-gray-500">
                            Top performing segments
                        </p>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.category_dist}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {charts.category_dist.map(
                                            (entry: any, index: number) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ),
                                        )}
                                    </Pie>
                                    <ReTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            {charts.category_dist.map(
                                (item: any, index: number) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ],
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-600">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">
                                            Rp {item.value.toLocaleString()}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Best Sellers & Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                Best Selling Products
                            </h3>
                            <button className="flex items-center gap-1 text-sm font-bold text-purple-600 hover:text-purple-700">
                                View All <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {best_sellers.map((product: any, i: number) => (
                                <div
                                    key={product.name}
                                    className="flex items-center justify-between rounded-2xl p-3 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 font-bold text-purple-600">
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product.total_sold} units sold
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-lg font-bold text-gray-900">
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            <ActivityItem
                                title="New Sale"
                                desc="Invoice #INV-20240301-001 created"
                                time="2 mins ago"
                                icon={<ShoppingCart className="h-4 w-4" />}
                                color="text-blue-600 bg-blue-50"
                            />
                            <ActivityItem
                                title="Stock Received"
                                desc="100 units of Beef Burger from PT Indofood"
                                time="45 mins ago"
                                icon={<Truck className="h-4 w-4" />}
                                color="text-orange-600 bg-orange-50"
                            />
                            <ActivityItem
                                title="Shift Closed"
                                desc="Cashier Branch 1 closed shift with Rp 1.500.000"
                                time="2 hours ago"
                                icon={<Users className="h-4 w-4" />}
                                color="text-purple-600 bg-purple-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, trend, isUp, color }: any) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <div
                    className={`rounded-2xl p-3 ${color} text-white shadow-lg shadow-gray-100`}
                >
                    {icon}
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}
                >
                    {isUp ? (
                        <ArrowUpRight className="h-3 w-3" />
                    ) : (
                        <ArrowDownRight className="h-3 w-3" />
                    )}
                    {trend}
                </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    );
}

function ActivityItem({ title, desc, time, icon, color }: any) {
    return (
        <div className="flex gap-4">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
            >
                {icon}
            </div>
            <div className="flex-1 border-b border-gray-50 pb-4">
                <div className="mb-0.5 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">{title}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {time}
                    </span>
                </div>
                <p className="line-clamp-1 text-sm text-gray-500">{desc}</p>
            </div>
        </div>
    );
}
