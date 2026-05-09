-- Tạo Database
CREATE DATABASE CinemaManagement;
GO
USE CinemaManagement;
GO

-- 1. Bảng Movie (Phim)
CREATE TABLE Movie (
    MovieID INT PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX),
    Genre NVARCHAR(100),
    Director NVARCHAR(100),
    Actor NVARCHAR(MAX),
    Languages NVARCHAR(100),
    Censorship NVARCHAR(10) CHECK (Censorship IN ('P', 'K', 'T13', 'T16', 'T18')),
    Duration INT,
    ReleaseDate DATE,
    PosterURL VARCHAR(255),
    Status NVARCHAR(20) CHECK (Status IN ('Up Coming', 'On Going', 'Stoped'))
);

-- 2. Bảng Room (Phòng chiếu)
CREATE TABLE Room (
    RoomID INT PRIMARY KEY,
    RoomName NVARCHAR(100) NOT NULL,
    RoomSize NVARCHAR(20) CHECK (RoomSize IN ('Large', 'Small'))
);

-- 3. Bảng Seat (Ghế ngồi)
CREATE TABLE Seat (
    RoomID INT,
    Row CHAR(1),
    Number INT,
    SeatType NVARCHAR(20) CHECK (SeatType IN ('Regular', 'VIP', 'Couple Seat')),
    PRIMARY KEY (RoomID, Row, Number),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

-- 4. Bảng Screening (Suất chiếu)
CREATE TABLE Screening (
    ScreeningID INT PRIMARY KEY,
    MovieID INT,
    RoomID INT,
    StartTime DATETIME,
    EndTime DATETIME,
    BasePrice DECIMAL(18,2),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID)
);

-- 5. Bảng User (Người dùng)
CREATE TABLE [User] (
    UserID INT PRIMARY KEY,
    FullName NVARCHAR(255),
    DateOfBirth DATE,
    Email VARCHAR(100) UNIQUE,
    Phone VARCHAR(20),
    Username VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    Role NVARCHAR(20) CHECK (Role IN ('Admin', 'Client'))
);

-- 6. Bảng Booking (Đặt vé)
CREATE TABLE Booking (
    BookingID INT PRIMARY KEY,
    UserID INT,
    ScreeningID INT,
    BookingTime DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(20) CHECK (Status IN ('Pending', 'Paid', 'Canceled')),
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (ScreeningID) REFERENCES Screening(ScreeningID)
);

-- 7. Bảng Ticket (Vé chi tiết)
CREATE TABLE Ticket (
    TicketID INT PRIMARY KEY,
    BookingID INT,
    RoomID INT,
    Row CHAR(1),
    Number INT,
    Price DECIMAL(18,2),
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID),
    FOREIGN KEY (RoomID, Row, Number) REFERENCES Seat(RoomID, Row, Number)
);

-- 8. Bảng Comment (Đánh giá)
CREATE TABLE Comment (
    MovieID INT,
    UserID INT,
    Content NVARCHAR(MAX),
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsVisible BIT DEFAULT 1,
    PRIMARY KEY (MovieID, UserID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    FOREIGN KEY (UserID) REFERENCES [User](UserID)
);

-- 9. Bảng Advertisement (Quảng cáo)
CREATE TABLE Advertisement (
    AdID INT PRIMARY KEY,
    ProductTitle NVARCHAR(255),
    ImageURL VARCHAR(255),
    TargetLink VARCHAR(255),
    IsActive BIT DEFAULT 1
);

-- 10. Bảng Contact (Liên hệ)
CREATE TABLE Contact (
    ContactID INT PRIMARY KEY,
    SenderName NVARCHAR(255),
    SenderEmail VARCHAR(100),
    Subject NVARCHAR(255),
    Message NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    IsProcessed BIT DEFAULT 0
);

-- 11. Bảng SystemStats (Thống kê)
CREATE TABLE SystemStats (
    StatID INT PRIMARY KEY,
    ViewCount BIGINT DEFAULT 0,
    LastUpdated DATETIME DEFAULT GETDATE()
);