CREATE DATABASE IF NOT EXISTS tier;
USE tier;
CREATE TABLE IF NOT EXISTS urls (
  id int(11) NOT NULL AUTO_INCREMENT,
  url varchar(255) NOT NULL,
  short varchar(255) NOT NULL,
  created datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS statistics (
  id int(11) NOT NULL AUTO_INCREMENT,
  url_id int(11) NOT NULL,
  visits int(11) NOT NULL DEFAULT 0,
  last_visit datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (url_id)
    REFERENCES urls(id)
);
