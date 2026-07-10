// =============================================
// API SERVICE — mock data + fetch patterns
// Dùng pattern từ slide 11. Networking
// =============================================

import {
  Movie,
  Screening,
  ScreeningByRoom,
  Comment,
  User,
  Booking,
  SeatInfo,
  OccupiedSeat,
  SeatMapConfig,
} from '@/types';

// Đổi thành URL thực khi có backend
const BASE_URL = 'http://localhost:3001';

// =============================================
// MOCK DATA — giống fallback data của web
// =============================================

const MOCK_MOVIES: Movie[] = [
  {
    MovieID: 1,
    Title: 'LEVITICUS: BÓNG QUỶ',
    Genre: 'Kinh dị',
    Duration: 112,
    ReleaseDate: '2026-06-20',
    Status: 'On Going',
    PosterURL: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    Description: 'Một câu chuyện kinh dị siêu nhiên về bóng tối ẩn náu trong vùng đất hoang vu. Các nhà nghiên cứu trẻ phải đối mặt với thực thể cổ đại đã ngủ yên hàng thế kỷ.',
    Director: 'James Wan',
    Actor: 'Patrick Wilson, Vera Farmiga',
    Languages: 'Tiếng Anh (phụ đề Tiếng Việt)',
    Censorship: 'T18',
  },
  {
    MovieID: 2,
    Title: 'LẬT MẶT 7: VỪA LÀM VỪA THƯƠNG',
    Genre: 'Tâm lý, Hài',
    Duration: 121,
    ReleaseDate: '2026-04-26',
    Status: 'On Going',
    PosterURL: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    Description: 'Câu chuyện về tình thân gia đình, những hiểu lầm và yêu thương qua lăng kính hài hước đặc trưng của điện ảnh Việt Nam.',
    Director: 'Lý Hải',
    Actor: 'Lý Hải, Minh Hà, Quốc Hùng',
    Languages: 'Tiếng Việt',
    Censorship: 'P',
  },
  {
    MovieID: 3,
    Title: 'AVENGERS: ENDGAME',
    Genre: 'Hành động, Khoa học viễn tưởng',
    Duration: 181,
    ReleaseDate: '2019-04-26',
    Status: 'On Going',
    PosterURL: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    Description: 'Những anh hùng còn sống sót sau thảm họa của Thanos tập hợp lại lần cuối để đảo ngược hậu quả và khôi phục sự cân bằng vũ trụ.',
    Director: 'Anthony Russo, Joe Russo',
    Actor: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
    Languages: 'Tiếng Anh (phụ đề Tiếng Việt)',
    Censorship: 'T13',
  },
  {
    MovieID: 4,
    Title: 'THE CONJURING: XÁC ƯỚP',
    Genre: 'Kinh dị',
    Duration: 120,
    ReleaseDate: '2026-05-10',
    Status: 'On Going',
    PosterURL: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    Description: 'Ed và Lorraine Warren điều tra vụ ám ảnh kỳ bí tại một ngôi nhà cổ, nơi một xác ướp Ai Cập được tìm thấy.',
    Director: 'Michael Chaves',
    Actor: 'Patrick Wilson, Vera Farmiga',
    Languages: 'Tiếng Anh (phụ đề Tiếng Việt)',
    Censorship: 'T18',
  },
  {
    MovieID: 5,
    Title: 'DUNE: PHẦN HAI',
    Genre: 'Khoa học viễn tưởng, Phiêu lưu',
    Duration: 166,
    ReleaseDate: '2026-08-15',
    Status: 'Up Coming',
    PosterURL: 'https://image.tmdb.org/t/p/w500/d5NXSklpcvkmXLv4eTUFi43j1sa.jpg',
    Description: 'Paul Atreides tiếp tục hành trình của mình giữa người Fremen, chuẩn bị cho cuộc chiến hủy diệt chống lại những kẻ đã hủy hoại gia đình mình.',
    Director: 'Denis Villeneuve',
    Actor: 'Timothée Chalamet, Zendaya',
    Languages: 'Tiếng Anh (phụ đề Tiếng Việt)',
    Censorship: 'T13',
  },
  {
    MovieID: 6,
    Title: 'MAI',
    Genre: 'Tâm lý, Lãng mạn',
    Duration: 130,
    ReleaseDate: '2026-09-01',
    Status: 'Up Coming',
    PosterURL: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
    Description: 'Câu chuyện tình yêu sâu sắc và cảm động về hai con người từ hai thế giới khác nhau tìm thấy nhau giữa cuộc đời đầy biến động.',
    Director: 'Trấn Thành',
    Actor: 'Phương Anh Đào, Tuấn Trần',
    Languages: 'Tiếng Việt',
    Censorship: 'T13',
  },
];

