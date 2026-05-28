export default function PharmacieAttente() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-slate-100 p-8 rounded-2xl max-w-md text-center shadow-sm space-y-6">
        
        {/* Icône d'horloge/attente simple */}
        <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        {/* Textes principaux */}
        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Compte en attente de validation
          </h1>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            Votre inscription a bien été reçue. Un administrateur examine actuellement vos documents officiels. 
            Vous recevrez un accès complet à votre tableau de bord dès confirmation.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Section Contact / Support */}
        <div className="space-y-3 text-left">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-4">
            Besoin d'aide ? Contactez le support
          </h2>

          <div className="space-y-2.5">
            {/* Téléphone */}
            <a 
              href="tel:+237698708986" 
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="=M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.145-.44.02-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.75Z" />
                </svg>
              </span>
              <span>+237 698 708 986</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:teffodonald240@gmail.com" 
              className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <span className="truncate">teffodonald240@gmail.com</span>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/237698708986" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100/50 hover:bg-emerald-100/50 transition-colors text-xs font-bold text-emerald-700"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.4.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.864.001-2.641-1.03-5.124-2.904-7c-1.873-1.877-4.361-2.911-7.01-2.912-5.442 0-9.863 4.414-9.866 9.866-.001 1.772.461 3.504 1.34 5.025l-.995 3.638 3.731-.975zm11.144-7.516c-.303-.151-1.793-.883-2.073-.985-.28-.102-.484-.151-.688.151-.204.302-.79.985-.969 1.186-.18.201-.359.227-.662.076-.303-.151-1.278-.47-2.434-1.497-.899-.802-1.506-1.792-1.682-2.094-.177-.302-.019-.465.133-.615.137-.135.303-.351.454-.528.152-.177.202-.302.303-.503.101-.201.051-.377-.025-.528-.076-.151-.688-1.66-.943-2.277-.248-.597-.501-.517-.688-.527l-.587-.011c-.204 0-.536.076-.816.377-.28.301-1.07 1.045-1.07 2.549 0 1.504 1.096 2.955 1.248 3.156.153.201 2.154 3.289 5.218 4.612.729.314 1.298.502 1.742.643.733.233 1.398.2 1.925.122.587-.088 1.793-.733 2.048-1.407.256-.674.256-1.253.18-1.378-.076-.124-.28-.201-.583-.352z"/>
                </svg>
              </span>
              <span>Discuter sur WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}