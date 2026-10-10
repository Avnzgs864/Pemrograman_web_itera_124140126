const KUNCI_STORAGE = "miniPosKeranjang"; 
const MIN_NAMA = 3;                       
const MIN_HARGA = 500;                     
const MIN_QTY = 1;                         
const BATAS_DISKON = 50000;                
const PERSEN_DISKON = 0.10;                
const KODE_PROMO = "HEMAT10";              
let keranjang = [];                        


const formBarang   = document.getElementById("formBarang");   
const inputNama    = document.getElementById("namaBarang");   
const inputHarga   = document.getElementById("hargaBarang");  
const inputQty     = document.getElementById("qtyBarang");    
const errNama      = document.getElementById("errNama");      
const errHarga     = document.getElementById("errHarga");     
const errQty       = document.getElementById("errQty");       
const isiKeranjang = document.getElementById("isiKeranjang"); 
const elTotal      = document.getElementById("totalBelanja"); 
const inputPromo   = document.getElementById("kodePromo");    
const infoPromo    = document.getElementById("infoPromo");    
const elDiskon     = document.getElementById("nominalDiskon");
const elTotalAkhir = document.getElementById("totalAkhir");   
const inputBayar   = document.getElementById("uangBayar");    
const elKembalian  = document.getElementById("kembalian");    
const elStatus     = document.getElementById("statusBayar");  
const btnReset     = document.getElementById("btnReset");     

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",          
        currency: "IDR",            
        maximumFractionDigits: 0    
    }).format(angka);
}

function tampilError(input, elemenError, pesan) {
    elemenError.textContent = pesan; 
    input.classList.add("invalid");  
}

function bersihkanError() {
    [errNama, errHarga, errQty].forEach(function (el) { el.textContent = ""; });
    [inputNama, inputHarga, inputQty].forEach(function (el) { el.classList.remove("invalid"); });
}

function validasiForm() {
    bersihkanError();                        
    let valid = true;                        

    const nama = inputNama.value.trim();     
    const hargaTeks = inputHarga.value.trim();
    const qtyTeks = inputQty.value.trim();   
    const harga = Number(hargaTeks);         
    const qty = Number(qtyTeks);             

    if (nama === "") {
        tampilError(inputNama, errNama, "Nama barang wajib diisi.");
        valid = false;
    } else if (nama.length < MIN_NAMA) {
        tampilError(inputNama, errNama, "Nama barang minimal " + MIN_NAMA + " karakter.");
        valid = false;
    }

    if (hargaTeks === "" || isNaN(harga)) {
        tampilError(inputHarga, errHarga, "Harga wajib diisi dengan angka.");
        valid = false;
    } else if (harga < MIN_HARGA) {
        tampilError(inputHarga, errHarga, "Harga minimal Rp 500 (tidak boleh 0 atau negatif).");
        valid = false;
    }

    if (qtyTeks === "" || isNaN(qty)) {
        tampilError(inputQty, errQty, "Jumlah wajib diisi dengan angka.");
        valid = false;
    } else if (!Number.isInteger(qty)) {
        tampilError(inputQty, errQty, "Jumlah harus bilangan bulat.");
        valid = false;
    } else if (qty < MIN_QTY) {
        tampilError(inputQty, errQty, "Jumlah minimal 1.");
        valid = false;
    }

    return valid;
}

function simpanKeranjang() {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(keranjang));
}

function muatKeranjang() {
    const data = localStorage.getItem(KUNCI_STORAGE); 
    if (data) {
        try {
            keranjang = JSON.parse(data);             
        } catch (e) {
            keranjang = [];                           
        }
    }
}

function tambahBarang(nama, harga, qty) {
    keranjang.push({ nama: nama, harga: harga, qty: qty }); 
    simpanKeranjang();                                       
    render();                                                
}

function hapusBarang(indeks) {
    keranjang.splice(indeks, 1); 
    simpanKeranjang();           
    render();                    
}

function resetTransaksi() {
    if (keranjang.length > 0 && !confirm("Kosongkan keranjang dan mulai transaksi baru?")) {
        return;                                
    }
    keranjang = [];                            
    localStorage.removeItem(KUNCI_STORAGE);    
    inputPromo.value = "";                     
    inputBayar.value = "";                     
    render();                                  
}

