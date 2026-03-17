import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FREE_TRIAL_DAYS } from '@/domain/services/PaymentsService.port';
import SideNav, {
  NavBar as SideNavNavBar,
  ToggleButton as SideNavToggle,
} from '../_ui/SideNav';
import { getLoggedInUser } from '@/app/_features/user/actions';
import { UserDTO } from '@/application-layer/dtos/UserDTO';

export const metadata: Metadata = {
  title: 'Cimientos',
};

export default async function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  if (pathname !== '/app/subscription') {
    const user = await getLoggedInUser();

    if (!hasValidSubscription(user)) {
      redirect('/app/subscription');
    }
  }

  return (
    <div
      id="sidebar-layout"
      className="grid grid-cols-[12rem_1fr] h-screen gap-4 max-bp-navbar-mobile:flex max-bp-navbar-mobile:flex-col"
    >
      <aside className="max-bp-navbar-mobile:absolute">
        <SideNav>
          <SideNavNavBar />
          <SideNavToggle className="fixed top-2 right-4" />
        </SideNav>
      </aside>
      <main className="h-full overflow-y-auto">{children}</main>
    </div>
  );
}

function hasValidSubscription(user: UserDTO | null): boolean {
  if (!user) return false;

  const { subscriptionStatus, subscriptionEndsAt, createdAt } = user;

  if (subscriptionStatus === 'active' || subscriptionStatus === 'free') {
    return true;
  }

  if (subscriptionStatus === 'free_trial') {
    const trialEnd = new Date(createdAt);
    trialEnd.setDate(trialEnd.getDate() + FREE_TRIAL_DAYS);
    return trialEnd > new Date();
  }

  if (subscriptionStatus === 'canceled') {
    return !!subscriptionEndsAt && new Date(subscriptionEndsAt) > new Date();
  }

  return false;
}
