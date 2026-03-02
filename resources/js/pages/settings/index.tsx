import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Store,
    MapPin,
    Phone,
    Mail,
    Files,
    Percent,
    Coins,
    Save,
    CheckCircle,
} from 'lucide-react';

export default function Settings({ tenant, settings }: any) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            store_name: settings.store_name || tenant.name,
            address: settings.address || '',
            phone: settings.phone || '',
            email: settings.email || '',
            receipt_footer: settings.receipt_footer || '',
            tax_rate: settings.tax_rate || 0,
            currency: settings.currency || 'IDR',
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    return (
        <AppLayout>
            <Head title="Store Settings" />

            <div className="max-w-4xl p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Branch Settings
                    </h1>
                    <p className="text-sm text-gray-500">
                        Configure your store identity and preferences
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Store Identity */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-purple-600">
                            <Store className="h-5 w-5 font-bold" />
                            <h3 className="text-lg font-bold">
                                Store Identity
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Store Name
                                </label>
                                <input
                                    type="text"
                                    value={data.store_name}
                                    onChange={(e) =>
                                        setData('store_name', e.target.value)
                                    }
                                    className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 font-medium transition-all outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />
                                {errors.store_name && (
                                    <p className="ml-1 text-xs text-red-500">
                                        {errors.store_name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Contact Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-12 font-medium transition-all outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Address
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                                    <textarea
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        rows={3}
                                        className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-12 font-medium transition-all outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-12 font-medium transition-all outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Receipt & Financials */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-emerald-600">
                            <Files className="h-5 w-5 font-bold" />
                            <h3 className="text-lg font-bold">
                                Receipt & Financials
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Default Tax Rate (%)
                                </label>
                                <div className="relative">
                                    <Percent className="absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="number"
                                        value={data.tax_rate}
                                        onChange={(e) =>
                                            setData('tax_rate', e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-12 font-medium transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Currency
                                </label>
                                <div className="relative">
                                    <Coins className="absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.currency}
                                        onChange={(e) =>
                                            setData('currency', e.target.value)
                                        }
                                        maxLength={3}
                                        className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-12 font-medium uppercase transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="ml-1 text-sm font-bold text-gray-700">
                                    Receipt Footer Message
                                </label>
                                <textarea
                                    value={data.receipt_footer}
                                    onChange={(e) =>
                                        setData(
                                            'receipt_footer',
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                    placeholder="Ex: Thank you for dining with us!"
                                    className="w-full resize-none rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        {recentlySuccessful && (
                            <div className="flex animate-in items-center gap-2 text-sm font-bold text-emerald-600 duration-500 fade-in">
                                <CheckCircle className="h-5 w-5" />
                                Settings saved
                            </div>
                        )}
                        <button
                            disabled={processing}
                            className="flex items-center gap-2 rounded-2xl bg-purple-600 px-8 py-4 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
