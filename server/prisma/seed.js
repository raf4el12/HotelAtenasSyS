const pg = require('pg');
const bcrypt = require('bcrypt');

const pool = new pg.Pool({
  connectionString: 'postgresql://atenas_admin:atenas_secret_2025@localhost:5435/hotel_atenas',
});

function generateCuid() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `c${timestamp}${random}`;
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // ========== A. Usuario Admin ==========
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    const userId = generateCuid();
    const profileId = generateCuid();

    await client.query(
      `INSERT INTO users (id, email, password, role, "isActive", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [userId, 'admin@hotelatenas.com', hashedPassword, 'ADMIN', true],
    );

    await client.query(
      `INSERT INTO profiles (id, "userId", "firstName", "lastName", dni, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (dni) DO NOTHING`,
      [profileId, userId, 'Carlos', 'Administrador', '00000001'],
    );

    console.log('✅ Admin creado: admin@hotelatenas.com / Admin123!');

    // ========== B. 3 Pisos ==========
    const floorIds = [];
    const floors = [
      { name: 'Piso 1', number: 1 },
      { name: 'Piso 2', number: 2 },
      { name: 'Piso 3', number: 3 },
    ];

    for (const floor of floors) {
      const floorId = generateCuid();
      floorIds.push(floorId);
      await client.query(
        `INSERT INTO floors (id, name, number, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, NOW(), NOW())
         ON CONFLICT (name) DO NOTHING`,
        [floorId, floor.name, floor.number],
      );
    }

    console.log('✅ 3 pisos creados');

    // ========== C. 9 Habitaciones ==========
    const rooms = [
      { number: '101', category: 'NORMAL', floorIndex: 0 },
      { number: '102', category: 'NORMAL', floorIndex: 0 },
      { number: '103', category: 'PREMIUM', floorIndex: 0 },
      { number: '201', category: 'NORMAL', floorIndex: 1 },
      { number: '202', category: 'PREMIUM', floorIndex: 1 },
      { number: '203', category: 'PREMIUM', floorIndex: 1 },
      { number: '301', category: 'NORMAL', floorIndex: 2 },
      { number: '302', category: 'NORMAL', floorIndex: 2 },
      { number: '303', category: 'PREMIUM', floorIndex: 2 },
    ];

    for (const room of rooms) {
      await client.query(
        `INSERT INTO rooms (id, number, category, status, "floorId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         ON CONFLICT (number) DO NOTHING`,
        [generateCuid(), room.number, room.category, 'AVAILABLE', floorIds[room.floorIndex]],
      );
    }

    console.log('✅ 9 habitaciones creadas');

    // ========== D. 4 Tarifas Base ==========
    const rates = [
      { name: 'Momentáneo Normal', stayMode: 'HOURLY', category: 'NORMAL', price: 30.0, durationMin: 180 },
      { name: 'Momentáneo Premium', stayMode: 'HOURLY', category: 'PREMIUM', price: 45.0, durationMin: 180 },
      { name: 'Noche Normal', stayMode: 'OVERNIGHT', category: 'NORMAL', price: 60.0, durationMin: null },
      { name: 'Noche Premium', stayMode: 'OVERNIGHT', category: 'PREMIUM', price: 90.0, durationMin: null },
    ];

    for (const rate of rates) {
      await client.query(
        `INSERT INTO rate_rules (id, name, "stayMode", category, price, "durationMin", priority, "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
        [generateCuid(), rate.name, rate.stayMode, rate.category, rate.price, rate.durationMin, 0, true],
      );
    }

    console.log('✅ 4 tarifas base creadas');

    // ========== E. HotelConfig ==========
    await client.query(
      `INSERT INTO hotel_config (id, key, value, "updatedAt")
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (key) DO NOTHING`,
      [generateCuid(), 'overnight_checkout_time', '11:00'],
    );

    console.log('✅ 1 configuración creada');

    // ========== F. 6 Productos ==========
    const products = [
      { name: 'Agua San Luis 625ml', category: 'BEVERAGE_WATER', price: 3.0, stock: 48 },
      { name: 'Red Bull 250ml', category: 'BEVERAGE_ENERGY', price: 8.0, stock: 24 },
      { name: 'Vino Tacama Rosé', category: 'BEVERAGE_ALCOHOL', price: 35.0, stock: 12 },
      { name: 'Snickers', category: 'SNACK_CANDY', price: 4.0, stock: 36 },
      { name: 'Papas Lays Clásica', category: 'SNACK_SAVORY', price: 5.0, stock: 24 },
      { name: 'Cerveza Cusqueña 620ml', category: 'BEVERAGE_ALCOHOL', price: 10.0, stock: 48 },
    ];

    for (const product of products) {
      await client.query(
        `INSERT INTO products (id, name, category, price, stock, "minStock", status, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
        [generateCuid(), product.name, product.category, product.price, product.stock, 5, 'ACTIVE'],
      );
    }

    console.log('✅ 6 productos creados');

    await client.query('COMMIT');
    console.log('\n🎉 Seed completado exitosamente!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
