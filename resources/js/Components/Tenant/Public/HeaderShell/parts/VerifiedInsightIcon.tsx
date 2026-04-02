/**
 * Insignia success (.svg).
 * Asset en: public/header-shell-all/insign_verified_Linkiu_Success.svg
 */
const VERIFIED_BADGE_SRC = '/header-shell-all/insign_verified_Linkiu_Success.svg';

export default function VerifiedInsightIcon() {
    return (
        <span className="inline-flex shrink-0" role="img" aria-label="Negocio verificado en Linkiu">
            <img src={VERIFIED_BADGE_SRC} alt="" width={16} height={16} className="size-4 object-contain" />
        </span>
    );
}
