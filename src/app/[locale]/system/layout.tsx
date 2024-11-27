import AuthGuard from '~/components/guards/auth.guard';
import Container from '~/components/common/Container';
import Header from '~/components/layouts/header/Header';
import GlobalLoading from '~/components/layouts/loading/GlobalLoading';
import { ScrollArea } from '~/components/ui/scroll-area';
import SideBar from '~/components/layouts/sidebar/SideBar';

interface SystemLayoutProps {
  children: React.ReactNode;
}

export default function SystemLayout({ children }: SystemLayoutProps) {
  return (
    <>
      <GlobalLoading />
      <AuthGuard>
        <main className="z-0 flex max-h-screen flex-col overflow-hidden">
          <Header className="max-h-header" />
          <section className="flex h-exclude-header flex-grow overflow-hidden">
            <SideBar />
            <ScrollArea className="h-full flex-1">
              <Container>{children}</Container>
            </ScrollArea>
          </section>
        </main>
      </AuthGuard>
    </>
  );
}
