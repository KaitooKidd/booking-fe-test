import { Rating } from '@mui/material';
import { format, formatDistance } from 'date-fns';
import { HeartHandshake, Landmark, LucideIcon, MapPinned, MessageCircle, SprayCan, Star, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { ReviewSchema } from '~/apis/review.api';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { ReviewOverview, getReviewAverageFormat, getReviewOverview } from '~/utils/review.util';

interface HotelDetailReviewsProps {
  reviews: ReviewSchema[];
}

const ratingList: Array<{ name: string; key: keyof ReviewOverview; icon: LucideIcon }> = [
  { name: 'staff', key: 'staffRating', icon: MessageCircle },
  { name: 'facility', key: 'facilityRating', icon: Landmark },
  { name: 'comfort', key: 'comfortRating', icon: HeartHandshake },
  { name: 'cleanliness', key: 'cleanlinessRating', icon: SprayCan },
  { name: 'valueForMoney', key: 'valueForMoneyRating', icon: Wallet },
  { name: 'location', key: 'locationRating', icon: MapPinned },
];

export default function HotelDetailReviews({ reviews }: HotelDetailReviewsProps) {
  /* TODO: average award - airbnb */
  /* TODO: Overview per service */
  const t = useTranslations('Review.form');

  const overview = getReviewOverview(reviews);

  return (
    <>
      {/* Award */}
      {overview.averageRating > 4 && (
        <div className="flex items-center justify-center gap-1">
          <Image src="/images/award-left.png" alt="awardLeft" width={80} height={100} />
          <span className="text-[90px] font-semibold">{getReviewAverageFormat(overview.averageRating)}</span>
          <Image src="/images/award-right.png" alt="awardRight" width={80} height={100} />
        </div>
      )}

      {/* Overview */}
      <div className="container flex w-full snap-x snap-mandatory gap-4 divide-x overflow-x-auto border-b pb-8">
        {ratingList.map((item) => (
          <div key={item.key} className="flex flex-1 snap-start flex-col items-start gap-4 p-4 text-sm font-medium">
            <p>{t(item.name)}</p>
            <div className="flex items-center">
              {overview[item.key].toFixed(1)} <Star className="ml-2 size-4 fill-primary" />
            </div>
            <item.icon className="size-10" />
          </div>
        ))}
      </div>

      {/* Review List */}
      <div className="mt-2 grid max-h-[350px] grid-cols-1 gap-x-10 gap-y-8 overflow-y-auto md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="space-y-3 rounded-md border border-transparent p-2 hover:border-primary/5 hover:shadow-lg"
          >
            {/* Customer */}
            <div className="flex gap-2">
              <Avatar>
                <AvatarImage src={review.customerImage ?? undefined} alt="customer" />
                <AvatarFallback>{review.customerName}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{review.customerName}</span>
                <p className="text-sm">
                  <span className="font-medium">{formatDistance(review.createdAt, new Date())}</span> -{' '}
                  <span className="italic">{format(review.createdAt, 'yyyy-MM-dd')}</span>
                </p>
              </div>
            </div>
            {/* Reviews */}
            <div className="space-y-2">
              <p className="flex size-4 items-center">
                <Rating value={review.total} precision={0.1} readOnly size="small" className="mr-1" />
                {review.total.toFixed(1)}
              </p>
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
