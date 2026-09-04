export default function SectionBackdrop({ variant = 'default' }) {
  const variants = {
    default: (
      <>
        <div className="section-bg-mesh" />
        <div className="section-bg-orb section-bg-orb--orange section-bg-orb--float" />
        <div className="section-bg-orb section-bg-orb--purple section-bg-orb--float-delay" />
        <div className="section-bg-dots" />
        <div className="section-bg-grid" />
        <div className="section-bg-gradient" />
        <div className="section-bg-noise" />
        <div className="section-bg-accent section-bg-accent--1" />
        <div className="section-bg-accent section-bg-accent--2" />
      </>
    ),
    warm: (
      <>
        <div className="section-bg-mesh section-bg-mesh--warm" />
        <div className="section-bg-orb section-bg-orb--orange section-bg-orb--lg section-bg-orb--float" />
        <div className="section-bg-orb section-bg-orb--amber section-bg-orb--float-delay" />
        <div className="section-bg-dots" />
        <div className="section-bg-grid" />
        <div className="section-bg-noise" />
        <div className="section-bg-accent section-bg-accent--1" />
      </>
    ),
    cool: (
      <>
        <div className="section-bg-mesh section-bg-mesh--cool" />
        <div className="section-bg-orb section-bg-orb--purple section-bg-orb--lg section-bg-orb--float" />
        <div className="section-bg-orb section-bg-orb--orange section-bg-orb--sm section-bg-orb--float-delay" />
        <div className="section-bg-dots" />
        <div className="section-bg-grid" />
        <div className="section-bg-noise" />
        <div className="section-bg-accent section-bg-accent--2" />
      </>
    ),
  };

  return (
    <div className="section-backdrop" aria-hidden="true">
      {variants[variant] || variants.default}
    </div>
  );
}
