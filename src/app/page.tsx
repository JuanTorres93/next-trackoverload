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
        <div className="w-40 h-40 bg-primary"></div>
        <div className="w-40 h-40 bg-primary-light"></div>
        <div className="w-40 h-40 bg-primary-shade"></div>
        <div className="w-40 h-40 bg-text"></div>
        <div className="w-40 h-40 bg-success"></div>
        <div className="w-40 h-40 bg-error"></div>
      </main>
    </div>
  );
}
