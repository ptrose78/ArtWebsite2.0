# ArtWebsite 2.0
A custom e-commerce platform for artists to showcase and sell their artwork, featuring a built-in CMS for content management.

## Core Features
- Dynamic artwork gallery with featured items display
- Secure e-commerce functionality with Square payment integration
- Responsive design optimized for all devices
- Custom CMS for artwork management
- Email notifications for orders and subscriptions
- Shopping cart functionality with Redux state management

## Tech Stack
- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - Redux for state management
  - Tailwind CSS for styling

- **Backend:**
  - Next.js API Routes
  - Square Payments API
  - Email service integration

- **Authentication:**
  - Custom admin authentication system
  - Secure session management

## Project Structure
```
ArtWebsite2.0/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── about/           # About page
│   │   ├── admin/           # Admin CMS routes and components
│   │   ├── api/             # API endpoints
│   │   ├── arts/            # Gallery and artwork display
│   │   ├── blog/            # Blog section
│   │   ├── cart/            # Shopping cart functionality
│   │   ├── checkout/        # Checkout process and payment
│   │   ├── components/      # Shared components
│   │   ├── contact/         # Contact form and information
│   │   ├── lib/             # Core utilities and data functions
│   │   ├── ui/              # UI components and layouts
│   │   └── utils/           # Helper functions and utilities
│   ├── assets/              # Logos and images           
│   ├── store/               # Redux store configuration
│   └── types/               # TypeScript type definitions
```

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd ArtWebsite2.0
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Key Features Implementation

### E-commerce
- Shopping cart with Redux state management
- Secure checkout process using Square Payments
- Order confirmation emails
- Product image management

### Admin CMS
- Secure admin login system
- Artwork management interface
- Order tracking and management
- Content management for featured items

### User Experience
- Responsive image galleries
- Dynamic featured artwork carousel
- Real-time cart updates
- Mobile-optimized layouts

## Contributing
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License
This project is licensed under the MIT License.