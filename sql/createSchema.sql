DROP TABLE IF EXISTS haikus;

CREATE TABLE haikus (
    id VARCHAR(255) NOT NULL,
    title VARCHAR(80) NOT NULL,
    author VARCHAR(20) NOT NULL,
    text VARCHAR(255) NOT NULL,
    date_uploaded DATE,
    year_of_release DATE
);
