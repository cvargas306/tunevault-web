-- =============================================================
-- TuneVault database schema (PostgreSQL)
-- Creates the genres and songs tables.
-- Run with: psql -d tunevault -f db/schema.sql
-- =============================================================

-- Drop tables if they already exist so this script can be re-run safely.
-- songs is dropped first because it depends on genres (foreign key).
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS genres;

-- Genres: each genre name is stored only once
CREATE TABLE genres (
    id   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Songs: each song belongs to one genre through genre_id (foreign key).
-- Duration is stored in seconds; the app formats it as m:ss for display.
-- Album is optional so singles can be stored without an album.
CREATE TABLE songs (
    id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title            VARCHAR(150) NOT NULL,
    artist           VARCHAR(150) NOT NULL,
    album            VARCHAR(150),
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    genre_id         INTEGER NOT NULL REFERENCES genres(id)
);

