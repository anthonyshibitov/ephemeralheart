-- Insert dummy posts
CREATE TABLE posts (
    post_id serial PRIMARY KEY,
    post_contents VARCHAR(1000) NOT NULL,
    passes INTEGER NOT NULL,
    post_ip CIDR NOT NULL,
    post_time TIMESTAMPTZ NOT NULL
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    token_string VARCHAR(11) NOT NULL,
    token_ip CIDR NOT NULL
);

CREATE TABLE postTokens (
    postToken_id SERIAL PRIMARY KEY,
    fk_post_id int,
    fk_token_id int,
    FOREIGN KEY (fk_post_id) REFERENCES posts(post_id),
    FOREIGN KEY (fk_token_id) REFERENCES tokens(token_id) ON DELETE CASCADE
);