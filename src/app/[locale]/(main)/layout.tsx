import Container from '~/components/common/Container';
import CustomerLayout from '~/components/common/CustomerLayout';
import Header from '~/components/layouts/header/Header';
import GlobalLoading from '~/components/layouts/loading/GlobalLoading';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <GlobalLoading />
      <main className="z-0 flex min-h-screen flex-col">
        <Header />
        <section className="flex-grow">
          <Container>
            <CustomerLayout>{children}</CustomerLayout>
          </Container>
        </section>
      </main>
    </>
  );
}

export default MainLayout;
