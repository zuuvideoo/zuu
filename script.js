// ===== DATA DEFAULT =====
const menuDefault = [
    { nama: 'Mode User', ikon: 'fa-user-gear', url: '#' },
    { nama: 'Beranda', ikon: 'fa-home', url: '#' },
    { nama: 'Link', ikon: 'fa-link', url: '#' },
    { nama: 'Spreadsheets', ikon: 'fa-table', url: 'spreadsheets.html' },
    { nama: 'Pengaturan', ikon: 'fa-gear', url: '#' },
    { nama: 'Formulir', ikon: 'fa-file-alt', url: 'formulir.html' },
    { nama: 'Perubahan', ikon: 'fa-rotate', url: '#' }
];

const ikonList = [
    'fa-home', 'fa-user', 'fa-box', 'fa-search', 'fa-table', 'fa-user-gear',
    'fa-file-alt', 'fa-phone', 'fa-link', 'fa-check-circle', 'fa-gear', 'fa-file',
    'fa-robot', 'fa-cog', 'fa-database', 'fa-upload', 'fa-download', 'fa-print',
    'fa-camera', 'fa-video', 'fa-music', 'fa-book', 'fa-graduation-cap',
    'fa-briefcase', 'fa-star', 'fa-heart', 'fa-bell', 'fa-envelope', 'fa-clock',
    'fa-calendar', 'fa-map', 'fa-flag', 'fa-cloud', 'fa-code', 'fa-desktop',
    'fa-mobile', 'fa-cart-plus', 'fa-gift', 'fa-key', 'fa-lock', 'fa-rotate'
];

let ikonTerpilih = 'fa-home';
let editIkonTerpilih = 'fa-home';
let pilihanMode = '';
let pilihanIndex = null;

// ===== DARK MODE =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function muatTema() {
    const tema = localStorage.getItem('theme');
    if (tema === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-sun';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeIcon').className = 'fas fa-moon';
    }
}

// ===== SEMBUNYIKAN LABEL =====
function toggleHideLabels() {
    const wrapper = document.getElementById('appWrapper');
    wrapper.classList.toggle('hide-labels');
    const hide = wrapper.classList.contains('hide-labels');
    document.getElementById('hideLabel').textContent = hide ? 'Tampilkan' : 'Sembunyikan';
    localStorage.setItem('hideLabels', hide ? 'true' : 'false');
}

function muatHideLabels() {
    const val = localStorage.getItem('hideLabels');
    if (val === 'true') {
        document.getElementById('appWrapper').classList.add('hide-labels');
        document.getElementById('hideLabel').textContent = 'Tampilkan';
    } else {
        document.getElementById('appWrapper').classList.remove('hide-labels');
        document.getElementById('hideLabel').textContent = 'Sembunyikan';
    }
}

// ===== SLUG =====
function generateSlug(nama) {
    return nama.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function setUrlFromNama(inputNamaId, inputUrlId) {
    const namaInput = document.getElementById(inputNamaId);
    const urlInput = document.getElementById(inputUrlId);
    const nama = namaInput.value.trim();
    if (nama) {
        urlInput.value = generateSlug(nama) + '.html';
    } else {
        alert('Masukkan nama menu terlebih dahulu!');
    }
}

// ===== LOCALSTORAGE =====
function simpanMenu(menu) {
    localStorage.setItem('menuItems', JSON.stringify(menu));
}

function muatMenu() {
    const data = localStorage.getItem('menuItems');
    if (data) {
        try { return JSON.parse(data); } catch {}
    }
    return menuDefault;
}

// ===== RENDER =====
function renderMenu() {
    const menu = muatMenu();
    const ul = document.getElementById('menuList');
    ul.innerHTML = '';
    menu.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `
            <a href="${item.url}">
                <span class="icon"><i class="fas ${item.ikon}"></i></span>
                <span class="label">${item.nama}</span>
            </a>
        `;
        ul.appendChild(li);
    });
}

// ===== MODAL TAMBAH =====
function bukaModalTambah() {
    const menu = muatMenu();
    document.getElementById('inputNama').value = 'Menu ' + (menu.length + 1);
    document.getElementById('inputUrl').value = '#';
    ikonTerpilih = 'fa-home';
    generateIkonGrid('ikonGrid', 'ikonTerpilih');
    document.getElementById('modalTambah').style.display = 'flex';

    const inputNama = document.getElementById('inputNama');
    const inputUrl = document.getElementById('inputUrl');
    inputNama.oninput = function() {
        const nama = this.value.trim();
        inputUrl.value = nama ? generateSlug(nama) + '.html' : '#';
    };
}

