import { useState } from 'react';
import { useShiftStore } from '@/stores/use-shift-store';
import { Wallet, LogIn } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ShiftOverlay() {
    const { activeShift, fetchStatus } = useShiftStore();
    const [startingCash, setStartingCash] = useState(0);
    const [isOpening, setIsOpening] = useState(false);

    if (activeShift) return null;

    const handleOpenShift = () => {
        setIsOpening(true);
        router.post(
            '/shifts/open',
            {
                starting_cash: startingCash,
            },
            {
                onSuccess: () => {
                    fetchStatus();
                    setIsOpening(false);
                },
                onError: () => {
                    setIsOpening(false);
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-in overflow-hidden rounded-3xl bg-white shadow-2xl duration-300 fade-in zoom-in">
                <div className="p-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                        <Wallet className="h-10 w-10 text-purple-600" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                        Open Your Shift
                    </h2>
                    <p className="mb-8 text-gray-500">
                        Please enter the starting cash in your drawer to begin
                        accepting orders.
                    </p>

                    <div className="space-y-6">
                        <div className="text-left">
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                                Starting Cash (IDR)
                            </label>
                            <div className="relative">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-gray-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-xl font-bold transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                                    placeholder="0"
                                    value={startingCash || ''}
                                    onChange={(e) =>
                                        setStartingCash(Number(e.target.value))
                                    }
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleOpenShift}
                            disabled={isOpening}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-4 text-lg font-bold text-white shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 active:scale-95 disabled:opacity-50"
                        >
                            <LogIn className="h-5 w-5" />
                            {isOpening ? 'Opening...' : 'Start Shift'}
                        </button>
                    </div>
                </div>
                <div className="border-t border-gray-100 bg-gray-50 p-4 text-center">
                    <p className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                        Enterprise POS v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
