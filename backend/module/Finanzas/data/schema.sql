CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    moneda_preferida VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL
        CHECK(tipo IN ('ingreso', 'gasto'))
);

CREATE TABLE transacciones (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,

    tipo VARCHAR(20) NOT NULL
        CHECK(tipo IN ('ingreso', 'gasto')),

    monto NUMERIC(12,2) NOT NULL,

    descripcion TEXT,

    fecha DATE NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_transaccion_usuario
        FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaccion_categoria
        FOREIGN KEY(categoria_id)
        REFERENCES categorias(id)
);

CREATE TABLE metas_financieras (
    id SERIAL PRIMARY KEY,

    usuario_id INTEGER NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    monto_objetivo NUMERIC(12,2) NOT NULL,

    monto_actual NUMERIC(12,2) DEFAULT 0,

    fecha_limite DATE,

    estado VARCHAR(20) DEFAULT 'activa'
        CHECK(estado IN ('activa','completada','cancelada')),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_meta_usuario
        FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);