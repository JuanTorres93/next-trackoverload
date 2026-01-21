import Link from 'next/link';

export const metadata = {
  title: 'Home',
  description: 'Home page',
};

export default function LandingPage() {
  return (
    <div className="">
      <main className="">
        Landing page
        <div>
          <Link href="/app" className="">
            Go to app
          </Link>
        </div>
      </main>
    </div>
  );
}
