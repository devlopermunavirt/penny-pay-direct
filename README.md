# Penny Pay Direct

You are a senior fintech product designer, UX architect, and frontend engineer specializing in premium financial applications, payment platforms, and cryptocurrency transaction products.

BUILD A COMPLETELY NEW PENNY PAY V2 CUSTOMER APPLICATION FROM SCRATCH.

IMPORTANT:
This is a NEW BUILD.
Do not modify an existing PENNY PAY frontend.
Do not reuse an old layout.
Do not preserve an old design.
Do not patch existing components.
Start with a clean customer application architecture.

Stack: Build on the TanStack Start stack with TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, Framer Motion, React Hook Form, and Zod. Start with the clean application shell, authentication routes, and shared design system.

==================================================
1. PROJECT SCOPE
==================================================
Build ONLY the PENNY PAY CUSTOMER APPLICATION.
There is NO public marketing website in this project.
Do NOT build:
- Home page
- About page
- Marketing landing page
- Public FAQ
- Public Contact page
- Public How It Works page
- Public pricing page
- Public marketing sections

The application starts with:
LOGIN / REGISTER

The product is an authenticated financial application.
Primary V1 functionality:
BUY USDT
Secondary:
SELL USDT — COMING SOON

The application must be designed so the backend can be connected later.

==================================================
2. PRODUCT CONTEXT
==================================================
PENNY PAY is a centralized direct-buy/direct-sell USDT service.
Customers deal directly with PENNY PAY.
This is NOT:
- P2P trading
- Customer-to-customer trading
- An order book
- A trading marketplace
- A trading terminal
- A market-making engine
- A trading bot

The initial customer experience focuses on:
- Mobile authentication
- SMS OTP
- KYC
- Current Buy Price
- BUY USDT
- Order creation
- Payment instructions
- Payment receipt upload
- Order tracking
- Order history
- Notifications
- Profile/support

Payment verification and USDT transfer remain manual operations in V1.

==================================================
3. CUSTOMER JOURNEY
==================================================
The primary journey must be:
LOGIN / REGISTER
        ↓
MOBILE OTP
        ↓
KYC
        ↓
DASHBOARD
        ↓
BUY USDT
        ↓
ENTER AMOUNT
        ↓
USDT RECIPIENT DETAILS
        ↓
REVIEW ORDER
        ↓
PAYMENT INSTRUCTIONS
        ↓
UPLOAD PAYMENT RECEIPT
        ↓
PAYMENT SUBMITTED
        ↓
ORDER PROCESSING
        ↓
USDT SENT
        ↓
COMPLETED
        ↓
ORDER DETAILS

Do not unnecessarily add additional transaction steps.

==================================================
4. ROUTES
==================================================
Create the following routes:
/login
/register
/verify
/kyc
/dashboard
/buy
/buy/recipient
/buy/review
/buy/payment
/buy/receipt
/buy/processing
/buy/completed
/orders
/orders/[id]
/notifications
/profile

The routes should be clean and logically organized.

==================================================
5. TECHNOLOGY
==================================================
Use:
TanStack Start
TypeScript
Tailwind CSS
shadcn/ui
Lucide icons
Framer Motion
React Hook Form
Zod

Use clean reusable components.
Architecture should be ready for future Django REST API integration.
Do not create real backend integrations in this phase.

==================================================
6. DESIGN DIRECTION
==================================================
The application should feel like:
MODERN PREMIUM FINTECH

Visual qualities:
- Clean
- Professional
- Trustworthy
- Minimal
- Calm
- Premium
- Modern
- Financial
- Human

Avoid:
- Generic AI dashboard
- Generic SaaS template
- Neon crypto design
- Cyberpunk
- Futuristic Web3 aesthetics
- Excessive gradients
- Excessive glassmorphism
- Excessive shadows
- Excessive rounded cards
- Huge decorative illustrations
- 3D coins
- Bitcoin graphics
- Trading charts
- Fake market data
- Unnecessary visual effects

The goal is:
CLARITY + TRUST + SIMPLE TRANSACTION UX

==================================================
7. TYPOGRAPHY
==================================================
Typography is one of the most important parts of this redesign.
Do NOT use serif fonts.
Use:
INTER
Use Inter consistently across the entire application.

Typography:
Page heading: 28–32px, 600
Section heading: 18–22px, 600
Body: 14–16px, 400
Navigation: 14px, 500
Labels: 11–12px, 500
Buttons: 14px, 500–600
Large financial values: 32–40px, 600–700
Order IDs: 13–14px, 500
Status labels: 12–13px, 500

Use strong typography for financial numbers.
Example:
CURRENT BUY RATE
₹103.00
per USDT
instead of:
₹103.00 per USDT

The most important information must have the strongest visual hierarchy.

==================================================
8. COLOR SYSTEM
==================================================
Use a white-dominant design.
Primary: #FFFFFF
Soft background: #FAFAFA
Text: #171717
Secondary text: #737373
Border: #E8E8E8
Primary accent: #6D4AFF
Soft purple: #F3EFFF
Success: Subtle green
Warning: Subtle amber
Error: Subtle red

