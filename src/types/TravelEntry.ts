export interface TravelEntry {
  id: string;
  caption: string;
  images: string[];
  isLiked: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  } | string;
  datePosted?: string;
  likeCount: number;
}

export const formatPostDate = (dateString: string) => {
  const postDate = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return postDate.toLocaleDateString(undefined, options);
}; 