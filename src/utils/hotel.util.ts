import { areIntervalsOverlapping } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { HotelOverview, RoomSchema } from '~/apis/hotel.api';
import { HotelFilterSchema } from '~/components/layouts/hotels/Filters/HotelFilterModal';
import { HotelSearchBarSchema } from '~/components/layouts/hotels/Filters/SearchBar/HotelSearchBar';
import { normalizeString } from './common.util';
import { DateUtils } from './date.util';

export function getAvailableRooms(rooms: RoomSchema[], filteredTimeRange: DateRange | undefined, guestCount?: number) {
  let result: RoomSchema[] = rooms;

  if (filteredTimeRange && filteredTimeRange.from && filteredTimeRange.to) {
    const filteredStart = filteredTimeRange.from;
    const filteredEnd = filteredTimeRange.to;

    result = rooms.filter((room) => {
      return !room.occupiedTimes.some(([occupiedStart, occupiedEnd]) => {
        return areIntervalsOverlapping(
          { start: occupiedStart, end: occupiedEnd },
          { start: filteredStart, end: filteredEnd },
          { inclusive: true }, // NOTE: to ensure overlapping even adjacent intervals: [21/02, 22/02] and [22/02, 23/02] -> true, because check in & check out time not in 00:00
        );
      });
    });
  }

  if (guestCount) {
    result = result.filter((room) => room.guestCount >= guestCount);
  }

  return result;
}

export function isMatchLocation(filterLocation: string, input: string) {
  const normalizedFilterLocation = normalizeString(filterLocation);
  const normalizedInput = normalizeString(input);
  // console.log('data :>> ', {
  //   normalizedFilterLocation,
  //   normalizedInput,
  // });
  return normalizedInput.includes(normalizedFilterLocation) || normalizedFilterLocation.includes(normalizedInput);
}

export function getFilteredHotels(
  originHotels: HotelOverview[],
  filters: HotelFilterSchema,
  searchBar: HotelSearchBarSchema,
) {
  const result: HotelOverview[] = [];
  if (!originHotels) {
    console.error('originHotels is null or undefined');
    return; // Hoặc có thể xử lý theo cách khác
  }
  for (const hotel of originHotels) {
    // Filter Params
    // if (!hotel.overview.rooms.minPrice) continue;
    // if (
    //   hotel.overview.rooms.minPrice < filters.priceRange[0] ||
    //   hotel.overview.rooms.minPrice > filters.priceRange[1]
    // ) {
    //   continue;
    // }

    // if (hotel.overview.reviews.average < filters.rating) continue;

    if (filters.gym && !hotel.gym) continue;
    if (filters.bar && !hotel.bar) continue;
    if (filters.restaurant && !hotel.restaurant) continue;
    if (filters.freeParking && !hotel.freeParking) continue;
    if (filters.movieNight && !hotel.movieNight) continue;
    if (filters.coffeeShop && !hotel.coffeeShop) continue;
    if (filters.spa && !hotel.spa) continue;
    if (filters.laundry && !hotel.laundry) continue;
    if (filters.shopping && !hotel.shopping) continue;
    if (filters.bikeRental && !hotel.bikeRental) continue;
    if (filters.swimmingPool && !hotel.swimmingPool) continue;
    if (filters.allowPets && !hotel.allowPets) continue;
    if (filters.allowSmoking && !hotel.allowSmoking) continue;

    // Search Bar Params
    if (searchBar.location && !isMatchLocation(searchBar.location, hotel.address.province)) continue;
    // const availableRooms = getAvailableRooms(hotel.rooms, searchBar.timeRange, searchBar.people.guest); // time & people
    // if (availableRooms.length === 0) continue;
    result.push(hotel);
  }
  return result;
}

export function getMergeRoomsWith(
  rooms: RoomSchema[],
  targetRoom: RoomSchema,
  queryTimeRange: { start: string; end: string },
) {
  const result: { room: RoomSchema; time: { start: string; end: string } }[] = [];

  const overlapOccupiedTimesWithQuery: { start: string; end: string }[] = [];
  targetRoom.occupiedTimes.forEach(([start, end]) => {
    const overlapRange = DateUtils.getOverlappingInterval(queryTimeRange, { start, end });
    if (overlapRange) {
      overlapOccupiedTimesWithQuery.push(overlapRange);
    }
  });
  const combinedOccupiedTimes = DateUtils.combineDateRanges(overlapOccupiedTimesWithQuery);

  // console.log({
  //   overlapOccupiedTimesWithQuery,
  //   combinedOccupiedTimes,
  // });

  if (combinedOccupiedTimes.length === 0) {
    result.push({ room: targetRoom, time: queryTimeRange });
    return result;
  }

  let canMerge = true;
  if (DateUtils.isBefore(queryTimeRange.start, DateUtils.getYesterdayOf(combinedOccupiedTimes[0].start))) {
    result.push({
      room: targetRoom,
      time: { start: queryTimeRange.start, end: DateUtils.getYesterdayOf(combinedOccupiedTimes[0].start) },
    });
  }

  for (const timeRange of combinedOccupiedTimes) {
    const availableRoomForTimeRange = rooms.find((room) =>
      room.occupiedTimes.every(([start, end]) => {
        return !areIntervalsOverlapping(
          { start, end },
          { start: timeRange.start, end: timeRange.end },
          { inclusive: true },
        );
      }),
    );

    if (!availableRoomForTimeRange) {
      canMerge = false;
      break;
    }
    result.push({ room: availableRoomForTimeRange, time: timeRange });
  }
  if (canMerge) {
    if (DateUtils.isAfter(queryTimeRange.end, combinedOccupiedTimes[combinedOccupiedTimes.length - 1].end)) {
      result.push({
        room: targetRoom,
        time: {
          start: DateUtils.getTomorrowOf(combinedOccupiedTimes[combinedOccupiedTimes.length - 1].end),
          end: queryTimeRange.end,
        },
      });
    }
    return result;
  }
  return [];
}
