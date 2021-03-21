use hm;

CREATE TABLE blocs(
    bloc_id VARCHAR(3) PRIMARY KEY,
    floors_nb INTEGER NOT NULL,
    has_houses TINYINT NOT NULL DEFAULT 0
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE apts(
    apt_label VARCHAR(6) PRIMARY KEY,
    bloc_id VARCHAR(6),
    apt_type VARCHAR(3) NOT NULL,
    FOREIGN KEY (bloc_id) REFERENCES blocs(bloc_id) on DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE houses(
    house_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    house_hash VARCHAR(100) UNIQUE NOT NULL,
    apt_label VARCHAR(6) NOT NULL,
    floor_nb INTEGER NOT NULL,
    surface FLOAT NOT NULL,
    surface_real FLOAT NOT NULL,
    FOREIGN KEY (apt_label) REFERENCES apts(apt_label) on DELETE CASCADE,
    CONSTRAINT apt_per_floor UNIQUE(floor_nb, apt_label)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE clients(
    client_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(50),
    client_phone VARCHAR(15) UNIQUE,
    client_email VARCHAR(80) UNIQUE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE deals(
    house_id INTEGER,
    client_id INTEGER,
    deal_nature VARCHAR(15) NOT NULL,
    dead_details VARCHAR(30) NOT NULL,
    FOREIGN KEY (house_id) REFERENCES houses(house_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE USER 'SELECTOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT SELECT ON hm.* TO 'SELECTOR'@'%';

CREATE USER 'INSERTOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT INSERT ON hm.* TO 'INSERTOR'@'%';

CREATE USER 'UPDATOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT SELECT, UPDATE ON hm.* TO 'UPDATOR'@'%';

-- SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));