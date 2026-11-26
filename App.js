
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const BUSINESS = {
  name: 'XPERT Technik & Reparatur',
  owner: 'Ridvan Yeter',
  address: 'Am Schliepsteiner Tor 4',
  city: '32105 Bad Salzuflen',
  phone: '05222 7948209',
  email: 'ridixpert@gmail.com',
  whatsapp: '4915567885584',
};

const BLUE = '#1677F8';
const BG = '#070C17';
const CARD = '#142033';
const BORDER = '#293D59';
const WHITE = '#F2F6FF';
const MUTED = '#9AAAC0';

const htmlEscape = (value) =>
  String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

export default function App() {
  const [page, setPage] = useState('home');
  const [customerType, setCustomerType] = useState('Privatkunde');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [device, setDevice] = useState('');
  const [problem, setProblem] = useState('');
  const [date, setDate] = useState('');
  const [company, setCompany] = useState('');

  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [dataLossConfirmed, setDataLossConfirmed] = useState(false);
  const [damageConfirmed, setDamageConfirmed] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);

  const [busy, setBusy] = useState(false);

  const resetForm = () => {
    setName('');
    setPhone('');
    setDevice('');
    setProblem('');
    setDate('');
    setCompany('');
    setBackupConfirmed(false);
    setDataLossConfirmed(false);
    setDamageConfirmed(false);
    setPasswordConfirmed(false);
  };

  const validateForm = () => {
    if (!name.trim() || !phone.trim() || !device.trim() || !problem.trim()) {
      Alert.alert(
        'Angaben fehlen',
        'Bitte fülle Name, Telefonnummer, Gerät und Fehlerbeschreibung aus.'
      );
      return false;
    }

    if (
      !backupConfirmed ||
      !dataLossConfirmed ||
      !damageConfirmed ||
      !passwordConfirmed
    ) {
      Alert.alert(
        'Bestätigungen erforderlich',
        'Bitte lies alle vier Hinweise und bestätige jeden einzelnen Punkt.'
      );
      return false;
    }

    return true;
  };

  const getRequestText = () => {
    return [
      'Neue Reparaturanfrage – XPERT Technik & Reparatur',
      '',
      'Kundengruppe: ' + customerType,
      'Name: ' + name,
      'Firma: ' + (company || 'Nicht angegeben'),
      'Telefon: ' + phone,
      'Gerät / Modell: ' + device,
      'Fehlerbeschreibung: ' + problem,
      'Wunschtermin: ' + (date || 'Kein Wunschtermin angegeben'),
      '',
      'Bestätigungen:',
      'Datensicherung: Ja',
      'Risiko eines Datenverlusts: Zur Kenntnis genommen',
      'Vorhandene Schäden: Hinweis bestätigt',
      'Passwörter / Zugangsdaten: Hinweis bestätigt',
      '',
      'Die Anfrage wird vom Kunden selbst übermittelt.',
    ].join('\n');
  };

  const sendEmail = async () => {
    if (!validateForm()) return;

    const subject = encodeURIComponent('Reparaturanfrage – ' + name);
    const body = encodeURIComponent(getRequestText());
    const url = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Fehler', 'Die E-Mail-App konnte nicht geöffnet werden.');
    }
  };

  const sendWhatsApp = async () => {
    if (!validateForm()) return;

    const text = encodeURIComponent(getRequestText());
    const url = `https://wa.me/${BUSINESS.whatsapp}?text=${text}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Fehler', 'WhatsApp konnte nicht geöffnet werden.');
    }
  };

  const createRepairPdf = async () => {
    if (!validateForm()) return;

    setBusy(true);

    try {
      const html = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #172033;
              padding: 30px;
              font-size: 12px;
              line-height: 1.6;
            }
            h1 { color: #1268d8; font-size: 24px; }
            h2 {
              color: #1268d8;
              font-size: 15px;
              border-bottom: 1px solid #d5deeb;
              padding-bottom: 5px;
              margin-top: 22px;
            }
            .company { color: #52647c; }
            .field {
              padding: 7px 0;
              border-bottom: 1px solid #e5eaf1;
            }
            .label { font-weight: bold; }
            .notice {
              background: #f0f5fc;
              padding: 12px;
              margin-top: 10px;
            }
            .footer {
              margin-top: 35px;
              color: #65748a;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <h1>XPERT Technik & Reparatur</h1>
          <div class="company">
            ${htmlEscape(BUSINESS.address)} · ${htmlEscape(BUSINESS.city)}<br>
            Telefon: ${htmlEscape(BUSINESS.phone)}<br>
            E-Mail: ${htmlEscape(BUSINESS.email)}
          </div>

          <h2>Reparaturanfrage</h2>
          <div class="field"><span class="label">Kundengruppe:</span> ${htmlEscape(customerType)}</div>
          <div class="field"><span class="label">Name:</span> ${htmlEscape(name)}</div>
          <div class="field"><span class="label">Firma:</span> ${htmlEscape(company || 'Nicht angegeben')}</div>
          <div class="field"><span class="label">Telefon:</span> ${htmlEscape(phone)}</div>
          <div class="field"><span class="label">Gerät / Modell:</span> ${htmlEscape(device)}</div>
          <div class="field"><span class="label">Fehlerbeschreibung:</span><br>${htmlEscape(problem)}</div>
          <div class="field"><span class="label">Wunschtermin:</span> ${htmlEscape(date || 'Nicht angegeben')}</div>

          <h2>Bestätigte Hinweise</h2>
          <div class="notice">
            ✓ Hinweis zur Datensicherung gelesen und bestätigt.<br>
            ✓ Hinweis auf ein mögliches Datenverlustrisiko gelesen und bestätigt.<br>
            ✓ Hinweis zur Mitteilung bereits vorhandener Schäden bestätigt.<br>
            ✓ Hinweis zum Umgang mit Passwörtern und Zugangsdaten bestätigt.
          </div>

          <h2>Wichtige Informationen</h2>
          <p>
            Bitte sichere deine persönlichen Daten vor der Abgabe deines Geräts.
            Bei Diagnose und Reparatur kann ein Datenverlust nicht vollständig
            ausgeschlossen werden. Bei geplanten Maßnahmen, die Daten löschen
            können, soll dies nach Möglichkeit vorher mit dem Kunden besprochen werden.
          </p>
          <p>
            Bitte teile Passwörter oder Zugangsdaten nicht unaufgefordert mit.
            Falls ein Zugang für die Prüfung erforderlich ist, sollte eine
            sichere Vorgehensweise mit XPERT vereinbart werden.
          </p>
          <p>
            Bereits vorhandene Schäden sollen vor der Reparatur mitgeteilt werden.
            Die gesetzlichen Rechte und Haftungsregeln bleiben unberührt.
            Diese PDF ist eine Kopie der vom Kunden vorbereiteten Reparaturanfrage
            und keine pauschale Haftungsfreistellung.
          </p>

          <div class="footer">
            Erstellt am ${new Date().toLocaleDateString('de-DE')}<br>
            ${htmlEscape(BUSINESS.name)}
          </div>
        </body>
        </html>
      `;

      const result = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Reparaturanfrage als PDF teilen',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'PDF erstellt',
          'Die PDF wurde erstellt. Die Teilen-Funktion ist auf diesem Gerät nicht verfügbar.'
        );
      }
    } catch (error) {
      Alert.alert('PDF-Fehler', String(error.message || error));
    } finally {
      setBusy(false);
    }
  };

  const openWebsiteEmail = () => {
    Linking.openURL(`mailto:${BUSINESS.email}`);
  };

  const openBusinessWhatsApp = () => {
    Linking.openURL(`https://wa.me/${BUSINESS.whatsapp}`);
  };

  const Header = ({ title }) => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>XPERT Technik & Reparatur</Text>
    </View>
  );

  const ActionButton = ({ title, onPress, secondary = false }) => (
    <TouchableOpacity
      style={[styles.actionButton, secondary && styles.secondaryButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.actionButtonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Field = ({ label, value, onChangeText, placeholder, multiline = false, keyboardType }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8292A8"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );

  const CheckItem = ({ checked, onPress, children }) => (
    <TouchableOpacity
      style={styles.checkRow}
      onPress={() => onPress(!checked)}
      activeOpacity={0.75}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={styles.checkText}>{children}</Text>
    </TouchableOpacity>
  );

  const Home = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.owner}>Ridvan Yeter</Text>
        <Text style={styles.logo}>XPERT</Text>
        <Text style={styles.heroSubtitle}>TECHNIK & REPARATUR</Text>
        <Text style={styles.heroServices}>
          Smartphone · Tablet · PC · Konsole · Platinen · Elektronik
        </Text>
        <View style={styles.heroLine} />
        <Text style={styles.address}>{BUSINESS.address}</Text>
        <Text style={styles.address}>{BUSINESS.city}</Text>
        <Text style={styles.address}>{BUSINESS.phone}</Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => {
              setCustomerType('Privatkunde');
              setPage('repair');
            }}
          >
            <Text style={styles.heroButtonText}>♙ Privatkunden</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => {
              setCustomerType('Geschäftskunde (B2B)');
              setPage('repair');
            }}
          >
            <Text style={styles.heroButtonText}>▤ Geschäftskunden</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Unsere Leistungen</Text>
      {[
        '📱 Smartphone Reparatur',
        '💻 Laptop & PC Reparatur',
        '📲 Tablet Reparatur',
        '🔋 Akku Austausch',
        '🖥️ Display Reparatur',
        '🔌 Ladebuchsen Reparatur',
        '🔬 Mikrolöten und Platinenreparatur',
        '🎮 PS5 HDMI- und USB-Reparatur',
        '⚙️ Software und Diagnose',
      ].map((item) => (
        <View key={item} style={styles.serviceItem}>
          <Text style={styles.serviceText}>{item}</Text>
        </View>
      ))}

      <ActionButton title="Reparaturanfrage starten" onPress={() => setPage('repair')} />
      <ActionButton title="Kontakt aufnehmen" onPress={() => setPage('contact')} secondary />
    </ScrollView>
  );

  const Repair = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Header title="Reparaturanfrage" />

        <Text style={styles.description}>
          Ausgewählter Bereich: {customerType}
        </Text>
        <Text style={styles.description}>
          Beschreibe dein Gerät und das Problem. Wir melden uns bei dir.
        </Text>

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, customerType === 'Privatkunde' && styles.typeActive]}
            onPress={() => setCustomerType('Privatkunde')}
          >
            <Text style={styles.typeText}>Privatkunden</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, customerType !== 'Privatkunde' && styles.typeActive]}
            onPress={() => setCustomerType('Geschäftskunde (B2B)')}
          >
            <Text style={styles.typeText}>Geschäftskunden</Text>
          </TouchableOpacity>
        </View>

        {customerType !== 'Privatkunde' && (
          <Field
            label="Firmenname"
            value={company}
            onChangeText={setCompany}
            placeholder="Name deiner Firma"
          />
        )}

        <Field label="Name *" value={name} onChangeText={setName} placeholder="Vor- und Nachname" />
        <Field
          label="Telefonnummer *"
          value={phone}
          onChangeText={setPhone}
          placeholder="Deine Telefonnummer"
          keyboardType="phone-pad"
        />
        <Field
          label="Hersteller / Gerät / Modell *"
          value={device}
          onChangeText={setDevice}
          placeholder="z. B. Apple iPhone 15 Pro oder Samsung Galaxy S24 Ultra"
        />
        <Field
          label="Was ist defekt? *"
          value={problem}
          onChangeText={setProblem}
          placeholder="Beschreibe den Schaden..."
          multiline
        />
        <Field
          label="Wunschtermin"
          value={date}
          onChangeText={setDate}
          placeholder="z. B. 20.11.2026"
        />

        <Text style={styles.sectionTitle}>Wichtige Hinweise und Bestätigungen</Text>
        <Text style={styles.description}>
          Bitte lies die folgenden Hinweise sorgfältig. Alle vier Bestätigungen
          sind erforderlich, bevor du eine Anfrage versenden oder eine PDF erstellen kannst.
        </Text>

        <View style={styles.noticeBox}>
          <CheckItem checked={backupConfirmed} onPress={setBackupConfirmed}>
            Ich wurde darauf hingewiesen, vor der Reparatur eine Sicherung meiner
            persönlichen Daten anzulegen. Ich weiß, dass XPERT keine vollständige
            Datensicherung garantieren kann.
          </CheckItem>

          <CheckItem checked={dataLossConfirmed} onPress={setDataLossConfirmed}>
            Ich habe verstanden, dass bei Diagnose, Reparatur, Softwarearbeiten
            oder Zurücksetzen des Geräts Daten verloren gehen können. Maßnahmen,
            die Daten löschen können, sollen nach Möglichkeit vorher mit mir
            besprochen werden.
          </CheckItem>

          <CheckItem checked={damageConfirmed} onPress={setDamageConfirmed}>
            Ich bestätige, dass ich bereits vorhandene Schäden, beispielsweise
            Risse, Flüssigkeitsschäden oder frühere Reparaturversuche, mitteile.
          </CheckItem>

          <CheckItem checked={passwordConfirmed} onPress={setPasswordConfirmed}>
            Ich wurde darauf hingewiesen, Passwörter und Zugangsdaten nicht
            unaufgefordert weiterzugeben. Falls ein Zugang notwendig ist, soll
            eine sichere Vorgehensweise vereinbart werden.
          </CheckItem>
        </View>

        <Text style={styles.smallText}>
          Deine Angaben werden in eine vorbereitete Nachricht übernommen.
          Erst wenn du die Nachricht in deiner E-Mail- oder WhatsApp-App selbst
          absendest, werden sie übermittelt.
        </Text>

        <TouchableOpacity onPress={() => setPage('privacy')}>
          <Text style={styles.linkText}>Datenschutzerklärung lesen</Text>
        </TouchableOpacity>

        <ActionButton title="✉️ Anfrage per E-Mail" onPress={sendEmail} />
        <ActionButton title="💬 Anfrage über WhatsApp" onPress={sendWhatsApp} secondary />
        <ActionButton
          title={busy ? 'PDF wird erstellt ...' : '📄 Reparaturanfrage als PDF erstellen'}
          onPress={createRepairPdf}
          secondary
        />

        <Text style={styles.smallText}>
          Die PDF ist eine Kopie deiner Anfrage. Sie ist keine pauschale
          Haftungsfreistellung. Die gesetzlichen Rechte bleiben unberührt.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const Contact = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Header title="Kontakt" />
      <Text style={styles.contactTitle}>{BUSINESS.name}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Inhaber</Text>
        <Text style={styles.infoText}>{BUSINESS.owner}</Text>
        <Text style={styles.label}>Adresse</Text>
        <Text style={styles.infoText}>{BUSINESS.address}</Text>
        <Text style={styles.infoText}>{BUSINESS.city}</Text>
        <Text style={styles.label}>Telefon</Text>
        <Text style={styles.infoText}>{BUSINESS.phone}</Text>
        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.infoText}>{BUSINESS.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Öffnungszeiten</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Montag – Freitag: 10:00 – 18:00 Uhr</Text>
        <Text style={styles.infoText}>Samstag: 10:00 – 14:00 Uhr</Text>
        <Text style={styles.infoText}>Sonntag: Geschlossen</Text>
      </View>

      <ActionButton title="E-Mail schreiben" onPress={openWebsiteEmail} />
      <ActionButton title="WhatsApp öffnen" onPress={openBusinessWhatsApp} secondary />
      <ActionButton title="Reparaturanfrage" onPress={() => setPage('repair')} />
    </ScrollView>
  );

  const Impressum = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Header title="Impressum" />
      <View style={styles.infoBox}>
        <Text style={styles.contactTitle}>{BUSINESS.name}</Text>
        <Text style={styles.infoText}>Inhaber: {BUSINESS.owner}</Text>
        <Text style={styles.infoText}>{BUSINESS.address}</Text>
        <Text style={styles.infoText}>{BUSINESS.city}</Text>
        <Text style={styles.infoText}>Telefon: {BUSINESS.phone}</Text>
        <Text style={styles.infoText}>E-Mail: {BUSINESS.email}</Text>
      </View>
      <Text style={styles.description}>
        Bitte prüfe vor Veröffentlichung, ob alle gesetzlich erforderlichen
        Angaben für dein Unternehmen vollständig sind, insbesondere die
        zuständige Aufsichtsbehörde oder Registerangaben, falls diese für dich
        zutreffen.
      </Text>
    </ScrollView>
  );

  const Privacy = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Header title="Datenschutz" />
      <Text style={styles.sectionTitle}>Datenschutzhinweise</Text>
      <Text style={styles.description}>
        Diese App speichert Reparaturanfragen nicht auf einem eigenen Server.
        Die eingegebenen Angaben werden zunächst nur auf dem Gerät in eine
        vorbereitete E-Mail oder WhatsApp-Nachricht übernommen.
      </Text>
      <Text style={styles.description}>
        Eine Übermittlung erfolgt erst, wenn du die Nachricht in deiner
        E-Mail- oder WhatsApp-Anwendung selbst absendest. Dabei gelten auch
        die Datenschutzbestimmungen des jeweiligen Anbieters.
      </Text>
      <Text style={styles.description}>
        Wenn du eine PDF erstellst, wird sie lokal über die Druckfunktion
        deines Geräts erzeugt. Beim Teilen entscheidest du selbst, an welche
        App oder Person du die Datei weitergibst.
      </Text>
      <Text style={styles.description}>
        Kontakt für Datenschutzanfragen: {BUSINESS.email}
      </Text>
      <Text style={styles.description}>
        Bitte lasse diese Datenschutzhinweise vor der Veröffentlichung
        rechtlich prüfen und ergänze alle für dein Unternehmen erforderlichen
        Angaben.
      </Text>
    </ScrollView>
  );

  const pages = {
    home: Home,
    repair: Repair,
    contact: Contact,
    impressum: Impressum,
    privacy: Privacy,
  };

  const CurrentPage = pages[page] || Home;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />
      <View style={styles.app}>
        <View style={styles.topBar}>
          <Text style={styles.topBrand}>XPERT</Text>
          <TouchableOpacity
            style={styles.gearButton}
            onPress={() =>
              Alert.alert(
                'XPERT',
                'XPERT Technik & Reparatur\nKontakt: ' + BUSINESS.email
              )
            }
          >
            <Text style={styles.gearText}>⚙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          <CurrentPage />
        </View>

        <View style={styles.bottomNav}>
          {[
            ['home', '⌂', 'Start'],
            ['repair', '🔧', 'Reparatur'],
            ['contact', '☎️', 'Kontakt'],
            ['impressum', '§', 'Impressum'],
            ['privacy', '🛡️', 'Datenschutz'],
          ].map(([key, icon, label]) => (
            <TouchableOpacity
              key={key}
              style={styles.navItem}
              onPress={() => setPage(key)}
            >
              <Text style={[styles.navIcon, page === key && styles.navActive]}>
                {icon}
              </Text>
              <Text style={[styles.navLabel, page === key && styles.navActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  app: {
    flex: 1,
    backgroundColor: BG,
  },
  topBar: {
    minHeight: 48,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#17253A',
  },
  topBrand: {
    color: WHITE,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  gearButton: {
    backgroundColor: BLUE,
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearText: {
    color: '#FFFFFF',
    fontSize: 25,
  },
  main: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 35,
  },
  header: {
    marginBottom: 18,
  },
  headerTitle: {
    color: WHITE,
    fontSize: 29,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: MUTED,
    fontSize: 14,
    marginTop: 5,
  },
  hero: {
    backgroundColor: '#101D32',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  owner: {
    color: '#C5D7F2',
    fontSize: 16,
    fontWeight: '600',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 57,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 2,
  },
  heroSubtitle: {
    color: BLUE,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroServices: {
    color: '#C8D7ED',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 23,
  },
  heroLine: {
    height: 1,
    backgroundColor: BORDER,
    width: '100%',
    marginVertical: 18,
  },
  address: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 3,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 22,
    width: '100%',
  },
  heroButton: {
    backgroundColor: BLUE,
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 13,
  },
  sectionTitle: {
    color: WHITE,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 14,
  },
  serviceItem: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    borderRadius: 12,
    marginBottom: 9,
  },
  serviceText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#C1CEE0',
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 15,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  typeActive: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  typeText: {
    color: WHITE,
    fontWeight: '700',
    textAlign: 'center',
  },
  fieldWrap: {
    marginBottom: 17,
  },
  label: {
    color: '#D6E3F7',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 9,
  },
  input: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: WHITE,
    fontSize: 16,
    minHeight: 58,
  },
  multiline: {
    minHeight: 125,
    paddingTop: 15,
  },
  noticeBox: {
    backgroundColor: '#101B2C',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 14,
    marginBottom: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#26364C',
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#91A7C4',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  checkMark: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
  },
  checkText: {
    color: '#D6E3F7',
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  smallText: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 16,
  },
  linkText: {
    color: '#55A5FF',
    fontSize: 17,
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: BLUE,
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#1A2B43',
    borderWidth: 1,
    borderColor: '#345071',
  },
  secondaryButtonText: {
    color: '#E1ECFC',
  },
  contactTitle: {
    color: WHITE,
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 15,
    padding: 17,
    marginBottom: 18,
  },
  infoText: {
    color: '#D6E3F7',
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#101B2C',
    borderTopWidth: 1,
    borderTopColor: '#263A55',
    paddingTop: 9,
    paddingBottom: Platform.OS === 'ios' ? 7 : 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    color: '#A9B8CD',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 4,
  },
  navLabel: {
    color: '#A9B8CD',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  navActive: {
    color: BLUE,
  },
});
