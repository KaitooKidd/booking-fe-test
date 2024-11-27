import { ReviewSchema } from '~/apis/review.api';

export type ReviewOverview = {
  averageRating: number;
  totalReviews: number;
  staffRating: number;
  facilityRating: number;
  cleanlinessRating: number;
  comfortRating: number;
  valueForMoneyRating: number;
  locationRating: number;
  totalComments: number;
};

export function getReviewOverview(reviews: ReviewSchema[]): ReviewOverview {
  const totals = reviews.reduce(
    (acc, review) => ({
      totalRatings: acc.totalRatings + review.total,
      totalStaffRating: acc.totalStaffRating + review.staffRating,
      totalFacilityRating: acc.totalFacilityRating + review.facilityRating,
      totalCleanlinessRating: acc.totalCleanlinessRating + review.cleanlinessRating,
      totalComfortRating: acc.totalComfortRating + review.comfortRating,
      totalValueForMoneyRating: acc.totalValueForMoneyRating + review.valueForMoneyRating,
      totalLocationRating: acc.totalLocationRating + review.locationRating,
      totalComments: acc.totalComments + (review.comment ? 1 : 0),
    }),
    {
      totalRatings: 0,
      totalStaffRating: 0,
      totalFacilityRating: 0,
      totalCleanlinessRating: 0,
      totalComfortRating: 0,
      totalValueForMoneyRating: 0,
      totalLocationRating: 0,
      totalComments: 0,
    },
  );

  const totalReviews = reviews.length;
  const averageRating = totals.totalRatings / totalReviews;

  return {
    averageRating,
    totalReviews,
    staffRating: totals.totalStaffRating / totalReviews,
    facilityRating: totals.totalFacilityRating / totalReviews,
    cleanlinessRating: totals.totalCleanlinessRating / totalReviews,
    comfortRating: totals.totalComfortRating / totalReviews,
    valueForMoneyRating: totals.totalValueForMoneyRating / totalReviews,
    locationRating: totals.totalLocationRating / totalReviews,
    totalComments: totals.totalComments,
  };
}

export function getReviewAverageFormat(value: number): string {
  return value.toFixed(2).replace('.', ',');
}
