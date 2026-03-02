import { create } from 'zustand';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    sku: string;
}

interface PosState {
    cart: CartItem[];
    selectedCustomer: any | null;
    discount: number;
    taxRate: number;

    // Actions
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    setDiscount: (amount: number) => void;
    setSelectedCustomer: (customer: any | null) => void;
    clearCart: () => void;

    // Computed
    getSubtotal: () => number;
    getTotal: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
    cart: [],
    selectedCustomer: null,
    discount: 0,
    taxRate: 0.1, // 10%

    addToCart: (product) => {
        set((state) => {
            const existingItem = state.cart.find(
                (item) => item.id === product.id,
            );
            if (existingItem) {
                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                };
            }
            return {
                cart: [...state.cart, { ...product, quantity: 1 }],
            };
        });
    },

    removeFromCart: (productId) => {
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        }));
    },

    updateQuantity: (productId, quantity) => {
        set((state) => ({
            cart: state.cart
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: Math.max(0, quantity) }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        }));
    },

    setDiscount: (amount) => set({ discount: amount }),
    setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
    clearCart: () => set({ cart: [], discount: 0, selectedCustomer: null }),

    getSubtotal: () => {
        return get().cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );
    },

    getTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = subtotal * get().taxRate;
        return subtotal + tax - get().discount;
    },
}));
