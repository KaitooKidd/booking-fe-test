import { getCookie } from 'cookies-next';

export function getVNCities(): { code: string; name: string }[] {
  const locale = getCookie('NEXT_LOCALE')! as 'en' | 'vn';

  return VN_CITIES.map((city) => ({
    code: city.code,
    name: locale === 'en' ? city.en_name : city.name,
  }));
}

export const VN_CITIES = [
  {
    code: '01',
    name: 'Hà Nội',
    en_name: 'Ha Noi',
  },
  {
    code: '02',
    name: 'Hà Giang',
    en_name: 'Ha Giang',
  },
  {
    code: '04',
    name: 'Cao Bằng',
    en_name: 'Cao Bang',
  },
  {
    code: '06',
    name: 'Bắc Kạn',
    en_name: 'Bac Kan',
  },
  {
    code: '08',
    name: 'Tuyên Quang',
    en_name: 'Tuyen Quang',
  },
  {
    code: '10',
    name: 'Lào Cai',
    en_name: 'Lao Cai',
  },
  {
    code: '11',
    name: 'Điện Biên',
    en_name: 'Dien Bien',
  },
  {
    code: '12',
    name: 'Lai Châu',
    en_name: 'Lai Chau',
  },
  {
    code: '14',
    name: 'Sơn La',
    en_name: 'Son La',
  },
  {
    code: '15',
    name: 'Yên Bái',
    en_name: 'Yen Bai',
  },
  {
    code: '17',
    name: 'Hoà Bình',
    en_name: 'Hoa Binh',
  },
  {
    code: '19',
    name: 'Thái Nguyên',
    en_name: 'Thai Nguyen',
  },
  {
    code: '20',
    name: 'Lạng Sơn',
    en_name: 'Lang Son',
  },
  {
    code: '22',
    name: 'Quảng Ninh',
    en_name: 'Quang Ninh',
  },
  {
    code: '24',
    name: 'Bắc Giang',
    en_name: 'Bac Giang',
  },
  {
    code: '25',
    name: 'Phú Thọ',
    en_name: 'Phu Tho',
  },
  {
    code: '26',
    name: 'Vĩnh Phúc',
    en_name: 'Vinh Phuc',
  },
  {
    code: '27',
    name: 'Bắc Ninh',
    en_name: 'Bac Ninh',
  },
  {
    code: '30',
    name: 'Hải Dương',
    en_name: 'Hai Duong',
  },
  {
    code: '31',
    name: 'Hải Phòng',
    en_name: 'Hai Phong',
  },
  {
    code: '33',
    name: 'Hưng Yên',
    en_name: 'Hung Yen',
  },
  {
    code: '34',
    name: 'Thái Bình',
    en_name: 'Thai Binh',
  },
  {
    code: '35',
    name: 'Hà Nam',
    en_name: 'Ha Nam',
  },
  {
    code: '36',
    name: 'Nam Định',
    en_name: 'Nam Dinh',
  },
  {
    code: '37',
    name: 'Ninh Bình',
    en_name: 'Ninh Binh',
  },
  {
    code: '38',
    name: 'Thanh Hóa',
    en_name: 'Thanh Hoa',
  },
  {
    code: '40',
    name: 'Nghệ An',
    en_name: 'Nghe An',
  },
  {
    code: '42',
    name: 'Hà Tĩnh',
    en_name: 'Ha Tinh',
  },
  {
    code: '44',
    name: 'Quảng Bình',
    en_name: 'Quang Binh',
  },
  {
    code: '45',
    name: 'Quảng Trị',
    en_name: 'Quang Tri',
  },
  {
    code: '46',
    name: 'Thừa Thiên Huế',
    en_name: 'Thua Thien Hue',
  },
  {
    code: '48',
    name: 'Đà Nẵng',
    en_name: 'Da Nang',
  },
  {
    code: '49',
    name: 'Quảng Nam',
    en_name: 'Quang Nam',
  },
  {
    code: '51',
    name: 'Quảng Ngãi',
    en_name: 'Quang Ngai',
  },
  {
    code: '52',
    name: 'Bình Định',
    en_name: 'Binh Dinh',
  },
  {
    code: '54',
    name: 'Phú Yên',
    en_name: 'Phu Yen',
  },
  {
    code: '56',
    name: 'Khánh Hòa',
    en_name: 'Khanh Hoa',
  },
  {
    code: '58',
    name: 'Ninh Thuận',
    en_name: 'Ninh Thuan',
  },
  {
    code: '60',
    name: 'Bình Thuận',
    en_name: 'Binh Thuan',
  },
  {
    code: '62',
    name: 'Kon Tum',
    en_name: 'Kon Tum',
  },
  {
    code: '64',
    name: 'Gia Lai',
    en_name: 'Gia Lai',
  },
  {
    code: '66',
    name: 'Đắk Lắk',
    en_name: 'Dak Lak',
  },
  {
    code: '67',
    name: 'Đắk Nông',
    en_name: 'Dak Nong',
  },
  {
    code: '68',
    name: 'Lâm Đồng',
    en_name: 'Lam Dong',
  },
  {
    code: '70',
    name: 'Bình Phước',
    en_name: 'Binh Phuoc',
  },
  {
    code: '72',
    name: 'Tây Ninh',
    en_name: 'Tay Ninh',
  },
  {
    code: '74',
    name: 'Bình Dương',
    en_name: 'Binh Duong',
  },
  {
    code: '75',
    name: 'Đồng Nai',
    en_name: 'Dong Nai',
  },
  {
    code: '77',
    name: 'Bà Rịa - Vũng Tàu',
    en_name: 'Ba Ria - Vung Tau',
  },
  {
    code: '79',
    name: 'Hồ Chí Minh',
    en_name: 'Ho Chi Minh',
  },
  {
    code: '80',
    name: 'Long An',
    en_name: 'Long An',
  },
  {
    code: '82',
    name: 'Tiền Giang',
    en_name: 'Tien Giang',
  },
  {
    code: '83',
    name: 'Bến Tre',
    en_name: 'Ben Tre',
  },
  {
    code: '84',
    name: 'Trà Vinh',
    en_name: 'Tra Vinh',
  },
  {
    code: '86',
    name: 'Vĩnh Long',
    en_name: 'Vinh Long',
  },
  {
    code: '87',
    name: 'Đồng Tháp',
    en_name: 'Dong Thap',
  },
  {
    code: '89',
    name: 'An Giang',
    en_name: 'An Giang',
  },
  {
    code: '91',
    name: 'Kiên Giang',
    en_name: 'Kien Giang',
  },
  {
    code: '92',
    name: 'Cần Thơ',
    en_name: 'Can Tho',
  },
  {
    code: '93',
    name: 'Hậu Giang',
    en_name: 'Hau Giang',
  },
  {
    code: '94',
    name: 'Sóc Trăng',
    en_name: 'Soc Trang',
  },
  {
    code: '95',
    name: 'Bạc Liêu',
    en_name: 'Bac Lieu',
  },
  {
    code: '96',
    name: 'Cà Mau',
    en_name: 'Ca Mau',
  },
];
