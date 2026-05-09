-- Dữ liệu Movie
INSERT INTO Movie VALUES 
(1, N'Lật Mặt 7', N'Một bộ phim về tình cảm gia đình...', N'Tâm lý', N'Lý Hải', N'Quách Ngọc Tuyên, Trương Minh Cường', N'Tiếng Việt', 'K', 120, '2024-04-26', 'latmat7.jpg', 'On Going'),
(2, N'Avengers: Endgame', N'Trận chiến cuối cùng...', N'Hành động', N'Anthony Russo', N'Robert Downey Jr., Chris Evans', N'Phụ đề Tiếng Việt', 'T13', 181, '2019-04-26', 'avengers.jpg', 'Stoped');

-- Dữ liệu Room
-- Chèn 2 phòng lớn và 3 phòng nhỏ
INSERT INTO Room (RoomID, RoomName, RoomSize) VALUES 
(1, N'Phòng Lớn 01', 'Large'),
(2, N'Phòng Lớn 02', 'Large'),
(3, N'Phòng Nhỏ 03', 'Small'),
(4, N'Phòng Nhỏ 04', 'Small'),
(5, N'Phòng Nhỏ 05', 'Small');
GO

-- Dữ liệu Seat
DECLARE @r INT = 1;
WHILE @r <= 5
BEGIN
    DECLARE @maxRows INT = 10; -- Giả định mỗi phòng có 10 hàng (A-J)
    DECLARE @seatsPerRow INT = CASE WHEN @r <= 2 THEN 15 ELSE 10 END; -- Phòng 1,2: 15 ghế; Phòng 3,4,5: 10 ghế
    
    DECLARE @rowIdx INT = 0;
    WHILE @rowIdx < @maxRows
    BEGIN
        DECLARE @currentRow CHAR(1) = CHAR(ASCII('A') + @rowIdx);
        DECLARE @s INT = 1;
        WHILE @s <= @seatsPerRow
        BEGIN
            INSERT INTO Seat (RoomID, Row, Number, SeatType)
            VALUES (@r, @currentRow, @s, 
                CASE 
                    WHEN @rowIdx = (@maxRows - 1) THEN 'Couple Seat' -- Hàng cuối cùng
                    WHEN @rowIdx BETWEEN 4 AND 7 THEN 'VIP'        -- Hàng giữa là VIP
                    ELSE 'Regular' 
                END);
            SET @s = @s + 1;
        END
        SET @rowIdx = @rowIdx + 1;
    END
    SET @r = @r + 1;
END
GO

-- Suất chiếu tại phòng 1, bắt đầu lúc 22:30 Thứ Hai
INSERT INTO Screening (ScreeningID, MovieID, RoomID, StartTime, EndTime, BasePrice)
VALUES (301, 1, 1, '2026-05-11 22:30:00', '2026-05-12 00:30:00', 70000);

INSERT INTO Booking (BookingID, UserID, ScreeningID, Status) VALUES (701, 2, 301, 'Paid');

-- Chèn vé cho suất này
INSERT INTO Ticket (TicketID, BookingID, RoomID, Row, Number, Price) VALUES 
(2001, 701, 1, 'A', 1, 70000),  -- Ghế thường
(2002, 701, 1, 'E', 5, 75000),  -- Ghế VIP
(2003, 701, 1, 'J', 1, 150000); -- Ghế Đôi (Hàng cuối)

-- Suất chiếu tại phòng 3, bắt đầu lúc 19:00 Thứ Bảy
INSERT INTO Screening (ScreeningID, MovieID, RoomID, StartTime, EndTime, BasePrice)
VALUES (302, 2, 3, '2026-05-16 19:00:00', '2026-05-16 21:00:00', 90000);

INSERT INTO Booking (BookingID, UserID, ScreeningID, Status) VALUES (702, 2, 302, 'Paid');

-- Chèn vé cho suất này
INSERT INTO Ticket (TicketID, BookingID, RoomID, Row, Number, Price) VALUES 
(2004, 702, 3, 'B', 2, 90000),  -- Ghế thường
(2005, 702, 3, 'J', 1, 190000); -- Ghế Đôi (Hàng cuối)

-- Dữ liệu User
INSERT INTO [User] VALUES 
(1, N'Nguyễn Văn A', '1995-01-01', 'vana@gmail.com', '0912345678', 'admin01', 'hashed_pass_123', 'Admin'),
(2, N'Trần Thị B', '2000-05-15', 'thib@gmail.com', '0987654321', 'client01', 'hashed_pass_456', 'Client');

-- Dữ liệu Comment
INSERT INTO Comment (MovieID, UserID, Content, Rating) VALUES (1, 2, N'Phim rất cảm động!', 5);

-- Dữ liệu Stats
INSERT INTO SystemStats (StatID, ViewCount) VALUES (1, 15000);