const $ = id => document.getElementById(id);

// Data Menu
const D = [
    { id: 'ba', g: 'nb', n: 'Nasi Bukhori Ayam', p: 40000 },
    { id: 'bk', g: 'nb', n: 'Nasi Bukhori Kambing', p: 50000 },
    { id: 'ta', g: 'nb', n: 'Nasi Bukhori Ayam 1 Talam', p: 210000 },
    { id: 'tk', g: 'nb', n: 'Nasi Bukhori Kambing 1 Talam', p: 260000 },
    { id: 'sk', g: 'sw', n: 'Shawarma Kecil', p: 18000 },
    { id: 'ss', g: 'sw', n: 'Shawarma Sedang', p: 25000 },
    { id: 'sb', g: 'sw', n: 'Shawarma Besar', p: 30000 }
];

// Data Galeri Foto
const GALERI = [
    { src: 'manok.jpeg', caption: 'Nasi Bukhori Ayam' },
    { src: 'kambing.jpeg', caption: 'Nasi Bukhori Kambing' },
    { src: 'kebab.jpeg', caption: 'Shawarma Sulaeman' },
    { src: 'talam.jpeg', caption: 'Porsi Talam Acara' },
    { src: 'proses.jpeg', caption: 'Proses Memasak Segar' },
    { src: 'aizul.png', caption: 'Pelayanan Pesanan' }
];

// Data Testimoni Pelanggan
const TESTIMONI = [
    { nama: 'Rizki Aulia', teks: 'Bumbu bukhorinya sangat meresap, porsinya juga banyak. Shawarma Secret Sauce-nya mantap!', asal: 'Lhokseumawe' },
    { nama: 'Ikfar', teks: 'Pesan talam untuk acara keluarga, semua suka. Daging kambingnya empuk dan gak bau.', asal: 'Kandang' },
    { nama: 'Farhan Ramos', teks: 'Shawarma Hot Spicy favorit banget untuk cemilan sore. Fast response juga pas pesan via WA.', asal: 'Buloh' },
    { nama: 'Fauzi Plak', teks: 'Nasi bukhori paling recommended! Bumbu rempahnya berani dan pas banget di lidah.', asal: 'Lhokseumawe' },
    { nama: 'Fakhrur Radhy', teks: 'Layanannya cepat dan ramah. Porsi makanannya melimpah, dijamin kenyang puas!', asal: 'Krueng Geukueh' },
    { nama: 'Sandar', teks: 'Bumbu shawarmanya berasa banget, beda dari yang lain. Next time pasti bakal order lagi.', asal: 'Bireuen' },
    { nama: 'Roy', teks: 'Top banget buat acara kumpul-kumpul. Dagingnya lembut dan bumbunya ngeresap sempurna.', asal: 'Krueng Mane' },
    { nama: 'Birrul', teks: 'Rasa otentik dan harganya sangat terjangkau. Fast response banget pas dipesan!', asal: 'Ceubo' },
    { nama: 'Dhirar', teks: 'Sausnya juara! Daging kambingnya empuk banget dan gak ada bau prengus sama sekali.', asal: 'Leubu' }
];

// Inisialisasi Kuantitas Menu
const Q = {};
D.forEach(d => Q[d.id] = 0);

// Helper Format Rupiah
const rp = n => 'Rp ' + n.toLocaleString('id-ID');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Menu
    D.forEach(d => {
        const target = document.querySelector('[data-g="' + d.g + '"]');
        if (target) {
            target.insertAdjacentHTML('beforeend',
                '<div class="mr" id="r-' + d.id + '"><div class="nf"><b>' + d.n + '</b><small>' + rp(d.p) + '</small></div><div class="qty" data-id="' + d.id + '"><button type="button" data-d="-1" aria-label="Kurangi">−</button><span>0</span><button type="button" data-d="1" aria-label="Tambah">+</button></div></div>'
            );
        }
    });

    // 2. Render Galeri Foto
    const galEl = $('gal');
    if (galEl) {
        galEl.innerHTML = GALERI.map((g, i) => `
            <button type="button" data-c="${g.caption}" onclick="openLightbox('${g.src}')">
                <img src="${g.src}" alt="${g.caption}" loading="lazy">
            </button>
        `).join('');
    }

    // 3. Render Testimoni
    const tmEl = $('tm');
    if (tmEl) {
        tmEl.innerHTML = TESTIMONI.map(t => `
            <div class="tc rv">
                <div class="st">★★★★★</div>
                <p>"${t.teks}"</p>
                <b>${t.nama}</b>
                <small>${t.asal}</small>
            </div>
        `).join('');
    }

    // 4. Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.rv').forEach(el => observer.observe(el));

    // 5. Intersection Observer untuk Floating Bar Pesanan
    const orderSec = $('pesan');
    if (orderSec) {
        new IntersectionObserver(es => {
            inOrder = es[0].isIntersecting;
            up();
        }, { threshold: .15 }).observe(orderSec);
    }

    // 6. Gambar Hero Default
    // Gambar Hero Default
    const heroImg = document.querySelector('[data-k="hero"]');
