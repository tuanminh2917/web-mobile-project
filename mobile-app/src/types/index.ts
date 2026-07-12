// =============================================
// TYPESCRIPT INTERFACES — Cinema Mobile App
// =============================================

export interface Movie {
  MovieID: number;
  Title: string;
  Genre: string;
  Duration: number;
  ReleaseDate: string;
  Status: 'On Going' | 'Up Coming' | 'Stoped';
  PosterURL?: string;
  Description?: string;
  Director?: string;
  Actor?: string;
  Languages?: string;
  Censorship?: string;
}

export interface Screening {
  ScreeningID: number;
  MovieID: number;
  MovieTitle: string;
  RoomName: string;
  StartTime: string;       // ISO string
  BasePrice: number;
  Genre?: string;
  Duration?: number;
  PosterURL?: string;
  SeatType?: string;
  MovieStatus?: 'On Going' | 'Up Coming' | 'Stoped';
}

// Suất chiếu nhóm theo phòng (dùng cho movie-detail)
export interface ScreeningByRoom {
  [roomName: string]: Screening[];
}

export type SeatType = 'regular' | 'vip' | 'couple';

export interface SeatInfo {
  row: string;
  number: number;
  type: SeatType;
  price: number;
}

export interface OccupiedSeat {
  row: string;
  number: number;
}

export interface SeatMapConfig {
  rows: number;
  seatsPerRow: number;
  occupiedSeats: OccupiedSeat[];
  seatTypes?: Record<string, SeatType>; // key: "A-1"
  regularPrice: number;
  vipPrice: number;
  couplePrice: number;
  maxSelectable?: number;
}

export interface Booking {
  BookingID: number;
  MovieTitle: string;
  PosterURL?: string;
  RoomName: string;
  StartTime: string;
  Seats: string;           // "A1, A2, B3"
  TotalPrice: number;
  Status: 'Paid' | 'Pending' | 'Cancelled';
}

export interface Comment {
  CommentID?: number;
  MovieID: number;
  Username: string;
  FullName?: string;
  Rating: number;          // 1-5
  Content: string;
  CreatedAt: string;
}

export interface User {
  UserID: number;
  Username: string;
  FullName?: string;
  Email?: string;
  Role: 'User' | 'Admin' | 'Client';
  token: string;
}

// Params cho booking confirmation
export interface BookingConfirmParams {
  bookingID: number;
  screeningID: number;
  movie: Pick<Movie, 'Title' | 'PosterURL'>;
  roomName: string;
  startTime: string;
  seats: SeatInfo[];
  total: number;
}
