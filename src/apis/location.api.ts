import { axiosPrivateInstance } from './instances/axios.instance';

const LocationEndpoint = {
  vnProvinces: '/addresses/provinces/vn',
};

export type IVnLocationUnit = {
  code: string;
  name: string;
  nameEn: string;
};

export type VnWard = IVnLocationUnit;

export type VnDistrict = IVnLocationUnit & {
  wards: VnWard[];
};

export type VnProvince = IVnLocationUnit & {
  districts: VnDistrict[];
};

export type IVnLocation = VnProvince;

export const LocationApi = {
  async getVnProvinces() {
    return await axiosPrivateInstance.get<IVnLocation[]>(LocationEndpoint.vnProvinces);
  },
};
