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
  SeatType,
} from '@/types';

// Đổi thành URL thực tế của backend trên máy ảo Android (10.0.2.2 trỏ về localhost của máy tính)
const BASE_URL = 'http://10.0.2.2:3000';

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

// (Đã xóa Mock Data thừa)

// Helper: lấy token từ user object, fallback tự tạo từ UserID nếu không có
function getToken(user: { token?: string; UserID: number }): string {
  return user.token || `dummy-token-${user.UserID}`;
}

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
    try {
      const res = await fetch(`${BASE_URL}/api/screenings/${screeningId}/seats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      // Fallback: phòng lớn 10 hàng (A-J), 10 ghế/hàng = 100 ghế
      const rows = 10;
      const seatsPerRow = 10;
      const seatTypes: Record<string, SeatType> = {};
      const rowLabels = 'ABCDEFGHIJ';
      for (let r = 0; r < rows; r++) {
        for (let s = 1; s <= seatsPerRow; s++) {
          let type: SeatType = 'regular';
          if (r >= 8) type = 'couple';       // I-J: couple
          else if (r >= 4) type = 'vip';     // E-H: VIP
          seatTypes[`${rowLabels[r]}-${s}`] = type;
        }
      }
      return {
        rows,
        seatsPerRow,
        occupiedSeats: [],
        seatTypes,
        regularPrice: 80000,
        vipPrice: Math.round(80000 * 1.3),
        couplePrice: 80000 * 2,
        maxSelectable: 8,
      };
    }
  },

  // --- COMMENTS ---
  getComments: async (movieId: number): Promise<Comment[]> => {
    try {
      const res = await fetch(`${BASE_URL}/api/movies/${movieId}/comments`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  submitComment: async (movieId: number, rating: number, content: string, user: User): Promise<{success: boolean; comment?: Comment}> => {
    try {
      const token = getToken(user);
      const res = await fetch(`${BASE_URL}/api/movies/${movieId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ content, rating }),
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  // --- CONTACT ---
  submitContact: async (senderName: string, senderEmail: string, subject: string, message: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, senderEmail, subject, message }),
      });
      return await res.json();
    } catch (e) {
      console.error('Lỗi khi gửi form liên hệ:', e);
      return { success: false, message: 'Không thể kết nối đến server.' };
    }
  },

  // --- AUTH (POST, dùng pattern từ slide) ---
  register: async (username: string, password: string, fullName: string, email: string): Promise<{ success: boolean; token?: string; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullname: fullName, email }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Server error' };
    }
  },

  login: async (username: string, password: string): Promise<{ success: boolean; token?: string; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Server error' };
    }
  },

  // --- BOOKING ---
  confirmBooking: async (screeningId: number, seats: SeatInfo[], token: string): Promise<{ success: boolean; bookingID?: number; error?: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/api/book/${screeningId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ seats }),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: 'Lỗi kết nối server' };
    }
  },

  getMyBookings: async (token: string): Promise<Booking[]> => {
    try {
      if (!token) return [];
      const res = await fetch(`${BASE_URL}/api/my-tickets`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      // Server trả array, nếu không phải array (ví dụ lỗi 401) thì trả []
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },
};

// Helper: format tiền VND
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ';
}

// Helper: Fix URL ảnh bị thiếu host (ví dụ /assets/movie1.jpg -> http://10.0.2.2:3000/assets/movie1.jpg)
export function getFullImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

// Helper: format ngày giờ VN (cố định múi giờ VN để tránh sai ngày trên emulator)
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
}

export function getVNDateString(iso: string): string {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-CA', { // en-CA format là YYYY-MM-DD
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(d);
  
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return `${year}-${month}-${day}`;
}
