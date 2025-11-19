// Route paths constants
export const ROUTES = {
  HOME: '/',
  FEATURES: '/features',
  CHAT: '/chat',
  SUBJECTS: '/subjects',
  ABOUT: '/about',
} as const;

// Navigation links configuration
export const NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Features', path: ROUTES.FEATURES },
  { label: 'Chat', path: ROUTES.CHAT },
  { label: 'Subjects', path: ROUTES.SUBJECTS },
  { label: 'About', path: ROUTES.ABOUT },
] as const;

// Contact information
export const CONTACT = {
  EMAIL: 'support@kingidy.com',
  PHONE: '+1-800-KINGIDY',
} as const;

// Social links (for future implementation)
export const SOCIAL_LINKS = {
  PRIVACY: '#privacy',
  TERMS: '#terms',
} as const;
