import { useEffect, useState } from 'react';
import { IVnLocation, LocationApi, VnDistrict, VnProvince } from '~/apis/location.api';

const useVnLocation = () => {
  const [data, setData] = useState<IVnLocation[]>([]);

  useEffect(() => {
    const fetchVnLocation = async () => {
      const { isSuccess, data, error } = await LocationApi.getVnProvinces();
      if (isSuccess) {
        setData(data);
      } else {
        throw new Error(error?.message);
      }
    };
    fetchVnLocation();
  }, []);

  const getVnLocationFieldName = (locale: 'en' | 'vn') => {
    return locale === 'en' ? 'nameEn' : 'name';
  };

  const getProvinces = () => data;

  // const getProvinceByCode = (provinceCode: string) => getProvinces().find((item) => item.code === provinceCode)!;

  // const getDistrictByCode = (provinceCode: string, districtCode: string) => {
  //   return getProvinceByCode(provinceCode).districts.find((item) => item.code === districtCode)!;
  // };

  // const getWardByCode = (provinceCode: string, districtCode: string, wardCode: string) => {
  //   return getDistrictByCode(provinceCode, districtCode).wards.find((item) => item.code === wardCode)!;
  // };

  const getProvinceByName = (provinces: VnProvince[], provinceName: string, locale: 'en' | 'vn') => {
    const field = getVnLocationFieldName(locale);
    return provinces.find((item) => item[field] === provinceName);
  };

  const getDistrictByName = (districts: VnDistrict[], districtName: string, locale: 'en' | 'vn') => {
    const field = getVnLocationFieldName(locale);
    return districts.find((item) => item[field] === districtName);
  };

  return {
    getProvinces,
    getDistrictByName,
    getProvinceByName,
    getVnLocationFieldName,
  };
};

export default useVnLocation;