const MOCK_SCREENINGS: Screening[] = [
  {
    ScreeningID: 1, MovieID: 1, MovieTitle: 'LEVITICUS: BÓNG QUỶ', RoomName: 'Phòng 1 (Phòng lớn)',
    StartTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    BasePrice: 80000, Genre: 'Kinh dị', Duration: 112,
    PosterURL: MOCK_MOVIES[0].PosterURL, SeatType: '2D', MovieStatus: 'On Going',
  },
  {
    ScreeningID: 2, MovieID: 1, MovieTitle: 'LEVITICUS: BÓNG QUỶ', RoomName: 'Phòng 1 (Phòng lớn)',
    StartTime: new Date(Date.now() + 5 * 3600000).toISOString(),
    BasePrice: 90000, Genre: 'Kinh dị', Duration: 112,
    PosterURL: MOCK_MOVIES[0].PosterURL, SeatType: '3D', MovieStatus: 'On Going',
  },
  {
    ScreeningID: 3, MovieID: 2, MovieTitle: 'LẬT MẶT 7', RoomName: 'Phòng 2 (Phòng lớn)',
    StartTime: new Date(Date.now() + 1 * 3600000).toISOString(),
    BasePrice: 75000, Genre: 'Tâm lý', Duration: 121,
    PosterURL: MOCK_MOVIES[1].PosterURL, SeatType: '2D', MovieStatus: 'On Going',
  },
  {
    ScreeningID: 4, MovieID: 2, MovieTitle: 'LẬT MẶT 7', RoomName: 'Phòng 2 (Phòng lớn)',
    StartTime: new Date(Date.now() + 6 * 3600000).toISOString(),
    BasePrice: 75000, Genre: 'Tâm lý', Duration: 121,
    PosterURL: MOCK_MOVIES[1].PosterURL, SeatType: '2D', MovieStatus: 'On Going',
  },
  {
    ScreeningID: 5, MovieID: 3, MovieTitle: 'AVENGERS: ENDGAME', RoomName: 'Phòng 3 (Phòng nhỏ)',
    StartTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    BasePrice: 100000, Genre: 'Hành động', Duration: 181,
    PosterURL: MOCK_MOVIES[2].PosterURL, SeatType: 'IMAX', MovieStatus: 'On Going',
  },
  {
    ScreeningID: 6, MovieID: 4, MovieTitle: 'THE CONJURING: XÁC ƯỚP', RoomName: 'Phòng 4 (Phòng nhỏ)',
    StartTime: new Date(Date.now() + 4 * 3600000).toISOString(),
    BasePrice: 80000, Genre: 'Kinh dị', Duration: 120,
    PosterURL: MOCK_MOVIES[3].PosterURL, SeatType: '2D', MovieStatus: 'On Going',
  },
];

const MOCK_COMMENTS: Record<number, Comment[]> = {};

const MOCK_OCCUPIED_SEATS: Record<number, OccupiedSeat[]> = {
  1: [
    { row: 'A', number: 1 }, { row: 'A', number: 2 },
    { row: 'B', number: 5 }, { row: 'B', number: 6 }
  ],
  2: [
    { row: 'C', number: 3 }, { row: 'D', number: 8 },
    { row: 'E', number: 7 }, { row: 'F', number: 11 }
  ]
};

let MOCK_BOOKINGS: Booking[] = [];

// =============================================
// API FUNCTIONS — pattern từ slide Networking
// =============================================

async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data as T;
  } catch {
    // Dùng mock data khi không có backend
    return fallback;
  }
}

