CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  nick_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP default current_timestamp
);

CREATE TABLE game_rooms (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP default current_timestamp
);

CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  game_room_id INT REFERENCES game_rooms,
  created_at TIMESTAMP,
  updated_at TIMESTAMP default current_timestamp
);

CREATE TABLE game_session_participations (
  id SERIAL PRIMARY KEY,
  game_session_id INT REFERENCES game_sessions,
  user_id INT REFERENCES users,
  created_at TIMESTAMP,
  updated_at TIMESTAMP default current_timestamp
);
