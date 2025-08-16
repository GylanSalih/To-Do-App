import React from 'react';

export const MainContent: React.FC = () => {
  return (
    <main className="container page">
      <section className="stack">
        <h1>H1 - Hauptüberschrift</h1>
        <h2>H2 - Unterüberschrift</h2>
        <h3>H3 - Sektionstitel</h3>
        <h4>H4 - Abschnittstitel</h4>
        <h5>H5 - Unterabschnitt</h5>
        <h6>H6 - Kleinste Überschrift</h6>

        <p>
          Lead Paragraph – Dies ist ein hervorgehobener Einführungstext mit
          größerer Schrift und mehr Gewicht.
        </p>

        <p>
          Normaler Paragraph – Dies ist ein normaler Textabschnitt mit der
          Standard-Schriftgröße und dem Standard-Zeilenabstand. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>

        <blockquote>
          „Dies ist ein Blockquote mit einem Zitat oder einer wichtigen Aussage.“
        </blockquote>

        <ul>
          <li>Ungeordnete Liste – Erster Punkt</li>
          <li>Ungeordnete Liste – Zweiter Punkt</li>
          <li>Ungeordnete Liste – Dritter Punkt</li>
        </ul>

        <ol>
          <li>Geordnete Liste – Erster Punkt</li>
          <li>Geordnete Liste – Zweiter Punkt</li>
          <li>Geordnete Liste – Dritter Punkt</li>
        </ol>

        <p>
          <strong>Fetter Text</strong> und <em>kursiver Text</em> für Hervorhebungen.
        </p>

        <p>
          <a href="#">Link-Beispiel</a>
        </p>

        <div className="row">
          <button className="btn">Primärer Button</button>
          <button className="btn-secondary">Sekundärer Button</button>
          <button className="btn-outline">Outline Button</button>
        </div>
      </section>

      <section className="stack">
        <h2>Medien</h2>
        <div className="row">
          <img src="/assets/img/logo.png" alt="Beispiel Bild" width={200} height={200} />
          <video controls width={320}>
            <source src="" type="video/mp4" />
            Dein Browser unterstützt das Video-Element nicht.
          </video>
        </div>
      </section>
    </main>
  );
};
