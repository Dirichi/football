CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  nick_name TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  game_room_id VARCHAR,
  ended_at TIMESTAMP,
  started_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE game_session_participations (
  id SERIAL PRIMARY KEY,
  game_session_id INT REFERENCES game_sessions,
  team_id INT,
  role INT,
  user_id INT REFERENCES users,
  role_type INT,
  completed_passes INT,
  total_passes INT,
  total_shots INT,
  total_goals INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Touch updated_at every time any redord is updated.
DO $$DECLARE r record;
BEGIN
    FOR r IN SELECT table_name FROM information_schema.columns
             WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE 'CREATE TRIGGER touch_' || quote_ident(r.table_name)
        || ' BEFORE UPDATE ON ' || quote_ident(r.table_name)
        || ' FOR EACH ROW'
        || ' EXECUTE PROCEDURE trigger_set_timestamp()';
    END LOOP;
END$$;
