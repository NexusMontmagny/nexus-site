document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("#config-form select, #config-form input");
  const summary = document.getElementById("result");
  const priceDisplay = document.getElementById("price");
  const btn = document.getElementById("whatsappBtn");
  const boxList = document.getElementById("boxList");

  const basePrice = 290;

  const costs = {
    ram: { "16": 0, "8": -15, "4": -25 },
    storage: { "256": 0, "512": 25, "1000": 40, "2000": 80, "1000hdd": -20 },
    cpu: {
      "Intel i5-4300M": 0,
      "Intel i7-4600M (jusqu'à 3,6 GHz, 4 Mo cache)": 25,
      "Intel i7-4800MQ (jusqu'à 3,7 GHz, 6 Mo cache)": 35,
      "Intel i7-4900MQ (jusqu'à 3,8 GHz, 8 Mo cache)": 45
    },
    screen: {
      "HD 1366×768 (déjà installé)": 0,
      "Full HD 1920×1080 (TN)": 30,
      "IPS 3K 2880×1620 (si disponible)": 60
    },
    keyboard: {
      "AZERTY classique": 0,
      "QWERTY US": 0,
      "Clavier rétroéclairé": 20
    },
    os: {
      "Windows": 0,
      "Ubuntu": 0,
      "Fedora": 0,
      "Debian": 0,
      "Dual Boot (Win + Linux)": 20,
      "Multi Boot (3 OS+)": 30
    }
  };

  elements.forEach(el => el.addEventListener("change", updateSummary));

  function updateSummary() {
    let total = basePrice;
    let lines = [];

    const ram = document.getElementById("ram").value;
    total += costs.ram[ram];
    lines.push(`RAM : ${ram} Go`);

    const storage = document.getElementById("storage").value;
    total += costs.storage[storage];
    lines.push(`Stockage principal : ${storage === "1000hdd" ? "HDD 1 To" : "SSD " + storage + " Go"}`);

const bay = document.getElementById("bay").value;
if (bay === "hdd") {
  lines.push("Baie optique : HDD secondaire via caddy – inclus");
} else if (bay === "dvd") {
  lines.push("Baie optique : Lecteur CD/DVD (option)");
  total += 25;
}

    const wwanValue = document.querySelector("input[name='wwan']:checked");
    if (wwanValue) {
      if (wwanValue.value === "wwanModule") {
        lines.push("Module WWAN 4G LTE");
        total += 40;
      } else if (wwanValue.value === "m2ssd") {
        lines.push("SSD M.2 SATA 2242");
        total += 45;
      }
    }

    const cpu = document.getElementById("cpu").value;
    total += costs.cpu[cpu] || 0;
    lines.push(`Processeur : ${cpu}`);

    const screen = document.getElementById("screen").value;
    total += costs.screen[screen] || 0;
    lines.push(`Écran : ${screen}`);

    const kb = document.getElementById("keyboard").value;
    total += costs.keyboard[kb] || 0;
    lines.push(`Clavier : ${kb}`);

    if (document.getElementById("nvidia").checked) {
      lines.push("Carte graphique NVIDIA dédiée");
      total += 100;
    }

    if (document.getElementById("trackpad").checked) {
      lines.push("Trackpad modifié (clics physiques)");
      total += 20;
    }

    if (document.getElementById("dock").checked) {
      lines.push("Dock Lenovo inclus");
      total += 25;
    }

    lines.push("Animation BIOS Nexus personnalisée – incluse");

    const os = document.getElementById("os").value;
    total += costs.os[os] || 0;
    lines.push(`Système d’exploitation : ${os}`);

    if (document.getElementById("office").checked && os.includes("Windows")) {
      lines.push("Licence Office activée");
      total += 25;
    }

    summary.textContent = lines.join("\n");
    priceDisplay.textContent = `Estimation : ${total} € TTC`;

    const boxItems = [
      "Notice d’utilisation Nexus",
      "Chargeur secteur Lenovo 90W",
      "Nettoyage complet + remise en boîte",
      "PC Nexus ThinkPad T540p préconfiguré selon vos choix"
    ];
    boxList.innerHTML = "";
    boxItems.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      boxList.appendChild(li);
    });

    const message = encodeURIComponent(
      `Bonjour, je souhaite commander ce Nexus ThinkPad T540p avec la configuration suivante :\n\n${lines.join("\n")}\n\nPrix estimatif : ${total} € TTC\nMerci de me confirmer la faisabilité.`
    );
    btn.href = `https://wa.me/33773636597?text=${message}`;
    btn.style.display = "inline-block";
    btn.dataset.qr = message;
  }

  updateSummary();

  document.getElementById("downloadPdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lines = document.getElementById("result").textContent;
  const price = document.getElementById("price").textContent;
  const clientName = document.getElementById("clientName").value.trim() || "Nom non précisé";
  const today = new Date().toLocaleDateString("fr-FR");
  const qrMessage = document.getElementById("whatsappBtn").dataset.qr;
  const refNum = "NX-TP-T540P-" + String(Math.floor(1000 + Math.random() * 9000));
doc.setFontSize(10);
doc.setTextColor(100);
doc.text(`Réf. configuration : ${refNum}`, 20, 15); // en haut à gauche


  const img = new Image();
  img.src = "images/logo-nexus.png";
 img.onload = () => {
  const targetWidth = 45;
  const ratio = img.naturalHeight / img.naturalWidth;
  const targetHeight = targetWidth * ratio;

  doc.addImage(img, "PNG", 140, 10, targetWidth, targetHeight);
    let y = 30;
    doc.setDrawColor(180);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Fiche de configuration", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text("Nexus ThinkPad T540p", 20, y);
    y += 5;
    y += 10;

    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Date : ${today}`, 20, y);
    y += 7;
    doc.text(`Client : ${clientName}`, 20, y);
    y += 10;

    lines.split("\n").forEach(line => {
      doc.text("• " + line, 20, y);
      y += 8;
    });

    y += 10;
    doc.setFontSize(12);
    doc.setFont("Helvetica", "bold");
    doc.text("Contenu de la boîte :", 20, y);
    y += 8;

    const boxItems = [
      "Notice d’utilisation Nexus",
      "Chargeur secteur Lenovo 90W",
      "Nettoyage complet + remise en boîte",
      "PC Nexus ThinkPad T540p préconfiguré selon vos choix"
    ];

    doc.setFont("Helvetica", "normal");
    boxItems.forEach(item => {
      doc.text("• " + item, 25, y);
      y += 7;
    });

    y += 10;
    doc.setFont("Helvetica", "bold");
    doc.text(price, 20, y);
    
// Boîte encadrée en bas du PDF
y += 15;
doc.setFillColor(240);
doc.rect(20, y, 170, 20, "F"); // hauteur réduite
doc.setDrawColor(200);
doc.rect(20, y, 170, 20);

doc.setFontSize(10);
doc.setTextColor(30);
doc.text("Contactez-nous :", 25, y + 7);
doc.text("contact.nexuspc1@gmail.com | WhatsApp : 07 73 63 65 97", 25, y + 14);
// Signature finale
y += 30;
const signature = "Merci de votre confiance – Atelier Nexus";
const pageWidth = doc.internal.pageSize.getWidth();
const textWidth = doc.getTextWidth(signature);
const xCentered = (pageWidth - textWidth) / 2;

doc.setFont("Helvetica", "italic");
doc.setFontSize(10);
doc.setTextColor(100);
doc.text(signature, xCentered, 295);


      // ✅ Tout est chargé : on peut enregistrer le PDF
        doc.save("Nexus_ThinkPad_T540p_Configuration.pdf");
    }; // fin du qrImg.onload
  })   // fin du img.onload
});    // fin du addEventListener "click"

