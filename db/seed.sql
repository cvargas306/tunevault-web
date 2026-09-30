-- =============================================================
-- TuneVault seed data (PostgreSQL)
-- Loads the initial genres and songs migrated from data/songs.json.
-- Run AFTER schema.sql with: psql -d tunevault -f db/seed.sql
-- =============================================================

-- Run everything as one transaction: if any insert fails,
-- nothing is saved and the database is left unchanged.
BEGIN;

-- Empty both tables and reset their id counters back to 1,
-- so this script can be re-run safely.
TRUNCATE songs, genres RESTART IDENTITY;

-- Genres: inserted first because songs depend on them (foreign key)
INSERT INTO genres (name) VALUES
    ('Rock'),
    ('Pop'),
    ('Alternative Rock'),
    ('Jazz'),
    ('Classical'),
    ('Electronic'),
    ('Reggae');

-- Songs: each genre_id is looked up by name with a subquery,
-- so the script does not depend on knowing the numeric ids.
-- Durations are stored in seconds (m:ss -> m * 60 + ss).
INSERT INTO songs (title, artist, album, duration_seconds, genre_id) VALUES
    ('Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 355,
        (SELECT id FROM genres WHERE name = 'Rock')),
    ('Billie Jean', 'Michael Jackson', 'Thriller', 294,
        (SELECT id FROM genres WHERE name = 'Pop')),
    ('Clocks', 'Coldplay', 'A Rush of Blood to the Head', 307,
        (SELECT id FROM genres WHERE name = 'Alternative Rock')),
    ('So What', 'Miles Davis', 'Kind of Blue', 562,
        (SELECT id FROM genres WHERE name = 'Jazz')),
    ('Clair de Lune', 'Claude Debussy', 'Suite Bergamasque', 275,
        (SELECT id FROM genres WHERE name = 'Classical')),
    ('One More Time', 'Daft Punk', 'Discovery', 320,
        (SELECT id FROM genres WHERE name = 'Electronic')),
    ('No Woman, No Cry', 'Bob Marley & The Wailers', 'Natty Dread', 246,
        (SELECT id FROM genres WHERE name = 'Reggae')),
    ('Hotel California', 'Eagles', 'Hotel California', 390,
        (SELECT id FROM genres WHERE name = 'Rock')),
    ('Take Five', 'Dave Brubeck', 'Time Out', 324,
        (SELECT id FROM genres WHERE name = 'Jazz')),
    ('Someone Like You', 'Adele', '21', 285,
        (SELECT id FROM genres WHERE name = 'Pop'));

COMMIT;

