import { Link } from 'react-router-dom'

export default function BackgroundPage() {
  return (
    <div className="container container-narrow fade-in">
      <div className="page-header">
        <h1>Bakgrund</h1>
        <p>Hur detta initiativ kom till och varför informationen samlas.</p>
      </div>

      <section className="background-section">
        <h2>Om Rögleskogen</h2>
        <p>
          Rögleskogen ligger mellan Södra Sandby och Dalby i Lunds kommun. Området används av boende för promenader, rekreation och naturupplevelser. Skogen hyser enligt uppgifter från boende flera naturvärden och arter.
        </p>
        <p className="text-muted" style={{ marginTop: 'var(--space-3)' }}>
          Observera: Informationen på denna webbplats är exempeldata och ska inte tolkas som verifierade fakta utan särskild källhänvisning.
        </p>
      </section>

      <section className="background-section">
        <h2>Varför detta initiativ?</h2>
        <p>
          NCC har informerat om planer på att ansöka om tillstånd för en ny bergtäkt i området. Boende har frågor om hur verksamheten kan påverka natur, miljö, hälsa och livsmiljö. Detta initiativ samlar information, dokument, vittnesmål och frågor på ett ställe.
        </p>
      </section>

      <section className="background-section">
        <h2>Vad vi gör</h2>
        <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>Samlar och strukturerar offentlig information om planerna</li>
          <li>Samlar in vittnesmål och observationer från boende</li>
          <li>Sprider information till boende, journalister och beslutsfattare</li>
          <li>Sammanställer frågor och farhågor som väcks av planerna</li>
          <li>Uppmuntrar till saklig och respektfull dialog</li>
        </ul>
      </section>

      <section className="background-section">
        <h2>Viktiga principer</h2>
        <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>All information ska vara saklig och källhänvisad där det är relevant</li>
          <li>Personliga vittnesmål märks tydligt som sådana</li>
          <li>Vi gör inga juridiska eller miljövetenskapliga påståenden utan stöd i publicerade källor</li>
          <li>Initiativet är oberoende och drivs av boende</li>
        </ul>
      </section>

      <div className="cta-section" style={{ marginTop: 'var(--space-7)' }}>
        <h2>Läs mer</h2>
        <div className="cta-actions">
          <Link to="/amnen" className="btn btn-primary">Ämnesområden</Link>
          <Link to="/dokument" className="btn btn-secondary">Dokument</Link>
          <Link to="/tidslinje" className="btn btn-secondary">Tidslinje</Link>
        </div>
      </div>
    </div>
  )
}
