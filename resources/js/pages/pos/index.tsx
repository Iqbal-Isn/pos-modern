import POSLayout from '@/layouts/pos-layout';
import { Head } from '@inertiajs/react';
import {
    Search,
    Filter,
    Barcode,
    ShoppingCart,
    User,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    QrCode,
    Wallet,
} from 'lucide-react';
import { usePosStore } from '@/stores/use-pos-store';
import { useShiftStore } from '@/stores/use-shift-store';
import { useState, useEffect } from 'react';
import ShiftOverlay from '@/components/pos/shift-overlay';
import CustomerSelector from '@/components/pos/customer-selector';
import { router } from '@inertiajs/react';

export default function POS({
    products,
    categories,
}: {
    products: any[];
    categories: any[];
}) {
    const {
        cart,
        taxRate,
        addToCart,
        removeFromCart,
        updateQuantity,
        getSubtotal,
        getTotal,
        discount,
        setDiscount,
        selectedCustomer,
        clearCart,
    } = usePosStore();

    const { activeShift, fetchStatus } = useShiftStore();

    useEffect(() => {
        fetchStatus();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const filteredProducts = products.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (!selectedCategory || p.category_id === selectedCategory),
    );

    const [isProcessing, setIsProcessing] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MIDTRANS'>(
        'CASH',
    );

    const handleCheckout = () => {
        if (cart.length === 0) return;

        setIsProcessing(true);
        const total = getTotal();

        if (paymentMethod === 'CASH') {
            const finalPaidAmount = paidAmount || total;
            router.post(
                '/pos/checkout',
                {
                    cart: cart as any,
                    payment_method: 'CASH',
                    paid_amount: finalPaidAmount,
                    customer_id: selectedCustomer?.id,
                },
                {
                    onSuccess: () => {
                        alert('Transaction Successful!');
                        clearCart();
                        setPaidAmount(0);
                        setIsProcessing(false);
                        fetchStatus();
                    },
                    onError: (errors) => {
                        console.error(errors);
                        alert(
                            'Transaction Failed: ' +
                                Object.values(errors).join(', '),
                        );
                        setIsProcessing(false);
                    },
                },
            );
        } else {
            // Midtrans flow
            // Better approach for Midtrans:
            // 1. Create Sale first (as PENDING)
            // 2. Get Snap Token
            // 3. Show Modal

            const processMidtrans = async () => {
                try {
                    // Create Sale
                    const checkoutRes = await fetch('/pos/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': (
                                document.querySelector(
                                    'meta[name="csrf-token"]',
                                ) as any
                            )?.content,
                        },
                        body: JSON.stringify({
                            cart: cart,
                            payment_method: 'MIDTRANS',
                            paid_amount: total,
                            customer_id: selectedCustomer?.id,
                        }),
                    });
                    const checkoutData = await checkoutRes.json();

                    if (!checkoutData.success) {
                        alert('Checkout failed');
                        setIsProcessing(false);
                        return;
                    }

                    // Get Snap Token
                    const tokenRes = await fetch('/payments/snap-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': (
                                document.querySelector(
                                    'meta[name="csrf-token"]',
                                ) as any
                            )?.content,
                        },
                        body: JSON.stringify({ sale_id: checkoutData.id }), // We need to ensure controller returns ID
                    });
                    const tokenData = await tokenRes.json();

                    if (tokenData.snap_token) {
                        (window as any).snap.pay(tokenData.snap_token, {
                            onSuccess: (result: any) => {
                                alert('Payment Success!');
                                clearCart();
                                fetchStatus();
                                setIsProcessing(false);
                            },
                            onPending: (result: any) => {
                                alert('Payment Pending...');
                                clearCart();
                                fetchStatus();
                                setIsProcessing(false);
                            },
                            onError: (result: any) => {
                                alert('Payment Failed!');
                                setIsProcessing(false);
                            },
                            onClose: () => {
                                setIsProcessing(false);
                            },
                        });
                    }
                } catch (error) {
                    console.error(error);
                    alert('Error processing payment');
                    setIsProcessing(false);
                }
            };

            processMidtrans();
        }
    };

    const handleCloseShift = () => {
        const actualCash = prompt('Enter actual cash in drawer:');
        if (actualCash === null) return;

        router.post(
            '/shifts/close',
            {
                actual_cash: Number(actualCash),
                notes: 'Shift closed from POS UI',
            },
            {
                onSuccess: () => {
                    alert('Shift closed. Thank you!');
                    fetchStatus();
                },
            },
        );
    };

    return (
        <POSLayout>
            <Head title="Point of Sale" />

            <ShiftOverlay />

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel: Product Grid */}
                <div className="flex flex-1 flex-col overflow-hidden p-6">
                    {/* Top Bar: Search & Filter */}
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products or scan barcode..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50">
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="scrollbar-hide mb-6 flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                                !selectedCategory
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:border-purple-200'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                                    selectedCategory === cat.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                        : 'border border-gray-200 bg-white text-gray-600 hover:border-purple-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="group flex cursor-pointer flex-col items-center rounded-2xl border border-gray-100 bg-white p-3 text-center transition-all hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100/50"
                                >
                                    <div className="mb-3 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <ShoppingCart className="h-8 w-8 text-gray-200" />
                                        )}
                                    </div>
                                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="mb-3 text-xs text-gray-400">
                                        {product.sku}
                                    </p>
                                    <span className="text-sm font-bold text-purple-600">
                                        Rp{' '}
                                        {Number(product.price).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Cart Summary */}
                <div className="flex w-96 flex-col border-l border-gray-200 bg-white shadow-2xl">
                    <div className="border-b border-gray-100 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Current Order
                            </h2>
                            <button className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Shift Info */}
                        {activeShift && (
                            <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                                        <Wallet className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                                            Active Shift
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            Rp{' '}
                                            {Number(
                                                activeShift.expected_cash,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseShift}
                                    className="rounded-full bg-red-50 p-1 px-3 text-[10px] font-bold text-red-600 transition-all hover:bg-red-100"
                                >
                                    CLOSE
                                </button>
                            </div>
                        )}

                        <CustomerSelector />
                    </div>

                    {/* Cart Items */}
                    <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                                    <ShoppingCart className="h-10 w-10 text-gray-200" />
                                </div>
                                <p className="text-sm text-gray-400">
                                    Cart is empty
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex gap-4 rounded-2xl border border-gray-50 p-3 transition-all hover:border-purple-100"
                                >
                                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ShoppingCart className="h-5 w-5 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="mb-1 truncate text-sm font-bold text-gray-900">
                                            {item.name}
                                        </h4>
                                        <p className="mb-2 text-xs font-bold text-purple-600">
                                            Rp{' '}
                                            {Number(
                                                item.price,
                                            ).toLocaleString()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 rounded-lg bg-gray-100 p-1">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="rounded-md p-1 shadow-sm transition-all hover:bg-white"
                                                >
                                                    <Minus className="h-3 w-3 text-gray-600" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="rounded-md p-1 shadow-sm transition-all hover:bg-white"
                                                >
                                                    <Plus className="h-3 w-3 text-gray-600" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">
                                                Rp{' '}
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary & Checkout */}
                    <div className="rounded-t-3xl border-t border-gray-100 bg-gray-50/50 p-6">
                        <div className="mb-6 space-y-3">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-mono font-bold text-gray-900">
                                    Rp {getSubtotal().toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Discount</span>
                                <span className="font-mono font-bold text-red-500">
                                    - Rp{' '}
                                    {(
                                        (getSubtotal() * discount) /
                                        100
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Tax (11%)</span>
                                <span className="font-mono font-bold text-gray-900">
                                    Rp{' '}
                                    {(
                                        (getSubtotal() -
                                            (getSubtotal() * discount) / 100) *
                                        0.11
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-dashed border-gray-200 pt-3">
                                <span className="text-lg font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="font-mono text-2xl font-black tracking-tight text-purple-600">
                                    Rp {getTotal().toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('CASH')}
                                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                                    paymentMethod === 'CASH'
                                        ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg shadow-purple-100'
                                        : 'border-gray-100 bg-white text-gray-400 hover:border-purple-200'
                                }`}
                            >
                                <Wallet className="h-5 w-5" />
                                <span className="text-xs font-bold">Cash</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('MIDTRANS')}
                                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                                    paymentMethod === 'MIDTRANS'
                                        ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-lg shadow-purple-100'
                                        : 'border-gray-100 bg-white text-gray-400 hover:border-purple-200'
                                }`}
                            >
                                <QrCode className="h-5 w-5" />
                                <span className="text-xs font-bold">
                                    Digital
                                </span>
                            </button>
                        </div>

                        {paymentMethod === 'CASH' && (
                            <div className="mb-4">
                                <input
                                    type="number"
                                    placeholder="Paid Amount"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-xl font-bold outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                    value={paidAmount || ''}
                                    onChange={(e) =>
                                        setPaidAmount(Number(e.target.value))
                                    }
                                />
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            className="w-full transform rounded-2xl bg-purple-600 py-4 text-lg font-bold text-white shadow-xl shadow-purple-200 transition-all hover:-translate-y-1 hover:bg-purple-700 active:scale-95 disabled:transform-none disabled:opacity-50"
                            disabled={cart.length === 0 || isProcessing}
                        >
                            {isProcessing
                                ? 'Processing...'
                                : paymentMethod === 'CASH'
                                  ? 'Complete Purchase'
                                  : 'Get QRIS / Payment'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #7c3aed; }
            `}</style>
        </POSLayout>
    );
}
