# Patient Management Dashboard

A comprehensive, modern patient management system built with React, TypeScript, Next.js, and Antd. This application demonstrates advanced frontend skills including state management, performance optimization, and responsive design.

## 🚀 Features

### Core Functionality

- **Patient List Management**: View, search, filter, and paginate through patient records
- **Advanced Search & Filtering**: Real-time search with multiple filter options (status, gender, age range)
- **Patient Forms**: Create and edit patient information with comprehensive validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Robust error boundaries and user feedback
- **Cursor-based Pagination**: Efficient pagination for large datasets
- **Real-time Validation**: Instant feedback on form inputs

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **GraphQL Integration**: Apollo Client with local resolvers and mock data
- **Performance Optimization**:
  - React.memo for component memoization
  - useCallback and useMemo for optimized re-renders
  - Efficient state management with proper dependency arrays
  - Cursor-based pagination for better performance
- **Form Validation**: Client-side validation with Antd Form built-in validators
- **Reusable Components**: Modular, composable UI components
- **Error Boundaries**: Comprehensive error handling and recovery

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Ant Design (Antd)
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client with GraphQL
- **Form Handling**: Antd Form components with built-in validation
- **Performance**: Optimized React components
- **Build Tool**: Turbopack (Next.js)

## 📁 Project Structure