export const api = {
  // --- MOVIES ---
  getMovies: async (): Promise<Movie[]> => {
    return fetchWithFallback(`${BASE_URL}/api/movies`, MOCK_MOVIES);
  },

  getNowShowing: async (): Promise<Movie[]> => {
    return fetchWithFallback(
      `${BASE_URL}/api/movies?status=On Going`,
      MOCK_MOVIES.filter(m => m.Status === 'On Going'),
    );
  },

  getComingSoon: async (): Promise<Movie[]> => {
    return fetchWithFallback(
      `${BASE_URL}/api/movies?status=Up Coming`,
      MOCK_MOVIES.filter(m => m.Status === 'Up Coming'),
    );
  },

  getMovieById: async (id: number): Promise<Movie | null> => {
    return fetchWithFallback(
      `${BASE_URL}/api/movies/${id}`,
      MOCK_MOVIES.find(m => m.MovieID === id) ?? null,
    );
  },

  // --- SCREENINGS ---
  getScreenings: async (): Promise<Screening[]> => {
    return fetchWithFallback(`${BASE_URL}/api/screenings`, MOCK_SCREENINGS);
  },

  getScreeningsByMovie: async (movieId: number): Promise<ScreeningByRoom> => {
    const list = await fetchWithFallback(
      `${BASE_URL}/api/screenings?movieId=${movieId}`,
      MOCK_SCREENINGS.filter(s => s.MovieID === movieId),
    );
    // Nhóm theo phòng
    return list.reduce<ScreeningByRoom>((acc, s) => {
      if (!acc[s.RoomName]) acc[s.RoomName] = [];
      acc[s.RoomName].push(s);
      return acc;
    }, {});
  },

  getScreeningById: async (id: number): Promise<Screening | null> => {
    return fetchWithFallback(
      `${BASE_URL}/api/screenings/${id}`,
      MOCK_SCREENINGS.find(s => s.ScreeningID === id) ?? null,
    );
  },

  // --- SEAT MAP ---
  getSeatMap: async (screeningId: number): Promise<SeatMapConfig> => {
    return fetchWithFallback(`${BASE_URL}/api/screenings/${screeningId}/seats`, {
      rows: 10,
      seatsPerRow: 12,
      occupiedSeats: MOCK_OCCUPIED_SEATS[screeningId] || [],
      seatTypes: {},
      regularPrice: 80000,
      vipPrice: 100000,
      couplePrice: 200000,
      maxSelectable: 8,
    });
  },

  // --- COMMENTS ---
  getComments: async (movieId: number): Promise<Comment[]> => {
    return fetchWithFallback(
      `${BASE_URL}/api/movies/${movieId}/comments`,
      MOCK_COMMENTS[movieId] ?? [],
    );
  },

  submitComment: async (movieId: number, rating: number, content: string, user: User): Promise<{success: boolean; comment: Comment}> => {
    const newComment: Comment = {
      CommentID: Math.floor(Math.random() * 900000),
      MovieID: movieId,
      Username: user.Username,
      FullName: user.FullName,
      Rating: rating,
      Content: content,
      CreatedAt: new Date().toISOString()
    };
    
    if (!MOCK_COMMENTS[movieId]) MOCK_COMMENTS[movieId] = [];
    MOCK_COMMENTS[movieId].unshift(newComment);
    
    return { success: true, comment: newComment };
  },

  // --- AUTH (POST, dùng pattern từ slide) ---
  register: async (username: string, password: string, fullName: string, email: string): Promise<{ success: boolean; token?: string; user?: User }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName, email }),
      });
      return await res.json();
    } catch {
      return {
        success: true,
        token: 'mock-jwt-token-new',
        user: {
          UserID: Math.floor(Math.random() * 10000),
          Username: username,
          FullName: fullName,
          Email: email,
          Role: 'User',
          token: 'mock-jwt-token-new',
        },
      };
    }
  },

  login: async (username: string, password: string): Promise<{ success: boolean; token?: string; user?: User }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return await res.json();
    } catch {
      // Mock login thành công
      if (username && password) {
        return {
          success: true,
          token: 'mock-jwt-token-12345',
          user: {
            UserID: 1,
            Username: username,
            FullName: 'Nguyễn Văn A',
            Email: `${username}@gmail.com`,
            Role: 'User',
            token: 'mock-jwt-token-12345',
          },
        };
      }
      return { success: false };
    }
  },

  // --- BOOKING ---
  confirmBooking: async (
    screeningId: number,
    seats: SeatInfo[],
    token: string,
  ): Promise<{ success: boolean; bookingID?: number }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/book/${screeningId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ seats }),
      });
      return await res.json();
    } catch {
      const bookingID = Math.floor(Math.random() * 900000) + 100000;
      
      // Đánh dấu ghế đã bán cho riêng suất chiếu này
      if (!MOCK_OCCUPIED_SEATS[screeningId]) MOCK_OCCUPIED_SEATS[screeningId] = [];
      seats.forEach(s => {
        MOCK_OCCUPIED_SEATS[screeningId].push({ row: s.row, number: s.number });
      });

      // Thêm vé vào danh sách vé của tôi
      const scr = MOCK_SCREENINGS.find(s => s.ScreeningID === screeningId);
      if (scr) {
        MOCK_BOOKINGS.unshift({
          BookingID: bookingID,
          MovieTitle: scr.MovieTitle + (scr.SeatType ? ` (${scr.SeatType})` : ''),
          PosterURL: scr.PosterURL,
          RoomName: scr.RoomName,
          StartTime: scr.StartTime,
          Seats: seats.map(s => `${s.row}${s.number}`).join(', '),
          TotalPrice: seats.reduce((sum, s) => sum + s.price, 0),
          Status: 'Paid',
        });
      }

      return { success: true, bookingID };
    }
  },

  getMyBookings: async (token: string): Promise<Booking[]> => {
    try {
      const res = await fetch(`${BASE_URL}/api/my-tickets`, {
        headers: { Authorization: token },
      });
      return await res.json();
    } catch {
      return MOCK_BOOKINGS;
    }
  },
};

// Helper: format tiền VND
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

// Helper: format ngày giờ VN
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}
