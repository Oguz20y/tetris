const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Veritabanı Bağlantısı
const db = new sqlite3.Database('./oyuncu_skorlari.db', (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
    } else {
        console.log('Veritabanı başarıyla bağlandı.');
    }
});

// Tabloyu oluştur
db.run(`
    CREATE TABLE IF NOT EXISTS oyuncu_skorlari (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        oyuncu_adi TEXT NOT NULL,
        skor INTEGER NOT NULL,
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// WebSocket Sunucusu
const wss = new WebSocket.Server({ port: 5001 });

wss.on('connection', (ws) => {
    console.log('Bir istemci bağlandı.');
    sendTopScores(ws);
});

const sendTopScores = (ws) => {
    const query = `SELECT oyuncu_adi, skor, datetime(tarih, 'localtime') AS yerel_tarih FROM oyuncu_skorlari ORDER BY skor DESC LIMIT 10`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Skorları gönderme hatası:', err);
        } else {
            ws.send(JSON.stringify({ type: 'skorGuncelle', data: rows }));
        }
    });
};

// Skorları güncelleme
const broadcastTopScores = async () => {
    const query = `SELECT oyuncu_adi, skor, datetime(tarih, 'localtime') AS yerel_tarih FROM oyuncu_skorlari ORDER BY skor DESC LIMIT 10`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Skorları WebSocket ile gönderme hatası:', err);
        } else {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'skorGuncelle', data: rows }));
                }
            });
        }
    });
};

// Skor ekleme veya güncelleme (yeni skor daha yüksekse güncelle)
app.post('/skor-ekle', (req, res) => {
    const { oyuncu_adi, skor } = req.body;
    const yerelTarih = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Önce veritabanında bu ada ait en yüksek skor var mı kontrol edelim
    const kontrolQuery = `
        SELECT id, skor
        FROM oyuncu_skorlari
        WHERE oyuncu_adi = ?
        ORDER BY skor DESC
        LIMIT 1
    `;
    db.get(kontrolQuery, [oyuncu_adi], (err, row) => {
        if (err) {
            console.error('Veritabanı sorgu hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası.' });
        }

        // Eğer aynı isme sahip bir oyuncu kaydı yoksa -> INSERT
        if (!row) {
            const insertQuery = `
                INSERT INTO oyuncu_skorlari (oyuncu_adi, skor, tarih)
                VALUES (?, ?, ?)
            `;
            db.run(insertQuery, [oyuncu_adi, skor, yerelTarih], async function (err) {
                if (err) {
                    console.error('Skor ekleme hatası:', err);
                    return res.status(500).json({ error: 'Veritabanına ekleme başarısız.' });
                }
                res.status(201).json({ message: 'Skor başarıyla kaydedildi.', id: this.lastID });
                await broadcastTopScores(); // WebSocket ile güncelle
            });
        } else {
            // Aynı ada sahip bir kayıt varsa, en yüksek skor row.skor
            const eskiSkor = row.skor;
            if (skor > eskiSkor) {
                // Yeni skor daha yüksekse -> GÜNCELLE
                const updateQuery = `
                    UPDATE oyuncu_skorlari
                    SET skor = ?, tarih = ?
                    WHERE oyuncu_adi = ?
                `;
                db.run(updateQuery, [skor, yerelTarih, oyuncu_adi], async function (err2) {
                    if (err2) {
                        console.error('Skor güncelleme hatası:', err2);
                        return res.status(500).json({ error: 'Veritabanında güncelleme başarısız.' });
                    }
                    res.status(200).json({ message: 'Skor güncellendi.' });
                    await broadcastTopScores(); // WebSocket ile güncelle
                });
            } else {
                // Yeni skor eskiye göre düşükse -> Hiçbir şey yapma, eski skor kalsın
                res.status(200).json({ message: 'Aynı isme ait daha yüksek bir skor zaten mevcut, güncellenmedi.' });
            }
        }
    });
});

// Skorları Listeleme
app.get('/skorlar', (req, res) => {
    const query = `SELECT oyuncu_adi, skor, datetime(tarih, 'localtime') AS yerel_tarih FROM oyuncu_skorlari ORDER BY skor DESC LIMIT 10`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Skorları çekme hatası:', err);
            res.status(500).json({ error: 'Skorlar getirilemedi.' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Sunucuyu Başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
    console.log(`WebSocket sunucusu ws://localhost:5001 adresinde çalışıyor.`);
});