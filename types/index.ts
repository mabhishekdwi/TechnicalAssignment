// Type definitions for SauceDemo Web UI and Restful-Booker API

// ── SauceDemo ─────────────────────────────────────────────────────────────────

export type SauceDemoUser = 'standard_user' | 'locked_out_user' | 'problem_user' | 'performance_glitch_user';

export interface SauceDemoCredentials {
  username: SauceDemoUser | string;
  password: string;
}

export interface SauceDemoProduct {
  name: string;
  price?: number;
  description?: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface SauceDemoTestData {
  users: {
    standard: SauceDemoCredentials;
    locked: SauceDemoCredentials;
    problem: SauceDemoCredentials;
    perfGlitch: SauceDemoCredentials;
  };
  checkout: {
    valid: CheckoutInfo;
  };
  products: {
    backpack: string;
    bikeLight: string;
    boltShirt: string;
  };
}

// ── Restful-Booker ────────────────────────────────────────────────────────────

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

export interface BookingId {
  bookingid: number;
}

export interface AuthToken {
  token: string;
}

export interface RestfulBookerCredentials {
  username: string;
  password: string;
}

export interface RestfulBookerTestData {
  auth: {
    valid: RestfulBookerCredentials;
    invalid: RestfulBookerCredentials;
  };
  booking: {
    sample: Booking;
  };
}

// ── Combined test-data shape (matches data/sample-test-data.json) ─────────────

export interface TestData {
  saucedemo: SauceDemoTestData;
  restfulBooker: RestfulBookerTestData;
}