Purple should be an accent.
Do NOT make the entire interface purple.
Use purple primarily for:
- Primary CTA
- Active navigation
- Selected states
- Important links
- Important financial output
- Progress indicators

==================================================
9. SPACING AND COMPONENT STYLE
==================================================
Use a consistent spacing system:
8, 12, 16, 20, 24, 32, 40, 48
Cards: 10–14px radius
Inputs: 9–10px radius
Buttons: 9–10px radius

Avoid excessive pill-shaped components.
Use pills only for:
- Status
- Coming Soon
- Small metadata

Use thin borders.
Use shadows very subtly.

==================================================
10. APPLICATION SHELL
==================================================
Desktop layout:
LEFT SIDEBAR + MAIN CONTENT

Sidebar:
PENNY PAY
MENU
Dashboard
Buy USDT
Sell USDT (shows "SOON")
Orders
ACCOUNT
Profile
Support
Logout

The active navigation item should use a subtle lavender background.
Use Lucide icons.
Keep icons neutral except active states.

==================================================
11. MOBILE NAVIGATION
==================================================
On mobile use a bottom navigation:
Home, Buy, Orders, Profile
Sell remains available through the relevant UI but shows: Coming Soon
The mobile layout must be intentionally designed for mobile.

==================================================
12. LOGIN
==================================================
Route: /login
PENNY PAY
Welcome back
Enter your mobile number to continue.
Mobile Number: [ +91 __________ ]
[ Continue ]
Supporting text: You'll receive a verification code by SMS.
Primary auth is mobile number + SMS OTP.

==================================================
13. REGISTER
==================================================
Route: /register
Create your PENNY PAY account
Mobile Number: [ +91 __________ ]
[ Send OTP ]
Terms text: By continuing, you agree to the applicable Terms & Conditions and Privacy Policy.

==================================================
14. OTP VERIFICATION
==================================================
Route: /verify
Verify your number
We've sent a 6-digit verification code to: +91 XXXXX XXXXX
OTP: [ _ _ _ _ _ _ ]
[ Verify ]
Resend in 00:30, Change mobile number
Security message: Never share your OTP with anyone.
Demo OTP: 123456. Clean states for Loading, Success, Invalid OTP, Expired OTP, Resend.

==================================================
15. KYC
==================================================
Route: /kyc
States:
- Not Started (Secure verification, One-time verification, Protected info, [ Start Verification ])
- Pending (Verification in progress, We're reviewing your details, [ Back to Dashboard ])
- Verified (Identity verified, Account ready, [ Continue to Dashboard ])
- Rejected (Couldn't complete verification, show reason, [ Retry Verification ])

==================================================
16. DASHBOARD
==================================================
Route: /dashboard
- Customer identity & KYC status
- Current Buy Price: ₹103.00 per USDT
- Quick calculator: INR ↔ USDT
- [ Buy USDT → ] ("Rate will be locked when your order is created")
- Sell USDT card: "Sell USDT directly to PENNY PAY. Available in a future release. [ Coming Soon ]"
- Recent Orders list with status badges & [ View All ]
No portfolio, charts, or fake market data.

==================================================
17. BUY FLOW ROUTES & EXPERIENCES
==================================================
/buy: Main transaction screen, live conversion (₹103 / USDT), Enter INR or USDT.
/buy/recipient: Wallet address input (0x...), Network selector (TRC20, ERC20, BEP20), safety notice, confirmation checkbox.
/buy/review: Summary (Amounts, Buy Rate locked, Recipient, Network, Payment Method), [ Edit ], [ Confirm & Continue → ].
/buy/payment: "PAYMENT INSTRUCTIONS", Amount to pay, Bank account details (PENNYBLACK LABS PRIVATE LIMITED, Account number, IFSC), Copy buttons, [ I've Made the Payment → ].
/buy/receipt: Upload receipt (JPG, PNG, PDF, max 10MB), drag-and-drop, preview, replace, [ Submit Payment ].
/buy/processing: Order PP-10293 timeline (Order Created -> Payment Submitted -> Payment Verification -> USDT Processing -> USDT Sent -> Completed), subtle animation, estimated completion within 6 hours.
/buy/completed: "Order Completed. Your USDT has been sent.", TXID, Recipient, Amount, [ View Order ], [ Back to Dashboard ].

==================================================
18. ORDERS & ORDER DETAILS
==================================================
/orders: Search, Buy/Sell filters, Order card list with status, amounts, date.
/orders/[id]: Full order details, timeline, receipt view, TXID when completed, order-specific support modal/form.

==================================================
19. NOTIFICATIONS & PROFILE
==================================================
/notifications: Deep-linking status notifications.
/profile: Personal info, mobile, KYC badge, security items, help center, logout.

==================================================
20. ARCHITECTURE & MOCK STATE
==================================================
Create clean state stores and service abstractions matching future Django REST API endpoints (/api/v1/...).
Mock demo flow with demo OTP 123456, rate ₹103.00, order PP-10293, and simulated progression.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/89eb2dd2-4dc9-430c-aa53-7883eb917f25).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
