import React, { useState, useEffect } from 'react';
import styles from './SurveyForm.module.css';
import DownloadDashboard from './DownloadDashboard'; // Correctly import DownloadDashboard

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    kecamatan: '',
    lokasi: '',
    jenis_parkir: '',
    waktu_survei: '',
    surveyor: '',
    koordinat: '',
    jenis_jalan: '',
    zona_aktivitas: '',
    status_pengelolaan: '',
    rambu_marka: '',
    jenis_kendaraan_volume: '',
    jumlah_kendaraan_eksisting: 0,
    jumlah_kendaraan_masuk: 0,
    jumlah_kendaraan_keluar: 0,
    akumulasi_q_in_1: 0,
    akumulasi_q_out_1: 0,
    akumulasi_q_s_1: 0,
    durasi_jenis_kendaraan_1: '',
    durasi_waktu_masuk_1: '',
    durasi_waktu_keluar_1: '',
    kapasitas_jumlah_petak: 0,
    kapasitas_rata_rata_durasi: 0,
    pergantian_nt: 0,
    pergantian_lama_survei: 0,
    pergantian_jumlah_petak: 0,
    kebutuhan_total_kendaraan: 0,
    kebutuhan_rata_rata_durasi: 0,
    kebutuhan_waktu_operasi: 0,
    kebutuhan_faktor_puncak: 0.85,
    pad_jumlah_motor: 0,
    pad_tarif_motor: 0,
    pad_durasi_motor: 0,
    pad_jumlah_mobil: 0,
    pad_tarif_mobil: 0,
    pad_durasi_mobil: 0,
  });

  const [calculated, setCalculated] = useState({
    volume_parkir_hasil: 0,
    akumulasi_total_1: 0,
    durasi_jam_1: 0,
    rata_rata_durasi: 0,
    kapasitas_parkir_hasil: 0,
    indeks_akumulasi_1: 0,
    indeks_kapasitas_1: 0,
    indeks_ip_1: 0,
    indeks_parkir_puncak: 0,
    pergantian_tr_hasil: 0,
    kebutuhan_s_hasil: 0,
    pad_potensi_motor: 0,
    pad_potensi_mobil: 0,
    total_potensi_pad: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('survey'); // 'survey' or 'download'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchToDownload = () => {
    setCurrentView('download');
    setIsMenuOpen(false);
  };

  const switchToSurvey = () => {
    setCurrentView('survey');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const {
      jumlah_kendaraan_eksisting, jumlah_kendaraan_masuk, jumlah_kendaraan_keluar,
      akumulasi_q_in_1, akumulasi_q_out_1, akumulasi_q_s_1,
      durasi_waktu_masuk_1, durasi_waktu_keluar_1,
      kapasitas_jumlah_petak, kapasitas_rata_rata_durasi,
      pergantian_nt, pergantian_lama_survei, pergantian_jumlah_petak,
      kebutuhan_total_kendaraan, kebutuhan_rata_rata_durasi, kebutuhan_waktu_operasi, kebutuhan_faktor_puncak,
      pad_jumlah_motor, pad_tarif_motor, pad_durasi_motor,
      pad_jumlah_mobil, pad_tarif_mobil, pad_durasi_mobil,
    } = formData;

    // Volume
    const volume = parseFloat(jumlah_kendaraan_eksisting) + parseFloat(jumlah_kendaraan_masuk) - parseFloat(jumlah_kendaraan_keluar);

    // Akumulasi
    const akumulasi = parseFloat(akumulasi_q_in_1) - parseFloat(akumulasi_q_out_1) + parseFloat(akumulasi_q_s_1);

    // Durasi
    let durasi = 0;
    if (durasi_waktu_masuk_1 && durasi_waktu_keluar_1) {
      const waktuMasuk = new Date(`2000-01-01 ${durasi_waktu_masuk_1}`);
      const waktuKeluar = new Date(`2000-01-01 ${durasi_waktu_keluar_1}`);
      let durasiMenit = (waktuKeluar - waktuMasuk) / (1000 * 60);
      if (durasiMenit < 0) durasiMenit += 24 * 60;
      durasi = durasiMenit;
    }

    // Kapasitas
    let kapasitas = 0;
    if (parseFloat(kapasitas_rata_rata_durasi) > 0) {
      kapasitas = (parseFloat(kapasitas_jumlah_petak) * 8) / parseFloat(kapasitas_rata_rata_durasi);
    }

    // Indeks
    let indeks = 0;
    if (kapasitas > 0) {
      indeks = akumulasi / kapasitas;
    }

    // Turnover
    let turnover = 0;
    if (parseFloat(pergantian_lama_survei) > 0 && parseFloat(pergantian_jumlah_petak) > 0) {
      turnover = (parseFloat(pergantian_nt) * parseFloat(pergantian_lama_survei)) / parseFloat(pergantian_jumlah_petak);
    }

    // Kebutuhan
    let s = 0;
    if (parseFloat(kebutuhan_waktu_operasi) > 0 && parseFloat(kebutuhan_faktor_puncak) > 0) {
      s = (parseFloat(kebutuhan_total_kendaraan) * parseFloat(kebutuhan_rata_rata_durasi)) / (parseFloat(kebutuhan_waktu_operasi) * parseFloat(kebutuhan_faktor_puncak));
    }

    // PAD
    const motorPAD = parseFloat(pad_jumlah_motor) * parseFloat(pad_tarif_motor) * parseFloat(pad_durasi_motor);
    const mobilPAD = parseFloat(pad_jumlah_mobil) * parseFloat(pad_tarif_mobil) * parseFloat(pad_durasi_mobil);
    const totalPAD = motorPAD + mobilPAD;

    setCalculated({
      volume_parkir_hasil: volume,
      akumulasi_total_1: akumulasi,
      durasi_jam_1: durasi,
      rata_rata_durasi: durasi,
      kapasitas_parkir_hasil: kapasitas.toFixed(1),
      indeks_akumulasi_1: akumulasi,
      indeks_kapasitas_1: kapasitas.toFixed(1),
      indeks_ip_1: indeks.toFixed(2),
      indeks_parkir_puncak: indeks.toFixed(2),
      pergantian_tr_hasil: turnover.toFixed(1),
      kebutuhan_s_hasil: s.toFixed(0),
      pad_potensi_motor: motorPAD,
      pad_potensi_mobil: mobilPAD,
      total_potensi_pad: totalPAD,
    });

  }, [formData]);

  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, waktu_survei: localDateTime }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      ...calculated,
      submission_timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('https://bot.kediritechnopark.com/webhook/survey-parkir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        alert('✅ Data survei berhasil dikirim!');
        // Reset form state if needed
      } else {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        alert(`❌ Gagal mengirim data. Silakan coba lagi.\nError: ${response.status}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('❌ Terjadi kesalahan jaringan saat mengirim data.\nPastikan koneksi internet stabil dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Hamburger Menu */}
      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        {isMenuOpen && (
          <div className={styles.menuCard}>
            <div className={styles.menuCardBody}>
              <button
                className={`${styles.menuItem} ${currentView === 'survey' ? styles.activeMenuItem : ''}`}
                onClick={switchToSurvey}
              >
                <i className="fas fa-clipboard-list"></i>Form Survei
              </button>
              <button
                className={`${styles.menuItem} ${currentView === 'download' ? styles.activeMenuItem : ''}`}
                onClick={switchToDownload}
              >
                <i className="fas fa-download"></i>Download File
              </button>
            </div>
          </div>
        )}
      </div>

      {currentView === 'survey' ? (
        <>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <img src="/logo-pemkab-official.svg" alt="Logo Kabupaten Kediri" className={styles.logo} />
              <div className={styles.headerText}>
                <h1 className={styles.title}>FORM SURVEY LAPANGAN</h1>
                <p className={styles.subtitle}>Kajian Evaluasi dan Potensi Perparkiran Kendaraan Bermotor Kabupaten Kediri TAHAP 1</p>
              </div>
            </div>
          </header>

          <form className={styles.form} id="surveyForm" onSubmit={handleSubmit}>
            {/* Identitas Umum */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>Identitas Umum</h2>
                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <label htmlFor="kecamatan" className={styles.label}><i className="fas fa-map-marker-alt"></i>Kecamatan</label>
                      <select id="kecamatan" name="kecamatan" className={styles.select} required value={formData.kecamatan} onChange={handleChange}>
                        <option value="">-- Pilih Kecamatan --</option>
                        <option value="Ngasem">Ngasem</option>
                        <option value="Pare">Pare</option>
                        <option value="Kandangan">Kandangan</option>
                        <option value="Wates">Wates</option>
                      </select>
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="lokasi" className={styles.label}><i className="fas fa-road"></i>Nama Jalan/Titik Lokasi</label>
                      <input type="text" id="lokasi" name="lokasi" className={styles.input} required value={formData.lokasi} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="jenis_parkir" className={styles.label}><i className="fas fa-parking"></i>Jenis Parkir</label>
                      <select id="jenis_parkir" name="jenis_parkir" className={styles.select} required value={formData.jenis_parkir} onChange={handleChange}>
                        <option value="">-- Pilih Jenis Parkir --</option>
                        <option value="On-Street">On-Street</option>
                        <option value="Off-Street">Off-Street</option>
                      </select>
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="waktu_survei" className={styles.label}><i className="fas fa-calendar-alt"></i>Tanggal & Waktu Survei</label>
                      <input type="datetime-local" id="waktu_survei" name="waktu_survei" className={styles.input} required value={formData.waktu_survei} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="surveyor" className={styles.label}><i className="fas fa-user"></i>Nama Surveyor</label>
                      <input type="text" id="surveyor" name="surveyor" className={styles.input} required value={formData.surveyor} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="koordinat" className={styles.label}><i className="fas fa-map-pin"></i>Koordinat Lokasi</label>
                      <input type="text" id="koordinat" name="koordinat" className={styles.input} placeholder="Contoh: -7.123456, 112.123456" value={formData.koordinat} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Spasial */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>1. Analisis Spasial</h2>
                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <label htmlFor="jenis_jalan" className={styles.label}><i className="fas fa-traffic-light"></i>Jenis Jalan</label>
                      <select id="jenis_jalan" name="jenis_jalan" className={styles.select} required value={formData.jenis_jalan} onChange={handleChange}>
                        <option value="">-- Pilih Jenis Jalan --</option>
                        <option value="Kolektor">Kolektor</option>
                        <option value="Lokal">Lokal</option>
                        <option value="Arteri">Arteri</option>
                        <option value="Lingkungan">Lingkungan</option>
                      </select>
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="zona_aktivitas" className={styles.label}><i className="fas fa-store"></i>Jenis Zona Aktivitas</label>
                      <select id="zona_aktivitas" name="zona_aktivitas" className={styles.select} required value={formData.zona_aktivitas} onChange={handleChange}>
                        <option value="">-- Pilih Zona Aktivitas --</option>
                        <option value="Pasar">Pasar</option>
                        <option value="Perkantoran">Perkantoran</option>
                        <option value="Sekolah">Sekolah</option>
                        <option value="Campuran">Campuran</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div className={styles.col}>
                      <label htmlFor="status_pengelolaan" className={styles.label}><i className="fas fa-building-user"></i>Status Pengelolaan</label>
                      <select id="status_pengelolaan" name="status_pengelolaan" className={styles.select} required value={formData.status_pengelolaan} onChange={handleChange}>
                        <option value="">-- Pilih Status Pengelolaan --</option>
                        <option value="Resmi">Resmi</option>
                        <option value="Liar">Liar</option>
                        <option value="Paguyuban">Paguyuban</option>
                      </select>
                    </div>
                    <div className={styles.colFull}>
                      <label htmlFor="rambu_marka" className={styles.label}><i className="fas fa-sign"></i>Rambu & Marka (Observasi)</label>
                      <textarea id="rambu_marka" name="rambu_marka" className={styles.textarea} rows="3" placeholder="Deskripsi kondisi rambu dan marka di lokasi..." value={formData.rambu_marka} onChange={handleChange}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Volume Parkir */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>2. Analisis Volume Parkir</h2>
                <div className={styles.cardBody}>
                  <div className={styles.volumeRow}>
                    <div className={styles.volumeCol}>
                      <label htmlFor="jenis_kendaraan_volume" className={styles.label}><i className="fas fa-motorcycle"></i>Jenis Kendaraan</label>
                      <select id="jenis_kendaraan_volume" name="jenis_kendaraan_volume" className={styles.select} required value={formData.jenis_kendaraan_volume} onChange={handleChange}>
                        <option value="">-- Pilih --</option>
                        <option value="Sepeda Motor">Sepeda Motor</option>
                        <option value="Mobil">Mobil</option>
                      </select>
                    </div>
                    <div className={styles.volumeCol}>
                      <label htmlFor="jumlah_kendaraan_eksisting" className={styles.label}><i className="fas fa-car-side"></i>Kendaraan Eksisting</label>
                      <input type="number" id="jumlah_kendaraan_eksisting" name="jumlah_kendaraan_eksisting" className={styles.input} placeholder="Jumlah" min="0" value={formData.jumlah_kendaraan_eksisting} onChange={handleChange} />
                    </div>
                    <div className={styles.volumeCol}>
                      <label htmlFor="jumlah_kendaraan_masuk" className={styles.label}><i className="fas fa-arrow-alt-circle-down"></i>Kendaraan Masuk</label>
                      <input type="number" id="jumlah_kendaraan_masuk" name="jumlah_kendaraan_masuk" className={styles.input} placeholder="Jumlah" min="0" value={formData.jumlah_kendaraan_masuk} onChange={handleChange} />
                    </div>
                    <div className={styles.volumeCol}>
                      <label htmlFor="jumlah_kendaraan_keluar" className={styles.label}><i className="fas fa-arrow-alt-circle-up"></i>Kendaraan Keluar</label>
                      <input type="number" id="jumlah_kendaraan_keluar" name="jumlah_kendaraan_keluar" className={styles.input} placeholder="Jumlah" min="0" value={formData.jumlah_kendaraan_keluar} onChange={handleChange} />
                    </div>
                    <div className={styles.volumeColResult}>
                      <label className={styles.label}><i className="fas fa-calculator"></i>Volume Parkir (V)</label>
                      <input type="number" id="volume_parkir_hasil" name="volume_parkir_hasil" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.volume_parkir_hasil} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Akumulasi Parkir */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>3. Analisis Akumulasi Parkir</h2>
                <div className={styles.cardBody}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>Jam Ke-</th>
                          <th>Qin (Masuk)</th>
                          <th>Qout (Keluar)</th>
                          <th>Qs (Parkir)</th>
                          <th>Akumulasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={styles.tableCell}>1</td>
                          <td className={styles.tableCell}><input type="number" id="akumulasi_q_in_1" name="akumulasi_q_in_1" className={styles.tableInput} min="0" value={formData.akumulasi_q_in_1} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="akumulasi_q_out_1" name="akumulasi_q_out_1" className={styles.tableInput} min="0" value={formData.akumulasi_q_out_1} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="akumulasi_q_s_1" name="akumulasi_q_s_1" className={styles.tableInput} min="0" value={formData.akumulasi_q_s_1} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="akumulasi_total_1" name="akumulasi_total_1" className={`${styles.tableInput} ${styles.readOnly}`} readOnly value={calculated.akumulasi_total_1} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Durasi Parkir */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>4. Analisis Durasi Parkir</h2>
                <div className={styles.cardBody}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>No</th>
                          <th>Jenis Kendaraan</th>
                          <th>Waktu Masuk</th>
                          <th>Waktu Keluar</th>
                          <th>Durasi (menit)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={styles.tableCell}>1</td>
                          <td className={styles.tableCell}>
                            <select name="durasi_jenis_kendaraan_1" className={styles.tableSelect} value={formData.durasi_jenis_kendaraan_1} onChange={handleChange}>
                              <option value="">-- Pilih --</option>
                              <option value="Sepeda Motor">Sepeda Motor</option>
                              <option value="Mobil">Mobil</option>
                            </select>
                          </td>
                          <td className={styles.tableCell}><input type="time" id="durasi_waktu_masuk_1" name="durasi_waktu_masuk_1" className={styles.tableInput} value={formData.durasi_waktu_masuk_1} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="time" id="durasi_waktu_keluar_1" name="durasi_waktu_keluar_1" className={styles.tableInput} value={formData.durasi_waktu_keluar_1} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="durasi_jam_1" name="durasi_jam_1" className={`${styles.tableInput} ${styles.readOnly}`} readOnly value={calculated.durasi_jam_1} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.averageDuration}>
                    <label className={styles.label}>Rata-rata Durasi Parkir (D) (menit):</label>
                    <input type="number" id="rata_rata_durasi" name="rata_rata_durasi" className={`${styles.input} ${styles.readOnly} ${styles.averageInput}`} readOnly value={calculated.rata_rata_durasi} />
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Kapasitas, Indeks, Pergantian */}
            <div className={styles.section}>
              <div className={styles.threeCardRow}>
                <div className={styles.cardSmall}>
                  <h2 className={styles.cardHeaderSmall}>5. Kapasitas</h2>
                  <div className={styles.cardBody}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-th-large"></i>Jumlah Petak (S)</label>
                      <input type="number" id="kapasitas_jumlah_petak" name="kapasitas_jumlah_petak" className={styles.input} min="0" value={formData.kapasitas_jumlah_petak} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-clock"></i>Rata-rata Durasi (D) (jam)</label>
                      <input type="number" id="kapasitas_rata_rata_durasi" name="kapasitas_rata_rata_durasi" step="0.1" className={styles.input} min="0" value={formData.kapasitas_rata_rata_durasi} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-calculator"></i>Kapasitas (KP)</label>
                      <input type="number" id="kapasitas_parkir_hasil" name="kapasitas_parkir_hasil" step="0.1" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.kapasitas_parkir_hasil} />
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardSmall}>
                  <h2 className={styles.cardHeaderSmall}>6. Indeks</h2>
                  <div className={styles.cardBody}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-chart-pie"></i>Akumulasi</label>
                      <input type="number" id="indeks_akumulasi_1" name="indeks_akumulasi_1" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.indeks_akumulasi_1} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-battery-full"></i>Kapasitas</label>
                      <input type="number" id="indeks_kapasitas_1" name="indeks_kapasitas_1" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.indeks_kapasitas_1} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-percentage"></i>Indeks (IP)</label>
                      <input type="number" id="indeks_ip_1" name="indeks_ip_1" step="0.01" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.indeks_ip_1} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-chart-line"></i>IP Puncak</label>
                      <input type="number" id="indeks_parkir_puncak" name="indeks_parkir_puncak" step="0.01" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.indeks_parkir_puncak} />
                    </div>
                  </div>
                </div>
                <div className={styles.cardSmall}>
                  <h2 className={styles.cardHeaderSmall}>7. Pergantian</h2>
                  <div className={styles.cardBody}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-users"></i>Total Kendaraan (Nt)</label>
                      <input type="number" id="pergantian_nt" name="pergantian_nt" className={styles.input} min="0" value={formData.pergantian_nt} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-hourglass-half"></i>Lama Survei (Ts)</label>
                      <input type="number" id="pergantian_lama_survei" name="pergantian_lama_survei" className={styles.input} min="0" value={formData.pergantian_lama_survei} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-th-large"></i>Jumlah Petak (S)</label>
                      <input type="number" id="pergantian_jumlah_petak" name="pergantian_jumlah_petak" className={styles.input} min="0" value={formData.pergantian_jumlah_petak} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}><i className="fas fa-sync-alt"></i>Turnover (TR)</label>
                      <input type="number" id="pergantian_tr_hasil" name="pergantian_tr_hasil" step="0.1" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.pergantian_tr_hasil} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Kebutuhan Ruang Parkir */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>8. Analisis Kebutuhan Ruang Parkir</h2>
                <div className={styles.cardBody}>
                  <div className={styles.row}>
                    <div className={styles.col}>
                      <label className={styles.label}><i className="fas fa-users"></i>Total Kendaraan (Nt)</label>
                      <input type="number" id="kebutuhan_total_kendaraan" name="kebutuhan_total_kendaraan" className={styles.input} min="0" value={formData.kebutuhan_total_kendaraan} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label className={styles.label}><i className="fas fa-clock"></i>Durasi (D)</label>
                      <input type="number" id="kebutuhan_rata_rata_durasi" name="kebutuhan_rata_rata_durasi" step="0.1" className={styles.input} min="0" value={formData.kebutuhan_rata_rata_durasi} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label className={styles.label}><i className="fas fa-business-time"></i>Waktu Operasi (T)</label>
                      <input type="number" id="kebutuhan_waktu_operasi" name="kebutuhan_waktu_operasi" className={styles.input} min="0" value={formData.kebutuhan_waktu_operasi} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label className={styles.label}><i className="fas fa-wave-square"></i>Faktor Puncak (f)</label>
                      <input type="number" id="kebutuhan_faktor_puncak" name="kebutuhan_faktor_puncak" step="0.01" min="0.85" max="0.95" className={styles.input} value={formData.kebutuhan_faktor_puncak} onChange={handleChange} />
                    </div>
                    <div className={styles.col}>
                      <label className={styles.label}><i className="fas fa-ruler-combined"></i>S</label>
                      <input type="number" id="kebutuhan_s_hasil" name="kebutuhan_s_hasil" className={`${styles.input} ${styles.readOnly}`} readOnly value={calculated.kebutuhan_s_hasil} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analisis Potensi PAD */}
            <div className={styles.section}>
              <div className={styles.card}>
                <h2 className={styles.cardHeader}>9. Analisis Potensi PAD</h2>
                <div className={styles.cardBody}>
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead className={styles.tableHeader}>
                        <tr>
                          <th>Jenis Kendaraan</th>
                          <th>Jumlah</th>
                          <th>Tarif Retribusi (Rp)</th>
                          <th>Rata-rata Durasi (Jam)</th>
                          <th>Potensi PAD (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className={`${styles.tableCell} ${styles.fwSemibold}`}><i className="fas fa-motorcycle"></i>Sepeda Motor</td>
                          <td className={styles.tableCell}><input type="number" id="pad_jumlah_motor" name="pad_jumlah_motor" className={styles.tableInput} min="0" value={formData.pad_jumlah_motor} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_tarif_motor" name="pad_tarif_motor" className={styles.tableInput} placeholder="Contoh: 2000" min="0" value={formData.pad_tarif_motor} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_durasi_motor" name="pad_durasi_motor" step="0.1" className={styles.tableInput} placeholder="Contoh: 1.5" min="0" value={formData.pad_durasi_motor} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_potensi_motor" name="pad_potensi_motor" className={`${styles.tableInput} ${styles.readOnly}`} readOnly value={calculated.pad_potensi_motor} /></td>
                        </tr>
                        <tr>
                          <td className={`${styles.tableCell} ${styles.fwSemibold}`}><i className="fas fa-car"></i>Mobil</td>
                          <td className={styles.tableCell}><input type="number" id="pad_jumlah_mobil" name="pad_jumlah_mobil" className={styles.tableInput} min="0" value={formData.pad_jumlah_mobil} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_tarif_mobil" name="pad_tarif_mobil" className={styles.tableInput} placeholder="Contoh: 5000" min="0" value={formData.pad_tarif_mobil} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_durasi_mobil" name="pad_durasi_mobil" step="0.1" className={styles.tableInput} placeholder="Contoh: 2" min="0" value={formData.pad_durasi_mobil} onChange={handleChange} /></td>
                          <td className={styles.tableCell}><input type="number" id="pad_potensi_mobil" name="pad_potensi_mobil" className={`${styles.tableInput} ${styles.readOnly}`} readOnly value={calculated.pad_potensi_mobil} /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.totalPadContainer}>
                    <label className={`${styles.label} ${styles.fwBold} ${styles.fs5}`}>Total Potensi PAD (Rp):</label>
                    <input type="number" id="total_potensi_pad" name="total_potensi_pad" className={`${styles.input} ${styles.readOnly} ${styles.fwBold} ${styles.fs5} ${styles.totalPadInput}`} readOnly value={calculated.total_potensi_pad} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.submitButtonContainer}>
              <button type="submit" className={styles.btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><i className={`fas fa-spinner fa-spin ${styles.spinnerIcon}`}></i>Mengirim...</>
                ) : (
                  <><i className={`fas fa-paper-plane ${styles.sendIcon}`}></i>Kirim Survei</>
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <DownloadDashboard />
      )}
    </div>
  );
};

export default SurveyForm;
