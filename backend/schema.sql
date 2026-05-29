-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'student',
    phone       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id    TEXT UNIQUE,
    class         TEXT,
    stream        TEXT,
    roll_no       INT,
    parent_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    academic_year TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Progress
CREATE TABLE IF NOT EXISTS progresses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    recorded_by_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    subject         TEXT NOT NULL,
    marks           NUMERIC(5,2),
    term            TEXT,
    assessment_type TEXT,
    remarks         TEXT,
    academic_year   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_progresses_student_id ON progresses(student_id);

-- Attendance
CREATE TABLE IF NOT EXISTS attendances (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marked_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    date         TIMESTAMPTZ NOT NULL,
    status       TEXT NOT NULL,
    subject      TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attendances_student_id ON attendances(student_id);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    body            TEXT,
    target_audience TEXT NOT NULL DEFAULT 'all',
    target_class    TEXT,
    posted_by_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    pinned          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fees
CREATE TABLE IF NOT EXISTS fees (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id     UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_type       TEXT NOT NULL,
    description    TEXT,
    amount         NUMERIC(12,2) NOT NULL,
    due_date       TIMESTAMPTZ NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending',
    paid_date      TIMESTAMPTZ,
    academic_year  TEXT,
    term           TEXT,
    recorded_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);

-- Books
CREATE TABLE IF NOT EXISTS books (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            TEXT NOT NULL,
    author           TEXT,
    category         TEXT,
    total_copies     INT NOT NULL DEFAULT 1,
    available_copies INT NOT NULL DEFAULT 1,
    isbn             TEXT,
    publisher        TEXT,
    shelf            TEXT,
    added_by_id      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Book Issues
CREATE TABLE IF NOT EXISTS book_issues (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id      UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issued_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date     TIMESTAMPTZ NOT NULL,
    returned_at  TIMESTAMPTZ,
    status       TEXT NOT NULL DEFAULT 'issued',
    fine         NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_book_issues_book_id ON book_issues(book_id);
CREATE INDEX IF NOT EXISTS idx_book_issues_student_id ON book_issues(student_id);