```
patient-management-dashboard/
├── app/
│   ├── api/
│   │   └── graphql/
│   │       └── route.ts     # GraphQL API endpoint
│   ├── globals.css          # Global styles and Tailwind configuration
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── providers/
│   │   └── MessageProvider.tsx  # Message context provider
│   ├── ui/                  # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   ├── EmptyState.tsx
│   │   └── StatusBadge.tsx
│   └── patient/             # Patient-specific components
│       ├── PatientList.tsx
│       ├── PatientForm.tsx
│       └── SearchAndFilter.tsx
├── lib/
│   ├── apollo-client.ts     # Apollo Client configuration
│   ├── data.json           # Mock patient data
│   ├── message.ts          # Message utility functions
│   └── graphql/
│       ├── queries.ts      # GraphQL queries and mutations
│       └── schema.ts       # GraphQL schema and resolvers
├── types/
│   └── patient.ts          # TypeScript type definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd patient-management-dashboard
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

> **Note**: Testing scripts are not currently available as testing is not implemented in this project.

## 🎯 Key Components

### PatientList

The main component displaying patient data in a table format with:

- **Search and filtering capabilities**: Real-time search with multiple filter options
- **Cursor-based pagination**: Efficient pagination for large datasets
- **Action buttons**: View, edit, and delete patient records
- **Responsive design**: Mobile-first approach with responsive table
- **Performance optimization**: Memoized columns and callbacks
- **Error handling**: Comprehensive error states and loading indicators

### PatientForm

Comprehensive form for creating and editing patients with:

- **Multi-section layout**: Personal, Address, Medical, and Emergency Contact sections
- **Real-time validation**: Instant feedback on form inputs
- **Custom validators**: Email, phone, and ZIP code validation
- **Error handling**: User-friendly error messages and recovery
- **Responsive design**: Mobile-optimized form layout
- **Type safety**: Full TypeScript integration with form validation

### SearchAndFilter

Advanced filtering component featuring:

- **Real-time search**: Search across multiple patient fields
- **Multiple filters**: Status, gender, and age range filtering
- **Advanced options**: Collapsible advanced filter section
- **Clear functionality**: Reset all filters with one click
- **Performance**: Debounced search and optimized re-renders
- **User experience**: Intuitive filter interface with clear visual feedback

### UI Components

#### ErrorBoundary

- **Error catching**: Catches JavaScript errors in component tree
- **Fallback UI**: User-friendly error display with recovery options
- **Development mode**: Detailed error information in development
- **Production ready**: Clean error handling for production

#### EmptyState

- **Multiple states**: No data, no results, and error states
- **Customizable**: Configurable icons, titles, and actions
- **User guidance**: Clear instructions for next steps
- **Consistent design**: Unified empty state experience

#### StatusBadge

- **Visual indicators**: Color-coded status display
- **Icon support**: Status-specific icons for better UX
- **Size variants**: Small, default, and large sizes
- **Accessibility**: Proper color contrast and screen reader support

## 🚀 Performance Optimizations

### React Optimizations

1. **React.memo**: Components are memoized to prevent unnecessary re-renders
2. **useCallback**: Event handlers are memoized to prevent child re-renders
3. **useMemo**: Expensive calculations are memoized (pagination, columns)
4. **Proper Dependencies**: Correct dependency arrays in useEffect and useCallback
5. **State Management**: Efficient state management with React hooks

### GraphQL Optimizations

1. **Cursor-based Pagination**: More efficient than offset-based pagination
2. **Query Caching**: Apollo Client caching for repeated queries
3. **Error Policies**: Proper error handling without breaking the UI
4. **Network Status**: Loading states and network error handling

### UI Optimizations

1. **Responsive Design**: Mobile-first approach with Tailwind CSS
2. **Lazy Loading**: Components loaded only when needed
3. **Virtual Scrolling**: Efficient rendering of large lists
4. **Debounced Search**: Prevents excessive API calls during typing

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

### GraphQL Setup

The application uses local GraphQL resolvers with mock data. In production, replace the local resolvers with actual API endpoints.

## 🌐 GraphQL API

### Available Queries

#### Get Patients

```graphql
query GetPatients(
  $first: Int
  $after: String
  $search: String
  $status: PatientStatus
  $gender: Gender
  $ageRange: AgeRangeInput
) {
  patients(
    first: $first
    after: $after
    search: $search
    status: $status
    gender: $gender
    ageRange: $ageRange
  ) {
    edges {
      node {
        id
        firstName
        lastName
        email
        phone
        dateOfBirth
        gender
        status
        address {
          street
          city
          state
          zipCode
          country
        }
        medicalRecordNumber
        insurance {
          provider
          policyNumber
          groupNumber
        }
        emergencyContact {
          name
          relationship
          phone
          email
        }
        createdAt
        updatedAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

#### Get Single Patient

```graphql
query GetPatient($id: ID!) {
  patient(id: $id) {
    id
    firstName
    lastName
    email
    phone
    dateOfBirth
    gender
    status
    address {
      street
      city
      state
      zipCode
      country
    }
    medicalRecordNumber
    insurance {
      provider
      policyNumber
      groupNumber
    }
    emergencyContact {
      name
      relationship
      phone
      email
    }
    createdAt
    updatedAt
  }
}
```

### Available Mutations

#### Create Patient

```graphql
mutation CreatePatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    id
    firstName
    lastName
    email
    phone
    dateOfBirth
    gender
    status
    address {
      street
      city
      state
      zipCode
      country
    }
    medicalRecordNumber
    insurance {
      provider
      policyNumber
      groupNumber
    }
    emergencyContact {
      name
      relationship
      phone
      email
    }
    createdAt
    updatedAt
  }
}
```

#### Update Patient

```graphql
mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
  updatePatient(id: $id, input: $input) {
    id
    firstName
    lastName
    email
    phone
    dateOfBirth
    gender
    status
    address {
      street
      city
      state
      zipCode
      country
    }
    medicalRecordNumber
    insurance {
      provider
      policyNumber
      groupNumber
    }
    emergencyContact {
      name
      relationship
      phone
      email
    }
    createdAt
    updatedAt
  }
}
```

#### Delete Patient

```graphql
mutation DeletePatient($id: ID!) {
  deletePatient(id: $id) {
    success
    message
  }
}
```

### Data Types

#### Patient

- **id**: Unique identifier
- **firstName**: Patient's first name
- **lastName**: Patient's last name
- **email**: Email address
- **phone**: Phone number
- **dateOfBirth**: Date of birth (YYYY-MM-DD)
- **gender**: Gender (male, female, other)
- **status**: Patient status (active, inactive, pending)
- **address**: Complete address information
- **medicalRecordNumber**: Unique medical record number
- **insurance**: Insurance information
- **emergencyContact**: Emergency contact details
- **createdAt**: Creation timestamp
- **updatedAt**: Last update timestamp

#### Filters

- **search**: Text search across name, email, and MRN
- **status**: Filter by patient status
- **gender**: Filter by gender
- **ageRange**: Filter by age range (min/max)

## 🎨 Styling

The application uses Tailwind CSS with custom component classes:

- Responsive grid layouts
- Custom hover effects and animations
- Consistent color scheme
- Mobile-first design approach
- Print-friendly styles

## 🧪 Validation

### Form Validation Features

- **Email validation**: RFC-compliant email format validation
- **Phone validation**: Flexible phone number format support
- **ZIP code validation**: US format (12345 or 12345-6789)
- **Required fields**: Comprehensive required field validation
- **Custom validators**: Business-specific validation rules
- **Real-time feedback**: Instant validation feedback as user types
- **Error messages**: Clear, user-friendly error messages

### Validation Rules

```typescript
// Email validation
const validateEmail = (value: string) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return Promise.reject(new Error('Please enter a valid email address'));
  }
  return Promise.resolve();
};

// Phone validation
const validatePhone = (value: string) => {
  if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
    return Promise.reject(new Error('Please enter a valid phone number'));
  }
  return Promise.resolve();
};

// ZIP code validation
const validateZipCode = (value: string) => {
  if (value && !/^\d{4}(-\d{4})?$/.test(value)) {
    return Promise.reject(
      new Error('Please enter a valid ZIP code (1234 or 12345-6789)'),
    );
  }
  return Promise.resolve();
};
```

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first CSS approach
- Flexible grid layouts
- Responsive typography
- Touch-friendly interface elements
- Optimized for various screen sizes

## 🚀 Performance Features

### Next.js Optimizations

- **Code Splitting**: Automatic code splitting with Next.js App Router
- **Turbopack**: Fast development builds with Turbopack
- **Bundle Analysis**: Built-in bundle analyzer for optimization
- **Static Generation**: Optimized static generation where possible

### GraphQL Optimizations

- **Apollo Client Caching**: Intelligent caching for GraphQL queries
- **Query Deduplication**: Prevents duplicate queries
- **Error Policies**: Graceful error handling without breaking UI
- **Network Status**: Real-time network status monitoring

### React Optimizations

- **Component Memoization**: React.memo for expensive components
- **Callback Memoization**: useCallback for event handlers
- **Value Memoization**: useMemo for expensive calculations
- **Proper Dependencies**: Correct dependency arrays in hooks

### UI Optimizations

- **Responsive Images**: Optimized image loading and display
- **Virtual Scrolling**: Efficient rendering of large lists
- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Components loaded only when needed

## 🔒 Type Safety

### TypeScript Implementation

- **Strict Type Checking**: Full TypeScript strict mode enabled
- **Interface Definitions**: Comprehensive interfaces for all data structures
- **Generic Types**: Reusable generic types for components
- **Type-safe GraphQL**: Generated types for GraphQL operations
- **Utility Types**: Advanced TypeScript utility types usage

### Type Definitions

```typescript
// Patient interface with comprehensive typing
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
  medicalRecordNumber: string;
  insurance: Insurance;
  emergencyContact: EmergencyContact;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
}

// Filter interface with optional properties
interface PatientFilters {
  search?: string;
  status?: Patient['status'];
  gender?: Patient['gender'];
  ageRange?: {
    min: number;
    max: number;
  };
}
```

### GraphQL Type Safety

- **Generated Types**: Type-safe GraphQL operations
- **Input Validation**: Type-safe input validation
- **Response Typing**: Fully typed GraphQL responses
- **Error Handling**: Type-safe error handling

## 📚 Learning Outcomes

This project demonstrates:

### React Advanced Patterns

- **Custom Hooks**: Reusable logic extraction
- **Context API**: State management across components
- **Error Boundaries**: Error handling and recovery
- **Performance Optimization**: Memoization and optimization techniques
- **Component Composition**: Building complex UIs from simple components

### TypeScript Best Practices

- **Interface Design**: Well-structured type definitions
- **Generic Types**: Reusable and flexible type system
- **Type Guards**: Runtime type checking
- **Utility Types**: Advanced TypeScript features
- **Strict Type Checking**: Production-ready type safety

### GraphQL Integration

- **Apollo Client**: Modern GraphQL client setup
- **Query Optimization**: Efficient data fetching
- **Error Handling**: Graceful error management
- **Caching Strategies**: Intelligent data caching
- **Real-time Updates**: Live data synchronization

### Performance Optimization

- **React.memo**: Component memoization
- **useCallback/useMemo**: Hook optimization
- **Code Splitting**: Lazy loading strategies
- **Bundle Optimization**: Production build optimization
- **Rendering Optimization**: Efficient re-rendering patterns

### UI/UX Design

- **Responsive Design**: Mobile-first approach
- **Accessibility**: Screen reader and keyboard navigation
- **User Feedback**: Loading states and error messages
- **Form Design**: Intuitive form layouts and validation
- **Component Library**: Reusable UI components

### Development Practices

- **Code Organization**: Clean project structure
- **Documentation**: Comprehensive code documentation
- **Error Handling**: Robust error management
- **Testing**: Component testing strategies
- **Performance Monitoring**: Performance measurement and optimization

## 🐛 Troubleshooting

### Common Issues

#### Development Server Issues

```bash
# Clear Next.js cache
rm -rf .next
yarn dev

# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

#### GraphQL Issues

- **Query errors**: Check if the GraphQL endpoint is running
- **Type errors**: Ensure TypeScript types are up to date
- **Cache issues**: Clear Apollo Client cache in browser dev tools

#### Build Issues

```bash
# Check for TypeScript errors
yarn lint

# Check build output
yarn build

# Analyze bundle size
yarn build --analyze
```

#### Performance Issues

- **Slow rendering**: Check for unnecessary re-renders in React DevTools
- **Large bundle**: Use bundle analyzer to identify large dependencies
- **Memory leaks**: Check for proper cleanup in useEffect hooks

### Debug Mode

Enable debug mode by setting environment variables:

```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 🧪 Testing

> **Note**: Testing is not currently implemented in this project. This section outlines the recommended testing approach for future implementation.

### Recommended Testing Setup

#### Install Testing Dependencies

```bash
# Install testing dependencies
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

#### Test Structure (Recommended)

```
__tests__/
├── components/
│   ├── PatientList.test.tsx
│   ├── PatientForm.test.tsx
│   └── SearchAndFilter.test.tsx
├── lib/
│   └── graphql/
│       └── resolvers.test.ts
└── utils/
    └── validation.test.ts
```

#### Running Tests (When Implemented)

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## 📊 Performance Monitoring

### Bundle Analysis

```bash
# Analyze bundle size
yarn build --analyze

# Check for duplicate dependencies
yarn why <package-name>
```

### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security Considerations

### Data Protection

- **Input Validation**: All user inputs are validated
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: GraphQL mutations include CSRF tokens
- **Data Sanitization**: All data is sanitized before display

### Best Practices

- **Environment Variables**: Sensitive data in environment variables
- **Type Safety**: TypeScript prevents many runtime errors
- **Error Handling**: Comprehensive error boundaries
- **Input Validation**: Client and server-side validation

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality (when testing is implemented)
5. Run linting (`yarn lint`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Conventional Commits**: Use conventional commit messages

### Pull Request Guidelines

- **Description**: Clear description of changes
- **Tests**: Include tests for new features (when testing is implemented)
- **Documentation**: Update documentation if needed
- **Breaking Changes**: Clearly mark breaking changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ant Design**: Comprehensive UI component library
- **Apollo GraphQL**: Client-side state management and caching
- **Next.js Team**: Excellent React framework and tooling
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript Team**: Type safety and developer experience
- **React Team**: Modern React patterns and hooks
- **Vercel**: Deployment platform and Next.js hosting

## 📞 Support

For support and questions:

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check the project documentation
- **Examples**: See the examples in the `/examples` directory

## 🗺️ Roadmap

### Planned Features

- [ ] **Unit Tests**: Comprehensive test coverage with Jest and React Testing Library
- [ ] **E2E Tests**: End-to-end testing with Playwright
- [ ] **Authentication**: User authentication and authorization
- [ ] **Real-time Updates**: WebSocket integration for live updates
- [ ] **Advanced Search**: Full-text search with Elasticsearch
- [ ] **Data Export**: Export patient data to CSV/PDF
- [ ] **Audit Logs**: Track all patient data changes
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Documentation**: Interactive API documentation
- [ ] **Performance Monitoring**: Real-time performance metrics

### Project Status

This is a **prototype/demo project** demonstrating advanced frontend development skills. The project includes:

- **Core Features**: Patient list management, search, filtering, and pagination
- **Advanced Features**: Cursor-based pagination, comprehensive validation, error handling
- **Performance**: Optimized React components with memoization and efficient state management
- **Type Safety**: Full TypeScript implementation with strict type checking
- **UI/UX**: Responsive design with Ant Design and Tailwind CSS
- **Architecture**: Clean component structure with reusable UI components

> **Note**: This is a demonstration project and not a production-ready application. It showcases modern React development practices and patterns.
