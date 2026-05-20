DROP DATABASE IF EXISTS cinema_management;
CREATE DATABASE cinema_management;
USE cinema_management;

CREATE TABLE Movie (
  MovieID INT PRIMARY KEY AUTO_INCREMENT,
  Title VARCHAR(255) NOT NULL,
  Description TEXT,
  Genre VARCHAR(100),
  Director VARCHAR(100),
  Actor TEXT,
  Languages VARCHAR(100),
  Censorship ENUM('P', 'K', 'T13', 'T16', 'T18'),
  Duration INT,
  ReleaseDate DATE,
  PosterURL VARCHAR(255),
  Status ENUM('Up Coming', 'On Going', 'Stoped') DEFAULT 'Up Coming'
);

CREATE TABLE Room (
  RoomID INT PRIMARY KEY,
  RoomName VARCHAR(100) NOT NULL,
  RoomSize ENUM('Large', 'Small')
);

CREATE TABLE Seat (
  RoomID INT,
  Row CHAR(1),
  Number INT,
  SeatType ENUM('Regular', 'VIP', 'Couple Seat'),
  PRIMARY KEY (RoomID, Row, Number),
  FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

CREATE TABLE Screening (
  ScreeningID INT PRIMARY KEY AUTO_INCREMENT,
  MovieID INT,
  RoomID INT,
  StartTime DATETIME,
  EndTime DATETIME,
  BasePrice DECIMAL(18,2),
  FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
  FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

CREATE TABLE User (
  UserID INT PRIMARY KEY AUTO_INCREMENT,
  FullName VARCHAR(255),
  DateOfBirth DATE,
  Email VARCHAR(100) UNIQUE,
  Phone VARCHAR(20),
  Username VARCHAR(50) UNIQUE,
  Password VARCHAR(255),
  Role ENUM('Admin', 'Client') DEFAULT 'Client'
);

CREATE TABLE Booking (
  BookingID INT PRIMARY KEY AUTO_INCREMENT,
  UserID INT,
  ScreeningID INT,
  BookingTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  Status ENUM('Pending', 'Paid', 'Canceled') DEFAULT 'Pending',
  FOREIGN KEY (UserID) REFERENCES User(UserID),
  FOREIGN KEY (ScreeningID) REFERENCES Screening(ScreeningID)
);

CREATE TABLE Ticket (
  TicketID INT PRIMARY KEY AUTO_INCREMENT,
  BookingID INT,
  ScreeningID INT,
  RoomID INT,
  Row CHAR(1),
  Number INT,
  Price DECIMAL(18,2),
  FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
  FOREIGN KEY (RoomID, Row, Number) REFERENCES Seat(RoomID, Row, Number),
  FOREIGN KEY (ScreeningID) REFERENCES Screening(ScreeningID)
);

CREATE TABLE Comment (
  MovieID INT,
  UserID INT,
  Content TEXT,
  Rating INT CHECK (Rating BETWEEN 1 AND 5),
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  IsVisible BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (MovieID, UserID),
  FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
  FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Advertisement (
  AdID INT PRIMARY KEY AUTO_INCREMENT,
  ProductTitle VARCHAR(255),
  ImageURL VARCHAR(255),
  TargetLink VARCHAR(255),
  IsActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE Contact (
  ContactID INT PRIMARY KEY AUTO_INCREMENT,
  SenderName VARCHAR(255),
  SenderEmail VARCHAR(100),
  Subject VARCHAR(255),
  Message TEXT,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  IsProcessed BOOLEAN DEFAULT FALSE
);

CREATE TABLE SystemStats (
  StatID INT PRIMARY KEY AUTO_INCREMENT,
  ViewCount BIGINT DEFAULT 0,
  LastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rooms
INSERT INTO Room (RoomID, RoomName, RoomSize) VALUES
(1, 'Phòng Lớn 01', 'Large'),
(2, 'Phòng Lớn 02', 'Large'),
(3, 'Phòng Nhỏ 03', 'Small'),
(4, 'Phòng Nhỏ 04', 'Small'),
(5, 'Phòng Nhỏ 05', 'Small');

-- Movies
INSERT INTO Movie (Title, Genre, Director, Actor, Languages, Censorship, Duration, ReleaseDate, Status, Description) VALUES
('The Conjuring: Xác Ướp', 'Kinh dị', 'Michael Chaves', 'Patrick Wilson, Vera Farmiga', 'Phụ đề', 'T16', 120, '2026-04-17', 'On Going', 'Một bộ phim kinh dị về gia đình Warren đối mặt với thế lực siêu nhiên.'),
('Lật Mặt 7', 'Tâm lý', 'Lý Hải', 'Quách Ngọc Tuyên, Trương Minh Cường', 'Tiếng Việt', 'K', 120, '2024-04-26', 'On Going', 'Một bộ phim về tình cảm gia đình đầy cảm xúc.'),
('Avengers: Endgame', 'Hành động', 'Anthony Russo', 'Robert Downey Jr., Chris Evans', 'Phụ đề', 'T13', 181, '2019-04-26', 'Stoped', 'Trận chiến cuối cùng của các siêu anh hùng.'),
('Dune: Part Two', 'Khoa học viễn tưởng', 'Denis Villeneuve', 'Timothée Chalamet, Zendaya', 'Phụ đề', 'T13', 166, '2026-06-15', 'Up Coming', 'Hành trình của Paul Atreides tại Arrakis.');

-- Generate seats for Large rooms (1,2): 10 rows (A-J), 15 seats/row
INSERT INTO Seat (RoomID, Row, Number, SeatType)
SELECT r.RoomID, lbl, num,
  CASE
    WHEN lbl IN ('I', 'J') THEN 'Couple Seat'
    WHEN lbl IN ('E', 'F', 'G', 'H') THEN 'VIP'
    ELSE 'Regular'
  END
 FROM (SELECT 1 AS RoomID UNION SELECT 2) r
CROSS JOIN (SELECT 'A' AS lbl UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D'
            UNION SELECT 'E' UNION SELECT 'F' UNION SELECT 'G' UNION SELECT 'H'
            UNION SELECT 'I' UNION SELECT 'J') row_data
CROSS JOIN (SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
            UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
            UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
            UNION SELECT 13 UNION SELECT 14 UNION SELECT 15) nums;

-- Generate seats for Small rooms (3,4,5): 10 rows (A-J), 10 seats/row
INSERT INTO Seat (RoomID, Row, Number, SeatType)
SELECT r.RoomID, lbl, num,
  CASE
    WHEN lbl IN ('I', 'J') THEN 'Couple Seat'
    WHEN lbl IN ('E', 'F', 'G', 'H') THEN 'VIP'
    ELSE 'Regular'
  END
FROM (SELECT 3 AS RoomID UNION SELECT 4 UNION SELECT 5) r
CROSS JOIN (SELECT 'A' AS lbl UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D'
            UNION SELECT 'E' UNION SELECT 'F' UNION SELECT 'G' UNION SELECT 'H'
            UNION SELECT 'I' UNION SELECT 'J') row_data
CROSS JOIN (SELECT 1 AS num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
            UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
            UNION SELECT 9 UNION SELECT 10) nums;

-- Users (passwords: admin123 / client123 - bcrypt hashed)
INSERT INTO User (FullName, DateOfBirth, Email, Phone, Username, Password, Role) VALUES
('Nguyễn Văn A', '1995-01-01', 'vana@gmail.com', '0912345678', 'admin01', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'Admin'),
('Trần Thị B', '2000-05-15', 'thib@gmail.com', '0987654321', 'client01', '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQkf9Rn6bm1FZwOJK3v0pMl0IRLG2y', 'Client');

-- Screenings (today + next few days)
INSERT INTO Screening (MovieID, RoomID, StartTime, EndTime, BasePrice) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 9 HOUR), DATE_ADD(CURDATE(), INTERVAL 11 HOUR), 50000),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 14 HOUR), DATE_ADD(CURDATE(), INTERVAL 16 HOUR), 60000),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 19 HOUR), DATE_ADD(CURDATE(), INTERVAL 21 HOUR), 80000),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 22 HOUR), DATE_ADD(CURDATE(), INTERVAL 24 HOUR), 100000),
(2, 3, DATE_ADD(CURDATE(), INTERVAL 10 HOUR), DATE_ADD(CURDATE(), INTERVAL 12 HOUR), 50000),
(2, 3, DATE_ADD(CURDATE(), INTERVAL 15 HOUR), DATE_ADD(CURDATE(), INTERVAL 17 HOUR), 60000),
(2, 3, DATE_ADD(CURDATE(), INTERVAL 19 HOUR) + INTERVAL 30 MINUTE, DATE_ADD(CURDATE(), INTERVAL 21 HOUR) + INTERVAL 30 MINUTE, 90000),
(1, 2, DATE_ADD(CURDATE(), INTERVAL 9 HOUR) + INTERVAL 30 MINUTE, DATE_ADD(CURDATE(), INTERVAL 11 HOUR) + INTERVAL 30 MINUTE, 50000),
(1, 2, DATE_ADD(CURDATE(), INTERVAL 20 HOUR), DATE_ADD(CURDATE(), INTERVAL 22 HOUR), 85000);

-- SystemStats
INSERT INTO SystemStats (ViewCount) VALUES (0);
