import { create } from 'zustand';
import { HotelOverview } from '~/apis/hotel.api';
import { HotelFilterSchema } from '~/components/layouts/hotels/Filters/HotelFilterModal';
import { HotelSearchBarSchema } from '~/components/layouts/hotels/Filters/SearchBar/HotelSearchBar';
import { getFilteredHotels } from '~/utils/hotel.util';

type HotelFilterHookSchema = {
  filters: HotelFilterSchema;
  searchBar: HotelSearchBarSchema;
  hotels: HotelOverview[];
  filteredHotels: HotelOverview[];
  setHotels: (value: HotelOverview[]) => void;
  setFilters: (value: HotelFilterSchema) => void;
  setSearchBar: (value: HotelSearchBarSchema) => void;
  resetFilters: (onReset?: (value: HotelFilterSchema) => void) => void;
  resetSearchBar: (onReset?: (value: HotelSearchBarSchema) => void) => void;
};

const defaultFilterValue: HotelFilterSchema = {
  priceRange: [0, 20000000],
  rating: 0,
  gym: false,
  bar: false,
  restaurant: false,
  freeParking: false,
  movieNight: false,
  coffeeShop: false,
  spa: false,
  laundry: false,
  shopping: false,
  bikeRental: false,
  swimmingPool: false,
  allowPets: false,
  allowSmoking: false,
};

const defaultSearchBarValue: HotelSearchBarSchema = {
  location: undefined,
  timeRange: undefined,
  people: { guest: 0 },
};

const useHotelFilters = create<HotelFilterHookSchema>((set) => ({
  filters: defaultFilterValue,
  searchBar: defaultSearchBarValue,
  hotels: [],
  filteredHotels: [],

  setHotels: (value: HotelOverview[]) => {
    set((state) => ({
      hotels: value,
      filteredHotels: getFilteredHotels(value, state.filters, state.searchBar),
    }));
  },

  setFilters: (value: HotelFilterSchema) => {
    set((state) => ({ filters: value, filteredHotels: getFilteredHotels(state.hotels, value, state.searchBar) }));
  },

  setSearchBar: (value: HotelSearchBarSchema) => {
    set((state) => ({
      searchBar: value,
      filteredHotels: getFilteredHotels(state.hotels, state.filters, value),
    }));
  },

  resetFilters: (onReset) => {
    set((state) => ({
      filters: defaultFilterValue,
      filteredHotels: getFilteredHotels(state.hotels, defaultFilterValue, state.searchBar),
    }));
    onReset && onReset(defaultFilterValue);
  },

  resetSearchBar: (onReset) => {
    set((state) => ({
      searchBar: defaultSearchBarValue,
      filteredHotels: getFilteredHotels(state.hotels, state.filters, defaultSearchBarValue),
    }));
    onReset && onReset(defaultSearchBarValue);
  },
}));

export default useHotelFilters;
