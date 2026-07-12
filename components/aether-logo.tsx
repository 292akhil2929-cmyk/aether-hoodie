type AetherLogoProps = {
  className?: string
  wordmark?: boolean
}

export function AetherLogo({ className, wordmark = false }: AetherLogoProps) {
  return (
    <svg viewBox={wordmark ? '0 0 1180 240' : '0 0 240 240'} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ÆTHER" className={className}>
      <g>
        <path d="M120 18L207 68V172L120 222L33 172V68L120 18Z" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />
        <path d="M65 158L120 62L175 158" stroke="currentColor" strokeWidth="12" strokeLinecap="square" strokeLinejoin="round" />
        <path d="M88 118H175" stroke="currentColor" strokeWidth="12" strokeLinecap="square" />
        <path d="M75 158H188" stroke="currentColor" strokeWidth="12" strokeLinecap="square" />
        <circle cx="120" cy="118" r="9" fill="currentColor" />
      </g>
      {wordmark && <g fill="currentColor">
        <path d="M294 55H370V78H321V104H365V127H321V162H372V185H294V55Z" />
        <path d="M389 55H417V108H465V55H493V185H465V132H417V185H389V55Z" />
        <path d="M511 55H544L576 113L608 55H641L590 145V185H562V145L511 55Z" />
        <path d="M658 55H706C737 55 757 70 757 98C757 116 747 129 731 134L766 185H733L702 140H686V185H658V55ZM686 79V117H703C719 117 728 110 728 98C728 86 719 79 703 79H686Z" />
        <path d="M783 55H859V78H810V104H854V127H810V162H861V185H783V55Z" />
        <path d="M879 55H907V108H955V55H983V185H955V132H907V185H879V55Z" />
        <path d="M1001 55H1077V78H1028V104H1072V127H1028V162H1079V185H1001V55Z" />
      </g>}
    </svg>
  )
}
