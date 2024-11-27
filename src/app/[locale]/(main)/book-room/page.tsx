import AuthGuard from '~/components/guards/auth.guard';
import BookRoom from '~/components/layouts/booking/BookRoom';

interface BookRoomPageProps {}

export default function BookRoomPage({}: BookRoomPageProps) {
  return (
    <AuthGuard>
      <BookRoom />
    </AuthGuard>
  );
}
