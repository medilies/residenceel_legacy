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
    house_code VARCHAR(32) UNIQUE NOT NULL,
    apt_label VARCHAR(6) NOT NULL,
    floor_nb INTEGER NOT NULL,
    door_number INTEGER NOT NULL,
    surface FLOAT NOT NULL,
    surface_real FLOAT NOT NULL,
    FOREIGN KEY (apt_label) REFERENCES apts(apt_label) on DELETE CASCADE,
    CONSTRAINT apt_per_floor UNIQUE(floor_nb, apt_label)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE clients(
    client_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    client_fname VARCHAR(50) NOT NULL,
    client_lname VARCHAR(50) NOT NULL,
    client_cni_number VARCHAR(20) UNIQUE NOT NULL,
    client_cni_date VARCHAR(15) NOT NULL,
    client_marital_status ENUM('Célibataire','Marié(e)','Séparé(e)','Divorcé(e)','Veuf ou veuve') NOT NULL,
    client_birthday VARCHAR(15) NOT NULL,
    client_birthplace VARCHAR(30) NOT NULL,
    client_father_fname VARCHAR(50) NOT NULL,
    client_mother_name VARCHAR(100) NOT NULL,
    client_profession VARCHAR(35) NOT NULL,
    client_income INTEGER DEFAULT 0,
    client_phone VARCHAR(15) UNIQUE NOT NULL,
    client_email VARCHAR(80) UNIQUE NOT NULL,
    client_address VARCHAR(150) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE deals(
    deal_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    house_id INTEGER UNIQUE,
    client_id INTEGER,
    deal_code VARCHAR(32) UNIQUE NOT NULL,
    deal_confirmed TINYINT DEFAULT 0,
    deal_closed TINYINT DEFAULT 0,
    FOREIGN KEY (house_id) REFERENCES houses(house_id) on DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) on DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE transactions(
    transaction_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    deal_id INTEGER,
    payment INTEGER NOT NULL,
    payment_chars VARCHAR(150) NOT NULL,
    payment_confirmed TINYINT DEFAULT 0,
    payment_type VARCHAR(6),
    transaction_date datetime NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (deal_id) REFERENCES deals(deal_id) on DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users(
    user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_fname VARCHAR(60) NOT NULL,
    user_lname VARCHAR(60) NOT NULL,
    pass VARCHAR(60) NOT NULL,
    user_email VARCHAR(60) UNIQUE NOT NULL,
    user_phone VARCHAR(14) UNIQUE NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE USER 'SELECTOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT SELECT ON hm.* TO 'SELECTOR'@'%';

CREATE USER 'INSERTOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT INSERT ON hm.* TO 'INSERTOR'@'%';

CREATE USER 'UPDATOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT SELECT, UPDATE ON hm.* TO 'UPDATOR'@'%';

CREATE USER 'DELETOR'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
GRANT SELECT, DELETE ON hm.* TO 'DELETOR'@'%';