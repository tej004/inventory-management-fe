import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1.5rem',
      }}
    >
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#666' }}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        href="/manager/dashboard"
        style={{
          color: '#2563eb',
          textDecoration: 'underline',
          fontWeight: 500,
        }}
      >
        Go to Manager Dashboard
      </Link>
    </div>
  );
}
