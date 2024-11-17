-- This script generates the tables for the keystore used by the application server for authentication and session storage
SET
FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS SESSIONS;
DROP TABLE IF EXISTS SESSION_SECRETS;

CREATE TABLE SESSIONS
(
    session_id varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
    expires    int unsigned NOT NULL,
    data       mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
    created    datetime                                               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (session_id)
);

CREATE TABLE SESSION_SECRETS
(
    value   varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    created datetime                                                      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (value),
    UNIQUE (value, created)
);

SET
FOREIGN_KEY_CHECKS = 1;
