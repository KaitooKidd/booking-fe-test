import { GalleryItem } from '~/apis/hotel.api';
import Masonry, { MasonryProps } from 'react-masonry-css';
import { cn } from '~/utils/ui.util';

interface GalleryProps {
  data: GalleryItem[];
  breakpointCols?: MasonryProps['breakpointCols'];
  containerClassName?: string;
  columnClassName?: string;
  itemClassName?: string;
}

export default function Gallery({
  data,
  containerClassName,
  columnClassName,
  itemClassName,
  breakpointCols = { default: 6, 1536: 5, 1024: 4, 768: 3, 640: 1 }, // reserved with tailwindcss (here is max-width - 2xl, lg, md, sm)
}: GalleryProps) {
  // return (
  //   // Masonry Layout: top to bottom
  //   <div className="mx-auto columns-1 gap-4 space-y-4 p-5 sm:columns-2 md:columns-3 lg:columns-4">
  //     {data.map((item, index) => {
  //       return (
  //         <div key={index} className="break-inside-avoid">
  //           {/* <Image src={item.url} alt={hotel.name} className="h-auto max-w-full object-cover" /> */}
  //           <img src={item.url} alt={'image'} className={`h-auto data-[${index}] max-w-full rounded-lg`} />
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
  return (
    <Masonry
      breakpointCols={breakpointCols}
      className={cn('-ml-4 flex w-auto', containerClassName)}
      columnClassName={cn('pl-4 space-y-4', columnClassName)}
    >
      {data.map((item, index) => (
        <img key={index} src={item.url} alt={'image'} className={cn('h-auto w-full rounded-lg', itemClassName)} />
      ))}
    </Masonry>
  );
}