if (heroImg) {
    heroImg.src = 'logo.png'; // <-- Ganti link/path foto di sini
    }
    const bkImg = document.querySelector('[data-k="bk"]');
    if (bkImg) bkImg.src = 'ikon.png';
    const swImg = document.querySelector('[data-k="sw"]');
    if (swImg) swImg.src = 'shawarma.png';

    up();
});

let inOrder = false;

// Fungsi Update Ringkasan Pesanan & Total
function up() {
    let tot = 0, cnt = 0, rows = '', sw = false, lines = '';
    D.forEach(d => {
        const q = Q[d.id], r = $('r-' + d.id);
        if (r) {
            r.querySelector('span').textContent = q;
            r.classList.toggle('act', q > 0);
        }

        if (q) {
            const st = q * d.p;
            tot += st;
            cnt += q;
            if (d.g === 'sw') sw = true;
            rows += '<div class="sr"><span>' + d.n + ' ×' + q + '</span><span>' + rp(st) + '</span></div>';
            lines += '- ' + d.n + ' x' + q + ' (' + rp(st) + ')\n';
        }
    });

    if ($('sm'))$('sm').innerHTML = cnt ? rows : '<div class="e">Belum ada menu dipilih.</div>';
    if ($('sauce'))$('sauce').hidden = !sw;
    if ($('tt'))$('tt').textContent = rp(tot);

    const nm = $('nm') ?$('nm').value.trim() : '';
    const ct = $('ct') ?$('ct').value.trim() : '';
    const sa = $('sa') ?$('sa').value : 'Original';

    let m = 'Halo Sulaeman Food, saya mau pesan:\n' + (nm ? 'Nama: ' + nm + '\n' : '') + '\n' + lines;
    if (sw) m += '\nSaus shawarma: ' + sa + '\n';
    m += '\nTotal: ' + rp(tot) + (ct ? '\nCatatan: ' + ct : '');

    if ($('go')) {$('go').href = cnt ? 'https://wa.me/6282277003634?text=' + encodeURIComponent(m) : '#';
        $('go').classList.toggle('off', !cnt);
    }
    if ($('hn'))$('hn').style.display = cnt ? 'none' : 'block';
    if ($('bar')) {$('bar').textContent = 'Lihat Pesanan · ' + cnt + ' item · ' + rp(tot);
        $('bar').classList.toggle('on', cnt > 0 && !inOrder);
    }
}

// Event Listener Tambah/Kurang Kuantitas Menu
document.addEventListener('click', e => {
    const b = e.target.closest('.qty button');
    if (!b) return;
    const id = b.parentElement.dataset.id;
    Q[id] = Math.max(0, Math.min(99, Q[id] + +b.dataset.d));
    up();
});

// Event Listener Input Form
['nm', 'ct', 'sa'].forEach(i => {
    const el = $(i);
    if (el) el.addEventListener('input', up);
});

// Fitur Lightbox (Perbesar Foto Galeri)
function openLightbox(src) {
    const lb = $('lb');
    const lbi = $('lbi');
    if (lb && lbi) {
        lbi.src = src;
        lb.removeAttribute('hidden');
    }
}

document.addEventListener('click', e => {
    if (e.target.id === 'lb' || e.target.id === 'lbx') {
        const lb = $('lb');
        if (lb) lb.setAttribute('hidden', '');
    }
});
