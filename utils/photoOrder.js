const savePhotos = require('./savePhotos');

const MAX_PHOTOS = 5;

// photoOrder: JSON array, isinya URL foto lama (string) atau { new: i } untuk file baru ke-i di req.files.
// Hasilnya daftar URL foto sesuai urutan itu. Foto lama yang dikirim harus memang milik barang ini.
module.exports = async function resolvePhotoOrder(raw, current = [], files = [], save = savePhotos) {
  let order;
  try {
    order = JSON.parse(raw);
  } catch {
    throw new Error('Urutan foto tidak valid');
  }
  if (!Array.isArray(order) || order.length > MAX_PHOTOS) throw new Error('Urutan foto tidak valid');

  const usedOld = new Set();
  const usedNew = new Set();
  order.forEach((o) => {
    if (typeof o === 'string') {
      if (!current.includes(o) || usedOld.has(o)) throw new Error('Urutan foto tidak valid');
      usedOld.add(o);
    } else if (o && Number.isInteger(o.new) && o.new >= 0 && o.new < files.length && !usedNew.has(o.new)) {
      usedNew.add(o.new);
    } else {
      throw new Error('Urutan foto tidak valid');
    }
  });

  // hanya unggah file yang benar-benar dipakai
  const uploaded = {};
  const wanted = [...usedNew];
  const urls = await save(wanted.map((i) => files[i]));
  wanted.forEach((i, k) => { uploaded[i] = urls[k]; });

  return order.map((o) => (typeof o === 'string' ? o : uploaded[o.new]));
};
