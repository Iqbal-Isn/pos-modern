import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Package,
    Plus,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';

interface Procurement {
    id: number;
    reference_number: string;
    supplier: { name: string };
    date: string;
    status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
    total_amount: number;
}

export default function Procurements({
    procurements,
}: {
    procurements: { data: Procurement[] };
}) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'RECEIVED':
                return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case 'DRAFT':
                return <Clock className="h-4 w-4 text-gray-400" />;
            case 'ORDERED':
                return <Truck className="h-4 w-4 text-blue-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-red-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'RECEIVED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'DRAFT':
                return 'bg-gray-50 text-gray-600 border-gray-100';
            case 'ORDERED':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            default:
                return 'bg-red-50 text-red-700 border-red-100';
        }
    };

    return (
        <AppLayout>
            <Head title="Procurements" />

            <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Procurements
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage your purchase orders and stock intake
                        </p>
                    </div>
                    <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700">
                        <Plus className="h-5 w-5" />
                        New Purchase Order
                    </button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Total Orders
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">24</h3>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Pending Receipt
                        </p>
                        <h3 className="mt-1 text-2xl font-bold text-blue-600">
                            8
                        </h3>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Monthly Spending
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">
                            Rp 127.500.000
                        </h3>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-100 bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Ref Number
                                </th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Supplier
                                </th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-gray-400 uppercase">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-xs font-bold tracking-wider text-gray-400 uppercase"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {procurements.data.map((p) => (
                                <tr
                                    key={p.id}
                                    className="transition-colors hover:bg-gray-50/50"
                                >
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">
                                            {p.reference_number}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {p.supplier.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(p.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${getStatusClass(p.status)}`}
                                        >
                                            {getStatusIcon(p.status)}
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                                        Rp {p.total_amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-bold text-purple-600 hover:text-purple-700">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
