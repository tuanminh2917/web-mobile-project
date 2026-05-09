-- Dữ liệu Movie
INSERT INTO Movie VALUES 
(1, N'Lật Mặt 7', N'Một bộ phim về tình cảm gia đình...', N'Tâm lý', N'Lý Hải', N'Quách Ngọc Tuyên, Trương Minh Cường', N'Tiếng Việt', 'K', 120, '2024-04-26', 'latmat7.jpg', 'On Going'),
(2, N'Avengers: Endgame', N'Trận chiến cuối cùng...', N'Hành động', N'Anthony Russo', N'Robert Downey Jr., Chris Evans', N'Phụ đề Tiếng Việt', 'T13', 181, '2019-04-26', 'avengers.jpg', 'Stoped');

-- Dữ liệu Room
INSERT INTO Room VALUES 
(1, N'Phòng 01 (IMAX)', 'Large'),
(2, N'Phòng 02', 'Small');

-- Dữ liệu Seat
INSERT INTO Seat VALUES 
(1, 'A', 1, 'Regular'),
(1, 'H', 10, 'VIP'),
(2, 'E', 1, 'Couple Seat');

-- Dữ liệu Screening
INSERT INTO Screening VALUES 
(101, 1, 1, '2024-05-20 18:00:00', '2024-05-20 20:00:00', 90000),
(102, 2, 2, '2024-05-20 20:30:00', '2024-05-20 23:30:00', 70000);

-- Dữ liệu User
INSERT INTO [User] VALUES 
(1, N'Nguyễn Văn A', '1995-01-01', 'vana@gmail.com', '0912345678', 'admin01', 'hashed_pass_123', 'Admin'),
(2, N'Trần Thị B', '2000-05-15', 'thib@gmail.com', '0987654321', 'client01', 'hashed_pass_456', 'Client');

-- Dữ liệu Booking & Ticket
INSERT INTO Booking (BookingID, UserID, ScreeningID, Status) VALUES (501, 2, 101, 'Paid');
INSERT INTO Ticket VALUES (9001, 501, 1, 'H', 10, 110000);

-- Dữ liệu Comment
INSERT INTO Comment (MovieID, UserID, Content, Rating) VALUES (1, 2, N'Phim rất cảm động!', 5);

-- Dữ liệu Stats
INSERT INTO SystemStats (StatID, ViewCount) VALUES (1, 15000);