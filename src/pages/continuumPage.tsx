import { RecentTicks } from "../../continum-files/src/components/RecentTicks";
import { RecentTransactions } from "../../continum-files/src/components/RecentTransactions";
import { ChainStatus } from "../../continum-files/src/components/ChainStatus";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-muted/50 pb-8">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <h1 className="text-3xl sm:text-4xl tracking-tight">
          Fermi Continuum Explorer
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Real-time blockchain explorer for the Fermi continuum network
        </p>
      </div>

      <div className="container mx-auto px-4 sm:px-6 mb-8 max-w-7xl">
        {/* Main Content Container */}
        <div className="border">
          {/* Chain Status Section */}
          <div className="border-b bg-muted">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Chain Status
              </h2>
            </div>
            <div className="bg-white">
              <ChainStatus />
            </div>
          </div>

          {/* Recent Data Section */}
          <div className="border-t bg-muted">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Recent Activity
              </h2>
            </div>
            <div className="bg-white p-4 sm:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-4 lg:gap-6">
                <RecentTicks limit={10} />
                <RecentTransactions limit={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
