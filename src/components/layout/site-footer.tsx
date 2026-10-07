export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p>Barek — przeglądarka koktajli</p>
        <p>
          Dane:{" "}
          <a
            href="https://cocktails.solvro.pl"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Solvro Cocktails API
          </a>
        </p>
      </div>
    </footer>
  );
}
