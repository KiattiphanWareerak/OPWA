CREATE TABLE sgd_oil_price (
    oilsgd_value VARCHAR(50),
    oilsgd_change VARCHAR(50),
    oilsgd_change1 VARCHAR(50),
    oilsgd_change2 VARCHAR(50),
    oilsgd_lastdaily VARCHAR(50),
    oilsgd_hi VARCHAR(50),
    oilsgd_lo VARCHAR(50),
    oilsgd_time VARCHAR(50),
    oilsgd_chart VARCHAR(50),
    CONSTRAINT unique_sdg_data UNIQUE (oilsgd_value, oilsgd_change, oilsgd_change1, oilsgd_change2, oilsgd_lastdaily, oilsgd_hi, oilsgd_lo, oilsgd_time, oilsgd_chart)
);

CREATE TABLE ptt_oil_price (
    price_date VARCHAR(50),
    product VARCHAR(255),
    price NUMERIC(10, 3),
    CONSTRAINT unique_ptt_data UNIQUE (price_date, product, price)
);

CREATE TABLE rate_usd_thb (
    period VARCHAR(20),
    rate NUMERIC(10, 3),
    CONSTRAINT unique_rate_data UNIQUE (period, rate)
);