function simpanTambah() {
    const nama = document.getElementById('inputNama').value.trim();
    let url = document.getElementById('inputUrl').value.trim();
    if (!nama) { alert('Nama menu tidak boleh kosong!'); return; }
    if (!url || url === '#') {
        url = generateSlug(nama) + '.html';
    }
    const menu = muatMenu();
    menu.push({ nama, ikon: ikonTerpilih, url });
    simpanMenu(menu);
    renderMenu();
    tutupModal('modalTambah');
}

// ===== MODAL PILIH =====
function bukaModalPilih(mode) {
    pilihanMode = mode;
    pilihanIndex = null;
    const title = document.getElementById('modalPilihTitle');
    if (mode === 'edit') {
        title.innerHTML = '<i class="fas fa-pen"></i> Pilih Menu yang Diedit';
    } else {
        title.innerHTML = '<i class="fas fa-trash"></i> Pilih Menu yang Dihapus';
    }
    const list = document.getElementById('pilihanMenuList');
    const menu = muatMenu();
    list.innerHTML = '';
    menu.forEach((item, index) => {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.innerHTML = `<i class="fas ${item.ikon}"></i> ${item.nama}`;
        li.onclick = function() {
            document.querySelectorAll('#pilihanMenuList li').forEach(el => el.classList.remove('terpilih'));
            this.classList.add('terpilih');
            pilihanIndex = index;
            document.getElementById('btnLanjut').style.display = 'inline-flex';
        };
        list.appendChild(li);
    });
    document.getElementById('btnLanjut').style.display = 'none';
    document.getElementById('modalPilih').style.display = 'flex';
}

function lanjutPilih() {
    if (pilihanIndex === null) {
        alert('Silakan pilih salah satu menu terlebih dahulu.');
        return;
    }
    tutupModal('modalPilih');
    if (pilihanMode === 'edit') {
        bukaModalEdit(pilihanIndex);
    } else {
        konfirmasiHapus(pilihanIndex);
    }
}

// ===== MODAL EDIT =====
function bukaModalEdit(index) {
    const menu = muatMenu();
    const item = menu[index];
    document.getElementById('editNama').value = item.nama;
    document.getElementById('editUrl').value = item.url;
    editIkonTerpilih = item.ikon;
    generateIkonGrid('editIkonGrid', 'editIkonTerpilih');
    document.getElementById('modalEdit').style.display = 'flex';
    document.getElementById('modalEdit').dataset.index = index;
}

function simpanEdit() {
    const index = parseInt(document.getElementById('modalEdit').dataset.index);
    const nama = document.getElementById('editNama').value.trim();
    let url = document.getElementById('editUrl').value.trim();
    if (!nama) { alert('Nama menu tidak boleh kosong!'); return; }
    if (!url || url === '#') {
        url = generateSlug(nama) + '.html';
    }
    const menu = muatMenu();
    menu[index] = { nama, ikon: editIkonTerpilih, url };
    simpanMenu(menu);
    renderMenu();
    tutupModal('modalEdit');
}

// ===== HAPUS =====
function konfirmasiHapus(index) {
    if (confirm('Yakin ingin menghapus menu ini?')) {
        const menu = muatMenu();
        menu.splice(index, 1);
        simpanMenu(menu);
        renderMenu();
    }
}

// ===== GRID IKON =====
function generateIkonGrid(gridId, variabel) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';
    let current = (variabel === 'ikonTerpilih') ? ikonTerpilih : editIkonTerpilih;

    ikonList.forEach(ikon => {
        const div = document.createElement('div');
        div.className = 'ikon-item' + (ikon === current ? ' aktif' : '');
        div.innerHTML = `<i class="fas ${ikon}"></i>`;
        div.dataset.ikon = ikon;
        div.onclick = function() {
            grid.querySelectorAll('.ikon-item').forEach(el => el.classList.remove('aktif'));
            this.classList.add('aktif');
            if (variabel === 'ikonTerpilih') {
                ikonTerpilih = this.dataset.ikon;
            } else {
                editIkonTerpilih = this.dataset.ikon;
            }
        };
        grid.appendChild(div);
    });
}

// ===== TUTUP MODAL =====
function tutupModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
});

// ===== INISIALISASI =====
muatTema();
muatHideLabels();
renderMenu();