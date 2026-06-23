import type { User, Order, Address } from "@/types";
import { products } from "./products";

export const mockAddresses: Address[] = [
  {
    id: "addr1",
    label: "Home",
    fullName: "Alex Morgan",
    line1: "12 MG Road",
    line2: "Flat 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phone: "+91 86579 73913",
    isDefault: true,
  },
  {
    id: "addr2",
    label: "Work",
    fullName: "Alex Morgan",
    line1: "45 FC Lane, Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411001",
    country: "India",
    phone: "+91 72190 60279",
    isDefault: false,
  },
];

export const mockUser: User = {
  id: "u1",
  role: "customer",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  phone: "+91 86579 73913",
  addresses: mockAddresses,
};

const p = (i: number) => products[i];

export const mockOrders: Order[] = [
  {
    id: "o1",
    number: "CS-100245",
    date: "2026-05-28T10:12:00.000Z",
    status: "delivered",
    items: [
      { productId: p(0).id, name: p(0).name, team: p(0).team, image: "front", size: "L", price: p(0).price, quantity: 1 },
      { productId: p(12).id, name: p(12).name, team: p(12).team, image: "front", size: "M", price: p(12).price, quantity: 1 },
    ],
    subtotal: p(0).price + p(12).price,
    shipping: 100,
    tax: 0,
    total: p(0).price + p(12).price + 100,
    currency: "INR",
    shippingAddress: mockAddresses[0],
    trackingNumber: "TRK-7741X",
  },
  {
    id: "o2",
    number: "CS-100311",
    date: "2026-06-09T15:40:00.000Z",
    status: "shipped",
    items: [
      { productId: p(18).id, name: p(18).name, team: p(18).team, image: "front", size: "L", price: p(18).price, quantity: 2 },
    ],
    subtotal: p(18).price * 2,
    shipping: 100,
    tax: 0,
    total: p(18).price * 2 + 100,
    currency: "INR",
    shippingAddress: mockAddresses[0],
    trackingNumber: "TRK-9920Z",
  },
  {
    id: "o3",
    number: "CS-100398",
    date: "2026-06-18T08:05:00.000Z",
    status: "processing",
    items: [
      { productId: p(22).id, name: p(22).name, team: p(22).team, image: "front", size: "M", price: p(22).price, quantity: 1 },
    ],
    subtotal: p(22).price,
    shipping: 100,
    tax: 0,
    total: p(22).price + 100,
    currency: "INR",
    shippingAddress: mockAddresses[1],
  },
];