function hitungTotal() {
    return keranjang.reduce(function (jumlah, item) {
        return jumlah + item.harga * item.qty; // tambahkan subtotal tiap item
    }, 0);
}

function hitungDiskon(total) {
    const kode = inputPromo.value.trim().toUpperCase(); 
    const pakaiKode = (kode === KODE_PROMO) && total > 0;   
    const diskonOtomatis = total >= BATAS_DISKON;           

    if (kode !== "" && kode !== KODE_PROMO) {
        infoPromo.textContent = "Kode promo tidak valid.";
        infoPromo.className = "hint";
        return 0;                                           
    }
    if (pakaiKode || diskonOtomatis) {
        infoPromo.textContent = pakaiKode
            ? "Kode HEMAT10 diterapkan: diskon 10%!"
            : "Diskon 10% otomatis diterapkan (total ≥ Rp 50.000).";
        infoPromo.className = "hint sukses";
        return total * PERSEN_DISKON;                       
    }
    infoPromo.textContent = "Diskon 10% otomatis jika total ≥ Rp 50.000";
    infoPromo.className = "hint";
    return 0;                                               
}

function hitungPembayaran(totalAkhir) {
    const teks = inputBayar.value.trim();
    elStatus.className = "status";          

    if (teks === "" || totalAkhir === 0) {  
        elKembalian.textContent = formatRupiah(0);
        elStatus.textContent = "";
        return;
    }
    const bayar = Number(teks);
    if (isNaN(bayar) || bayar < totalAkhir) {  
        elKembalian.textContent = formatRupiah(0);
        elStatus.textContent = "Uang belum mencukupi. Kurang " +
            formatRupiah(totalAkhir - (isNaN(bayar) ? 0 : bayar)) + ".";
        elStatus.classList.add("kurang");      
    } else {                                   
        elKembalian.textContent = formatRupiah(bayar - totalAkhir); 
        elStatus.textContent = "Pembayaran cukup. ✔";
        elStatus.classList.add("cukup");       
    }
}

function render() {
    isiKeranjang.innerHTML = "";               

    if (keranjang.length === 0) {              
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 6;                        
        td.className = "kosong";
        td.textContent = "Keranjang masih kosong.";
        tr.appendChild(td);
        isiKeranjang.appendChild(tr);
    }

    keranjang.forEach(function (item, indeks) {     
        const tr = document.createElement("tr");    
        const subtotal = item.harga * item.qty;     

        
        function buatSel(teks, kelas) {
            const td = document.createElement("td");
            td.textContent = teks;
            if (kelas) td.className = kelas;
            return td;
        }

        tr.appendChild(buatSel(indeks + 1));                 
        tr.appendChild(buatSel(item.nama));                  
        tr.appendChild(buatSel(formatRupiah(item.harga), "angka")); 
        tr.appendChild(buatSel(item.qty, "angka"));          
        tr.appendChild(buatSel(formatRupiah(subtotal), "angka"));  

        const tdAksi = document.createElement("td");         
        const btn = document.createElement("button");        
        btn.type = "button";
        btn.className = "btn btn-hapus";
        btn.textContent = "Hapus";
        btn.addEventListener("click", function () { hapusBarang(indeks); });
        tdAksi.appendChild(btn);
        tr.appendChild(tdAksi);

        isiKeranjang.appendChild(tr);                        
    });

    const total = hitungTotal();                 
    const diskon = hitungDiskon(total);          
    const totalAkhir = total - diskon;           

    elTotal.textContent = formatRupiah(total);   
    elDiskon.textContent = "- " + formatRupiah(diskon);
    elTotalAkhir.textContent = formatRupiah(totalAkhir);
    hitungPembayaran(totalAkhir);                       
}


formBarang.addEventListener("submit", function (e) {
    e.preventDefault();                 
    if (!validasiForm()) return;        

    tambahBarang(
        inputNama.value.trim(),         
        Number(inputHarga.value),       
        Number(inputQty.value)         
    );
    formBarang.reset();                 
    bersihkanError();                   
    inputNama.focus();                  
});

inputPromo.addEventListener("input", render);   
inputBayar.addEventListener("input", render);   
btnReset.addEventListener("click", resetTransaksi); 


muatKeranjang();  
render();         
