
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

const BUSINESS = {
  name: 'Xpert Computer',
  owner: 'Ridvan Yeter',
  email: 'ridixpert@gmail.com',
  phone: '05222 7948209',
  whatsapp: '4915567885584',
  address: 'Am Schliepsteiner Tor 4, 32105 Bad Salzuflen',
  subtitle: 'Smartphone Tablet PC Reparatur'
};

const BLUE = '#1677FF';

export default function App() {
  const [page, setPage] = useState('home');
  const [name, setName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [device, setDevice] = useState('');
  const [problem, setProblem] = useState('');
  const [desiredDate, setDesiredDate] = useState('');

  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Fehler', 'Der Link konnte nicht geöffnet werden.');
    }
  };

  const validateForm = () => {
    if (
      !name.trim() ||
      !customerPhone.trim() ||
      !device.trim() ||
      !problem.trim()
    ) {
      Alert.alert(
        'Fehlende Angaben',
        'Bitte fülle alle Pflichtfelder aus.'
      );
      return false;
    }
    return true;
  };

  const createMessage = () =>
    `Hallo Xpert Computer!\n\n` +
    `Neue Reparaturanfrage:\n\n` +
    `Name: ${name}\n` +
    `Telefon: ${customerPhone}\n` +
    `Gerät: ${device}\n` +
    `Problem: ${problem}\n` +
    `Wunschtermin: ${desiredDate || 'Nicht angegeben'}`;

  const sendEmail = () => {
    if (!validateForm()) return;

    const subject = encodeURIComponent(
      'Neue Reparaturanfrage - Xpert Computer'
    );
    const body = encodeURIComponent(createMessage());

    openLink(
      `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`
    );
  };

  const sendWhatsApp = () => {
    if (!validateForm()) return;

    const message = encodeURIComponent(createMessage());

    openLink(
      `https://wa.me/${BUSINESS.whatsapp}?text=${message}`
    );
  };

  const Button = ({ title, onPress, secondary = false }) => (
    <TouchableOpacity
      style={[
        styles.button,
        secondary && styles.secondaryButton
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.buttonText,
          secondary && styles.secondaryButtonText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.logo}>
        XPERT<Text style={{ color: BLUE }}> COMPUTER</Text>
      </Text>
      <Text style={styles.tagline}>{BUSINESS.subtitle}</Text>
    </View>
  );

  const Section = ({ title, children }) => (
    <View style={styles.privacySection}>
      <Text style={styles.privacyHeading}>{title}</Text>
      <Text style={styles.bodyText}>{children}</Text>
    </View>
  );

  const Home = () => (
    <View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Dein Gerät. Unsere Expertise.
        </Text>
        <Text style={styles.heroText}>
          Professionelle Reparaturen für Smartphones,
          Tablets und Computer.
        </Text>
        <Button
          title="Jetzt Reparatur anfragen"
          onPress={() => setPage('repair')}
        />
      </View>

      <Text style={styles.sectionTitle}>Unsere Leistungen</Text>

      {[
        ['📱', 'Smartphone Reparatur', 'Display, Akku, Ladebuchse und mehr'],
        ['📲', 'Tablet Reparatur', 'Reparatur verschiedener Tablet-Modelle'],
        ['💻', 'PC & Laptop Reparatur', 'Hardware, Software und Fehlerdiagnose'],
        ['🔧', 'Lötarbeiten', 'Präzise Reparaturen auf Platinenebene']
      ].map((item, index) => (
        <View style={styles.service} key={index}>
          <Text style={styles.serviceIcon}>{item[0]}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceTitle}>{item[1]}</Text>
            <Text style={styles.serviceText}>{item[2]}</Text>
          </View>
        </View>
      ))}

      <View style={styles.infoBox}>
        <Text style={styles.sectionTitle}>
          Warum Xpert Computer?
        </Text>
        <Text style={styles.bodyText}>
          ✓ Persönlicher Kundenservice{"\n"}
          ✓ Professionelle Reparaturen{"\n"}
          ✓ Transparente Kommunikation{"\n"}
          ✓ Direkter WhatsApp-Kontakt{"\n"}
          ✓ Einfache Reparaturanfrage
        </Text>
      </View>

      <Button
        title="Kontakt aufnehmen"
        onPress={() => setPage('contact')}
      />
    </View>
  );

  const Repair = () => (
    <View>
      <Text style={styles.sectionTitle}>Reparaturanfrage</Text>
      <Text style={styles.bodyText}>
        Beschreibe dein Gerät und das Problem.
        Wir melden uns bei dir.
      </Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Vor- und Nachname"
        placeholderTextColor="#8292A8"
      />

      <Text style={styles.label}>Telefonnummer *</Text>
      <TextInput
        style={styles.input}
        value={customerPhone}
        onChangeText={setCustomerPhone}
        placeholder="Deine Telefonnummer"
        keyboardType="phone-pad"
        placeholderTextColor="#8292A8"
      />

      <Text style={styles.label}>Gerät / Modell *</Text>
      <TextInput
        style={styles.input}
        value={device}
        onChangeText={setDevice}
        placeholder="z. B. iPhone 15 Pro"
        placeholderTextColor="#8292A8"
      />

      <Text style={styles.label}>Was ist defekt? *</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={problem}
        onChangeText={setProblem}
        placeholder="Beschreibe den Schaden..."
        multiline
        textAlignVertical="top"
        placeholderTextColor="#8292A8"
      />

      <Text style={styles.label}>Wunschtermin</Text>
      <TextInput
        style={styles.input}
        value={desiredDate}
        onChangeText={setDesiredDate}
        placeholder="z. B. 20.11.2026"
        placeholderTextColor="#8292A8"
      />

      <Text style={styles.smallText}>
        Deine Angaben werden in eine vorbereitete Nachricht
        übernommen. Erst wenn du die Nachricht in deiner
        E-Mail- oder WhatsApp-App absendest, werden sie
        übermittelt.
      </Text>

      <TouchableOpacity onPress={() => setPage('privacy')}>
        <Text style={styles.linkText}>
          Datenschutzerklärung lesen
        </Text>
      </TouchableOpacity>

      <Button title="📧 Anfrage per E-Mail" onPress={sendEmail} />
      <Button
        title="💬 Anfrage über WhatsApp"
        onPress={sendWhatsApp}
        secondary
      />
    </View>
  );

  const Contact = () => (
    <View>
      <Text style={styles.sectionTitle}>Kontakt</Text>
      <Text style={styles.contactTitle}>{BUSINESS.name}</Text>
      <Text style={styles.bodyText}>{BUSINESS.subtitle}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Inhaber</Text>
        <Text style={styles.bodyText}>{BUSINESS.owner}</Text>

        <Text style={styles.label}>Adresse</Text>
        <Text style={styles.bodyText}>{BUSINESS.address}</Text>

        <Text style={styles.label}>Telefon</Text>
        <Text style={styles.bodyText}>{BUSINESS.phone}</Text>

        <Text style={styles.label}>WhatsApp</Text>
        <Text style={styles.bodyText}>+49 155 67885584</Text>

        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.bodyText}>{BUSINESS.email}</Text>
      </View>

      <Text style={styles.sectionTitle}>Öffnungszeiten</Text>
      <Text style={styles.bodyText}>
        Montag – Freitag: 10:00 – 18:00 Uhr{"\n"}
        Samstag: 10:00 – 14:00 Uhr{"\n"}
        Sonntag: Geschlossen
      </Text>

      <Button
        title="☎ Jetzt anrufen"
        onPress={() =>
          openLink(`tel:${BUSINESS.phone.replace(/\s/g, '')}`)
        }
      />

      <Button
        title="💬 WhatsApp öffnen"
        onPress={() =>
          openLink(`https://wa.me/${BUSINESS.whatsapp}`)
        }
        secondary
      />

      <Button
        title="📧 E-Mail schreiben"
        onPress={() => openLink(`mailto:${BUSINESS.email}`)}
        secondary
      />

      <Button
        title="📍 In Google Maps öffnen"
        onPress={() =>
          openLink(
            'https://www.google.com/maps/search/?api=1&query=' +
            encodeURIComponent(BUSINESS.address)
          )
        }
        secondary
      />
    </View>
  );

  const Legal = () => (
    <View>
      <Text style={styles.sectionTitle}>Impressum</Text>

      <Section title="Angaben gemäß § 5 DDG">
        {BUSINESS.name}{"\n"}
        Inhaber: {BUSINESS.owner}{"\n"}
        Einzelunternehmen{"\n"}
        {BUSINESS.address}
      </Section>

      <Section title="Kontakt">
        Telefon: {BUSINESS.phone}{"\n"}
        E-Mail: {BUSINESS.email}
      </Section>

      <Text style={styles.smallText}>
        Umsatzsteuer-Identifikationsnummer,
        Wirtschafts-Identifikationsnummer und
        Registerangaben sind hier nicht aufgeführt.
        Falls entsprechende Angaben für dein Unternehmen
        bestehen oder gesetzlich erforderlich sind,
        müssen sie ergänzt werden.
      </Text>

      <Text style={styles.smallText}>
        Bitte prüfe vor Veröffentlichung, ob alle
        gesetzlichen Angaben für dein Unternehmen
        vollständig sind.
      </Text>
    </View>
  );

  const Privacy = () => (
    <View>
      <Text style={styles.sectionTitle}>
        Datenschutzerklärung
      </Text>

      <Section title="1. Verantwortlicher">
        {BUSINESS.name}{"\n"}
        Inhaber: {BUSINESS.owner}{"\n"}
        {BUSINESS.address}{"\n"}
        E-Mail: {BUSINESS.email}{"\n"}
        Telefon: {BUSINESS.phone}
      </Section>

      <Section title="2. Funktionen der App">
        Diese App stellt Informationen zu unseren
        Reparaturleistungen bereit und ermöglicht
        die Kontaktaufnahme per E-Mail, WhatsApp
        und Telefon.

        Die Formulareingaben werden in dieser
        App-Version nicht an einen eigenen Server
        von Xpert Computer übertragen oder dort
        gespeichert. Sie bleiben während der Nutzung
        im Arbeitsspeicher der App.
      </Section>

      <Section title="3. Reparaturanfragen per E-Mail">
        Wenn du die E-Mail-Funktion auswählst,
        wird eine Nachricht mit deinen Angaben
        in deiner E-Mail-Anwendung vorbereitet.

        Erst wenn du die Nachricht selbst absendest,
        werden die Angaben über deinen E-Mail-Anbieter
        an Xpert Computer übermittelt.

        Die Verarbeitung erfolgt zur Bearbeitung
        deiner Anfrage und gegebenenfalls zur
        Durchführung vorvertraglicher Maßnahmen
        oder eines Vertrags gemäß Art. 6 Abs. 1
        lit. b DSGVO.
      </Section>

      <Section title="4. Kontakt über WhatsApp">
        Wenn du die WhatsApp-Funktion auswählst,
        wird eine Nachricht mit deinen Angaben
        vorbereitet.

        Du entscheidest selbst, ob du diese Nachricht
        absendest. Bei Versand werden die Daten
        durch WhatsApp verarbeitet und an
        Xpert Computer übermittelt.

        Es gelten zusätzlich die Datenschutzbestimmungen
        von WhatsApp. Bitte informiere dich dort
        über die Verarbeitung deiner Daten und
        mögliche Übermittlungen in Drittländer.
      </Section>

      <Section title="5. Telefon und Karten">
        Die Telefonfunktion öffnet die Telefon-App
        deines Geräts. Die Kartenfunktion öffnet
        Google Maps oder eine entsprechende
        Kartenanwendung.

        Bei der Nutzung dieser Dienste können
        personenbezogene Daten an die jeweiligen
        Anbieter übermittelt werden. Es gelten
        deren Datenschutzbestimmungen.
      </Section>

      <Section title="6. Speicherdauer">
        Xpert Computer speichert über diese
        App-Version keine Reparaturanfragen
        auf einem eigenen App-Server.

        Nachrichten, die du tatsächlich absendest,
        können in den E-Mail- und WhatsApp-Systemen
        sowie bei Xpert Computer gespeichert werden.

        Die Speicherdauer richtet sich nach dem
        jeweiligen Zweck und gesetzlichen
        Aufbewahrungspflichten.
      </Section>

      <Section title="7. Deine Datenschutzrechte">
        Du hast nach Maßgabe der DSGVO insbesondere
        das Recht auf Auskunft, Berichtigung,
        Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch,
        soweit die gesetzlichen Voraussetzungen
        erfüllt sind.

        Außerdem hast du das Recht, dich bei einer
        Datenschutzaufsichtsbehörde zu beschweren.
      </Section>

      <Section title="8. Datenschutzaufsichtsbehörde">
        Landesbeauftragte für Datenschutz und
        Informationsfreiheit Nordrhein-Westfalen{"\n"}
        Kavalleriestraße 2–4{"\n"}
        40213 Düsseldorf{"\n"}
        E-Mail: poststelle@ldi.nrw.de{"\n"}
        Internet: www.ldi.nrw.de
      </Section>

      <Section title="9. Änderungen">
        Diese Datenschutzerklärung muss angepasst
        werden, wenn sich die App-Funktionen,
        eingesetzten Dienste oder tatsächlichen
        Datenverarbeitungen ändern.
      </Section>

      <Text style={styles.smallText}>
        Hinweis: Diese Datenschutzerklärung ist
        ein Entwurf und keine anwaltliche Prüfung.
        Vor Veröffentlichung müssen insbesondere
        Expo, Apple, die tatsächlich eingesetzten
        Dienste und die betrieblichen Abläufe
        geprüft und gegebenenfalls ergänzt werden.
      </Text>
    </View>
  );

  const pages = {
  home: Home,
  repair: Repair,
  contact: Contact,
  legal: Legal,
  privacy: Privacy
};

  const navigation = [
    ['home', '⌂', 'Start'],
    ['repair', '🔧', 'Reparatur'],
    ['contact', '☎', 'Kontakt'],
    ['legal', '§', 'Impressum'],
    ['privacy', '🛡', 'Datenschutz']
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#080D18"
      />

      <Header />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 35 }}
          keyboardShouldPersistTaps="handled"
        >
          {pages[page]}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.nav}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navContent}
        >
          {navigation.map(([key, icon, label]) => (
            <TouchableOpacity
              key={key}
              style={styles.navItem}
              onPress={() => setPage(key)}
            >
              <Text
                style={[
                  styles.navIcon,
                  page === key && { color: BLUE }
                ]}
              >
                {icon}
              </Text>

              <Text
                style={[
                  styles.navText,
                  page === key && { color: BLUE }
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080D18'
  },

  header: {
    backgroundColor: '#080D18',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1B2A40'
  },

  logo: {
    color: 'white',
    fontSize: 23,
    fontWeight: '900'
  },

  tagline: {
    color: '#AAB8CC',
    fontSize: 12,
    marginTop: 5
  },

  content: {
    flex: 1,
    padding: 18
  },

  hero: {
    backgroundColor: '#142B49',
    borderRadius: 18,
    padding: 22,
    marginBottom: 25
  },

  heroTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },

  heroText: {
    color: '#D1DCEC',
    marginTop: 10,
    lineHeight: 23
  },

  sectionTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15
  },

  service: {
    backgroundColor: '#121D2E',
    borderRadius: 13,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },

  serviceIcon: {
    fontSize: 30,
    marginRight: 15
  },

  serviceTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },

  serviceText: {
    color: '#AAB8CC',
    marginTop: 4,
    fontSize: 12
  },

  button: {
    backgroundColor: BLUE,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 13
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },

  secondaryButton: {
    backgroundColor: '#1A2B42'
  },

  secondaryButtonText: {
    color: '#D6E6FF'
  },

  input: {
    backgroundColor: '#142033',
    color: 'white',
    borderRadius: 10,
    padding: 14,
    marginTop: 7,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#263A54'
  },

  multiline: {
    height: 110
  },

  label: {
    color: '#D6E6FF',
    fontWeight: 'bold',
    marginTop: 9
  },

  bodyText: {
    color: '#C4D0E0',
    lineHeight: 24,
    marginBottom: 12
  },

  infoBox: {
    backgroundColor: '#121D2E',
    padding: 16,
    borderRadius: 14,
    marginTop: 15,
    marginBottom: 15
  },

  contactTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },

  smallText: {
    color: '#93A4BA',
    fontSize: 11,
    marginTop: 12,
    lineHeight: 17
  },

  linkText: {
    color: '#55A5FF',
    textDecorationLine: 'underline',
    marginTop: 12
  },

  privacySection: {
    backgroundColor: '#121D2E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  privacyHeading: {
    color: '#55A5FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },

  nav: {
    backgroundColor: '#101A2A',
    borderTopWidth: 1,
    borderTopColor: '#263A54',
    paddingVertical: 9
  },

  navContent: {
    flexGrow: 1,
    justifyContent: 'space-around'
  },

  navItem: {
    alignItems: 'center',
    minWidth: 68,
    paddingHorizontal: 5
  },

  navIcon: {
    fontSize: 19,
    color: '#AAB8CC'
  },

  navText: {
    fontSize: 10,
    color: '#AAB8CC',
    marginTop: 4
  }
});
